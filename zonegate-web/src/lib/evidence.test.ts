import { describe, expect, it } from "vitest";

import { evidenceLabel } from "./evidence";

const plan = {
    mandatory: ["LOCATION_VERIFICATION"],
    combined: ["LOCATION_VERIFICATION", "SIM_SWAP"],
};

describe("evidenceLabel", () => {
    it("reads an answered check as the carrier gave it", () => {
        expect(evidenceLabel("SIM_SWAP", false, plan)).toBe("FALSE");
        expect(evidenceLabel("LOCATION_VERIFICATION", true, plan)).toBe("TRUE");
    });

    it("keeps not collected for a planned check the carrier did not answer", () => {
        expect(evidenceLabel("SIM_SWAP", null, plan)).toBe("NOT COLLECTED");
    });

    it("says an unplanned optional check was never requested", () => {
        expect(evidenceLabel("REACHABILITY", null, plan)).toBe("NOT REQUESTED");
    });

    it("says number verification dropped from the plan cannot be attested", () => {
        expect(evidenceLabel("NUMBER_VERIFICATION", null, plan)).toBe("CARRIER CANNOT ATTEST");
    });

    it("does not guess without a plan", () => {
        expect(evidenceLabel("NUMBER_VERIFICATION", null, null)).toBe("NOT COLLECTED");
    });
});
