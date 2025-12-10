"use client";

import { Card } from "@/components/ui/card";
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
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) {
      const isDark = stored === 'true';
      setDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

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
    <div className="relative min-h-screen w-full bg-background antialiased">
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account preferences and workspace settings.
          </p>
        </div>

        {message && (
          <div className={cn(
            "mb-4 p-3 rounded-md text-sm",
            message.type === 'success' ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
          )}>
            {message.text}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-56 shrink-0 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMessage(null); }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-colors duration-100",
                  activeTab === tab.id
                    ? "bg-black/5 text-foreground"
                    : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
                )}
              >
                <tab.icon
                  className={cn(
                    "h-4 w-4",
                    activeTab === tab.id
                      ? "text-foreground"
                      : "text-muted-foreground"
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
                <Card className="p-8">
                  <form action={handleProfileSubmit}>
                    <div className="flex items-center gap-6 mb-8">
                      <div className="relative">
                        <Avatar
                          src={undefined}
                          fallback={user.name?.charAt(0) || 'U'}
                          size="xl"
                          className="h-20 w-20 bg-primary/10 text-primary text-xl font-bold"
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">
                          {user.name || 'User'}
                        </h2>
                        <p className="text-muted-foreground">{user.email}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground text-xs font-medium">
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Full Name
                        </label>
                        <Input name="name" type="text" defaultValue={user.name || ''} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Email Address
                        </label>
                        <Input name="email" type="email" defaultValue={user.email} />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                      <Button type="submit" disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Preferences
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-md bg-muted/50 border border-border">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-sm bg-background border border-border text-foreground">
                          <Moon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            Dark Mode
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Toggle dark theme
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={toggleDarkMode}
                        className={cn(
                          "w-11 h-6 rounded-full relative transition-colors",
                          darkMode ? "bg-primary" : "bg-input"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                          darkMode ? "translate-x-6" : "translate-x-1"
                        )} />
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Notifications Section */}
            {activeTab === "notifications" && (
              <Card className="p-8">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Notification Preferences
                </h2>
                <form action={handleNotificationSubmit}>
                  <div className="space-y-4">
                    {[
                      { id: 'emailNotifications', label: 'Email Notifications', description: 'Receive email updates about activity' },
                      { id: 'projectUpdates', label: 'Project Updates', description: 'Get notified when projects are updated' },
                      { id: 'taskReminders', label: 'Task Reminders', description: 'Receive reminders for upcoming tasks' },
                      { id: 'weeklyDigest', label: 'Weekly Digest', description: 'Get a weekly summary of activity' },
                    ].map((setting) => (
                      <label key={setting.id} className="flex items-center justify-between p-4 rounded-md bg-muted/50 border border-border cursor-pointer hover:bg-muted/80 transition-colors">
                        <div>
                          <p className="font-medium text-foreground">{setting.label}</p>
                          <p className="text-sm text-muted-foreground">{setting.description}</p>
                        </div>
                        <input
                          type="checkbox"
                          name={setting.id}
                          value="true"
                          defaultChecked
                          className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                        />
                      </label>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button type="submit" disabled={isPending}>
                      {isPending ? 'Saving...' : 'Save Preferences'}
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Security Section */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <Card className="p-8">
                  <h2 className="text-xl font-bold text-foreground mb-6">
                    Change Password
                  </h2>
                  <form action={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Current Password
                      </label>
                      <Input name="currentPassword" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        New Password
                      </label>
                      <Input name="newPassword" type="password" required minLength={8} />
                      <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Confirm New Password
                      </label>
                      <Input name="confirmPassword" type="password" required />
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button type="submit" disabled={isPending}>
                        {isPending ? 'Updating...' : 'Update Password'}
                      </Button>
                    </div>
                  </form>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Two-Factor Authentication
                  </h3>
                  <div className="flex items-center justify-between p-4 rounded-md bg-muted/50 border border-border">
                    <div>
                      <p className="font-medium text-foreground">2FA Status</p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline" disabled>
                      Coming Soon
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 border-red-200">
                  <h3 className="text-lg font-semibold text-red-600 mb-4">
                    Danger Zone
                  </h3>
                  <div className="flex items-center justify-between p-4 rounded-md bg-red-50 border border-red-200">
                    <div>
                      <p className="font-medium text-red-700">Delete Account</p>
                      <p className="text-sm text-red-600">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                      Delete Account
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
