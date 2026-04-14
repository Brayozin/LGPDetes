import Link from "next/link";
import { redirect } from "next/navigation";

import { AgeGateLogo } from "@/components/brand/agegate-logo";
import { Button } from "@/components/ui/button";
import { UserAuthPanel } from "@/components/user/user-auth-panel";
import { listPlatforms } from "@/lib/services/admin-service";
import { getCurrentUser } from "@/lib/utils/auth";

interface PageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamic = "force-dynamic";

function resolveNextPath(value: string | string[] | undefined) {
  const raw = typeof value === "string" ? value : "/user/platforms";

  try {
    const decoded = decodeURIComponent(raw);
    return decoded.startsWith("/") ? decoded : "/user/platforms";
  } catch {
    return raw.startsWith("/") ? raw : "/user/platforms";
  }
}

export default async function UserLoginPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  const params = (await searchParams) ?? {};
  const nextPath = resolveNextPath(params.next);
  const platformId = typeof params.platformId === "string" ? params.platformId : undefined;
  const platform = platformId ? listPlatforms().find((entry) => entry.id === platformId) : undefined;

  if (user) {
    redirect(nextPath);
  }

  return (
    <main className="app-shell flex min-h-screen items-center px-6 py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className="border bg-white p-6 lg:p-8">
          <div className="space-y-5">
            <AgeGateLogo />
            <div className="space-y-3">
              <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 lg:text-4xl">
                Verifique a idade sem repassar sua identidade.
              </h1>
              <p className="max-w-xl text-sm leading-6 text-slate-600">
                Entre com uma conta LGPDetes Proxy de demonstração, escolha `.gov` ou Gmail e compartilhe apenas o resultado mínimo
                com a plataforma solicitante.
              </p>
            </div>
            <div className="overflow-hidden rounded-lg border">
              {[
                {
                  title: "Privacidade",
                  copy: "A plataforma cliente vê só a prova de idade. A identidade continua com o provedor."
                },
                {
                  title: "Conta única",
                  copy: "Os vínculos com provedores ficam presos a uma única conta interna do LGPDetes Proxy."
                }
              ].map((item) => (
                <div className="border-t px-4 py-4 first:border-t-0" key={item.title}>
                  <div className="text-sm font-medium text-slate-950">{item.title}</div>
                  <div className="mt-1 text-sm leading-6 text-slate-600">{item.copy}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/">
                <Button variant="outline">Voltar</Button>
              </Link>
              <Link href="/client-demo">
                <Button variant="ghost">Demo NightWave</Button>
              </Link>
            </div>
          </div>
        </section>
        <div className="flex items-center justify-center">
          <UserAuthPanel nextPath={nextPath} platformName={platform?.name} />
        </div>
      </div>
    </main>
  );
}
