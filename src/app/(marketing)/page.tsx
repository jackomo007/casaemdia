import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  HeartPulse,
  ListChecks,
  ShoppingCart,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { subscriptionPlans } from "@/lib/constants/plans";
import { PlanCard } from "@/components/billing/plan-card";
import { SelectPlanButton } from "@/features/billing/components/select-plan-button";
import { Button } from "@/components/ui/button";

export default function MarketingHomePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbf9ff_0%,#f6f5fb_55%,#eef4fb_100%)] px-4 py-5 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="sticky top-4 z-40 rounded-[30px] border border-white/80 bg-white/90 px-5 py-4 shadow-[0_22px_70px_-40px_rgba(80,64,153,0.32)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-primary text-xs font-semibold tracking-[0.24em] uppercase">
                Painel da Familia
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Agenda, financas, filhos e IA em uma so operacao.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" className="rounded-2xl">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild className="rounded-2xl">
                <Link href="/register">Criar conta</Link>
              </Button>
            </div>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[36px] border border-white/80 bg-[radial-gradient(circle_at_top,_rgba(124,92,255,0.18),transparent_45%),linear-gradient(180deg,#ffffff,#faf7ff)] p-8 shadow-[0_36px_100px_-70px_rgba(80,64,153,0.46)] md:p-12">
            <span className="bg-primary/10 text-primary inline-flex rounded-full px-4 py-2 text-xs font-semibold tracking-[0.24em] uppercase">
              SaaS operacional para familias reais
            </span>
            <h1 className="font-display mt-6 max-w-3xl text-5xl leading-tight font-semibold text-slate-950 md:text-6xl">
              Controle a vida da casa com a clareza de um painel premium.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Centralize agenda, dinheiro, tarefas, compras, filhos e insights
              com IA em uma experiencia mobile-first pronta para virar produto
              comercial.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-2xl px-6">
                <Link href="/trial">
                  Comecar 7 dias gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-2xl px-6"
              >
                <Link href="/select-plan">Ver planos</Link>
              </Button>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                "Trial sem cartao",
                "Pronto para Supabase + Vercel",
                "Billing self-service",
              ].map((pill) => (
                <div
                  key={pill}
                  className="border-primary/10 rounded-3xl border bg-white/80 px-4 py-4 text-sm font-medium text-slate-700"
                >
                  {pill}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
            {[
              {
                icon: CreditCard,
                title: "Financas da casa",
                text: "Fluxo mensal, contas, cartoes, dividas e previsoes.",
              },
              {
                icon: CalendarDays,
                title: "Agenda familiar",
                text: "Escola, vacinas, contas, aniversarios e rotina.",
              },
              {
                icon: ListChecks,
                title: "Tarefas",
                text: "Missao dos filhos, casa e checklists recorrentes.",
              },
              {
                icon: ShoppingCart,
                title: "Compras",
                text: "Listas multiplas com custo estimado e progresso.",
              },
              {
                icon: UsersRound,
                title: "Filhos",
                text: "Escola, uniforme, materiais e eventos por crianca.",
              },
              {
                icon: Sparkles,
                title: "IA",
                text: "Insights educativos e alertas operacionais para a semana.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[30px] border border-white/80 bg-white/90 p-6 shadow-[0_24px_80px_-55px_rgba(80,64,153,0.35)]"
              >
                <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-2xl">
                  <item.icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-slate-950">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Agenda + escola + saude",
              text: "Ve o que a familia precisa fazer nos proximos 7 dias sem perder detalhe escolar ou medico.",
              icon: CalendarDays,
            },
            {
              title: "Financeiro com leitura operacional",
              text: "Cards, graficos e modo planilha para quem precisa decidir rapido sem abrir varias ferramentas.",
              icon: CreditCard,
            },
            {
              title: "Rotina com IA e alertas",
              text: "O produto aponta gargalos, semanas intensas e oportunidades simples de organizacao.",
              icon: HeartPulse,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="border-border/70 rounded-[32px] border bg-white/85 p-6"
            >
              <item.icon className="text-primary h-6 w-6" />
              <h3 className="mt-4 text-xl font-semibold text-slate-950">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.text}
              </p>
            </div>
          ))}
        </section>

        <section className="space-y-6">
          <div className="max-w-2xl">
            <p className="text-primary text-xs font-semibold tracking-[0.24em] uppercase">
              Pricing
            </p>
            <h2 className="font-display mt-3 text-4xl font-semibold text-slate-950">
              Planos claros desde o primeiro dia
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Deixe explicito que o trial e gratis por 7 dias, sem cartao, e que
              a conversao acontece no proprio produto.
            </p>
          </div>
          <div className="grid gap-5 xl:grid-cols-4">
            {subscriptionPlans.map((plan) => (
              <PlanCard
                key={plan.code}
                plan={plan}
                action={
                  plan.code === "TRIAL" ? (
                    <Button asChild className="w-full rounded-2xl">
                      <Link href="/trial">Iniciar trial</Link>
                    </Button>
                  ) : (
                    <SelectPlanButton planCode={plan.code} />
                  )
                }
              />
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {[
            {
              q: "Precisa cadastrar cartao no trial?",
              a: "Nao. O trial comeca sem cartao e bloqueia o dashboard apenas quando os 7 dias acabam sem assinatura.",
            },
            {
              q: "Os dados somem se o trial expirar?",
              a: "Nao. O acesso normal e bloqueado, mas os dados ficam preservados para conversao futura.",
            },
            {
              q: "Ja esta pronto para Vercel e Supabase?",
              a: "Sim. A base foi estruturada para App Router, Supabase Auth, Postgres, Prisma e deploy na Vercel.",
            },
            {
              q: "Os insights sao consultoria financeira?",
              a: "Nao. O sistema trabalha com sugestoes educativas, cenarios e alertas de organizacao, com disclaimers apropriados.",
            },
          ].map((faq) => (
            <div
              key={faq.q}
              className="border-border/70 rounded-[28px] border bg-white/90 p-6"
            >
              <h3 className="text-lg font-semibold text-slate-950">{faq.q}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{faq.a}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
