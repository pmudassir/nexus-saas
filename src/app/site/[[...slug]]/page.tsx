import { prisma } from "@/lib/prisma";
import { getCurrentTenant } from "@/lib/tenant";

type RenderBlock = {
  id: string;
  type: string;
  data: unknown;
};

function renderBlock(block: RenderBlock) {
  const raw = (block.data ?? {}) as Record<string, unknown>;
  const heading = typeof raw.heading === "string" ? raw.heading : undefined;
  const subheading =
    typeof raw.subheading === "string" ? raw.subheading : undefined;
  const ctaLabel = typeof raw.ctaLabel === "string" ? raw.ctaLabel : undefined;
  const body = typeof raw.body === "string" ? raw.body : undefined;

  if (block.type === "HERO") {
    return (
      <section key={block.id} className="py-16 px-6 md:px-10 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            {heading ?? "Hero heading"}
          </h1>
          <p className="text-base text-indigo-100">
            {subheading ?? "Hero subheading"}
          </p>
          {ctaLabel && (
            <button className="mt-4 inline-flex items-center rounded-full bg-white text-black text-sm font-medium px-6 py-2">
              {ctaLabel}
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section key={block.id} className="py-12 px-6 md:px-10 bg-slate-950">
      <div className="max-w-3xl mx-auto space-y-3">
        <h2 className="text-2xl font-semibold text-white">
          {heading ?? "Text block"}
        </h2>
        <p className="text-sm text-slate-300">
          {body ?? "Body copy for this section."}
        </p>
      </div>
    </section>
  );
}

export default async function SitePage({
  params,
}: {
  params: { slug?: string[] };
}) {
  const tenant = await getCurrentTenant("site");

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300 text-sm">
        No tenant context for this domain.
      </div>
    );
  }

  const slugParts = params.slug ?? [];
  const path = slugParts.length === 0 ? "/" : `/${slugParts.join("/")}`;

  const page = await prisma.sitePage.findFirst({
    where: { tenantId: tenant.id, path },
    include: { blocks: { orderBy: { order: "asc" } } },
  });

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300 text-sm">
        Page not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {page.blocks.map((block) =>
        renderBlock(block as unknown as RenderBlock),
      )}
    </div>
  );
}
