import { Link } from "react-router-dom";
import { Twitter, Linkedin, Facebook, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/Logo";

const links = {
  Platform: [
    { label: "Find Tutors", href: "/tutors" },
    { label: "Become a Tutor", href: "/register" },
    { label: "Categories", href: "/categories" },
    { label: "How It Works", href: "/#how-it-works" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/about" },
    { label: "Press Kit", href: "/about" },
  ],
  Support: [
    { label: "Help Center", href: "/contact" },
    { label: "Contact Us", href: "/contact" },
    { label: "Community", href: "/about" },
    { label: "FAQ", href: "/#faq" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/terms" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/terms" },
    { label: "Accessibility", href: "/terms" },
  ],
};

const socials = [
  { Icon: Twitter, href: "#", label: "Twitter" },
  { Icon: Linkedin, href: "#", label: "LinkedIn" },
  { Icon: Facebook, href: "#", label: "Facebook" },
  { Icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border/60 bg-gradient-to-b from-background to-card/40 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2 md:col-span-2">
            <div className="mb-5">
              <Logo size="md" />
            </div>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
              Ignite your learning journey with personalized 1-on-1 tutoring from verified experts across 200+ subjects.
            </p>
            <div className="space-y-2 mb-6">
              <a href="mailto:admin@eduspark.com" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-3.5 h-3.5" /> admin@eduspark.com
              </a>
              <a href="tel:+8801605746821" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-3.5 h-3.5" /> +880 1605 746821
              </a>
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" /> Dhaka, Bangladesh
              </p>
            </div>
            <div className="flex gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-muted/60 border border-border/40 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-105 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">{title}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block hover:translate-x-0.5 duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} EduSpark, Inc. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            Crafted with <span className="text-destructive">♥</span> for curious minds worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
