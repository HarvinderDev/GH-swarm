import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>
          <h1>Codex GitHub Swarm</h1>
          <div className="row" style={{ marginBottom: 20 }}>
            <Link href="/onboarding">Onboarding</Link>
            <Link href="/workspace">Workspace</Link>
            <Link href="/chat">Chat</Link>
            <Link href="/runs/run_1001">Run Detail</Link>
            <Link href="/approvals">Approvals</Link>
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
