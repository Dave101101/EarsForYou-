import { useCallback, useReducer } from 'react';
import { Message } from './types';
import * as api from './chatApi';

type Action =
  | { type: 'append'; message: Message }
  | { type: 'update'; id: string; patch: Partial<Message> }
  | { type: 'reset' }
;

function reducer(state: { messages: Message[]; isTyping: boolean; isStreaming: boolean; sessionId: string }, action: Action) {
  switch (action.type) {
    case 'append':
      return { ...state, messages: [...state.messages, action.message] };
    case 'update':
      return { ...state, messages: state.messages.map(m => m.id === action.id ? { ...m, ...action.patch } : m) };
    case 'reset':
      return { messages: [], isTyping: false, isStreaming: false, sessionId: state.sessionId };
    default:
      return state;
  }
}

export function useChat(initialSessionId = 'local-session') {
  const [state, dispatch] = useReducer(reducer, { messages: [], isTyping: false, isStreaming: false, sessionId: initialSessionId });

  const send = useCallback(async (content: string) => {
    const userId = 'u-' + Date.now();
    const userMsg: Message = { id: userId, role: 'user', content, timestamp: new Date().toISOString(), status: 'sending' };
    dispatch({ type: 'append', message: userMsg });
    // optimistic
    dispatch({ type: 'update', id: userId, patch: { status: 'sent' } });

    // create assistant placeholder
    const aiId = 'a-' + Date.now();
    const aiMsg: Message = { id: aiId, role: 'ai', content: '', timestamp: new Date().toISOString(), isStreaming: true, status: 'sending' };
    dispatch({ type: 'append', message: aiMsg });

    try {
      let aggregated = '';
      await api.receiveStream({ content, sessionId: state.sessionId }, (token) => {
        aggregated += token;
        dispatch({ type: 'update', id: aiId, patch: { content: aggregated } });
      }, (meta) => {
        dispatch({ type: 'update', id: aiId, patch: { content: meta?.text || aggregated, isStreaming: false, status: 'sent', language: meta?.language } });
        dispatch({ type: 'update', id: userId, patch: { status: 'delivered' } });
      });
    } catch (e) {
      dispatch({ type: 'update', id: aiId, patch: { content: "Sorry, something went wrong.", isStreaming: false, status: 'failed' } });
      dispatch({ type: 'update', id: userId, patch: { status: 'failed' } });
    }
  }, [state.sessionId, state.messages]);

  const reset = useCallback(() => dispatch({ type: 'reset' }), []);

  return [
    { messages: state.messages, isTyping: state.isTyping, isStreaming: state.isStreaming, sessionId: state.sessionId },
    { send, reset },
  ] as const;
}
