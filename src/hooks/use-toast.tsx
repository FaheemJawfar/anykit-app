"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  title?: string;
  description: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (description: string, options?: Omit<Toast, "id" | "description">) => void;
  toasts: Toast[];
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (description: string, options?: Omit<Toast, "id" | "description">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const duration = options?.duration ?? 4000;

      const newToast: Toast = {
        id,
        description,
        type: options?.type ?? "info",
        title: options?.title,
        duration,
      };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toast, toasts, dismiss }), [toast, toasts, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToasterContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// Visual layout container for toasts
function ToasterContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => {
        let Icon = Info;
        let iconColor = "text-blue-500 bg-blue-500/10";
        if (t.type === "success") {
          Icon = CheckCircle;
          iconColor = "text-green-500 bg-green-500/10";
        } else if (t.type === "error") {
          Icon = AlertCircle;
          iconColor = "text-red-500 bg-red-500/10";
        } else if (t.type === "warning") {
          Icon = AlertTriangle;
          iconColor = "text-amber-500 bg-amber-500/10";
        }

        return (
          <div
            key={t.id}
            className="pointer-events-auto flex gap-3 p-4 rounded-2xl border border-border/40 bg-background/95 backdrop-blur-md shadow-xl shadow-black/5 animate-in slide-in-from-bottom duration-300 transition-all select-none"
            role="alert"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0 pr-2">
              {t.title && <p className="text-xs font-bold text-foreground mb-0.5">{t.title}</p>}
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                {t.description}
              </p>
            </div>

            <button
              onClick={() => dismiss(t.id)}
              className="text-muted-foreground/60 hover:text-foreground transition-colors h-6 w-6 rounded-lg flex items-center justify-center hover:bg-muted shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
