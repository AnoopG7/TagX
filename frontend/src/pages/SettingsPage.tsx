import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Save, KeyRound, Bell, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PageLayout, PageHeader } from "@/components/shared";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import api from "@/lib/api";
import { containerVariants, itemVariants } from "@/lib/animations";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [notifications, setNotifications] = useState(user?.preferences?.notifications ?? true);
  const [emailAlerts, setEmailAlerts] = useState(user?.preferences?.emailAlerts ?? true);
  const [smsAlerts, setSmsAlerts] = useState(user?.preferences?.smsAlerts ?? false);
  const [privacyScanEnabled, setPrivacyScanEnabled] = useState(user?.preferences?.privacyScanEnabled ?? true);
  const [theme, setTheme] = useState<"dark" | "light" | "system">(user?.preferences?.theme ?? "dark");
  const [language, setLanguage] = useState(user?.preferences?.language ?? "en");
  const [timezone, setTimezone] = useState(user?.preferences?.timezone ?? "Asia/Kolkata");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  if (!user) {
    return (
      <PageLayout>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </PageLayout>
    );
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const { data: res } = await api.patch("/auth/me", { name, phone });
      updateUser({ name: res.data.user.name, phone: res.data.user.phone });
      useAuthStore.getState().fetchMe();
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePreferences = async () => {
    setSavingPreferences(true);
    try {
      const preferencesData = { theme, notifications, emailAlerts, smsAlerts, language, timezone, privacyScanEnabled };
      const { data: res } = await api.patch("/auth/me", { preferences: preferencesData });
      updateUser({ preferences: res.data.user.preferences });
      if (theme === "dark" || theme === "light") {
        useUIStore.getState().setTheme(theme);
      }
      toast.success("Preferences saved");
    } catch {
      toast.error("Failed to save preferences");
    } finally {
      setSavingPreferences(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setChangingPassword(true);
    try {
      await api.post("/auth/change-password", { currentPassword, newPassword });
      toast.success("Password changed successfully");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch {
      toast.error("Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <PageLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        <motion.div variants={itemVariants}>
          <PageHeader title="Settings" description="Manage your profile and preferences" />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <CardTitle>Profile Info</CardTitle>
              </div>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <Button onClick={handleSaveProfile} disabled={savingProfile} className="gap-2">
                <Save className="w-4 h-4" />{savingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <CardTitle>Preferences</CardTitle>
              </div>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-body-small font-medium text-foreground">Notifications</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications" className="font-normal">Push Notifications</Label>
                    <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailAlerts" className="font-normal">Email Alerts</Label>
                    <Switch id="emailAlerts" checked={emailAlerts} onCheckedChange={setEmailAlerts} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="smsAlerts" className="font-normal">SMS Alerts</Label>
                    <Switch id="smsAlerts" checked={smsAlerts} onCheckedChange={setSmsAlerts} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="privacyScan" className="font-normal">Privacy Scan</Label>
                    <Switch id="privacyScan" checked={privacyScanEnabled} onCheckedChange={setPrivacyScanEnabled} />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={theme} onValueChange={(v) => setTheme(v as "dark" | "light" | "system")}>
                    <SelectTrigger id="theme" className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language" className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger id="timezone" className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                      <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleSavePreferences} disabled={savingPreferences} className="gap-2">
                <Save className="w-4 h-4" />{savingPreferences ? "Saving..." : "Save Preferences"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <CardTitle>Security</CardTitle>
              </div>
              <CardDescription>Change your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <Button onClick={handleChangePassword} disabled={changingPassword} className="gap-2">
                <KeyRound className="w-4 h-4" />{changingPassword ? "Changing..." : "Change Password"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageLayout>
  );
}
