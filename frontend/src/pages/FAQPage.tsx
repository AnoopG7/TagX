import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/shared/PageLayout";
import { containerVariants, itemVariants } from "@/lib/animations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What makes TagX different from AirTag or Tile?",
    a: "TagX has a built-in GPS chip that logs location independently — no phone, no crowd network needed. AirTag and Tile rely entirely on nearby Bluetooth devices. With TagX, you get a complete GPS trail even when your tag is out of Bluetooth range.",
  },
  {
    q: "Does TagX need a subscription?",
    a: "No. The base tag at ₹3,000 gives you lifetime access to basic tracking, separation alerts, and the portal. Optional yearly plans add family sharing (₹500/yr) and AI Pro features (₹999/yr), but nothing is mandatory.",
  },
  {
    q: "How long does the battery last?",
    a: "TagX uses a rechargeable Li-Po battery. With normal use (10-min GPS interval), you get 30+ days on a single charge. Charging takes about 2 hours via USB-C.",
  },
  {
    q: "Does GPS work indoors?",
    a: "GPS works best outdoors with a clear sky view. Indoors, the tag falls back to BLE proximity — you can still find it via signal strength and the onboard buzzer within ~100m.",
  },
  {
    q: "Can I use TagX with both Android and iPhone?",
    a: "Yes. TagX works natively on both Android and iOS. Unlike AirTag (iOS-only) or SmartTag (Samsung-only), there's no ecosystem lock-in. Mixed-phone households are fully supported.",
  },
  {
    q: "How does the AI feature work?",
    a: "TagX uses on-device and cloud ML to learn your patterns — where you usually keep your keys, when you leave for work, which places are routine. It then sends predictive alerts (like 'don't forget your wallet') and highlights unusual movement.",
  },
  {
    q: "What happens if my tag goes out of Bluetooth range?",
    a: "The tag keeps logging GPS coordinates to its internal flash memory (up to 500,000 fixes). When you come back within Bluetooth range, it automatically syncs all stored data to your phone and cloud dashboard. Full timeline preserved.",
  },
  {
    q: "Is TagX waterproof?",
    a: "Yes. The tag is IP67 rated — dust-tight and can survive immersion in up to 1m of water for 30 minutes. Fine for rain, spills, and outdoor use.",
  },
  {
    q: "Can I share a tag with my family?",
    a: "Yes. The Family Plan (₹500/yr) lets you share tags with up to 5 members with role-based permissions. AI Pro (₹999/yr) also includes family sharing along with all AI features.",
  },
  {
    q: "How do I charge the tag?",
    a: "TagX charges via standard USB-C. Plug it into any phone charger, power bank, or laptop. Full charge takes about 2 hours.",
  },
  {
    q: "Is TagX available outside India?",
    a: "Currently TagX is India-first. International shipping will be available after the initial production run. We'll announce dates on our social channels.",
  },
  {
    q: "What is the range of the Bluetooth connection?",
    a: "BLE 5.3 gives you about 100m range in open air. Through walls, expect 20-40m depending on construction. The buzzer helps you locate the tag within a room.",
  },
];

export default function FAQPage() {
  return (
    <PageLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12 pb-16"
      >
        <motion.section
          variants={itemVariants}
          className="text-center max-w-3xl mx-auto pt-8 md:pt-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
            <HelpCircle className="size-3.5" />
            FAQ
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-foreground">
            Frequently Asked Questions
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Everything you need to know about TagX — hardware, software, pricing, and more.
          </p>
        </motion.section>

        <motion.section variants={itemVariants} className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-xl border bg-card px-6"
              >
                <AccordionTrigger className="text-left text-foreground font-medium hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.section>

        <motion.section
          variants={itemVariants}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-primary/20 p-10 md:p-14">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-6">
              We're here to help. Reach out and we'll get back to you within 24 hours.
            </p>
            <Button size="lg" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </motion.section>
      </motion.div>
    </PageLayout>
  );
}
