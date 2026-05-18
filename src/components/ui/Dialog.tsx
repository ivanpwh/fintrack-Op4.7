"use client";
import { useEffect } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

type Size = "sm" | "md" | "lg" | "xl";

const SIZE: Record<Size, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-3xl",
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
  hideCloseButton,
  headerSlot,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: Size;
  className?: string;
  hideCloseButton?: boolean;
  headerSlot?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="fixed inset-0 animate-fade-in bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={clsx(
          "relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-xl border bg-card text-card-foreground shadow-xl animate-slide-up sm:max-h-[88vh] sm:rounded-xl sm:animate-scale-in",
          SIZE[size],
          className,
        )}
      >
        <div className="sm:hidden">
          <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-muted" />
        </div>

        {(title || description || headerSlot) && (
          <div className="border-b px-5 py-4 sm:px-6">
            {title && (
              <h2 className="text-base font-semibold leading-tight tracking-tight sm:text-lg">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{description}</p>
            )}
            {headerSlot}
          </div>
        )}

        {!hideCloseButton && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-muted-foreground opacity-70 ring-offset-background transition-opacity hover:bg-accent hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
          {children}
        </div>

        {footer && (
          <div className="flex flex-col-reverse gap-2 border-t bg-muted/30 px-5 py-3 sm:flex-row sm:justify-end sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
