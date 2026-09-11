import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FileText, Activity, Settings,
  ChevronRight, Clock,
} from "lucide-react";
import { MOCK_TENDERS, MOCK_BIDS } from "@/lib/mockData";

const WORKSPACE_NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, getBadge: null },
  { href: "/tenders", label: "Tenders", icon: FileText, getBadge: () => MOCK_TENDERS.length },
  { href: "/activity", label: "Audit Log", icon: Activity, getBadge: () => MOCK_BIDS.length * 3 },
];

const ADMIN_NAV = [
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavLink({ href, label, icon: Icon, count, active }) {
  return (
    <Link
      to={href}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 16px",
        margin: "2px 10px",
        borderRadius: "8px",
        fontSize: 13.5, fontWeight: active ? 600 : 500,
        color: active ? "var(--gem-navy)" : "var(--text-body)",
        textDecoration: "none",
        background: active ? "var(--bg-badge)" : "transparent",
        transition: "all 0.15s ease",
      }}
    >
      <Icon size={16} color={active ? "var(--gem-navy)" : "var(--text-secondary)"} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{label}</span>
      {count !== undefined && (
        <span style={{
          fontSize: 11, fontWeight: 700, padding: "2px 8px",
          background: active ? "var(--gem-navy)" : "var(--border-light)",
          color: active ? "#fff" : "var(--text-secondary)",
          borderRadius: 12, lineHeight: 1.6,
        }}>
          {count}
        </span>
      )}
      {active && count === undefined && <ChevronRight size={14} color="var(--gem-navy)" style={{ opacity: 0.5 }} />}
    </Link>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 9.5, fontWeight: 700, color: "var(--text-muted)",
      textTransform: "uppercase", letterSpacing: "0.09em",
      padding: "14px 14px 5px",
    }}>
      {children}
    </div>
  );
}

export default function Sidebar() {
  const { pathname } = useLocation();
  const reviewCount = MOCK_BIDS.filter(b => b.overallCompliance === "PARTIAL").length;

  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: "#fff",
      borderRight: "1px solid var(--border-light)",
      display: "flex", flexDirection: "column",
      overflowY: "auto",
    }}>
      <nav style={{ paddingTop: 8, flex: 1 }}>
        <SectionLabel>Workspace</SectionLabel>
        {WORKSPACE_NAV.map(({ href, label, icon, getBadge }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <NavLink
              key={href} href={href} label={label} icon={icon}
              count={getBadge ? getBadge() : undefined}
              active={active}
            />
          );
        })}



        <SectionLabel>Administration</SectionLabel>
        {ADMIN_NAV.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href);
          return <NavLink key={href} href={href} label={label} icon={icon} active={active} />;
        })}
      </nav>

      <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border-light)" }}>
        <div style={{
          fontSize: 9.5, fontWeight: 700, color: "var(--text-muted)",
          textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8,
        }}>
          System Status
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 7, padding: "7px 10px",
          background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 5,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#15803D", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#15803D", lineHeight: 1.2 }}>
              Verification Engine
            </div>
            <div style={{ fontSize: 10.5, color: "#166534" }}>Online</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
