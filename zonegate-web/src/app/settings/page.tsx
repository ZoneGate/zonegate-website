"use client";

import {
    Bell,
    CheckSquare,
    Download,
    Gavel,
    Lock,
    MapPin,
    MoreHorizontal,
    Plus,
    RefreshCw,
    Server,
    Settings2,
    ShieldCheck,
} from "lucide-react";
import { useState } from "react";

const zones = [
    {
        name: "Port Gate 17",
        code: "BERTH-B // LANES 01-04",
        type: "Port Turnstile & Barrier",
        staff: "24 Staff",
    },
    {
        name: "Warehouse A",
        code: "COLD-STORAGE FACILITY",
        type: "High-Density Warehouse",
        staff: "18 Staff",
    },
    {
        name: "Warehouse B",
        code: "BONDED SECURE YARD",
        type: "High-Density Warehouse",
        staff: "12 Staff",
    },
    {
        name: "Loading Zone 3",
        code: "GANTRY CRANE PLATFORM 03",
        type: "Loading & Staging Area",
        staff: "9 Staff",
    },
];

const policies = [
    {
        id: "01",
        rule: "Location verification failed (Out of boundary coordinate)",
        decision: "DENY",
    },
    {
        id: "02",
        rule: "Number verification failed or permission mismatch",
        decision: "DENY",
    },
    {
        id: "03",
        rule: "High-value cargo request outside authorized shift window",
        decision: "HOLD",
    },
    {
        id: "04",
        rule: "Recent SIM swap detected on high-value transaction",
        decision: "HOLD",
    },
    {
        id: "05",
        rule: "All mandatory evidence verified successfully",
        decision: "APPROVE",
    },
];

