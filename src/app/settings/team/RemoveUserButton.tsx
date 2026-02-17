'use client';

import { Trash2 } from 'lucide-react';

export function RemoveUserButton({
  tenantUserId,
  userName,
  removeUser,
}: {
  tenantUserId: string;
  userName: string;
  removeUser: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={removeUser}>
      <input type="hidden" name="tenantUserId" value={tenantUserId} />
      <button
        type="submit"
        className="p-2 rounded-md hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
        onClick={(e) => {
          if (!confirm(`Remove ${userName}?`)) {
            e.preventDefault();
          }
        }}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  );
}
