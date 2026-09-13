/**
 * What an evidence row says when the carrier gave no answer.
 *
 * An empty reading has three different causes, and they mean different things
 * to the person reading the record:
 *
 * - the plan never asked for the check (the agent judged it unnecessary);
 * - the workflow requires the check but this deployment's carrier cannot
 *   attest it at all, so the validator dropped it and the decision carries a
 *   caveat (number verification on the live gateway);
 * - the check was on the plan and the carrier did not answer it, which is the
 *   only case that is genuinely "not collected".
 *
 * Collapsing all three into "NOT COLLECTED" made a high-risk release on which
 * every available check was run look as though evidence had gone missing.
 */

export interface PlanOutline {
    mandatory: string[];
    combined: string[];
}

export function evidenceLabel(
    kind: string,
    state: boolean | null | undefined,
    plan: PlanOutline | null | undefined
): string {
    if (state === true) return "TRUE";
    if (state === false) return "FALSE";
    if (!plan || plan.combined.includes(kind)) return "NOT COLLECTED";
    // Number verification is mandatory for every release, so the only way it
    // leaves the plan is the validator dropping it as unattestable.
    if (kind === "NUMBER_VERIFICATION") return "CARRIER CANNOT ATTEST";
    return "NOT REQUESTED";
}
