const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const override = window.localStorage.getItem('ai-workspace-api-url');
    if (override) return override.replace(/\/$/, '');
  }
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3001';
};

const API_URL = getApiUrl();

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = 'Request failed.';

    try {
      const body = await response.json();
      message =
        (Array.isArray(body.message) ? body.message.join(', ') : body.message) ||
        message;
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export const api = {
  url: API_URL,

  createUser(email: string) {
    return fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).then(parseResponse);
  },

  listDocuments(userId: string) {
    return fetch(`${API_URL}/documents?userId=${userId}`).then(parseResponse);
  },

  createDocument(payload: { title: string; content: string; userId: string }) {
    return fetch(`${API_URL}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(parseResponse);
  },

  getDocument(id: string, userId: string) {
    return fetch(`${API_URL}/documents/${id}?userId=${userId}`).then(parseResponse);
  },

  updateDocument(
    id: string,
    userId: string,
    payload: { title?: string; content?: string },
  ) {
    return fetch(`${API_URL}/documents/${id}?userId=${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(parseResponse);
  },

  getVersions(id: string, userId: string) {
    return fetch(`${API_URL}/documents/${id}/versions?userId=${userId}`).then(
      parseResponse,
    );
  },

  restoreVersion(id: string, userId: string, versionId: string) {
    return fetch(`${API_URL}/documents/${id}/versions/restore?userId=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ versionId }),
    }).then(parseResponse);
  },

  searchDocuments(userId: string, q: string) {
    return fetch(
      `${API_URL}/search/documents?userId=${userId}&q=${encodeURIComponent(q)}`,
    ).then(parseResponse);
  },

  createChat(payload: { userId: string; title?: string }) {
    return fetch(`${API_URL}/chats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(parseResponse);
  },

  listChats(userId: string) {
    return fetch(`${API_URL}/chats?userId=${userId}`).then(parseResponse);
  },

  getChat(id: string, userId: string) {
    return fetch(`${API_URL}/chats/${id}?userId=${userId}`).then(parseResponse);
  },

  sendMessage(
    chatId: string,
    userId: string,
    payload: { content: string; documentId?: string; selectedText?: string },
  ) {
    return fetch(`${API_URL}/chats/${chatId}/messages?userId=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(parseResponse);
  },
};
