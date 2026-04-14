import { Building2, CheckCircle2, ShieldEllipsis, Users } from "lucide-react";

import { ActivityTimeline } from "@/components/admin/activity-timeline";
import { MetricCard } from "@/components/admin/metric-card";
import { SectionIntro } from "@/components/app-shell/section-intro";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardSummary, listPlatforms, listProviders } from "@/lib/services/admin-service";
import { formatPercent } from "@/lib/utils/format";

export default function AdminDashboardPage() {
  const summary = getDashboardSummary();
  const platforms = listPlatforms();
  const providers = listProviders();

  return (
    <div className="space-y-6">
      <SectionIntro
        badge="Admin overview"
        description="A concise operational view of active clients, user coverage, verification throughput, and the latest proof-exchange activity."
        eyebrow="Dashboard"
        title="AgeGate Proxy control center"
      />
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard delta="Partner platforms onboarded" label="Total platforms" value={summary.totalPlatforms} />
        <MetricCard delta="Currently receiving traffic" label="Active platforms" value={summary.activePlatforms} />
        <MetricCard delta="Internal AgeGate accounts" label="Total users" value={summary.totalUsers} />
        <MetricCard delta="Seeded and runtime sessions" label="Verifications" value={summary.totalVerifications} />
        <MetricCard delta="Finalized mock success rate" label="Success rate" value={formatPercent(summary.successRate)} />
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <ActivityTimeline items={summary.recentActivity} />
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform mix</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {platforms.slice(0, 5).map((platform) => (
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4" key={platform.id}>
                  <div>
                    <div className="font-semibold text-slate-950">{platform.name}</div>
                    <div className="mt-1 text-sm text-slate-500">{platform.agePolicy}</div>
                  </div>
                  <Badge variant={platform.status === "active" ? "active" : platform.status === "pilot" ? "pending" : "inactive"}>
                    {platform.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Trust boundaries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "Identity providers",
                  copy: `${providers.length} trusted provider configs`,
                  icon: <ShieldEllipsis className="h-5 w-5 text-cyan-600" />
                },
                {
                  label: "Client callbacks",
                  copy: `${platforms.filter((entry) => entry.status === "active").length} active callback URLs`,
                  icon: <Building2 className="h-5 w-5 text-cyan-600" />
                },
                {
                  label: "User coverage",
                  copy: `${summary.totalUsers} accounts in the mock directory`,
                  icon: <Users className="h-5 w-5 text-cyan-600" />
                },
                {
                  label: "Proof issuance",
                  copy: `${summary.totalVerifications} total verification records`,
                  icon: <CheckCircle2 className="h-5 w-5 text-cyan-600" />
                }
              ].map((item) => (
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4" key={item.label}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50">{item.icon}</div>
                  <div>
                    <div className="font-semibold text-slate-950">{item.label}</div>
                    <div className="mt-1 text-sm text-slate-500">{item.copy}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
