import React from 'react';
import '../chat/chat-ui.css';
import ChatHeader from '../components/ChatHeader';
import MessageList from '../components/MessageList';
import InputBar from '../components/InputBar';
import TypingIndicator from '../components/TypingIndicator';
import { useChat } from '../chat/useChat';

export function ChatScreen() {
  const [state, actions] = useChat();

  return (
    <div className="ef-chat-screen">
      <div className="ef-chat-card">
        <ChatHeader />
        <MessageList messages={state.messages} isTyping={state.isTyping} />
        {state.isStreaming && <div className="ef-typing-wrapper"><TypingIndicator /></div>}
        <InputBar onSend={(t)=>actions.send(t)} isSending={false} />
      </div>
    </div>
  );
}
