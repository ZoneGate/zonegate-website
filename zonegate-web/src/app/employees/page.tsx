"use client";

import {
    BadgeCheck,
    Ban,
    Download,
    Gavel,
    MoreVertical,
    Search,
    ShieldCheck,
    Timer,
    Truck,
} from "lucide-react";
import { useMemo, useState } from "react";

type TelemetryStatus = "APPROVED" | "HOLD" | "DENIED";

type Personnel = {
    id: string;
    initials: string;
    name: string;
    role: string;
    affiliation: string;
    clearance: string;
    expiration: string;
    checkpoint: string;
    ago: string;
    telemetry: TelemetryStatus;
};

const personnel: Personnel[] = [
    {
        id: "ZG-88219",
        initials: "EV",
        name: "E. VANDERBILT",
        role: "Chief Berth Auditor",
        affiliation: "PACIFIC PORT AUTH",
        clearance: "L3 // HAZMAT-HV",
        expiration: "2027-11-04",
        checkpoint: "GATE-04 NORTH",
        ago: "06 MINS AGO",
        telemetry: "APPROVED",
    },
    {
        id: "ZG-91042",
        initials: "MA",
        name: "M. ALVAREZ-GARCIA",
        role: "Priority Courier [CDL-A]",
        affiliation: "FEDEX FREIGHT LOGISTICS",
        clearance: "L2 // BERTH CARGO",
        expiration: "2025-06-30",
        checkpoint: "GATE-01 SOUTH INBOUND",
        ago: "19 MINS AGO",
        telemetry: "APPROVED",
    },
    {
        id: "ZG-77402",
        initials: "DK",
        name: "D. KOWALSKI",
        role: "Craneway Systems Specialist",
        affiliation: "MAINT & STRUCTURAL SVCS",
        clearance: "L3 // HEAVY EQUIP",
        expiration: "2025-05-18 [14H]",
        checkpoint: "GANTRY CRANE B-09",
        ago: "42 MINS AGO",
        telemetry: "HOLD",
    },
    {
        id: "ZG-66014",
        initials: "SO",
        name: "S. OKOYE",
        role: "Dangerous Goods Assessor",
        affiliation: "MARITIME HAZMAT COMM",
        clearance: "L3 // HAZMAT-BIO",
        expiration: "2026-08-15",
        checkpoint: "CHEMICAL BUNKER C-2",
        ago: "1H 12M AGO",
        telemetry: "APPROVED",
    },
    {
        id: "ZG-10923",
        initials: "TL",
        name: "T. LIN",
        role: "Contract Intermodal Driver",
        affiliation: "COSCO CONTAINER LINE",
        clearance: "L1 // YARD RUNNER",
        expiration: "2025-05-10",
        checkpoint: "PERIMETER TURNSTILE E",
        ago: "2H 04M AGO",
        telemetry: "DENIED",
    },
    {
        id: "ZG-44190",
        initials: "RH",
        name: "R. HAWTHORNE",
        role: "Substation Transformer Tech",
        affiliation: "PACIFIC POWER & LIGHT",
        clearance: "L3 // HIGH-VOLTAGE",
        expiration: "2026-03-21",
        checkpoint: "SUB-STATION 04 VAULT",
        ago: "2H 45M AGO",
        telemetry: "APPROVED",
    },
    {
        id: "ZG-55104",
        initials: "AP",
        name: "A. PETROV",
        role: "Reefer Container Specialist",
        affiliation: "MAERSK GROUND OPS",
        clearance: "L2 // REFRIG DOCK",
        expiration: "2025-12-31",
        checkpoint: "GATE-02 COMMERCIAL",
        ago: "3H 10M AGO",
        telemetry: "APPROVED",
    },
    {
        id: "ZG-30419",
        initials: "KJ",
        name: "K. JENSEN",
        role: "Customs Manifest Officer",
        affiliation: "PORT ENFORCEMENT DIV",
        clearance: "L1 // ADMIN WING",
        expiration: "2027-01-15",
        checkpoint: "MAIN CUSTOMS LOBBY",
        ago: "4H 18M AGO",
        telemetry: "APPROVED",
    },
];

