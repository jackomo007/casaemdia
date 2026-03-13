import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  return NextResponse.json({
    received: true,
    provider: "MERCADO_PAGO",
    payload,
    note: "Webhook mockado. Integrar verificacao de assinatura e reconciliacao no proximo passo.",
  });
}
