'use client';

import { useState } from 'react';
import { completeOnboarding } from '@/actions/onboarding';
import { Building2, Users, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Plus, X } from 'lucide-react';

type InviteMember = { email: string; role: string };

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState('');
  const [slug, setSlug] = useState('');
  const [invites, setInvites] = useState<InviteMember[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleCompanyNameChange = (value: string) => {
    setCompanyName(value);
    setSlug(generateSlug(value));
  };

  const addInvite = () => {
    if (newEmail && invites.length < 5) {
      setInvites([...invites, { email: newEmail, role: 'TENANT_USER' }]);
      setNewEmail('');
    }
  };

  const removeInvite = (index: number) => {
    setInvites(invites.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const formData = new FormData();
      formData.set('companyName', companyName);
      formData.set('slug', slug);
      invites.forEach((invite, i) => {
        formData.set(`inviteEmail${i}`, invite.email);
        formData.set(`inviteRole${i}`, invite.role);
      });
      await completeOnboarding(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Company', icon: Building2 },
    { num: 2, label: 'Team', icon: Users },
    { num: 3, label: 'Confirm', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
      <div className="w-full max-w-[600px]">
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-2xl mx-auto mb-4 shadow-xl">
            Nx
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome to Nexus
          </h1>
          <p className="text-muted-foreground mt-2">
            Let&apos;s set up your workspace in a few quick steps.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s.num
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-gray-200 text-muted-foreground'
                }`}
              >
                {step > s.num ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <s.icon className="w-5 h-5" />
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 rounded-full transition-all ${
                    step > s.num ? 'bg-black' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          {/* Step 1: Company Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  Set up your company
                </h2>
                <p className="text-sm text-muted-foreground">
                  This creates your workspace where your team will collaborate.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => handleCompanyNameChange(e.target.value)}
                    placeholder="Acme Corporation"
                    className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">
                    Workspace URL
                  </label>
                  <div className="flex items-center gap-0">
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="acme"
                      className="flex-1 rounded-l-xl bg-gray-50 border border-gray-200 border-r-0 px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all"
                    />
                    <span className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-r-xl text-xs font-mono text-muted-foreground">
                      .nexus.app
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!companyName || !slug}
                className="w-full rounded-full bg-black text-white py-3 text-sm font-bold shadow-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Invite Team */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  Invite your team
                </h2>
                <p className="text-sm text-muted-foreground">
                  Add team members to get started. You can always invite more
                  later.
                </p>
              </div>

              <div className="space-y-3">
                {invites.map((invite, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100"
                  >
                    <div className="flex-1 text-sm font-medium text-foreground">
                      {invite.email}
                    </div>
                    <select
                      value={invite.role}
                      onChange={(e) => {
                        const updated = [...invites];
                        updated[i].role = e.target.value;
                        setInvites(updated);
                      }}
                      className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1 font-medium"
                    >
                      <option value="TENANT_USER">User</option>
                      <option value="TENANT_ADMIN">Admin</option>
                    </select>
                    <button
                      onClick={() => removeInvite(i)}
                      className="p-1 rounded-full hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {invites.length < 5 && (
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="colleague@company.com"
                      className="flex-1 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addInvite();
                        }
                      }}
                    />
                    <button
                      onClick={addInvite}
                      disabled={!newEmail}
                      className="h-11 w-11 rounded-xl bg-black text-white flex items-center justify-center hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-full bg-gray-100 text-foreground py-3 text-sm font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 rounded-full bg-black text-white py-3 text-sm font-bold shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                You can skip this step and invite members later from Settings →
                Team.
              </p>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="h-16 w-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  Ready to launch!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Review your workspace details before we set everything up.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">
                    Company
                  </span>
                  <span className="font-bold text-foreground">
                    {companyName}
                  </span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">
                    Workspace URL
                  </span>
                  <span className="font-mono text-xs text-foreground">
                    {slug}.nexus.app
                  </span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">
                    Team Members
                  </span>
                  <span className="font-bold text-foreground">
                    {invites.length + 1} (including you)
                  </span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 rounded-full bg-gray-100 text-foreground py-3 text-sm font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 rounded-full bg-orange-600 text-white py-3 text-sm font-bold shadow-lg hover:bg-orange-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Launch Workspace
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
