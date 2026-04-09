"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WorkspaceDashboard } from "@/lib/types";

export default function WorkspacePage() {
  const [data, setData] = useState<WorkspaceDashboard | null>(null);

  useEffect(() => {
    fetch("/api/workspace")
      .then((response) => response.json())
      .then(setData)
      .catch(() => null);
  }, []);

  if (!data) {
    return <p>Loading workspace...</p>;
  }

  return (
    <section>
      <h2>{data.workspaceName} dashboard</h2>
      <p>Queue depth: {data.queueDepth}</p>

      {data.repos.map((repo) => (
        <article key={repo.id} className="card">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <strong>{repo.name}</strong>
            <span>Runner: {repo.runnerMode}</span>
          </div>
          <p>
            Open tasks: {repo.openTasks} · Active runs: {repo.activeRuns} · Failing
            checks: {repo.failingChecks}
          </p>
          <Link href={`/workspace/${repo.id}`}>Open control view</Link>
        </article>
      ))}
    </section>
  );
}
