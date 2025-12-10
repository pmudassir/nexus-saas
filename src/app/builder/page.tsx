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

  // HERO Block
  if (block.type === "HERO") {
    return (
      <section
        key={block.id}
        className="rounded-xl bg-linear-to-br from-indigo-600 to-purple-600 p-10 text-white mb-4 shadow-sm"
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

  // FEATURES Block
  if (block.type === "FEATURES") {
    const features = Array.isArray(raw.features) ? raw.features : [];
    return (
      <section
        key={block.id}
        className="rounded-md bg-card border border-border p-6 mb-4 shadow-sm"
      >
        <h3 className="text-xl font-semibold mb-4 text-foreground">
          {heading ?? "Features"}
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature: { title?: string; description?: string }, index: number) => (
            <div key={index} className="p-4 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <span className="text-primary font-bold">{index + 1}</span>
              </div>
              <h4 className="font-medium text-foreground mb-1">
                {feature.title ?? `Feature ${index + 1}`}
              </h4>
              <p className="text-sm text-muted-foreground">
                {feature.description ?? "Feature description"}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // GALLERY Block
  if (block.type === "GALLERY") {
    const items = Array.isArray(raw.items) ? raw.items : [];
    return (
      <section
        key={block.id}
        className="rounded-md bg-card border border-border p-6 mb-4 shadow-sm"
      >
        <h3 className="text-xl font-semibold mb-4 text-foreground">
          {heading ?? "Gallery"}
        </h3>
        {items.length > 0 ? (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {items.map((item: { url?: string; alt?: string }, index: number) => (
              <div key={index} className="aspect-square rounded-lg bg-muted/50 overflow-hidden">
                {item.url ? (
                  <img src={item.url} alt={item.alt ?? ""} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    Image {index + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-32 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground text-sm">
            Add images to this gallery
          </div>
        )}
      </section>
    );
  }

  // CONTACT Block
  if (block.type === "CONTACT") {
    const email = typeof raw.email === "string" ? raw.email : "hello@example.com";
    const phone = typeof raw.phone === "string" ? raw.phone : "(555) 123-4567";
    const address = typeof raw.address === "string" ? raw.address : undefined;
    return (
      <section
        key={block.id}
        className="rounded-md bg-card border border-border p-6 mb-4 shadow-sm"
      >
        <h3 className="text-xl font-semibold mb-4 text-foreground">
          {heading ?? "Contact Us"}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Email:</span>
              <a href={`mailto:${email}`} className="text-primary hover:underline">
                {email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Phone:</span>
              <span>{phone}</span>
            </div>
            {address && (
              <div className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground">Address:</span>
                <span>{address}</span>
              </div>
            )}
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-3">Send us a message:</p>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              <textarea
                rows={3}
                placeholder="Message"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-none"
              />
              <Button size="sm" className="w-full">Send Message</Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // TEXT Block (default)
  return (
    <section
      key={block.id}
      className="rounded-md bg-card border border-border p-6 mb-4 shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-2 text-foreground">
        {heading ?? "Text block"}
      </h3>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
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
                        ? "bg-primary/10 text-primary"
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
                className="w-full rounded-md bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <input
                name="path"
                // Placeholder - will update after readbout
                className="w-full rounded-md bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <Button
                type="submit"
                size="sm"
                className="w-full text-xs bg-primary text-primary-foreground hover:bg-primary/90"
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
                className="text-xs text-primary hover:text-primary/80 hover:underline"
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

              <div className="mt-4 border-t border-border pt-4 flex flex-wrap gap-2">
                <form action={addSiteBlock}>
                  <input type="hidden" name="pageId" value={selectedPage.id} />
                  <input type="hidden" name="type" value="HERO" />
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    + Hero
                  </Button>
                </form>
                <form action={addSiteBlock}>
                  <input type="hidden" name="pageId" value={selectedPage.id} />
                  <input type="hidden" name="type" value="TEXT" />
                  <Button
                    type="submit"
                    size="sm"
                    variant="outline"
                  >
                    + Text
                  </Button>
                </form>
                <form action={addSiteBlock}>
                  <input type="hidden" name="pageId" value={selectedPage.id} />
                  <input type="hidden" name="type" value="FEATURES" />
                  <Button
                    type="submit"
                    size="sm"
                    variant="outline"
                  >
                    + Features
                  </Button>
                </form>
                <form action={addSiteBlock}>
                  <input type="hidden" name="pageId" value={selectedPage.id} />
                  <input type="hidden" name="type" value="GALLERY" />
                  <Button
                    type="submit"
                    size="sm"
                    variant="outline"
                  >
                    + Gallery
                  </Button>
                </form>
                <form action={addSiteBlock}>
                  <input type="hidden" name="pageId" value={selectedPage.id} />
                  <input type="hidden" name="type" value="CONTACT" />
                  <Button
                    type="submit"
                    size="sm"
                    variant="outline"
                  >
                    + Contact
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
