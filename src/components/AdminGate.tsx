"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LockKeyhole, LogOut } from "lucide-react";
import { FormEvent, ReactNode, useState } from "react";

async function getSession() {
  const response = await fetch("/api/admin/session");
  if (!response.ok) throw new Error("Unable to check admin session");
  return (await response.json()) as { authenticated: boolean };
}

async function login(input: { email: string; password: string }) {
  const response = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "Invalid email or password");
  }

  return (await response.json()) as { authenticated: boolean };
}

async function logout() {
  const response = await fetch("/api/admin/logout", { method: "POST" });
  if (!response.ok) throw new Error("Unable to sign out");
  return (await response.json()) as { authenticated: boolean };
}

export function AdminGate({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const sessionQuery = useQuery({
    queryKey: ["admin-session"],
    queryFn: getSession,
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      setError("");
      queryClient.setQueryData(["admin-session"], { authenticated: true });
    },
    onError: (loginError: Error) => setError(loginError.message),
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.setQueryData(["admin-session"], { authenticated: false }),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    loginMutation.mutate({ email, password });
  }

  if (sessionQuery.isLoading) {
    return <div className="glass rounded-lg p-5 text-sm text-neutral-400">Checking admin access...</div>;
  }

  if (!sessionQuery.data?.authenticated) {
    return (
      <div className="mx-auto max-w-md">
        <form onSubmit={handleSubmit} className="glass rounded-lg p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-orange-500 text-black">
              <LockKeyhole className="size-5" />
            </span>
            <div>
              <h1 className="text-2xl font-black">Admin login</h1>
              <p className="text-sm text-neutral-400">Sign in to publish viral images.</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-neutral-300">Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                autoComplete="email"
                className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/30 px-3 text-sm outline-none transition focus:border-orange-400"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-neutral-300">Password</span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                autoComplete="current-password"
                className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/30 px-3 text-sm outline-none transition focus:border-orange-400"
              />
            </label>
            {error ? <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p> : null}
            <button
              disabled={loginMutation.isPending}
              className="h-11 w-full rounded-lg bg-orange-500 px-5 text-sm font-black text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => logoutMutation.mutate()}
          className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-neutral-200 transition hover:border-orange-400/60 hover:text-orange-300"
        >
          <LogOut className="mr-2 size-4" /> Sign out
        </button>
      </div>
      {children}
    </div>
  );
}

