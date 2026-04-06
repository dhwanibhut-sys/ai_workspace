'use client';

import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('ai-workspace-api-url') || 'http://localhost:3001';
      setApiUrl(stored);
    }
  }, []);

  function handleSave() {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('ai-workspace-api-url', apiUrl);
      setMessage('Settings saved! Please refresh the page to apply changes.');
      setTimeout(() => window.location.reload(), 1500);
    }
  }

  function handleReset() {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('ai-workspace-api-url');
      setMessage('Reset to default. Refreshing...');
      setTimeout(() => window.location.reload(), 1500);
    }
  }

  return (
    <div className="content">
      <section className="hero">
        <div className="pill">Deployment</div>
        <h1>Settings and Backend Configuration</h1>
        <p>
          Configure where your frontend looks for the NestJS backend. This overrides the default
          <code>NEXT_PUBLIC_API_URL</code> environment variable.
        </p>
      </section>

      <section className="grid">
        <div className="panel span-6 stack">
          <h2>API Connectivity</h2>
          <div className="field">
            <label>Backend API URL</label>
            <input
              className="input"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:3001"
            />
          </div>
          <div className="row">
            <button className="button" onClick={handleSave}>Save & Reconnect</button>
            <button className="button ghost" onClick={handleReset}>Reset to Defaults</button>
          </div>
          {message && <div className="meta">{message}</div>}
        </div>

        <div className="panel span-6 stack">
          <h2>Deployment Notes</h2>
          <div className="document-card">
            <div className="document-title">Vercel Setup</div>
            <div className="meta">
              Root directory: <code>ai-workspace-frontend</code>
            </div>
          </div>
          <div className="document-card">
            <div className="document-title">Railway Setup</div>
            <div className="meta">
              Point to <code>ai-workspace-backend</code> with <code>npm run start:prod</code>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
