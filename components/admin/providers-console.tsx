"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { Plus } from "lucide-react";

import { ProviderMark } from "@/components/providers/provider-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import type { Provider } from "@/lib/types";
import { formatDateTime } from "@/lib/utils/format";

export function ProvidersConsole({ initialProviders }: { initialProviders: Provider[] }) {
  const [providers, setProviders] = useState(initialProviders);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: `${formData.get("name") ?? ""}`,
      key: `${formData.get("key") ?? ""}`,
      type: `${formData.get("type") ?? ""}`,
      status: `${formData.get("status") ?? ""}`,
      domainHint: `${formData.get("domainHint") ?? ""}`,
      scopes: `${formData.get("scopes") ?? ""}`
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
    };

    startTransition(async () => {
      const response = await fetch("/api/admin/providers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const body = await response.json();
        setError(body.error ?? "Unable to save provider.");
        return;
      }

      const body = await response.json();
      setProviders((current) => [body.provider, ...current]);
      setOpen(false);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)} type="button">
          <Plus className="h-4 w-4" />
          Register provider config
        </Button>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        {providers.map((provider) => (
          <Card key={provider.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <ProviderMark providerKey={provider.key} />
                <div>
                  <CardTitle>{provider.name}</CardTitle>
                  <p className="mt-1 text-sm text-slate-500">{provider.trustLevel}</p>
                </div>
              </div>
              <Badge variant={provider.status === "active" ? "active" : provider.status === "degraded" ? "pending" : "inactive"}>
                {provider.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Scopes</div>
                  <div className="mt-2 text-sm leading-6 text-slate-700">{provider.scopes.join(", ")}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Last sync</div>
                  <div className="mt-2 text-sm font-medium text-slate-900">{formatDateTime(provider.lastSync)}</div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 text-sm">
                <span className="text-slate-500">Latency</span>
                <span className="font-semibold text-slate-950">{provider.latencyMs} ms</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Modal
        description="The mock only exposes .gov and Gmail provider categories right now, but the records remain editable JSON-backed configs."
        onClose={() => setOpen(false)}
        open={open}
        title="Register provider configuration"
      >
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="provider-name">Display name</Label>
              <Input defaultValue="Gov Identity (.gov)" id="provider-name" name="name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider-domain">Domain hint</Label>
              <Input defaultValue=".gov" id="provider-domain" name="domainHint" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider-key">Provider key</Label>
              <Select defaultValue="gov" id="provider-key" name="key">
                <option value="gov">gov</option>
                <option value="gmail">gmail</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider-type">Provider type</Label>
              <Select defaultValue="government_id" id="provider-type" name="type">
                <option value="government_id">government_id</option>
                <option value="email_identity">email_identity</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider-status">Status</Label>
              <Select defaultValue="active" id="provider-status" name="status">
                <option value="active">active</option>
                <option value="degraded">degraded</option>
                <option value="inactive">inactive</option>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="provider-scopes">Scopes</Label>
              <Input
                defaultValue="age_over_18, age_over_21"
                id="provider-scopes"
                name="scopes"
                placeholder="Comma-separated scopes"
              />
            </div>
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <div className="flex justify-end">
            <Button disabled={isPending} type="submit">
              {isPending ? "Saving…" : "Save provider"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
