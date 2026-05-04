import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Platform: [
      { label: "Attendance", href: "/#features" },
      { label: "Timetables", href: "/#features" },
      { label: "Notifications", href: "/#features" },
      { label: "Analytics", href: "/#features" },
    ],
    "For Students": [
      { label: "Get started", href: "/signup/institution?startOver=1" },
      { label: "Sign in", href: "/login" },
      { label: "Dashboard", href: "/student/dashboard" },
    ],
    Company: [
      { label: "About", href: "/#about" },
      { label: "Contact", href: "/#contact" },
      { label: "Privacy Policy", href: "#" },
    ],
    Support: [
      { label: "support@tertiaryfree.com", href: "mailto:support@tertiaryfree.com" },
    ],
  };

  return (
    <footer
      id="contact"
      className="border-t border-white/8 bg-black"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Top: logo + columns */}
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Logo & tagline */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" aria-label="TertiaryFree home">
              <Image
                src="/logo.png"
                alt="TertiaryFree"
                width={180}
                height={49}
                className="h-9 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/50">
              TertiaryFree turns student brilliance into academic results. Your campus,
              your schedule, your success — all in one platform.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all hover:border-white/30 hover:text-white"
                aria-label="Twitter / X"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all hover:border-white/30 hover:text-white"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30">
                {heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-8 sm:flex-row">
          <p className="text-xs text-white/30">
            © {currentYear} TertiaryFree. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-white/30 transition-colors hover:text-white/60">
              Sitemap
            </Link>
            <Link href="#" className="text-xs text-white/30 transition-colors hover:text-white/60">
              Legal
            </Link>
          </div>
        </div>

        {/* Giant watermark text like micro1 */}
        <div
          className="pointer-events-none mt-8 select-none overflow-hidden"
          aria-hidden="true"
        >
          <p className="text-[clamp(4rem,15vw,12rem)] font-black leading-none tracking-tighter text-white/[0.04]">
            tertiaryfree
          </p>
        </div>
      </div>
    </footer>
  );
}
