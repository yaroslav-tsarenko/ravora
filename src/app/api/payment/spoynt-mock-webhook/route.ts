import { NextRequest, NextResponse } from "next/server";
import { spoynt } from "@/lib/payment/spoynt";

export async function POST(request: NextRequest) {
  try {
    const { orderId, status, cpi, amount, currency } = await request.json();
    let spoyntStatus = status;
    if (status === "paid" || status === "success") spoyntStatus = "processed";
    if (status === "failed" || status === "decline") spoyntStatus = "process_failed";
    if (status === "pending") spoyntStatus = "process_pending";

    const payload = {
      data: {
        type: "payment-invoices",
        id: cpi || "cpi_mock",
        attributes: {
          reference_id: `${orderId}-${Date.now()}`,
          status: spoyntStatus,
          resolution: "ok",
          amount: amount || 0,
          currency: currency || "EUR"
        }
      }
    };

    const rawBody = JSON.stringify(payload);
    const signature = spoynt.generateMockCallbackSignature(payload);

    // Call the actual callback webhook locally
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9999").replace(/\/+$/, "");
    const response = await fetch(`${siteUrl}/api/payment/spoynt-callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Signature": signature,
        "X-Signature": signature,
        "Spoynt-Signature": signature
      },
      body: rawBody,
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: `Local webhook hit failed: ${text}` }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Spoynt Mock Webhook Generator] Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
