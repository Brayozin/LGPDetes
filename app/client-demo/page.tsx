import { ClientDemoExperience } from "@/components/client-demo/client-demo-experience";

interface PageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ClientDemoPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const sessionId = typeof params.sessionId === "string" ? params.sessionId : undefined;
  const proofToken = typeof params.proofToken === "string" ? params.proofToken : undefined;

  return (
    <main className="min-h-screen bg-[#15110f] px-4 py-4 text-stone-100 lg:px-6 lg:py-6">
      <div className="mx-auto max-w-[1240px] space-y-4">
        <section className="overflow-hidden rounded-lg border border-[#332924] bg-[#1d1715]">
          <div className="flex flex-col gap-4 border-b border-[#332924] px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[#4b3b33] bg-[#b47a52] text-sm font-semibold text-[#17110e]">
                NW
              </div>
              <div>
                <div className="text-sm font-semibold text-stone-100">NightWave</div>
                <div className="text-sm text-stone-400">Aplicativo externo simulado integrando o LGPDetes Proxy</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-stone-400">
              <span className="font-mono text-xs text-stone-500">nightwave.app/after-hours</span>
              {sessionId || proofToken ? <span>Sessão {sessionId ?? "pendente"}</span> : <span>Cliente terceirizado</span>}
            </div>
          </div>
          <div className="grid md:grid-cols-3">
            {[
              {
                title: "Pedido",
                copy: "A NightWave solicita prova 18+ e redireciona o usuário para o fluxo do LGPDetes Proxy."
              },
              {
                title: "Contrato",
                copy: "Quando a validação termina, a NightWave recebe apenas o retorno mínimo necessário para liberar a área."
              },
              {
                title: "Separação",
                copy: "A identidade original permanece fora deste app e nunca aparece nesta interface."
              }
            ].map((item) => (
              <div className="border-t border-[#332924] p-4 first:border-t-0 md:border-l md:border-t-0 md:first:border-l-0" key={item.title}>
                <div className="text-sm font-medium text-stone-100">{item.title}</div>
                <div className="mt-1 text-sm leading-6 text-stone-400">{item.copy}</div>
              </div>
            ))}
          </div>
        </section>
        <div className="grid overflow-hidden rounded-lg border border-[#332924] bg-[#1d1715] md:grid-cols-2">
          {[
            {
              title: "Fluxo",
              copy: "Esta tela usa identidade visual própria para indicar que ela pertence ao app cliente, não ao LGPDetes Proxy."
            },
            {
              title: "Retorno",
              copy: "A área técnica mostra só o payload final entregue ao cliente externo depois da troca da prova."
            }
          ].map((item) => (
            <div className="border-t border-[#332924] p-4 first:border-t-0 md:border-l md:border-t-0 md:first:border-l-0" key={item.title}>
              <div className="text-sm font-medium text-stone-100">{item.title}</div>
              <div className="mt-1 text-sm leading-6 text-stone-400">{item.copy}</div>
            </div>
          ))}
        </div>
        <ClientDemoExperience initialProofToken={proofToken} initialSessionId={sessionId} />
      </div>
    </main>
  );
}
