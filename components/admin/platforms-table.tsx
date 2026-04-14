"use client";

import { useMemo, useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Platform, PlatformStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils/format";

export function PlatformsTable({ initialPlatforms }: { initialPlatforms: Platform[] }) {
  const [platforms, setPlatforms] = useState(initialPlatforms);
  const [isPending, startTransition] = useTransition();

  const sortedPlatforms = useMemo(
    () => [...platforms].sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    [platforms]
  );

  function updateStatus(platformId: string, status: PlatformStatus) {
    startTransition(async () => {
      const response = await fetch(`/api/admin/platforms/${platformId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        return;
      }

      const payload = await response.json();
      setPlatforms((current) => current.map((entry) => (entry.id === platformId ? payload.platform : entry)));
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Platform registry</CardTitle>
          <p className="mt-2 text-sm text-slate-500">
            Toggle integration availability and monitor callback posture without leaving the dashboard.
          </p>
        </div>
        <Badge variant="info">{isPending ? "Saving changes" : `${platforms.length} configured`}</Badge>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Age policy</TableHead>
              <TableHead>Callback URL</TableHead>
              <TableHead>Providers</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPlatforms.map((platform) => (
              <TableRow key={platform.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-950">{platform.name}</div>
                    <div className="text-xs text-slate-500">{platform.category}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    onChange={(event) => updateStatus(platform.id, event.target.value as PlatformStatus)}
                    value={platform.status}
                  >
                    <option value="active">Active</option>
                    <option value="pilot">Pilot</option>
                    <option value="inactive">Inactive</option>
                  </Select>
                </TableCell>
                <TableCell>{platform.agePolicy}</TableCell>
                <TableCell className="max-w-[280px] truncate font-mono text-xs">{platform.callbackUrl}</TableCell>
                <TableCell>{platform.providerIds.length}</TableCell>
                <TableCell>{formatDate(platform.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
