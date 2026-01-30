import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto py-24 px-6 max-w-4xl">
      <div className="text-center mb-16">
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Legal Disclaimer</h1>
        <p className="text-zinc-500">Important information regarding the use of tracking results.</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 border-l-4 border-l-amber-500">
        <CardContent className="p-8 space-y-8 text-zinc-300 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider text-amber-500">1. Accuracy of Results</h2>
            <p>
              While GeoTracker Pro utilizes advanced ISP registries and satellite data, we cannot guarantee 100% accuracy of the tracking results. Location data is an approximation based on network triangulation and available database records.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider text-amber-500">2. Legal Responsibility</h2>
            <p>
              The user assumes all legal responsibility for the use of this platform. Unauthorized tracking of individuals without their consent or a legal warrant may be a violation of local and international laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider text-amber-500">3. Non-Commercial Use</h2>
            <p>
              Tracking results are provided for informational purposes only. Results should not be used as sole evidence in legal proceedings or as a basis for high-stakes decisions without independent verification.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider text-amber-500">4. Service Availability</h2>
            <p>
              We strive to maintain 99.9% uptime, but tracking services may be temporarily unavailable due to network maintenance or third-party database outages.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
