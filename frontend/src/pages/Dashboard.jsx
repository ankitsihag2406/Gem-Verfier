import AppShell from "@/components/AppShell";
import { Link } from "react-router-dom";
import {
  MOCK_TENDERS, MOCK_BIDS, formatDate, getComplianceSummary, formatProcessingTime,
} from "@/lib/mockData";
import {
  CheckCircle2, XCircle, AlertTriangle, ArrowRight, Plus,
  FileText, Clock, Activity, Layers, Download, AlertOctagon,
} from "lucide-react";

function getDashboardStats() {
  const completed = MOCK_BIDS.filter(b => b.status === "COMPLETE");
  const verified = completed.filter(b => b.overallCompliance === "COMPLIANT").length;
  const nonComp  = completed.filter(b => b.overallCompliance === "NON_COMPLIANT").length;
  const review   = completed.filter(b => b.overallCompliance === "PARTIAL").length;
  const failed   = MOCK_BIDS.filter(b => b.status === "FAILED").length;
  const totalReqs = completed.reduce((acc, b) => acc + getComplianceSummary(b.parameters).aiVerified, 0);
  const timeBids = completed.filter(b => b.processingTimeSec);
  const avgTime = timeBids.length ? Math.round(timeBids.reduce((a, b) => a + b.processingTimeSec, 0) / timeBids.length) : 0;
  const now = new Date();
  return {
    verified, nonComp, review, failed, totalReqs, avgTime,
    syncTime: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " IST",
    syncDate: now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
  };
}

function ConfPill({ value }) {
  if (value === null) return <span style={{ color: "var(--text-muted)", fontSize: 12 }}>—</span>;
  const pct = Math.round(value * 100);
  const color  = value >= 0.85 ? "#15803D" : value >= 0.70 ? "#B45309" : "#DC2626";
  const bg     = value >= 0.85 ? "#F0FDF4" : value >= 0.70 ? "#FFFBEB" : "#FEF2F2";
  const border = value >= 0.85 ? "#BBF7D0" : value >= 0.70 ? "#FDE68A" : "#FECACA";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color, background: bg, border: `1px solid ${border}`, padding: "2px 8px", borderRadius: 10 }}>
      {value < 0.80 && <AlertTriangle size={10} />}{pct}%
    </span>
  );
}

