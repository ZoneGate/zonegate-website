"use client";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  RefreshCw,
  ShieldCheck,
  Truck,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const requests = [
  {
    id: "ZG-AUTH-81921",
    resource: "CT-928411",
    zone: "PORT_GATE_17",
    officer: "K. Vance",
    status: "APPROVED",
    time: "14:27:41",
  },
  {
    id: "ZG-AUTH-81919",
    resource: "CT-554820",
    zone: "WAREHOUSE_B",
    officer: "M. Reed",
    status: "DENIED",
    time: "14:24:13",
  },
  {
    id: "ZG-AUTH-81915",
    resource: "CT-884120",
    zone: "LOADING_ZONE_3",
    officer: "J. Hayes",
    status: "HOLD",
    time: "14:20:08",
  },
];

function StatusBadge({ status }: { status: string }) {
  const style =
    status === "APPROVED"
      ? "border-[#CCFBF1] bg-[#F0FDFA] text-[#0F766E]"
      : status === "HOLD"
        ? "border-[#FEF3C7] bg-[#FFFBEB] text-[#B45309]"
        : "border-[#FEE2E2] bg-[#FEF2F2] text-[#B91C1C]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 font-mono text-[10px] ${style}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${status === "APPROVED"
            ? "bg-[#0D9488]"
            : status === "HOLD"
              ? "bg-[#D97706]"
              : "bg-[#DC2626]"
          }`}
      />
      {status}
    </span>
  );
}

export default function Home() {
  const [lastRefresh, setLastRefresh] = useState("1.2s");

  function refreshTelemetry() {
    setLastRefresh("NOW");
    window.setTimeout(() => setLastRefresh("1.2s"), 1200);
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="flex flex-col justify-between gap-4 border-b border-[#E2E8F0] pb-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-widest text-[#64748B]">
              Command Protocol // Berth-04
            </span>

            <span className="h-1.5 w-1.5 rounded-full bg-[#0D9488]" />

            <span className="font-mono text-[11px] uppercase text-[#64748B]">
              Encryption: SHA-256 Sync
            </span>
          </div>

          <h1 className="text-2xl font-semibold uppercase tracking-tight text-[#0F172A]">
            Security Operations & Gate Control
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Live checkpoint telemetry, gate clearances, and active perimeter
            throughput.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={refreshTelemetry} aria-label="Refresh gate telemetry" className="flex items-center gap-2 rounded border border-[#E2E8F0] bg-white px-3 py-2 transition hover:bg-[#F1F5F9] focus-visible:outline-2 focus-visible:outline-[#0D9488]">
            <RefreshCw size={15} className="text-[#0D9488]" />
            <span className="font-mono text-[11px]">
              TELEMETRY REFRESH: {lastRefresh}
            </span>
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Active Requests"
          value="24"
          meta="+4 in last 10 min"
          icon={<Activity size={18} />}
        />

        <MetricCard
          label="Approved Today"
          value="142"
          meta="91.4% clearance rate"
          icon={<CheckCircle2 size={18} />}
        />

        <MetricCard
          label="On Hold"
          value="7"
          meta="Supervisor review"
          icon={<Clock3 size={18} />}
        />

        <MetricCard
          label="Denied"
          value="3"
          meta="Security policy blocked"
          icon={<XCircle size={18} />}
        />
      </section>

      <section className="flex flex-col gap-4">
        <div className="order-2 w-full overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] px-4 py-3">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-[#64748B]">
                Live Requests
              </p>

              <p className="mt-0.5 text-xs text-[#94A3B8]">
                Current authorization activity
              </p>
            </div>

            <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#0D9488]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1FD1A8]" />
              LIVE FEED
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="bg-[#F8FAFC]">
                <tr className="border-b border-[#E2E8F0]">
                  {[
                    "Request ID",
                    "Resource",
                    "Zone",
                    "Officer",
                    "Time",
                    "Decision",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-[#64748B]"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F8FAFC]"
                  >
                    <td className="px-4 py-3 font-mono text-xs">
                      {request.id}
                    </td>

                    <td className="px-4 py-3 font-mono text-xs">
                      {request.resource}
                    </td>

                    <td className="px-4 py-3 font-mono text-[11px] text-[#64748B]">
                      {request.zone}
                    </td>

                    <td className="px-4 py-3 text-xs">
                      {request.officer}
                    </td>

                    <td className="px-4 py-3 font-mono text-[11px] text-[#64748B]">
                      {request.time}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={request.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="order-1 w-full rounded-lg border border-[#E2E8F0] bg-white">
          <div className="border-b border-[#F1F5F9] px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#64748B]">
              Gate Telemetry
            </p>
          </div>

          <div className="space-y-4 p-4">
            <TelemetryRow
              icon={<MapPin size={16} />}
              label="Active Zone"
              value="PORT_GATE_17"
            />

            <TelemetryRow
              icon={<Truck size={16} />}
              label="Cargo in Handoff"
              value="08"
            />

            <TelemetryRow
              icon={<ShieldCheck size={16} />}
              label="Verified Devices"
              value="31"
            />

            <TelemetryRow
              icon={<Package size={16} />}
              label="Containers Cleared"
              value="146"
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4">
        <div className="rounded-lg border border-[#E2E8F0] bg-white xl:col-span-2">
          <div className="border-b border-[#F1F5F9] px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#64748B]">
              Recent Security Activity
            </p>
          </div>

          <div className="divide-y divide-[#F1F5F9]">
            <ActivityRow
              icon={<AlertTriangle size={16} />}
              title="Location verification failed"
              meta="ZG-AUTH-81919 · Warehouse B"
              tone="danger"
            />

            <ActivityRow
              icon={<Clock3 size={16} />}
              title="Supervisor approval requested"
              meta="ZG-AUTH-81915 · Loading Zone 3"
              tone="warning"
            />

            <ActivityRow
              icon={<CheckCircle2 size={16} />}
              title="Cargo handoff approved"
              meta="ZG-AUTH-81921 · Port Gate 17"
              tone="success"
            />
          </div>
        </div>

      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  meta,
  icon,
}: {
  label: string;
  value: string;
  meta: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[10px] font-medium uppercase tracking-wider text-[#64748B]">
          {label}
        </p>

        <span className="text-[#0D9488]">{icon}</span>
      </div>

      <p className="font-mono text-2xl font-semibold text-[#0F172A]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#94A3B8]">{meta}</p>
    </div>
  );
}

function TelemetryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-[#64748B]">
        <span className="text-[#0D9488]">{icon}</span>
        <span className="text-xs">{label}</span>
      </div>

      <span className="font-mono text-xs font-medium text-[#0F172A]">
        {value}
      </span>
    </div>
  );
}

function ActivityRow({
  icon,
  title,
  meta,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  meta: string;
  tone: "success" | "warning" | "danger";
}) {
  const toneClass =
    tone === "success"
      ? "text-[#0D9488]"
      : tone === "warning"
        ? "text-[#D97706]"
        : "text-[#DC2626]";

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className={toneClass}>{icon}</span>

      <div>
        <p className="text-xs font-medium text-[#0F172A]">{title}</p>
        <p className="mt-0.5 font-mono text-[10px] text-[#94A3B8]">
          {meta}
        </p>
      </div>
    </div>
  );
}
