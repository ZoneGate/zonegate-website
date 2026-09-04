"use client";

import Link from "next/link";
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
  { label: "Couriers / Employees", href: "/employees", icon: BadgeCheck },
  { label: "Statistics", href: "/statistics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: SlidersHorizontal },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col justify-between border-r border-[#1E293B] bg-[#0F172A] text-white">
      <div>
        <div className="flex h-16 items-center gap-2 border-b border-[#1E293B] px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#0D9488] font-bold">
            Z
          </div>
          <span className="text-sm font-semibold uppercase tracking-wider">
            ZoneGate
          </span>
        </div>

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

      <div className="border-t border-[#1E293B] bg-[#090D16] p-4">
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