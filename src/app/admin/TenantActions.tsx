"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, Users } from "lucide-react"; 
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { updateTenant, deleteTenant } from "@/actions/tenants";
import { toast } from "sonner";

interface TenantActionsProps {
  tenant: {
    id: string;
    name: string;
    slug: string;
    status: string;
  };
}

export function TenantActions({ tenant }: TenantActionsProps) {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpdate(formData: FormData) {
    setIsLoading(true);
    try {
      await updateTenant(formData);
      setOpen(false);
      toast.success("Tenant updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update tenant");
    } finally {
      setIsLoading(false);
    }
  }
  
  async function handleDelete() {
      setIsLoading(true);
      try {
          const formData = new FormData();
          formData.append("id", tenant.id);
          await deleteTenant(formData);
          setDeleteOpen(false);
          toast.success("Tenant deleted successfully");
      } catch (error) {
          console.error(error);
          toast.error("Failed to delete tenant. Ensure no active data exists or contact support.");
      } finally {
          setIsLoading(false);
      }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setOpen(true)} className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Link href={`/admin/tenants/${tenant.id}/users`} className="w-full">
            <DropdownMenuItem className="cursor-pointer w-full">
                <Users className="mr-2 h-4 w-4" />
                Users
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            onSelect={() => setDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tenant</DialogTitle>
          </DialogHeader>
          <form action={handleUpdate} className="grid gap-4 py-4">
            <input type="hidden" name="id" value={tenant.id} />
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <input
                id="name"
                name="name"
                defaultValue={tenant.name}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-gray-200"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="slug" className="text-sm font-medium">Slug</label>
              <input
                id="slug"
                name="slug"
                defaultValue={tenant.slug}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-gray-200"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">Status</label>
               <select
                id="status"
                name="status"
                defaultValue={tenant.status}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-gray-200"
              >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isLoading} className="bg-black text-white hover:bg-gray-800">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Delete Tenant?</DialogTitle>
            </DialogHeader>
            <div className="py-4">
                <p className="text-sm text-muted-foreground">Are you sure you want to delete <strong className="text-foreground">{tenant.name}</strong>? This action cannot be undone and will delete all associated data.</p>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isLoading} className="bg-red-600 text-white hover:bg-red-700">
                    {isLoading ? "Deleting..." : "Delete Tenant"}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
