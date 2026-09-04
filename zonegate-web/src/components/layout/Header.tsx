import { Clock3, Search, User } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed left-64 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#E2E8F0] bg-white px-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#64748B]">
            Facility:
          </span>

          <span className="rounded border border-[#E2E8F0] bg-[#F1F5F9] px-2 py-1 font-mono text-xs text-[#0F172A]">
            BERTH-04 / SECTOR-B
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#64748B]">
            Gate Status:
          </span>

          <span className="flex items-center gap-1.5 rounded border border-[#0D9488]/30 bg-[#0D9488]/5 px-2 py-1 font-mono text-[11px] text-[#0D9488]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0D9488]" />
            ONLINE [AUTO-INTERLOCK]
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#64748B]"
          />

          <input
            type="text"
            placeholder="SEARCH MANIFEST / ID / TAG..."
            className="w-64 rounded border border-[#E2E8F0] bg-[#F8FAFC] py-1.5 pl-8 pr-3 font-mono text-[11px] text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#0D9488]"
          />
        </div>

        <div className="flex items-center gap-2 rounded border border-[#E2E8F0] bg-[#F1F5F9] px-2 py-1.5">
          <Clock3 size={15} className="text-[#64748B]" />
          <span className="font-mono text-xs text-[#0F172A]">
            14:28:09 UTC
          </span>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F172A]">
          <User size={17} className="text-white" />
        </div>
      </div>
    </header>
  );
}