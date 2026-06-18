import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Props {
  onPromptSelect: (text: string) => void;
}

export default function ChatWelcome({ onPromptSelect }: Props) {
  const { t } = useApp();

  const prompts = [
    t('chat_prompt_1'),
    t('chat_prompt_2'),
    t('chat_prompt_3'),
  ];

  return (
    <div className="ef-chat-welcome">
      <div className="ef-welcome-icon">
        <MessageCircle className="w-8 h-8" />
      </div>
      <h2 className="ef-welcome-title">{t('chat_welcome_title')}</h2>
      <p className="ef-welcome-subtitle">{t('chat_welcome_subtitle')}</p>
      <div className="ef-welcome-prompts">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="ef-welcome-prompt"
            onClick={() => onPromptSelect(prompt)}
          >
            <Sparkles className="w-3 h-3 inline mr-1 opacity-60" />
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
