import { SectionIntro } from "@/components/app-shell/section-intro";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listUsers } from "@/lib/services/admin-service";
import { formatDateTime } from "@/lib/utils/format";

export default function AdminUsersPage() {
  const users = listUsers();

  return (
    <div className="space-y-6">
      <SectionIntro
        badge={`${users.length} users`}
        description="Internal AgeGate user records, their linked providers, and the platform relationships built from successful age proofs."
        eyebrow="Users"
        title="Directory and linked identities"
      />
      <Card>
        <CardHeader>
          <CardTitle>User directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Internal ID</TableHead>
                <TableHead>Linked provider</TableHead>
                <TableHead>Age band</TableHead>
                <TableHead>Linked platforms</TableHead>
                <TableHead>Last verification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-950">{user.fullName}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{user.internalRef}</TableCell>
                  <TableCell>
                    {user.providerProfiles.length ? (
                      user.providerProfiles.map((profile) => (
                        <Badge className="mr-2" key={profile.id} variant="info">
                          {profile.providerId === "prv_gov" ? ".gov" : "gmail"}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="inactive">none</Badge>
                    )}
                  </TableCell>
                  <TableCell>{user.ageBand}</TableCell>
                  <TableCell>{user.linkedPlatformIds.length}</TableCell>
                  <TableCell>{user.lastVerificationAt ? formatDateTime(user.lastVerificationAt) : "Never"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
