'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/components/ChatMessage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_PROMPTS = [
  "What can you help me with?",
  "Tell me a fun fact",
  "Explain quantum computing",
  "Write a short poem"
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || 'Failed to fetch');
      }

      const data = await response.json();
      const botMessage: Message = { role: 'assistant', content: data.content };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${error instanceof Error ? error.message : 'Something went wrong'}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 1rem',
      position: 'relative',
      zIndex: 1,
    }}>
      {/* Header */}
      <div style={{
        width: '100%',
        maxWidth: '56rem',
        marginBottom: '2rem',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '0.5rem',
        }}>
          <div style={{
            fontSize: '3rem',
            filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))',
          }}>
            💬
          </div>
          <h1
            className="gradient-text"
            style={{
              fontSize: '3rem',
              fontWeight: '700',
              fontFamily: "'Space Grotesk', sans-serif",
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            AI Chatbot
          </h1>
        </div>
        <p style={{
          color: 'var(--foreground-secondary)',
          fontSize: '1.1rem',
          margin: 0,
          opacity: 0.8,
        }}>
          Powered by Meta Llama 3 - Your intelligent conversation partner
        </p>
      </div>

      {/* Chat Container */}
      <div
        className="glass-strong"
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '56rem',
          borderRadius: '24px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: '60vh',
          maxHeight: '70vh',
        }}
      >
        {/* Messages Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          paddingRight: '0.5rem',
          paddingLeft: '0.5rem',
        }}>
          {messages.length === 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2rem',
            }}>
              <div style={{
                textAlign: 'center',
                maxWidth: '500px',
              }}>
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '1rem',
                  filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.5))',
                }}>
                  🚀
                </div>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: 'var(--foreground)',
                }}>
                  Start a Conversation
                </h2>
                <p style={{
                  color: 'var(--foreground-secondary)',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                }}>
                  Ask me anything! I'm here to help with questions, creative writing, explanations, and more.
                </p>
              </div>

              {/* Suggested Prompts */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.75rem',
                width: '100%',
                maxWidth: '600px',
              }}>
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    style={{
                      padding: '0.875rem 1.25rem',
                      borderRadius: '12px',
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      color: 'var(--foreground)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      textAlign: 'left',
                      backdropFilter: 'blur(10px)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.background = 'var(--surface-hover)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.background = 'var(--surface)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <ChatMessage key={i} role={m.role} content={m.content} />
          ))}

          {isLoading && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: '1rem',
              gap: '0.75rem',
            }}>
              <div
                className="avatar avatar-bot"
                style={{
                  width: '36px',
                  height: '36px',
                }}
              >
                🤖
              </div>
              <div style={{
                backgroundColor: 'var(--bot-msg-bg)',
                borderRadius: '16px',
                borderBottomLeftRadius: '4px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '56rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
        }}
      >
        <div style={{
          flex: 1,
          position: 'relative',
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="input-modern"
            disabled={isLoading}
            style={{
              width: '100%',
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="btn-primary"
          style={{
            padding: '0.875rem 2rem',
            minWidth: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          {isLoading ? (
            <>
              <div className="animate-pulse">⏳</div>
              Sending
            </>
          ) : (
            <>
              Send
              <span style={{ fontSize: '1.2rem' }}>✨</span>
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div style={{
        marginTop: '1.5rem',
        textAlign: 'center',
        color: 'var(--foreground-secondary)',
        fontSize: '0.875rem',
        opacity: 0.6,
      }}>
        <p>Built with Next.js & Hugging Face • Press Enter to send</p>
      </div>
    </main>
  );
}
