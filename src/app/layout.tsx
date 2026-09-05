import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GeM Bid Compliance Verifier | Government e-Marketplace",
  description: "AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement — SIH 2026 Problem #SIH26100",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
