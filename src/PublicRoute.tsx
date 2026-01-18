import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type PublicRouteProps = {
  isAuthenticated: boolean;
  children: ReactNode;
};

export default function PublicRoute({ isAuthenticated, children }: PublicRouteProps) {
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}
