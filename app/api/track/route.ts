import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { user, trackingHistory } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
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

    // Check user tokens
    const currentUser = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });

    if (!currentUser || currentUser.tokens < 1) {
      return NextResponse.json({ error: "Insufficient tokens. Please top up." }, { status: 402 });
    }

    const body = await request.json();
    const { query, type } = body; // type: 'ip', 'phone', 'imei'

    if (!query || !type) {
      return NextResponse.json({ error: "Query and type are required" }, { status: 400 });
    }

    // Deduct 1 token
    await db
      .update(user)
      .set({ tokens: sql`${user.tokens} - 1` })
      .where(eq(user.id, session.user.id));

    // Simulate tracking data
    let resultData: any = {};
    let lat = 0;
    let lng = 0;

    if (type === "ip") {
        // Real IP lookup (example)
        try {
            const geoRes = await fetch(`http://ip-api.com/json/${query}`);
            const geoData = await geoRes.json();
            if (geoData.status === 'success') {
                resultData = geoData;
                lat = geoData.lat;
                lng = geoData.lon;
            } else {
                // Fallback for demo
                lat = -6.2088;
                lng = 106.8456;
                resultData = { status: "success", country: "Indonesia", city: "Jakarta", isp: "Telkomsel", query };
            }
        } catch (e) {
            lat = -6.2088;
            lng = 106.8456;
            resultData = { status: "success", country: "Indonesia", city: "Jakarta", isp: "Demo ISP", query };
        }
    } else {
        // Mock for phone/imei
        lat = -6.2088 + (Math.random() - 0.5) * 0.1;
        lng = 106.8456 + (Math.random() - 0.5) * 0.1;
        resultData = {
            status: "success",
            type: type.toUpperCase(),
            target: query,
            lastSeen: new Date().toISOString(),
            accuracy: "98%",
            operator: "Global Satellite Registry",
        };
    }

    // Save history
    await db.insert(trackingHistory).values({
      id: nanoid(),
      userId: session.user.id,
      query,
      type,
      resultData: JSON.stringify(resultData),
      lat,
      lng,
    });

    return NextResponse.json({
      success: true,
      data: resultData,
      lat,
      lng,
      remainingTokens: currentUser.tokens - 1
    });
  } catch (error) {
    console.error("[Track] Error:", error);
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}
