'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Coins, ShieldCheck, Zap, ArrowRight, Loader2 } from 'lucide-react'
import { useSession } from '@/lib/auth-client'
import { toast } from 'sonner'

const PACKAGES = [
  {
    id: 'starter',
    name: 'First Purchase Special',
    tokens: 5,
    price: 5000,
    description: 'Special offer for your first step with us.',
    icon: Coins,
    color: 'text-green-500',
    firstOnly: true
  },
  {
    id: 'basic',
    name: 'Basic Pack',
    tokens: 10,
    price: 10000,
    description: 'Perfect for light usage and quick checks.',
    icon: Coins,
    color: 'text-blue-500'
  },
  {
    id: 'pro',
    name: 'Professional',
    tokens: 50,
    price: 45000,
    description: 'Best value for deep investigations.',
    icon: Zap,
    color: 'text-amber-500',
    popular: true
  },
  {
    id: 'ultra',
    name: 'Enterprise',
    tokens: 100,
    price: 90000,
    description: 'Full power for high volume tracking.',
    icon: ShieldCheck,
    color: 'text-purple-500'
  }
]

export default function TopupPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [customTokens, setCustomTokens] = useState<string>('20')
  const [isFirstPurchase, setIsFirstPurchase] = useState<boolean>(false)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    const checkFirstPurchase = async () => {
      if (!session?.user) return
      try {
        const res = await fetch('/api/history?check=first')
        const data = await res.json()
        setIsFirstPurchase(data.isFirst)
      } catch (err) {
        console.error(err)
      }
    }
    checkFirstPurchase()
  }, [session])

  const handlePurchase = async (tokens: number, price: number, id: string) => {
    if (!session) {
      toast.error('Please login first')
      return
    }

    setLoading(id)
    try {
      const res = await fetch('/api/payment/pakasir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: price,
          tokenQuantity: tokens,
          paymentMethod: 'qris'
        })
      })

      const data = await res.json()
      if (data.success) {
        router.push(`/dashboard/topup/${data.orderId}`)
      } else {
        toast.error(data.error || 'Failed to initiate payment')
      }
    } catch (err) {
      toast.error('Something went wrong')
    } finally {
      setLoading(null)
    }
  }

  const handleCustomPurchase = () => {
    const tokens = parseInt(customTokens)
    if (isNaN(tokens) || tokens < 1) {
      toast.error('Minimum 1 token')
      return
    }
    handlePurchase(tokens, tokens * 1000, 'custom')
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Refill Tracking Tokens</h1>
        <p className="text-zinc-400">Choose a package to power your investigations. 1 Token = Rp 1.000</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PACKAGES.filter(p => !p.firstOnly || isFirstPurchase).map((pkg) => (
          <Card key={pkg.id} className={`bg-zinc-900 border-zinc-800 flex flex-col relative overflow-hidden transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl hover:shadow-primary/10 ${pkg.popular ? 'border-primary/50 ring-1 ring-primary/20' : ''}`}>
            {pkg.popular && (
              <div className="absolute top-0 right-0">
                <div className="bg-primary text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                  Popular
                </div>
              </div>
            )}
            {pkg.firstOnly && (
              <div className="absolute top-0 left-0">
                <div className="bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-br-lg uppercase tracking-wider">
                  Special
                </div>
              </div>
            )}
            
            <CardHeader>
              <div className={`p-3 rounded-xl bg-zinc-800 w-fit mb-4 ${pkg.color}`}>
                <pkg.icon size={24} />
              </div>
              <CardTitle className="text-xl text-white">{pkg.name}</CardTitle>
              <CardDescription className="text-zinc-400 text-xs">{pkg.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">Rp {pkg.price.toLocaleString('id-ID')}</span>
              </div>
              
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {pkg.tokens} Tracking Credits
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Instant Activation
                </li>
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full h-10 bg-white text-black hover:bg-zinc-200 transition-colors group text-sm"
                disabled={loading !== null}
                onClick={() => handlePurchase(pkg.tokens, pkg.price, pkg.id)}
              >
                {loading === pkg.id ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Purchase
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
        <div className="p-6 md:flex items-center justify-between gap-6">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-white mb-1">Custom Token Amount</h3>
            <p className="text-zinc-400 text-sm">Need a specific amount? 1 Token = Rp 1.000</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative">
              <input 
                type="number" 
                value={customTokens}
                onChange={(e) => setCustomTokens(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white px-4 py-2 rounded-lg w-full sm:w-32 outline-none focus:ring-1 focus:ring-primary pr-12"
                min="1"
              />
              <span className="absolute right-3 top-2 text-zinc-500 text-sm">qty</span>
            </div>
            
            <div className="text-white font-bold whitespace-nowrap">
              = Rp {(parseInt(customTokens) * 1000 || 0).toLocaleString('id-ID')}
            </div>

            <Button 
              className="bg-primary text-black hover:bg-primary/90 transition-colors px-8"
              onClick={handleCustomPurchase}
              disabled={loading !== null}
            >
              {loading === 'custom' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Buy Tokens'
              )}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="bg-zinc-900/50 border-zinc-800 border-dashed">
        <CardContent className="p-6 text-center text-zinc-400 text-xs">
          Payments are securely processed by Pakasir. Funds are immediately settled to the provider. 
          By purchasing, you agree to our <a href="/policy" className="text-primary hover:underline">Terms of Service</a>.
        </CardContent>
      </Card>
    </div>
  )
}
