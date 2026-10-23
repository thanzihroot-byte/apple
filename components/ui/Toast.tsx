'use client';

import { CheckCircle2, Info, X } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export function Toast() {
  const { toast, dismissToast } = useStore();

  if (!toast) return null;

  const Icon = toast.tone === 'success' ? CheckCircle2 : Info;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-line bg-surface-container-lowest p-4 shadow-float sm:left-auto sm:right-6 sm:translate-x-0"
    >
      <div className="flex items-start gap-3">
        <Icon
          size={20}
          aria-hidden="true"
          className={toast.tone === 'success' ? 'mt-0.5 text-primary' : 'mt-0.5 text-secondary'}
        />
        <div className="flex-1">
          <p className="font-title-md text-title-md text-on-surface font-semibold leading-tight">{toast.title}</p>
          {toast.description && (
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">{toast.description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={dismissToast}
          aria-label="Dismiss notification"
          className="rounded-full p-1 text-outline transition-colors hover:bg-surface-container hover:text-on-surface"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
