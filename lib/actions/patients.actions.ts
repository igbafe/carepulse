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

const getCreateUserErrorMessage = (error: any) => {
  const message =
    typeof error?.message === "string" ? error.message.toLowerCase() : "";

  if (
    error?.code === 409 ||
    error?.type === "user_already_exists" ||
    message.includes("already exists")
  ) {
    return "An account with this email or phone already exists. Please log in instead.";
  }

  return error?.message || "We couldn't create your account. Please try again.";
};

type CreateUserResult =
  | { success: true; user: User }
  | { success: false; error: string };

// Function to create a user
export const createUser = async (
  user: CreateUserParams
): Promise<CreateUserResult> => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      user.password,
      user.name
    );

    return { success: true, user: parseStringify(newUser) as User };
  } catch (error: any) {
    console.error("Error creating user:", error);
    return { success: false, error: getCreateUserErrorMessage(error) };
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

    const patient = patients?.documents[0];

    return patient ? parseStringify(patient) : null;
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
