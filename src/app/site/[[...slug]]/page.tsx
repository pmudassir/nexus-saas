
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
      <section
        key={block.id}
        className="py-24 px-6 md:px-10 bg-linear-to-br from-indigo-600 to-purple-600 text-white"
      >
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-display">
            {heading ?? "Hero heading"}
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            {subheading ?? "Hero subheading"}
          </p>
          {ctaLabel && (
            <button className="mt-8 inline-flex items-center rounded-full bg-white text-indigo-600 text-base font-bold px-8 py-4 shadow-lg hover:bg-indigo-50 transition-all hover:scale-105">
              {ctaLabel}
            </button>
          )}
        </div>
      </section>
    );
  }

  if (block.type === "FEATURES") {
    const features = Array.isArray(raw.features) ? raw.features : [];
    return (
      <section key={block.id} className="py-20 px-6 md:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground font-display mb-4">{heading ?? "Features"}</h2>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
             {features.map((feature: { title?: string; description?: string }, index: number) => (
                <div key={index} className="p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-soft transition-all duration-300 border border-transparent hover:border-gray-100">
                   <div className="h-14 w-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 text-xl font-bold">
                      {index + 1}
                   </div>
                   <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title ?? `Feature ${index + 1}`}</h3>
                   <p className="text-muted-foreground leading-relaxed">{feature.description ?? "Feature description goes here."}</p>
                </div>
             ))}
          </div>
        </div>
      </section>
    );
  }

  if (block.type === "GALLERY") {
    const items = Array.isArray(raw.items) ? raw.items : [];
    return (
       <section key={block.id} className="py-20 px-6 md:px-10 bg-gray-50">
          <div className="max-w-6xl mx-auto">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground font-display">{heading ?? "Gallery"}</h2>
             </div>
             <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
                {items.map((item: { url?: string; alt?: string }, index: number) => (
                   <div key={index} className="aspect-square rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                      {item.url ? (
                         <img src={item.url} alt={item.alt ?? ""} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">Image {index + 1}</div>
                      )}
                   </div>
                ))}
             </div>
          </div>
       </section>
    );
  }

  if (block.type === "CONTACT") {
    const email = typeof raw.email === "string" ? raw.email : "hello@example.com";
     return (
       <section key={block.id} className="py-20 px-6 md:px-10 bg-white">
          <div className="max-w-4xl mx-auto bg-indigo-900 rounded-4xl p-10 md:p-16 text-center text-white shadow-soft-lg overflow-hidden relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />
             
             <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-6 font-display">{heading ?? "Contact Us"}</h2>
                <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
                   Have questions? We&apos;d love to hear from you. customized solutions.
                </p>
                <a href={`mailto:${email}`} className="inline-flex items-center justify-center rounded-full bg-white text-indigo-900 font-bold px-8 py-4 hover:bg-indigo-50 transition-colors">
                   Email Us: {email}
                </a>
             </div>
          </div>
       </section>
     );
  }

  return (
    <section key={block.id} className="py-20 px-6 md:px-10 bg-white">
      <div className="max-w-3xl mx-auto space-y-4 text-center">
        <h2 className="text-3xl font-bold text-foreground font-display">
          {heading ?? "Text block"}
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
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
      <div className="min-h-screen flex items-center justify-center bg-white text-muted-foreground text-sm font-medium">
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
      <div className="min-h-screen flex items-center justify-center bg-white text-muted-foreground text-sm font-medium">
        Page not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-foreground font-sans">
      {page.blocks.map((block) => renderBlock(block as unknown as RenderBlock))}
    </div>
  );
}
