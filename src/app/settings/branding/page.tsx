import { Shell } from '@/components/layout/Shell';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { Button } from '@/components/ui/button';
import { updateBranding } from '@/actions/branding';
import { Palette, Image, Pipette } from 'lucide-react';

export default async function BrandingPage() {
  const { tenant } = await requireTenantMembership();

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Palette className="w-8 h-8" />
            Branding & Customization
          </h1>
          <p className="text-muted-foreground mt-2">
            Customize your workspace appearance with your brand colors and logo.
          </p>
        </div>

        <form action={updateBranding} className="space-y-6">
          {/* Logo Upload */}
          <div className="rounded-md border border-border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Image className="w-5 h-5" />
              Logo
            </h2>
            <div className="space-y-4">
              {tenant.logoUrl && (
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-md bg-muted border border-border p-2 flex items-center justify-center">
                    <img
                      src={tenant.logoUrl}
                      alt="Current logo"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">Current logo</div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  name="logoUrl"
                  defaultValue={tenant.logoUrl || ''}
                  placeholder="https://example.com/logo.png"
                  className="w-full max-w-md rounded-md bg-white border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter a direct URL to your logo image
                </p>
              </div>
            </div>
          </div>

          {/* Brand Colors */}
          <div className="rounded-md border border-border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Pipette className="w-5 h-5" />
              Brand Colors
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Primary Color */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Primary Color
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    name="primaryColor"
                    defaultValue={tenant.primaryColor || '#6366f1'}
                    className="w-16 h-10 rounded-md border border-border bg-white cursor-pointer"
                  />
                  <input
                    type="text"
                    defaultValue={tenant.primaryColor || '#6366f1'}
                    placeholder="#6366f1"
                    className="flex-1 rounded-md bg-white border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                    onChange={(e) => {
                      const colorInput = e.currentTarget.parentElement?.querySelector(
                        'input[type="color"]',
                      ) as HTMLInputElement;
                      if (colorInput) colorInput.value = e.target.value;
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Used for buttons, links, and highlights
                </p>
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Secondary Color
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    name="secondaryColor"
                    defaultValue={tenant.secondaryColor || '#8b5cf6'}
                    className="w-16 h-10 rounded-md border border-border bg-white cursor-pointer"
                  />
                  <input
                    type="text"
                    defaultValue={tenant.secondaryColor || '#8b5cf6'}
                    placeholder="#8b5cf6"
                    className="flex-1 rounded-md bg-white border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                    onChange={(e) => {
                      const colorInput = e.currentTarget.parentElement?.querySelector(
                        'input[type="color"]',
                      ) as HTMLInputElement;
                      if (colorInput) colorInput.value = e.target.value;
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Accent color for secondary elements
                </p>
              </div>
            </div>

            {/* Color Preview */}
            <div className="mt-6 p-6 rounded-md bg-muted border border-border">
              <div className="text-sm font-medium text-muted-foreground mb-3">
                Preview
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  style={{
                    backgroundColor: tenant.primaryColor || '#6366f1',
                  }}
                  className="px-4 py-2 rounded-md text-white font-medium text-sm shadow-sm"
                >
                  Primary Button
                </button>
                <button
                  type="button"
                  style={{
                    backgroundColor: tenant.secondaryColor || '#8b5cf6',
                  }}
                  className="px-4 py-2 rounded-md text-white font-medium text-sm shadow-sm"
                >
                  Secondary Button
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-primary text-white hover:bg-primary/90">Save Branding</Button>
          </div>
        </form>
      </div>
    </Shell>
  );
}
