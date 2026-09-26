/**
 * VIRENZA Accessible Toast System
 */

import { useState, useEffect } from 'react';

export interface ToastMessage {
  id: string;
  type: 'SUCCESS' | 'INFO' | 'WARNING' | 'EMERGENCY';
  title: string;
  message: string;
  duration?: number;
}

let toasts: ToastMessage[] = [];
const listeners = new Set<(t: ToastMessage[]) => void>();

export function toast(toastItem: Omit<ToastMessage, 'id'>) {
  const id = 'tst-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
  const fullToast: ToastMessage = { ...toastItem, id };
  toasts = [fullToast, ...toasts];
  listeners.forEach((fn) => fn([...toasts]));

  const dur = toastItem.duration ?? 4500;
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((fn) => fn([...toasts]));
  }, dur);
}

export function useToast() {
  const [activeToasts, setActiveToasts] = useState<ToastMessage[]>(toasts);

  useEffect(() => {
    listeners.add(setActiveToasts);
    return () => {
      listeners.delete(setActiveToasts);
    };
  }, []);

  const dismiss = (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((fn) => fn([...toasts]));
  };

  return { toasts: activeToasts, toast, dismiss };
}
