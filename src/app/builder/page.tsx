
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";
import { createSitePage, addSiteBlock } from "@/actions/site";
import Link from "next/link";
import { Layout, Plus, Type, Image as LucideImage, Zap, Phone, ExternalLink } from "lucide-react";

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
        className="rounded-3xl bg-linear-to-br from-indigo-600 to-purple-600 p-12 text-white mb-6 shadow-soft"
      >
        <h2 className="text-4xl font-bold font-display mb-4">{heading ?? "Hero heading"}</h2>
        <p className="text-lg text-indigo-100 mb-6 max-w-2xl">
          {subheading ?? "Hero subheading"}
        </p>
        {ctaLabel && (
          <Button
            className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-full font-bold px-8 h-12 text-md shadow-lg"
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
        className="rounded-3xl bg-white border border-gray-100 p-8 mb-6 shadow-soft"
      >
        <h3 className="text-2xl font-bold mb-6 text-foreground font-display">
          {heading ?? "Features"}
        </h3>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature: { title?: string; description?: string }, index: number) => (
            <div key={index} className="p-6 rounded-2xl bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 text-indigo-600">
                <span className="font-bold text-lg">{index + 1}</span>
              </div>
              <h4 className="font-bold text-lg text-foreground mb-2">
                {feature.title ?? `Feature ${index + 1}`}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
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
        className="rounded-3xl bg-white border border-gray-100 p-8 mb-6 shadow-soft"
      >
        <h3 className="text-2xl font-bold mb-6 text-foreground font-display">
          {heading ?? "Gallery"}
        </h3>
        {items.length > 0 ? (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {items.map((item: { url?: string; alt?: string }, index: number) => (
              <div key={index} className="aspect-square rounded-2xl bg-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {item.url ? (
                  <img src={item.url} alt={item.alt ?? ""} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-medium">
                    Image {index + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-40 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-muted-foreground text-sm font-medium">
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
        className="rounded-3xl bg-white border border-gray-100 p-8 mb-6 shadow-soft"
      >
        <h3 className="text-2xl font-bold mb-6 text-foreground font-display">
          {heading ?? "Contact Us"}
        </h3>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50/50">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Email</span>
              <a href={`mailto:${email}`} className="text-indigo-600 font-bold hover:underline">
                {email}
              </a>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50/50">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Phone</span>
              <span className="font-medium">{phone}</span>
            </div>
            {address && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50/50">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Address</span>
                <span className="font-medium">{address}</span>
              </div>
            )}
          </div>
          <div className="bg-gray-50 rounded-3xl p-6">
            <p className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider">Send us a message</p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
              />
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
              />
              <textarea
                rows={3}
                placeholder="Message"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
              />
              <Button size="sm" className="w-full rounded-full bg-black text-white px-6 h-10 font-bold hover:bg-gray-800">Send Message</Button>
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
      className="rounded-3xl bg-white border border-gray-100 p-8 mb-6 shadow-soft"
    >
      <h3 className="text-xl font-bold mb-4 text-foreground font-display">
        {heading ?? "Text block"}
      </h3>
      <p className="text-base text-muted-foreground whitespace-pre-wrap leading-relaxed">
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
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-display font-bold text-foreground">
                Website Builder
              </h1>
              <p className="text-muted-foreground mt-2 font-medium">
                Create and manage your public facing website pages.
              </p>
            </div>
            <Link
              href="/site"
              target="_blank"
              className="group"
            >
              <Button variant="outline" className="rounded-full shadow-soft hover:bg-gray-50 border-gray-200">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Live Site
              </Button>
            </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px,1fr] min-h-[70vh]">
          <aside className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Pages</h2>
              <div className="space-y-2">
                {(pages as BuilderPage[]).map((page: BuilderPage) => {
                  const isActive = selectedPage && page.id === selectedPage.id;
                  return (
                    <Link
                      key={page.id}
                      href={`/builder?pageId=${page.id}`}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                        isActive
                          ? "bg-black text-white shadow-md"
                          : "text-muted-foreground hover:bg-gray-50 hover:text-foreground border border-transparent hover:border-gray-100"
                      }`}
                    >
                      <span>{page.title}</span>
                      {page.isHome && (
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wide">
                          Home
                        </span>
                      )}
                    </Link>
                  );
                })}
                {pages.length === 0 && (
                  <p className="text-xs text-muted-foreground italic px-2">
                    No pages yet. Create your first page below.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
                New Page
              </h2>
              <form className="space-y-3" action={createSitePage}>
                <input
                  name="title"
                  placeholder="Page Title"
                  required
                  className="w-full rounded-xl bg-gray-50 border border-transparent px-3 py-2 text-sm text-foreground outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-400 font-medium"
                />
                <input
                  name="path"
                  placeholder="URL Path (e.g. /about)"
                  className="w-full rounded-xl bg-gray-50 border border-transparent px-3 py-2 text-sm text-foreground outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-400 font-medium"
                />
                <Button
                  type="submit"
                  className="w-full rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold h-10 shadow-lg shadow-orange-500/20"
                >
                  Create Page
                </Button>
              </form>
            </div>
          </aside>

          <main className="bg-gray-50/50 rounded-4xl border border-gray-100 p-8 flex flex-col relative overflow-hidden">
             
            {selectedPage ? (
              <div className="flex-1 flex flex-col z-10 relative">
                 <div className="mb-6 pb-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold font-display text-foreground">
                    Editing: {selectedPage.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 font-mono bg-gray-100 w-fit px-2 py-0.5 rounded-md">
                    Path: {selectedPage.path}
                  </p>
                 </div>

                <div className="flex-1 space-y-6">
                  {blocks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl">
                      <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                         <Layout className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">Start Building</h3>
                      <p className="text-muted-foreground max-w-sm mt-1">
                        This page is empty. Add your first block from the options below.
                      </p>
                    </div>
                  )}
                  {blocks.map((block) => renderBlock(block))}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                   <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Add Block</p>
                   <div className="flex flex-wrap gap-3">
                    <form action={addSiteBlock}>
                      <input type="hidden" name="pageId" value={selectedPage.id} />
                      <input type="hidden" name="type" value="HERO" />
                      <Button type="submit" className="rounded-full bg-white text-foreground border border-gray-200 hover:bg-gray-50 hover:border-orange-300 font-bold shadow-sm">
                        <Plus className="h-4 w-4 mr-2" /> Hero
                      </Button>
                    </form>
                    <form action={addSiteBlock}>
                      <input type="hidden" name="pageId" value={selectedPage.id} />
                      <input type="hidden" name="type" value="TEXT" />
                      <Button type="submit" className="rounded-full bg-white text-foreground border border-gray-200 hover:bg-gray-50 hover:border-orange-300 font-bold shadow-sm">
                        <Type className="h-4 w-4 mr-2" /> Text
                      </Button>
                    </form>
                    <form action={addSiteBlock}>
                      <input type="hidden" name="pageId" value={selectedPage.id} />
                      <input type="hidden" name="type" value="FEATURES" />
                      <Button type="submit" className="rounded-full bg-white text-foreground border border-gray-200 hover:bg-gray-50 hover:border-orange-300 font-bold shadow-sm">
                        <Zap className="h-4 w-4 mr-2" /> Features
                      </Button>
                    </form>
                    <form action={addSiteBlock}>
                      <input type="hidden" name="pageId" value={selectedPage.id} />
                      <input type="hidden" name="type" value="GALLERY" />
                      <Button type="submit" className="rounded-full bg-white text-foreground border border-gray-200 hover:bg-gray-50 hover:border-orange-300 font-bold shadow-sm">
                        <LucideImage className="h-4 w-4 mr-2" /> Gallery
                      </Button>
                    </form>
                    <form action={addSiteBlock}>
                      <input type="hidden" name="pageId" value={selectedPage.id} />
                      <input type="hidden" name="type" value="CONTACT" />
                      <Button type="submit" className="rounded-full bg-white text-foreground border border-gray-200 hover:bg-gray-50 hover:border-orange-300 font-bold shadow-sm">
                        <Phone className="h-4 w-4 mr-2" /> Contact
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                 <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                    <Layout className="h-10 w-10" />
                 </div>
                 <h3 className="text-2xl font-bold text-foreground">No Page Selected</h3>
                 <p className="text-muted-foreground mt-2 max-w-sm">
                   Select a page from the sidebar or create a new one to start building your website.
                 </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </Shell>
  );
}
