import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import api from "@/lib/api";
import type { DeviceType } from "@/types/device.types";

const deviceTypes: { value: DeviceType; label: string }[] = [
  { value: "tag", label: "Tag" },
  { value: "phone", label: "Phone" },
  { value: "wallet", label: "Wallet Card" },
  { value: "pet", label: "Pet Collar" },
  { value: "key", label: "Keychain" },
];

interface FormData {
  name: string;
  type: DeviceType;
  serialNumber: string;
}

interface FormErrors {
  name?: string;
  type?: string;
  serialNumber?: string;
}

const initialForm: FormData = { name: "", type: "tag", serialNumber: "" };

const SERIAL_RE = /^[a-zA-Z0-9]{6,30}$/;

function validate(form: FormData): FormErrors {
  const e: FormErrors = {};
  if (!form.name.trim()) e.name = "Device name is required";
  else if (form.name.trim().length > 60) e.name = "Name cannot exceed 60 characters";
  if (!form.serialNumber.trim()) e.serialNumber = "Serial number is required";
  else if (!SERIAL_RE.test(form.serialNumber.trim())) e.serialNumber = "Serial must be 6-30 alphanumeric characters";
  return e;
}

function generateSerial(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "TAGX";
  for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

interface AddDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddDeviceDialog({ open, onOpenChange, onSuccess }: AddDeviceDialogProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setSubmitting(true);
    try {
      await api.post("/devices", {
        name: form.name.trim(),
        type: form.type,
        serialNumber: form.serialNumber.trim().toUpperCase(),
      });
      toast.success("Device added successfully");
      setForm(initialForm);
      setErrors({});
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to add device";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Device</DialogTitle>
          <DialogDescription>Register a new tracking device to your network</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ad-name">Device Name</Label>
            <Input
              id="ad-name"
              value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: undefined }); }}
              className={errors.name ? "border-destructive" : ""}
              placeholder="e.g. My Keys"
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ad-type">Device Type</Label>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as DeviceType })}>
              <SelectTrigger id="ad-type" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {deviceTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ad-serial">Serial Number</Label>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => setForm({ ...form, serialNumber: generateSerial() })}
              >
                Generate
              </Button>
            </div>
            <Input
              id="ad-serial"
              value={form.serialNumber}
              onChange={(e) => { setForm({ ...form, serialNumber: e.target.value }); setErrors({ ...errors, serialNumber: undefined }); }}
              className={errors.serialNumber ? "border-destructive font-mono text-xs" : "font-mono text-xs"}
              placeholder="TAGX"
            />
            {errors.serialNumber && <p className="text-xs text-destructive">{errors.serialNumber}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Adding..." : "Add Device"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
