import { NextResponse } from "next/server";

import { getAIInsights } from "@/server/services/ai-insight-service";

export async function GET() {
  const insights = await getAIInsights();
  return NextResponse.json({ insights });
}
