import { runs } from "@/lib/mock-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ runId: string }> }
) {
  const { runId } = await params;
  const run = runs[runId];

  if (!run) {
    return Response.json({ error: "Run not found" }, { status: 404 });
  }

  return Response.json(run);
}
