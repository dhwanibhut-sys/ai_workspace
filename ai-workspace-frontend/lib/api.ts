const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3000';

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

  getDocument(id: string) {
    return fetch(`${API_URL}/documents/${id}`).then(parseResponse);
  },

  updateDocument(id: string, payload: { title?: string; content?: string }) {
    return fetch(`${API_URL}/documents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(parseResponse);
  },

  getVersions(id: string) {
    return fetch(`${API_URL}/documents/${id}/versions`).then(parseResponse);
  },

  restoreVersion(id: string, versionId: string) {
    return fetch(`${API_URL}/documents/${id}/versions/restore`, {
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

  getChat(id: string) {
    return fetch(`${API_URL}/chats/${id}`).then(parseResponse);
  },

  sendMessage(
    chatId: string,
    payload: { content: string; documentId?: string; selectedText?: string },
  ) {
    return fetch(`${API_URL}/chats/${chatId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(parseResponse);
  },
};
