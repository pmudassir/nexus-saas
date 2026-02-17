import { Shell } from '@/components/layout/Shell';
import { getLeadFieldConfig } from '@/actions/lead-fields';
import { LeadFieldEditor } from './LeadFieldEditor';
import { FileText } from 'lucide-react';

export default async function LeadFieldsPage() {
  const fields = await getLeadFieldConfig();

  return (
    <Shell>
      <div className="space-y-6 max-w-[1000px] mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <FileText className="w-8 h-8" />
            Lead Form Fields
          </h1>
          <p className="text-muted-foreground mt-2">
            Customize which fields appear when adding new leads. Changes apply to all users in your workspace.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-soft">
          <LeadFieldEditor initialFields={fields} />
        </div>
      </div>
    </Shell>
  );
}
