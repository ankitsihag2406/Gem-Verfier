import AppShell from "@/components/AppShell";
import { Link } from "react-router-dom";
import { MOCK_TENDERS, getBidsByTender, formatCurrency } from "@/lib/mockData";
import { FileText, ArrowRight, Plus, Hash, Building2, Calendar } from "lucide-react";

function TenderCard({ tender }) {
  const bids = getBidsByTender(tender.id);
  const pct = tender.totalBids > 0 ? Math.round((tender.compliantBids / tender.totalBids) * 100) : 0;

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-light)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 7, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #BFDBFE", flexShrink: 0 }}>
            <FileText size={18} color="var(--gem-navy)" />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "#F0FDF4", color: "var(--status-green)", border: "1px solid #BBF7D0", textTransform: "uppercase", letterSpacing: "0.04em" }}>Active</span>
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-heading)", lineHeight: 1.4, marginBottom: 8 }}>{tender.name}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { icon: Hash,      text: tender.tenderRef },
            { icon: Building2, text: tender.department },
            { icon: Calendar,  text: `Deadline: ${tender.deadline}` },
          ].map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon size={11} color="var(--text-muted)" />
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-light)" }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
          Verification Requirements
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
          {[
            { lbl: "EMD",        val: formatCurrency(tender.emdRequired) },
            { lbl: "Turnover",   val: formatCurrency(tender.minAnnualTurnover) },
            { lbl: "Experience", val: `${tender.minExperienceYears} Yrs` },
          ].map(({ lbl, val }) => (
            <div key={lbl} style={{ padding: "7px 10px", background: "#F8FAFC", border: "1px solid var(--border-light)", borderRadius: 5 }}>
              <div style={{ fontSize: 10.5, color: "var(--text-muted)", fontWeight: 600, marginBottom: 2 }}>{lbl}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--gem-navy)" }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "10px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
          <span style={{ color: "var(--text-secondary)" }}>{tender.compliantBids}/{tender.totalBids} bids compliant</span>
          <span style={{ fontWeight: 700, color: "var(--status-green)" }}>{pct}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%`, background: "var(--status-green)" }} />
        </div>
      </div>

      <div style={{ padding: "0 16px 14px", marginTop: "auto" }}>
        <Link to={`/tenders/${tender.id}`} className="btn btn-primary btn-sm" style={{ width: "100%", justifyContent: "center" }}>
          View Bids <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

export default function TendersPage() {
  return (
    <AppShell>
      <div className="page-bar">
        <div>
          <div className="page-title">Tenders</div>
          <div className="breadcrumb" style={{ marginTop: 2 }}>
            <Link to="/">Home</Link><span className="breadcrumb-sep">/</span><span>Tenders</span>
          </div>
        </div>
        <Link to="/tenders/new" className="btn btn-orange btn-sm"><Plus size={14} /> Create Tender</Link>
      </div>
      <div className="page-content">
        <div style={{ marginBottom: 14, fontSize: 13, color: "var(--text-secondary)" }}>
          {MOCK_TENDERS.length} active tenders — Click a tender to view submitted bids and upload new ones.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {MOCK_TENDERS.map(t => <TenderCard key={t.id} tender={t} />)}
        </div>
      </div>
    </AppShell>
  );
}