export default function SettingsPage() {
    const [defaultView, setDefaultView] = useState("all");

    const [securitySettings, setSecuritySettings] = useState({
        deterministic: true,
        manualApproval: true,
        deviceBinding: true,
        anomalyLockout: true,
    });

    const [notifications, setNotifications] = useState({
        denied: true,
        hold: true,
        nodeOffline: true,
        policyChanges: false,
    });

    return (
        <div className="flex w-full flex-col gap-6">
            {/* PAGE HEADER */}
            <section className="flex flex-col justify-between gap-4 border-b border-[#E2E8F0] pb-5 lg:flex-row lg:items-end">
                <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#64748B]">
                        <span>Configuration & Policy Engine</span>
                        <span>//</span>
                        <span>NODE_T4_CONF</span>
                        <span>//</span>
                        <span className="font-semibold text-[#0D9488]">
                            System Integrity Verified
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-semibold uppercase tracking-tight text-[#0F172A]">
                            Settings
                        </h1>

                        <span className="hidden items-center gap-1.5 rounded border border-[#E2E8F0] bg-white px-2 py-1 font-mono text-[10px] sm:inline-flex">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#0D9488]" />
                            SYS.NOMINAL
                        </span>
                    </div>

                    <p className="mt-2 text-sm text-[#64748B]">
                        Manage operational zones, authorization policies, security
                        boundaries, and gate access protocols.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button className="flex items-center gap-2 rounded border border-[#E2E8F0] bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-wider transition hover:border-[#0F172A]">
                        <Download size={15} className="text-[#64748B]" />
                        Export Config (.json)
                    </button>

                    <button className="flex items-center gap-2 rounded border border-[#E2E8F0] bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-wider transition hover:border-[#0F172A]">
                        <RefreshCw size={15} className="text-[#64748B]" />
                        Commit Node
                    </button>
                </div>
            </section>

            <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                {/* LEFT NAV */}
                <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:col-span-3">
                    <div className="rounded-lg border border-[#E2E8F0] bg-white p-2 shadow-sm">
                        <div className="border-b border-[#E2E8F0] px-3 py-2">
                            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                                Control Subsections
                            </span>
                        </div>

                        <nav className="flex flex-col gap-1 pt-2">
                            <SubNavItem
                                href="#general"
                                icon={<Settings2 size={16} />}
                                label="General"
                                active
                            />

                            <SubNavItem
                                href="#zones"
                                icon={<MapPin size={16} />}
                                label="Locations & Zones"
                                meta="4"
                            />

                            <SubNavItem
                                href="#policies"
                                icon={<Gavel size={16} />}
                                label="Authorization Policies"
                                meta="5"
                            />

                            <SubNavItem
                                href="#security"
                                icon={<Lock size={16} />}
                                label="Security"
                                dot
                            />

                            <SubNavItem
                                href="#notifications"
                                icon={<Bell size={16} />}
                                label="Notifications"
                                meta="7 ACT"
                            />
                        </nav>
                    </div>

                    {/* HARDWARE NODE */}
                    <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                            <span className="font-mono text-[10px] uppercase text-[#64748B]">
                                Hardware Node ID
                            </span>

                            <span className="font-mono text-[11px] text-[#0F172A]">
                                ZK-904-HX
                            </span>
                        </div>

                        <div className="mt-3">
                            <div className="flex justify-between font-mono text-[10px] text-[#64748B]">
                                <span>RAM Allocation</span>
                                <span className="text-[#0F172A]">2.8 GB / 8.0 GB</span>
                            </div>

                            <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#F1F5F9]">
                                <div className="h-full w-[35%] bg-[#0D9488]" />
                            </div>
                        </div>

                        <div className="mt-4 flex justify-between font-mono text-[10px] text-[#64748B]">
                            <span>Firmware Checksum</span>
                            <span className="text-[#0F172A]">0x8b32..4f9</span>
                        </div>

                        <div className="mt-4 flex items-center gap-2 rounded border border-[#CCFBF1] bg-[#F0FDFA] p-2">
                            <Server size={15} className="text-[#0D9488]" />

                            <div>
                                <p className="font-mono text-[10px] font-semibold text-[#0F766E]">
                                    NODE HEALTHY
                                </p>
                                <p className="font-mono text-[9px] text-[#64748B]">
                                    UPTIME 99.998%
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* RIGHT CONTENT */}
                <div className="flex flex-col gap-8 lg:col-span-9">
                    {/* GENERAL */}
                    <SettingsSection
                        id="general"
                        icon={<Settings2 size={18} />}
                        title="General"
                        description="Manage primary enterprise identity, telemetry synchronization, and display metrics."
                        section="01"
                    >
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <Field label="Organization Name">
                                <input
                                    className={inputStyle}
                                    defaultValue="ZoneGate Logistics Global Berth"
                                />
                            </Field>

                            <Field label="Node Timezone Standard">
                                <select className={inputStyle}>
                                    <option>
                                        UTC +03:00 (Kuwait, Riyadh, Nairobi)
                                    </option>
                                    <option>UTC +00:00 (London)</option>
                                    <option>UTC +04:00 (Dubai, Baku)</option>
                                    <option>UTC -05:00 (New York)</option>
                                </select>
                            </Field>

                            <Field label="Interface Locale & Encoding">
                                <select className={inputStyle}>
                                    <option>English (US) - UTF-8 Compliant</option>
                                    <option>English (UK) - Metric Port Standard</option>
                                    <option>French - Maritime Port Protocol</option>
                                    <option>German - DIN Standard</option>
                                </select>
                            </Field>

                            <Field label="Date & Time Precision">
                                <input
                                    className={inputStyle}
                                    defaultValue="DD/MM/YYYY · 24-hour (ISO 8601 Tabular)"
                                />
                            </Field>
                        </div>

                        <div>
                            <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                                Default Request Ledger View
                            </p>

                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                <RadioCard
                                    checked={defaultView === "all"}
                                    onChange={() => setDefaultView("all")}
                                    label="All Requests (Unified)"
                                />

                                <RadioCard
                                    checked={defaultView === "hold"}
                                    onChange={() => setDefaultView("hold")}
                                    label="Action Required (HOLD)"
                                />

                                <RadioCard
                                    checked={defaultView === "anomaly"}
                                    onChange={() => setDefaultView("anomaly")}
                                    label="Security Anomalies Only"
                                />
                            </div>
                        </div>

                        <SectionActions />
                    </SettingsSection>

                    {/* LOCATIONS */}
                    <SettingsSection
                        id="zones"
                        icon={<MapPin size={18} />}
                        title="Locations & Zones"
                        description="Manage physical perimeter barriers, geofence anchors, and operational authorization zones."
                        action={
                            <button className={primaryButton}>
                                <Plus size={15} />
                                Add Zone
                            </button>
                        }
                    >
                        <div className="overflow-x-auto rounded border border-[#E2E8F0]">
                            <table className="w-full min-w-[760px] text-left">
                                <thead>
                                    <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                                        {[
                                            "Zone Designation",
                                            "Perimeter Type",
                                            "Telemetry Status",
                                            "Auth. Personnel",
                                            "Controls",
                                        ].map((heading) => (
                                            <th
                                                key={heading}
                                                className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#64748B] last:text-right"
                                            >
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-[#E2E8F0]">
                                    {zones.map((zone) => (
                                        <tr
                                            key={zone.name}
                                            className="transition hover:bg-[#F8FAFC]"
                                        >
                                            <td className="px-4 py-3">
                                                <p className="font-mono text-xs font-semibold">
                                                    {zone.name}
                                                </p>
                                                <p className="font-mono text-[10px] text-[#64748B]">
                                                    {zone.code}
                                                </p>
                                            </td>

                                            <td className="px-4 py-3 text-xs text-[#64748B]">
                                                {zone.type}
                                            </td>

                                            <td className="px-4 py-3">
                                                <ActiveBadge />
                                            </td>

                                            <td className="px-4 py-3 text-right font-mono text-xs">
                                                {zone.staff}
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-1">
                                                    <button className="rounded px-2 py-1 font-mono text-[10px] hover:bg-[#F1F5F9]">
                                                        Edit
                                                    </button>

                                                    <button className="rounded px-2 py-1 font-mono text-[10px] text-[#64748B] hover:bg-[#FEF2F2] hover:text-[#DC2626]">
                                                        Disable
                                                    </button>

                                                    <button
                                                        aria-label="Zone options"
                                                        className="rounded p-1 text-[#64748B] hover:bg-[#F1F5F9]"
                                                    >
                                                        <MoreHorizontal size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </SettingsSection>

                    {/* POLICIES */}
                    <SettingsSection
                        id="policies"
                        icon={<Gavel size={18} />}
                        title="Authorization Policies"
                        description="Configure mathematical evidence requirements and rule chains for mission-critical operations."
                        action={
                            <div className="flex gap-2">
                                <button className={secondaryButton}>
                                    Edit Policy
                                </button>

                                <button className={primaryButton}>
                                    <Plus size={15} />
                                    Create Rule
                                </button>
                            </div>
                        }
                    >
                        <div className="flex gap-3 rounded-r border-l-2 border-[#0D9488] bg-[#F8FAFC] p-4">
                            <ShieldCheck
                                size={19}
                                className="shrink-0 text-[#0D9488]"
                            />

                            <div>
                                <p className="font-mono text-[10px] font-semibold uppercase tracking-wider">
                                    Deterministic Execution Assurance
                                </p>

                                <p className="mt-1 font-mono text-[11px] leading-relaxed text-[#64748B]">
                                    All decisions are strictly computed against mathematical
                                    authorization rules and verified cryptographic telemetry.
                                    Automated AI policy mutation is permanently disabled.
                                </p>
                            </div>
                        </div>

                        <div className="rounded border border-[#E2E8F0] p-5">
                            <div className="flex flex-col justify-between gap-2 border-b border-[#E2E8F0] pb-3 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-semibold uppercase">
                                        Cargo Handoff
                                    </h3>

                                    <span className="rounded border border-[#E2E8F0] bg-[#F1F5F9] px-2 py-0.5 font-mono text-[10px] text-[#64748B]">
                                        POL-SEC-902
                                    </span>
                                </div>

                                <span className="font-mono text-[10px] uppercase text-[#64748B]">
                                    Evaluation Weight: 100% Strict
                                </span>
                            </div>

                            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div>
                                    <p className="mb-2 font-mono text-[10px] font-semibold uppercase text-[#64748B]">
                                        Mandatory Telemetry Evidence
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        <EvidenceTag required>
                                            Number Verification
                                        </EvidenceTag>

                                        <EvidenceTag required>
                                            Location Verification
                                        </EvidenceTag>
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-2 font-mono text-[10px] font-semibold uppercase text-[#64748B]">
                                        Optional Supplemental Checks
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        <EvidenceTag>SIM Swap Check</EvidenceTag>
                                        <EvidenceTag>Device Swap Check</EvidenceTag>
                                        <EvidenceTag>Reachability Ping</EvidenceTag>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <p className="mb-2 font-mono text-[10px] font-semibold uppercase text-[#64748B]">
                                    Deterministic Decision Matrix
                                </p>

                                <div className="overflow-hidden rounded border border-[#E2E8F0]">
                                    {policies.map((policy) => (
                                        <div
                                            key={policy.id}
                                            className="flex flex-col justify-between gap-2 border-b border-[#E2E8F0] p-3 last:border-b-0 sm:flex-row sm:items-center"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono text-[10px] text-[#94A3B8]">
                                                    {policy.id}
                                                </span>

                                                <span className="font-mono text-[11px]">
                                                    {policy.rule}
                                                </span>
                                            </div>

                                            <DecisionBadge decision={policy.decision} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </SettingsSection>

                    {/* SECURITY */}
                    <SettingsSection
                        id="security"
                        icon={<Lock size={18} />}
                        title="Security"
                        description="Configure system-level boundaries, credential enforcement, and manual override safeguards."
                        section="04"
                    >
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <ToggleCard
                                title="Deterministic Policy Enforcement"
                                description="Prevent runtime AI components from modifying authorization policy."
                                checked={securitySettings.deterministic}
                                onChange={() =>
                                    setSecuritySettings((prev) => ({
                                        ...prev,
                                        deterministic: !prev.deterministic,
                                    }))
                                }
                            />

                            <ToggleCard
                                title="Human Approval for HOLD"
                                description="Require an authorized officer to resolve every HOLD decision."
                                checked={securitySettings.manualApproval}
                                onChange={() =>
                                    setSecuritySettings((prev) => ({
                                        ...prev,
                                        manualApproval: !prev.manualApproval,
                                    }))
                                }
                            />

                            <ToggleCard
                                title="Trusted Device Binding"
                                description="Enforce registered hardware identity for high-value operations."
                                checked={securitySettings.deviceBinding}
                                onChange={() =>
                                    setSecuritySettings((prev) => ({
                                        ...prev,
                                        deviceBinding: !prev.deviceBinding,
                                    }))
                                }
                            />

                            <ToggleCard
                                title="Automatic Anomaly Lockout"
                                description="Immediately isolate requests with critical telemetry mismatches."
                                checked={securitySettings.anomalyLockout}
                                onChange={() =>
                                    setSecuritySettings((prev) => ({
                                        ...prev,
                                        anomalyLockout: !prev.anomalyLockout,
                                    }))
                                }
                            />
                        </div>

                        <div className="rounded border border-[#FEE2E2] bg-[#FEF2F2] p-4">
                            <p className="font-mono text-[10px] font-semibold uppercase text-[#B91C1C]">
                                Critical Security Boundary
                            </p>

                            <p className="mt-1 text-xs text-[#64748B]">
                                Policy engine integrity, cryptographic evidence requirements,
                                and manual authority boundaries cannot be disabled remotely.
                            </p>
                        </div>

                        <SectionActions />
                    </SettingsSection>

                    {/* NOTIFICATIONS */}
                    <SettingsSection
                        id="notifications"
                        icon={<Bell size={18} />}
                        title="Notifications"
                        description="Define operator alerts for authorization decisions, node health, and policy changes."
                        section="05"
                    >
                        <div className="divide-y divide-[#E2E8F0] rounded border border-[#E2E8F0]">
                            <NotificationRow
                                title="Denied Request Alert"
                                description="Send an immediate operator notification when deterministic policy returns DENY."
                                checked={notifications.denied}
                                onChange={() =>
                                    setNotifications((prev) => ({
                                        ...prev,
                                        denied: !prev.denied,
                                    }))
                                }
                            />

                            <NotificationRow
                                title="HOLD Review Required"
                                description="Notify authorized supervisors when human review is required."
                                checked={notifications.hold}
                                onChange={() =>
                                    setNotifications((prev) => ({
                                        ...prev,
                                        hold: !prev.hold,
                                    }))
                                }
                            />

                            <NotificationRow
                                title="Node Connectivity Failure"
                                description="Raise an operational alert when an evidence or gate node becomes unavailable."
                                checked={notifications.nodeOffline}
                                onChange={() =>
                                    setNotifications((prev) => ({
                                        ...prev,
                                        nodeOffline: !prev.nodeOffline,
                                    }))
                                }
                            />

                            <NotificationRow
                                title="Policy Configuration Change"
                                description="Notify administrators after authorization rules are modified."
                                checked={notifications.policyChanges}
                                onChange={() =>
                                    setNotifications((prev) => ({
                                        ...prev,
                                        policyChanges: !prev.policyChanges,
                                    }))
                                }
                            />
                        </div>

                        <div className="flex flex-col justify-between gap-3 rounded border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:flex-row sm:items-center">
                            <div>
                                <p className="font-mono text-[10px] font-semibold uppercase">
                                    Alert Destination
                                </p>
                                <p className="mt-1 font-mono text-[10px] text-[#64748B]">
                                    SECURITY_OPS_CHANNEL // TERMINAL-04
                                </p>
                            </div>

                            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[#0D9488]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#1FD1A8]" />
                                7 ACTIVE RULES
                            </span>
                        </div>

                        <SectionActions />
                    </SettingsSection>
                </div>
            </section>
        </div>
    );
}

const inputStyle =
    "h-9 w-full rounded border border-[#CBD5E1] bg-white px-3 font-mono text-[11px] text-[#0F172A] outline-none transition focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/15";

const primaryButton =
    "flex items-center gap-1.5 rounded bg-[#0D9488] px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#0F766E]";

const secondaryButton =
    "rounded border border-[#E2E8F0] bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#0F172A] transition hover:border-[#94A3B8] hover:bg-[#F8FAFC]";

function SettingsSection({
    id,
    icon,
    title,
    description,
    section,
    action,
    children,
}: {
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    section?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section
            id={id}
            className="scroll-mt-24 rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm"
        >
            <div className="mb-5 flex flex-col justify-between gap-3 border-b border-[#E2E8F0] pb-4 sm:flex-row sm:items-start">
                <div>
                    <div className="flex items-center gap-2 text-[#0D9488]">
                        {icon}

                        <h2 className="text-lg font-semibold uppercase text-[#0F172A]">
                            {title}
                        </h2>
                    </div>

                    <p className="mt-1 text-xs text-[#64748B]">
                        {description}
                    </p>
                </div>

                {action ? (
                    action
                ) : section ? (
                    <span className="rounded border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-1 font-mono text-[10px] text-[#64748B]">
                        SECTION // {section}
                    </span>
                ) : null}
            </div>

            <div className="flex flex-col gap-5">{children}</div>
        </section>
    );
}

function SubNavItem({
    href,
    icon,
    label,
    meta,
    active,
    dot,
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
    meta?: string;
    active?: boolean;
    dot?: boolean;
}) {
    return (
        <a
            href={href}
            className={`flex items-center justify-between rounded px-3 py-2 text-xs transition ${active
                    ? "bg-[#F0FDFA] text-[#0F172A]"
                    : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                }`}
        >
            <div className="flex items-center gap-2">
                <span className={active ? "text-[#0D9488]" : ""}>
                    {icon}
                </span>
                {label}
            </div>

            {dot ? (
                <span className="h-1.5 w-1.5 rounded-full bg-[#0D9488]" />
            ) : meta ? (
                <span className="font-mono text-[10px]">{meta}</span>
            ) : null}
        </a>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                {label}
            </span>

            {children}
        </label>
    );
}

function RadioCard({
    checked,
    onChange,
    label,
}: {
    checked: boolean;
    onChange: () => void;
    label: string;
}) {
    return (
        <label
            className={`flex cursor-pointer items-center gap-2 rounded border p-3 transition ${checked
                    ? "border-[#0D9488] bg-[#F0FDFA]"
                    : "border-[#CBD5E1] bg-white hover:border-[#94A3B8]"
                }`}
        >
            <input
                type="radio"
                checked={checked}
                onChange={onChange}
                className="accent-[#0D9488]"
            />

            <span className="font-mono text-[11px]">
                {label}
            </span>
        </label>
    );
}

function SectionActions() {
    return (
        <div className="flex justify-end gap-2 border-t border-[#E2E8F0] pt-4">
            <button className={secondaryButton}>Cancel</button>

            <button className={primaryButton}>
                Save Changes
            </button>
        </div>
    );
}

function ActiveBadge() {
    return (
        <span className="inline-flex items-center gap-1.5 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-1 font-mono text-[9px] font-semibold uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0D9488]" />
            Active
        </span>
    );
}

function EvidenceTag({
    children,
    required,
}: {
    children: React.ReactNode;
    required?: boolean;
}) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 font-mono text-[10px] ${required
                    ? "border-[#0D9488] bg-[#F0FDFA] text-[#0F172A]"
                    : "border-[#E2E8F0] bg-white text-[#64748B]"
                }`}
        >
            {required && (
                <CheckSquare size={13} className="text-[#0D9488]" />
            )}

            {children}
        </span>
    );
}

function DecisionBadge({
    decision,
}: {
    decision: string;
}) {
    const style =
        decision === "APPROVE"
            ? "border-[#CCFBF1] bg-[#F0FDFA] text-[#0F766E]"
            : decision === "HOLD"
                ? "border-[#FEF3C7] bg-[#FFFBEB] text-[#B45309]"
                : "border-[#FEE2E2] bg-[#FEF2F2] text-[#B91C1C]";

    const dot =
        decision === "APPROVE"
            ? "bg-[#0D9488]"
            : decision === "HOLD"
                ? "bg-[#D97706]"
                : "bg-[#DC2626]";

    return (
        <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded border px-2 py-1 font-mono text-[9px] font-semibold ${style}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
            {decision}
        </span>
    );
}

function ToggleCard({
    title,
    description,
    checked,
    onChange,
}: {
    title: string;
    description: string;
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <div className="flex items-start justify-between gap-4 rounded border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <div>
                <p className="text-xs font-semibold text-[#0F172A]">
                    {title}
                </p>

                <p className="mt-1 text-[11px] leading-relaxed text-[#64748B]">
                    {description}
                </p>
            </div>

            <Toggle checked={checked} onChange={onChange} />
        </div>
    );
}

function NotificationRow({
    title,
    description,
    checked,
    onChange,
}: {
    title: string;
    description: string;
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <div className="flex items-center justify-between gap-4 p-4">
            <div>
                <p className="text-xs font-semibold">{title}</p>

                <p className="mt-1 text-[11px] text-[#64748B]">
                    {description}
                </p>
            </div>

            <Toggle checked={checked} onChange={onChange} />
        </div>
    );
}

function Toggle({
    checked,
    onChange,
}: {
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <button
            type="button"
            aria-pressed={checked}
            onClick={onChange}
            className={`relative h-5 w-9 shrink-0 rounded-full transition ${checked ? "bg-[#0D9488]" : "bg-[#CBD5E1]"
                }`}
        >
            <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${checked ? "left-[18px]" : "left-0.5"
                    }`}
            />
        </button>
    );
}