import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Bell, CheckCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SmartNotification } from "@/components/tagx";
import { EmptyState, LoadingState } from "@/components/dashboard";
import { PageLayout, PageHeader } from "@/components/shared";
import api from "@/lib/api";
import { formatRelativeTime } from "@/lib/utils";
import { containerVariants, itemVariants } from "@/lib/animations";
import type { AppNotification } from "@/types/notification.types";

const typeTabs = [
  { label: "All", value: "all" },
  { label: "Security", value: "security" },
  { label: "Location", value: "location" },
  { label: "Insight", value: "insight" },
  { label: "Reminder", value: "reminder" },
];

const typeMap: Record<string, "location" | "security" | "insight" | "reminder"> = {
  location: "location",
  security: "security",
  insight: "insight",
  reminder: "reminder",
  system: "insight",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => { fetchNotifications(); }, [activeTab]);

  async function fetchNotifications() {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (activeTab !== "all") params.type = activeTab;
      const res = await api.get("/notifications", { params });
      setNotifications(res.data.data.notifications || []);
      setUnreadCount(res.data.data.unreadCount || 0);
    } catch { toast.error("Failed to load notifications"); setNotifications([]); }
    finally { setLoading(false); }
  }

  async function handleMarkRead(id: string) {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch { toast.error("Failed to mark as read"); }
  }

  async function handleMarkAllRead() {
    try {
      await api.patch("/notifications/read-all");
      toast.success("All notifications marked as read");
      fetchNotifications();
    } catch { toast.error("Failed to mark all as read"); }
  }

  return (
    <PageLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        <motion.div variants={itemVariants}>
          <PageHeader
            title={
              <span className="flex items-center gap-3">
                Notifications
                {unreadCount > 0 && <Badge variant="default">{unreadCount}</Badge>}
              </span>
            }
            description="Stay informed about device activity, security events, and reminders."
          />
        </motion.div>

        {!loading && (
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                {typeTabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="gap-2">
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </Button>
            )}
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="space-y-2">
          {loading ? (
            <LoadingState text="Loading notifications..." />
          ) : notifications.length === 0 ? (
            <EmptyState icon={Bell} title="No notifications" description="Notifications about your devices will appear here." />
          ) : (
            notifications.map((notif) => (
              <SmartNotification
                key={notif._id}
                title={notif.title}
                description={notif.description}
                type={typeMap[notif.type] || "insight"}
                timestamp={formatRelativeTime(notif.timestamp)}
                read={notif.read}
                actionable={notif.actionable && !notif.read}
                onDismiss={!notif.read ? () => handleMarkRead(notif._id) : undefined}
              />
            ))
          )}
        </motion.div>
      </motion.div>
    </PageLayout>
  );
}
