"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Account, Client } from "appwrite";

type RecoveryStatus = "idle" | "success" | "error";

export default function RecoveryPage() {
  return (
    <Suspense fallback={<RecoveryView status="idle" message="Preparing password reset..." />}>
      <RecoveryContent />
    </Suspense>
  );
}

function RecoveryContent() {
  const searchParams = useSearchParams();

  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "https://cloud.appwrite.io/v1";
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

  const userId = useMemo(() => searchParams.get("userId"), [searchParams]);
  const secret = useMemo(() => searchParams.get("secret"), [searchParams]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<RecoveryStatus>("idle");
  const [message, setMessage] = useState("Enter your new password.");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!projectId) {
      setStatus("error");
      setMessage("Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID.");
      return;
    }

    if (!userId || !secret) {
      setStatus("error");
      setMessage("Missing recovery parameters in the URL.");
      return;
    }

    if (password.length < 8) {
      setStatus("error");
      setMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    setMessage("Updating your password...");

    try {
      const client = new Client().setEndpoint(endpoint).setProject(projectId);
      const account = new Account(client);

      await account.updateRecovery({
        userId,
        secret,
        password,
      });

      setStatus("success");
      setMessage("Your password has been updated. You can now sign in.");
      setPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      setStatus("error");
      const fallback = "Unable to reset password. Please try the recovery link again.";
      setMessage(error instanceof Error && error.message ? error.message : fallback);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RecoveryView status={status} message={message}>
      <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          New password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-base text-zinc-900 outline-none ring-0 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Confirm new password
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength={8}
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-base text-zinc-900 outline-none ring-0 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-black"
        >
          {isSubmitting ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </RecoveryView>
  );
}

function RecoveryView({
  status,
  message,
  children,
}: {
  status: RecoveryStatus;
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-8 py-20 px-6 bg-white dark:bg-black sm:px-16 sm:items-start">
        <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            {status === "success" ? "Password updated" : "Reset your password"}
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">{message}</p>
        </div>
        {status !== "success" ? children : null}
      </main>
    </div>
  );
}
