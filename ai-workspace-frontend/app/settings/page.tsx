export default function SettingsPage() {
  return (
    <div className="content">
      <section className="hero">
        <div className="pill">Deployment</div>
        <h1>Settings and deployment notes</h1>
        <p>
          This frontend expects a backend URL in <code>NEXT_PUBLIC_API_URL</code>. For local work,
          point it to <code>http://localhost:3000</code>. For Vercel, point it to your deployed Nest
          backend URL.
        </p>
      </section>

      <section className="grid">
        <div className="panel span-6 stack">
          <h2>Frontend env</h2>
          <div className="document-card">
            <div className="document-title">NEXT_PUBLIC_API_URL</div>
            <div className="meta">Example: https://your-backend.vercel.app</div>
          </div>
        </div>

        <div className="panel span-6 stack">
          <h2>Vercel shape</h2>
          <div className="document-card">
            <div className="document-title">Project 1: Frontend</div>
            <div className="meta">Root directory: ai-workspace-frontend</div>
          </div>
          <div className="document-card">
            <div className="document-title">Project 2: Backend</div>
            <div className="meta">Root directory: ai-workspace-backend</div>
          </div>
        </div>
      </section>
    </div>
  );
}
