import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubmitContact } from "@/hooks/useContactMessages";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});

export default function Contact() {
  const { user, profile } = useAuth();
  const submit = useSubmitContact();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: f.name || profile?.full_name || "",
        email: f.email || (user.email ?? ""),
      }));
    }
  }, [user, profile]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    try {
      await submit.mutateAsync({ ...parsed.data, user_id: user?.id ?? null });
      setDone(true);
      setForm({ name: profile?.full_name || "", email: user?.email || "", subject: "", message: "" });
      toast.success("Message sent. We'll get back to you soon!");
    } catch (e: any) {
      toast.error(e.message || "Couldn't send your message");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4">Get in <span className="text-gradient">Touch</span></h1>
          <p className="text-muted-foreground max-w-lg mx-auto">Have questions? We'd love to hear from you.</p>
        </motion.div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            {[
              { icon: Mail, label: "Email", value: "admin@eduspark.com", href: "mailto:admin@eduspark.com" },
              { icon: Phone, label: "Phone", value: "+880 1605 746821", href: "tel:+8801605746821" },
              { icon: MapPin, label: "Address", value: "Dhaka, Bangladesh" },
            ].map((item, i) => {
              const Inner = (
                <div className="bento-card flex items-center gap-4 hover:border-primary/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              );
              return item.href ? (
                <a key={i} href={item.href} className="block">{Inner}</a>
              ) : (
                <div key={i}>{Inner}</div>
              );
            })}
          </div>
          <form onSubmit={onSubmit} className="lg:col-span-2 bento-card">
            {done ? (
              <div className="flex flex-col items-center text-center py-12">
                <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-7 h-7 text-success" />
                </div>
                <h2 className="text-xl font-bold mb-2">Message received</h2>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                  Thanks for reaching out — our team will reply to <span className="font-medium text-foreground">{form.email || "your email"}</span> within 24 hours.
                </p>
                <Button variant="outline" onClick={() => setDone(false)} className="rounded-xl">Send another</Button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-6">Send a Message</h2>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" maxLength={100} className="h-12 glass border-border rounded-xl" />
                  <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="Email" maxLength={255} className="h-12 glass border-border rounded-xl" />
                </div>
                <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject (optional)" maxLength={200} className="h-12 glass border-border rounded-xl mb-4" />
                <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Your message..." maxLength={2000} className="glass border-border rounded-xl mb-2 min-h-[160px]" />
                <p className="text-[11px] text-muted-foreground mb-4 text-right">{form.message.length}/2000</p>
                <Button type="submit" disabled={submit.isPending} className="bg-primary hover:bg-primary/90 glow-primary rounded-xl">
                  {submit.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  Send Message
                </Button>
              </>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
