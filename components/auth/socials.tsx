"use client";
import { redirect } from "next/dist/server/api-utils";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
export default function Socials() {
  return (
    <div className="flex flex-col items-center w-full gap-4">
      <Button
        variant={"outline"}
        className="flex gap-4 w-full"
        onClick={() => signIn("google", { redirect: false, callbackUrl: "/" })}
      >
        <p> Sign In With Google </p>
        <FcGoogle className="w-5 h-5" />
      </Button>
      <Button
        variant={"outline"}
        className="flex gap-4 w-full"
        onClick={() => signIn("github", { redirect: false, callbackUrl: "/" })}
      >
        <p> Sign In With Github </p>
        <FaGithub className="w-5 h-5" />
      </Button>
    </div>
  );
}
