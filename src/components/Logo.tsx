import { Link } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  to?: string | null;
  className?: string;
  variant?: "default" | "stacked" | "mark";
}

const sizes = {
  sm: { box: "w-8 h-8", text: "text-base", radius: "rounded-[10px]" },
  md: { box: "w-10 h-10", text: "text-lg", radius: "rounded-[12px]" },
  lg: { box: "w-14 h-14", text: "text-2xl", radius: "rounded-[16px]" },
  xl: { box: "w-20 h-20", text: "text-3xl", radius: "rounded-[20px]" },
};

/**
 * Professional EduSpark mark — geometric "ES" monogram with a spark accent.
 * Theme-aware via primary/accent tokens, no hard-coded colors.
 */
export function LogoMark({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) {
  const s = sizes[size];
  return (
    <div
      className={`relative ${s.box} ${s.radius} overflow-hidden shadow-lg shadow-primary/25 group-hover:shadow-primary/45 transition-all duration-300`}
    >
      {/* Brand gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent" />
      {/* Subtle inner depth */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 via-primary-foreground/15 to-primary-foreground/0" />
      {/* Crisp inner ring */}
      <div className={`absolute inset-0 ${s.radius} ring-1 ring-inset ring-primary-foreground/25`} />

      {/* Monogram E + spark — drawn as crisp geometry */}
      <svg
        viewBox="0 0 40 40"
        fill="none"
        className="absolute inset-0 w-full h-full text-primary-foreground"
        aria-hidden
      >
        {/* The "E" — three horizontal bars + spine, modern slab feel */}
        <g>
          <rect x="9" y="9" width="16" height="3.6" rx="1.4" fill="currentColor" />
          <rect x="9" y="18.2" width="12" height="3.6" rx="1.4" fill="currentColor" opacity="0.95" />
          <rect x="9" y="27.4" width="16" height="3.6" rx="1.4" fill="currentColor" />
          <rect x="9" y="9" width="3.6" height="22" rx="1.6" fill="currentColor" />
        </g>
        {/* Spark — diagonal lightning accent in top-right */}
        <path
          d="M30.2 7.4 L26.6 14.6 L29.6 14.6 L27.4 21.4 L32.6 13.4 L29.4 13.4 L31.6 7.4 Z"
          fill="currentColor"
          opacity="0.9"
        />
        {/* Glow dot */}
        <circle cx="32.4" cy="6.2" r="1.4" fill="currentColor" opacity="0.85" />
      </svg>
    </div>
  );
}

export function Logo({
  size = "md",
  showText = true,
  to = "/",
  className = "",
  variant = "default",
}: LogoProps) {
  const s = sizes[size];

  const wordmark = (
    <span className={`${s.text} font-black tracking-tight text-foreground leading-none`}>
      Edu
      <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        Spark
      </span>
    </span>
  );

  const content =
    variant === "stacked" ? (
      <span className={`flex flex-col items-center gap-2 group ${className}`}>
        <LogoMark size={size} />
        {showText && wordmark}
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Learn · Spark · Grow
        </span>
      </span>
    ) : variant === "mark" ? (
      <span className={`group ${className}`}>
        <LogoMark size={size} />
      </span>
    ) : (
      <span className={`flex items-center gap-2.5 group ${className}`}>
        <LogoMark size={size} />
        {showText && wordmark}
      </span>
    );

  if (to === null) return content;
  return (
    <Link to={to} aria-label="EduSpark home">
      {content}
    </Link>
  );
}
