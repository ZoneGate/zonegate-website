"use client";

import {
    BadgeCheck,
    CalendarDays,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ClipboardCheck,
    Filter,
    Fingerprint,
    LockOpen,
    Scale,
    Search,
    ShieldAlert,
    ShieldCheck,
    SlidersHorizontal,
    Truck,
} from "lucide-react";
import { useMemo, useState } from "react";

type RequestStatus =
    | "PENDING"
    | "SECONDARY"
    | "APPROVED"
    | "DENIED";

type RequestItem = {
    id: string;
    initials: string;
    driver: string;
    license: string;
    carrier: string;
    dock: string;
    tier: string;
    time: string;
    status: RequestStatus;
};

const requests: RequestItem[] = [
    {
        id: "REQ-98042-TK",
        initials: "MV",
        driver: "Marcus Vance",
        license: "DL: #WA-992-801",
        carrier: "Horizon Global Transport",
        dock: "Zone A - Dock 02 (HAZ)",
        tier: "Tier 3 HAZMAT",
        time: "14:26:51",
        status: "PENDING",
    },
    {
        id: "REQ-98041-DS",
        initials: "DS",
        driver: "Daniel Stone",
        license: "DL: #CA-228-409",
        carrier: "Pacific Freight Systems",
        dock: "Zone C - Gate 11",
        tier: "Tier 2 Secure",
        time: "14:18:03",
        status: "SECONDARY",
    },
    {
        id: "REQ-98040-LR",
        initials: "LR",
        driver: "Lena Ruiz",
        license: "DL: #TX-718-113",
        carrier: "Atlas Port Logistics",
        dock: "Zone A - Dock 05",
        tier: "Tier 1 TWIC",
        time: "14:02:27",
        status: "APPROVED",
    },
    {
        id: "REQ-98039-AT",
        initials: "AT",
        driver: "Aaron Tate",
        license: "DL: #OR-782-531",
        carrier: "Northline Container Services",
        dock: "Zone D - Inspection Bay",
        tier: "Tier 2 Secure",
        time: "13:55:44",
        status: "DENIED",
    },
    {
        id: "REQ-98038-EK",
        initials: "EK",
        driver: "Evan Keller",
        license: "DL: #NV-190-672",
        carrier: "Cascadia Rail & Intermodal",
        dock: "Zone B - Berth 02",
        tier: "Tier 1 TWIC",
        time: "13:48:19",
        status: "APPROVED",
    },
];

const tabs = [
    "All Requests",
    "Pending Verification",
    "Secondary Inspection",
    "Cleared Today",
    "Denied",
];

