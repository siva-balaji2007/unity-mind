'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

const SUGGESTIONS = [
  'Explain this project architecture',
  'How does player movement work?',
  'Where is inventory implemented?',
  'Which scripts reference PlayerController?',
];

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  showSuggestions?: boolean;
}

export function ChatInput({ onSend, disabled, showSuggestions }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const send = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  };

  return (
    <div className="border-t border-neutral-200 bg-white px-4 py-3">
      {/* Suggestions */}
      {showSuggestions && (
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setValue(s);
                textareaRef.current?.focus();
              }}
              className="text-[12px] px-3 py-1.5 rounded-full border border-neutral-200 text-neutral-500 hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50 transition-all"
              style={{ '--brand-50': '#f0f4ff', '--brand-300': '#a5bcfb', '--brand-700': '#4338ca' } as React.CSSProperties}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className={cn(
        'flex items-end gap-3 rounded-xl border border-neutral-200 px-3 py-2 transition-all',
        'focus-within:border-indigo-400 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.08)]'
      )}>
        <button className="text-neutral-400 hover:text-neutral-600 transition-colors mb-1 flex-shrink-0">
          <Paperclip size={16} />
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your project… (Enter to send)"
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent text-[13.5px] text-neutral-900 placeholder:text-neutral-400 outline-none leading-relaxed py-0.5"
          style={{ maxHeight: '160px', fontFamily: 'inherit' }}
        />

        <button
          onClick={send}
          disabled={disabled || !value.trim()}
          className={cn(
            'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all mb-0.5',
            value.trim() && !disabled
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
              : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
          )}
          style={value.trim() && !disabled ? { background: '#4f46e5' } : {}}
        >
          <Send size={14} />
        </button>
      </div>

      <p className="text-[11px] text-neutral-400 mt-1.5 text-center">
        UnityMind may make mistakes. Verify important code suggestions.
      </p>
    </div>
  );
}
