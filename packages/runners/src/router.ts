import { LocalRunner } from "./local-runner.js";
import { RemoteRunner } from "./remote-runner.js";
import type { Runner, RunnerDependencies, RunnerTaskInput } from "./types.js";

export class RunnerRouter {
  private readonly localRunner: Runner;
  private readonly remoteRunner: Runner;

  constructor(private readonly deps: RunnerDependencies) {
    this.localRunner = new LocalRunner(deps);
    this.remoteRunner = new RemoteRunner(deps);
  }

  pickRunner(input: RunnerTaskInput): Runner {
    const shouldRemote =
      this.deps.routingPolicy.preferRemote ||
      this.deps.routingPolicy.remoteEligibleTaskPrefixes.some((prefix) =>
        input.taskId.startsWith(prefix)
      );

    if (shouldRemote && this.deps.remoteEnabled && this.deps.remoteEndpoint) {
      return this.remoteRunner;
    }

    return this.localRunner;
  }

  async run(input: RunnerTaskInput) {
    const runner = this.pickRunner(input);
    return runner.runTask(input);
  }
}
