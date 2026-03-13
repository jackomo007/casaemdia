import type {
  BillingCheckoutSession,
  BillingProviderAdapter,
  BillingWebhookEvent,
} from "@/lib/billing/types";
import type { PlanCode } from "@/types";

export class MercadoPagoAdapter implements BillingProviderAdapter {
  async createCheckout(planCode: PlanCode): Promise<BillingCheckoutSession> {
    return {
      checkoutUrl: `/billing/success?plan=${planCode.toLowerCase()}`,
      providerReference: `mp_${planCode.toLowerCase()}_${Date.now()}`,
      planCode,
    };
  }

  async cancelSubscription(_subscriptionReference: string): Promise<void> {
    void _subscriptionReference;
    return;
  }

  async parseWebhook(input: unknown): Promise<BillingWebhookEvent> {
    const payload = typeof input === "object" && input ? input : {};

    return {
      provider: "MERCADO_PAGO",
      eventType:
        typeof payload === "object" &&
        payload &&
        "type" in payload &&
        typeof payload.type === "string"
          ? payload.type
          : "unknown",
      payload,
    };
  }
}
