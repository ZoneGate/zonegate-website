/**
 * Client for the ZoneGate authorization API.
 *
 * The dashboard is a separate origin from the backend, so every call is made
 * from the browser against NEXT_PUBLIC_API_URL and the backend allows that
 * origin through CORS.
 */

export const API_URL =
    process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export type DecisionOutcome = "APPROVE" | "HOLD" | "DENY";

export type ContextEvaluation = {
    risk_factors: string[];
    recommended_control: DecisionOutcome;
    rationale: string;
};

export type EvidenceSummary = {
    number_verified: boolean | null;
    location_verified: boolean | null;
    recent_sim_swap: boolean | null;
    recent_device_swap: boolean | null;
    reachable: boolean | null;
};

export type HoldResolution = {
    outcome: DecisionOutcome;
    resolved_by: string;
    authority_role: string;
    note: string;
    resolved_at: string;
};

export type PolicyDecision = {
    decision_id: string;
    transaction_id: string;
    decision: DecisionOutcome;
    reasons: string[];
    required_authority: string | null;
    context_evaluation: ContextEvaluation | null;
    evidence_summary: EvidenceSummary | null;
    decided_at: string;
    resolution: HoldResolution | null;
};

export type TransactionRequest = {
    transaction_id: string;
    actor_id: string;
    action: string;
    resource_id: string;
    zone: string;
    timestamp: string;
    value: string;
    metadata: Record<string, string>;
};

export type CanonicalEvidence = EvidenceSummary & {
    kyc_match: boolean | null;
    collected_at: string;
};

export type EvidencePlan = {
    mandatory: string[];
    optional: string[];
    combined: string[];
    rationale: string[];
    /**
     * How the plan was reached. The agent is only ever offered the optional
     * set, so anything mandatory in `combined` is the validator enforcing
     * policy rather than the agent having asked for it.
     *
     * Decisions recorded before this was traced come back with the defaults,
     * which is why `offered_optional` being empty means "not recorded" rather
     * than "the agent was offered nothing".
     */
    planner_consulted: boolean;
    offered_optional: string[];
    proposed_optional: string[];
};

export type Receipt = {
    receipt_id: string;
    decision_id: string;
    transaction_id: string;
    decision: DecisionOutcome;
    issued_at: string;
    token: string | null;
};

export type DecisionContext = {
    decision: PolicyDecision;
    transaction: TransactionRequest | null;
    evidence: CanonicalEvidence | null;
    evidence_plan: EvidencePlan | null;
    receipt: Receipt | null;
};

export type Actor = {
    actor_id: string;
    role: string;
    permissions: string[];
    registered_phone_number: string;
    registered_device_id: string;
    enrollment_status: string;
};

export type DeviceBinding = {
    actor_id: string;
    phone_number: string;
    device_id: string;
    bound_at: string;
    is_active: boolean;
};

export type RosterEntry = {
    actor: Actor;
    binding: DeviceBinding | null;
};

export type PolicyConfig = {
    high_value_threshold: string;
    window_start_hour: number;
    window_end_hour: number;
};

export type HealthReport = {
    status: string;
    dependencies: Record<string, string>;
};

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    let response: Response;

    try {
        response = await fetch(`${API_URL}${path}`, {
            ...init,
            headers: {
                "Content-Type": "application/json",
                ...(init?.headers ?? {}),
            },
        });
    } catch {
        throw new ApiError(
            `Cannot reach the authorization API at ${API_URL}. Is the backend running?`,
            0
        );
    }

    if (!response.ok) {
        let detail = `${response.status} ${response.statusText}`;

        try {
            const body = await response.json();
            if (body?.detail) detail = body.detail;
        } catch {
            // A non-JSON error body leaves the status line as the message.
        }

        throw new ApiError(detail, response.status);
    }

    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
}

export function getHealth() {
    return request<HealthReport>("/health");
}

export function listDecisions(params: {
    decision?: DecisionOutcome;
    pending?: boolean;
    limit?: number;
} = {}) {
    const query = new URLSearchParams();

    if (params.decision) query.set("decision", params.decision);
    if (params.pending) query.set("pending", "true");
    if (params.limit) query.set("limit", String(params.limit));

    const suffix = query.toString() ? `?${query}` : "";
    return request<PolicyDecision[]>(`/v1/authorizations${suffix}`);
}

export function listDecisionContexts(params: {
    decision?: DecisionOutcome;
    pending?: boolean;
    limit?: number;
} = {}) {
    const query = new URLSearchParams();

    if (params.decision) query.set("decision", params.decision);
    if (params.pending) query.set("pending", "true");
    if (params.limit) query.set("limit", String(params.limit));

    const suffix = query.toString() ? `?${query}` : "";
    return request<DecisionContext[]>(`/v1/authorizations/contexts${suffix}`);
}

export function listActors(limit = 200) {
    return request<RosterEntry[]>(`/v1/actors?limit=${limit}`);
}

export function getPolicyConfig() {
    return request<PolicyConfig>("/v1/policy/config");
}

export function updatePolicyConfig(config: PolicyConfig) {
    return request<PolicyConfig>("/v1/policy/config", {
        method: "PUT",
        body: JSON.stringify(config),
    });
}

export function getDecisionContext(decisionId: string) {
    return request<DecisionContext>(
        `/v1/authorizations/${encodeURIComponent(decisionId)}/context`
    );
}

export function requestAuthorization(transaction: {
    transaction_id: string;
    actor_id: string;
    action: string;
    resource_id: string;
    zone: string;
    timestamp: string;
    value: string;
    metadata?: Record<string, string>;
}) {
    return request<{ decision: PolicyDecision; receipt: Receipt }>(
        "/v1/authorizations",
        { method: "POST", body: JSON.stringify(transaction) }
    );
}

export function resolveHold(
    decisionId: string,
    body: { outcome: "APPROVE" | "DENY"; resolved_by: string; note?: string }
) {
    return request<{ decision: PolicyDecision; receipt: Receipt }>(
        `/v1/authorizations/${encodeURIComponent(decisionId)}/resolve`,
        { method: "POST", body: JSON.stringify(body) }
    );
}
