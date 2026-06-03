import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Radar, Monitor, Brain, Shield, Users,
  Battery, Bell, Sparkles, LayoutDashboard, Check, X, Map, History, Cpu,
} from "lucide-react";
import { HeroBackground } from "@/components/common/HeroBackground";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { containerVariants, fadeUp } from "@/lib/animations";

const features = [
  { icon: Monitor, title: "Truly cross-platform", desc: "Works natively on both Android and iOS. No ecosystem lock-in. Mixed-phone households welcome." },
  { icon: Brain, title: "AI habit learning", desc: "Learns where you keep things. Alerts you before you forget, not after. Chat with your tags in plain English." },
  { icon: Shield, title: "Anti-stalking built-in", desc: "Unknown tag detection from day one. Consent-based sharing. No silent tracking. Ever." },
  { icon: Users, title: "Family & team mode", desc: "Share tags with permission levels. Great for kids, pets, elderly parents, or small teams." },
  { icon: Battery, title: "18-month battery", desc: "BLE 5.3 + UWB precision. CR2032 replaceable battery. IP67 water resistance. Built to last." },
  { icon: Bell, title: "Predictive alerts", desc: "Left bag at the café again? TagX knows your patterns and warns you before you leave without it." },
];

const steps = [
  { num: "1", title: "Attach the tag", desc: "Clip, stick, or loop TagX onto keys, bags, wallets, pets — anything you value." },
  { num: "2", title: "Pair with the app", desc: "Android or iOS. One tap to pair. Works on any smartphone, no brand gates." },
  { num: "3", title: "AI learns your routine", desc: "TagX observes where things usually live and builds your pattern profile in a week." },
  { num: "4", title: "Get smart alerts", desc: "Separation alerts, predictive nudges, and natural language search — all automated." },
];

const marketCards = [
  { num: "$6.56B", lbl: "Global market size in 2025" },
  { num: "15.35%", lbl: "CAGR through 2032" },
  { num: "17.6%", lbl: "Asia-Pacific CAGR — fastest region" },
  { num: "$17.8B", lbl: "Projected market by 2032" },
];

