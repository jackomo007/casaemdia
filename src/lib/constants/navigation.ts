import {
  CalendarDays,
  CreditCard,
  HeartPulse,
  Home,
  Lightbulb,
  ListChecks,
  Settings,
  ShoppingCart,
  UsersRound,
} from "lucide-react";

export const dashboardNavigation = [
  { title: "Visao geral", href: "/dashboard", icon: Home },
  { title: "Financas", href: "/dashboard/financas", icon: CreditCard },
  { title: "Agenda", href: "/dashboard/agenda", icon: CalendarDays },
  { title: "Tarefas", href: "/dashboard/tarefas", icon: ListChecks },
  { title: "Compras", href: "/dashboard/compras", icon: ShoppingCart },
  { title: "Filhos", href: "/dashboard/filhos", icon: UsersRound },
  { title: "Saude", href: "/dashboard/saude", icon: HeartPulse },
  { title: "Insights", href: "/dashboard/insights", icon: Lightbulb },
  { title: "Configuracoes", href: "/dashboard/configuracoes", icon: Settings },
] as const;

export const mobileBottomNavigation = [
  { title: "Inicio", href: "/dashboard", icon: Home },
  { title: "Agenda", href: "/dashboard/agenda", icon: CalendarDays },
  { title: "Tarefas", href: "/dashboard/tarefas", icon: ListChecks },
  { title: "Compras", href: "/dashboard/compras", icon: ShoppingCart },
  { title: "Mais", href: "/dashboard/configuracoes", icon: Settings },
] as const;
