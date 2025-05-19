"use client";
import React from "react";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function Header() {
  const path = usePathname();
  const { isSignedIn } = useUser();

  return (
    <div className="flex p-4 items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md">
      <Image src="/logo.svg" width={50} height={50} alt="logo" />
      <ul className="flex gap-8">
        {[
          { name: "Dashboard", route: "/dashboard" },
          { name: "Questions", route: "/dashboard/questions" },
        ].map((item) => (
          <li
            key={item.route}
            className={`cursor-pointer transition-colors text-white font-medium hover:text-amber-200 ${
              path === item.route && "text-amber-200 font-bold"
            }`}
          >
            <Link href={item.route}>{item.name}</Link>
          </li>
        ))}
      </ul>

      {isSignedIn ? (
        <UserButton />
      ) : (
        <SignInButton>
          {/* SignInButton will automatically redirect after sign-in */}
          <Button className="bg-white text-indigo-600 px-4 py-2 rounded font-semibold hover:bg-gray-100 transition">
            Login
          </Button>
        </SignInButton>
      )}
    </div>
  );
}

export default Header;
