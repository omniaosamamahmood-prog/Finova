import type { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

type GoogleAuthProviderProps = {
  children: ReactNode;
};

function GoogleAuthProvider({ children }: GoogleAuthProviderProps) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? "";

  if (!clientId) {
    return children;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  );
}

export default GoogleAuthProvider;
