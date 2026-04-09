import { describe, expect, it } from "vitest";
import { loadIntegrationConfig } from "../packages/shared/src/config.js";

describe("smoke", () => {
  it("loads default integration config safely", () => {
    const config = loadIntegrationConfig({});
    expect(config.dryRunDefault).toBe(true);
    expect(config.githubLiveEnabled).toBe(false);
    expect(config.telegramLiveEnabled).toBe(false);
  });
});
