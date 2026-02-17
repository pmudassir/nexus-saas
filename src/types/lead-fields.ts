export type LeadField = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'phone' | 'select' | 'textarea';
  required: boolean;
  options?: string[]; // For select type
};

// Default fields for all tenants
export const DEFAULT_LEAD_FIELDS: LeadField[] = [
  { key: 'name', label: 'Full Name', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'phone', label: 'Phone', type: 'phone', required: false },
  { key: 'company', label: 'Company', type: 'text', required: false },
  { key: 'source', label: 'Source', type: 'select', required: false, options: ['Website', 'Referral', 'Social Media', 'Cold Call', 'Other'] },
  { key: 'value', label: 'Estimated Value', type: 'number', required: false },
  { key: 'notes', label: 'Notes', type: 'textarea', required: false },
];
