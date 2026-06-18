import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { Message } from '../chat/types';

interface Props {
  messages: Message[];
  isTyping?: boolean;
}

export default function MessageList({ messages, isTyping }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  return (
    <div className="ef-message-list" ref={ref} role="list">
      {messages.map(m => (
        <div role="listitem" key={m.id}>
          <MessageBubble message={m} />
        </div>
      ))}
    </div>
  );
}
