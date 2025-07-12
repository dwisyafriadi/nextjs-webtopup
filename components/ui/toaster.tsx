// components/ui/toaster.tsx
import { useEffect, useState } from "react";
import { X } from "lucide-react";
interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning";
}
let toastCount = 0;
const toasts: Toast[] = [];
const listeners: Array<(toasts: Toast[]) => void> = [];
function notifyListeners() {
  listeners.forEach((listener) => listener([...toasts]));
}
export function toast({
  title,
  description,
  variant = "default",
}: Omit<Toast, "id">) {
  const id = String(toastCount++);
  const toast: Toast = { id, title, description, variant };
  toasts.push(toast);
  notifyListeners();
  setTimeout(() => {
    const index = toasts.findIndex((t) => t.id === id);
    if (index > -1) {
      toasts.splice(index, 1);
      notifyListeners();
    }
  }, 4000);
}
export function Toaster() {
  const [toastList, setToastList] = useState<Toast[]>([]);
  useEffect(() => {
    listeners.push(setToastList);
    return () => {
      const index = listeners.indexOf(setToastList);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);
  const removeToast = (id: string) => {
    const index = toasts.findIndex((t) => t.id === id);
    if (index > -1) {
      toasts.splice(index, 1);
      notifyListeners();
    }
  };
  const getVariantStyles = (variant: Toast["variant"]) => {
    switch (variant) {
      case "success":
        return "bg-green-600 text-white";
      case "error":
        return "bg-red-600 text-white";
      case "warning":
        return "bg-yellow-600 text-white";
      default:
        return "bg-gray-800 text-white";
    }
  };
  return (
    <div className="fixed bottom-0 right-0 z-50 m-4 flex flex-col gap-2 sm:bottom-auto sm:top-0">
      {toastList.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 rounded-lg p-4 shadow-lg transition-all duration-300 ${getVariantStyles(
            toast.variant
          )}`}
        >
          <div className="flex-1">
            {toast.title && <p className="font-medium">{toast.title}</p>}
            {toast.description && (
              <p className="mt-1 text-sm opacity-90">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="rounded-md p-1 opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
