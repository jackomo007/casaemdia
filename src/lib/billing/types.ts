import type { PlanCode } from "@/types";

export interface BillingCheckoutSession {
  checkoutUrl: string;
  providerReference: string;
  planCode: PlanCode;
}

export interface BillingWebhookEvent {
  provider: "MERCADO_PAGO";
  eventType: string;
  payload: unknown;
}

export interface BillingProviderAdapter {
  createCheckout(planCode: PlanCode): Promise<BillingCheckoutSession>;
  cancelSubscription(subscriptionReference: string): Promise<void>;
  parseWebhook(input: unknown): Promise<BillingWebhookEvent>;
}
