import { NextRequest, NextResponse } from "next/server";
import { getPakasirConfig, PAKASIR_API_BASE } from "@/lib/pakasir-client";
import { db } from "@/server/db";
import { tokenOrders } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, tokenQuantity, paymentMethod = "qris" } = body;
    const { project, apiKey } = getPakasirConfig();

    if (!project || !apiKey) {
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
    }

    // Validate pricing
    const qty = Number(tokenQuantity);
    const price = Number(amount);
    let isValid = false;

    if (qty === 5 && price === 5000) {
      // Check if it's really the first purchase
      const hasPaid = await db.query.tokenOrders.findFirst({
        where: (orders, { eq, and }) => and(eq(orders.userId, session.user.id), eq(orders.status, 'paid'))
      });
      if (!hasPaid) isValid = true;
    } else if (qty === 10 && price === 10000) {
      isValid = true;
    } else if (qty === 50 && price === 45000) {
      isValid = true;
    } else if (qty === 100 && price === 90000) {
      isValid = true;
    } else if (qty >= 1 && price === qty * 1000) {
      isValid = true;
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid price or package" }, { status: 400 });
    }

    const orderId = `TOKEN-${nanoid(8)}`;

    const response = await fetch(`${PAKASIR_API_BASE}/transactioncreate/${paymentMethod}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project,
        order_id: orderId,
        amount: Number(amount),
        api_key: apiKey,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Pakasir] API Error:", errorText);
      return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
    }

    const result = await response.json();
    
    if (!result.payment) {
        return NextResponse.json({ error: "Invalid response from Pakasir" }, { status: 500 });
    }

    const payment = result.payment;

    // Create order in DB
    await db.insert(tokenOrders).values({
      id: nanoid(),
      userId: session.user.id,
      externalId: orderId,
      amount: Number(amount),
      tokenQuantity: Number(tokenQuantity),
      status: "pending",
      paymentNumber: payment.payment_number,
      paymentMethod: payment.payment_method,
      totalPayment: Number(payment.total_payment),
      paymentFee: Number(payment.fee),
      paymentExpiredAt: new Date(payment.expired_at),
    });

    return NextResponse.json({
      success: true,
      orderId: orderId,
      payment: payment,
    });
  } catch (error) {
    console.error("[Pakasir] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
