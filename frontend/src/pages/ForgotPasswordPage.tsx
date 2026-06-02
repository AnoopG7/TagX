import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Logo } from "@/components/common/Logo";
import api from "@/lib/api";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    try {
      await api.post("/auth/forgot-password", { email: data.email });
      setEmailSent(true);
    } catch {
      setEmailSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <Card className="ring-1 ring-foreground/10">
          <CardHeader className="items-center pb-2 pt-8 text-center">
            <Logo size="lg" />
            <CardTitle className="mt-4 text-xl font-semibold">
              Reset your password
            </CardTitle>
            <CardDescription>
              {emailSent
                ? "Check your inbox"
                : "Enter your email and we'll send you a reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pb-8 pt-4">
            {emailSent ? (
              <div className="space-y-5 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="text-primary" size={24} />
                </div>
                <p className="text-sm text-muted-foreground">
                  If an account exists, a reset link has been sent to your
                  email.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>
            )}

            <Link
              to="/login"
              className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft size={14} />
              Back to login
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
