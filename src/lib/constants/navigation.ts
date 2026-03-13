import {
  CalendarDays,
  CreditCard,
  Home,
  Lightbulb,
  Settings,
  ShoppingCart,
} from "lucide-react";

export const dashboardNavigation = [
  { title: "Visao geral", href: "/dashboard", icon: Home },
  { title: "Financas", href: "/dashboard/financas", icon: CreditCard },
  { title: "Agenda", href: "/dashboard/agenda", icon: CalendarDays },
  { title: "Compras", href: "/dashboard/compras", icon: ShoppingCart },
  { title: "Insights", href: "/dashboard/insights", icon: Lightbulb },
  { title: "Configuracoes", href: "/dashboard/configuracoes", icon: Settings },
] as const;

export const mobileBottomNavigation = [
  { title: "Inicio", href: "/dashboard", icon: Home },
  { title: "Agenda", href: "/dashboard/agenda", icon: CalendarDays },
  { title: "Financas", href: "/dashboard/financas", icon: CreditCard },
  { title: "Compras", href: "/dashboard/compras", icon: ShoppingCart },
  { title: "Mais", href: "/dashboard/configuracoes", icon: Settings },
] as const;
