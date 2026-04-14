"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_ADMIN_CREDENTIALS } from "@/lib/utils/constants";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState(DEMO_ADMIN_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_ADMIN_CREDENTIALS.password);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (!response.ok) {
        const payload = await response.json();
        setError(payload.error ?? "Unable to sign in.");
        return;
      }

      router.push("/admin");
      router.refresh();
    });
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="space-y-3">
        <CardTitle className="text-3xl">Admin access</CardTitle>
        <CardDescription>
          Enter the mock operations console to manage platforms, provider health, and the audit trail.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-11"
                id="admin-email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@agegateproxy.com"
                value={email}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-11"
                id="admin-password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••••"
                type="password"
                value={password}
              />
            </div>
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <Button className="w-full" disabled={isPending} size="lg" type="submit">
            {isPending ? "Signing in…" : "Open admin dashboard"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
        <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-4 text-sm text-cyan-900">
          <div className="font-semibold">Demo credentials</div>
          <div className="mt-2 font-mono text-xs leading-6">
            {DEMO_ADMIN_CREDENTIALS.email}
            <br />
            {DEMO_ADMIN_CREDENTIALS.password}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
