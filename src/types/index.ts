export type DemoScenario = "trialing" | "active" | "expired" | "past_due";
export type WorkspacePreset = "sample" | "blank";

export type BillingStatus =
  | "TRIALING"
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELED"
  | "EXPIRED"
  | "INCOMPLETE";

export type PlanCode = "TRIAL" | "ESSENTIAL" | "FAMILY" | "FAMILY_AI";

export type MetricTrend = "up" | "down" | "neutral";

export type PriorityLevel = "low" | "medium" | "high";

export type TaskState = "todo" | "in_progress" | "done";

export type EventKind =
  | "school"
  | "medical"
  | "billing"
  | "family"
  | "shopping"
  | "task";

export type InsightKind = "financial" | "organization" | "ideas";

export type FinanceEntryKind = "income" | "expense";

export type FinancialStatus = "paid" | "pending" | "overdue";

export interface MetricCardData {
  id: string;
  label: string;
  value: string;
  helper: string;
  trend: MetricTrend;
}

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  href: Route;
}

export interface CalendarEventItem {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt?: string;
  location?: string;
  kind: EventKind;
  priority: PriorityLevel;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: PriorityLevel;
  status: TaskState;
  points?: number;
  assignee: string;
  subtasksDone: number;
  subtasksTotal: number;
}

export interface ShoppingListItemSummary {
  id: string;
  name: string;
  quantity: string;
  estimatedCost: number;
  checked: boolean;
}

export interface ShoppingListSummary {
  id: string;
  title: string;
  category: string;
  estimatedTotal: number;
  progress: number;
  items: ShoppingListItemSummary[];
}

export interface InsightCardData {
  id: string;
  title: string;
  content: string;
  tone: string;
  kind: InsightKind;
  disclaimer: string;
}

export interface ChildSummary {
  id: string;
  name: string;
  age: number;
  school: string;
  pendingTasks: number;
  nextEvent: string;
  note: string;
}

export interface HealthReminder {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  childName?: string;
}

export interface FinanceChartPoint {
  label: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryBreakdown {
  id: string;
  name: string;
  amount: number;
  percentage: number;
}

export interface FinanceEntry {
  id: string;
  title: string;
  amount: number;
  kind: FinanceEntryKind;
  category: string;
  member: string;
  dueDate: string;
  competenceDate: string;
  paymentDate?: string;
  status: FinancialStatus;
  account: string;
}

export interface FinancialSummary {
  income: number;
  expense: number;
  balance: number;
  forecast: number;
  fixedCostRatio: number;
}

export interface FinanceOverviewData {
  summary: FinancialSummary;
  entries: FinanceEntry[];
  categoryBreakdown: CategoryBreakdown[];
  monthlyFlow: FinanceChartPoint[];
}

export interface BillingHistoryItem {
  id: string;
  label: string;
  amount: number;
  status: BillingStatus;
  createdAt: string;
}

export interface PlanDefinition {
  code: PlanCode;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly?: number;
  recommended?: boolean;
  featureHighlights: string[];
  familySeats: string;
  hasAI: boolean;
}

export interface BillingState {
  status: BillingStatus;
  planCode: PlanCode;
  planName: string;
  trialEndsAt?: string;
  currentPeriodEnd?: string;
  renewalLabel: string;
  history: BillingHistoryItem[];
  featureCodes: string[];
}

export interface AccessState {
  scenario: DemoScenario;
  status: BillingStatus;
  hasAccess: boolean;
  blockedReason?: string;
  trialEndsAt?: string;
}

export interface SessionUser {
  fullName: string;
  email: string;
}

export interface DashboardData {
  greetingName: string;
  householdName: string;
  monthLabel: string;
  metrics: MetricCardData[];
  alerts: AlertItem[];
  upcomingEvents: CalendarEventItem[];
  nextSevenDays: CalendarEventItem[];
  pendingTasks: TaskItem[];
  shoppingLists: ShoppingListSummary[];
  insights: InsightCardData[];
  children: ChildSummary[];
  healthReminders: HealthReminder[];
  finance: FinancialSummary;
}

export interface HouseholdWorkspace {
  dashboard: DashboardData;
  finance: FinanceOverviewData;
  events: CalendarEventItem[];
  tasks: TaskItem[];
  shoppingLists: ShoppingListSummary[];
  insights: InsightCardData[];
  children: ChildSummary[];
  health: HealthReminder[];
  billing: BillingState;
}

export interface CreateFinanceEntryInput {
  title: string;
  amount: number;
  kind: FinanceEntryKind;
  category: string;
  member: string;
  dueDate: string;
  competenceDate: string;
  account: string;
}

export interface CreateCalendarEventInput {
  title: string;
  description: string;
  startsAt: string;
  kind: EventKind;
  priority: PriorityLevel;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  dueDate: string;
  priority: PriorityLevel;
  assignee: string;
  points?: number;
}

export interface SelectPlanInput {
  planCode: PlanCode;
}
import type { Route } from "next";
