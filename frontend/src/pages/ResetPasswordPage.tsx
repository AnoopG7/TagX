import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";

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

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/auth/reset-password", {
        token,
        password: data.password,
      });
      toast.success("Password reset successfully. Please sign in.");
      navigate("/login");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const message =
        error?.response?.data?.message ||
        "Failed to reset password. The link may have expired.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md ring-1 ring-foreground/10">
          <CardHeader className="items-center pb-2 pt-8 text-center">
            <Logo size="lg" />
            <CardTitle className="mt-4 text-xl font-semibold">
              Invalid link
            </CardTitle>
            <CardDescription>
              This reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8 pt-4">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary hover:underline"
            >
              Request a new reset link
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              Set new password
            </CardTitle>
            <CardDescription>
              Must be at least 8 characters with uppercase, lowercase, and a
              number
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pb-8 pt-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm new password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter new password"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {errors.confirmPassword.message}
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
                  <>
                    <KeyRound size={16} />
                    Reset password
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
