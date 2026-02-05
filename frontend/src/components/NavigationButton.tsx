import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface LinkButtonProps {
  to: string;
  children: ReactNode;
  active?: boolean;
  className?: string;
}

export default function NavigationButton({
  to,
  children,
  active = false,
  className = "",
}: LinkButtonProps) {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors";

  return (
    <Link
      to={to}
      className={`${baseClasses} ${
        active ? "text-blue-500" : "text-gray-700 hover:text-blue-500"
      } ${className}`}
    >
      {children}
    </Link>
  );
}
