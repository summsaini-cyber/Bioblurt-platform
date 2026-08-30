"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Dna, LayoutDashboard, BookOpen, ClipboardList, LogOut, Coffee, TrendingUp } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/topics", label: "Topics", icon: BookOpen },
    { href: "/tracker", label: "Tracker", icon: ClipboardList },
    { href: "/progress", label: "Progress", icon: TrendingUp },
  ];

  return (
    <nav className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Dna className="w-5 h-5 text-primary" />
          <span className="font-bold text-lg">BioBlurt</span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:text-text-secondary hover:bg-surface-elevated"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* RIGHT SIDE GROUP */}
        <div className="flex items-center gap-1">
          <a
            href="https://buymeacoffee.com/bioblurt"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-[#FFDD00]/10 text-[#FFDD00] hover:bg-[#FFDD00]/20 transition-colors"
          >
            <Coffee className="w-4 h-4" />
            <span className="hidden sm:inline">Coffee</span>
          </a>

          <button
            onClick={signOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted hover:text-red hover:bg-red/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}