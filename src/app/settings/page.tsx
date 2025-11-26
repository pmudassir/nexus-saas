"use client";

import { Shell } from "@/components/layout/Shell";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Moon,
  LogOut,
  Check,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useState } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "team", label: "Team", icon: Globe },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <Shell>
      <div className="relative min-h-screen w-full overflow-hidden bg-white antialiased">
        <div className="relative z-10 p-6 max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Settings
            </h1>
            <p className="text-slate-500 mt-1">
              Manage your account preferences and workspace settings.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    activeTab === tab.id
                      ? "bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-100"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 space-y-6">
              {/* Profile Section */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <SpotlightCard className="p-8 border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="relative">
                        <Avatar
                          src={undefined}
                          fallback="AU"
                          size="xl"
                          className="h-24 w-24 ring-4 ring-indigo-50 bg-indigo-100 text-indigo-600 text-2xl"
                        />
                        <button className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 transition-colors">
                          <User className="h-4 w-4" />
                        </button>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          Admin User
                        </h2>
                        <p className="text-slate-500">admin@nexus.com</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-xs font-medium border border-emerald-100">
                            Pro Plan
                          </span>
                          <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                            Admin
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Admin User"
                          className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue="admin@nexus.com"
                          className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Job Title
                        </label>
                        <input
                          type="text"
                          defaultValue="Product Manager"
                          className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Location
                        </label>
                        <input
                          type="text"
                          defaultValue="San Francisco, CA"
                          className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                      <Button
                        variant="ghost"
                        className="text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                      >
                        Cancel
                      </Button>
                      <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm">
                        Save Changes
                      </Button>
                    </div>
                  </SpotlightCard>

                  <SpotlightCard className="p-6 border-slate-200 bg-white shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Preferences
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                            <Moon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              Appearance
                            </p>
                            <p className="text-sm text-slate-500">
                              Customize the look and feel
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-500">
                            Light Mode
                          </span>
                          <div className="w-10 h-6 rounded-full bg-slate-200 relative cursor-pointer">
                            <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </div>
              )}

              {/* Notifications Section Placeholder */}
              {activeTab === "notifications" && (
                <SpotlightCard className="p-8 border-slate-200 bg-white shadow-sm text-center py-20">
                  <div className="inline-flex p-4 rounded-full bg-indigo-50 text-indigo-600 mb-4">
                    <Bell className="h-8 w-8" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">
                    Notification Settings
                  </h2>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Configure how and when you want to be notified about
                    activity in your workspace.
                  </p>
                </SpotlightCard>
              )}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
