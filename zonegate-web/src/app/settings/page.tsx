"use client";

import {
    Bell,
    CheckSquare,
    Gavel,
    Lock,
    MapPin,
    MoreHorizontal,
    Plus,
    Settings2,
    ShieldCheck,
} from "lucide-react";
import { useState, useSyncExternalStore } from "react";

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
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [showRuleForm, setShowRuleForm] = useState(false);
    const [ruleMessage, setRuleMessage] = useState("");
    const storedPolicies = useSyncExternalStore(subscribeSettings, () => {
        try { return localStorage.getItem("zonegate.policies.v1"); } catch { return null; }
    }, () => null);
    let policyList = policies;
    try {
        const parsed = storedPolicies ? JSON.parse(storedPolicies) : null;
        if (Array.isArray(parsed) && parsed.every(item => item && typeof item.id === "string" && typeof item.rule === "string" && typeof item.decision === "string")) policyList = parsed;
    } catch { /* Use defaults if saved policy data is invalid. */ }

    function createRule(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const rule = String(data.get("rule") ?? "").trim();
        const decision = String(data.get("decision") ?? "");
        if (rule.length < 5 || rule.length > 200 || !["DENY", "HOLD", "APPROVE"].includes(decision)) {
            setRuleMessage("Enter a rule description and choose a valid decision.");
            return;
        }
        const next = { id: String(policyList.length + 1).padStart(2, "0"), rule, decision };
        try {
            localStorage.setItem("zonegate.policies.v1", JSON.stringify([...policyList, next]));
            window.dispatchEvent(new Event("zonegate-settings"));
            setShowRuleForm(false);
            setRuleMessage("Rule created and saved in this browser.");
        } catch {
            setRuleMessage("Could not save the rule. Check browser storage permissions and try again.");
        }
    }
    const [showZoneForm, setShowZoneForm] = useState(false);
    const [zoneMessage, setZoneMessage] = useState("");
    const storedZones = useSyncExternalStore(subscribeSettings, () => {
        try { return localStorage.getItem("zonegate.zones.v1"); } catch { return null; }
    }, () => null);
    let zoneList = zones;
    try {
        const parsed = storedZones ? JSON.parse(storedZones) : null;
        if (Array.isArray(parsed) && parsed.every(item => item &&
            ["name", "code", "type", "staff"].every(key => typeof item[key] === "string"))) zoneList = parsed;
    } catch { /* Use the initial zones if browser data is invalid. */ }

    function addZone(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = String(data.get("name") ?? "").trim();
        const code = String(data.get("code") ?? "").trim();
        const type = String(data.get("type") ?? "").trim();
        const staffText = String(data.get("staff") ?? "").trim();
        const staff = Number(staffText);
        if (!name || !code || !type || !staffText || !Number.isSafeInteger(staff) || staff < 0) {
            setZoneMessage("Complete all fields and enter a valid, non-negative staff count.");
            return;
        }
        if (zoneList.some(zone => zone.name.toLowerCase() === name.toLowerCase())) {
            setZoneMessage("A zone with this name already exists.");
            return;
        }
        try {
            localStorage.setItem("zonegate.zones.v1", JSON.stringify([...zoneList, { name, code, type, staff: `${staff} Staff` }]));
            window.dispatchEvent(new Event("zonegate-settings"));
            setShowZoneForm(false);
            setZoneMessage(`${name} added. Saved in this browser.`);
        } catch {
            setZoneMessage("Could not save the zone. Check browser storage permissions and try again.");
        }
    }
    const general = useSettingsDraft("general", {
        organization: "ZoneGate Logistics Global Berth",
        timezone: "UTC +03:00 (Kuwait, Riyadh, Nairobi)",
        locale: "English (US) - UTF-8 Compliant",
        dateFormat: "DD/MM/YYYY · 24-hour (ISO 8601 Tabular)",
        defaultView: "all",
    });
    const defaultView = general.value.defaultView;
    const setDefaultView = (defaultView: string) => general.setValue(prev => ({ ...prev, defaultView }));

    const security = useSettingsDraft<Record<"deterministic" | "manualApproval" | "deviceBinding" | "anomalyLockout", boolean>>("security", {
        deterministic: true,
        manualApproval: true,
        deviceBinding: true,
        anomalyLockout: true,
    });

    const notificationSettings = useSettingsDraft<Record<"denied" | "hold" | "nodeOffline" | "policyChanges", boolean>>("notifications", {
        denied: true,
        hold: true,
        nodeOffline: true,
        policyChanges: false,
    });

    const securitySettings = security.value;
    const setSecuritySettings = security.setValue;
    const notifications = notificationSettings.value;
    const setNotifications = notificationSettings.setValue;

    return (
        <div className="flex w-full flex-col gap-6">
            {/* PAGE HEADER */}
            <section className="flex flex-col justify-between gap-4 border-b border-[#E2E8F0] pb-5 lg:flex-row lg:items-end">
                <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#64748B]">
                        <span>Configuration & Policy Engine</span>
                        <span>{"//"}</span>
                        <span>NODE_T4_CONF</span>
                        <span>{"//"}</span>
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

            </section>

            <section className="flex min-w-0 flex-col gap-6">
                {/* SECTION MENU */}
                <div className="w-full">
                    <div className="rounded-lg border border-[#E2E8F0] bg-white p-2 shadow-sm">

                        <nav aria-label="Settings sections" className="flex flex-wrap gap-2">
                            <SubNavItem
                                sectionId="general"
                                active={activeSection === "general"}
                                onClick={() => setActiveSection(activeSection === "general" ? null : "general")}
                                icon={<Settings2 size={16} />}
                                label="General"
                            />

                            <SubNavItem
                                sectionId="zones"
                                active={activeSection === "zones"}
                                onClick={() => setActiveSection(activeSection === "zones" ? null : "zones")}
                                icon={<MapPin size={16} />}
                                label="Locations & Zones"
                                meta={String(zoneList.length)}
                            />

                            <SubNavItem
                                sectionId="policies"
                                active={activeSection === "policies"}
                                onClick={() => setActiveSection(activeSection === "policies" ? null : "policies")}
                                icon={<Gavel size={16} />}
                                label="Authorization Policies"
                                meta={String(policyList.length)}
                            />

                            <SubNavItem
                                sectionId="security"
                                active={activeSection === "security"}
                                onClick={() => setActiveSection(activeSection === "security" ? null : "security")}
                                icon={<Lock size={16} />}
                                label="Security"
                                dot
                            />

                            <SubNavItem
                                sectionId="notifications"
                                active={activeSection === "notifications"}
                                onClick={() => setActiveSection(activeSection === "notifications" ? null : "notifications")}
                                icon={<Bell size={16} />}
                                label="Notifications"
                                meta={`${Object.values(notifications).filter(Boolean).length} ACT`}
                            />
                        </nav>
                    </div>

                </div>

                {/* SELECTED SECTION */}
                <div className={activeSection ? "w-full min-w-0" : "hidden"}>
                    {/* GENERAL */}
                    <SettingsSection
                        id="general"
                        hidden={activeSection !== "general"}
                        icon={<Settings2 size={18} />}
                        title="General"
                        description="Manage primary enterprise identity, telemetry synchronization, and display metrics."
                    >
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <Field label="Organization Name">
                                <input
                                    className={inputStyle}
                                    value={general.value.organization} onChange={event => general.setValue(prev => ({ ...prev, organization: event.target.value }))}
                                />
                            </Field>

                            <Field label="Node Timezone Standard">
                                <select className={inputStyle} value={general.value.timezone} onChange={event => general.setValue(prev => ({ ...prev, timezone: event.target.value }))}>
                                    <option>
                                        UTC +03:00 (Kuwait, Riyadh, Nairobi)
                                    </option>
                                    <option>UTC +00:00 (London)</option>
                                    <option>UTC +04:00 (Dubai, Baku)</option>
                                    <option>UTC -05:00 (New York)</option>
                                </select>
                            </Field>

                            <Field label="Interface Locale & Encoding">
                                <select className={inputStyle} value={general.value.locale} onChange={event => general.setValue(prev => ({ ...prev, locale: event.target.value }))}>
                                    <option>English (US) - UTF-8 Compliant</option>
                                    <option>English (UK) - Metric Port Standard</option>
                                    <option>French - Maritime Port Protocol</option>
                                    <option>German - DIN Standard</option>
                                </select>
                            </Field>

                            <Field label="Date & Time Precision">
                                <input
                                    className={inputStyle}
                                    value={general.value.dateFormat} onChange={event => general.setValue(prev => ({ ...prev, dateFormat: event.target.value }))}
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

                        <SectionActions onSave={general.save} onCancel={general.cancel} dirty={general.dirty} message={general.message} />
                    </SettingsSection>

                    {/* LOCATIONS */}
                    <SettingsSection
                        id="zones"
                        hidden={activeSection !== "zones"}
                        icon={<MapPin size={18} />}
                        title="Locations & Zones"
                        description="Manage physical perimeter barriers, geofence anchors, and operational authorization zones."
                        action={
                            <button type="button" aria-expanded={showZoneForm} aria-controls="add-zone-form" onClick={() => { setShowZoneForm(true); setZoneMessage(""); }} className={primaryButton}>
                                <Plus size={15} />
                                Add Zone
                            </button>
                        }
                    >
                        {showZoneForm && (
                            <form id="add-zone-form" onSubmit={addZone} className="rounded border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                                <h3 className="mb-4 text-sm font-semibold">Add a new zone</h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <Field label="Zone name"><input autoFocus required name="name" maxLength={100} className={inputStyle} placeholder="e.g. Warehouse C" /></Field>
                                    <Field label="Zone code / description"><input required name="code" maxLength={150} className={inputStyle} placeholder="e.g. NORTH STORAGE FACILITY" /></Field>
                                    <Field label="Perimeter type">
                                        <select required name="type" className={inputStyle}>
                                            <option value="">Select a type</option>
                                            <option>Port Turnstile &amp; Barrier</option>
                                            <option>High-Density Warehouse</option>
                                            <option>Loading &amp; Staging Area</option>
                                            <option>Other</option>
                                        </select>
                                    </Field>
                                    <Field label="Authorized staff count"><input required type="number" name="staff" min="0" max="1000000" step="1" defaultValue="0" className={inputStyle} /></Field>
                                </div>
                                <div className="mt-4 flex justify-end gap-2">
                                    <button type="button" className={secondaryButton} onClick={() => { setShowZoneForm(false); setZoneMessage(""); }}>Cancel</button>
                                    <button type="submit" className={primaryButton}>Save Zone</button>
                                </div>
                            </form>
                        )}
                        {zoneMessage && <p role="status" className="text-xs text-[#64748B]">{zoneMessage}</p>}
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
                                    {zoneList.map((zone) => (
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
                        hidden={activeSection !== "policies"}
                        icon={<Gavel size={18} />}
                        title="Authorization Policies"
                        description="Configure mathematical evidence requirements and rule chains for mission-critical operations."
                        action={
                            <div className="flex gap-2">
                                <button className={secondaryButton}>
                                    Edit Policy
                                </button>

                                <button type="button" aria-expanded={showRuleForm} aria-controls="create-rule-form" onClick={() => { setShowRuleForm(true); setRuleMessage(""); }} className={primaryButton}>
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

                            {showRuleForm && (
                                <form id="create-rule-form" onSubmit={createRule} className="mt-5 rounded border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                                    <h3 className="mb-3 text-sm font-semibold">Create authorization rule</h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
                                        <Field label="Rule description"><input autoFocus required name="rule" minLength={5} maxLength={200} className={inputStyle} placeholder="e.g. Expired credential detected" /></Field>
                                        <Field label="Decision"><select required name="decision" defaultValue="HOLD" className={inputStyle}><option>DENY</option><option>HOLD</option><option>APPROVE</option></select></Field>
                                    </div>
                                    <div className="mt-4 flex justify-end gap-2"><button type="button" className={secondaryButton} onClick={() => { setShowRuleForm(false); setRuleMessage(""); }}>Cancel</button><button type="submit" className={primaryButton}>Save Rule</button></div>
                                </form>
                            )}
                            {ruleMessage && <p role="status" className="mt-3 text-xs text-[#64748B]">{ruleMessage}</p>}

                            <div className="mt-6">
                                <p className="mb-2 font-mono text-[10px] font-semibold uppercase text-[#64748B]">
                                    Deterministic Decision Matrix
                                </p>

                                <div className="overflow-hidden rounded border border-[#E2E8F0]">
                                    {policyList.map((policy) => (
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
                        hidden={activeSection !== "security"}
                        icon={<Lock size={18} />}
                        title="Security"
                        description="Configure system-level boundaries, credential enforcement, and manual override safeguards."
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

                        <SectionActions onSave={security.save} onCancel={security.cancel} dirty={security.dirty} message={security.message} />
                    </SettingsSection>

                    {/* NOTIFICATIONS */}
                    <SettingsSection
                        id="notifications"
                        hidden={activeSection !== "notifications"}
                        icon={<Bell size={18} />}
                        title="Notifications"
                        description="Define operator alerts for authorization decisions, node health, and policy changes."
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
                                {Object.values(notifications).filter(Boolean).length} ACTIVE RULES
                            </span>
                        </div>

                        <SectionActions onSave={notificationSettings.save} onCancel={notificationSettings.cancel} dirty={notificationSettings.dirty} message={notificationSettings.message} />
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
    hidden,
    icon,
    title,
    description,
    action,
    children,
}: {
    id: string;
    hidden: boolean;
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section
            id={id}
            hidden={hidden}
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

                {action}
            </div>

            <div className="flex flex-col gap-5">{children}</div>
        </section>
    );
}

function SubNavItem({
    sectionId,
    onClick,
    icon,
    label,
    meta,
    active,
    dot,
}: {
    sectionId: string;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    meta?: string;
    active?: boolean;
    dot?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-expanded={Boolean(active)}
            aria-controls={sectionId}
            className={`flex items-center justify-between gap-3 rounded px-4 py-3 text-xs transition ${active
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
        </button>
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

function SectionActions({ onSave, onCancel, dirty, message }: {
    onSave: () => void;
    onCancel: () => void;
    dirty: boolean;
    message: string;
}) {
    return (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#E2E8F0] pt-4">
            <span role="status" className="mr-auto text-xs text-[#64748B]">{message || (dirty ? "Unsaved changes" : "Settings are saved in this browser.")}</span>
            <button type="button" onClick={onCancel} disabled={!dirty} className={`${secondaryButton} disabled:opacity-40`}>Cancel</button>

            <button type="button" onClick={onSave} disabled={!dirty} className={`${primaryButton} disabled:opacity-40`}>
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

function subscribeSettings(callback: () => void) {
    window.addEventListener("storage", callback);
    window.addEventListener("zonegate-settings", callback);
    return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener("zonegate-settings", callback);
    };
}

function useSettingsDraft<T extends Record<string, string | boolean>>(section: string, defaults: T) {
    const key = `zonegate.settings.${section}.v1`;
    const raw = useSyncExternalStore(subscribeSettings, () => {
        try { return localStorage.getItem(key); } catch { return null; }
    }, () => null);
    let saved = defaults;
    try {
        const parsed = raw ? JSON.parse(raw) : null;
        if (parsed && Object.keys(defaults).every(field => typeof parsed[field] === typeof defaults[field])) saved = parsed;
    } catch { /* Ignore invalid stored data and use defaults. */ }
    const [draft, setDraft] = useState<T | null>(null);
    const [message, setMessage] = useState("");
    const value = draft ?? saved;
    return {
        value,
        dirty: JSON.stringify(value) !== JSON.stringify(saved),
        message,
        setValue: (update: (previous: T) => T) => {
            setDraft(previous => update(previous ?? saved));
            setMessage("");
        },
        save: () => {
            if (Object.values(value).some(item => typeof item === "string" && !item.trim())) {
                setMessage("Please complete all fields before saving.");
                return;
            }
            try {
                localStorage.setItem(key, JSON.stringify(value));
                window.dispatchEvent(new Event("zonegate-settings"));
                setDraft(null);
                setMessage("Changes saved in this browser.");
            } catch {
                setMessage("Could not save changes. Check browser storage permissions and try again.");
            }
        },
        cancel: () => {
            setDraft(null);
            setMessage("Changes cancelled. Last saved settings restored.");
        },
    };
}
