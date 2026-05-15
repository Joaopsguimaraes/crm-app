import type { ReactElement } from "react";
import type { CrmHealthResponse } from "@crm/shared";

const health: CrmHealthResponse = {
  app: "crm-app",
  status: "ok",
  timestamp: new Date().toISOString()
};

export default function HomePage(): ReactElement {
  return (
    <main>
      <section>
        <p>{health.app}</p>
        <h1>CRM App</h1>
        <p>Frontend package is ready with strict TypeScript, ESLint, and Prettier.</p>
      </section>
    </main>
  );
}
