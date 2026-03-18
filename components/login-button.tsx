"use client";

import Link from "next/link";

export function LoginButton() {
  return (
    <Link
      href="/api/auth/login"
      className="inline-flex items-center justify-center rounded-md bg-[#1db954] px-6 py-2.5 text-sm font-medium text-black lowercase transition-colors hover:bg-[#1ed760]"
    >
      sign in with spotify
    </Link>
  );
}
