import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

type Props = {
  children: ReactNode;
  roleRequired: string;
};

/**
 * ponytail: this is a UI convenience, not a security boundary — localStorage is
 * user-writable. The API must do its own auth (backend/lib/auth.js exports
 * authenticateToken, but no route currently applies it).
 */
const ProtectedRoute = ({ children, roleRequired }: Props) => {
  const hasToken = Boolean(localStorage.getItem('token'));
  const role = localStorage.getItem('role');

  if (!hasToken || role !== roleRequired) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
