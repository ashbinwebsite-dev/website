"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

type ToastVariant = "success" | "error";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextType {
  toast: (opts: {
    title: string;
    description?: string;
    variant?: ToastVariant;
  }) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export const useToast = () => useContext(ToastContext);

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (opts: {
      title: string;
      description?: string;
      variant?: ToastVariant;
    }) => {
      const id = Math.random().toString(36).slice(2);
      const toast: Toast = {
        id,
        title: opts.title,
        description: opts.description,
        variant: opts.variant || "success",
      };
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    [],
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            toast={t}
            onDismiss={() => removeToast(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  const Icon = toast.variant === "success" ? CheckCircle2 : XCircle;

  return (
    <div
      className={`pointer-events-auto animate-slide-up rounded-[14px] border p-4 pr-12 shadow-lg backdrop-blur-sm min-w-[320px] max-w-[420px] relative ${
        toast.variant === "success"
          ? "bg-white border-[#dcefd8]"
          : "bg-white border-red-200"
      }`}
    >
      <button
        type="button"
        onClick={onDismiss}
        className="absolute top-3 right-3 text-foreground/30 hover:text-foreground/60 transition-colors"
      >
        <X size={16} />
      </button>
      <div className="flex items-start gap-3">
        <Icon
          size={20}
          className={
            toast.variant === "success" ? "text-[#A8E4A0]" : "text-rose-500"
          }
        />
        <div>
          <p className="text-sm font-medium text-foreground">{toast.title}</p>
          {toast.description && (
            <p className="text-xs text-foreground/60 mt-0.5">
              {toast.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
