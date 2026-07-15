'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { stadiums } from '@/lib/stadium-data';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPanel() {
  const t = useTranslations('chat');
  const [stadiumId, setStadiumId] = useState(stadiums[0]?.id ?? '');
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content: t('welcome'),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setError(null);

    const newUserMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, stadiumId }),
      });

      if (response.status === 429) {
        setError(t('errorRateLimit'));
        return;
      }

      if (!response.ok) {
        setError(t('errorGeneric'));
        return;
      }

      const data = await response.json();
      
      const newAssistantMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newAssistantMessage]);
    } catch {
      setError(t('errorGeneric'));
    } finally {
      setLoading(false);
      // Focus back on input
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section
      aria-labelledby="chat-title"
      className="flex flex-col h-[550px] rounded-2xl bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 overflow-hidden"
    >
      {/* Header Panel */}
      <div className="p-4 bg-gray-850 border-b border-gray-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 id="chat-title" className="text-lg font-bold text-blue-400">
            💬 {t('title')}
          </h2>
          <p className="text-xs text-gray-400">{t('description')}</p>
        </div>
        
        {/* Stadium Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="chat-stadium-select" className="text-xs text-gray-400 whitespace-nowrap">
            {t('selectStadium')}:
          </label>
          <select
            id="chat-stadium-select"
            aria-label={t('selectStadium')}
            value={stadiumId}
            onChange={(e) => setStadiumId(e.target.value)}
            className="rounded-lg bg-gray-800 border border-gray-700 text-gray-200 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {stadiums.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Chat messages history"
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-none'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <span className="block text-[10px] text-gray-400 mt-1 text-right">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-400 border border-gray-700 rounded-2xl rounded-bl-none px-4 py-3 text-sm flex items-center gap-2">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce delay-200"></span>
              </span>
              <span>{t('sending')}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 bg-gray-850 border-t border-gray-800/80">
        {error && (
          <div
            role="alert"
            className="mb-2 p-2 rounded bg-red-900/40 border border-red-700/40 text-red-300 text-xs"
          >
            {error}
          </div>
        )}
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            aria-label={t('placeholder')}
            placeholder={t('placeholder')}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={500}
            className="flex-1 resize-none rounded-xl bg-gray-800 border border-gray-700 text-gray-200 px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-24 overflow-y-auto"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            aria-label={t('send')}
            className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white p-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg
              className="w-5 h-5 transform rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
