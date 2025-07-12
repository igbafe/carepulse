"use server";

import { ID, Query } from "node-appwrite";
import {
  BUCKET_ID,
  DATABASE_ID,
  databases,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file";

// Function to create a user
export const createUser = async (user: CreateUserParams) => {
  try {
    // Attempt to create the user
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    // Log the newly created user object
    console.log("New User Created:", newUser);

    // Return the new user data after parsing
    return parseStringify(newUser);
  } catch (error: any) {
    // Log the error with additional details
    console.error("Error creating user:", error);

    // If it's a conflict error (user already exists), retrieve the existing user
    if (error?.code === 409) {
      try {
        const documents = await users.list([Query.equal("email", [user.email])]);
        console.log("Existing User Found:", documents?.users[0]);

        return documents?.users[0]; // Return the existing user if found
      } catch (listError) {
        console.error("Error fetching existing user:", listError);
        throw new Error("Failed to fetch existing user after conflict");
      }
    }

    // Throw a generic error if the user creation fails for any other reason
    throw new Error("Failed to create user");
  }
};

// Function to retrieve user data by user ID
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Failed to fetch user");
  }
};

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );
    return parseStringify(patients?.documents[0]);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Failed to fetch user");
  }
};

// Function to register a patient, including file upload for documents
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;

    if (identificationDocument) {
      // Process and upload the file if provided
      const inputFile = InputFile.fromBuffer(
        identificationDocument?.get("blobFile") as Blob,
        identificationDocument?.get("fileName") as string
      );

      // Upload the file and store it
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    // Create the patient document in the database
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view/?project=${PROJECT_ID}`,
        ...patient,
      }
    );

    // Return the new patient data after parsing
    return parseStringify(newPatient);
  } catch (error) {
    console.error("Error registering patient:", error);
    throw new Error("Failed to register patient");
  }
};
