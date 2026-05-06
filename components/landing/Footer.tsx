import Link from "next/link"
import Image from "next/image"
import { Globe, Link2, Code2 } from "lucide-react"

const links = {
  Product: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Features",     href: "#features"     },
    { label: "Pricing",      href: "#"             },
    { label: "Changelog",    href: "#"             },
  ],
  Company: [
    { label: "About",   href: "#" },
    { label: "Blog",    href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy",    href: "#" },
    { label: "Terms of Service",  href: "#" },
    { label: "Cookie Policy",     href: "#" },
  ],
}

// ─── Footer ────────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-bg-secondary/40">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <Image
                src="/logo/logo.png"
                alt="VentureLens"
                width={36}
                height={40}
                className="h-10 w-auto object-contain"
              />
              <span className="font-bold text-lg tracking-tight">
                <span className="text-btn">Venture</span>
                <span className="text-accent-yellow">Lens</span>
              </span>
            </Link>
            <p className="text-accent-muted text-sm leading-relaxed max-w-xs">
              AI-powered startup validation. Get your Venture Score, understand your competition,
              and find your founding team — all before you build.
            </p>
            {/* Social links */}
            <div className="flex gap-3 pt-2">
              {[Globe, Link2, Code2].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 rounded-xl border border-border-subtle text-accent-muted hover:text-accent-yellow hover:border-btn/40 flex items-center justify-center transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h4 className="font-semibold text-accent-yellow text-sm">{category}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm text-accent-muted hover:text-accent-yellow transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-accent-muted">
            © {new Date().getFullYear()} VentureLens. All rights reserved.
          </p>
          <p className="text-xs text-accent-muted">
            Built for founders, by founders. 🚀
          </p>
        </div>
      </div>
    </footer>
  )
}
