"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Bell, Shield, Moon } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useState, useTransition, useEffect } from "react";
import { cn } from "@/lib/utils";
import { updateProfile, changePassword, updateNotificationSettings } from "@/actions/settings";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
};

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

export function SettingsClient({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    // Check if we're in browser
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) {
      return stored === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sync dark mode to DOM
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const handleProfileSubmit = async (formData: FormData) => {
    setMessage(null);
    startTransition(async () => {
      try {
        await updateProfile(formData);
        setMessage({ type: 'success', text: 'Profile updated successfully' });
      } catch (error) {
        setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to update profile' });
      }
    });
  };

  const handlePasswordSubmit = async (formData: FormData) => {
    setMessage(null);
    startTransition(async () => {
      try {
        await changePassword(formData);
        setMessage({ type: 'success', text: 'Password changed successfully' });
      } catch (error) {
        setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to change password' });
      }
    });
  };

  const handleNotificationSubmit = async (formData: FormData) => {
    setMessage(null);
    startTransition(async () => {
      try {
        await updateNotificationSettings(formData);
        setMessage({ type: 'success', text: 'Notification settings updated' });
      } catch (error) {
        setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to update settings' });
      }
    });
  };

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    document.documentElement.classList.toggle('dark', newValue);
    localStorage.setItem('darkMode', String(newValue));
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
      <div className="mb-2">
        <h1 className="text-4xl font-bold font-display text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground mt-2 font-medium">
          Manage your account preferences and workspace settings.
        </p>
      </div>

      {message && (
        <div className={cn(
          "mb-4 p-4 rounded-xl text-sm font-bold shadow-soft",
          message.type === 'success' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
        )}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 shrink-0 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setMessage(null); }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200",
                activeTab === tab.id
                  ? "bg-black text-white shadow-soft"
                  : "bg-white text-muted-foreground hover:bg-gray-50 hover:text-foreground border border-transparent hover:border-gray-100 shadow-sm"
              )}
            >
              <tab.icon
                className={cn(
                  "h-4 w-4",
                  activeTab === tab.id ? "text-white" : "text-gray-400"
                )}
              />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {/* Profile Section */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="bg-white rounded-4xl p-8 shadow-soft border border-gray-100">
                <form action={handleProfileSubmit}>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                      <Avatar 
                        className="h-24 w-24 ring-4 ring-gray-50 shadow-soft"
                        fallback={user.name?.charAt(0) || 'U'}
                        size="xl"
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold font-display text-foreground">
                        {user.name || 'User'}
                      </h2>
                      <p className="text-muted-foreground font-medium">{user.email}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-black/5 text-foreground text-xs font-bold uppercase tracking-wider">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        Full Name
                      </label>
                      <Input name="name" type="text" defaultValue={user.name || ''} className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        Email Address
                      </label>
                      <Input name="email" type="email" defaultValue={user.email} className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white" />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                    <Button type="submit" disabled={isPending} className="rounded-full bg-black hover:bg-gray-800 text-white px-8">
                      {isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-4xl p-6 shadow-soft border border-gray-100">
                <h3 className="text-lg font-bold font-display text-foreground mb-4">
                  Preferences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-3xl bg-gray-50/50 border border-gray-100/50">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center text-foreground">
                        <Moon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">
                          Dark Mode
                        </p>
                        <p className="text-xs font-medium text-muted-foreground">
                          Toggle dark theme
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={cn(
                        "w-12 h-7 rounded-full relative transition-colors duration-300 focus:outline-none",
                        darkMode ? "bg-orange-500" : "bg-gray-200"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300",
                        darkMode ? "translate-x-6" : "translate-x-1"
                      )} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-4xl p-8 shadow-soft border border-gray-100">
              <h2 className="text-xl font-bold font-display text-foreground mb-6">
                Notification Preferences
              </h2>
              <form action={handleNotificationSubmit}>
                <div className="space-y-3">
                  {[
                    { id: 'emailNotifications', label: 'Email Notifications', description: 'Receive email updates about activity' },
                    { id: 'projectUpdates', label: 'Project Updates', description: 'Get notified when projects are updated' },
                    { id: 'taskReminders', label: 'Task Reminders', description: 'Receive reminders for upcoming tasks' },
                    { id: 'weeklyDigest', label: 'Weekly Digest', description: 'Get a weekly summary of activity' },
                  ].map((setting) => (
                    <label key={setting.id} className="flex items-center justify-between p-4 rounded-3xl bg-gray-50/50 border border-transparent hover:border-gray-200 hover:bg-white hover:shadow-soft cursor-pointer transition-all duration-200">
                      <div>
                        <p className="font-bold text-foreground">{setting.label}</p>
                        <p className="text-xs font-medium text-muted-foreground">{setting.description}</p>
                      </div>
                      <input
                        type="checkbox"
                        name={setting.id}
                        value="true"
                        defaultChecked
                        className="w-5 h-5 rounded-md border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                    </label>
                  ))}
                </div>
                <div className="mt-8 flex justify-end">
                  <Button type="submit" disabled={isPending} className="rounded-full bg-black hover:bg-gray-800 text-white px-8">
                    {isPending ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Security Section */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="bg-white rounded-4xl p-8 shadow-soft border border-gray-100">
                <h2 className="text-xl font-bold font-display text-foreground mb-6">
                  Change Password
                </h2>
                <form action={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Current Password
                    </label>
                    <Input name="currentPassword" type="password" required className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      New Password
                    </label>
                    <Input name="newPassword" type="password" required minLength={8} className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white" />
                    <p className="text-[10px] font-bold text-muted-foreground">Must be at least 8 characters</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Confirm New Password
                    </label>
                    <Input name="confirmPassword" type="password" required className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white" />
                  </div>
                  <div className="mt-8 flex justify-end">
                    <Button type="submit" disabled={isPending} className="rounded-full bg-black hover:bg-gray-800 text-white px-8">
                      {isPending ? 'Updating...' : 'Update Password'}
                    </Button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-4xl p-6 shadow-soft border border-gray-100">
                <h3 className="text-lg font-bold font-display text-foreground mb-4">
                  Two-Factor Authentication
                </h3>
                <div className="flex items-center justify-between p-4 rounded-3xl bg-gray-50/50 border border-gray-100/50">
                  <div>
                    <p className="font-bold text-foreground">2FA Status</p>
                    <p className="text-xs font-medium text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline" disabled className="rounded-full bg-white border-gray-200 text-xs font-bold">
                    Coming Soon
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-4xl p-6 shadow-soft border border-red-100">
                <h3 className="text-lg font-bold font-display text-red-600 mb-4">
                  Danger Zone
                </h3>
                <div className="flex items-center justify-between p-4 rounded-3xl bg-red-50/50 border border-red-100/50">
                  <div>
                    <p className="font-bold text-red-700">Delete Account</p>
                    <p className="text-xs font-medium text-red-600">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 rounded-full text-xs font-bold">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
