"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/rooms", label: "Rooms & Tables" },
  { href: "/checkout", label: "Checkout" },
  { href: "/contact", label: "Support" },
  { href: "/user/dashboard", label: "My Dashboard" },
  { href: "/admin/dashboard", label: "Admin" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-8">
      <header className="mb-6 overflow-hidden rounded-4xl border border-(--outline) bg-(--surface)">
        <div className="bg-(--accent-dark) px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#f6ead0]">
          Grand Horizon Hotel Experience Portal
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6f1912]">
              Dining, Room Service, Events
            </p>
            <h1 className="display-font text-4xl font-semibold leading-none text-[#220808]">
              Drizzle Hotel
            </h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "rounded-full border px-4 py-2 text-sm font-semibold transition",
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "border-[#952117] bg-[#a4271f] text-white"
                    : "border-(--outline) bg-[#f6eedf] text-[#51211b] hover:bg-[#f2e6cf]",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
