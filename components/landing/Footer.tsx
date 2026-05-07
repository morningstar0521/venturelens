import Link from "next/link"
import { Code2, Globe, Link2 } from "lucide-react"
import { VentureLensLogo } from "@/components/ui/VentureLensLogo"

const links = [
  { label: "Workflow", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Results", href: "#testimonials" },
  { label: "Login", href: "/login" },
]

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink/60 px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
        <div>
          <Link href="/" className="flex w-fit items-center gap-2.5">
            <VentureLensLogo size={32} showText />
          </Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-accent-muted">
            AI-powered startup validation for founders, contributors, and admins who need clearer early decisions.
          </p>
        </div>

        <div className="flex flex-col gap-5 sm:items-end">
          <div className="flex flex-wrap gap-4">
            {links.map((link) => (
              <a key={link.label} href={link.href} className="text-sm text-accent-muted transition hover:text-white">
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex gap-2">
            {[Globe, Link2, Code2].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-accent-muted transition hover:border-btn/30 hover:text-btn"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
