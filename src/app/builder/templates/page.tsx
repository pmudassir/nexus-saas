import { Shell } from '@/components/layout/Shell';
import { Button } from '@/components/ui/button';
import { applyTemplate } from '@/actions/site';
import { UtensilsCrossed, Scissors, Briefcase } from 'lucide-react';

const TEMPLATES = [
  {
    key: 'restaurant',
    name: 'Restaurant & Cafe',
    description: 'Perfect for restaurants, cafes, and food businesses',
    icon: UtensilsCrossed,
    features: ['Menu pages', 'Contact forms', 'Hero sections', 'Gallery showcases'],
    color: 'from-orange-500 to-red-600',
  },
  {
    key: 'salon',
    name: 'Salon & Spa',
    description: 'Elegant template for beauty salons and spa businesses',
    icon: Scissors,
    features: ['Service listings', 'Booking CTAs', 'Premium design', 'Contact forms'],
    color: 'from-pink-500 to-purple-600',
  },
  {
    key: 'portfolio',
    name: 'Professional Portfolio',
    description: 'Clean portfolio for freelancers and creatives',
    icon: Briefcase,
    features: ['Project gallery', 'About section', 'Contact forms', 'Minimal design'],
    color: 'from-blue-500 to-indigo-600',
  },
];

export default function TemplatesPage() {
  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Website Templates
          </h1>
          <p className="text-slate-400">
            Choose a template to quickly build your website. All templates are fully customizable.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((template) => {
            const Icon = template.icon;
            return (
              <div
                key={template.key}
                className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden group hover:border-white/20 transition-colors"
              >
                <div className={`h-40 bg-gradient-to-br ${template.color} flex items-center justify-center`}>
                  <Icon className="w-16 h-16 text-white/90" />
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {template.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-medium text-slate-300 uppercase tracking-wide">
                      Features
                    </div>
                    <ul className="space-y-1">
                      {template.features.map((feature, idx) => (
                        <li key={idx} className="text-xs text-slate-400 flex items-start">
                          <span className="text-emerald-400 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <form action={applyTemplate} className="pt-2">
                    <input
                      type="hidden"
                      name="templateKey"
                      value={template.key}
                    />
                    <Button type="submit" className="w-full">
                      Use This Template
                    </Button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">
            Need Something Custom?
          </h2>
          <p className="text-sm text-slate-400 mb-4">
            Start with a blank page and build your website from scratch using our drag-and-drop builder.
          </p>
          <Button variant="outline" asChild>
            <a href="/builder">Go to Builder</a>
          </Button>
        </div>
      </div>
    </Shell>
  );
}
