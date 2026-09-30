'use client';

import { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Zap, User } from 'lucide-react';
import { useState } from 'react';
import { cn, formatRelativeTime } from '@/lib/utils';
import type { ChatMessage } from '@/types';

interface ChatMessageProps {
  message: ChatMessage;
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper my-3">
      <div className="code-block-header">
        <span className="code-block-lang">{language || 'code'}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={vscDarkPlus}
        customStyle={{ margin: 0, borderRadius: 0, fontSize: '13px', padding: '16px' }}
        showLineNumbers
        lineNumberStyle={{ color: '#484f58', fontSize: '11px' }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export function ChatMessageBubble({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3 mb-5 animate-chat-appear', isUser ? 'flex-row-reverse' : '')}>
      {/* Avatar */}
      <div className={cn(
        'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs',
        isUser
          ? 'bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700'
          : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
      )} style={{
        background: isUser
          ? 'linear-gradient(135deg, #e0eaff, #ede9fe)'
          : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
      }}>
        {isUser ? <User size={13} /> : <Zap size={13} />}
      </div>

      {/* Bubble */}
      <div className={cn('chat-bubble', isUser ? 'user' : 'ai')}>
        {isUser ? (
          <p className="text-sm leading-relaxed">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match;
                  if (isInline) {
                    return (
                      <code
                        className="bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded text-[12.5px] font-mono"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <CodeBlock
                      language={match[1]}
                      code={String(children).replace(/\n$/, '')}
                    />
                  );
                },
                p: ({ children }) => <p className="mb-2 last:mb-0 text-[13.5px] leading-relaxed">{children}</p>,
                h1: ({ children }) => <h1 className="text-[16px] font-700 mb-2 text-neutral-900" style={{ fontWeight: 700 }}>{children}</h1>,
                h2: ({ children }) => <h2 className="text-[15px] font-600 mb-2 text-neutral-900 mt-4" style={{ fontWeight: 600 }}>{children}</h2>,
                h3: ({ children }) => <h3 className="text-[14px] font-600 mb-1.5 text-neutral-900 mt-3" style={{ fontWeight: 600 }}>{children}</h3>,
                ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2 text-[13.5px]">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2 text-[13.5px]">{children}</ol>,
                li: ({ children }) => <li className="text-neutral-700">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-neutral-900">{children}</strong>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-indigo-500 pl-3 my-2 text-neutral-600 dark:text-neutral-400 bg-neutral-50/50 py-1 pr-2 rounded-r text-[13px]">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-3">
                    <table className="w-full text-[13px] border-collapse">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-left font-medium text-neutral-700">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="border border-neutral-200 px-3 py-1.5 text-neutral-600">{children}</td>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        <p className={cn('text-[11px] mt-1.5', isUser ? 'text-indigo-200' : 'text-neutral-400')}>
          {formatRelativeTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-5 animate-chat-appear">
      <div
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
      >
        <Zap size={13} color="white" />
      </div>
      <div className="chat-bubble ai flex items-center gap-1.5 py-3 px-4">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  );
}

interface ChatListProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

export function ChatList({ messages, isTyping }: ChatListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      {messages.map((msg) => (
        <ChatMessageBubble key={msg.id} message={msg} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
