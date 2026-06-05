import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, MapPin, Phone, Send, Loader2, Code2, MessageCircle, Camera, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageLayout } from "@/components/shared/PageLayout";
import { containerVariants, itemVariants } from "@/lib/animations";
import { Link } from "react-router-dom";
import api from "@/lib/api";

const contactMethods = [
  { icon: Mail, label: "Email", value: "hello@tagx.com", detail: "We reply within 24 hours" },
  { icon: Phone, label: "Phone", value: "+91 7039386723", detail: "Mon–Fri, 9 AM – 6 PM IST" },
  { icon: MapPin, label: "Office", value: "Mumbai, India", detail: "Bandra Kurla Complex" },
  { icon: Clock, label: "Support Hours", value: "24/7 for Pro", detail: "Basic: Mon–Fri, 9–6" },
];

const socialLinks = [
  { icon: MessageCircle, label: "Twitter", href: "#" },
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: Code2, label: "GitHub", href: "#" },
  { icon: MessageSquare, label: "Discord", href: "#" },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      await api.post("/contact", payload);
      toast.success("Message sent! We'll get back to you within 24 hours.");
      (e.target as HTMLFormElement).reset();
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-16 pb-16">
        <motion.section variants={itemVariants} className="text-center max-w-3xl mx-auto pt-8 md:pt-16">
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-foreground">
            Get in Touch
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Questions about TagX? Facing an issue with your device? Want to partner with us?
            Whatever it is, we're here to help.
          </p>
        </motion.section>

        <motion.section variants={itemVariants}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contactMethods.map((m) => (
              <div key={m.label} className="p-5 rounded-xl bg-card border text-center">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <m.icon className="size-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mb-0.5">{m.label}</p>
                <p className="text-sm font-medium text-foreground">{m.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{m.detail}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="max-w-2xl mx-auto w-full">
          <div className="rounded-xl bg-card border p-6 md:p-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
                >
                  <option value="">Select a topic</option>
                  <option>Product inquiry</option>
                  <option>Order support</option>
                  <option>Technical issue</option>
                  <option>Partnership</option>
                  <option>Press & media</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="h-24 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm resize-y"
                  placeholder="Tell us more..."
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">We'll never share your information.</p>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="size-4 animate-spin mr-2" /> : <Send className="size-4 mr-2" />}
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </motion.section>

        <motion.section variants={itemVariants}>
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">Follow us</p>
            <div className="flex items-center justify-center gap-3">
              {socialLinks.map((s) => (
                <Link key={s.label} to={s.href} className="size-10 rounded-lg bg-card border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
                  <s.icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>
        </motion.section>
      </motion.div>
    </PageLayout>
  );
}
