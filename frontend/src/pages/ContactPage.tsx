import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, MapPin, Phone, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageLayout } from "@/components/shared/PageLayout";
import { containerVariants, itemVariants } from "@/lib/animations";

const contactMethods = [
  { icon: Mail, label: "Email", value: "hello@tagx.com" },
  { icon: Phone, label: "Phone", value: "+91 7039386723" },
  { icon: MapPin, label: "Office", value: "Mumbai, India" },
  { icon: MessageSquare, label: "Social", value: "@tagx" },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    toast.success("Message sent! We'll get back to you within 24 hours.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <PageLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-16 pb-16"
      >
        <motion.section variants={itemVariants} className="text-center max-w-3xl mx-auto pt-8 md:pt-16">
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-foreground">
            Get in Touch
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Have a question, feedback, or just want to say hi? We'd love to hear from you.
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
                  <Input id="name" placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help?" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  rows={5}
                  required
                  className="h-24 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm resize-y"
                  placeholder="Tell us more..."
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin mr-2" />
                ) : (
                  <Send className="size-4 mr-2" />
                )}
                Send Message
              </Button>
            </form>
          </div>
        </motion.section>
      </motion.div>
    </PageLayout>
  );
}
