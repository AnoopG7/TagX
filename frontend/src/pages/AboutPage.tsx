import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Zap, Users, Brain, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/shared/PageLayout";
import { containerVariants, itemVariants } from "@/lib/animations";

const stats = [
  { label: "Devices Tracked", value: "500K+" },
  { label: "AI Insights Generated", value: "2.3M+" },
  { label: "Recovery Rate", value: "99.9%" },
  { label: "Cities Covered", value: "40+" },
];

const timeline = [
  { year: "2023", title: "The Idea", description: "TagX was born from a simple frustration — losing things. Our founders set out to build a tracker that doesn't just show where, but tells you when and why." },
  { year: "2024", title: "AI-First Prototype", description: "We launched our first AI-powered tracking tag — combining hardware precision with ML-powered predictions that learn your habits." },
  { year: "2025", title: "Smart Dashboard", description: "Introduced the AI Dashboard with Insights, Smart Notifications, and Privacy Alerts — every device feeds intelligence back to you." },
  { year: "2026", title: "Global Scale", description: "TagX is now tracking over 500K devices across 40+ cities, powered by real-time AI that gets smarter every day." },
];

const values = [
  { icon: Brain, title: "AI-first Design", description: "Every TagX device comes with built-in AI that learns your patterns, predicts your needs, and prevents loss before it happens. Powered by on-device ML." },
  { icon: Shield, title: "Privacy by Default", description: "End-to-end encrypted. Your location data belongs to you. Anti-stalking detection is built in from day one, not bolted on later." },
  { icon: Zap, title: "Real-time Intelligence", description: "Insights generate in milliseconds. When you mark a device as lost, AI immediately analyzes the last known position and suggests search areas." },
  { icon: Users, title: "Built for People", description: "From solo users to families of six, TagX adapts. Role-based sharing, geofence zones, and AI alerts that understand who's who." },
];

const team = [
  { name: "Anoop Gupta", role: "Founder & Lead Developer" },
  { name: "Devdarshan Sarvanan", role: "Co-founder & Developer" },
  { name: "Rehan Mulani", role: "Researcher" },
];

export default function AboutPage() {
  return (
    <PageLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-24 pb-16">
        <motion.section variants={itemVariants} className="text-center max-w-3xl mx-auto pt-8 md:pt-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
            <Sparkles className="size-3.5" />
            AI-powered tracking
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-foreground">
            Intelligence that<br />never loses track
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            TagX combines precision hardware with AI & ML to give you real-time insights, 
            predictive alerts, and privacy protection — automatically.
          </p>
        </motion.section>

        <motion.section variants={itemVariants}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-xl bg-muted/30 border">
                <div className="text-3xl md:text-4xl font-display font-bold text-foreground">{stat.value}</div>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section variants={itemVariants}>
          <h2 className="text-3xl font-display font-bold text-foreground mb-10 text-center">Our Story</h2>
          <div className="space-y-8 max-w-3xl mx-auto">
            {timeline.map((item) => (
              <div key={item.year} className="relative pl-8 border-l-2 border-primary/30">
                <span className="absolute -left-2.5 top-0 size-5 rounded-full bg-primary ring-4 ring-background" />
                <span className="text-sm font-mono text-primary font-medium">{item.year}</span>
                <h3 className="text-lg font-semibold text-foreground mt-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section variants={itemVariants}>
          <h2 className="text-3xl font-display font-bold text-foreground mb-10 text-center">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {values.map((v) => (
              <div key={v.title} className="p-6 rounded-xl bg-card border">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon className="size-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.description}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section variants={itemVariants}>
          <h2 className="text-3xl font-display font-bold text-foreground mb-10 text-center">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {team.map((t) => (
              <div key={t.name} className="p-6 rounded-xl bg-card border text-center">
                <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-primary">{t.name.split(" ").map((n) => n[0]).join("")}</span>
                </div>
                <h3 className="font-semibold text-foreground">{t.name}</h3>
                <p className="text-xs text-primary font-medium mt-0.5">{t.role}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="text-center">
          <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-primary/20 p-10 md:p-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
              <Brain className="size-3" /> AI & ML Powered
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Ready to Never Lose Again?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Join 500K+ devices already tracked with TagX AI.
            </p>
            <Button size="lg" asChild>
              <Link to="/products">
                Get Started <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </motion.section>
      </motion.div>
    </PageLayout>
  );
}