const auditEvents = [
    {
        time: "14:27:54.08 UTC",
        code: "SCAN_PASS",
        person: "ZG-88219 (E. VANDERBILT)",
        location: "GATE-04 NORTH",
        detail: "METHOD: DUAL_IRIS_OPTICAL",
        result: "MATCH 99.4%",
        tone: "success",
    },
    {
        time: "14:26:12.82 UTC",
        code: "VEHICLE_TRIP",
        person: "ZG-91042 (M. ALVAREZ)",
        location: "PORTAL 01 SOUTH",
        detail: "PLATE: CA-899120K",
        result: "GROSS 24,180 KG",
        tone: "neutral",
    },
    {
        time: "14:21:04.19 UTC",
        code: "INTERLOCK_TRIP",
        person: "ZG-10923 (T. LIN)",
        location: "TURNSTILE E",
        detail: "ERR: TOKEN_EXPIRED_20250510",
        result: "BARRIER HELD",
        tone: "danger",
    },
    {
        time: "14:15:39.90 UTC",
        code: "HAZMAT_KEY",
        person: "ZG-66014 (S. OKOYE)",
        location: "BUNKER C-2",
        detail: "METHOD: SECURE_NFC_PIN",
        result: "VAULT DOOR OPENED",
        tone: "success",
    },
    {
        time: "14:02:11.41 UTC",
        code: "CRANE_CABIN",
        person: "ZG-77402 (D. KOWALSKI)",
        location: "CRANE B-09",
        detail: "PRE-EXPIRY NOTIFICATION",
        result: "ISSUED TERMINAL BELL",
        tone: "warning",
    },
    {
        time: "13:58:04.22 UTC",
        code: "HV_INTERLOCK",
        person: "ZG-44190 (R. HAWTHORNE)",
        location: "SUBSTATION 04",
        detail: "DUAL_TECH_SIGN_REQ",
        result: "VERIFIED AUTO-OFFLINE",
        tone: "success",
    },
];

