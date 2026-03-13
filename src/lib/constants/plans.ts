import type { PlanDefinition } from "@/types";

export const subscriptionPlans: PlanDefinition[] = [
  {
    code: "TRIAL",
    name: "Trial gratis 7 dias",
    description: "Use o produto completo por 7 dias sem cadastrar cartao.",
    priceMonthly: 0,
    featureHighlights: [
      "Agenda, finanças e compras",
      "Insights basicos",
      "Onboarding sem cartao",
    ],
    familySeats: "Ate 5 membros",
    hasAI: true,
  },
  {
    code: "ESSENTIAL",
    name: "Mensal Essencial",
    description: "Para familias que querem controle da rotina e do caixa.",
    priceMonthly: 19.9,
    featureHighlights: [
      "Dashboard familiar completo",
      "Agenda e lista de compras",
      "Fluxo financeiro e alertas",
    ],
    familySeats: "Ate 3 membros",
    hasAI: false,
  },
  {
    code: "FAMILY",
    name: "Mensal Familia",
    description: "Mais capacidade para a operacao da casa com visao ampliada.",
    priceMonthly: 29.9,
    recommended: true,
    featureHighlights: [
      "Tudo do Essencial",
      "Mais membros e historico ampliado",
      "Agenda e finanças com mais contexto",
    ],
    familySeats: "Ate 8 membros",
    hasAI: false,
  },
  {
    code: "FAMILY_AI",
    name: "Mensal Familia IA",
    description:
      "Camada premium com insights automatizados e explicacoes contextualizadas.",
    priceMonthly: 39.9,
    featureHighlights: [
      "Tudo do plano Familia",
      "Insights de IA priorizados",
      "Recomendacoes e cenarios educativos",
    ],
    familySeats: "Ate 8 membros",
    hasAI: true,
  },
];
