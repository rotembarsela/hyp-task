import { ReactNode, useState } from "react";
import { ToastContext } from "./ToastContext";
import Toast from "../components/Toast";

interface ToastMessage {
  id: number;
  title?: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    title: string | undefined,
    messages: string | string[],
    type: "success" | "error" | "warning" | "info" = "info"
  ) => {
    const messageBody = Array.isArray(messages)
      ? messages.join(", ")
      : messages;

    setToasts((prevToasts) => [
      ...prevToasts,
      { id: Date.now() + Math.random(), title, message: messageBody, type },
    ]);
  };

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            body={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