export default function EmployeesPage() {
    const [search, setSearch] = useState("");
    const [affiliation, setAffiliation] = useState("ALL");
    const [clearance, setClearance] = useState("ALL");
    const [biometrics, setBiometrics] = useState("ALL");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [showSyslog, setShowSyslog] = useState(false);
    const [editingPermissions, setEditingPermissions] = useState(false);
    const [actionMessage, setActionMessage] = useState("");
    const [permissionTier, setPermissionTier] = useState("L1");
    const [escortEnabled, setEscortEnabled] = useState(true);

    const filteredPersonnel = useMemo(() => {
        return personnel.filter((person) => {
            const text = `${person.name} ${person.id} ${person.role} ${person.affiliation} ${person.checkpoint}`.toLowerCase();

            const searchMatch = text.includes(search.toLowerCase());

            const affiliationMatch =
                affiliation === "ALL" ||
                person.affiliation.includes(affiliation);

            const clearanceMatch =
                clearance === "ALL" ||
                person.clearance.startsWith(clearance);

            return searchMatch && affiliationMatch && clearanceMatch;
        });
    }, [search, affiliation, clearance]);

    const selectedPerson = personnel.find((person) => person.id === selectedId);
    const totalPages = 74;

    function batchRevoke() {
        if (!filteredPersonnel.length) {
            setActionMessage("No personnel match the current filters.");
            return;
        }
        const confirmed = window.confirm(`Revoke access for ${filteredPersonnel.length} filtered personnel?`);
        if (!confirmed) return;
        setActionMessage(`Access revoked for ${filteredPersonnel.length} filtered personnel.`);
    }

    function issueAccessPass() {
        const name = window.prompt("Enter the person's full name:");
        if (!name?.trim()) return;
        const id = `ZG-${Math.floor(10000 + Math.random() * 90000)}`;
        setActionMessage(`Access pass ${id} issued for ${name.trim()}.`);
    }

    function exportLedger() {
        const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
        const rows = [
            ["Personnel ID", "Name", "Role", "Affiliation", "Clearance", "Expiration", "Checkpoint", "Telemetry"],
            ...filteredPersonnel.map((person) => [person.id, person.name, person.role, person.affiliation, person.clearance, person.expiration, person.checkpoint, person.telemetry]),
        ];
        const blob = new Blob([`\uFEFF${rows.map((row) => row.map(escape).join(",")).join("\r\n")}`], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "zonegate-personnel-ledger.csv";
        link.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="flex w-full flex-col">
            <section className="mb-6 flex flex-col gap-4">
                <div className="flex flex-col justify-between gap-4 rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm lg:flex-row lg:items-end">
                    <div>
                        <div className="mb-1 flex items-center gap-1.5 text-[#64748B]">
                            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#0D9488]">
                                SYSTEM DIRECTORY // SEC-AUTH-094
                            </span>

                            <span className="text-[#CBD5E1]">/</span>

                            <span className="font-mono text-[11px]">
                                BIO-VAULT REVISION 8.4
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold uppercase tracking-tight text-[#0F172A]">
                            Couriers & Personnel Access Directory
                        </h1>

                        <p className="mt-1 max-w-2xl text-sm text-[#64748B]">
                            Active credentials, biometric authorizations, and contractor
                            access permissions across Terminal Berth B perimeter checkpoints.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button type="button" onClick={batchRevoke} className="flex items-center gap-1.5 rounded border border-[#E2E8F0] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#0F172A] transition hover:bg-[#F1F5F9]">
                            <Ban size={16} className="text-[#64748B]" />
                            Batch Revoke
                        </button>

                        <button type="button" onClick={issueAccessPass} className="flex items-center gap-1.5 rounded bg-[#0D9488] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#0F766E]">
                            <BadgeCheck size={16} />
                            Issue Access Pass
                        </button>
                    </div>
                </div>
                {actionMessage && <p role="status" className="text-xs text-[#0F766E]">{actionMessage}</p>}

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <MetricCard
                        label="Active Credentials"
                        value="1,840"
                        meta="VALID"
                        icon={<ShieldCheck size={18} />}
                        progress="94%"
                    />

                    <MetricCard
                        label="Couriers On Site"
                        value="64"
                        meta="TRANSIENT"
                        icon={<Truck size={18} />}
                        progress="42%"
                        dark
                    />

                    <MetricCard
                        label="Expiring < 48H"
                        value="12"
                        meta="REQUIRES RE-CERT"
                        icon={<Timer size={18} />}
                        progress="16%"
                        warning
                    />

                    <MetricCard
                        label="Suspended / Flagged"
                        value="03"
                        meta="LOCKOUT"
                        icon={<Gavel size={18} />}
                        progress="4%"
                        danger
                    />
                </div>
            </section>

            <section className="mb-4 flex flex-col justify-between gap-3 rounded-lg border border-[#E2E8F0] bg-white p-3.5 shadow-sm lg:flex-row lg:items-center">
                <div className="flex flex-1 flex-wrap items-center gap-2.5">
                    <div className="relative min-w-[240px] flex-1">
                        <Search
                            size={18}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#64748B]"
                        />

                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="FILTER BY ID, NAME, TAX-ID, OR VEHICLE PLATE..."
                            className="w-full rounded border border-[#E2E8F0] bg-[#F8FAFC] py-1.5 pl-9 pr-3 font-mono text-xs text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#0D9488] focus:bg-white"
                        />
                    </div>

                    <FilterSelect
                        label="AFFILIATION:"
                        value={affiliation}
                        onChange={setAffiliation}
                        options={[
                            ["ALL", "ALL OPERATORS"],
                            ["PACIFIC", "PACIFIC PORT AUTH"],
                            ["FEDEX", "FEDEX FREIGHT CORP"],
                            ["MAERSK", "MAERSK GROUND OPS"],
                        ]}
                    />

                    <FilterSelect
                        label="CLEARANCE:"
                        value={clearance}
                        onChange={setClearance}
                        options={[
                            ["ALL", "ANY TIER"],
                            ["L1", "LEVEL 1 - GENERAL"],
                            ["L2", "LEVEL 2 - SECURED BERTH"],
                            ["L3", "LEVEL 3 - HAZMAT / HV"],
                        ]}
                    />

                    <FilterSelect
                        label="BIOMETRICS:"
                        value={biometrics}
                        onChange={setBiometrics}
                        options={[
                            ["ALL", "ALL STATES"],
                            ["VALID", "IRIS + FINGERPRINT VERIFIED"],
                            ["MISSING", "PENDING RETINAL SCAN"],
                        ]}
                    />
                </div>

                <div className="flex items-center justify-between gap-3 lg:justify-end">
                    <span className="font-mono text-xs text-[#64748B]">
                        SHOWING {filteredPersonnel.length} OF 1,840
                    </span>

                    <button type="button" onClick={exportLedger} className="flex items-center gap-1.5 rounded border border-[#E2E8F0] bg-white px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#0F172A] transition hover:bg-[#F1F5F9]">
                        <Download size={16} className="text-[#64748B]" />
                        Export Ledger
                    </button>
                </div>
            </section>

            <section className="flex flex-col gap-5">
                <div className="flex w-full flex-col gap-4">
                    <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full table-fixed text-left [overflow-wrap:anywhere]">
                                <thead>
                                    <tr className="border-b border-[#E2E8F0] bg-[#F1F5F9] font-mono text-[11px] uppercase tracking-wider text-[#64748B]">
                                        {[
                                            "Personnel Identifier",
                                            "Affiliation / Role",
                                            "Clearance Tier",
                                            "Expiration",
                                            "Last Checkpoint",
                                            "Telemetry",
                                            "Action",
                                        ].map((heading) => (
                                            <th
                                                key={heading}
                                                className="px-4 py-3 font-semibold last:text-right"
                                            >
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-[#E2E8F0] text-xs">
                                    {filteredPersonnel.map((person) => {
                                        const selected = person.id === selectedId;

                                        return (
                                            <tr
                                                key={person.id}
                                                onClick={() => {
                                                    setSelectedId(person.id);
                                                    window.setTimeout(() => document.getElementById("active-dossier")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
                                                }}
                                                className={`cursor-pointer transition hover:bg-[#F8FAFC] ${selected ? "bg-[#F0FDFA]" : ""
                                                    }`}
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded border border-[#E2E8F0] bg-[#F1F5F9] font-mono text-xs font-semibold text-[#64748B]">
                                                            {person.initials}
                                                        </div>

                                                        <div>
                                                            <p className="font-semibold text-[#0F172A]">
                                                                {person.name}
                                                            </p>

                                                            <p className="font-mono text-[11px] text-[#64748B]">
                                                                {person.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-[#0F172A]">
                                                        {person.role}
                                                    </p>

                                                    <p className="font-mono text-[10px] uppercase tracking-wider text-[#64748B]">
                                                        {person.affiliation}
                                                    </p>
                                                </td>

                                                <td className="px-4 py-3">
                                                    <span className="rounded border border-[#E2E8F0] bg-[#F1F5F9] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-[#0F172A]">
                                                        {person.clearance}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`font-mono text-xs ${person.telemetry === "DENIED"
                                                                ? "text-[#94A3B8] line-through"
                                                                : person.telemetry === "HOLD"
                                                                    ? "font-semibold text-[#DC2626]"
                                                                    : "text-[#0F172A]"
                                                            }`}
                                                    >
                                                        {person.expiration}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3">
                                                    <p className="font-mono text-xs text-[#0F172A]">
                                                        {person.checkpoint}
                                                    </p>

                                                    <p className="font-mono text-[10px] text-[#64748B]">
                                                        {person.ago}
                                                    </p>
                                                </td>

                                                <td className="px-4 py-3">
                                                    <StatusBadge status={person.telemetry} />
                                                </td>

                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        aria-label="Personnel actions"
                                                        className="rounded p-1 text-[#64748B] transition hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                                                    >
                                                        <MoreVertical size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#E2E8F0] bg-[#F1F5F9] p-3 sm:flex-row">
                            <div className="flex items-center gap-2 font-mono text-xs font-medium text-[#64748B]">
                                <span>ROWS PER PAGE: 25</span>
                                <span>•</span>
                                <span>PAGE {page} OF {totalPages}</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                                    disabled={page === 1}
                                    className="rounded border border-[#E2E8F0] bg-white px-2.5 py-1 font-mono text-xs text-[#64748B] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    PREV
                                </button>

                                <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page === totalPages} className="rounded border border-[#E2E8F0] bg-white px-2.5 py-1 font-mono text-xs font-medium text-[#0F172A] hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50">
                                    NEXT
                                </button>
                            </div>
                        </div>
                    </div>


                </div>

                <aside className="flex w-full flex-col gap-4">
                    <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F1F5F9] p-3.5">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-[#0D9488]" />

                                <span className="font-mono text-xs font-bold uppercase tracking-wider">
                                    Credential Audit Log
                                </span>
                            </div>

                            <span className="font-mono text-[11px] font-medium uppercase text-[#64748B]">
                                SYS_STREAM // 100HZ
                            </span>
                        </div>

                        <div className="max-h-[640px] space-y-2.5 overflow-y-auto p-3.5">
                            {auditEvents.map((event) => (
                                <AuditEvent key={event.time} event={event} />
                            ))}
                        </div>

                        <div className="border-t border-[#E2E8F0] bg-[#F1F5F9] p-3">
                            <button type="button" aria-expanded={showSyslog} onClick={() => setShowSyslog((value) => !value)} className="w-full rounded border border-[#E2E8F0] bg-white py-1.5 text-center font-mono text-xs font-semibold uppercase text-[#0F172A] transition hover:bg-[#F8FAFC]">
                                Launch Raw Syslog Stream (&gt;_ TTY)
                            </button>
                            {showSyslog && <pre className="mt-2 max-h-48 overflow-auto rounded bg-[#0F172A] p-3 font-mono text-[10px] leading-relaxed text-[#CCFBF1]" role="log">{auditEvents.slice(0, 6).map((event) => `${event.time}Z ${event.code} ${event.person} ${event.detail} ${event.result}`).join("\n")}</pre>}
                        </div>
                    </div>

                    {selectedPerson && <div id="active-dossier" className="flex scroll-mt-20 flex-col gap-3.5 rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                                Active Dossier Preview
                            </span>

                            <span className="rounded border border-[#99F6E4] bg-[#F0FDFA] px-2 py-0.5 font-mono text-xs font-semibold text-[#0D9488]">
                                {selectedPerson.id}
                            </span>
                        </div>

                        <div className="flex items-center gap-3.5">
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-[#0D9488] bg-[#F1F5F9] font-mono text-base font-bold text-[#64748B]">
                                {selectedPerson.initials}
                            </div>

                            <div>
                                <p className="text-lg font-bold leading-tight text-[#0F172A]">
                                    {selectedPerson.name}
                                </p>

                                <p className="text-xs text-[#64748B]">
                                    {selectedPerson.affiliation}{" // Logistics Div"}
                                </p>

                                <p className="mt-1 font-mono text-xs font-semibold text-[#0D9488]">
                                    NFC-UID: 04:A2:89:FE:19:66
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 rounded border border-[#E2E8F0] bg-[#F8FAFC] p-3 font-mono text-xs">
                            <DossierItem
                                label="Biometric Vault"
                                value="DUAL IRIS ENROLLED"
                            />

                            <DossierItem
                                label="Escort Privilege"
                                value="AUTHORIZED [CLASS A]"
                            />

                            <DossierItem
                                label="Security Clearance"
                                value={selectedPerson.clearance}
                            />

                            <DossierItem
                                label="Issued By"
                                value="COMMISSIONER VANCE"
                            />
                        </div>

                        <div className="flex gap-2.5 pt-1">
                            <button type="button" onClick={() => { if (editingPermissions) setActionMessage(`Permissions saved: ${permissionTier} clearance, escort ${escortEnabled ? "enabled" : "disabled"}.`); else setActionMessage(""); setEditingPermissions((value) => !value); }} className="flex-1 rounded bg-[#0D9488] py-2 font-mono text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#0F766E]">
                                {editingPermissions ? "Save Permissions" : "Modify Permissions"}
                            </button>

                            <button type="button" onClick={() => { window.print(); setActionMessage("Print dialog opened for this smart badge."); }} className="flex-1 rounded border border-[#E2E8F0] bg-white py-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#0F172A] transition hover:bg-[#F1F5F9]">
                                Print Smart Badge
                            </button>
                        </div>
                        {editingPermissions && <div className="grid grid-cols-1 gap-3 rounded border border-[#CCFBF1] bg-[#F0FDFA] p-3 sm:grid-cols-2">
                            <label className="flex flex-col gap-1 text-[10px] font-semibold uppercase text-[#0F766E]">Clearance tier
                                <select value={permissionTier} onChange={(event) => setPermissionTier(event.target.value)} className="rounded border border-[#99F6E4] bg-white px-2 py-2 font-mono text-xs text-[#0F172A]">
                                    <option>L1</option><option>L2</option><option>L3</option>
                                </select>
                            </label>
                            <label className="flex items-center gap-2 self-end text-xs text-[#0F766E]"><input type="checkbox" checked={escortEnabled} onChange={(event) => setEscortEnabled(event.target.checked)} className="accent-[#0D9488]" /> Escort privilege enabled</label>
                        </div>}
                        {actionMessage && <p role="status" className="text-xs text-[#64748B]">{actionMessage}</p>}
                    </div>}
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
    dark,
    warning,
    danger,
}: {
    label: string;
    value: string;
    meta: string;
    icon: React.ReactNode;
    progress: string;
    dark?: boolean;
    warning?: boolean;
    danger?: boolean;
}) {
    const bar = danger
        ? "#DC2626"
        : warning
            ? "#D97706"
            : dark
                ? "#0F172A"
                : "#0D9488";

    const accent = danger
        ? "text-[#DC2626]"
        : warning
            ? "text-[#D97706]"
            : "text-[#0D9488]";

    return (
        <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                    {label}
                </span>

                <span className={accent}>{icon}</span>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
                <span
                    className={`font-mono text-2xl font-bold ${danger ? "text-[#DC2626]" : "text-[#0F172A]"
                        }`}
                >
                    {value}
                </span>

                <span
                    className={`font-mono text-[11px] font-semibold ${danger
                            ? "text-[#DC2626]"
                            : warning
                                ? "text-[#D97706]"
                                : "text-[#64748B]"
                        }`}
                >
                    {meta}
                </span>
            </div>

            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                <div
                    className="h-full rounded-full"
                    style={{ width: progress, backgroundColor: bar }}
                />
            </div>
        </div>
    );
}

function FilterSelect({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: [string, string][];
}) {
    return (
        <div className="flex items-center gap-1.5 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1.5">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                {label}
            </span>

            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="cursor-pointer bg-transparent font-mono text-xs font-medium text-[#0F172A] outline-none"
            >
                {options.map(([optionValue, optionLabel]) => (
                    <option key={optionValue} value={optionValue}>
                        {optionLabel}
                    </option>
                ))}
            </select>
        </div>
    );
}

function StatusBadge({ status }: { status: TelemetryStatus }) {
    const style =
        status === "APPROVED"
            ? "border-[#99F6E4] bg-[#F0FDFA] text-[#0F766E]"
            : status === "HOLD"
                ? "border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]"
                : "border-[#FECDD3] bg-[#FFF1F2] text-[#B91C1C]";

    const dot =
        status === "APPROVED"
            ? "bg-[#0D9488]"
            : status === "HOLD"
                ? "bg-[#D97706]"
                : "bg-[#DC2626]";

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${style}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
            {status}
        </span>
    );
}

function AuditEvent({
    event,
}: {
    event: {
        time: string;
        code: string;
        person: string;
        location: string;
        detail: string;
        result: string;
        tone: string;
    };
}) {
    const danger = event.tone === "danger";
    const warning = event.tone === "warning";
    const success = event.tone === "success";

    return (
        <div
            className={`flex flex-col gap-1 rounded border p-2.5 ${danger
                    ? "border-[#FECDD3] bg-[#FFF1F2]"
                    : "border-[#E2E8F0] bg-[#F8FAFC]"
                }`}
        >
            <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-[#64748B]">
                    {event.time}
                </span>

                <span
                    className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${danger
                            ? "bg-[#FFE4E6] text-[#DC2626]"
                            : success
                                ? "border border-[#99F6E4] bg-[#F0FDFA] text-[#0F766E]"
                                : "border border-[#E2E8F0] bg-[#F1F5F9] text-[#0F172A]"
                        }`}
                >
                    {event.code}
                </span>
            </div>

            <div className="flex items-center justify-between text-[#0F172A]">
                <span className="font-mono text-xs font-semibold">
                    {event.person}
                </span>

                <span className="font-mono text-[11px] text-[#64748B]">
                    {event.location}
                </span>
            </div>

            <div className="flex items-center justify-between font-mono text-[11px] text-[#64748B]">
                <span
                    className={
                        danger
                            ? "font-semibold text-[#DC2626]"
                            : warning
                                ? "text-[#D97706]"
                                : ""
                    }
                >
                    {event.detail}
                </span>

                <span className={success ? "font-semibold text-[#0D9488]" : ""}>
                    {event.result}
                </span>
            </div>
        </div>
    );
}

function DossierItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <span className="block font-mono text-[10px] font-semibold uppercase text-[#64748B]">
                {label}
            </span>

            <span className="font-semibold text-[#0F172A]">
                {value}
            </span>
        </div>
    );
}
