"use client";

import { logout } from "@/lib/actions/auth-actions";

export function LogoutButton({ dest }: { dest: string }) {
  return (
    <button
      onClick={() => logout(dest)}
      className="text-xs font-bold text-white bg-green hover:bg-green-deep rounded-lg px-3 py-1.5 transition-colors"
    >
      Log out
    </button>
  );
}
