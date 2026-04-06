'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Chat, Document, User } from '@/lib/types';

const navItems = [
  {
    href: '/',
    title: 'Dashboard',
    copy: 'Documents, search, and the current workspace pulse.',
  },
  {
    href: '/documents/demo',
    title: 'Editor',
    copy: 'Single-document editing, versions, and AI actions.',
  },
  {
    href: '/settings',
    title: 'Settings',
    copy: 'Backend URL, user identity, and deployment notes.',
  },
];

export function WorkspaceApp() {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = window.localStorage.getItem('ai-workspace-user-id');
    if (storedUserId) {
      setUserId(storedUserId);
      void loadWorkspace(storedUserId);
    }
  }, []);

  async function loadWorkspace(nextUserId: string) {
    const [docs, chatList] = await Promise.all([
      api.listDocuments(nextUserId) as Promise<Document[]>,
      api.listChats(nextUserId) as Promise<Chat[]>,
    ]);
    setDocuments(docs);
    setChats(chatList);
    setResults(docs);
  }

  async function handleCreateUser() {
    try {
      setLoading(true);
      setMessage(null);
      const user = (await api.createUser(email)) as User;
      window.localStorage.setItem('ai-workspace-user-id', user.id);
      setUserId(user.id);
      await loadWorkspace(user.id);
      setMessage(`Workspace ready for ${user.email}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not create user.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    if (!userId || !search.trim()) {
      setResults(documents);
      return;
    }

    try {
      setLoading(true);
      const response = (await api.searchDocuments(userId, search)) as Document[];
      setResults(response);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Search failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-kicker">AI Workspace</div>
          <div className="brand-title">Context-first collaboration</div>
          <div className="brand-copy">
            A product shell for docs, AI chat, version history, and search that
            feels like a real workspace instead of a demo form.
          </div>
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              <div className="nav-title">{item.title}</div>
              <div className="nav-copy">{item.copy}</div>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="content">
        <section className="hero">
          <div className="pill">Backend: {api.url}</div>
          <h1>Docs, AI, and search in one intentional workspace.</h1>
          <p>
            This frontend talks to your NestJS backend for user creation,
            document CRUD, chat persistence, version history, and search. Use it
            as the missing web layer for Vercel deployment.
          </p>
        </section>

        <section className="grid">
          <div className="panel span-4 stack">
            <h2>Workspace Identity</h2>
            <div className="field">
              <label>Email</label>
              <input
                className="input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="founder@workspace.ai"
              />
            </div>
            <button className="button" onClick={handleCreateUser} disabled={loading || !email}>
              Create User
            </button>
            <div className="field">
              <label>Active User ID</label>
              <input className="input" value={userId} readOnly placeholder="Create a user to begin" />
            </div>
            {message ? <div className="meta">{message}</div> : null}
          </div>

          <div className="panel span-4 metric">
            <h3>Documents</h3>
            <div className="metric-value">{documents.length}</div>
            <div className="muted">Persisted through your Nest + Prisma backend.</div>
          </div>

          <div className="panel span-4 metric">
            <h3>Chats</h3>
            <div className="metric-value">{chats.length}</div>
            <div className="muted">Context-aware conversations saved with assistant replies.</div>
          </div>

          <div className="panel span-7 stack">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <h2>Document Discovery</h2>
              <div className="meta">Searches `/search/documents`</div>
            </div>
            <div className="row">
              <input
                className="input"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search docs by title or content"
              />
              <button className="button secondary" onClick={handleSearch} disabled={!userId || loading}>
                Search
              </button>
            </div>
            <div className="list">
              {results.length ? (
                results.map((document) => (
                  <Link
                    key={document.id}
                    href={`/documents/${document.id}`}
                    className="document-card"
                  >
                    <div className="document-title">{document.title}</div>
                    <div className="meta">{document.content.slice(0, 140) || 'Empty document'}</div>
                  </Link>
                ))
              ) : (
                <div className="empty">No documents yet. Create one from the editor screen.</div>
              )}
            </div>
          </div>

          <div className="panel span-5 stack">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <h2>Recent Chats</h2>
              <div className="meta">Saved server-side</div>
            </div>
            <div className="list">
              {chats.length ? (
                chats.map((chat) => (
                  <div key={chat.id} className="document-card">
                    <div className="document-title">{chat.title || 'Untitled chat'}</div>
                    <div className="meta">
                      {chat._count?.messages ?? 0} messages • updated{' '}
                      {new Date(chat.updatedAt).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty">Create a chat from a document page once you have a user.</div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
