"use client";

import { useEffect, useState } from "react";
import { OnboardingStatus } from "@/lib/types";

export default function OnboardingPage() {
  const [status, setStatus] = useState<OnboardingStatus | null>(null);

  useEffect(() => {
    fetch("/api/onboarding/status")
      .then((response) => response.json())
      .then(setStatus)
      .catch(() => null);
  }, []);

  if (!status) {
    return <p>Loading onboarding state...</p>;
  }

  return (
    <section>
      <h2>Onboarding</h2>
      <p>{status.nextStep}</p>

      {status.integrations.map((integration) => (
        <article className="card" key={integration.key}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <strong>{integration.key.toUpperCase()}</strong>
            <span className={`badge badge-${integration.state}`}>
              {integration.state.toUpperCase()}
            </span>
          </div>
          <p>{integration.message}</p>
          <button className="secondary" type="button">
            {integration.action}
          </button>
        </article>
      ))}

      <article className="card">
        <h3>Discovered local repositories</h3>
        <ul>
          {status.localReposDiscovered.map((repo) => (
            <li key={repo}>{repo}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
