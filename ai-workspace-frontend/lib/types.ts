export type User = {
  id: string;
  email: string;
  createdAt: string;
};

export type Document = {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  createdAt: string;
  updatedAt?: string;
};

export type DocumentVersion = {
  id: string;
  documentId: string;
  title: string;
  content: string;
  createdAt: string;
};

export type Chat = {
  id: string;
  userId: string;
  title?: string | null;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
  _count?: {
    messages: number;
  };
};

export type Message = {
  id: string;
  chatId: string;
  role: string;
  content: string;
  documentId?: string | null;
  createdAt: string;
};
