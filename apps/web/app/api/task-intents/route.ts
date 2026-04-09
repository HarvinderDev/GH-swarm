import { createTaskIntent, listTaskIntents } from "@/lib/mock-data";

export async function GET() {
  return Response.json({ items: listTaskIntents() });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as { repoId?: string; prompt?: string };

  if (!payload.repoId || !payload.prompt) {
    return Response.json(
      { error: "repoId and prompt are required" },
      { status: 400 }
    );
  }

  const intent = createTaskIntent(payload.repoId, payload.prompt);
  return Response.json({
    intent,
    message: "TaskIntent accepted and queued for planning."
  });
}