export default function Dashboard() {
  const stats = getDashboardStats();

  return (
    <AppShell>
      <div className="page-bar">
        <div>
          <div className="page-title">Compliance Dashboard</div>
          <div className="breadcrumb" style={{ marginTop: 2 }}>
            <span>Home</span><span className="breadcrumb-sep">/</span><span>Dashboard</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost btn-sm"><Download size={13} /> Download Audit Report</button>
          <Link to="/tenders/new" className="btn btn-orange btn-sm"><Plus size={14} /> New Tender</Link>
        </div>
      </div>

      <div className="page-content">
        {/* Overview strip */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", background: "#F8FAFC", border: "1px solid var(--border-light)", borderLeft: "4px solid var(--gem-navy)", borderRadius: 6, padding: "12px 18px", marginBottom: 18, gap: 24, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gem-navy)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Verification Overview</div>
            <div style={{ fontSize: 13.5, color: "var(--text-body)", lineHeight: 1.5 }}>
              <strong style={{ color: "var(--text-heading)" }}>{MOCK_TENDERS.length} tenders</strong> active ·{" "}
              <strong style={{ color: "var(--text-heading)" }}>{MOCK_BIDS.length} bid documents</strong> submitted ·{" "}
              <strong style={{ color: "var(--gem-navy)" }}>{stats.totalReqs} requirements</strong> AI-evaluated ·{" "}
              Avg processing: <strong style={{ color: "var(--gem-navy)" }}>{formatProcessingTime(stats.avgTime)}</strong>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, borderLeft: "1px solid var(--border-light)", paddingLeft: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#15803D" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#15803D" }}>AI Verification Engine · Operational</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Last synchronised: {stats.syncDate}, {stats.syncTime}</div>
          </div>
        </div>

        {/* Status cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 18 }}>
          {[
            { label: "Requirements Verified", value: stats.verified, sub: "All parameters satisfied",      icon: CheckCircle2,  color: "#15803D", bg: "#F0FDF4", border: "#BBF7D0" },
            { label: "Non-Compliant Bids",    value: stats.nonComp,  sub: "Requirement failures detected", icon: XCircle,       color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
            { label: "Human Review Required", value: stats.review,   sub: "Low-confidence evidence",       icon: AlertTriangle, color: "#B45309", bg: "#FFFBEB", border: "#FDE68A" },
            { label: "Upload Failures",       value: stats.failed,   sub: "Re-submission required",        icon: AlertOctagon,  color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB" },
          ].map(({ label, value, sub, icon: Icon, color, bg, border }) => (
            <div key={label} style={{ background: "#fff", border: "1px solid var(--border-light)", borderRadius: 7, padding: "14px 16px", borderTop: `3px solid ${color}` }}>
              <div style={{ marginBottom: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 6, background: bg, border: `1px solid ${border}`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={15} color={color} />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1, marginBottom: 4 }}>{String(value).padStart(2, "0")}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-heading)", marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Two-column */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <div className="card-header-title"><Activity size={15} /> Bid Verification Results</div>
              <Link to="/tenders" style={{ fontSize: 12.5, color: "var(--gem-navy)", fontWeight: 600 }}>All Tenders →</Link>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bidder</th><th>Document</th><th>Submitted</th>
                  <th style={{ textAlign: "center" }}>Avg Confidence</th>
                  <th>AI Finding</th><th>Result</th><th></th>
                </tr>
              </thead>
              <tbody>
                {MOCK_BIDS.map(bid => {
                  const isFailed = bid.status === "FAILED";
                  const isReview = bid.overallCompliance === "PARTIAL";
                  const summary  = getComplianceSummary(bid.parameters);
                  let resultColor = "#6B7280", resultLabel = "Processing", ResultIcon = Clock;
                  if (bid.overallCompliance === "COMPLIANT")     { resultColor = "#15803D"; resultLabel = "Compliant";     ResultIcon = CheckCircle2; }
                  if (bid.overallCompliance === "NON_COMPLIANT") { resultColor = "#DC2626"; resultLabel = "Non-Compliant"; ResultIcon = XCircle; }
                  if (bid.overallCompliance === "PARTIAL")       { resultColor = "#B45309"; resultLabel = "Review";        ResultIcon = AlertTriangle; }
                  if (isFailed)                                  { resultColor = "#6B7280"; resultLabel = "Upload Failed"; ResultIcon = AlertOctagon; }
                  let finding = "—";
                  if (!isFailed && summary.aiVerified > 0) {
                    if (bid.overallCompliance === "COMPLIANT") finding = `${summary.compliant}/${summary.aiVerified} requirements satisfied`;
                    else if (bid.overallCompliance === "NON_COMPLIANT") finding = `${summary.nonCompliant} failed${summary.flagged > 0 ? ` · ${summary.flagged} missing` : ""}`;
                    else finding = `${summary.flagged} low-confidence · manual review`;
                  }
                  if (isFailed) finding = "Text extraction failed — re-upload required";
                  return (
                    <tr key={bid.id} style={{ opacity: isFailed ? 0.8 : 1 }}>
                      <td>
                        <div style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: 13 }}>{bid.companyName}</div>
                        {bid.processingTimeSec && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}><Clock size={9} style={{ display: "inline", marginRight: 3 }} />Processed in {formatProcessingTime(bid.processingTimeSec)}</div>}
                      </td>
                      <td>
                        <span style={{ fontSize: 11.5, color: "var(--text-muted)", fontFamily: "monospace" }}>{bid.pdfName}</span>
                        {isFailed && <div style={{ fontSize: 10.5, color: "#DC2626", fontWeight: 600, marginTop: 2 }}><AlertOctagon size={9} /> DPI &lt; 150 — illegible scan</div>}
                      </td>
                      <td><span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{formatDate(bid.uploadedAt)}</span></td>
                      <td style={{ textAlign: "center" }}><ConfPill value={bid.avgConfidence} /></td>
                      <td><span style={{ fontSize: 12, color: isFailed ? "#DC2626" : isReview ? "#B45309" : "var(--text-body)" }}>{finding}</span></td>
                      <td>
                        {isReview ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#B45309", background: "#FFFBEB", border: "1px solid #FDE68A", padding: "2px 8px", borderRadius: 4 }}>
                            <AlertTriangle size={11} /> Manual Review
                          </span>
                        ) : (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 700, color: resultColor }}>
                            <ResultIcon size={13} />{resultLabel}
                          </span>
                        )}
                      </td>
                      <td>
                        {!isFailed ? (
                          <Link to={`/bids/${bid.id}`} className="row-action">View Evidence <ArrowRight size={11} /></Link>
                        ) : (
                          <span style={{ fontSize: 12, color: "#fff", fontWeight: 600, background: "#DC2626", padding: "3px 10px", borderRadius: 4, cursor: "pointer" }}>Re-upload</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Right panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="card">
              <div className="card-header">
                <div className="card-header-title"><FileText size={15} /> Active Tenders</div>
              </div>
              {MOCK_TENDERS.map(t => {
                const pct = t.totalBids > 0 ? Math.round((t.compliantBids / t.totalBids) * 100) : 0;
                const daysLeft = Math.max(0, Math.ceil((new Date(t.deadline) - Date.now()) / 86400000));
                return (
                  <div key={t.id} style={{ padding: "11px 14px", borderBottom: "1px solid var(--border-light)" }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-heading)", marginBottom: 3, lineHeight: 1.3 }}>{t.name}</div>
                    <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--text-muted)", marginBottom: 7 }}>
                      <span className="mono">{t.tenderRef}</span>
                      <span>{daysLeft > 0 ? `${daysLeft}d remaining` : "Deadline passed"}</span>
                      <span>{t.totalBids} bids</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                      <span style={{ color: "var(--text-secondary)" }}>{t.compliantBids}/{t.totalBids} compliant</span>
                      <span style={{ fontWeight: 700, color: "#15803D" }}>{pct}%</span>
                    </div>
                    <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%`, background: "#15803D" }} /></div>
                    <div style={{ marginTop: 7 }}><Link to={`/tenders/${t.id}`} className="row-action" style={{ fontSize: 11.5 }}>Open Verification →</Link></div>
                  </div>
                );
              })}
            </div>
            <div style={{ padding: "11px 14px", background: "#F8FAFC", border: "1px solid var(--border-light)", borderLeft: "3px solid var(--gem-navy)", borderRadius: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--gem-navy)", marginBottom: 3 }}>
                <Clock size={11} style={{ display: "inline", marginRight: 5 }} />Audit Trail Active
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 8 }}>
                All AI verification events are immutably logged. Every extraction decision is traceable.
              </div>
              <Link to="/activity" style={{ fontSize: 12, color: "var(--gem-navy)", fontWeight: 600 }}>View Full Audit Log →</Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
