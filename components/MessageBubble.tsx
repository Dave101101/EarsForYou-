import React from 'react';
import { Message } from '../chat/types';

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (message.role === 'system') {
    return <div className="ef-system" role="status">{message.content}</div>;
  }

  const rowClass = `ef-bubble-row ${message.role === 'user' ? 'user' : 'ai'}`;
  return (
    <div className={rowClass}>
      <div className={`ef-bubble ${message.role === 'ai' ? 'ai' : 'user'}`} role="article" aria-label={`${message.role} message`}>
        {message.content}
        <div className="ef-meta">
          <div className="meta-time">{time}</div>
        </div>
      </div>
    </div>
  );
}
