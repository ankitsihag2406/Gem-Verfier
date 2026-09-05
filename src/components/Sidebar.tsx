"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Activity, Settings,
  ChevronRight, Clock,
} from "lucide-react";
import { MOCK_TENDERS, MOCK_BIDS } from "@/lib/mockData";

const WORKSPACE_NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, badge: null },
  { href: "/tenders", label: "Tenders", icon: FileText, badgeFn: () => MOCK_TENDERS.length },
  { href: "/activity", label: "Audit Log", icon: Activity, badgeFn: () => MOCK_BIDS.length * 3 },
];

const ADMIN_NAV = [
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavLink({
  href, label, icon: Icon, count, active,
}: { href: string; label: string; icon: React.ElementType; count?: number; active: boolean }) {
  return (
    <Link
      href={href}
      style={{
        display: "flex", alignItems: "center", gap: 9,
        padding: "8px 14px",
        fontSize: 13, fontWeight: active ? 700 : 500,
        color: active ? "var(--gem-navy)" : "var(--text-body)",
        textDecoration: "none",
        borderLeft: `3px solid ${active ? "var(--gem-navy)" : "transparent"}`,
        background: active ? "#EFF6FF" : "transparent",
        transition: "background 0.1s",
      }}
    >
      <Icon size={15} color={active ? "var(--gem-navy)" : "var(--text-secondary)"} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{label}</span>
      {count !== undefined && (
        <span style={{
          fontSize: 10.5, fontWeight: 700, padding: "1px 6px",
          background: active ? "var(--gem-navy)" : "#E5E7EB",
          color: active ? "#fff" : "var(--text-secondary)",
          borderRadius: 10, lineHeight: 1.6,
        }}>
          {count}
        </span>
      )}
      {active && !count && <ChevronRight size={12} color="var(--gem-navy)" style={{ opacity: 0.4 }} />}
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
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
  const pathname = usePathname();

  const reviewCount = MOCK_BIDS.filter(b => b.overallCompliance === "PARTIAL").length;

  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: "#fff",
      borderRight: "1px solid var(--border-light)",
      display: "flex", flexDirection: "column",
      overflowY: "auto",
    }}>
      {/* Workspace nav */}
      <nav style={{ paddingTop: 8, flex: 1 }}>
        <SectionLabel>Workspace</SectionLabel>
        {WORKSPACE_NAV.map(({ href, label, icon, badgeFn }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <NavLink
              key={href} href={href} label={label} icon={icon}
              count={"badgeFn" in { href, label, icon, badgeFn } && badgeFn ? badgeFn() : undefined}
              active={active}
            />
          );
        })}

        {/* Verification Queue */}
        <Link
          href="/tenders"
          style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "8px 14px", fontSize: 13, fontWeight: 500,
            color: "var(--text-body)", textDecoration: "none",
            borderLeft: "3px solid transparent",
            background: "transparent",
          }}
        >
          <Clock size={15} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
          <span style={{ flex: 1 }}>Review Queue</span>
          {reviewCount > 0 && (
            <span style={{
              fontSize: 10.5, fontWeight: 700, padding: "1px 6px",
              background: "#FFFBEB", color: "#B45309",
              border: "1px solid #FDE68A",
              borderRadius: 10, lineHeight: 1.6,
            }}>
              {reviewCount}
            </span>
          )}
        </Link>

        <SectionLabel>Administration</SectionLabel>
        {ADMIN_NAV.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href);
          return (
            <NavLink key={href} href={href} label={label} icon={icon} active={active} />
          );
        })}
      </nav>

      {/* System status footer */}
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
