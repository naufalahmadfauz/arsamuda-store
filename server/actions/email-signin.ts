"use server";
import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";

const action = createSafeActionClient();
export const emailSignIn = action(
  LoginSchema,
  async ({ email, password, code }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    console.log(email, password, code);
    if (existingUser?.email !== email) {
      return { error: "User not found" };
    }

    return { success: email };
  }
);
