import { io } from 'socket.io-client';

const getSocketUrl = () => {
  if (typeof window !== 'undefined') {
    const override = window.localStorage.getItem('ai-workspace-api-url');
    if (override) return override.replace(/\/$/, '');
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

const URL = getSocketUrl();

export const socket = io(URL, {
  autoConnect: false, // We will connect manually in the component
});
