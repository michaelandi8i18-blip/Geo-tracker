import { db } from "@/server/db";
import { trackingHistory } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, Smartphone, QrCode, Clock, History as HistoryIcon } from "lucide-react";

export default async function HistoryPage() {
  const headerList = await headers();
  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session) {
    redirect("/auth");
  }

  const history = await db.query.trackingHistory.findMany({
    where: eq(trackingHistory.userId, session.user.id),
    orderBy: [desc(trackingHistory.createdAt)],
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Tracking History</h1>
        <p className="text-zinc-400 text-sm">Review your previous surveillance operations and location logs.</p>
      </div>

      {history.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800 border-dashed py-24 text-center">
            <CardContent>
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-600">
                    <HistoryIcon size={24} />
                </div>
                <p className="text-zinc-500">No tracking history found.</p>
            </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <Card key={item.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors group">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-primary transition-colors">
                    {item.type === 'ip' ? <Globe size={18} /> : item.type === 'phone' ? <Smartphone size={18} /> : <QrCode size={18} />}
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase font-mono bg-zinc-950 border-zinc-800 text-zinc-500">
                    {item.type}
                  </Badge>
                </div>
                <CardTitle className="text-white text-lg font-mono truncate">{item.query}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <MapPin size={12} className="text-primary" />
                  <span>{item.lat?.toFixed(4)}, {item.lng?.toFixed(4)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Clock size={12} />
                  <span>{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
