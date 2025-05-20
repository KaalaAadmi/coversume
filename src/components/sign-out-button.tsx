"use client";

import { signOut } from "@/lib/auth/auth-client";
import { LogOut, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
// import { Icons } from "../icons";

export default function SignOutButton() {
  const router = useRouter();
  const handleClick = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login"); // redirect to login page
        },
      },
    });
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center ml-3 justify-start gap-2 cursor-pointer w-full"
    >
      {/* <Icons.logOut /> */}
      <LogOut />
      Log out
    </div>
  );
}
