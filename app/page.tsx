import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield, MapPin, Zap, Target, Lock, Globe } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        </div>
        
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-1000">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            Global Surveillance Active
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            Locate Anyone, <br />
            <span className="text-primary">Anywhere.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-zinc-500 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            Advanced digital tracking platform for IP addresses, phone numbers, and IMEI identifiers. 
            Professional grade results with satellite accuracy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            <Button asChild size="lg" className="h-14 px-8 bg-white text-black hover:bg-zinc-200 text-base font-bold transition-all hover:scale-105 active:scale-95">
              <Link href="/dashboard">Access Terminal</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 border-zinc-800 hover:bg-zinc-900 text-base font-bold transition-all hover:scale-105 active:scale-95">
              <Link href="/auth">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 border-y border-zinc-900 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Globe,
              title: "IP Deep Scan",
              desc: "Identify geographical location, ISP, and network infrastructure of any IP address globally."
            },
            {
              icon: MapPin,
              title: "Cellular Tracking",
              desc: "Trace mobile numbers via global registry networks with pinpoint coordinate mapping."
            },
            {
              icon: Shield,
              title: "IMEI Registry",
              desc: "Search device history and last seen locations using international IMEI databases."
            }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-primary/20 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                <feature.icon className="text-zinc-500 group-hover:text-primary transition-colors" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto rounded-[3rem] bg-primary p-12 md:p-24 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-black/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold text-black tracking-tighter">
                Unmatched Accuracy. <br /> Total Privacy.
              </h2>
              <p className="text-black/70 text-lg">
                Our encrypted protocols ensure your investigations remain private while delivering results from the most reliable data sources on the planet.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Trackings", value: "2M+" },
                { label: "Accuracy", value: "98.4%" },
                { label: "Uptime", value: "99.9%" },
                { label: "Global Nodes", value: "450+" }
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl bg-black/5 border border-black/10">
                  <p className="text-3xl font-bold text-black">{stat.value}</p>
                  <p className="text-xs uppercase tracking-widest font-bold text-black/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-24 px-6 text-center space-y-12">
        <h4 className="text-xs uppercase tracking-[0.4em] font-bold text-zinc-700">Trusted By Cyber Agencies Worldwide</h4>
        <div className="flex flex-wrap justify-center gap-12 opacity-20 grayscale transition-all hover:grayscale-0 hover:opacity-100">
           {/* Simple placeholders for "logos" */}
           {['INTERSEC', 'GLOBALNET', 'SURVEILX', 'CYBERDRIVE', 'GEOCORE'].map(name => (
             <span key={name} className="text-2xl font-black italic tracking-tighter text-white">{name}</span>
           ))}
        </div>
      </section>
    </div>
  )
}
