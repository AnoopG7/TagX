import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Users, UserPlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { FamilyMemberCard } from "@/components/tagx";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PageLayout, PageHeader } from "@/components/shared";
import api from "@/lib/api";
import { containerVariants, itemVariants } from "@/lib/animations";
import type { FamilyMember, FamilyPermission } from "@/types/family.types";

const permissionLabels: Record<FamilyPermission, string> = {
  track_location: "Location", view_devices: "Devices", receive_alerts: "Alerts", manage_members: "Manage", view_insights: "Insights",
};

interface AddForm { name: string; email: string; phone: string; role: string; relationship: string; }
const initialForm: AddForm = { name: "", email: "", phone: "", role: "member", relationship: "family" };

export default function FamilyPage() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FamilyMember | null>(null);
  const [form, setForm] = useState<AddForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchMembers = async () => {
    try {
      const { data } = await api.get("/family");
      setMembers(data.data.members ?? []);
    } catch {
      toast.error("Failed to load family members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleAdd = async () => {
    setSubmitting(true);
    try {
      await api.post("/family", form);
      toast.success("Family member added");
      setAddOpen(false);
      setForm(initialForm);
      setLoading(true);
      await fetchMembers();
    } catch { toast.error("Failed to add member"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/family/${id}`);
      toast.success("Member removed");
      setDeleteTarget(null);
      setLoading(true);
      await fetchMembers();
    } catch { toast.error("Failed to remove member"); }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <motion.div variants={itemVariants}>
          <PageHeader
            title="Family Network"
            description="Manage your family tracking network"
            actions={
              <Button onClick={() => setAddOpen(true)} className="gap-2">
                <UserPlus className="w-4 h-4" />Add Member
              </Button>
            }
          />
        </motion.div>

        {members.length === 0 ? (
          <motion.div variants={itemVariants}>
            <EmptyState
              icon={Users}
              title="No family members yet"
              description="Add your first family member to start tracking."
              action={<Button onClick={() => setAddOpen(true)} className="gap-2"><UserPlus className="w-4 h-4" />Add Member</Button>}
            />
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <motion.div key={member._id} variants={itemVariants} className="space-y-2">
                <FamilyMemberCard
                  name={member.name}
                  role={member.role}
                  avatar={member.avatar}
                  devices={member.devices}
                  status={member.status as any}
                  location={member.location}
                  isOwner={member.isOwner}
                />
                <div className="flex items-center gap-1.5 px-1">
                  {member.permissions.map((perm) => (
                    <Badge key={perm} variant="outline" className="text-[10px]">{permissionLabels[perm]}</Badge>
                  ))}
                  {!member.isOwner && (
                    <Button variant="ghost" size="xs" className="ml-auto text-muted-foreground hover:text-destructive" onClick={() => setDeleteTarget(member)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Family Member</DialogTitle>
            <DialogDescription>Add a new member to your tracking network</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fm-name">Name</Label>
              <Input id="fm-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fm-email">Email</Label>
              <Input id="fm-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fm-phone">Phone</Label>
              <Input id="fm-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fm-role">Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                  <SelectTrigger id="fm-role" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fm-relationship">Relationship</Label>
                <Select value={form.relationship} onValueChange={(v) => setForm({ ...form, relationship: v })}>
                  <SelectTrigger id="fm-relationship" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={submitting || !form.name.trim()}>
              {submitting ? "Adding..." : "Add Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-medium text-foreground">{deleteTarget?.name}</span>{" "}
              from your family network? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteTarget && handleDelete(deleteTarget._id)}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
