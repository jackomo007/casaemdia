import {
  CalendarDays,
  CreditCard,
  Home,
  Lightbulb,
  ShoppingCart,
} from "lucide-react";

export const dashboardNavigation = [
  { title: "Visao geral", href: "/dashboard", icon: Home },
  { title: "Finanças", href: "/dashboard/financas", icon: CreditCard },
  { title: "Agenda", href: "/dashboard/agenda", icon: CalendarDays },
  { title: "Compras", href: "/dashboard/compras", icon: ShoppingCart },
  { title: "Insights", href: "/dashboard/insights", icon: Lightbulb },
] as const;

export const mobileBottomNavigation = [
  { title: "Inicio", href: "/dashboard", icon: Home },
  { title: "Agenda", href: "/dashboard/agenda", icon: CalendarDays },
  { title: "Finanças", href: "/dashboard/financas", icon: CreditCard },
  { title: "Compras", href: "/dashboard/compras", icon: ShoppingCart },
  { title: "Insights", href: "/dashboard/insights", icon: Lightbulb },
] as const;
