"use client";

import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Moon,
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
      <div className="relative min-h-screen w-full bg-white antialiased">
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#37352f] tracking-tight">
              Settings
            </h1>
            <p className="text-[#9B9A97] mt-1">
              Manage your account preferences and workspace settings.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-56 flex-shrink-0 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-colors duration-100",
                    activeTab === tab.id
                      ? "bg-[rgba(55,53,47,0.08)] text-[#37352f]"
                      : "text-[#5F5E5B] hover:bg-[rgba(55,53,47,0.08)] hover:text-[#37352f]"
                  )}
                >
                  <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-[#37352f]" : "text-[#9B9A97]")} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 space-y-6">
              {/* Profile Section */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <Card className="p-8">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="relative">
                        <Avatar
                          src={undefined}
                          fallback="AU"
                          size="xl"
                          className="h-20 w-20 bg-indigo-100 text-indigo-600 text-xl font-bold"
                        />
                        <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-white border border-[#E9E9E8] text-[#5F5E5B] shadow-sm hover:text-[#37352f] transition-colors">
                          <User className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-[#37352f]">
                          Admin User
                        </h2>
                        <p className="text-[#9B9A97]">admin@nexus.com</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded-sm bg-[rgba(219,237,219,1)] text-[rgb(28,56,41)] text-xs font-medium">
                            Pro Plan
                          </span>
                          <span className="px-1.5 py-0.5 rounded-sm bg-[rgba(227,226,224,0.5)] text-[#32302c] text-xs font-medium">
                            Admin
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#37352f]">
                          Full Name
                        </label>
                        <Input
                          type="text"
                          defaultValue="Admin User"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#37352f]">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          defaultValue="admin@nexus.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#37352f]">
                          Job Title
                        </label>
                        <Input
                          type="text"
                          defaultValue="Product Manager"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#37352f]">
                          Location
                        </label>
                        <Input
                          type="text"
                          defaultValue="San Francisco, CA"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                      <Button
                        variant="ghost"
                      >
                        Cancel
                      </Button>
                      <Button>
                        Save Changes
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-[#37352f] mb-4">
                      Preferences
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-md bg-[#F7F7F5] border border-[#E9E9E8]">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-sm bg-white border border-[#E9E9E8] text-[#37352f]">
                            <Moon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-[#37352f]">
                              Appearance
                            </p>
                            <p className="text-sm text-[#9B9A97]">
                              Customize the look and feel
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#9B9A97]">
                            Light Mode
                          </span>
                          <div className="w-9 h-5 rounded-full bg-[#E9E9E8] relative cursor-pointer">
                            <div className="absolute left-1 top-1 w-3 h-3 rounded-full bg-white shadow-sm" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Notifications Section Placeholder */}
              {activeTab === "notifications" && (
                <Card className="p-8 text-center py-20">
                  <div className="inline-flex p-3 rounded-full bg-[rgba(235,236,252,1)] text-indigo-600 mb-4">
                    <Bell className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-[#37352f] mb-2">
                    Notification Settings
                  </h2>
                  <p className="text-[#9B9A97] max-w-md mx-auto">
                    Configure how and when you want to be notified about
                    activity in your workspace.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
