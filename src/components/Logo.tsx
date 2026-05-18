import clsx from "clsx";

export function Mark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ft-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#10b981" />
          <stop offset="1" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient id="ft-line" x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d1fae5" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#ft-bg)" />
      <path
        d="M6 22 L12 16 L16 19 L26 8"
        stroke="url(#ft-line)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="6" cy="22" r="1.6" fill="#ffffff" opacity="0.85" />
      <circle cx="26" cy="8" r="3.6" fill="#ffffff" opacity="0.25" />
      <circle cx="26" cy="8" r="2.2" fill="#ffffff" />
    </svg>
  );
}

export function Logo({
  size = 32,
  showWordmark = true,
  className,
}: {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <Mark size={size} />
      {showWordmark && (
        <span className="text-lg font-semibold tracking-tight">
          Fin<span className="text-primary">Track</span>
        </span>
      )}
    </div>
  );
}
