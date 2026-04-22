import { useState } from "react";
import { Save, Lock, Bell, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function TutorSettings() {
  const { updatePassword } = useAuth();
  const [tab, setTab] = useState<"password" | "bank" | "notifications">("password");
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [submitting, setSubmitting] = useState(false);
  const [bank, setBank] = useState({ name: "", account: "", routing: "" });
  const [notif, setNotif] = useState({ newBooking: true, sessionReminder: true, paymentReceived: true, newReview: true, marketing: false });

  const handlePasswordChange = async () => {
    if (passwords.new.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (passwords.new !== passwords.confirm) { toast.error("Passwords don't match"); return; }
    setSubmitting(true);
    const { error } = await updatePassword(passwords.new);
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <>
      <PageHeader title="Settings" description="Manage your account security and preferences" />

      <div className="flex gap-2 mb-6">
        {[{ key: "password", label: "Password", icon: Lock }, { key: "bank", label: "Bank Details", icon: CreditCard }, { key: "notifications", label: "Notifications", icon: Bell }].map((t) => (
          <Button key={t.key} variant={tab === t.key ? "default" : "outline"} size="sm" className={`rounded-xl ${tab === t.key ? "bg-primary" : "border-white/[0.08]"}`} onClick={() => setTab(t.key as any)}>
            <t.icon className="w-3 h-3 mr-1" />{t.label}
          </Button>
        ))}
      </div>

      {tab === "password" && (
        <div className="bento-card max-w-lg">
          <h3 className="font-bold text-foreground mb-4">Change Password</h3>
          <div className="space-y-4">
            {[{ key: "new", label: "New Password" }, { key: "confirm", label: "Confirm Password" }].map((f) => (
              <div key={f.key}>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{f.label}</label>
                <Input type="password" value={passwords[f.key as keyof typeof passwords]} onChange={(e) => setPasswords(p => ({ ...p, [f.key]: e.target.value }))} className="glass border-white/[0.08] rounded-xl" />
              </div>
            ))}
            <Button onClick={handlePasswordChange} disabled={submitting} className="bg-primary hover:bg-primary/90 rounded-xl">
              <Save className="w-4 h-4 mr-2" />{submitting ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </div>
      )}

      {tab === "bank" && (
        <div className="bento-card max-w-lg">
          <h3 className="font-bold text-foreground mb-4">Bank Details</h3>
          <div className="space-y-4">
            {[{ key: "name", label: "Bank Name" }, { key: "account", label: "Account Number" }, { key: "routing", label: "Routing Number" }].map((f) => (
              <div key={f.key}>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{f.label}</label>
                <Input value={bank[f.key as keyof typeof bank]} onChange={(e) => setBank(b => ({ ...b, [f.key]: e.target.value }))} className="glass border-white/[0.08] rounded-xl" />
              </div>
            ))}
            <Button onClick={() => toast.success("Bank details updated")} className="bg-primary hover:bg-primary/90 rounded-xl"><Save className="w-4 h-4 mr-2" />Save Details</Button>
          </div>
        </div>
      )}

      {tab === "notifications" && (
        <div className="bento-card max-w-lg">
          <h3 className="font-bold text-foreground mb-4">Notification Preferences</h3>
          <div className="space-y-3">
            {[
              { key: "newBooking", label: "New Booking", desc: "When a student books a session" },
              { key: "sessionReminder", label: "Session Reminders", desc: "30 minutes before each session" },
              { key: "paymentReceived", label: "Payment Received", desc: "When payment is credited" },
              { key: "newReview", label: "New Review", desc: "When a student leaves a review" },
              { key: "marketing", label: "Marketing Emails", desc: "Platform updates and tips" },
            ].map((n) => (
              <div key={n.key} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-white/[0.04]">
                <div>
                  <p className="text-sm font-medium text-foreground">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <button onClick={() => setNotif(prev => ({ ...prev, [n.key]: !prev[n.key as keyof typeof prev] }))} className={`w-10 h-6 rounded-full transition-colors flex items-center ${notif[n.key as keyof typeof notif] ? "bg-primary justify-end" : "bg-muted justify-start"}`}>
                  <span className="w-4 h-4 rounded-full bg-white mx-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
