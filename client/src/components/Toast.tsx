import React, { useEffect } from "react";
import clsx from "clsx";

interface ToastProps {
  title?: string;
  body: string;
  onClose: () => void;
  type?: "success" | "error" | "warning" | "info";
}

const Toast: React.FC<ToastProps> = ({
  title,
  body,
  onClose,
  type = "info",
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "info":
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div
      className={clsx(
        "fixed top-4 right-4 text-white p-4 rounded shadow-lg",
        getBackgroundColor()
      )}
    >
      {title && <strong className="block text-lg">{title}</strong>}
      <div>
        <p className={clsx(title && "mt-2")}>{body}</p>
      </div>
    </div>
  );
};

export default Toast;
