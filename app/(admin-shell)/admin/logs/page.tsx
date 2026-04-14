import { SectionIntro } from "@/components/app-shell/section-intro";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listAuditLogs } from "@/lib/services/admin-service";
import { formatDateTime } from "@/lib/utils/format";

export default function AdminLogsPage() {
  const logs = listAuditLogs();

  return (
    <div className="space-y-6">
      <SectionIntro
        badge="Immutable demo feed"
        description="Verification attempts, consent decisions, provider callbacks, proof exchanges, and access events are surfaced in one audit table."
        eyebrow="Logs"
        title="Audit and verification history"
      />
      <Card>
        <CardHeader>
          <CardTitle>Audit timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-950">{log.action.replaceAll("_", " ")}</div>
                      <div className="text-xs text-slate-500">{log.detail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        log.status === "success"
                          ? "active"
                          : log.status === "failure"
                            ? "danger"
                            : log.status === "warning"
                              ? "pending"
                              : "info"
                      }
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.providerId ?? "—"}</TableCell>
                  <TableCell>{log.platformId ?? "—"}</TableCell>
                  <TableCell>{log.actor}</TableCell>
                  <TableCell>{log.reason ?? "—"}</TableCell>
                  <TableCell>{formatDateTime(log.timestamp)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
