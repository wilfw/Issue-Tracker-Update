import "@radix-ui/themes/styles.css";
import "./theme-config.css";
import "./globals.css";
import type { Metadata } from "next";
import { Container } from "@radix-ui/themes";
import NavBar from "./NavBar";
import AuthProvider from "./auth/Provider";
import QueryClientProvider from "./QueryClientProvider";
import { ThemeProvider } from "./ThemeProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "IssueTrack",
  description: "Modern issue tracking",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider>
          <AuthProvider>
            <ThemeProvider>
              <NavBar />
              <main className="p-5">
                <Container>{children}</Container>
              </main>
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: 'var(--bg-2)',
                    color: 'var(--text-1)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: '10px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  },
                }}
              />
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
