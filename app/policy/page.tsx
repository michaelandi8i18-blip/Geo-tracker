import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function PolicyPage() {
  return (
    <div className="container mx-auto py-24 px-6 max-w-4xl">
      <div className="text-center mb-16">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-zinc-500">How we handle surveillance data and user privacy.</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-8 space-y-8 text-zinc-300 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider text-primary">1. Data Collection</h2>
            <p>
              GeoTracker Pro collect data provided by users for the purpose of geolocation services. This includes target identifiers such as IP addresses, mobile numbers, and IMEI codes. We also collect account information for authentication and billing purposes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider text-primary">2. Use of Data</h2>
            <p>
              Tracking data is processed in real-time and stored in your account history for your convenience. We do not sell tracking results to third parties. Data is used exclusively to provide the tracking services requested by the user.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider text-primary">3. Data Security</h2>
            <p>
              We employ industry-standard encryption (AES-256) for all data transmission and storage. Access to tracking results is restricted to the account holder who initiated the request.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider text-primary">4. Cookies</h2>
            <p>
              Our platform uses technical cookies to manage user sessions and authentication states. We do not use tracking cookies for advertising purposes.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
