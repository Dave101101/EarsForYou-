import React from 'react';

interface Props {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
}

export default function ChatHeader({ title = 'EarsForYou', subtitle = 'I\'m here to listen.', onBack }: Props) {
  return (
    <div className="ef-chat-header">
      <div className="ef-header-row">
        <div className="ef-brand-chip">EF</div>
        <div className="ef-header-title">
          <div className="name">{title}</div>
          <div className="subtitle">{subtitle}</div>
        </div>
      </div>
      <div className="ef-header-actions">
        {onBack && <button onClick={onBack} aria-label="Back" className="ef-back-button">Back</button>}
      </div>
    </div>
  );
}
