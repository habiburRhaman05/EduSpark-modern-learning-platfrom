import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  // Mobile-friendly position: top-center on small screens, top-right on larger ones
  const isMobile = typeof window !== "undefined" && window.matchMedia?.("(max-width: 640px)").matches;

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position={isMobile ? "top-center" : "top-right"}
      richColors={false}
      closeButton
      expand
      className="toaster group"
      toastOptions={{
        unstyled: false,
        classNames: {
          toast:
            "group toast pointer-events-auto relative flex items-center gap-3 w-full p-4 pr-10 rounded-2xl border backdrop-blur-xl shadow-[0_8px_32px_-8px_hsl(var(--foreground)/0.18)] " +
            "bg-popover/95 text-popover-foreground border-border/60 " +
            "data-[type=success]:border-l-4 data-[type=success]:border-l-success " +
            "data-[type=error]:border-l-4 data-[type=error]:border-l-destructive " +
            "data-[type=warning]:border-l-4 data-[type=warning]:border-l-warning " +
            "data-[type=info]:border-l-4 data-[type=info]:border-l-info",
          title: "text-sm font-semibold leading-tight tracking-tight text-foreground",
          description: "text-[13px] leading-snug text-muted-foreground mt-0.5",
          actionButton:
            "!bg-primary !text-primary-foreground !rounded-lg !px-3 !py-1.5 !text-xs !font-semibold hover:!bg-primary/90 transition-colors",
          cancelButton:
            "!bg-muted !text-muted-foreground !rounded-lg !px-3 !py-1.5 !text-xs !font-semibold hover:!bg-muted/80 transition-colors",
          closeButton:
            "!absolute !right-2 !top-2 !left-auto !translate-x-0 !translate-y-0 !w-6 !h-6 !rounded-md !bg-transparent !border-0 !text-muted-foreground hover:!text-foreground hover:!bg-muted/60 transition-colors",
          icon: "shrink-0 [&>svg]:w-5 [&>svg]:h-5 " +
            "group-data-[type=success]:text-success " +
            "group-data-[type=error]:text-destructive " +
            "group-data-[type=warning]:text-warning " +
            "group-data-[type=info]:text-info",
          success: "[&>[data-icon]]:text-success",
          error: "[&>[data-icon]]:text-destructive",
          warning: "[&>[data-icon]]:text-warning",
          info: "[&>[data-icon]]:text-info",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
