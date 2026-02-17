'use client';

import { Trash2 } from 'lucide-react';

export function RemoveRoleButton({
  roleId,
  roleName,
  deleteRole,
}: {
  roleId: string;
  roleName: string;
  deleteRole: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={deleteRole}>
      <input type="hidden" name="roleId" value={roleId} />
      <button
        type="submit"
        className="p-2 rounded-xl hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
        onClick={(e) => {
          if (!confirm(`Delete role "${roleName}"? Members will be unassigned.`)) {
            e.preventDefault();
          }
        }}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  );
}
