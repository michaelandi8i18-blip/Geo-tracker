import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { tokenOrders, user } from "@/server/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getPakasirConfig } from "@/lib/pakasir-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, status, project, completed_at } = body;
    const { project: configProject } = getPakasirConfig();

    console.log(`[Pakasir Webhook] Status: ${status} for order: ${order_id}`);

    // Verify project
    if (project !== configProject) {
      console.error("[Pakasir Webhook] Project mismatch");
      return NextResponse.json({ error: "Invalid project" }, { status: 400 });
    }

    if (status === "completed") {
      // Find the order
      const order = await db.query.tokenOrders.findFirst({
        where: eq(tokenOrders.externalId, order_id),
      });

      if (!order) {
        console.error(`[Pakasir] Order not found: ${order_id}`);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Idempotent check
      if (order.status === "paid") {
        return NextResponse.json({ success: true, message: "Already processed" });
      }

      // Update order status and user tokens atomically
      await db.transaction(async (tx) => {
        const updateOrder = await tx
          .update(tokenOrders)
          .set({ status: "paid" })
          .where(and(eq(tokenOrders.externalId, order_id), eq(tokenOrders.status, "pending")));

        if (updateOrder.rowsAffected > 0) {
          // Add tokens to user
          await tx
            .update(user)
            .set({ tokens: sql`${user.tokens} + ${order.tokenQuantity}` })
            .where(eq(user.id, order.userId));
            
          console.log(`[Pakasir] Order ${order_id} fulfilled: ${order.tokenQuantity} tokens added to user ${order.userId}`);
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Pakasir Webhook] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
