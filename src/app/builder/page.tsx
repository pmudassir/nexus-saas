import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { createSitePage, addSiteBlock } from "@/actions/site";
import Link from "next/link";

type BuilderBlock = {
  id: string;
  type: string;
  data: unknown;
};

type BuilderPage = {
  id: string;
  title: string;
  path: string;
  isHome: boolean;
};

function renderBlock(block: BuilderBlock) {
  const raw = (block.data ?? {}) as Record<string, unknown>;
  const heading = typeof raw.heading === "string" ? raw.heading : undefined;
  const subheading =
    typeof raw.subheading === "string" ? raw.subheading : undefined;
  const ctaLabel = typeof raw.ctaLabel === "string" ? raw.ctaLabel : undefined;
  const body = typeof raw.body === "string" ? raw.body : undefined;

  if (block.type === "HERO") {
    return (
      <section
        key={block.id}
        className="rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 p-10 text-white mb-4 shadow-sm"
      >
        <h2 className="text-3xl font-bold mb-2">{heading ?? "Hero heading"}</h2>
        <p className="text-sm text-indigo-100 mb-4">
          {subheading ?? "Hero subheading"}
        </p>
        {ctaLabel && (
          <Button
            variant="secondary"
            size="sm"
            className="bg-white text-indigo-600 hover:bg-indigo-50"
          >
            {ctaLabel}
          </Button>
        )}
      </section>
    );
  }

  return (
    <section
      key={block.id}
      className="rounded-md bg-white border border-border p-6 mb-4 shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-2 text-foreground">
        {heading ?? "Text block"}
      </h3>
      <p className="text-sm text-muted-foreground">
        {body ?? "Body copy for this block."}
      </p>
    </section>
  );
}

export default async function BuilderPage({
  searchParams,
}: {
  searchParams: { pageId?: string };
}) {
  const { tenant } = await requireTenantMembership();

  const pages = await prisma.sitePage.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "asc" },
  });

  const selectedPage: BuilderPage | undefined =
    (pages as BuilderPage[]).find(
      (p: BuilderPage) => p.id === searchParams.pageId
    ) ?? (pages[0] as BuilderPage | undefined);

  const blocks: BuilderBlock[] = selectedPage
    ? ((await prisma.siteBlock.findMany({
        where: { pageId: selectedPage.id },
        orderBy: { order: "asc" },
      })) as BuilderBlock[])
    : [];

  return (
    <Shell>
      <div className="grid gap-6 lg:grid-cols-[280px,1fr] min-h-[70vh]">
        <aside className="rounded-lg border border-border bg-muted/30 p-4 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-2">Pages</h2>
            <div className="space-y-1">
              {(pages as BuilderPage[]).map((page: BuilderPage) => {
                const isActive = selectedPage && page.id === selectedPage.id;
                return (
                  <Link
                    key={page.id}
                    href={`/builder?pageId=${page.id}`}
                    className={`flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span>{page.title}</span>
                    {page.isHome && (
                      <span className="text-[10px] uppercase tracking-wide opacity-70">
                        Home
                      </span>
                    )}
                  </Link>
                );
              })}
              {pages.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No pages yet. Create your first page below.
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="text-xs font-semibold text-foreground mb-2">
              New Page
            </h3>
            <form className="space-y-2" action={createSitePage}>
              <input
                name="title"
                placeholder="Home"
                required
                className="w-full rounded-md bg-white border border-border px-3 py-1.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <input
                name="path"
                placeholder="/ or about"
                className="w-full rounded-md bg-white border border-border px-3 py-1.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <Button
                type="submit"
                size="sm"
                className="w-full text-xs bg-primary text-white hover:bg-primary/90"
              >
                Create Page
              </Button>
            </form>
          </div>
        </aside>

        <main className="rounded-lg border border-border bg-muted/10 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Website Builder
              </h1>
              {selectedPage && (
                <p className="text-xs text-muted-foreground mt-1">
                  Editing page: {selectedPage.title} ({selectedPage.path})
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Link
                href="/site"
                className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                View site
              </Link>
            </div>
          </div>

          {selectedPage ? (
            <div className="flex-1 flex flex-col">
              <div className="flex-1">
                {blocks.length === 0 && (
                  <div className="text-sm text-muted-foreground mb-4">
                    No blocks yet. Add a hero or text block below.
                  </div>
                )}
                {blocks.map((block) => renderBlock(block))}
              </div>

              <div className="mt-4 border-t border-border pt-4 flex gap-3">
                <form action={addSiteBlock}>
                  <input type="hidden" name="pageId" value={selectedPage.id} />
                  <input type="hidden" name="type" value="HERO" />
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    Add Hero
                  </Button>
                </form>
                <form action={addSiteBlock}>
                  <input type="hidden" name="pageId" value={selectedPage.id} />
                  <input type="hidden" name="type" value="TEXT" />
                  <Button
                    type="submit"
                    size="sm"
                    variant="outline"
                    className="bg-white border-border text-foreground hover:bg-muted"
                  >
                    Add Text
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
              Select or create a page to start building your site.
            </div>
          )}
        </main>
      </div>
    </Shell>
  );
}
