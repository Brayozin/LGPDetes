"use client";

import { useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ProviderProfile, User } from "@/lib/types";
import { formatDateTime } from "@/lib/utils/format";

interface ConnectionView {
  id: string;
  platformId: string;
  providerId: string;
  status: "active" | "revoked";
  ageBand: string;
  proofToken: string;
  lastVerifiedAt: string;
  createdAt: string;
  revokedAt: string | null;
  platform: {
    name: string;
  } | null;
  provider: {
    name: string;
  } | null;
}

interface VerificationView {
  id: string;
  status: string;
  ageBand: string | null;
  reason: string | null;
  updatedAt: string;
  platform: {
    name: string;
  } | null;
  provider: {
    name: string;
  } | null;
}

export function ConnectionsDashboard({
  user,
  providerProfiles,
  initialConnections,
  history
}: {
  user: User;
  providerProfiles: ProviderProfile[];
  initialConnections: ConnectionView[];
  history: VerificationView[];
}) {
  const [connections, setConnections] = useState(initialConnections);
  const [isPending, startTransition] = useTransition();

  function revokeConnection(connectionId: string) {
    startTransition(async () => {
      const response = await fetch(`/api/user/connections/${connectionId}/revoke`, {
        method: "POST"
      });

      if (!response.ok) {
        return;
      }

      const body = await response.json();
      setConnections((current) =>
        current.map((entry) => (entry.id === connectionId ? { ...entry, ...body.connection } : entry))
      );
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Authorized platforms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {connections.map((connection) => (
              <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between" key={connection.id}>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="font-semibold text-slate-950">{connection.platform?.name ?? connection.platformId}</div>
                    <Badge variant={connection.status === "active" ? "active" : "inactive"}>{connection.status}</Badge>
                  </div>
                  <div className="text-sm text-slate-500">
                    Proof source: {connection.provider?.name ?? connection.providerId} · Age band shared: {connection.ageBand}
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Last verification {formatDateTime(connection.lastVerifiedAt)}
                  </div>
                </div>
                <Button
                  disabled={isPending || connection.status === "revoked"}
                  onClick={() => revokeConnection(connection.id)}
                  type="button"
                  variant="outline"
                >
                  {connection.status === "revoked" ? "Access revoked" : "Revoke access"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Verification history</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Age band</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.platform?.name ?? "—"}</TableCell>
                    <TableCell>{item.provider?.name ?? "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "completed"
                            ? "active"
                            : item.status === "failed"
                              ? "danger"
                              : "pending"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.ageBand ?? item.reason ?? "—"}</TableCell>
                    <TableCell>{formatDateTime(item.updatedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Internal account boundary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Internal user ID</div>
              <div className="mt-2 text-xl font-semibold text-slate-950">{user.internalRef}</div>
              <div className="mt-1">{user.email}</div>
            </div>
            <div className="rounded-2xl bg-slate-950 p-4 text-cyan-100">
              Provider identities are attached to this internal AgeGate account. The mock backend prevents a provider subject
              from being silently reused across multiple internal accounts.
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Linked providers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {providerProfiles.map((profile) => (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4" key={profile.id}>
                <div className="font-semibold text-slate-950">{profile.providerId === "prv_gov" ? "Gov Identity (.gov)" : "Gmail Account"}</div>
                <div className="mt-1 text-sm text-slate-500">{profile.displayName}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                  Linked {formatDateTime(profile.linkedAt)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
