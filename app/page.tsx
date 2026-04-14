import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AgeGateLogo } from "@/components/brand/agegate-logo";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="app-shell px-4 py-4 lg:px-6 lg:py-6">
      <div className="mx-auto max-w-[1200px] space-y-6">
        <section className="border bg-white px-6 py-8 lg:px-8 lg:py-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-5">
              <AgeGateLogo />
              <div className="space-y-3">
                <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 lg:text-4xl">
                  Comprove maioridade sem expor a identidade para a plataforma cliente.
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-600">
                  O LGPDetes Proxy fica entre a plataforma e o provedor de identidade. O usuário escolhe `.gov` ou Gmail, e o
                  cliente recebe apenas o resultado mínimo da prova.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="/client-demo">
                  <Button>
                    Abrir demo do cliente
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/user/login">
                  <Button variant="outline">
                    Ver fluxo do usuário
                  </Button>
                </Link>
                <Link href="/admin/login">
                  <Button variant="ghost">
                    Abrir console admin
                  </Button>
                </Link>
              </div>
            </div>
            <div className="border-t pt-4 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
              <div className="space-y-3">
                <div className="text-sm font-medium text-slate-950">Fluxo</div>
                {[
                  "A plataforma solicita a checagem de idade.",
                  "O usuário escolhe um provedor confiável.",
                  "O LGPDetes Proxy valida a resposta do provedor.",
                  "Só o resultado mínimo volta para o cliente."
                ].map((item, index) => (
                  <div className="flex gap-3 border-t pt-3 first:border-t-0 first:pt-0" key={item}>
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border bg-slate-50 text-xs font-semibold text-slate-900">
                      0{index + 1}
                    </div>
                    <div className="text-sm leading-6 text-slate-600">{item}</div>
                  </div>
                ))}
                <div className="rounded-md border bg-slate-50 p-3 text-xs text-slate-600">
                  Exemplo de retorno: <code>{`{ verified: true, age_band: "18+" }`}</code>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="grid overflow-hidden border bg-white md:grid-cols-3">
          {[
            {
              title: "Divulgação mínima",
              copy: "Só elegibilidade, faixa etária, token e expiração são compartilhados."
            },
            {
              title: "Dados editáveis",
              copy: "Plataformas, provedores, usuários e logs ficam em seeds JSON."
            },
            {
              title: "MVP pronto para deploy",
              copy: "As rotas do Next.js mantêm a demo full stack e pronta para Workers."
            }
          ].map((item) => (
            <div className="border-t p-4 first:border-t-0 md:border-l md:border-t-0 md:first:border-l-0" key={item.title}>
              <div className="text-sm font-medium text-slate-950">{item.title}</div>
              <div className="mt-1 text-sm leading-6 text-slate-600">{item.copy}</div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
