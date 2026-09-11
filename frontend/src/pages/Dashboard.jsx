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
  const nonComp = completed.filter(b => b.overallCompliance === "NON_COMPLIANT").length;
  const review = completed.filter(b => b.overallCompliance === "PARTIAL").length;
  const failed = MOCK_BIDS.filter(b => b.status === "FAILED").length;
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
  const color = value >= 0.85 ? "#15803D" : value >= 0.70 ? "#B45309" : "#DC2626";
  const bg = value >= 0.85 ? "#F0FDF4" : value >= 0.70 ? "#FFFBEB" : "#FEF2F2";
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
      <div style={{ background: "var(--bg-gradient-hero)", padding: "40px 32px 60px", position: "relative" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: "var(--gem-navy)", marginBottom: 8, fontFamily: "var(--heading)" }}>
            Welcome to GeM Verification
          </h1>


          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 20 }}>
            <Link to="/tenders/new" className="btn btn-primary" style={{ padding: "12px 28px", fontSize: 15 }}>
              <Plus size={18} /> New Tender
            </Link>

          </div>
        </div>
      </div>

      <div className="page-content" style={{ marginTop: "-40px", position: "relative", zIndex: 10 }}>
        {/* Overview strip */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", background: "#fff", borderRadius: 12, padding: "16px 24px", marginBottom: 24, gap: 24, alignItems: "center", boxShadow: "var(--shadow-card)" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gem-navy)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Verification Overview</div>
            <div style={{ fontSize: 14, color: "var(--text-body)", lineHeight: 1.5 }}>
              <strong style={{ color: "var(--text-heading)" }}>{MOCK_TENDERS.length} tenders</strong> active ·{" "}
              <strong style={{ color: "var(--text-heading)" }}>{MOCK_BIDS.length} bid documents</strong> submitted ·{" "}
              <strong style={{ color: "var(--gem-navy)" }}>{stats.totalReqs} requirements</strong> AI-evaluated ·{" "}
              Avg processing: <strong style={{ color: "var(--gem-navy)" }}>{formatProcessingTime(stats.avgTime)}</strong>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, borderLeft: "1px solid var(--border-light)", paddingLeft: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#107C41" }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#107C41" }}>AI Verification Engine · Online</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Last synchronised: {stats.syncDate}, {stats.syncTime}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Verified", value: stats.verified, sub: "All params satisfied", icon: CheckCircle2, color: "var(--status-green)" },
            { label: "Non-Compliant", value: stats.nonComp, sub: "Requirement failures", icon: XCircle, color: "var(--status-red)" },
            { label: "Human Review", value: stats.review, sub: "Low-confidence evidence", icon: AlertTriangle, color: "var(--status-amber)" },
            { label: "Failures", value: stats.failed, sub: "Re-submission required", icon: AlertOctagon, color: "var(--status-grey)" },
          ].map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} style={{
              background: "#fff", borderRadius: 16, padding: "20px",
              boxShadow: "var(--shadow-card)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
              transition: "transform 0.2s ease, box-shadow 0.2s ease", cursor: "default"
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-hover)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow-card)"; }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%", background: "var(--bg-badge)",
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16
              }}>
                <Icon size={24} color={color} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-heading)", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--gem-navy)", lineHeight: 1 }}>{String(value).padStart(2, "0")}</div>
            </div>
          ))}
        </div>

        {/* Two-column */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
          <div className="card" style={{ border: "none", borderRadius: 16 }}>
            <div className="card-header" style={{ borderBottom: "none", padding: "20px 24px 10px" }}>
              <div className="card-header-title" style={{ fontSize: 16 }}><Activity size={18} /> Bid Verification Results</div>
              <Link to="/tenders" style={{ fontSize: 13.5, color: "var(--gem-navy)", fontWeight: 600 }}>All Tenders →</Link>
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
                  const summary = getComplianceSummary(bid.parameters);
                  let resultColor = "#6B7280", resultLabel = "Processing", ResultIcon = Clock;
                  if (bid.overallCompliance === "COMPLIANT") { resultColor = "#15803D"; resultLabel = "Compliant"; ResultIcon = CheckCircle2; }
                  if (bid.overallCompliance === "NON_COMPLIANT") { resultColor = "#DC2626"; resultLabel = "Non-Compliant"; ResultIcon = XCircle; }
                  if (bid.overallCompliance === "PARTIAL") { resultColor = "#B45309"; resultLabel = "Review"; ResultIcon = AlertTriangle; }
                  if (isFailed) { resultColor = "#6B7280"; resultLabel = "Upload Failed"; ResultIcon = AlertOctagon; }
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
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="card" style={{ border: "none", borderRadius: 16 }}>
              <div className="card-header" style={{ borderBottom: "none", padding: "20px 24px 10px" }}>
                <div className="card-header-title" style={{ fontSize: 16 }}><FileText size={18} /> Active Tenders</div>
              </div>
              <div style={{ padding: "0 10px 10px" }}>
                {MOCK_TENDERS.map(t => {
                  const pct = t.totalBids > 0 ? Math.round((t.compliantBids / t.totalBids) * 100) : 0;
                  const daysLeft = Math.max(0, Math.ceil((new Date(t.deadline) - Date.now()) / 86400000));
                  return (
                    <div key={t.id} style={{ padding: "14px", margin: "8px", borderRadius: 12, border: "1px solid var(--border-light)", background: "var(--bg-row-alt)" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", marginBottom: 6, lineHeight: 1.3 }}>{t.name}</div>
                      <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
                        <span className="mono">{t.tenderRef}</span>
                        <span>{daysLeft > 0 ? `${daysLeft}d remaining` : "Deadline passed"}</span>
                        <span>{t.totalBids} bids</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                        <span style={{ color: "var(--text-secondary)" }}>{t.compliantBids}/{t.totalBids} compliant</span>
                        <span style={{ fontWeight: 700, color: "var(--status-green)" }}>{pct}%</span>
                      </div>
                      <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%`, background: "var(--status-green)" }} /></div>
                      <div style={{ marginTop: 12 }}><Link to={`/tenders/${t.id}`} className="row-action" style={{ fontSize: 13 }}>Open Verification →</Link></div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ padding: "20px 24px", background: "var(--bg-gradient-hero)", borderRadius: 16, boxShadow: "var(--shadow-sm)" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--gem-navy)", marginBottom: 6 }}>
                <Clock size={14} style={{ display: "inline", marginRight: 6 }} />Audit Trail Active
              </div>
              <div style={{ fontSize: 13, color: "var(--text-body)", lineHeight: 1.5, marginBottom: 12 }}>
                All AI verification events are immutably logged. Every extraction decision is traceable.
              </div>
              <Link to="/activity" className="btn btn-primary btn-sm" style={{ padding: "8px 16px" }}>View Full Audit Log</Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
