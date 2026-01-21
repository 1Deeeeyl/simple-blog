import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type ButtonProps = {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
};

export default function Button({
  children,
  to,
  onClick,
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  const baseStyles =
    "p-2.5 rounded-md font-medium text-white inline-flex items-center justify-center h-fit w-fit";

  const variantMap: Record<string, string> = {
    danger: "bg-red-600 hover:bg-red-700",
    secondary: "bg-green-600 hover:bg-green-700",
    primary: "bg-blue-600 hover:bg-blue-700",
  };

  const variantStyles = variantMap[variant] || variantMap.primary;

  const disabledStyles = disabled ? "opacity-50 hover:bg-none cursor-not-allowed" : "";

  const className = `${baseStyles} ${variantStyles} ${disabledStyles} `;

  if (to) {
    if (disabled) {
      return (
        <button disabled={true} className={className}>
          {children}
        </button>
      );
    }
    return (
      <Link to={to} className={className + "cursor-pointer"}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={className + "cursor-pointer"}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