const comparison = [
  { feature: "Android support", good: ["Native", "No", "Yes", "Yes"] },
  { feature: "iOS support", good: ["Native", "Yes", "Limited", "Yes"] },
  { feature: "AI-powered features", good: ["Full AI", "—", "—", "—"] },
  { feature: "Anti-stalking", good: ["Day 1", "After lawsuits", "Basic", "Basic"] },
  { feature: "No subscription needed", good: ["Yes", "Yes", "Yes", "Paid alerts"] },
  { feature: "Family sharing", good: ["With roles", "Basic", "Basic", "Premium"] },
  { feature: "Offline GPS logging", good: ["GPS logs", "Crowd only", "Crowd only", "Crowd only"] },
  { feature: "Path history", good: ["Full GPS trail", "—", "—", "—"] },
  { feature: "India pricing", good: ["₹3,000", "₹3,200+", "₹3,499", "₹2,800+"] },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-background pointer-events-none" />
        <HeroBackground />
        {/* Center radar disc */}
        <div className="absolute inset-0 z-[1] pointer-events-none flex items-center justify-center">
          <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-primary/[0.08] to-primary/[0.02] flex items-center justify-center border border-primary/[0.12]">
            <Radar className="w-16 h-16 md:w-20 md:h-20 text-primary/60" />
          </div>
        </div>
        <Container className="relative z-10 py-20 md:py-32 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-8"
            >
              <Cpu className="w-3.5 h-3.5" />
              GPS + AI Powered
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight"
            >
              Never lose<br />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">anything</span> again
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              TagX combines GPS + BLE + AI — it logs your location even without a phone nearby, then uses AI to learn your habits and keep you protected.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="gap-2 text-base px-8">
                  <LayoutDashboard className="w-5 h-5" />
                  Go to Dashboard
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" size="lg" className="gap-2 text-base px-8">
                  See Products
                </Button>
              </Link>
            </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            <div className="text-center p-4 rounded-xl bg-muted/30 border">
              <div className="text-3xl md:text-4xl font-display font-bold text-foreground">~100m</div>
              <p className="text-sm text-muted-foreground mt-1">Android users locked out of AirTag</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-muted/30 border">
              <div className="text-3xl md:text-4xl font-display font-bold text-foreground">₹3,000</div>
              <p className="text-sm text-muted-foreground mt-1">Per tag — no subscription needed</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-muted/30 border">
              <div className="text-3xl md:text-4xl font-display font-bold text-foreground">15.35%</div>
              <p className="text-sm text-muted-foreground mt-1">Global CAGR of tracker market 2025–32</p>
            </div>
          </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* AI Dashboard */}
      <section className="py-20 md:py-32 bg-muted/30">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
              <Brain className="size-3" /> GPS + AI
            </div>
            <p className="text-sm font-medium text-primary tracking-widest uppercase mb-3">AI Dashboard</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
              Intelligence at your fingertips
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Every tracked device feeds into a live AI dashboard that learns, alerts, and protects — automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-xl bg-card border group hover:border-primary/30 transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-all duration-200">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-1">AI Insights</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI & ML generate observations about your device usage patterns, location trends, and predictive suggestions — like knowing when you're about to leave something behind.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border group hover:border-primary/30 transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-all duration-200">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-1">Smart Notifications</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Real-time alerts about device activity, separation warnings, and helpful reminders — delivered to your dashboard instantly by AI that understands context.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border group hover:border-primary/30 transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-all duration-200">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-1">Privacy Alerts</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Instant warnings about unknown tracker detections and unusual behavior — AI-powered anti-stalking built in from day one.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2">
                <LayoutDashboard className="w-5 h-5" />
                Open Your AI Dashboard
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Why TagX */}
      <section className="py-20 md:py-32">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-medium text-primary tracking-widest uppercase mb-3">Why TagX</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
              What every tracker<br />gets wrong
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              AirTag, SmartTag, Tile — they all tell you WHERE. TagX tells you when, why, and keeps you safe while doing it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-xl bg-card border hover:border-primary/30 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-all duration-200">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Comparison */}
      <section className="py-20 md:py-32 bg-muted/30">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-medium text-primary tracking-widest uppercase mb-3">Competition</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
              TagX vs. everyone else
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              See exactly how TagX stacks up against AirTag, Samsung SmartTag2, and Tile Pro.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 md:p-4 font-medium text-muted-foreground min-w-[140px]">Feature</th>
                  <th className="text-left p-3 md:p-4 font-semibold text-primary min-w-[110px]">TagX ✦</th>
                  <th className="text-left p-3 md:p-4 font-medium text-muted-foreground min-w-[110px]">Apple AirTag</th>
                  <th className="text-left p-3 md:p-4 font-medium text-muted-foreground min-w-[110px]">Samsung SmartTag2</th>
                  <th className="text-left p-3 md:p-4 font-medium text-muted-foreground min-w-[110px]">Tile Pro</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-3 md:p-4 font-medium text-foreground">{row.feature}</td>
                    {row.good.map((val, j) => (
                      <td key={j} className={`p-3 md:p-4 ${j === 0 ? "text-primary font-medium" : "text-muted-foreground"}`}>
                        <span className="inline-flex items-center gap-1.5">
                          {j > 0 && (val === "—" || val === "No" || val === "After lawsuits" || val === "Basic" || val === "Premium" || val === "Paid alerts" || val === "Limited" || val === "Crowd only")
                            ? <X className="w-3.5 h-3.5 shrink-0" />
                            : j > 0 ? <Check className="w-3.5 h-3.5 text-green-600 shrink-0" /> : null}
                          {val}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-20 md:py-32 bg-muted/30">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-medium text-primary tracking-widest uppercase mb-3">How it works</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
              Set up in under 2 minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Market opportunity */}
      <section className="py-20 md:py-32">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-medium text-primary tracking-widest uppercase mb-3">Market opportunity</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
              Why now, why India
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              The global tracker market is booming, and Asia-Pacific is leading growth — with India right in the center.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketCards.map((c) => (
              <div key={c.lbl} className="text-center p-6 rounded-xl bg-card border">
                <div className="text-3xl md:text-4xl font-display font-bold text-foreground mb-1">{c.num}</div>
                <p className="text-sm text-muted-foreground">{c.lbl}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Pricing */}
      <section className="py-20 md:py-32 bg-muted/30">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-medium text-primary tracking-widest uppercase mb-3">Pricing</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
              One tag. Three ways to use it.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              ₹3,000 for the tag. Pick a yearly plan that fits — family sharing, AI + path tracing, or both.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Basic */}
            <div className="p-6 rounded-xl bg-card border">
              <div className="text-sm font-medium text-muted-foreground mb-1">TagX Tag</div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">₹3,000 <span className="text-base font-normal text-muted-foreground">/ tag</span></div>
              <p className="text-sm text-muted-foreground mb-6">The hardware tag. One user, lifetime access, no subscription.</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary shrink-0" />Real-time location tracking</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary shrink-0" />Basic separation alerts</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary shrink-0" />Cross-platform app (Android + iOS)</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary shrink-0" />1 user, lifetime access</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary shrink-0" />18-month battery, IP67</li>
              </ul>
              <Button className="w-full mt-6" size="sm">Buy tag — ₹3,000</Button>
            </div>

            {/* Family plan */}
            <div className="p-6 rounded-xl bg-card border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                Most popular
              </div>
              <div className="text-sm font-medium text-primary mb-1">+ Family Plan</div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">+₹500 <span className="text-base font-normal text-muted-foreground">/ year</span></div>
              <p className="text-sm text-muted-foreground mb-6">Share tags, geofences, and alerts with up to 5 family members. ₹500/year per account.</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary shrink-0" />Family sharing (up to 5 members)</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary shrink-0" />Shared tags & geofence zones</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary shrink-0" />Role-based access control</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary shrink-0" />Everyone gets lifetime portal</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary shrink-0" />Yearly billing, cancel anytime</li>
              </ul>
              <Button className="w-full mt-6" size="sm" variant="default">Add Family — ₹500/yr</Button>
            </div>

            {/* AI Pro plan */}
            <div className="p-6 rounded-xl bg-card border">
              <div className="text-sm font-medium text-muted-foreground mb-1">+ AI Pro</div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">+₹999 <span className="text-base font-normal text-muted-foreground">/ year</span></div>
              <p className="text-sm text-muted-foreground mb-6">AI & ML insights, predictive alerts, path tracing, and full movement history. Includes all Family Plan features. ₹999/year per account.</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Brain className="w-3.5 h-3.5 text-primary shrink-0" />AI & ML-powered insights</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary shrink-0" />AI habit learning & predictive alerts</li>
                <li className="flex items-center gap-2"><Map className="w-3.5 h-3.5 text-primary shrink-0" />Path tracing & movement history</li>
                <li className="flex items-center gap-2"><History className="w-3.5 h-3.5 text-primary shrink-0" />30-day location timeline</li>
                <li className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-primary shrink-0" />Anti-stalking & unknown tag detection</li>
                <li className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-primary shrink-0" />Family sharing (up to 5 members) included</li>
              </ul>
              <Button className="w-full mt-6" size="sm" variant="outline">Add AI Pro — ₹999/yr</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