export default function RequestsPage() {
    const [activeTab, setActiveTab] = useState("All Requests");
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState("REQ-98042-TK");

    const filteredRequests = useMemo(() => {
        return requests.filter((request) => {
            const text =
                `${request.id} ${request.driver} ${request.license} ${request.carrier} ${request.dock}`.toLowerCase();

            const matchesSearch = text.includes(search.toLowerCase());

            const matchesTab =
                activeTab === "All Requests" ||
                (activeTab === "Pending Verification" &&
                    request.status === "PENDING") ||
                (activeTab === "Secondary Inspection" &&
                    request.status === "SECONDARY") ||
                (activeTab === "Cleared Today" &&
                    request.status === "APPROVED") ||
                (activeTab === "Denied" &&
                    request.status === "DENIED");

            return matchesSearch && matchesTab;
        });
    }, [activeTab, search]);

    const selectedRequest =
        requests.find((request) => request.id === selectedId) ?? requests[0];

    return (
        <div className="flex w-full flex-col">
            <section className="mb-6 flex flex-col justify-between gap-4 rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:flex-row md:items-end">
                <div>
                    <div className="mb-1 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#0D9488]" />
                        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-[#64748B]">
                            Clearance Protocol // Queue Ingestion
                        </span>
                    </div>

                    <h1 className="text-3xl font-semibold uppercase tracking-[-0.03em] text-[#0F172A]">
                        Access & Manifest Requests
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm text-[#64748B]">
                        Inbound security clearance requests, bills of lading, and driver
                        identity verification queues.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 rounded border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-2">
                        <CalendarDays size={16} className="text-[#64748B]" />
                        <span className="font-mono text-xs text-[#0F172A]">
                            SHIFT B (08:00 - 16:00 UTC)
                        </span>
                    </div>

                    <button className="flex items-center gap-2 rounded bg-[#0D9488] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0F766E]">
                        <ClipboardCheck size={17} />
                        Submit New Manifest Clearance
                    </button>
                </div>
            </section>

            <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    label="Active Ingestion Queue"
                    value="42"
                    meta="Vehicles in dock"
                    icon={<ClipboardCheck size={18} />}
                    progress="w-2/3"
                />

                <MetricCard
                    label="Biometric Match Avg"
                    value="99.1%"
                    meta="Face & TWIC Hash"
                    icon={<Fingerprint size={18} />}
                    progress="w-[99%]"
                />

                <MetricCard
                    label="Secondary Escalations"
                    value="6"
                    meta="Bay 04 Inspection"
                    icon={<ShieldAlert size={18} />}
                    progress="w-1/4"
                    warning
                />

                <MetricCard
                    label="Today's Throughput"
                    value="124"
                    meta="Cargo BOL Units"
                    icon={<BadgeCheck size={18} />}
                    progress="w-4/5"
                />
            </section>

            <section className="mb-4 flex flex-col gap-4">
                <div className="flex flex-wrap gap-1 rounded-lg border border-[#E2E8F0] bg-white p-1 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                    {tabs.map((tab) => {
                        const active = activeTab === tab;

                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`rounded px-4 py-2 font-mono text-[11px] uppercase tracking-wide transition ${active
                                        ? "bg-[#0D9488] text-white"
                                        : "bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                                    }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:flex-row">
                    <div className="relative w-full md:w-96">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]"
                        />

                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="SEARCH MANIFEST ID, DRIVER NAME, PLATE NUMBER..."
                            className="w-full rounded border border-[#E2E8F0] bg-[#F8FAFC] py-2 pl-10 pr-3 font-mono text-[11px] text-[#0F172A] outline-none placeholder:text-[#64748B] focus:border-[#0D9488]"
                        />
                    </div>

                    <div className="flex w-full items-center justify-end gap-2 md:w-auto">
                        <button className="flex items-center gap-2 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 font-mono text-[11px] text-[#64748B]">
                            <Filter size={16} />
                            ZONE FILTER: ALL BERTHS
                        </button>

                        <button className="flex items-center gap-2 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 font-mono text-[11px] text-[#64748B]">
                            <SlidersHorizontal size={16} />
                            SORT: SUBMISSION DESC
                        </button>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
                <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] xl:col-span-8">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                                    {[
                                        "Request ID",
                                        "Driver / Operator",
                                        "Carrier / Line",
                                        "Access Dock",
                                        "Security Tier",
                                        "Time (UTC)",
                                        "Status",
                                        "Actions",
                                    ].map((heading) => (
                                        <th
                                            key={heading}
                                            className="px-4 py-3 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-[#64748B]"
                                        >
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#E2E8F0]">
                                {filteredRequests.map((request) => {
                                    const selected = request.id === selectedId;

                                    return (
                                        <tr
                                            key={request.id}
                                            onClick={() => setSelectedId(request.id)}
                                            className={`cursor-pointer transition ${selected
                                                    ? "border-l-4 border-l-[#0D9488] bg-[#F0FDFA]"
                                                    : "hover:bg-[#F8FAFC]"
                                                }`}
                                        >
                                            <td className="whitespace-nowrap px-4 py-4 font-mono text-xs font-medium">
                                                {selected && (
                                                    <span className="mr-1 rounded bg-[#0D9488] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                                        ACTIVE
                                                    </span>
                                                )}
                                                {request.id}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#CCFBF1] font-mono text-[11px] font-semibold text-[#0D9488]">
                                                        {request.initials}
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-semibold text-[#0F172A]">
                                                            {request.driver}
                                                        </p>
                                                        <p className="font-mono text-[10px] text-[#64748B]">
                                                            {request.license}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 text-sm text-[#64748B]">
                                                {request.carrier}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4">
                                                <span className="rounded bg-[#F1F5F9] px-2 py-1 font-mono text-[10px] text-[#0F172A]">
                                                    {request.dock}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 font-mono text-[10px] text-[#64748B]">
                                                {request.tier}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 text-right font-mono text-xs">
                                                {request.time}
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4">
                                                <StatusBadge status={request.status} />
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button className="rounded border border-[#E2E8F0] bg-white px-2 py-1 font-mono text-[10px] uppercase hover:bg-[#F8FAFC]">
                                                        Dossier
                                                    </button>

                                                    {request.status !== "DENIED" && (
                                                        <button className="rounded bg-[#0D9488] px-2 py-1 font-mono text-[10px] uppercase text-white hover:bg-[#0F766E]">
                                                            Admit
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-[#64748B]">
                        <span className="font-mono text-[10px]">
                            SHOWING 1-5 OF 42 QUEUED MANIFESTS
                        </span>

                        <div className="flex items-center gap-2">
                            <button className="flex h-7 w-7 items-center justify-center rounded border border-[#E2E8F0] bg-white">
                                <ChevronLeft size={16} />
                            </button>

                            <span className="font-mono text-[10px] font-medium text-[#0F172A]">
                                1 / 9
                            </span>

                            <button className="flex h-7 w-7 items-center justify-center rounded border border-[#E2E8F0] bg-white">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <aside className="flex flex-col gap-5 rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] xl:col-span-4">
                    <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
                        <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#64748B]">
                                Inspection Dossier
                            </p>

                            <h2 className="mt-1 text-lg font-semibold text-[#0F172A]">
                                {selectedRequest.id}
                            </h2>

                            <p className="mt-1 font-mono text-[10px] text-[#64748B]">
                                BOL #99024-C | HASH: 8f4a..19c0
                            </p>
                        </div>

                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0D9488]/30 bg-[#F0FDFA] px-2 py-1 font-mono text-[10px] font-semibold text-[#0D9488]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#1FD1A8]" />
                            VERIFIED READY
                        </span>
                    </div>

                    <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Fingerprint size={18} className="text-[#0D9488]" />
                                <span className="font-mono text-[10px] font-semibold uppercase">
                                    Driver Biometrics
                                </span>
                            </div>

                            <span className="font-mono text-xs font-semibold text-[#0D9488]">
                                99.4% MATCH
                            </span>
                        </div>

                        <div className="mt-3 flex items-center gap-3">
                            <div className="flex h-16 w-16 items-center justify-center rounded bg-[#E2E8F0]">
                                <Truck size={26} className="text-[#64748B]" />
                            </div>

                            <div>
                                <p className="font-semibold">{selectedRequest.driver}</p>
                                <p className="font-mono text-[10px] text-[#64748B]">
                                    TWIC CARD: EXP 2028-11
                                </p>
                                <p className="font-mono text-[10px] font-medium text-[#0D9488]">
                                    FED CLEARANCE: APPROVED
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <DataTile
                            label="Seal Integrity"
                            value="RFID MATCH"
                            meta="SEAL: #TG-8041-N"
                            icon={<ShieldCheck size={16} />}
                        />

                        <DataTile
                            label="Weight Readout"
                            value="42.0 TONS"
                            meta="TARE: WITHIN +0.2%"
                            icon={<Scale size={16} />}
                        />
                    </div>

                    <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                        <div className="flex justify-between">
                            <span className="font-mono text-[10px] uppercase text-[#64748B]">
                                Cargo Declaration
                            </span>
                            <span className="rounded bg-[#E2E8F0] px-2 py-0.5 font-mono text-[10px]">
                                CLASS 9 INDUSTRIAL
                            </span>
                        </div>

                        <p className="mt-3 text-sm font-medium">
                            Electronics & Industrial Switchgear (42 Tons)
                        </p>

                        <div className="mt-3 space-y-2 font-mono text-[10px] text-[#64748B]">
                            <InfoRow label="Container ID" value="MSKU-908124-7" />
                            <InfoRow label="Vehicle Chassis" value="FR-44-902 (TRIAXLE)" />
                            <InfoRow
                                label="Destination"
                                value="BERTH B - SUB-STATION 4"
                            />
                        </div>
                    </div>

                    <div className="relative flex h-36 items-end overflow-hidden rounded-lg border border-[#E2E8F0] bg-[#0F172A] p-3">
                        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(15,23,42,0.95),rgba(15,23,42,0.25))]" />

                        <div className="relative z-10 flex w-full items-center justify-between">
                            <span className="font-mono text-[10px] text-white">
                                LPR CAM-04: PLATE MATCH WA-9921-TK
                            </span>

                            <span className="rounded bg-[#0D9488] px-2 py-0.5 font-mono text-[10px] font-semibold text-white">
                                SYNCED
                            </span>
                        </div>
                    </div>

                    <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                        <div className="flex justify-between">
                            <span className="font-mono text-[10px] uppercase text-[#64748B]">
                                Security Observation
                            </span>

                            <span className="font-mono text-[10px] text-[#64748B]">
                                14:20 UTC
                            </span>
                        </div>

                        <p className="mt-2 text-xs italic text-[#0F172A]">
                            “Driver presented valid TWIC credential and digital manifest
                            hash. Seal visual inspection confirms untampered status on rear
                            locks. Cleared for Berth 02 approach.”
                        </p>

                        <p className="mt-2 text-right font-mono text-[10px] text-[#64748B]">
                            — GATE INSPECTOR K. VANCE
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button className="flex-1 rounded border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium hover:bg-[#F8FAFC]">
                            Flag Secondary
                        </button>

                        <button className="flex flex-1 items-center justify-center gap-2 rounded bg-[#0D9488] px-4 py-2 text-sm font-medium text-white hover:bg-[#0F766E]">
                            <LockOpen size={16} />
                            Admit to Berth
                        </button>
                    </div>
                </aside>
            </section>
        </div>
    );
}

function MetricCard({
    label,
    value,
    meta,
    icon,
    progress,
    warning = false,
}: {
    label: string;
    value: string;
    meta: string;
    icon: React.ReactNode;
    progress: string;
    warning?: boolean;
}) {
    return (
        <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#64748B]">
                    {label}
                </span>
                <span className="text-[#64748B]">{icon}</span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-semibold">{value}</span>
                <span className="font-mono text-[10px] text-[#64748B]">
                    {meta}
                </span>
            </div>

            <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#E2E8F0]">
                <div
                    className={`h-full ${progress} ${warning ? "bg-[#D97706]" : "bg-[#0D9488]"
                        }`}
                />
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: RequestStatus }) {
    const styles = {
        PENDING:
            "border-[#FEF3C7] bg-[#FFFBEB] text-[#B45309]",
        SECONDARY:
            "border-[#FEF3C7] bg-[#FFFBEB] text-[#B45309]",
        APPROVED:
            "border-[#CCFBF1] bg-[#F0FDFA] text-[#0F766E]",
        DENIED:
            "border-[#FEE2E2] bg-[#FEF2F2] text-[#B91C1C]",
    };

    const dots = {
        PENDING: "bg-[#D97706]",
        SECONDARY: "bg-[#D97706]",
        APPROVED: "bg-[#0D9488]",
        DENIED: "bg-[#DC2626]",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 font-mono text-[10px] ${styles[status]}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} />
            {status}
        </span>
    );
}

function DataTile({
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
        <div className="rounded border border-[#E2E8F0] bg-[#F8FAFC] p-3">
            <p className="font-mono text-[10px] uppercase text-[#64748B]">
                {label}
            </p>

            <div className="mt-1 flex items-center gap-1 text-[#0D9488]">
                {icon}
                <span className="font-mono text-xs font-medium text-[#0F172A]">
                    {value}
                </span>
            </div>

            <p className="mt-1 font-mono text-[10px] text-[#64748B]">
                {meta}
            </p>
        </div>
    );
}

function InfoRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex justify-between border-b border-[#E2E8F0] pb-1 last:border-b-0">
            <span>{label.toUpperCase()}</span>
            <span className="font-medium text-[#0F172A]">{value}</span>
        </div>
    );
}