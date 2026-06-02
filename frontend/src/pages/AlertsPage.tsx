import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrivacyAlertCard } from "@/components/tagx";
import { EmptyState, LoadingState } from "@/components/dashboard";
import { PageLayout, PageHeader } from "@/components/shared";
import api from "@/lib/api";
import { formatRelativeTime } from "@/lib/utils";
import { containerVariants, itemVariants } from "@/lib/animations";
import type { PrivacyAlert } from "@/types/alert.types";

const severityTabs = [
  { label: "All", value: "all" },
  { label: "Critical", value: "critical" },
  { label: "Warning", value: "warning" },
  { label: "Info", value: "info" },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<PrivacyAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => { fetchAlerts(); }, [activeTab]);

  async function fetchAlerts() {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (activeTab !== "all") params.severity = activeTab;
      const res = await api.get("/alerts", { params });
      setAlerts(res.data.data.alerts || []);
    } catch { toast.error("Failed to load alerts"); setAlerts([]); }
    finally { setLoading(false); }
  }

  async function handleResolve(id: string) {
    try {
      await api.patch(`/alerts/${id}/resolve`);
      toast.success("Alert resolved");
      fetchAlerts();
    } catch { toast.error("Failed to resolve alert"); }
  }

  const unresolvedCount = alerts.filter((a) => !a.resolved).length;

  return (
    <PageLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        <motion.div variants={itemVariants}>
          <PageHeader
            title={
              <span className="flex items-center gap-3">
                Privacy Alerts
                {unresolvedCount > 0 && <Badge variant="danger">{unresolvedCount}</Badge>}
              </span>
            }
            description="Monitor unknown tracker detections and security notifications."
          />
        </motion.div>

        {!loading && (
          <motion.div variants={itemVariants}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                {severityTabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          {loading ? (
            <LoadingState text="Loading alerts..." />
          ) : alerts.length === 0 ? (
            <EmptyState icon={Shield} title="No alerts" description="No alerts — your privacy is intact" />
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
              {alerts.map((alert) => (
                <motion.div key={alert._id} variants={itemVariants}>
                  <PrivacyAlertCard
                    severity={alert.severity}
                    title={alert.title}
                    description={alert.description}
                    timestamp={formatRelativeTime(alert.timestamp)}
                    location={alert.location}
                    onDismiss={!alert.resolved ? () => handleResolve(alert._id) : undefined}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </PageLayout>
  );
}
