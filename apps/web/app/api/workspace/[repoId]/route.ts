import { dashboard } from "@/lib/mock-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ repoId: string }> }
) {
  const { repoId } = await params;
  const repo = dashboard.repos.find((item) => item.id === repoId);

  if (!repo) {
    return Response.json({ error: "Repository not found" }, { status: 404 });
  }

  return Response.json({
    ...repo,
    branchStatus: "draft-pr-open",
    artifactHistory: ["run_1001", "run_1000"],
    blockedReason: null
  });
}
