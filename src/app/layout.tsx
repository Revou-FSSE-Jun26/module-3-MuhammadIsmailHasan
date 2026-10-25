import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { CartProvider } from "@/components/cart/CartProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { siteConfig } from "@/lib/site";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s · ${siteConfig.name}` },
  description: "A modern, animated Next.js storefront theme.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="overflow-x-clip font-sans">
        <AuthProvider>
          <ToastProvider>
            <CartProvider>{children}</CartProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
