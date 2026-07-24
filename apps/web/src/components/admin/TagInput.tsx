// apps/web/src/components/admin/TagInput.tsx
'use client';

import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ tags, onChange, placeholder = 'React, Next.js, Supabase...' }: TagInputProps) {
  const [input, setInput] = useState('');

  function addTag(raw: string) {
    const value = raw.trim();
    if (!value) return;
    if (tags.some((t) => t.toLowerCase() === value.toLowerCase())) {
      setInput('');
      return;
    }
    onChange([...tags, value]);
    setInput('');
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }

  return (
    <div className="w-full rounded-lg border border-slate-200 bg-[#f8f8f8] px-3 py-2 transition focus-within:border-[#4925B0] focus-within:ring-1 focus-within:ring-[#4925B0]/30">
      {tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="admin-body inline-flex items-center gap-1 rounded-full bg-[#4925B0]/10 px-2.5 py-1 text-xs font-medium text-[#4925B0]"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="transition hover:text-[#2f1770]"
                aria-label={`Retirer ${tag}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(input)}
        placeholder={tags.length === 0 ? placeholder : 'Ajouter une techno...'}
        className="admin-body w-full bg-transparent text-sm text-[#111111] placeholder-slate-400 focus:outline-none"
      />
      <p className="admin-body mt-1 text-[11px] text-slate-400">Entrée ou virgule pour ajouter un tag</p>
    </div>
  );
}