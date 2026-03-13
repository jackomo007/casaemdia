import { getAccessState } from "@/lib/auth/session";
import { getBlockedMessage } from "@/lib/permissions/access";
import { PostTrialLock } from "@/features/billing/components/post-trial-lock";

export default async function BillingLockedPage() {
  const access = await getAccessState();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbf9ff,#f2f4fb)] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <PostTrialLock
          title={
            access.status === "PAST_DUE"
              ? "Existe um pagamento pendente"
              : "Seu acesso está bloqueado"
          }
          description={getBlockedMessage(access.status)}
        />
      </div>
    </main>
  );
}
