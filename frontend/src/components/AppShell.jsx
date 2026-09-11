import Sidebar from "@/components/Sidebar";
import { Link } from "react-router-dom";

export default function AppShell({ children, noPadding }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>

      {/* Header */}
      <header style={{
        flexShrink: 0, height: 68,
        background: "var(--bg-white)", color: "var(--text-heading)",
        display: "flex", alignItems: "center", gap: 16,
        padding: "0 28px",
        boxShadow: "var(--shadow-nav)",
        zIndex: 100,
        borderBottom: "1px solid var(--border-light)"
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none" }}>
          <div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 17, fontWeight: 800, color: "var(--gem-navy)", letterSpacing: "-0.3px", lineHeight: 1.2 }}>
              <img src="/favicon.svg" alt="Logo" style={{ width: 20, height: 15 }} />
              GeM Bid Compliance Verification System
            </div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)", letterSpacing: "0.2px", marginTop: 2, fontWeight: 500 }}>
              AI-Assisted Procurement Compliance · Government of India
            </div>
          </div>
        </Link>

        <div style={{ flex: 1 }} />

        <div style={{
          padding: "4px 12px",
          background: "var(--bg-badge)",
          border: "1px solid var(--border-light)",
          borderRadius: "var(--radius-full)",
          fontSize: 10, fontWeight: 700, color: "var(--gem-navy)",
          textTransform: "uppercase", letterSpacing: "0.08em",
        }}>
          Developed for GeM
        </div>

        <div style={{
          fontSize: 11.5, color: "var(--text-secondary)",
          borderLeft: "1px solid var(--border-light)",
          paddingLeft: 18, lineHeight: 1.5,
        }}>
          <div style={{ fontWeight: 700, color: "var(--text-heading)" }}>Government e-Marketplace</div>
          <div>Ministry of Commerce &amp; Industry, GoI</div>
        </div>
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <Sidebar />
        <main style={{
          flex: 1, minWidth: 0,
          overflowY: noPadding ? "hidden" : "auto",
          background: noPadding ? undefined : "var(--bg-page)",
          display: noPadding ? "flex" : undefined,
          flexDirection: noPadding ? "column" : undefined,
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
