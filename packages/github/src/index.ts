import type { GitHubIntegration, GitHubIntegrationDependencies } from "./types.js";
import { LiveGitHubIntegration } from "./live.js";
import { MockGitHubIntegration } from "./mock.js";

export * from "./types.js";

export function createGitHubIntegration(
  deps: GitHubIntegrationDependencies
): GitHubIntegration {
  if (deps.liveEnabled && deps.token) {
    return new LiveGitHubIntegration(deps);
  }
  return new MockGitHubIntegration(deps);
}
