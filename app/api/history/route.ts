import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/server/db";
import { trackingHistory, tokenOrders } from "@/server/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const check = searchParams.get('check');

  if (check === 'first') {
    const paidOrders = await db.query.tokenOrders.findFirst({
      where: and(
        eq(tokenOrders.userId, session.user.id),
        eq(tokenOrders.status, 'paid')
      )
    });

    return NextResponse.json({ isFirst: !paidOrders });
  }

  const logs = await db.query.trackingHistory.findMany({
    where: eq(trackingHistory.userId, session.user.id),
    orderBy: [desc(trackingHistory.createdAt)],
  });

  return NextResponse.json(logs);
}
