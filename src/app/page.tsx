'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';

export default function Home() {
  const { messages, sendMessage, status } = useChat();
  const isLoading = status === 'submitted' || status === 'streaming';
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await sendMessage({ role: 'user', content: input } as any);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 flex flex-col h-screen max-w-4xl mx-auto">
        {/* Header */}
        <header className="p-6 border-b border-white/10 backdrop-blur-xl bg-white/5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center text-white font-bold">
                  AE
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0f]" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Ayoub Essarghini</h1>
              <p className="text-sm text-gray-400">Software Engineer • Available for chat</p>
            </div>
          </div>
        </header>
        
        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-[3px] mb-6">
                <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center text-3xl">
                  👋
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Hey there!</h2>
              <p className="text-gray-400 max-w-md">
                I'm Ayoub, a Software Engineer. Ask me anything about my experience, skills, or projects!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {["What tech stack do you use?", "Tell me about your projects", "What is your experience?"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {messages.map((m: any) => {
            const text = typeof m.content === 'string' 
              ? m.content 
              : m.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || '';
            
            const isUser = m.role === 'user';
            
            return (
              <div 
                key={m.id} 
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-3`}
              >
                {!isUser && (
                  <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-[2px]">
                    <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center text-white font-bold text-sm">
                      AE
                    </div>
                  </div>
                )}
                <div className={`max-w-[75%] ${
                  isUser 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-br-md' 
                    : 'bg-white/5 backdrop-blur-sm border border-white/10 text-gray-100 rounded-2xl rounded-bl-md'
                } px-4 py-3`}>
                  {!isUser && (
                    <p className="text-xs font-medium text-purple-400 mb-1">Ayoub</p>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
                </div>
              </div>
            );
          })}
          
          {/* Thinking indicator */}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex justify-start gap-3">
              <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center text-white font-bold text-sm">
                  AE
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                <p className="text-xs font-medium text-purple-400 mb-1">Ayoub</p>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-6 border-t border-white/10 backdrop-blur-xl bg-white/5">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                isLoading || !input.trim()
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105'
              }`}
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </form>
          <p className="text-center text-xs text-gray-500 mt-3">
            AI-powered assistant based on Ayoub's portfolio
          </p>
        </div>
      </div>
    </div>
  );
}
