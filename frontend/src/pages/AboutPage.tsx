import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Shield, Zap, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/shared/PageLayout";
import { containerVariants, itemVariants } from "@/lib/animations";

const stats = [
  { label: "Active Users", value: "50K+" },
  { label: "Items Tracked", value: "500K+" },
  { label: "Recovery Rate", value: "99.9%" },
  { label: "Countries", value: "40+" },
];

const timeline = [
  { year: "2023", title: "The Idea", description: "TagX was born from a simple frustration — losing things. Our founders set out to build a better way to track what matters." },
  { year: "2024", title: "First Prototype", description: "We launched our first Bluetooth tracking tag, combining hardware precision with AI-powered predictions." },
  { year: "2025", title: "Family Sharing", description: "Introduced multi-user support, privacy alerts, and anti-stalking protection." },
  { year: "2026", title: "Global Reach", description: "TagX is now used in 40+ countries, protecting millions of belongings worldwide." },
];

const values = [
  { icon: MapPin, title: "Precision", description: "Sub-meter accuracy with advanced Bluetooth triangulation." },
  { icon: Shield, title: "Privacy First", description: "End-to-end encrypted. Your data belongs to you, always." },
  { icon: Zap, title: "AI-Powered", description: "Smart predictions that learn your habits and prevent loss before it happens." },
  { icon: Users, title: "Family-Focused", description: "Built for families, with shared access and safety features." },
];

export default function AboutPage() {
  return (
    <PageLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-24 pb-16"
      >
        <motion.section variants={itemVariants} className="text-center max-w-3xl mx-auto pt-8 md:pt-16">
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-foreground">
            Our Mission
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            TagX helps people never lose what matters. We combine smart hardware with intelligent software
            to give you peace of mind — whether it's your keys, your luggage, your pet, or your kids.
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <motion.section variants={itemVariants} className="text-center">
          <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-primary/20 p-10 md:p-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Ready to Never Lose Again?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Join 50,000+ users who trust TagX to keep track of what matters.
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
