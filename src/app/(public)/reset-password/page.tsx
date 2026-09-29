import { ResetForm } from "./ResetForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reset password", robots: { index: false, follow: false } };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-mist/60">
      <ResetForm token={token} />
    </div>
  );
}
