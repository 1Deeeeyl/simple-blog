import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  to?: string;          // if present → Link
  onClick?: () => void; // if present → button action
  variant?: "primary" | "danger";
};

export default function Button({
  children,
  to,
  onClick,
  variant = "primary",
}: ButtonProps) {
  const baseStyles =
    "p-1.5 rounded-md font-medium text-white inline-flex items-center justify-center";

  const variantStyles =
    variant === "danger"
      ? "bg-red-600"
      : "bg-blue-600";

  const className = `${baseStyles} ${variantStyles}`;

  // If `to` exists → navigation button
  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  // Otherwise → normal button
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
