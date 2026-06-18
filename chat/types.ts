export type Role = 'ai' | 'user' | 'system';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: string; // ISO
  isStreaming?: boolean;
  status?: MessageStatus;
  language?: string;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  isStreaming: boolean;
  sessionId: string;
}
