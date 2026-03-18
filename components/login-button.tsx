"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail } from "lucide-react";

export function LoginButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <Link
        href="/api/auth/login"
        className="inline-flex items-center justify-center rounded-md bg-[#1db954] px-6 py-2.5 text-sm font-medium text-black lowercase transition-colors hover:bg-[#1ed760]"
      >
        sign in with spotify
      </Link>
      <span className="relative inline-block">
        <button
          onClick={() => setOpen(!open)}
          className="underline decoration-dotted underline-offset-4 cursor-pointer hover:decoration-solid transition-all text-xs text-muted-foreground lowercase"
        >
          can&apos;t log in?
        </button>
        {open && (
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 z-50 w-72 rounded-lg border bg-card p-4 shadow-lg text-left">
            <p className="text-xs text-muted-foreground leading-relaxed">
              due to spotify api restrictions, new users must be manually added before they can log in. please reach out to me to get access.
            </p>
            <a
              href="mailto:pierceluu10@gmail.com"
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-foreground hover:underline"
            >
              <Mail className="h-3 w-3" />
              pierceluu10@gmail.com
            </a>
          </div>
        )}
      </span>
    </div>
  );
}
