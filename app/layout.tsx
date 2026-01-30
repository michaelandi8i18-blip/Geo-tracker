import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Toaster } from "sonner";
import Link from "next/link";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "GeoTracker Pro | Global Surveillance Network",
  description: "Advanced geolocation and tracking terminal for IP, Mobile, and IMEI identifiers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="font-sans antialiased bg-zinc-950 text-zinc-200">
        <SmoothScroll>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
              {children}
            </main>
            
            <footer className="border-t border-zinc-900 bg-zinc-950 py-12 px-6">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold tracking-tighter text-white">GeoTracker <span className="text-primary">PRO</span></h3>
                  <p className="text-zinc-500 text-sm max-w-xs">
                    Professional grade digital surveillance and tracking platform. Powered by global ISP registries.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-widest font-bold text-zinc-400">Legal</h4>
                    <ul className="text-sm text-zinc-500 space-y-1">
                      <li><Link href="/policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                      <li><Link href="/disclaimer" className="hover:text-primary transition-colors">Usage Disclaimer</Link></li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-widest font-bold text-zinc-400">System</h4>
                    <ul className="text-sm text-zinc-500 space-y-1">
                      <li><Link href="/dashboard" className="hover:text-primary transition-colors">Surveillance Hub</Link></li>
                      <li><Link href="/dashboard/topup" className="hover:text-primary transition-colors">Refill Tokens</Link></li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-zinc-400">Compliance</h4>
                  <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                    <p className="text-[10px] text-zinc-600 leading-relaxed uppercase tracking-tight">
                      By using this system, you agree that you have the legal right to track the target identifiers provided. Illegal surveillance is strictly prohibited.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-zinc-700">© 2024 GeoTracker Surveillance Systems. All rights reserved.</p>
                <div className="flex gap-6">
                   <span className="text-[10px] text-zinc-800 font-mono tracking-widest uppercase">Encryption: AES-256 Enabled</span>
                   <span className="text-[10px] text-zinc-800 font-mono tracking-widest uppercase">Protocol: v4.0.1</span>
                </div>
              </div>
            </footer>
          </div>
        </SmoothScroll>
        <Toaster position="bottom-right" theme="dark" richColors />
      </body>
    </html>
  );
}
