import { createContext } from "react";

interface ToastContextType {
  addToast: (
    title: string | undefined,
    messages: string | string[],
    type?: "success" | "error" | "warning" | "info"
  ) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);
