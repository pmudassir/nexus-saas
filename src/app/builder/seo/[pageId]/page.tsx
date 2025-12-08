import { Shell } from "@/components/layout/Shell";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { Button } from "@/components/ui/button";
import { updatePageSEO } from "@/actions/seo";
import { Search, FileText, Image } from "lucide-react";
import { notFound } from "next/navigation";

export default async function PageSEOEditor({
  params,
}: {
  params: { pageId: string };
}) {
  const { tenant } = await requireTenantMembership();

  const page = await prisma.sitePage.findFirst({
    where: {
      id: params.pageId,
      tenantId: tenant.id,
    },
  });

  if (!page) {
    notFound();
  }

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Search className="w-8 h-8" />
            SEO Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Optimize &ldquo;{page.title}&rdquo; for search engines and social media.
          </p>
        </div>

        <form action={updatePageSEO} className="space-y-6">
          <input type="hidden" name="pageId" value={page.id} />

          {/* Basic Meta Tags */}
          <div className="rounded-md border border-border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Meta Tags
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  defaultValue={page.metaTitle || page.title}
                  placeholder={page.title}
                  maxLength={60}
                  className="w-full rounded-md bg-white border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 50-60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Meta Description
                </label>
                <textarea
                  name="metaDescription"
                  defaultValue={page.metaDescription || ""}
                  placeholder="A brief description of this page for search results"
                  maxLength={160}
                  rows={3}
                  className="w-full rounded-md bg-white border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 150-160 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Meta Keywords (optional)
                </label>
                <input
                  type="text"
                  name="metaKeywords"
                  defaultValue={page.metaKeywords || ""}
                  placeholder="keyword1, keyword2, keyword3"
                  className="w-full rounded-md bg-white border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Comma-separated keywords (mostly ignored by modern search
                  engines)
                </p>
              </div>
            </div>
          </div>

          {/* Open Graph / Social Media */}
          <div className="rounded-md border border-border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Image className="w-5 h-5" />
              Social Media Preview
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Open Graph Image URL
                </label>
                <input
                  type="url"
                  name="ogImage"
                  defaultValue={page.ogImage || ""}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-md bg-white border border-border px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Image displayed when shared on social media (recommended:
                  1200x630px)
                </p>
              </div>

              {/* Preview */}
              {(page.metaTitle || page.metaDescription || page.ogImage) && (
                <div className="mt-4 p-4 rounded-md bg-muted border border-border">
                  <div className="text-xs font-medium text-muted-foreground mb-2">
                    Social Media Preview
                  </div>
                  <div className="rounded-md border border-border overflow-hidden bg-white">
                    {page.ogImage && (
                      <img
                        src={page.ogImage}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <div className="text-sm font-semibold text-foreground">
                        {page.metaTitle || page.title}
                      </div>
                      {page.metaDescription && (
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {page.metaDescription}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="bg-white border-border text-foreground hover:bg-muted"
              asChild
            >
              <a href="/builder">Cancel</a>
            </Button>
            <Button
              type="submit"
              className="bg-primary text-white hover:bg-primary/90"
            >
              Save SEO Settings
            </Button>
          </div>
        </form>
      </div>
    </Shell>
  );
}
