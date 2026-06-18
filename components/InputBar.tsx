import React, { useState } from 'react';

interface Props {
  onSend: (text: string) => void;
  isSending?: boolean;
}

export default function InputBar({ onSend, isSending }: Props) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText('');
  };

  return (
    <div className="ef-inputbar">
      <div className="ef-attach">📎</div>
      <div className="ef-input">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type your message..." onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); handleSend(); } }} />
      </div>
      <div className="ef-emoji">😊</div>
      <button className="ef-send" onClick={handleSend} aria-label="Send" disabled={isSending}>{'➤'}</button>
    </div>
  );
}
