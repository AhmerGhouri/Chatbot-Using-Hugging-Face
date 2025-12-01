import React from 'react';

interface ChatMessageProps {
    role: 'user' | 'assistant';
    content: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
    const isUser = role === 'user';

    return (
        <div
            className={`flex w-full gap-3 mb-4 ${isUser ? 'justify-end animate-slide-right' : 'justify-start animate-slide-left'}`}
            style={{
                display: 'flex',
                width: '100%',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
            }}
        >
            {/* Bot Avatar - Left Side */}
            {!isUser && (
                <div
                    className="avatar avatar-bot"
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '1rem',
                        flexShrink: 0,
                        boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
                    }}
                >
                    🤖
                </div>
            )}

            {/* Message Bubble */}
            <div
                style={{
                    maxWidth: '75%',
                    borderRadius: '16px',
                    padding: '1rem 1.25rem',
                    background: isUser
                        ? 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'
                        : 'rgba(30, 41, 59, 0.9)',
                    color: isUser ? '#ffffff' : '#f1f5f9',
                    borderBottomRightRadius: isUser ? '4px' : '16px',
                    borderBottomLeftRadius: isUser ? '16px' : '4px',
                    boxShadow: isUser
                        ? '0 4px 16px rgba(59, 130, 246, 0.3), 0 0 20px rgba(59, 130, 246, 0.2)'
                        : '0 4px 16px rgba(0, 0, 0, 0.2)',
                    lineHeight: '1.6',
                    fontSize: '0.95rem',
                    backdropFilter: !isUser ? 'blur(20px)' : 'none',
                    border: !isUser ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    if (isUser) {
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4), 0 0 30px rgba(59, 130, 246, 0.3)';
                    } else {
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    if (isUser) {
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.3), 0 0 20px rgba(59, 130, 246, 0.2)';
                    } else {
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
                    }
                }}
            >
                <p style={{
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                    wordBreak: 'break-word',
                }}>
                    {content}
                </p>
            </div>

            {/* User Avatar - Right Side */}
            {isUser && (
                <div
                    className="avatar avatar-user"
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '1rem',
                        flexShrink: 0,
                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                    }}
                >
                    👤
                </div>
            )}
        </div>
    );
};
