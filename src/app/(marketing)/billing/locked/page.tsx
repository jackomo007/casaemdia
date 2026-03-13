import { PostTrialLock } from "@/features/billing/components/post-trial-lock";

export default function BillingLockedPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbf9ff,#f2f4fb)] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <PostTrialLock />
      </div>
    </main>
  );
}
