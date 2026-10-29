import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ShoppingBag,
  ExternalLink,
  RotateCcw,
  Store,
  MapPin,
  Loader2,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage, Product } from '../types';

export const AIAssistantDrawer: React.FC<{ isEmbedded?: boolean }> = ({ isEmbedded = false }) => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    products,
    user,
    cart,
    addToCart,
    setSelectedProductId,
    orders,
    setIsShopCreatorOpen,
    setActiveTab,
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('babal_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'msg-1',
        sender: 'assistant',
        text: `Namaste & Welcome, **${user.name}**! ✨\n\nI am **Babal Genius**, your personalized AI shopping companion. I can help you discover extraordinary artisan and tech products, recommend gifts within your budget, help you start your own shop, or track live shipments. What can I do for you today?`,
        timestamp: 'Just now',
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('babal_chat_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isAssistantOpen && !isEmbedded) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          chatHistory: messages.slice(-6),
          userContext: {
            name: user.name,
            cartCount: cart.length,
            hasShop: !!user.userShopId,
            walletBalance: user.walletBalance,
          },
          availableProducts: products,
        }),
      });

      if (!response.ok) {
        throw new Error('Chat service error');
      }

      const data = await response.json();
      let replyText = data.reply || "I'm right here! How can I assist you with your shopping or shop creation?";

      // Extract recommended product IDs if present
      let recommendedIds: string[] = [];
      const match = replyText.match(/RECOMMENDED_IDS:\s*([^\n\r]+)/);
      if (match && match[1]) {
        recommendedIds = match[1]
          .split(',')
          .map((id: string) => id.trim())
          .filter((id: string) => products.some((p) => p.id === id));
        replyText = replyText.replace(/RECOMMENDED_IDS:\s*([^\n\r]+)/, '').trim();
      }

      const botMessage: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProductIds: recommendedIds,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Error contacting chat endpoint:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-bot-err-${Date.now()}`,
          sender: 'assistant',
          text: `I'm having a brief sync hiccup, but I recommend checking out our top-selling **AeroSound Pro ANC Headphones** and **Himalayan Yak Wool Throw Blankets** in the marketplace!`,
          timestamp: 'Just now',
          recommendedProductIds: ['prod-tech-1', 'prod-art-1'],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    '🎁 Best gift under $100',
    '⚡ Top tech gear for remote work',
    '🌿 Authentic Himalayan artisan crafts',
    '🏪 How do I launch my small shop?',
    '📦 Where is my active order BBL-9842?',
  ];

  const clearChat = () => {
    const initial: ChatMessage[] = [
      {
        id: 'msg-1',
        sender: 'assistant',
        text: `Chat cleared! How can I assist you today, **${user.name}**?`,
        timestamp: 'Just now',
      },
    ];
    setMessages(initial);
  };

  const renderContent = () => (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-extrabold text-base text-white">
                Babal Genius
              </h2>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                AI CONCIERGE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Personalized Shopper & Shop Advisor</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Clear Chat History"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {!isEmbedded && (
            <button
              onClick={() => setIsAssistantOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 text-violet-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-amber-400" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none shadow-md shadow-amber-500/10'
                  : 'bg-slate-950 border border-slate-800/80 text-slate-200 rounded-bl-none shadow-md'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {/* Recommended Product Cards inside chat */}
              {msg.recommendedProductIds && msg.recommendedProductIds.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-amber-400 block">
                    ✨ Recommended for you:
                  </span>
                  {msg.recommendedProductIds.map((prodId) => {
                    const prod = products.find((p) => p.id === prodId);
                    if (!prod) return null;
                    return (
                      <div
                        key={prod.id}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3 hover:border-amber-500/40 transition-colors"
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-800 flex-shrink-0 cursor-pointer"
                          onClick={() => {
                            setSelectedProductId(prod.id);
                            if (!isEmbedded) setIsAssistantOpen(false);
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <span
                            className="font-bold text-white block truncate cursor-pointer hover:text-amber-400"
                            onClick={() => {
                              setSelectedProductId(prod.id);
                              if (!isEmbedded) setIsAssistantOpen(false);
                            }}
                          >
                            {prod.name}
                          </span>
                          <span className="text-[11px] font-mono text-emerald-400">
                            ${prod.price.toFixed(2)} • {prod.shopName}
                          </span>
                        </div>
                        <button
                          onClick={() => addToCart(prod, 1)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 flex-shrink-0 shadow"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <span
                className={`text-[10px] block mt-1.5 ${
                  msg.sender === 'user' ? 'text-slate-800 text-right' : 'text-slate-500'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 items-center text-slate-400 text-xs">
            <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center flex-shrink-0">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            </div>
            <span className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl text-slate-300 animate-pulse">
              Babal Genius is thinking & researching catalog...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium whitespace-nowrap transition-colors border border-slate-700/60"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for recommendations, gifts, order status, or shop advice..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold transition-all disabled:opacity-40 shadow-md shadow-violet-600/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );

  // If embedded as full page tab
  if (isEmbedded) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 h-[80vh] flex flex-col">
        <div className="h-full rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          {renderContent()}
        </div>
      </div>
    );
  }

  // Floating Drawer Mode
  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] shadow-2xl border-l border-slate-800 flex flex-col animate-slide-in-right">
      {renderContent()}
    </div>
  );
};
