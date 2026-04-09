"use client";

import { useEffect, useState } from "react";

type RepoDetail = {
  id: string;
  name: string;
  health: string;
  openTasks: number;
  activeRuns: number;
  failingChecks: number;
  runnerMode: string;
  branchStatus: string;
  artifactHistory: string[];
};

export default function RepoControlPage({
  params
}: {
  params: Promise<{ repoId: string }>;
}) {
  const [repoId, setRepoId] = useState<string>("");
  const [data, setData] = useState<RepoDetail | null>(null);

  useEffect(() => {
    params.then(({ repoId: id }) => setRepoId(id));
  }, [params]);

  useEffect(() => {
    if (!repoId) {
      return;
    }

    fetch(`/api/workspace/${repoId}`)
      .then((response) => response.json())
      .then(setData)
      .catch(() => null);
  }, [repoId]);

  if (!data) {
    return <p>Loading repository control view...</p>;
  }

  return (
    <section>
      <h2>Repository control: {data.name}</h2>
      <article className="card">
        <p>Health: {data.health}</p>
        <p>Branch/PR status: {data.branchStatus}</p>
        <p>Runner mode: {data.runnerMode}</p>
      </article>
      <article className="card">
        <h3>Artifact history</h3>
        <ul>
          {data.artifactHistory.map((run) => (
            <li key={run}>{run}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
