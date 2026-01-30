import { db } from "@/server/db";
import { tokenOrders } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PaymentDisplay } from "./PaymentDisplay";

export default async function OrderPaymentPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const headerList = await headers();
  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session) {
    redirect("/auth");
  }

  const order = await db.query.tokenOrders.findFirst({
    where: eq(tokenOrders.externalId, orderId),
  });

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-2xl font-bold text-white">Order Not Found</h1>
        <p className="text-zinc-400">The order you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  if (order.userId !== session.user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <PaymentDisplay order={order} />
    </div>
  );
}
