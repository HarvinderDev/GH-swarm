export interface PolicyDecision {
  allowed: boolean;
  reason?: string;
  requiresApproval: boolean;
}

export function evaluatePublishPolicy(taskType: string): PolicyDecision {
  if (taskType.toLowerCase().includes('deploy') || taskType.toLowerCase().includes('merge')) {
    return { allowed: false, reason: 'merge/deploy remain human-gated', requiresApproval: true };
  }
  return { allowed: true, requiresApproval: true };
}
