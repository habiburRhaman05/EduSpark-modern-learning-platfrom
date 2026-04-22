import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Lock } from "lucide-react";
import { toast } from "sonner";

export default function TechnicianSettings() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const changePassword = () => {
    if (!currentPw || !newPw) { toast.error("Please fill all fields"); return; }
    if (newPw !== confirmPw) { toast.error("Passwords do not match"); return; }
    if (newPw.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    toast.success("Password changed successfully");
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
  };

  return (
    <>
      <PageHeader title="Settings" description="Manage your account settings" />
      <div className="bento-card max-w-lg space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> Change Password</h3>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Current Password</label>
          <Input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className="glass border-border rounded-xl" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">New Password</label>
          <Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="glass border-border rounded-xl" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Confirm New Password</label>
          <Input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="glass border-border rounded-xl" />
        </div>
        <Button onClick={changePassword} className="bg-primary hover:bg-primary/90 rounded-xl"><Save className="w-4 h-4 mr-2" /> Update Password</Button>
      </div>
    </>
  );
}
