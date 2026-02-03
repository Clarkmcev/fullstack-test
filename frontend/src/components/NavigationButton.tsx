import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface LinkButtonProps {
  to: string;
  children: ReactNode;
  active?: boolean;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function NavigationButton({
  to,
  children,
  active = false,
  variant = "primary",
  className = "",
}: LinkButtonProps) {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors";

  const variantClasses = {
    primary: active
      ? "bg-blue-500 text-white"
      : "text-gray-700 hover:bg-gray-100",
    secondary: active
      ? "bg-green-500 text-white"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300",
  };

  return (
    <Link
      to={to}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
