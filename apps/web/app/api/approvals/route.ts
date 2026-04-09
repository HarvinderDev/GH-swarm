import { approvals, updateApproval } from "@/lib/mock-data";
import { ApprovalRequest } from "@/lib/types";

export async function GET() {
  return Response.json({ items: approvals });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    id?: string;
    action?: "approve" | "reject" | "request_changes";
  };

  if (!payload.id || !payload.action) {
    return Response.json({ error: "id and action are required" }, { status: 400 });
  }

  const mapping: Record<string, ApprovalRequest["status"]> = {
    approve: "approved",
    reject: "rejected",
    request_changes: "changes_requested"
  };

  const updated = updateApproval(payload.id, mapping[payload.action]);
  if (!updated) {
    return Response.json({ error: "Approval request not found" }, { status: 404 });
  }

  return Response.json({ updated });
}
