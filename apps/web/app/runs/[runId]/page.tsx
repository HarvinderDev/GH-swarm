"use client";

import { useEffect, useState } from "react";
import { TaskRun } from "@/lib/types";

export default function RunDetailPage({
  params
}: {
  params: Promise<{ runId: string }>;
}) {
  const [runId, setRunId] = useState("");
  const [run, setRun] = useState<TaskRun | null>(null);

  useEffect(() => {
    params.then(({ runId: value }) => setRunId(value));
  }, [params]);

  useEffect(() => {
    if (!runId) {
      return;
    }

    fetch(`/api/runs/${runId}`)
      .then((response) => response.json())
      .then(setRun)
      .catch(() => null);
  }, [runId]);

  if (!run) {
    return <p>Loading run timeline...</p>;
  }

  return (
    <section>
      <h2>Run detail: {run.runId}</h2>
      <p>
        Provider state: <strong>{run.providerState}</strong> · GitHub state: <strong>{" "}
          {run.githubState}
        </strong>
      </p>
      {(run.providerState !== "live" || run.githubState !== "live") && (
        <article className="card">
          <strong>Degraded path active</strong>
          <p>
            Live integrations are unavailable. Timeline and artifacts are shown from
            dry-run/mock adapters.
          </p>
        </article>
      )}
      {run.timeline.map((event) => (
        <article key={event.title} className="card">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <strong>{event.stage.toUpperCase()}</strong>
            <span>{event.status}</span>
          </div>
          <p>{event.title}</p>
          <p>{event.detail}</p>
          {event.artifact ? <p>Artifact: {event.artifact}</p> : null}
        </article>
      ))}
    </section>
  );
}
