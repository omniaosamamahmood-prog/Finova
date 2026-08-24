import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import "./i18n";
import App from "./App.tsx";
import { ToastProvider } from "./components/ui/Toast.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import GoogleAuthProvider from "./components/auth/GoogleAuthProvider.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <GoogleAuthProvider>
            <App />
          </GoogleAuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
