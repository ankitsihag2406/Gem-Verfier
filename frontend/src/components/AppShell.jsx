import Sidebar from "@/components/Sidebar";
import { Link } from "react-router-dom";

export default function AppShell({ children, noPadding }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>

      {/* Header */}
      <header style={{
        flexShrink: 0, height: 60,
        background: "var(--gem-navy)", color: "#fff",
        display: "flex", alignItems: "center", gap: 16,
        padding: "0 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        zIndex: 100,
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <img
            src="/logo.png"
            alt="GeM Bid Verifier Logo"
            style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0, objectFit: "cover" }}
          />
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "-0.2px", lineHeight: 1.2 }}>
              GeM Bid Compliance Verification System
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.4px", marginTop: 1 }}>
              AI-Assisted Procurement Compliance · Government of India
            </div>
          </div>
        </Link>

        <div style={{ flex: 1 }} />

        <div style={{
          padding: "3px 10px",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 4,
          fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.8)",
          textTransform: "uppercase", letterSpacing: "0.06em",
        }}>
          Developed for GeM
        </div>

        <div style={{
          fontSize: 11, color: "rgba(255,255,255,0.75)",
          borderLeft: "1px solid rgba(255,255,255,0.2)",
          paddingLeft: 16, lineHeight: 1.5,
        }}>
          <div style={{ fontWeight: 700, color: "#fff" }}>Government e-Marketplace</div>
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
