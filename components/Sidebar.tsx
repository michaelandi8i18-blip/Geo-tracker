'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from '@/lib/auth-client'
import { 
  LayoutDashboard, 
  History, 
  Coins, 
  ShieldCheck, 
  LogOut, 
  User as UserIcon,
  Menu,
  X,
  Target
} from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'History', href: '/dashboard/history', icon: History },
    { name: 'Top Up', href: '/dashboard/topup', icon: Coins },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-zinc-950 border-r border-zinc-900 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Target className="text-black" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">GeoTracker <span className="text-primary">PRO</span></span>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                  ${isActive(item.href) 
                    ? 'bg-primary text-black font-bold' 
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}
                `}
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={20} />
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-4">
            {session?.user && (
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                    <UserIcon size={20} className="text-zinc-400" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">{session.user.name}</p>
                    <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                      {/* @ts-ignore */}
                      {session.user.tokens || 0} TOKENS
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-zinc-500 hover:text-red-500 hover:bg-red-500/10 p-0 h-auto"
                  onClick={() => signOut()}
                >
                  <LogOut size={18} className="mr-2" />
                  <span className="text-xs font-bold uppercase tracking-widest">Terminate Session</span>
                </Button>
              </div>
            )}
            
            <div className="px-2 text-center">
               <p className="text-[10px] text-zinc-700 font-mono">v4.0.1 SECURITY-OS</p>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
