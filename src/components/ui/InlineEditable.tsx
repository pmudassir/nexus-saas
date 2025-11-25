'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';

interface InlineEditableProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  type?: 'text' | 'textarea';
  className?: string;
  placeholder?: string;
}

export function InlineEditable({
  value: initialValue,
  onSave,
  type = 'text',
  className = '',
  placeholder = 'Click to edit',
}: InlineEditableProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (value === initialValue) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(value);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
      setValue(initialValue); // Revert on error
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div
        onClick={() => setIsEditing(true)}
        className={`cursor-pointer rounded px-2 py-1 hover:bg-white/5 transition-colors ${className}`}
        title="Click to edit"
      >
        {initialValue || <span className="text-slate-500">{placeholder}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isSaving}
          className={`flex-1 rounded border border-white/20 bg-slate-800 px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 ${className}`}
          rows={3}
          autoFocus
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isSaving}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSave();
            } else if (e.key === 'Escape') {
              handleCancel();
            }
          }}
          className={`flex-1 rounded border border-white/20 bg-slate-800 px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 ${className}`}
          autoFocus
        />
      )}

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="rounded bg-emerald-600 p-1 hover:bg-emerald-700 disabled:opacity-50"
        title="Save"
      >
        <Check className="w-4 h-4" />
      </button>

      <button
        onClick={handleCancel}
        disabled={isSaving}
        className="rounded bg-slate-700 p-1 hover:bg-slate-600 disabled:opacity-50"
        title="Cancel"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
