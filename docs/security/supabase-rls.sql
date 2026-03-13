-- Supabase RLS starter for Casa em Dia
-- Apply after schema migration and after users are provisioned with `User.supabaseUserId`.

create or replace function public.current_app_user_id()
returns text
language sql
stable
as $$
  select auth.uid()::text;
$$;

create or replace function public.is_household_member(target_household_id text)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public."UserHouseholdRole" role
    join public."User" app_user on app_user.id = role."userId"
    where role."householdId" = target_household_id
      and app_user."supabaseUserId" = public.current_app_user_id()
  );
$$;

alter table public."User" enable row level security;
alter table public."Household" enable row level security;
alter table public."HouseholdMember" enable row level security;
alter table public."UserHouseholdRole" enable row level security;
alter table public."UserPreference" enable row level security;
alter table public."AuditLog" enable row level security;
alter table public."Category" enable row level security;
alter table public."FinancialAccount" enable row level security;
alter table public."IncomeEntry" enable row level security;
alter table public."ExpenseEntry" enable row level security;
alter table public."DebtEntry" enable row level security;
alter table public."CalendarEvent" enable row level security;
alter table public."Task" enable row level security;
alter table public."ShoppingList" enable row level security;
alter table public."ShoppingListItem" enable row level security;
alter table public."HealthRecord" enable row level security;
alter table public."SchoolReminder" enable row level security;
alter table public."Notification" enable row level security;
alter table public."Subscription" enable row level security;
alter table public."TrialAccess" enable row level security;
alter table public."BillingCustomer" enable row level security;
alter table public."BillingEvent" enable row level security;

create policy "user_can_read_own_profile"
on public."User"
for select
using ("supabaseUserId" = public.current_app_user_id());

create policy "user_can_update_own_profile"
on public."User"
for update
using ("supabaseUserId" = public.current_app_user_id())
with check ("supabaseUserId" = public.current_app_user_id());

create policy "member_can_read_household"
on public."Household"
for select
using (public.is_household_member(id));

create policy "owner_can_update_household"
on public."Household"
for update
using (public.is_household_member(id))
with check (public.is_household_member(id));

create policy "member_can_read_household_member"
on public."HouseholdMember"
for select
using (public.is_household_member("householdId"));

create policy "member_can_manage_household_member"
on public."HouseholdMember"
for all
using (public.is_household_member("householdId"))
with check (public.is_household_member("householdId"));

create policy "member_can_read_role_assignments"
on public."UserHouseholdRole"
for select
using (public.is_household_member("householdId"));

create policy "owner_can_manage_role_assignments"
on public."UserHouseholdRole"
for all
using (public.is_household_member("householdId"))
with check (public.is_household_member("householdId"));

create policy "member_can_read_user_preferences"
on public."UserPreference"
for select
using (public.is_household_member("householdId"));

create policy "user_can_manage_own_preferences"
on public."UserPreference"
for all
using (
  public.is_household_member("householdId")
  and exists (
    select 1
    from public."User" app_user
    where app_user.id = "userId"
      and app_user."supabaseUserId" = public.current_app_user_id()
  )
)
with check (
  public.is_household_member("householdId")
  and exists (
    select 1
    from public."User" app_user
    where app_user.id = "userId"
      and app_user."supabaseUserId" = public.current_app_user_id()
  )
);

create policy "member_can_read_audit_log"
on public."AuditLog"
for select
using (public.is_household_member("householdId"));

create policy "service_role_can_insert_audit_log"
on public."AuditLog"
for insert
with check (auth.role() = 'service_role');

create policy "member_can_access_category"
on public."Category"
for all
using (public.is_household_member("householdId"))
with check (public.is_household_member("householdId"));

create policy "member_can_access_financial_account"
on public."FinancialAccount"
for all
using (public.is_household_member("householdId"))
with check (public.is_household_member("householdId"));

create policy "member_can_access_income_entry"
on public."IncomeEntry"
for all
using (public.is_household_member("householdId"))
with check (public.is_household_member("householdId"));

create policy "member_can_access_expense_entry"
on public."ExpenseEntry"
for all
using (public.is_household_member("householdId"))
with check (public.is_household_member("householdId"));

create policy "member_can_access_debt_entry"
on public."DebtEntry"
for all
using (public.is_household_member("householdId"))
with check (public.is_household_member("householdId"));

create policy "member_can_access_calendar_event"
on public."CalendarEvent"
for all
using (public.is_household_member("householdId"))
with check (public.is_household_member("householdId"));

create policy "member_can_access_task"
on public."Task"
for all
using (public.is_household_member("householdId"))
with check (public.is_household_member("householdId"));

create policy "member_can_access_shopping_list"
on public."ShoppingList"
for all
using (public.is_household_member("householdId"))
with check (public.is_household_member("householdId"));

create policy "member_can_access_shopping_list_item"
on public."ShoppingListItem"
for all
using (public.is_household_member("householdId"))
with check (public.is_household_member("householdId"));

create policy "member_can_access_health_record"
on public."HealthRecord"
for all
using (public.is_household_member("householdId"))
with check (public.is_household_member("householdId"));

create policy "member_can_access_school_reminder"
on public."SchoolReminder"
for all
using (public.is_household_member("householdId"))
with check (public.is_household_member("householdId"));

create policy "member_can_access_notification"
on public."Notification"
for all
using (public.is_household_member("householdId"))
with check (public.is_household_member("householdId"));

create policy "member_can_access_subscription"
on public."Subscription"
for all
using (public.is_household_member("householdId"))
with check (public.is_household_member("householdId"));

create policy "member_can_access_trial_access"
on public."TrialAccess"
for all
using (public.is_household_member("householdId"))
with check (public.is_household_member("householdId"));

create policy "member_can_access_billing_customer"
on public."BillingCustomer"
for all
using (public.is_household_member("householdId"))
with check (public.is_household_member("householdId"));

create policy "member_can_access_billing_event"
on public."BillingEvent"
for all
using (public.is_household_member("householdId"))
with check (public.is_household_member("householdId"));
