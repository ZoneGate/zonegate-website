/**
 * Tests for the console's API client.
 *
 * The client is where a backend problem becomes something the operator sees.
 * What matters most here is the failure path: an unreachable backend has to
 * surface as an unreachable backend, never as an empty queue.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
    ApiError,
    API_URL,
    getHealth,
    getPolicyConfig,
    listActors,
    listDecisionContexts,
    listDecisions,
    requestAuthorization,
    resolveHold,
    updatePolicyConfig,
} from "./api";

/** Captures what the client asked for, and answers with a canned response. */
function mockFetch(
    responder: (url: string, init?: RequestInit) => {
        status?: number;
        body?: unknown;
        reject?: boolean;
    }
) {
    const spy = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const result = responder(url, init);

        if (result.reject) throw new TypeError("Failed to fetch");

        const status = result.status ?? 200;
        const text = result.body === undefined ? "" : JSON.stringify(result.body);

        return {
            ok: status < 400,
            status,
            statusText: `status ${status}`,
            json: async () => JSON.parse(text),
            text: async () => text,
        } as unknown as Response;
    });

    vi.stubGlobal("fetch", spy);
    return spy;
}

beforeEach(() => {
    vi.unstubAllGlobals();
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("request failure handling", () => {
    it("turns an unreachable backend into a named, actionable error", () => {
        mockFetch(() => ({ reject: true }));

        return getHealth().then(
            () => expect.unreachable("should have thrown"),
            (error) => {
                expect(error).toBeInstanceOf(ApiError);
                expect(error.status).toBe(0);
                expect(error.message).toContain(API_URL);
                expect(error.message).toContain("Is the backend running?");
            }
        );
    });

    it("surfaces the backend's own detail message on a 4xx", () => {
        mockFetch(() => ({
            status: 404,
            body: { detail: "Authorization decision 'dec_x' not found" },
        }));

        return listDecisions().then(
            () => expect.unreachable("should have thrown"),
            (error) => {
                expect(error).toBeInstanceOf(ApiError);
                expect(error.status).toBe(404);
                expect(error.message).toBe(
                    "Authorization decision 'dec_x' not found"
                );
            }
        );
    });

    it("falls back to the status line when the error body is not JSON", () => {
        const spy = vi.fn(async () => ({
            ok: false,
            status: 502,
            statusText: "Bad Gateway",
            json: async () => {
                throw new SyntaxError("not json");
            },
            text: async () => "<html>502</html>",
        }) as unknown as Response);

        vi.stubGlobal("fetch", spy);

        return listDecisions().then(
            () => expect.unreachable("should have thrown"),
            (error) => {
                expect(error.status).toBe(502);
                expect(error.message).toContain("502");
            }
        );
    });

    it("preserves a 409 so a conflict can be told apart from a bad request", () => {
        mockFetch(() => ({ status: 409, body: { detail: "already resolved" } }));

        return resolveHold("dec_1", {
            outcome: "APPROVE",
            resolved_by: "usr_supervisor",
        }).then(
            () => expect.unreachable("should have thrown"),
            (error) => expect(error.status).toBe(409)
        );
    });
});

describe("decision listing", () => {
    it("sends no filters when none were asked for", () => {
        const spy = mockFetch(() => ({ body: [] }));

        return listDecisions().then(() => {
            expect(String(spy.mock.calls[0][0])).toBe(`${API_URL}/v1/authorizations`);
        });
    });

    it("passes the outcome, pending flag and limit through", () => {
        const spy = mockFetch(() => ({ body: [] }));

        return listDecisions({ decision: "HOLD", pending: true, limit: 50 }).then(
            () => {
                const url = String(spy.mock.calls[0][0]);
                expect(url).toContain("decision=HOLD");
                expect(url).toContain("pending=true");
                expect(url).toContain("limit=50");
            }
        );
    });

    it("omits the pending flag when it is false", () => {
        const spy = mockFetch(() => ({ body: [] }));

        return listDecisions({ pending: false }).then(() => {
            expect(String(spy.mock.calls[0][0])).not.toContain("pending");
        });
    });

    it("reads the bulk contexts endpoint, not the plain listing", () => {
        const spy = mockFetch(() => ({ body: [] }));

        return listDecisionContexts({ limit: 25 }).then(() => {
            const url = String(spy.mock.calls[0][0]);
            expect(url).toContain("/v1/authorizations/contexts");
            expect(url).toContain("limit=25");
        });
    });
});

describe("roster", () => {
    it("requests the roster with an explicit limit", () => {
        const spy = mockFetch(() => ({ body: [] }));

        return listActors(10).then(() => {
            expect(String(spy.mock.calls[0][0])).toBe(`${API_URL}/v1/actors?limit=10`);
        });
    });

    it("returns each actor with its binding", () => {
        mockFetch(() => ({
            body: [
                {
                    actor: {
                        actor_id: "usr_1",
                        role: "ROLE_CARGO_OPERATOR",
                        permissions: ["cargo:release"],
                        registered_phone_number: "+14155550199",
                        registered_device_id: "dev_1",
                        enrollment_status: "ACTIVE",
                    },
                    binding: null,
                },
            ],
        }));

        return listActors().then((roster) => {
            expect(roster).toHaveLength(1);
            expect(roster[0].actor.actor_id).toBe("usr_1");
            expect(roster[0].binding).toBeNull();
        });
    });
});

describe("authorization requests", () => {
    it("posts the transaction as JSON", () => {
        const spy = mockFetch(() => ({
            status: 201,
            body: { decision: {}, receipt: {} },
        }));

        return requestAuthorization({
            transaction_id: "tx_1",
            actor_id: "usr_1",
            action: "RELEASE_CARGO",
            resource_id: "CT-1",
            zone: "PORT_GATE_17",
            timestamp: "2026-09-10T09:00:00Z",
            value: "1000.00",
        }).then(() => {
            const [url, init] = spy.mock.calls[0];

            expect(String(url)).toBe(`${API_URL}/v1/authorizations`);
            expect(init?.method).toBe("POST");
            expect(
                (init?.headers as Record<string, string>)["Content-Type"]
            ).toBe("application/json");
            expect(JSON.parse(String(init?.body)).resource_id).toBe("CT-1");
        });
    });

    it("sends metadata only when there is any", () => {
        const spy = mockFetch(() => ({ status: 201, body: {} }));

        return requestAuthorization({
            transaction_id: "tx_2",
            actor_id: "usr_1",
            action: "RELEASE_CARGO",
            resource_id: "CT-2",
            zone: "Z",
            timestamp: "2026-09-10T09:00:00Z",
            value: "1.00",
            metadata: { carrier: "Northline" },
        }).then(() => {
            const body = JSON.parse(String(spy.mock.calls[0][1]?.body));
            expect(body.metadata).toEqual({ carrier: "Northline" });
        });
    });
});

describe("hold resolution", () => {
    it("posts the verdict to the decision's resolve path", () => {
        const spy = mockFetch(() => ({ status: 201, body: {} }));

        return resolveHold("dec_abc", {
            outcome: "DENY",
            resolved_by: "usr_security_officer_07",
            note: "no manifest",
        }).then(() => {
            const [url, init] = spy.mock.calls[0];

            expect(String(url)).toBe(
                `${API_URL}/v1/authorizations/dec_abc/resolve`
            );
            expect(JSON.parse(String(init?.body))).toEqual({
                outcome: "DENY",
                resolved_by: "usr_security_officer_07",
                note: "no manifest",
            });
        });
    });

    it("escapes a decision id so it cannot alter the path", () => {
        const spy = mockFetch(() => ({ status: 201, body: {} }));

        return resolveHold("dec/../../admin", {
            outcome: "APPROVE",
            resolved_by: "usr_1",
        }).then(() => {
            expect(String(spy.mock.calls[0][0])).not.toContain("../");
        });
    });
});

describe("policy configuration", () => {
    it("reads the live configuration", () => {
        mockFetch(() => ({
            body: {
                high_value_threshold: "100000.00",
                window_start_hour: 6,
                window_end_hour: 20,
            },
        }));

        return getPolicyConfig().then((config) => {
            expect(config.high_value_threshold).toBe("100000.00");
            expect(config.window_start_hour).toBe(6);
        });
    });

    it("writes with PUT, which the backend must allow through CORS", () => {
        const spy = mockFetch(() => ({ body: {} }));

        return updatePolicyConfig({
            high_value_threshold: "250000.00",
            window_start_hour: 7,
            window_end_hour: 19,
        }).then(() => {
            const [url, init] = spy.mock.calls[0];

            expect(String(url)).toBe(`${API_URL}/v1/policy/config`);
            expect(init?.method).toBe("PUT");
        });
    });

    it("reports a rejected configuration rather than swallowing it", () => {
        mockFetch(() => ({
            status: 400,
            body: { detail: "window_end_hour must be later than window_start_hour" },
        }));

        return updatePolicyConfig({
            high_value_threshold: "1.00",
            window_start_hour: 20,
            window_end_hour: 6,
        }).then(
            () => expect.unreachable("should have thrown"),
            (error) => {
                expect(error.status).toBe(400);
                expect(error.message).toContain("window_end_hour");
            }
        );
    });
});

describe("empty responses", () => {
    it("treats a 204 as no content rather than failing to parse it", () => {
        mockFetch(() => ({ status: 204 }));

        return getHealth().then((body) => expect(body).toBeUndefined());
    });
});
