"use client";

import { account } from "../appwrite.client";

const getLoginErrorMessage = (error: any) => {
  if (error?.code === 401) {
    return "Invalid email or password.";
  }

  if (error?.code === 429) {
    return "Too many login attempts. Please wait a moment and try again.";
  }

  return error?.message || "Unable to log in right now. Please try again.";
};

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    try {
      await account.deleteSession("current");
    } catch {
      // Ignore missing-session errors so login works for first-time visitors.
    }

    await account.createEmailPasswordSession(email, password);

    return await account.get();
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error(getLoginErrorMessage(error));
  }
}

export async function logoutUser() {
  try {
    await account.deleteSession("current");
  } catch (error: any) {
    if (error?.code === 401) {
      return;
    }

    console.error("Logout failed:", error);
    throw new Error("Unable to log out right now. Please try again.");
  }
}
