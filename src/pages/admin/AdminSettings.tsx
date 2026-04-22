import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { platformSettings } from "@/lib/mock-data";
import { toast } from "sonner";

export default function AdminSettings() {
  const [tab, setTab] = useState<"general" | "payment" | "features">("general");
  const [general, setGeneral] = useState(platformSettings.general);
  const [payment, setPayment] = useState(platformSettings.payment);
  const [features, setFeatures] = useState(platformSettings.features);

  return (
    <>
      <PageHeader title="Platform Settings" description="Configure global platform settings" />
      <div className="flex gap-2 mb-6">
        {(["general", "payment", "features"] as const).map((t) => (
          <Button key={t} variant={tab === t ? "default" : "outline"} size="sm" className={`rounded-xl capitalize ${tab === t ? "bg-primary" : "border-white/[0.08]"}`} onClick={() => setTab(t)}>{t}</Button>
        ))}
      </div>

      {tab === "general" && (
        <div className="bento-card max-w-lg space-y-4">
          {Object.entries(general).filter(([k]) => k !== "maintenanceMode").map(([key, val]) => (
            <div key={key}>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
              <Input value={val as string} onChange={(e) => setGeneral(g => ({ ...g, [key]: e.target.value }))} className="glass border-white/[0.08] rounded-xl" />
            </div>
          ))}
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-white/[0.04]">
            <div><p className="text-sm font-medium text-foreground">Maintenance Mode</p><p className="text-xs text-muted-foreground">Take the platform offline for maintenance</p></div>
            <button onClick={() => setGeneral(g => ({ ...g, maintenanceMode: !g.maintenanceMode }))} className={`w-10 h-6 rounded-full transition-colors flex items-center ${general.maintenanceMode ? "bg-destructive justify-end" : "bg-muted justify-start"}`}>
              <span className="w-4 h-4 rounded-full bg-white mx-1" />
            </button>
          </div>
          <Button onClick={() => toast.success("Settings saved")} className="bg-primary hover:bg-primary/90 rounded-xl"><Save className="w-4 h-4 mr-2" />Save</Button>
        </div>
      )}

      {tab === "payment" && (
        <div className="bento-card max-w-lg space-y-4">
          <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Commission Rate (%)</label>
            <Input type="number" value={payment.commissionRate} onChange={(e) => setPayment(p => ({ ...p, commissionRate: Number(e.target.value) }))} className="glass border-white/[0.08] rounded-xl" /></div>
          <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Min Withdrawal ($)</label>
            <Input type="number" value={payment.minWithdrawal} onChange={(e) => setPayment(p => ({ ...p, minWithdrawal: Number(e.target.value) }))} className="glass border-white/[0.08] rounded-xl" /></div>
          <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Payout Schedule</label>
            <select value={payment.payoutSchedule} onChange={(e) => setPayment(p => ({ ...p, payoutSchedule: e.target.value }))} className="w-full text-sm bg-muted border-none rounded-xl px-4 py-2 text-foreground">
              <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option>
            </select></div>
          <Button onClick={() => toast.success("Payment settings saved")} className="bg-primary hover:bg-primary/90 rounded-xl"><Save className="w-4 h-4 mr-2" />Save</Button>
        </div>
      )}

      {tab === "features" && (
        <div className="bento-card max-w-lg space-y-3">
          {Object.entries(features).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-white/[0.04]">
              <p className="text-sm font-medium text-foreground capitalize">{key.replace("Enabled", "").replace(/([A-Z])/g, " $1")}</p>
              <button onClick={() => setFeatures(f => ({ ...f, [key]: !val }))} className={`w-10 h-6 rounded-full transition-colors flex items-center ${val ? "bg-primary justify-end" : "bg-muted justify-start"}`}>
                <span className="w-4 h-4 rounded-full bg-white mx-1" />
              </button>
            </div>
          ))}
          <Button onClick={() => toast.success("Feature flags saved")} className="bg-primary hover:bg-primary/90 rounded-xl"><Save className="w-4 h-4 mr-2" />Save</Button>
        </div>
      )}
    </>
  );
}
