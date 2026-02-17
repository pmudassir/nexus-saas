'use client';

import { useState } from 'react';
import { saveLeadFieldConfig } from '@/actions/lead-fields';
import { DEFAULT_LEAD_FIELDS, type LeadField } from '@/types/lead-fields';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Trash2,
  GripVertical,
  Save,
  RotateCcw,
} from 'lucide-react';

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'select', label: 'Dropdown' },
  { value: 'textarea', label: 'Long Text' },
];

export function LeadFieldEditor({ initialFields }: { initialFields: LeadField[] }) {
  const [fields, setFields] = useState<LeadField[]>(initialFields);
  const [saving, setSaving] = useState(false);

  const addField = () => {
    const key = `custom_${Date.now()}`;
    setFields([
      ...fields,
      { key, label: '', type: 'text', required: false },
    ]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<LeadField>) => {
    setFields(
      fields.map((field, i) => (i === index ? { ...field, ...updates } : field))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveLeadFieldConfig(fields);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFields(DEFAULT_LEAD_FIELDS);
  };

  return (
    <div className="space-y-4">
      {/* Fields List */}
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.key}
            className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors group"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground/40 mt-2.5 cursor-grab" />

            <div className="flex-1 grid gap-3 md:grid-cols-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1">
                  Label
                </label>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => updateField(index, { label: e.target.value })}
                  className="w-full rounded-lg bg-white border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                  placeholder="Field label"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1">
                  Type
                </label>
                <select
                  value={field.type}
                  onChange={(e) => updateField(index, { type: e.target.value as LeadField['type'] })}
                  className="w-full rounded-lg bg-white border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                >
                  {FIELD_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {field.type === 'select' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1">
                    Options (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={field.options?.join(', ') || ''}
                    onChange={(e) =>
                      updateField(index, {
                        options: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full rounded-lg bg-white border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                    placeholder="Option 1, Option 2"
                  />
                </div>
              )}

              <div className="flex items-end gap-3">
                <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField(index, { required: e.target.checked })}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  Required
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={() => removeField(index)}
              className="p-2 rounded-xl hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors mt-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          onClick={addField}
          variant="outline"
          className="rounded-full h-10 px-5 font-medium"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Field
        </Button>

        <Button
          type="button"
          onClick={handleReset}
          variant="ghost"
          className="rounded-full h-10 px-5 font-medium text-muted-foreground"
        >
          <RotateCcw className="h-4 w-4 mr-2" /> Reset to Defaults
        </Button>

        <div className="flex-1" />

        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-black text-white hover:bg-gray-800 h-10 px-8 font-medium shadow-md"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Configuration'}
        </Button>
      </div>
    </div>
  );
}
