"use client";

import {
    BarChart3,
    Building2,
    Download,
    History,
    PieChart as PieChartIcon,
    ShieldAlert,
    Smartphone,
} from "lucide-react";
import { useState } from "react";
import {
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const decisionData = [
    { name: "Approved", value: 1174, color: "#0D9488" },
    { name: "On Hold", value: 74, color: "#D97706" },
    { name: "Denied", value: 36, color: "#DC2626" },
];

const activityData = [
    { day: "MON", approved: 136, hold: 8, denied: 3 },
    { day: "TUE", approved: 148, hold: 7, denied: 4 },
    { day: "WED", approved: 125, hold: 10, denied: 2 },
    { day: "THU", approved: 172, hold: 6, denied: 4 },
    { day: "FRI", approved: 161, hold: 9, denied: 3 },
    { day: "SAT", approved: 188, hold: 12, denied: 5 },
    { day: "SUN", approved: 194, hold: 8, denied: 3 },
];

const locationData = [
    {
        name: "PORT GATE 17 (BERTH B)",
        value: 420,
        percent: "32.7%",
        width: "32.7%",
        color: "#0F172A",
    },
    {
        name: "WAREHOUSE A (HIGH SEC)",
        value: 318,
        percent: "24.8%",
        width: "24.8%",
        color: "#0D9488",
    },
    {
        name: "WAREHOUSE B (TRANSIT)",
        value: 284,
        percent: "22.1%",
        width: "22.1%",
        color: "#475569",
    },
    {
        name: "LOADING ZONE 3 (BULK CARGO)",
        value: 262,
        percent: "20.4%",
        width: "20.4%",
        color: "#94A3B8",
    },
];

const incidents = [
    {
        id: "REQ-1050",
        employee: "Selin Arslan",
        resource: "CT-884120",
        location: "Loading Zone 3",
        reason: "Location verification failed (GPS delta 3.4km)",
        decision: "DENIED",
        time: "14:41",
    },
    {
        id: "REQ-1049",
        employee: "Mehmet Demir",
        resource: "CT-554820",
        location: "Warehouse B",
        reason: "High-value request outside scheduled shift hours",
        decision: "HOLD",
        time: "14:35",
    },
    {
        id: "REQ-1048",
        employee: "David Park",
        resource: "TK-991204",
        location: "Port Gate 17",
        reason: "Unregistered trailer chassis tare weight variance",
        decision: "HOLD",
        time: "14:28",
    },
    {
        id: "REQ-1044",
        employee: "Elena Rostova",
        resource: "CT-110294",
        location: "Warehouse A",
        reason: "Expired biometric iris hash (TTL exceeded 24h)",
        decision: "DENIED",
        time: "14:12",
    },
    {
        id: "REQ-1040",
        employee: "Tariq Al-Mansoor",
        resource: "RF-440219",
        location: "Port Gate 17",
        reason: "Tamper seal mismatch against electronic manifest",
        decision: "HOLD",
        time: "13:58",
    },
];

const timeFilters = ["Today", "Last 7 Days", "Last 30 Days", "Custom Date"];

export default function StatisticsPage() {
    const [timeFilter, setTimeFilter] = useState("Last 7 Days");
    const [location, setLocation] = useState("All Locations");

    return (
        <div className="flex w-full flex-col gap-6">
            <section className="flex flex-col justify-between gap-4 border-b border-[#E2E8F0] pb-4 lg:flex-row lg:items-end">
                <div>
                    <div className="mb-1 flex items-center gap-2">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-[#64748B]">
                            Metrics & Audit
                        </span>

                        <span className="text-[10px] text-[#64748B]">•</span>

                        <span className="rounded border border-[#E2E8F0] bg-[#F1F5F9] px-2 py-0.5 font-mono text-[10px] text-[#0F172A]">
                            NODE_T4_STAT
                        </span>
                    </div>

                    <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
                        Statistics
                    </h1>

                    <p className="mt-1 text-sm text-[#64748B]">
                        Overview of authorization requests and security decisions across
                        active telemetry feeds.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center rounded border border-[#E2E8F0] bg-[#F1F5F9] p-0.5">
                        {timeFilters.map((item) => (
                            <button
                                key={item}
                                onClick={() => setTimeFilter(item)}
                                className={`rounded px-3 py-1.5 text-[10px] font-semibold uppercase transition ${timeFilter === item
                                        ? "bg-[#0D9488] text-white"
                                        : "text-[#0F172A] hover:text-[#0D9488]"
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    <select
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        className="rounded border border-[#E2E8F0] bg-white px-3 py-2 font-mono text-[11px] text-[#0F172A] outline-none focus:border-[#0D9488]"
                    >
                        <option>All Locations</option>
                        <option>Port Gate 17</option>
                        <option>Warehouse A</option>
                        <option>Warehouse B</option>
                        <option>Loading Zone 3</option>
                    </select>

                    <button className="flex items-center gap-2 rounded border border-[#E2E8F0] bg-white px-3 py-2 text-[10px] font-semibold uppercase text-[#0F172A] transition hover:border-[#0D9488]">
                        <Download size={15} className="text-[#64748B]" />
                        Export CSV
                    </button>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                    label="Total Requests"
                    value="1,284"
                    meta="+3.2% vs previous period"
                    icon={<BarChart3 size={17} />}
                />

                <SummaryCard
                    label="Approved"
                    value="1,174"
                    meta="91.4% gross throughput"
                    status="APPROVED"
                />

                <SummaryCard
                    label="On Hold"
                    value="74"
                    meta="5.8% pending resolution"
                    status="ON HOLD"
                />

                <SummaryCard
                    label="Denied"
                    value="36"
                    meta="2.8% security rejections"
                    status="DENIED"
                />
            </section>

            <section className="rounded-lg border border-[#E2E8F0] bg-white p-6">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                    <div className="flex items-center gap-2">
                        <PieChartIcon size={18} className="text-[#64748B]" />

                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0F172A]">
                            Authorization Decisions Breakdown
                        </span>
                    </div>

                    <span className="font-mono text-[10px] text-[#64748B]">
                        METRIC_SET: DISPATCH_ACCURACY // N=1284
                    </span>
                </div>

                <div className="grid grid-cols-1 items-center gap-8 py-5 lg:grid-cols-12">
                    <div className="relative h-72 lg:col-span-5">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={decisionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={82}
                                    outerRadius={105}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {decisionData.map((entry) => (
                                        <Cell key={entry.name} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-semibold text-[#0F172A]">
                                1,284
                            </span>

                            <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                                Total Requests
                            </span>

                            <span className="mt-1 font-mono text-[10px] text-[#94A3B8]">
                                BERTH_B / 7D
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 lg:col-span-7">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <DecisionCard
                                label="Approved"
                                value="1,174"
                                meta="91.4% clearance share"
                                color="#0D9488"
                            />

                            <DecisionCard
                                label="On Hold"
                                value="74"
                                meta="5.8% pending protocol"
                                color="#D97706"
                            />

                            <DecisionCard
                                label="Denied"
                                value="36"
                                meta="2.8% security lockout"
                                color="#DC2626"
                            />
                        </div>

                        <div className="rounded border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                                <span className="text-[10px] font-semibold uppercase text-[#0F172A]">
                                    Operational Telemetry Diagnostics
                                </span>

                                <span className="font-mono text-[10px] font-medium text-[#0D9488]">
                                    CONFIDENCE: 99.8%
                                </span>
                            </div>

                            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <Diagnostic
                                    label="Resolution Latency"
                                    value="4.2 min avg"
                                    meta="-0.8m vs 14d rolling"
                                />

                                <Diagnostic
                                    label="Auto-Clearance Rate"
                                    value="94.1%"
                                    meta="RFID + Iris match engine"
                                />

                                <Diagnostic
                                    label="Manual Escalation"
                                    value="5.9%"
                                    meta="Officer Vance secondary"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-6">
                    <div className="border-b border-[#E2E8F0] pb-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0F172A]">
                                Request Activity Over Time
                            </span>

                            <span className="font-mono text-[10px] text-[#64748B]">
                                CYCLE: 7-DAY TRAJECTORY
                            </span>
                        </div>

                        <div className="mt-3 flex gap-5 font-mono text-[10px]">
                            <LegendItem color="#0D9488" label="Approved" />
                            <LegendItem color="#D97706" label="On Hold" />
                            <LegendItem color="#DC2626" label="Denied" />
                        </div>
                    </div>

                    <div className="mt-4 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={activityData}>
                                <CartesianGrid
                                    stroke="#E2E8F0"
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="day"
                                    tick={{ fontSize: 10, fill: "#94A3B8" }}
                                    tickLine={false}
                                    axisLine={{ stroke: "#CBD5E1" }}
                                />

                                <YAxis hide />

                                <Tooltip
                                    contentStyle={{
                                        border: "1px solid #E2E8F0",
                                        borderRadius: "6px",
                                        fontSize: "11px",
                                    }}
                                />

                                <Line
                                    dataKey="approved"
                                    stroke="#0D9488"
                                    strokeWidth={2.5}
                                    dot={{ r: 3, fill: "#0D9488" }}
                                />

                                <Line
                                    dataKey="hold"
                                    stroke="#D97706"
                                    strokeWidth={1.5}
                                    strokeDasharray="5 4"
                                    dot={false}
                                />

                                <Line
                                    dataKey="denied"
                                    stroke="#DC2626"
                                    strokeWidth={1.5}
                                    strokeDasharray="2 4"
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-3 font-mono text-[10px] text-[#64748B]">
                        <span>TREND: +12.4% PEAK TRAFFIC DENSITY (FRI-SUN)</span>
                        <span>LATENCY: NOMINAL</span>
                    </div>
                </div>

                <div className="rounded-lg border border-[#E2E8F0] bg-white p-6">
                    <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                        <div className="flex items-center gap-2">
                            <Building2 size={17} className="text-[#64748B]" />

                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0F172A]">
                                Requests by Location / Zone
                            </span>
                        </div>

                        <span className="font-mono text-[10px] text-[#64748B]">
                            ACTIVE SECTORS: 4
                        </span>
                    </div>

                    <div className="my-6 space-y-5">
                        {locationData.map((item) => (
                            <div key={item.name}>
                                <div className="mb-1 flex justify-between font-mono text-[10px] text-[#0F172A]">
                                    <span className="font-medium">{item.name}</span>

                                    <span>
                                        <strong>{item.value}</strong> req{" "}
                                        <span className="text-[#64748B]">
                                            ({item.percent})
                                        </span>
                                    </span>
                                </div>

                                <div className="h-3 w-full overflow-hidden bg-[#F1F5F9]">
                                    <div
                                        className="h-full"
                                        style={{
                                            width: item.width,
                                            backgroundColor: item.color,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-3 font-mono text-[10px] text-[#64748B]">
                        <span>PRIMARY LOAD: PORT GATE 17 CONTINUOUS</span>
                        <span>AGGREGATE: 1,284 UNITS</span>
                    </div>
                </div>
            </section>

            <section>
                <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShieldAlert size={18} className="text-[#64748B]" />

                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0F172A]">
                            Security Events & Irregularities
                        </span>
                    </div>

                    <span className="font-mono text-[10px] text-[#64748B]">
                        FLAGGED_EXCEPTIONS // CURRENT PERIOD
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SecurityCard
                        title="Location Mismatch"
                        value="18"
                        description="GPS triangulation delta > 250m"
                        critical
                    />

                    <SecurityCard
                        title="Device Mismatch"
                        value="7"
                        description="Unbound hardware IMEI / Key"
                        icon={<Smartphone size={18} />}
                    />

                    <SecurityCard
                        title="Recent SIM Swap"
                        value="5"
                        description="Carrier IMSI reset within 48h"
                        icon={<Smartphone size={18} />}
                    />

                    <SecurityCard
                        title="Replay Attempt"
                        value="2"
                        description="Stale NFC nonce sequence"
                        icon={<History size={18} />}
                    />
                </div>
            </section>

            <section className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0F172A]">
                        Recent Denied & Hold Incidents
                    </span>

                    <span className="font-mono text-[10px] text-[#64748B]">
                        FILTER: NON-APPROVED ONLY
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px] border-collapse text-left">
                        <thead>
                            <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9]">
                                {[
                                    "Request ID",
                                    "Employee / Operator",
                                    "Cargo / Resource",
                                    "Location",
                                    "Reason & Flag Code",
                                    "Decision",
                                    "Time",
                                ].map((heading) => (
                                    <th
                                        key={heading}
                                        className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-[#64748B]"
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#E2E8F0]">
                            {incidents.map((incident) => (
                                <tr
                                    key={incident.id}
                                    className="transition hover:bg-[#0D9488]/5"
                                >
                                    <td className="px-4 py-3 font-mono text-xs font-medium">
                                        {incident.id}
                                    </td>

                                    <td className="px-4 py-3 text-sm">
                                        {incident.employee}
                                    </td>

                                    <td className="px-4 py-3 font-mono text-[11px] text-[#64748B]">
                                        {incident.resource}
                                    </td>

                                    <td className="px-4 py-3 text-xs">
                                        {incident.location}
                                    </td>

                                    <td className="px-4 py-3 text-xs text-[#64748B]">
                                        {incident.reason}
                                    </td>

                                    <td className="px-4 py-3">
                                        <IncidentBadge decision={incident.decision} />
                                    </td>

                                    <td className="px-4 py-3 text-right font-mono text-xs text-[#64748B]">
                                        {incident.time}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
                    <span className="font-mono text-[10px] text-[#64748B]">
                        Showing 5 of 110 filtered incidents
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            disabled
                            className="rounded border border-[#E2E8F0] bg-white px-3 py-1 font-mono text-[10px] text-[#64748B] disabled:opacity-40"
                        >
                            PREV
                        </button>

                        <span className="font-mono text-[10px]">
                            1 / 22
                        </span>

                        <button className="rounded border border-[#E2E8F0] bg-white px-3 py-1 font-mono text-[10px] text-[#64748B] hover:border-[#0D9488]">
                            NEXT
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

function SummaryCard({
    label,
    value,
    meta,
    status,
    icon,
}: {
    label: string;
    value: string;
    meta: string;
    status?: string;
    icon?: React.ReactNode;
}) {
    return (
        <div className="rounded-lg border border-[#E2E8F0] bg-white p-4">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                    {label}
                </span>

                {status ? <IncidentBadge decision={status} /> : icon}
            </div>

            <div className="mt-4">
                <p className="text-2xl font-semibold text-[#0F172A]">
                    {value}
                </p>

                <p className="mt-1 font-mono text-[10px] text-[#64748B]">
                    {meta}
                </p>
            </div>
        </div>
    );
}

function DecisionCard({
    label,
    value,
    meta,
    color,
}: {
    label: string;
    value: string;
    meta: string;
    color: string;
}) {
    return (
        <div className="rounded border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <div className="flex items-center gap-2">
                <span
                    className="h-2.5 w-2.5"
                    style={{ backgroundColor: color }}
                />

                <span className="text-[10px] font-semibold uppercase text-[#64748B]">
                    {label}
                </span>
            </div>

            <p className="mt-2 text-xl font-semibold">{value}</p>

            <p className="mt-1 font-mono text-[10px] text-[#64748B]">
                {meta}
            </p>
        </div>
    );
}

function Diagnostic({
    label,
    value,
    meta,
}: {
    label: string;
    value: string;
    meta: string;
}) {
    return (
        <div>
            <span className="block text-[10px] font-semibold uppercase text-[#64748B]">
                {label}
            </span>

            <span className="font-mono text-xs font-semibold text-[#0F172A]">
                {value}
            </span>

            <span className="mt-1 block font-mono text-[10px] text-[#64748B]">
                {meta}
            </span>
        </div>
    );
}

function LegendItem({
    color,
    label,
}: {
    color: string;
    label: string;
}) {
    return (
        <span className="flex items-center gap-1.5">
            <span
                className="h-0.5 w-4"
                style={{ backgroundColor: color }}
            />
            {label}
        </span>
    );
}

function SecurityCard({
    title,
    value,
    description,
    icon,
    critical,
}: {
    title: string;
    value: string;
    description: string;
    icon?: React.ReactNode;
    critical?: boolean;
}) {
    return (
        <div className="flex items-start justify-between rounded-lg border border-[#E2E8F0] bg-white p-4">
            <div>
                <p className="text-[10px] font-semibold uppercase text-[#64748B]">
                    {title}
                </p>

                <p className="mt-1 text-xl font-semibold">{value}</p>

                <p className="mt-1 font-mono text-[10px] text-[#64748B]">
                    {description}
                </p>
            </div>

            {critical ? (
                <span className="rounded border border-[#FECACA] bg-[#FEF2F2] px-2 py-1 text-[9px] font-semibold text-[#DC2626]">
                    CRITICAL
                </span>
            ) : (
                <span className="text-[#64748B]">
                    {icon}
                </span>
            )}
        </div>
    );
}

function IncidentBadge({
    decision,
}: {
    decision: string;
}) {
    const isDenied = decision === "DENIED";
    const isHold =
        decision === "HOLD" || decision === "ON HOLD";

    const dot = isDenied
        ? "#DC2626"
        : isHold
            ? "#D97706"
            : "#0D9488";

    return (
        <span className="inline-flex items-center gap-1.5 rounded border border-[#E2E8F0] bg-white px-2 py-1 text-[9px] font-semibold uppercase text-[#0F172A]">
            <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: dot }}
            />

            {decision}
        </span>
    );
}