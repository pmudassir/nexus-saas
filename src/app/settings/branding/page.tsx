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
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Palette className="w-8 h-8" />
            Branding & Customization
          </h1>
          <p className="text-slate-400 mt-2">
            Customize your workspace appearance with your brand colors and logo.
          </p>
        </div>

        <form action={updateBranding} className="space-y-6">
          {/* Logo Upload */}
          <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Image className="w-5 h-5" />
              Logo
            </h2>
            <div className="space-y-4">
              {tenant.logoUrl && (
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg bg-white/5 border border-white/10 p-2 flex items-center justify-center">
                    <img
                      src={tenant.logoUrl}
                      alt="Current logo"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="text-sm text-slate-400">Current logo</div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  name="logoUrl"
                  defaultValue={tenant.logoUrl || ''}
                  placeholder="https://example.com/logo.png"
                  className="w-full max-w-md rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Enter a direct URL to your logo image
                </p>
              </div>
            </div>
          </div>

          {/* Brand Colors */}
          <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Pipette className="w-5 h-5" />
              Brand Colors
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Primary Color */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Primary Color
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    name="primaryColor"
                    defaultValue={tenant.primaryColor || '#6366f1'}
                    className="w-16 h-10 rounded-lg border border-white/10 bg-black/30 cursor-pointer"
                  />
                  <input
                    type="text"
                    defaultValue={tenant.primaryColor || '#6366f1'}
                    placeholder="#6366f1"
                    className="flex-1 rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/60 font-mono"
                    onChange={(e) => {
                      const colorInput = e.currentTarget.parentElement?.querySelector(
                        'input[type="color"]',
                      ) as HTMLInputElement;
                      if (colorInput) colorInput.value = e.target.value;
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Used for buttons, links, and highlights
                </p>
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Secondary Color
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    name="secondaryColor"
                    defaultValue={tenant.secondaryColor || '#8b5cf6'}
                    className="w-16 h-10 rounded-lg border border-white/10 bg-black/30 cursor-pointer"
                  />
                  <input
                    type="text"
                    defaultValue={tenant.secondaryColor || '#8b5cf6'}
                    placeholder="#8b5cf6"
                    className="flex-1 rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/60 font-mono"
                    onChange={(e) => {
                      const colorInput = e.currentTarget.parentElement?.querySelector(
                        'input[type="color"]',
                      ) as HTMLInputElement;
                      if (colorInput) colorInput.value = e.target.value;
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Accent color for secondary elements
                </p>
              </div>
            </div>

            {/* Color Preview */}
            <div className="mt-6 p-6 rounded-lg bg-white/5 border border-white/10">
              <div className="text-sm font-medium text-slate-300 mb-3">
                Preview
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  style={{
                    backgroundColor: tenant.primaryColor || '#6366f1',
                  }}
                  className="px-4 py-2 rounded-lg text-white font-medium text-sm"
                >
                  Primary Button
                </button>
                <button
                  type="button"
                  style={{
                    backgroundColor: tenant.secondaryColor || '#8b5cf6',
                  }}
                  className="px-4 py-2 rounded-lg text-white font-medium text-sm"
                >
                  Secondary Button
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Branding</Button>
          </div>
        </form>
      </div>
    </Shell>
  );
}
