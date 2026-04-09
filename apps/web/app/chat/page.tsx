"use client";

import { FormEvent, useState } from "react";
import { TaskIntent } from "@/lib/types";

export default function ChatPage() {
  const [repoId, setRepoId] = useState("acme-web");
  const [prompt, setPrompt] = useState(
    "Fix flaky onboarding provider health checks and prepare a draft PR."
  );
  const [result, setResult] = useState<TaskIntent | null>(null);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/task-intents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoId, prompt })
    });

    const body = await response.json();
    if (!response.ok) {
      setError(body.error ?? "Failed to submit intent");
      return;
    }

    setResult(body.intent as TaskIntent);
  }

  return (
    <section>
      <h2>Embedded chat → TaskIntent</h2>
      <article className="card">
        <p>
          This chat surface submits to the TaskIntent API so planners and runners can
          execute a lifecycle-driven task.
        </p>
        <form onSubmit={onSubmit}>
          <label htmlFor="repoId">Repository</label>
          <select
            id="repoId"
            value={repoId}
            onChange={(event) => setRepoId(event.target.value)}
          >
            <option value="acme-web">acme/web</option>
            <option value="acme-api">acme/api</option>
          </select>
          <label htmlFor="prompt">Intent prompt</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
          />
          <button type="submit">Submit TaskIntent</button>
        </form>
      </article>

      {error ? <p>{error}</p> : null}
      {result ? (
        <article className="card">
          <h3>Intent accepted</h3>
          <p>ID: {result.id}</p>
          <p>Status: {result.status}</p>
          <p>Created: {result.createdAt}</p>
        </article>
      ) : null}
    </section>
  );
}
