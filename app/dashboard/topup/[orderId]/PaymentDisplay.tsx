"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Info, Clock, AlertCircle } from "lucide-react";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import Link from "next/link";

interface PaymentDisplayProps {
  order: {
    externalId: string;
    amount: number;
    tokenQuantity: number;
    status: string;
    paymentNumber: string | null;
    paymentMethod: string | null;
    totalPayment: number | null;
    paymentExpiredAt: Date | null;
  };
}

export function PaymentDisplay({ order }: PaymentDisplayProps) {
  const [copied, setCopied] = useState(false);
  const isQRIS = order.paymentMethod === "qris";

  const copyToClipboard = () => {
    if (order.paymentNumber) {
      navigator.clipboard.writeText(order.paymentNumber);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isExpired = order.paymentExpiredAt ? new Date() > new Date(order.paymentExpiredAt) : false;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl text-white">Complete Your Payment</CardTitle>
          <CardDescription className="text-zinc-400">
            Order ID: <span className="text-zinc-200 font-mono">{order.externalId}</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-zinc-950 rounded-lg p-6 flex flex-col items-center gap-4 border border-zinc-800">
            {isQRIS ? (
              <>
                <div className="bg-white p-4 rounded-xl">
                  {order.paymentNumber && (
                    <QRCode value={order.paymentNumber} size={200} />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-zinc-300">Scan this QRIS code</p>
                  <p className="text-xs text-zinc-500 mt-1">Works with Dana, OVO, GoPay, LinkAja & Mobile Banking</p>
                </div>
              </>
            ) : (
              <div className="w-full space-y-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-zinc-300">Transfer to Virtual Account</p>
                  <Badge variant="outline" className="mt-1 bg-zinc-900 border-zinc-700">
                    {order.paymentMethod?.replace('_va', '').toUpperCase()}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800 group">
                  <span className="text-2xl font-mono font-bold text-white tracking-widest">
                    {order.paymentNumber}
                  </span>
                  <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Package</span>
              <span className="text-white font-medium">{order.tokenQuantity} Tracking Tokens</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Status</span>
              <Badge className={order.status === 'paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}>
                {order.status.toUpperCase()}
              </Badge>
            </div>
            <div className="pt-3 border-t border-zinc-800 flex justify-between">
              <span className="text-white font-semibold">Total Amount</span>
              <span className="text-primary font-bold text-lg">
                Rp {order.totalPayment?.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className={`p-4 rounded-lg flex gap-3 text-xs ${isExpired ? 'bg-red-500/10 text-red-500' : 'bg-zinc-800/50 text-zinc-400'}`}>
            {isExpired ? (
                <AlertCircle size={16} />
            ) : (
                <Info size={16} />
            )}
            <p>
              {isExpired 
                ? "This payment link has expired. Please create a new top-up request." 
                : `Please complete the payment before ${order.paymentExpiredAt ? new Date(order.paymentExpiredAt).toLocaleTimeString() : 'expiry'}. System will automatically verify your payment.`
              }
            </p>
          </div>
        </CardContent>

        <CardContent className="pt-0">
            <Button asChild variant="outline" className="w-full border-zinc-800 hover:bg-zinc-800">
                <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
