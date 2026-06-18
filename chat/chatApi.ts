import { Message } from './types';

export async function sendMessage(payload: { content: string; sessionId: string }) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', text: payload.content }] }),
  });
  if (!res.ok) throw new Error('Chat API error');
  return res.json();
}

// receiveStream reads NDJSON tokens from /api/chat/stream and forwards them
export async function receiveStream(payload: { content: string; sessionId: string }, onToken: (token: string) => void, onDone?: (meta?: { text?: string; language?: string }) => void) {
  const res = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', text: payload.content }] }),
  });

  if (!res.ok) throw new Error('Stream not available');
  if (!res.body) throw new Error('No stream body');

  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += dec.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const obj = JSON.parse(line);
        if (obj.type === 'token') onToken(obj.token);
        if (obj.type === 'done' && onDone) onDone({ text: obj.text, language: obj.language });
      } catch (e) {
        // ignore parse errors
      }
    }
  }
}
