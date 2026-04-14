"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, Mail, User2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "login" | "register";

export function UserAuthPanel({
  nextPath,
  platformName
}: {
  nextPath: string;
  platformName?: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [loginForm, setLoginForm] = useState({
    email: "ava.patel@northmail.com",
    password: "DemoUser!23"
  });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    password: "DemoUser!23",
    age: "22"
  });

  function submit(endpoint: string, payload: Record<string, unknown>) {
    setError("");

    startTransition(async () => {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const body = await response.json();
        setError(body.error ?? "Unable to continue.");
        return;
      }

      router.push(nextPath);
      router.refresh();
    });
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "login" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600"}`}
            onClick={() => setMode("login")}
            type="button"
          >
            Sign in
          </button>
          <button
            className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "register" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600"}`}
            onClick={() => setMode("register")}
            type="button"
          >
            Create account
          </button>
        </div>
        <div>
          <CardTitle className="text-3xl">{mode === "login" ? "User sign in" : "Create an AgeGate account"}</CardTitle>
          <CardDescription className="mt-2">
            {platformName
              ? `${platformName} requested an age proof. Sign in with your AgeGate account to continue without sharing full identity details.`
              : "Continue to the AgeGate Proxy demo flow with a mock internal user account."}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {mode === "login" ? (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              submit("/api/auth/login", loginForm);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-11"
                  id="user-email"
                  onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                  value={loginForm.email}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-password">Password</Label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-11"
                  id="user-password"
                  onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                  type="password"
                  value={loginForm.password}
                />
              </div>
            </div>
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <Button className="w-full" disabled={isPending} size="lg" type="submit">
              Continue to age proof
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              submit("/api/auth/register", { ...registerForm, age: Number(registerForm.age) });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="register-name">Full name</Label>
              <div className="relative">
                <User2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-11"
                  id="register-name"
                  onChange={(event) => setRegisterForm((current) => ({ ...current, fullName: event.target.value }))}
                  placeholder="Ava Patel"
                  value={registerForm.fullName}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  onChange={(event) => setRegisterForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="you@example.com"
                  value={registerForm.email}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-age">Age</Label>
                <Input
                  id="register-age"
                  min={13}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, age: event.target.value }))}
                  type="number"
                  value={registerForm.age}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                onChange={(event) => setRegisterForm((current) => ({ ...current, password: event.target.value }))}
                type="password"
                value={registerForm.password}
              />
            </div>
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <Button className="w-full" disabled={isPending} size="lg" type="submit">
              Create account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        )}
        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-950">Demo account</div>
              <div className="mt-1 text-sm text-slate-500">Use the seeded user to walk through the full NightWave example.</div>
            </div>
            <Badge variant="info">AGP-1042</Badge>
          </div>
          <div className="mt-3 font-mono text-xs leading-6 text-slate-600">
            ava.patel@northmail.com
            <br />
            DemoUser!23
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
