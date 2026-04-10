import { useState, useCallback } from 'react';
import { Toast, type ToastProps } from '../components/ui/toast';

export function useToast() {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const toast: ToastProps & { id: string } = {
      id,
      message,
      type,
      duration,
      onClose: () => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      },
    };
    setToasts((prev) => [...prev, toast]);
  }, []);

  const ToastContainer = () => (
    <div className="pointer-events-none fixed right-4 top-24 z-[80] flex w-full max-w-sm flex-col gap-3 sm:right-6 sm:top-28">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} />
        </div>
      ))}
    </div>
  );

  return { showToast, ToastContainer };
}
