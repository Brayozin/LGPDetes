"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, Mail, User2 } from "lucide-react";

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
    email: "joao.silva@northmail.com",
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
        setError(body.error ?? "Não foi possível continuar.");
        return;
      }

      window.location.assign(nextPath);
    });
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="space-y-3">
        <div className="inline-flex w-fit rounded-md border bg-slate-50 p-1">
          <button
            className={`rounded-sm px-3 py-1.5 text-sm font-medium transition-colors ${mode === "login" ? "bg-white text-slate-950" : "text-slate-600"}`}
            onClick={() => setMode("login")}
            type="button"
          >
            Entrar
          </button>
          <button
            className={`rounded-sm px-3 py-1.5 text-sm font-medium transition-colors ${mode === "register" ? "bg-white text-slate-950" : "text-slate-600"}`}
            onClick={() => setMode("register")}
            type="button"
          >
            Criar conta
          </button>
        </div>
        <div>
          <CardTitle className="text-xl">{mode === "login" ? "Acesso do usuário" : "Criar conta"}</CardTitle>
          <CardDescription className="mt-2">
            {platformName
              ? `${platformName} solicitou uma checagem de idade. Entre para continuar.`
              : "Use uma conta LGPDetes Proxy de demonstração para seguir."}
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
              <Label htmlFor="user-email">E-mail</Label>
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
              <Label htmlFor="user-password">Senha</Label>
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
            <Button className="w-full" disabled={isPending} type="submit">
              Continuar
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
              <Label htmlFor="register-name">Nome completo</Label>
              <div className="relative">
                <User2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-11"
                  id="register-name"
                  onChange={(event) => setRegisterForm((current) => ({ ...current, fullName: event.target.value }))}
                  placeholder="João Silva"
                  value={registerForm.fullName}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="register-email">E-mail</Label>
                <Input
                  id="register-email"
                  onChange={(event) => setRegisterForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="voce@exemplo.com"
                  value={registerForm.email}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-age">Idade</Label>
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
              <Label htmlFor="register-password">Senha</Label>
              <Input
                id="register-password"
                onChange={(event) => setRegisterForm((current) => ({ ...current, password: event.target.value }))}
                type="password"
                value={registerForm.password}
              />
            </div>
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <Button className="w-full" disabled={isPending} type="submit">
              Criar conta
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        )}
        <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-medium text-slate-950">Conta demo</div>
          <div className="mt-1 text-sm text-slate-500">Use este acesso para testar o fluxo completo.</div>
          <div className="mt-3 font-mono text-xs leading-6 text-slate-600">
            joao.silva@northmail.com
            <br />
            DemoUser!23
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
