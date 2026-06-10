"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Account, Client } from "appwrite";

type VerificationStatus = "idle" | "success" | "error" | "already-verified";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerificationView status="idle" message="Verifying your email..." />}>
      <VerificationContent />
    </Suspense>
  );
}

function VerificationContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>("idle");
  const [message, setMessage] = useState("Verifying your email...");

  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "https://cloud.appwrite.io/v1";
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

  const userId = useMemo(() => searchParams.get("userId"), [searchParams]);
  const secret = useMemo(() => searchParams.get("secret"), [searchParams]);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!projectId) {
        setStatus("error");
        setMessage("Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID.");
        return;
      }

      if (!userId || !secret) {
        setStatus("error");
        setMessage("Missing verification parameters in the URL.");
        return;
      }

      try {
        const client = new Client().setEndpoint(endpoint).setProject(projectId);
        const account = new Account(client);
        await account.updateVerification(userId, secret);

        setStatus("success");
        setMessage(`You can now start using AurAchieve. Have fun!`);
      } catch (error: unknown) {
        // Check if it's an Appwrite error with a code property
        if (error && typeof error === "object" && "code" in error) {
          const appwriteError = error as { code?: number; message?: string };
          
          if (appwriteError.code === 409) {
            setStatus("already-verified");
            setMessage("Your email is already verified. You can start using AurAchieve!");
            return;
          }
        }
        
        setStatus("error");
        setMessage("Verification failed. Please try the link again.");
      }
    };

    verifyEmail();
  }, [endpoint, projectId, secret, userId]);

  return <VerificationView status={status} message={message} />;
}

function VerificationView({ status, message }: { status: VerificationStatus; message: string }) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            {status === "success" || status === "already-verified" ? "Your email has been verified." : "Email verification"}
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">{message}</p>
        </div>
      </main>
    </div>
  );
}
