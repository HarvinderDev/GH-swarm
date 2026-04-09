"use client";

import { useEffect, useState } from "react";
import { ApprovalRequest } from "@/lib/types";

type ApprovalResponse = {
  items: ApprovalRequest[];
};

const actions = [
  { key: "approve", label: "Approve" },
  { key: "reject", label: "Reject" },
  { key: "request_changes", label: "Request changes" }
] as const;

export default function ApprovalsPage() {
  const [items, setItems] = useState<ApprovalRequest[]>([]);

  async function load() {
    const response = await fetch("/api/approvals");
    const payload = (await response.json()) as ApprovalResponse;
    setItems(payload.items);
  }

  useEffect(() => {
    load().catch(() => null);
  }, []);

  async function handleAction(id: string, action: (typeof actions)[number]["key"]) {
    await fetch("/api/approvals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action })
    });

    await load();
  }

  return (
    <section>
      <h2>Approval queue</h2>
      {items.map((item) => (
        <article className="card" key={item.id}>
          <p>{item.summary}</p>
          <p>Run: {item.runId}</p>
          <p>Status: {item.status}</p>
          <div className="row">
            {actions.map((action) => (
              <button
                key={action.key}
                type="button"
                className={action.key === "approve" ? "" : "secondary"}
                onClick={() => handleAction(item.id, action.key)}
              >
                {action.label}
              </button>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
