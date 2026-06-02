import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIInsightCard } from "@/components/tagx";
import { EmptyState, LoadingState } from "@/components/dashboard";
import { PageLayout, PageHeader } from "@/components/shared";
import api from "@/lib/api";
import { formatRelativeTime } from "@/lib/utils";
import { containerVariants, itemVariants } from "@/lib/animations";
import type { AIInsight } from "@/types/insight.types";

const typeTabs = [
  { label: "All", value: "all" },
  { label: "Insights", value: "insight" },
  { label: "Predictions", value: "prediction" },
  { label: "Suggestions", value: "suggestion" },
  { label: "Alerts", value: "alert" },
];

export default function InsightsPage() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => { fetchInsights(); }, [activeTab]);

  async function fetchInsights() {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (activeTab !== "all") params.type = activeTab;
      const res = await api.get("/insights", { params });
      setInsights(res.data.data.insights || []);
    } catch { toast.error("Failed to load insights"); setInsights([]); }
    finally { setLoading(false); }
  }

  async function handleDismiss(id: string) {
    try {
      await api.patch(`/insights/${id}/dismiss`);
      toast.success("Insight dismissed");
      fetchInsights();
    } catch { toast.error("Failed to dismiss insight"); }
  }

  return (
    <PageLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        <motion.div variants={itemVariants}>
          <PageHeader
            title={
              <span className="flex items-center gap-3">
                AI Insights
                <Sparkles className="w-5 h-5 text-primary" />
              </span>
            }
            description="AI-generated observations, predictions, and suggestions based on your device activity."
          />
        </motion.div>

        {!loading && (
          <motion.div variants={itemVariants}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                {typeTabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          {loading ? (
            <LoadingState text="Loading insights..." />
          ) : insights.length === 0 ? (
            <EmptyState icon={Sparkles} title="No insights" description="AI insights will appear here as your devices are tracked." />
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
              {insights.map((insight) => (
                <motion.div key={insight._id} variants={itemVariants}>
                  <AIInsightCard
                    title={insight.title}
                    description={insight.description}
                    type={insight.type}
                    timestamp={formatRelativeTime(insight.timestamp)}
                    confidence={insight.confidence}
                    actionable={insight.actionable && !insight.dismissed}
                    onAction={!insight.dismissed ? () => handleDismiss(insight._id) : undefined}
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
