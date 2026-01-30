'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, MapPin, History, Shield, Globe, Smartphone, QrCode, Loader2, Navigation } from 'lucide-react'
import { useSession } from '@/lib/auth-client'
import { toast } from 'sonner'

export default function DashboardPage() {
  const { data: session } = useSession()
  const [query, setQuery] = useState('')
  const [type, setType] = useState<'ip' | 'phone' | 'imei'>('ip')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [userTokens, setUserTokens] = useState(0)

  useEffect(() => {
    if (session?.user) {
        // @ts-ignore
        setUserTokens(session.user.tokens || 0)
    }
  }, [session])

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, type })
      })
      
      const data = await res.json()
      if (data.success) {
        setResult(data)
        setUserTokens(data.remainingTokens)
        toast.success('Trace complete')
      } else {
        toast.error(data.error || 'Tracking failed')
      }
    } catch (err) {
      toast.error('Connection error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white">Surveillance Console</h1>
          <p className="text-zinc-400 text-sm">Target identification and location tracking system.</p>
        </div>
        <div className="flex flex-col items-end">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-sm font-mono mb-1">
            {userTokens} TOKENS
          </Badge>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Available Credits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Controls */}
        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg">New Tracking Request</CardTitle>
              <CardDescription className="text-zinc-400 text-xs">Enter target details to initiate deep-scan.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrack} className="space-y-4">
                <div className="flex p-1 bg-zinc-950 rounded-lg border border-zinc-800">
                  {(['ip', 'phone', 'imei'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${
                        type === t ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Input
                    placeholder={type === 'ip' ? 'e.g. 192.168.1.1' : type === 'phone' ? 'e.g. +62812...' : 'e.g. 3582...'}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-700 h-12 focus:ring-primary/20"
                  />
                  <div className="absolute right-3 top-3.5 text-zinc-700">
                    {type === 'ip' ? <Globe size={18} /> : type === 'phone' ? <Smartphone size={18} /> : <QrCode size={18} />}
                  </div>
                </div>

                <Button 
                    type="submit" 
                    className="w-full h-12 bg-primary text-black hover:bg-primary/90 font-bold tracking-widest uppercase text-xs shadow-lg shadow-primary/20"
                    disabled={loading || !query}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                        <Navigation className="mr-2 h-4 w-4 fill-current" />
                        Initiate Trace
                    </>
                  )}
                </Button>
                
                <p className="text-[10px] text-zinc-500 text-center uppercase tracking-tighter">
                    Each request costs 1 surveillance token
                </p>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader className="py-4">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Shield size={14} className="text-primary" />
                    Secure Protocols
                </CardTitle>
            </CardHeader>
            <CardContent className="text-[11px] text-zinc-500 leading-relaxed">
                All tracking requests are proxied through encrypted channels. Location data is sourced from real-time global ISP registries and satellite networks.
            </CardContent>
          </Card>
        </div>

        {/* Right: Map & Results */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-zinc-950 border-zinc-800 h-[400px] overflow-hidden relative group">
            {!result ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700 z-10">
                <div className="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center mb-4 animate-pulse">
                  <MapPin size={32} />
                </div>
                <p className="text-xs uppercase tracking-[0.2em] font-bold">Waiting for Trace Data</p>
                <div className="mt-8 flex gap-2">
                    {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-zinc-800 animate-bounce" style={{animationDelay: `${i * 0.2}s`}} />)}
                </div>
              </div>
            ) : (
              <iframe
                title="Google Maps"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.9) contrast(1.2)' }}
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${result.lat},${result.lng}&zoom=14`}
                allowFullScreen
              />
            )}
            
            <div className="absolute bottom-4 right-4 z-20">
                <Badge className="bg-zinc-950/80 border-zinc-700 text-[10px] uppercase font-mono backdrop-blur-sm">
                    Live Feed: Active
                </Badge>
            </div>
          </Card>

          {result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in zoom-in-95 duration-300">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="py-3 px-4 border-b border-zinc-800">
                        <CardTitle className="text-xs text-zinc-400 uppercase tracking-widest">Identification</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-2">
                        {Object.entries(result.data).map(([key, value]: [string, any]) => (
                            <div key={key} className="flex justify-between items-center border-b border-zinc-800/50 py-1 last:border-0">
                                <span className="text-[10px] text-zinc-500 uppercase font-bold">{key}</span>
                                <span className="text-xs text-zinc-200 font-mono">{String(value)}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="py-3 px-4 border-b border-zinc-800">
                        <CardTitle className="text-xs text-zinc-400 uppercase tracking-widest">Coordinates</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] text-zinc-500 uppercase font-bold">Latitude</p>
                                <p className="text-lg font-mono text-primary font-bold">{result.lat.toFixed(6)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-zinc-500 uppercase font-bold">Longitude</p>
                                <p className="text-lg font-mono text-primary font-bold">{result.lng.toFixed(6)}</p>
                            </div>
                        </div>
                        <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white h-8 text-[10px] uppercase tracking-widest">
                            Export Log Data
                        </Button>
                    </CardContent>
                </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
