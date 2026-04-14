"use client";

import { useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ProviderProfile, User } from "@/lib/types";
import {
  formatConnectionStatus,
  formatDateTime,
  formatVerificationReason,
  formatVerificationStatus
} from "@/lib/utils/format";

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
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Acessos ativos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {connections.map((connection) => (
              <div className="flex flex-col gap-4 rounded-md border p-4 lg:flex-row lg:items-center lg:justify-between" key={connection.id}>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="font-semibold text-slate-950">{connection.platform?.name ?? connection.platformId}</div>
                    <Badge variant={connection.status === "active" ? "active" : "inactive"}>
                      {formatConnectionStatus(connection.status)}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-500">
                    Fonte da prova: {connection.provider?.name ?? connection.providerId} · Faixa compartilhada: {connection.ageBand}
                  </div>
                  <div className="text-sm text-slate-400">
                    Última validação em {formatDateTime(connection.lastVerifiedAt)}
                  </div>
                </div>
                <Button
                  disabled={isPending || connection.status === "revoked"}
                  onClick={() => revokeConnection(connection.id)}
                  type="button"
                  variant="outline"
                >
                  {connection.status === "revoked" ? "Revogado" : "Revogar acesso"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Histórico</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plataforma</TableHead>
                  <TableHead>Provedor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead>Atualizado</TableHead>
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
                        {formatVerificationStatus(item.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.ageBand ?? formatVerificationReason(item.reason) ?? "—"}</TableCell>
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
            <CardTitle>Conta interna</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <div className="rounded-md bg-slate-50 p-4">
              <div className="text-sm text-slate-500">ID interno</div>
              <div className="mt-2 text-xl font-semibold text-slate-950">{user.internalRef}</div>
              <div className="mt-1">{user.email}</div>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-slate-700">
              As identidades dos provedores ficam vinculadas a esta conta interna. O backend bloqueia reutilização silenciosa em contas diferentes.
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Provedores vinculados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {providerProfiles.map((profile) => (
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4" key={profile.id}>
                <div className="font-semibold text-slate-950">{profile.providerId === "prv_gov" ? "Identidade .gov" : "Conta Gmail"}</div>
                <div className="mt-1 text-sm text-slate-500">{profile.displayName}</div>
                <div className="mt-2 text-sm text-slate-400">
                  Vinculado em {formatDateTime(profile.linkedAt)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
