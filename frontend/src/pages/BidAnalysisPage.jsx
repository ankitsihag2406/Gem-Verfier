import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import AppShell from "@/components/AppShell";
import ParameterTable from "@/components/ParameterTable";
import EvidencePanel from "@/components/EvidencePanel";
import { getBidById, getTenderById, getComplianceSummary, formatProcessingTime } from "@/lib/mockData";
import { useNotifications } from "@/lib/NotificationContext";
import {
  ArrowLeft, Download, Brain, FileText, Building2,
  CheckCircle2, XCircle, AlertTriangle, Hash, Eye, EyeOff, Shield, X,
} from "lucide-react";

/* ── Override Decision Modal ───────────────────────────────────────────── */
function OverrideModal({ bid, onConfirm, onClose }) {
  const [decision, setDecision] = useState("COMPLIANT");
  const [reason, setReason] = useState("");
  const [officer, setOfficer] = useState("");

  const decisions = [
    { value: "COMPLIANT", label: "Compliant", color: "#15803D", bg: "#F0FDF4", border: "#BBF7D0", Icon: CheckCircle2 },
    { value: "NON_COMPLIANT", label: "Non-Compliant", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", Icon: XCircle },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 14, width: 480,
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        overflow: "hidden", animation: "fadeIn 0.2s ease",
      }}>
        {/* Header */}
        <div style={{
          padding: "18px 24px", borderBottom: "1px solid var(--border-light)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: "#FFFBEB", border: "1px solid #FDE68A",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Shield size={16} color="#B45309" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-heading)" }}>Override AI Decision</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 1 }}>{bid.companyName}</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "1px solid var(--border-light)",
            cursor: "pointer", padding: 5, borderRadius: 6, display: "flex",
            color: "var(--text-secondary)",
          }}>
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="alert alert-warn" style={{ margin: 0 }}>
            <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: 12.5, lineHeight: 1.6 }}>
              This will permanently override the AI&apos;s compliance verdict. This action will be recorded in the audit log.
            </div>
          </div>

          {/* Decision select */}
          <div>
            <label className="field-label">New Compliance Decision</label>
            <div style={{ display: "flex", gap: 10 }}>
              {decisions.map(d => (
                <button key={d.value} onClick={() => setDecision(d.value)} style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "12px 16px", borderRadius: 8, cursor: "pointer",
                  fontFamily: "inherit", fontSize: 13.5, fontWeight: 700,
                  color: decision === d.value ? d.color : "var(--text-secondary)",
                  background: decision === d.value ? d.bg : "#F9FAFB",
                  border: `2px solid ${decision === d.value ? d.color : "var(--border-light)"}`,
                  transition: "all 0.15s",
                }}>
                  <d.Icon size={16} />
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Officer name */}
          <div>
            <label className="field-label">Reviewing Officer Name</label>
            <input
              className="input-field"
              placeholder="e.g. Dr. Rajesh Sharma, IAS"
              value={officer}
              onChange={e => setOfficer(e.target.value)}
            />
          </div>

          {/* Reason */}
          <div>
            <label className="field-label">Justification / Reason</label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Provide the rationale for overriding the AI decision…"
              value={reason}
              onChange={e => setReason(e.target.value)}
              style={{ resize: "vertical" }}
            />
            <div className="field-hint">This will be included in the compliance audit report.</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 24px", borderTop: "1px solid var(--border-light)",
          display: "flex", justifyContent: "flex-end", gap: 10,
          background: "#F9FAFB",
        }}>
          <button onClick={onClose} className="btn btn-ghost btn-sm">Cancel</button>
          <button
            onClick={() => onConfirm({ decision, reason, officer })}
            disabled={!reason.trim() || !officer.trim()}
            className="btn btn-primary btn-sm"
            style={{
              opacity: (!reason.trim() || !officer.trim()) ? 0.5 : 1,
              pointerEvents: (!reason.trim() || !officer.trim()) ? "none" : "auto",
            }}
          >
            <Shield size={13} /> Confirm Override
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Fake PDF Viewer (unchanged logic, just used inside a card now) ─────── */
function FakePdfViewer({ bid, highlightQuote }) {
  if (!bid) return null;

  const sections = [
    {
      title: "BID SUBMISSION DOCUMENT",
      content: `Tender Reference: GEM/2024/B/4529187\nBidder: ${bid.companyName}\n\nThis document constitutes the formal bid submission for the above-referenced tender floated on the Government e-Marketplace (GeM) portal as per the provisions of the General Financial Rules (GFR) 2017.`,
    },
    {
      title: "SECTION 1 — COMPANY PROFILE",
      content: `Registered Office: 4th Floor, Tower-B, Cyber Hub, Gurugram, Haryana – 122002\nCIN: U72200HR2016PTC062418 | GSTIN: 06AABCA1234M1Z5 | PAN: AABCA1234M\n\n${bid.parameters.find(p => p.id === "p2")?.exactQuote ?? "The company has significant experience in IT infrastructure deployments."}`,
    },
    {
      title: "SECTION 2 — FINANCIAL CREDENTIALS",
      content: bid.parameters.find(p => p.id === "p3")?.exactQuote ?? "Financial details as per tender requirements.",
    },
    {
      title: "SECTION 3 — EARNEST MONEY DEPOSIT",
      content: bid.parameters.find(p => p.id === "p1")?.exactQuote ?? "EMD has been deposited as per tender requirements.",
    },
    {
      title: "SECTION 4 — TECHNICAL COMPLIANCE",
      content: "The bidder confirms compliance with all technical specifications outlined in the tender document. All equipment supplied shall conform to BIS standards and carry valid ISI marks where applicable.",
    },
    {
      title: "SECTION 5 — STATUTORY DECLARATION",
      content: "I/We hereby declare that:\n(a) The information provided in this bid is true and accurate.\n(b) The company is not blacklisted by any Central/State Government department.\n(c) All supporting documents enclosed are genuine and valid.\n\nPlace: New Delhi | Date: 22nd August 2024",
    },
  ];

  return (
    <div style={{ background: "#E8EDF2", borderRadius: "0 0 12px 12px", padding: "24px 28px" }}>
      <div style={{
        background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        borderRadius: 4, padding: "44px 52px",
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: 13.5, lineHeight: 1.85, color: "#1a1a1a",
      }}>
        <div style={{ borderBottom: "3px solid #003366", paddingBottom: 18, marginBottom: 24, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#003366" }}>{bid.companyName}</div>
            <div style={{ fontSize: 11.5, color: "#555", marginTop: 4 }}>CIN: U72200HR2016PTC062418 · GSTIN: 06AABCA1234M1Z5</div>
          </div>
          <div style={{ padding: "4px 12px", background: "#DC2626", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 3, letterSpacing: "0.08em" }}>CONFIDENTIAL</div>
        </div>
        <div style={{ textAlign: "center", marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid #E5E7EB" }}>
          <div style={{ fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 5 }}>GOVERNMENT OF INDIA · Government e-Marketplace (GeM)</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#003366", marginBottom: 6 }}>BID SUBMISSION DOCUMENT</div>
          <div style={{ fontSize: 12.5, color: "#444" }}>Tender Reference: GEM/2024/B/4529187</div>
        </div>
        {sections.map((sec, idx) => {
          const isHighlighted = highlightQuote && sec.content.includes(highlightQuote.substring(0, 50));
          return (
            <div key={idx} id={isHighlighted ? "highlighted-quote" : undefined} style={{ marginBottom: 24, background: isHighlighted ? "#FFFBEB" : "transparent", borderLeft: isHighlighted ? "4px solid #F59E0B" : "none", padding: isHighlighted ? "12px 16px" : "0", borderRadius: isHighlighted ? "0 6px 6px 0" : 0, transition: "background 0.3s" }}>
              {isHighlighted && <div style={{ fontSize: 10, fontWeight: 700, color: "#B45309", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8, fontFamily: "Noto Sans, sans-serif" }}>◉ AI EVIDENCE MATCH</div>}
              <div style={{ fontSize: 11, fontWeight: 700, color: "#003366", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, fontFamily: "Noto Sans, sans-serif" }}>{sec.title}</div>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.85 }}>{sec.content}</div>
              {idx < sections.length - 1 && <div style={{ marginTop: 20, borderBottom: "1px solid #E5E7EB" }} />}
            </div>
          );
        })}
        <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid #E5E7EB", textAlign: "center", fontSize: 11, color: "#999" }}>
          Page 1 of 6 · {bid.pdfName}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────────────── */
export default function BidAnalysisPage() {
  const { id } = useParams();
  const bid = getBidById(id);
  if (!bid) return <Navigate to="/" replace />;

  const tender = getTenderById(bid.tenderId);
  const { markBidViewed } = useNotifications();
  const [selectedParam, setSelectedParam] = useState(null);
  const [showPdf, setShowPdf] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [override, setOverride] = useState(null); // { decision, reason, officer, timestamp }
  const summary = getComplianceSummary(bid.parameters);

  // Mark this bid as viewed so sidebar badge decrements
  useEffect(() => { markBidViewed(id); }, [id, markBidViewed]);

  const effectiveCompliance = override ? override.decision : bid.overallCompliance;
  const overallColor = effectiveCompliance === "COMPLIANT" ? "#15803D"
    : effectiveCompliance === "NON_COMPLIANT" ? "#DC2626" : "#B45309";
  const OverallIcon = effectiveCompliance === "COMPLIANT" ? CheckCircle2
    : effectiveCompliance === "NON_COMPLIANT" ? XCircle : AlertTriangle;

  const handleOverrideConfirm = ({ decision, reason, officer }) => {
    bid.overallCompliance = decision; // mutate in-memory mock
    setOverride({
      decision,
      reason,
      officer,
      timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      previousDecision: "PARTIAL",
    });
    setShowOverrideModal(false);
  };

  const handleSelectParam = (param) => {
    setSelectedParam(param);
    setTimeout(() => {
      document.getElementById("evidence-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <AppShell>
      {/* ── Page Header Bar ─────────────────────────────────────────── */}
      <div className="page-bar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link to={`/tenders/${bid.tenderId}`} style={{
            display: "flex", alignItems: "center", gap: 6,
            color: "var(--text-secondary)", fontSize: 13, fontWeight: 500,
            textDecoration: "none",
          }}>
            <ArrowLeft size={15} /> Back
          </Link>
          <span style={{ color: "var(--text-muted)" }}>/</span>
          <Building2 size={14} color="var(--text-muted)" />
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)" }}>{bid.companyName}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {!override && bid.overallCompliance === "PARTIAL" && (
            <button
              onClick={() => setShowOverrideModal(true)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "5px 12px", fontSize: 12, fontWeight: 700,
                background: "#B45309", color: "#fff", border: "none",
                borderRadius: 5, cursor: "pointer",
              }}
            >
              ✎ Override AI Decision
            </button>
          )}
          {override && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "4px 12px", fontSize: 11.5, fontWeight: 700,
              background: "#EFF6FF", color: "var(--gem-navy)",
              border: "1px solid #BFDBFE", borderRadius: 5,
            }}>
              <Shield size={12} /> Manually Overridden
            </div>
          )}
          <button className="btn btn-ghost btn-sm"><Download size={13} /> Audit Report</button>
        </div>
      </div>

      <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* ── 1. Bid Overview Cards ───────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
          {/* Company info */}
          <div className="card" style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Bidder</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "#EFF6FF", border: "1px solid #BFDBFE",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Building2 size={18} color="var(--gem-navy)" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", lineHeight: 1.3 }}>{bid.companyName}</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{bid.pdfName}</div>
              </div>
            </div>
          </div>

          {/* Overall verdict */}
          <div className="card" style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
              {override ? "Manual Verdict" : "AI Verdict"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: overallColor + "14", border: `1px solid ${overallColor}30`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <OverallIcon size={20} color={overallColor} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: overallColor, lineHeight: 1.2 }}>
                  {effectiveCompliance.replace("_", " ")}
                </div>
                {override ? (
                  <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 2 }}>
                    Overridden by {override.officer}
                  </div>
                ) : bid.avgConfidence !== null && (
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                    Avg confidence: {Math.round(bid.avgConfidence * 100)}%
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Compliance summary */}
          <div className="card" style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Compliance Breakdown</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--status-green)", lineHeight: 1 }}>{summary.compliant}</div>
                <div style={{ fontSize: 10.5, color: "var(--status-green)", fontWeight: 600, marginTop: 4 }}>Passed</div>
              </div>
              <div style={{ width: 1, height: 32, background: "var(--border-light)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--status-red)", lineHeight: 1 }}>{summary.nonCompliant}</div>
                <div style={{ fontSize: 10.5, color: "var(--status-red)", fontWeight: 600, marginTop: 4 }}>Failed</div>
              </div>
              <div style={{ width: 1, height: 32, background: "var(--border-light)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--status-amber)", lineHeight: 1 }}>{summary.flagged}</div>
                <div style={{ fontSize: 10.5, color: "var(--status-amber)", fontWeight: 600, marginTop: 4 }}>Flagged</div>
              </div>
            </div>
          </div>

          {/* Processing info */}
          <div className="card" style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Processing</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "#F0FDF4", border: "1px solid #BBF7D0",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Brain size={18} color="#15803D" />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-heading)", lineHeight: 1.2 }}>
                  {bid.processingTimeSec ? formatProcessingTime(bid.processingTimeSec) : "—"}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                  {tender ? tender.tenderRef : "Processing time"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. AI Compliance Matrix (full width) ───────────────────── */}
        <div className="card">
          <div className="card-header">
            <div className="card-header-title">
              <Brain size={16} color="var(--gem-navy)" />
              AI Compliance Matrix
              {tender && (
                <span className="chip" style={{ marginLeft: 8 }}>
                  <Hash size={10} /> {tender.tenderRef}
                </span>
              )}
            </div>
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              Click any row to view the full evidence chain below
            </span>
          </div>
          <div className="card-body">
            <ParameterTable
              parameters={bid.parameters}
              onSelectParameter={handleSelectParam}
              selectedParamId={selectedParam?.id}
            />
          </div>
        </div>

        {/* ── 3. Evidence Panel (full width, shown when param selected) ── */}
        <div id="evidence-section">
          {selectedParam ? (
            <div className="card" style={{ overflow: "hidden" }}>
              <EvidencePanel
                parameter={selectedParam}
                onClose={() => setSelectedParam(null)}
              />
            </div>
          ) : (
            <div className="card" style={{
              padding: "40px 28px", textAlign: "center",
              display: "flex", flexDirection: "column", alignItems: "center",
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: "linear-gradient(135deg, #EFF6FF 0%, #F3F2F7 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 14, border: "1px solid #BFDBFE",
                boxShadow: "0 4px 12px rgba(42, 35, 89, 0.06)",
              }}>
                <AlertTriangle size={22} color="var(--gem-navy)" />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-heading)", marginBottom: 6 }}>No Parameter Selected</div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 340, lineHeight: 1.6 }}>
                Click on any AI-verified parameter in the compliance matrix above to view its full evidence chain, source quote, and confidence analysis.
              </p>
            </div>
          )}
        </div>

        {/* ── 4. Bid Document (collapsible, full width) ──────────────── */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div
            className="card-header"
            onClick={() => setShowPdf(v => !v)}
            style={{ cursor: "pointer", userSelect: "none" }}
          >
            <div className="card-header-title">
              <FileText size={16} color="var(--gem-navy)" />
              Bid Document
              <span className="chip" style={{ marginLeft: 4 }}>{bid.pdfName}</span>
              <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 400, marginLeft: 4 }}>6 pages</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setShowPdf(v => !v); }}
              className="btn btn-ghost btn-sm"
            >
              {showPdf ? <><EyeOff size={13} /> Hide Document</> : <><Eye size={13} /> View Document</>}
            </button>
          </div>
          {showPdf && (
            <FakePdfViewer bid={bid} highlightQuote={selectedParam?.exactQuote ?? null} />
          )}
        </div>

        {/* Override audit banner */}
        {override && (
          <div className="card" style={{ padding: "18px 22px", borderLeft: "4px solid var(--gem-navy)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: "#EFF6FF", border: "1px solid #BFDBFE",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Shield size={16} color="var(--gem-navy)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-heading)", marginBottom: 4 }}>
                  AI Decision Overridden
                </div>
                <div style={{ fontSize: 12.5, color: "var(--text-body)", lineHeight: 1.6, marginBottom: 6 }}>
                  {override.reason}
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 11.5, color: "var(--text-secondary)" }}>
                  <span><strong>Officer:</strong> {override.officer}</span>
                  <span><strong>Date:</strong> {override.timestamp}</span>
                  <span><strong>Previous:</strong> {override.previousDecision.replace("_", " ")}</span>
                  <span><strong>New:</strong> <span style={{ color: overallColor, fontWeight: 700 }}>{override.decision.replace("_", " ")}</span></span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Override Modal */}
      {showOverrideModal && (
        <OverrideModal
          bid={bid}
          onConfirm={handleOverrideConfirm}
          onClose={() => setShowOverrideModal(false)}
        />
      )}
    </AppShell>
  );
}
