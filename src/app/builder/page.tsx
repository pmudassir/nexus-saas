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
      <section key={block.id} className="rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 p-10 text-white mb-4">
        <h2 className="text-3xl font-bold mb-2">{heading ?? "Hero heading"}</h2>
        <p className="text-sm text-indigo-100 mb-4">{subheading ?? "Hero subheading"}</p>
        {ctaLabel && (
          <Button variant="glass" size="sm">
            {ctaLabel}
          </Button>
        )}
      </section>
    );
  }

  return (
    <section key={block.id} className="rounded-xl bg-slate-900/80 border border-white/10 p-6 mb-4">
      <h3 className="text-lg font-semibold mb-2 text-white">{heading ?? "Text block"}</h3>
      <p className="text-sm text-slate-300">{body ?? "Body copy for this block."}</p>
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
    (pages as BuilderPage[]).find((p: BuilderPage) => p.id === searchParams.pageId) ??
    (pages[0] as BuilderPage | undefined);

  const blocks: BuilderBlock[] = selectedPage
    ? ((await prisma.siteBlock.findMany({
        where: { pageId: selectedPage.id },
        orderBy: { order: "asc" },
      })) as BuilderBlock[])
    : [];

  return (
    <Shell>
      <div className="grid gap-6 lg:grid-cols-[280px,1fr] min-h-[70vh]">
        <aside className="rounded-xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-4 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 mb-2">
              Pages
            </h2>
            <div className="space-y-1">
              {(pages as BuilderPage[]).map((page: BuilderPage) => {
                const isActive = selectedPage && page.id === selectedPage.id;
                return (
                  <Link
                    key={page.id}
                    href={`/builder?pageId=${page.id}`}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-white text-black"
                        : "text-slate-300 hover:bg-white/5"
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
                <p className="text-xs text-slate-500">
                  No pages yet. Create your first page below.
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <h3 className="text-xs font-semibold text-slate-200 mb-2">
              New Page
            </h3>
            <form className="space-y-2" action={createSitePage}>
              <input
                name="title"
                placeholder="Home"
                required
                className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-1.5 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
              />
              <input
                name="path"
                placeholder="/ or about"
                className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-1.5 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500/60"
              />
              <Button type="submit" size="sm" className="w-full text-xs">
                Create Page
              </Button>
            </form>
          </div>
        </aside>

        <main className="rounded-xl border border-white/10 bg-slate-950/80 backdrop-blur-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-white">
                Website Builder
              </h1>
              {selectedPage && (
                <p className="text-xs text-slate-400 mt-1">
                  Editing page: {selectedPage.title} ({selectedPage.path})
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Link href="/site" className="text-xs text-slate-300 hover:text-white">
                View site
              </Link>
            </div>
          </div>

          {selectedPage ? (
            <div className="flex-1 flex flex-col">
              <div className="flex-1">
                {blocks.length === 0 && (
                  <div className="text-sm text-slate-400 mb-4">
                    No blocks yet. Add a hero or text block below.
                  </div>
                )}
                {blocks.map((block) => renderBlock(block))}
              </div>

              <div className="mt-4 border-t border-white/10 pt-4 flex gap-3">
                <form action={addSiteBlock}>
                  <input type="hidden" name="pageId" value={selectedPage.id} />
                  <input type="hidden" name="type" value="HERO" />
                  <Button type="submit" size="sm" variant="glass">
                    Add Hero
                  </Button>
                </form>
                <form action={addSiteBlock}>
                  <input type="hidden" name="pageId" value={selectedPage.id} />
                  <input type="hidden" name="type" value="TEXT" />
                  <Button type="submit" size="sm" variant="outline">
                    Add Text
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
              Select or create a page to start building your site.
            </div>
          )}
        </main>
      </div>
    </Shell>
  );
}
