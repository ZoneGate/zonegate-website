"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Grid2X2,
  ClipboardList,
  BadgeCheck,
  BarChart3,
  SlidersHorizontal,
  User,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/", icon: Grid2X2 },
  { label: "Requests", href: "/requests", icon: ClipboardList },
  { label: "Employees", href: "/employees", icon: BadgeCheck },
  { label: "Statistics", href: "/statistics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: SlidersHorizontal },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col justify-between border-r border-[#1E293B] bg-[#0F172A] text-white">
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <filter
            id="zonegate-remove-white"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            {/* Use the logo's ink color with a soft mask to avoid white JPEG fringes. */}
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.0784  0 0 0 0 0.3294  0 0 0 0 0.3922  -0.2976 -1.0013 -0.1011 0 1.36"
            />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>
      <div className="min-h-0 overflow-y-auto">
        <Link
          href="/"
          aria-label="ZoneGate home"
          className="isolate flex h-28 items-center justify-center border-b border-[#1E293B] bg-[#0F172A] px-4 py-3 transition-colors hover:bg-[#152035] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#1FD1A8]"
        >
          <Image
            src="/zonegate-logo.jpeg"
            alt="ZoneGate"
            width={960}
            height={1096}
            sizes="77px"
            preload
            className="h-[88px] w-auto object-contain"
            style={{ filter: "url(#zonegate-remove-white)" }}
          />
        </Link>

        <nav className="flex flex-col gap-1 p-3">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors ${isActive
                    ? "border border-[#0D9488]/40 bg-[#0D9488]/20 text-white"
                    : "text-[#94A3B8] hover:bg-[#1E293B] hover:text-white"
                  }`}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-[#1FD1A8]" : ""}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="shrink-0 border-t border-[#1E293B] bg-[#090D16] p-4">
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-widest text-[#94A3B8]">
            Node Facility
          </p>
          <p className="mt-1 font-mono text-xs text-white">
            TERMINAL 4 - PORT BERTH B
          </p>
        </div>

        <div className="mb-4 flex items-center justify-between rounded border border-[#1E293B] bg-[#0F172A] px-2 py-1.5">
          <span className="text-[10px] uppercase text-[#94A3B8]">
            Feed Status
          </span>

          <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#1FD1A8]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1FD1A8]" />
            LIVE
          </span>
        </div>

        <div className="flex items-center gap-3 border-t border-[#1E293B] pt-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#334155] bg-[#1E293B]">
            <User size={16} className="text-[#1FD1A8]" />
          </div>

          <div>
            <p className="font-mono text-xs text-white">
              OFFICER K. VANCE
            </p>
            <p className="text-[10px] text-[#94A3B8]">
              OP-ID #9482-A
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
