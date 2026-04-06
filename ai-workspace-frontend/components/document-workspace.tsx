'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { socket } from '@/lib/socket';
import type { Chat, Document, DocumentVersion, Message } from '@/lib/types';

type Props = {
  documentId: string;
};

export function DocumentWorkspace({ documentId }: Props) {
  const [userId, setUserId] = useState('');
  const [document, setDocument] = useState<Document | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [status, setStatus] = useState('Load a document to begin.');

  useEffect(() => {
    const storedUserId = window.localStorage.getItem('ai-workspace-user-id') || '';
    setUserId(storedUserId);
    void loadDocument(storedUserId);

    // Socket.io integration
    socket.connect();
    socket.emit('join_document', { documentId, userId: storedUserId });

    socket.on('doc_updated', (data: { content: string; title: string }) => {
      setContent(data.content);
      setTitle(data.title);
      setStatus('Other user updated the document.');
    });

    return () => {
      socket.emit('leave_document', documentId);
      socket.off('doc_updated');
      socket.disconnect();
    };
  }, [documentId]);

  // Real-time synchronization
  useEffect(() => {
    if (!documentId || documentId === 'demo') return;

    const timeoutId = setTimeout(() => {
      socket.emit('doc_update', { documentId, content, title });
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [content, title, documentId]);

  async function loadDocument(storedUserId: string) {
    try {
      const [doc, versionList] = await Promise.all([
        api.getDocument(documentId, storedUserId) as Promise<Document>,
        api.getVersions(documentId, storedUserId) as Promise<DocumentVersion[]>,
      ]);

      setDocument(doc);
      setTitle(doc.title);
      setContent(doc.content);
      setVersions(versionList);

      if (storedUserId) {
        const chats = (await api.listChats(storedUserId)) as Chat[];
        const existing = chats[0];
        if (existing) {
          const fullChat = (await api.getChat(existing.id, storedUserId)) as Chat;
          setChat(fullChat);
          setMessages(fullChat.messages || []);
        }
      }
      setStatus('Document loaded.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not load document.');
    }
  }

  async function handleSave() {
    try {
      const updated = (await api.updateDocument(documentId, userId, {
        title,
        content,
      })) as Document;
      setDocument(updated);
      const versionList = (await api.getVersions(
        documentId,
        userId,
      )) as DocumentVersion[];
      setVersions(versionList);
      setStatus('Document saved and version snapshot recorded.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Save failed.');
    }
  }

  async function ensureChat() {
    if (chat) return chat;
    if (!userId) throw new Error('Create a user on the dashboard first.');
    const created = (await api.createChat({
      userId,
      title: document?.title ? `${document.title} assistant` : 'Workspace assistant',
    })) as Chat;
    const fullChat = (await api.getChat(created.id, userId)) as Chat;
    setChat(fullChat);
    setMessages(fullChat.messages || []);
    return created;
  }

  async function handleAskAi(nextPrompt: string) {
    try {
      const activeChat = await ensureChat();
      const response = (await api.sendMessage(activeChat.id, userId, {
        content: nextPrompt,
        documentId,
        selectedText: selectedText || undefined,
      })) as {
        assistantMessage: Message;
        userMessage: Message;
      };

      setMessages((current) => [...current, response.userMessage, response.assistantMessage]);
      setPrompt('');
      setStatus('AI response saved to chat.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'AI request failed.');
    }
  }

  async function handleRestore(versionId: string) {
    try {
      const restored = (await api.restoreVersion(
        documentId,
        userId,
        versionId,
      )) as Document;
      setDocument(restored);
      setTitle(restored.title);
      setContent(restored.content);
      const versionList = (await api.getVersions(
        documentId,
        userId,
      )) as DocumentVersion[];
      setVersions(versionList);
      setStatus('Version restored successfully.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Restore failed.');
    }
  }

  if (documentId === 'demo') {
    return (
      <div className="content">
        <section className="hero">
          <h1>Open a real document from the dashboard.</h1>
          <p>
            This route is ready, but it needs a real document ID from your backend. Create a user and
            document first from the dashboard screen.
          </p>
          <div className="row" style={{ marginTop: 18 }}>
            <Link href="/" className="button">Back to dashboard</Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="content">
      <section className="hero">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <div className="pill">Context-aware editor</div>
            <h1>{document?.title || 'Loading document...'}</h1>
            <p>
              Edit content, snapshot versions automatically, and send highlighted context into your
              chat workflow.
            </p>
          </div>
          <Link href="/" className="button secondary">Dashboard</Link>
        </div>
      </section>

      <section className="grid">
        <div className="panel span-7 stack">
          <div className="field">
            <label>Title</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="field">
            <label>Content</label>
            <textarea
              className="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write markdown-style notes here..."
            />
          </div>
          <div className="field">
            <label>Selected Text for Inline AI</label>
            <textarea
              className="textarea"
              value={selectedText}
              onChange={(e) => setSelectedText(e.target.value)}
              placeholder="Paste highlighted text here, then ask AI to explain or rewrite it."
            />
          </div>
          <div className="row">
            <button className="button" onClick={handleSave}>Save document</button>
            <button className="button ghost" onClick={() => handleAskAi('Summarize the selected text and explain why it matters.')}>
              Inline AI Action
            </button>
          </div>
          <div className="meta">{status}</div>
        </div>

        <div className="panel span-5 stack">
          <h2>Version History</h2>
          <div className="list">
            {versions.length ? (
              versions.map((version) => (
                <div key={version.id} className="version-card">
                  <div className="document-title">{version.title}</div>
                  <div className="meta">{new Date(version.createdAt).toLocaleString()}</div>
                  <div className="meta" style={{ margin: '8px 0 14px' }}>
                    {version.content.slice(0, 120) || 'Empty snapshot'}
                  </div>
                  <button className="button secondary" onClick={() => handleRestore(version.id)}>
                    Restore this version
                  </button>
                </div>
              ))
            ) : (
              <div className="empty">Version snapshots will appear after your first save.</div>
            )}
          </div>
        </div>

        <div className="panel span-12 stack">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h2>AI Chat</h2>
            <div className="meta">Messages are persisted through `/chats/:id/messages`.</div>
          </div>
          <div className="row">
            <input
              className="input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask a question about this document..."
            />
            <button className="button" onClick={() => handleAskAi(prompt)} disabled={!prompt.trim()}>
              Ask AI
            </button>
          </div>
          <div className="list">
            {messages.length ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`chat-bubble ${message.role === 'assistant' ? 'assistant' : 'user'}`}
                >
                  <div className="document-title">{message.role}</div>
                  <div>{message.content}</div>
                </div>
              ))
            ) : (
              <div className="empty">No messages yet. Ask the document a question to start.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
