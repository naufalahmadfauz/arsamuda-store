"use client";
import { redirect } from "next/dist/server/api-utils";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
export default function Socials() {
  return (
    <div>
      <Button
        onClick={() => signIn("google", { redirect: false, callbackUrl: "/" })}
      >
        Sign In With Google
      </Button>
      <Button
        onClick={() => signIn("github", { redirect: false, callbackUrl: "/" })}
      >
        Sign In With Github
      </Button>
    </div>
  );
}
