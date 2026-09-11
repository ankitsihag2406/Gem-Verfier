import { useState } from "react";
import StatusBadge from "./StatusBadge";
import {
  X, Brain, AlertTriangle, Hash, Quote, FileX,
  CheckCircle2, FileText, ChevronDown, ChevronUp, Shield,
} from "lucide-react";

function qualityIndicators(param) {
  const conf = param.confidenceScore ?? 0;
  return [
    { label: "Exact text match",          ok: !!param.exactQuote },
    { label: "Page location identified",   ok: !!param.pageNumber },
    { label: "Requirement satisfied",      ok: param.status === "COMPLIANT" },
    { label: "High extraction confidence", ok: conf >= 0.85 },
  ];
}

export default function EvidencePanel({ parameter, onClose }) {
  const [showReasoning, setShowReasoning] = useState(false);
  if (!parameter) return null;

  const conf      = parameter.confidenceScore;
  const isLow     = conf !== null && conf < 0.8;
  const confPct   = conf !== null ? Math.round(conf * 100) : null;
  const confColor = conf === null ? "var(--text-muted)"
    : conf >= 0.85 ? "#15803D" : conf >= 0.70 ? "#B45309" : "#DC2626";
  const confLabel = conf === null ? "N/A"
    : conf >= 0.85 ? "High confidence" : conf >= 0.70 ? "Medium confidence" : "Low confidence";
  const indicators = qualityIndicators(parameter);

  const decisionMap = {
    COMPLIANT:       { bg: "#F0FDF4", border: "#BBF7D0", color: "#15803D", label: "Requirement Satisfied",        Icon: CheckCircle2 },
    NON_COMPLIANT:   { bg: "#FEF2F2", border: "#FECACA", color: "#DC2626", label: "Requirement Failed",           Icon: X },
    FLAG_FOR_REVIEW: { bg: "#FFFBEB", border: "#FDE68A", color: "#B45309", label: "Requires Human Review",        Icon: AlertTriangle },
    NOT_FOUND:       { bg: "#FEF2F2", border: "#FECACA", color: "#DC2626", label: "Parameter Not Found",          Icon: FileX },
    PENDING:         { bg: "#F8FAFC", border: "#E5E7EB", color: "var(--text-secondary)", label: "Awaiting Manual Verification", Icon: Brain },
  };
  const decision = decisionMap[parameter.status] ?? decisionMap.PENDING;

  return (
    <div>
      {/* Header */}
      <div className="card-header">
        <div className="card-header-title">
          <Shield size={15} color="var(--gem-navy)" />
          Evidence Chain
          <span style={{ fontWeight: 400, color: "var(--text-secondary)", fontSize: 13, marginLeft: 4 }}>
            — {parameter.parameterName}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <StatusBadge status={parameter.status} size="sm" />
          <button onClick={onClose} className="btn btn-ghost btn-xs">
            <X size={13} /> Close
          </button>
        </div>
      </div>

      <div className="card-body">
        {/* Low confidence alert */}
        {isLow && parameter.status !== "NOT_FOUND" && (
          <div className="alert alert-warn" style={{ marginBottom: 20 }}>
            <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontWeight: 700, marginBottom: 3, fontSize: 13 }}>Human Review Required</div>
              <div style={{ fontSize: 12.5, lineHeight: 1.6 }}>AI confidence is below 80%. This parameter has been flagged for manual verification by a compliance officer.</div>
            </div>
          </div>
        )}

        {/* Evidence chain — horizontal 5-step layout */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>

          {/* Step 1: Requirement */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: "var(--gem-navy)", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}>1</div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--gem-navy)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                Tender Requirement
              </div>
            </div>
            <div style={{
              flex: 1, padding: "14px 16px", background: "#F0F9FF",
              border: "1px solid #BAE6FD", borderRadius: 8,
              fontSize: 13, color: "var(--text-body)", lineHeight: 1.65,
            }}>
              {parameter.requirement}
            </div>
          </div>

          {/* Step 2: Evidence */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: "var(--gem-navy)", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}>2</div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--gem-navy)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                Bidder Evidence
              </div>
            </div>
            {parameter.exactQuote ? (
              <div style={{
                flex: 1, padding: "14px 16px", background: "#FEFCE8",
                border: "1px solid #FDE047", borderLeft: "4px solid #CA8A04",
                borderRadius: "0 8px 8px 0", fontSize: 12.5,
                color: "#451A03", lineHeight: 1.7, fontStyle: "italic",
              }}>
                &ldquo;{parameter.exactQuote}&rdquo;
              </div>
            ) : (
              <div style={{
                flex: 1, padding: "14px 16px", background: "#FEF2F2",
                border: "1px solid #FECACA", borderRadius: 8,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <FileX size={15} color="#DC2626" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "#DC2626", fontWeight: 600 }}>No matching text found in document</span>
              </div>
            )}
          </div>

          {/* Step 3: Document Reference */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: "var(--gem-navy)", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}>3</div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--gem-navy)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                Source Reference
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{
                padding: "12px 14px", background: "#F8FAFC",
                border: "1px solid var(--border-light)", borderRadius: 8,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <FileText size={14} color="var(--gem-navy)" />
                <span style={{ fontSize: 12, color: "var(--text-body)", fontFamily: "monospace" }}>bidder_submission.pdf</span>
              </div>
              {parameter.pageNumber && (
                <div style={{
                  padding: "12px 14px", background: "#F8FAFC",
                  border: "1px solid var(--border-light)", borderRadius: 8,
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <Hash size={12} color="var(--text-muted)" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--gem-navy)" }}>Page {parameter.pageNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Step 4: Extracted Value + Confidence */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: "var(--gem-navy)", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}>4</div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--gem-navy)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                AI Extraction
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{
                padding: "14px 16px", background: "#EFF6FF",
                border: "1px solid #BFDBFE", borderRadius: 8,
                fontFamily: "Courier New, monospace",
                fontSize: 16, fontWeight: 700, color: "var(--gem-navy)",
              }}>
                {parameter.extractedValue ?? "NOT FOUND"}
              </div>
              {confPct !== null && (
                <div style={{
                  padding: "12px 14px", background: "#F8FAFC",
                  border: "1px solid var(--border-light)", borderRadius: 8,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                    <span style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>{confLabel}</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: confColor, lineHeight: 1 }}>{confPct}%</span>
                  </div>
                  <div style={{ height: 5, background: "#E5E7EB", borderRadius: 999, marginBottom: 10 }}>
                    <div style={{ height: "100%", width: `${confPct}%`, background: confColor, borderRadius: 999, transition: "width 0.6s ease" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {indicators.map(({ label, ok }) => (
                      <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5 }}>
                        {ok ? <CheckCircle2 size={12} color="#15803D" /> : <X size={12} color="#DC2626" />}
                        <span style={{ color: ok ? "#15803D" : "#DC2626", fontWeight: ok ? 600 : 400 }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 5: Decision */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: "var(--gem-navy)", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}>5</div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--gem-navy)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                Decision
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{
                padding: "14px 16px", background: decision.bg,
                border: `1px solid ${decision.border}`, borderRadius: 8,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <decision.Icon size={16} color={decision.color} style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: decision.color }}>{decision.label}</div>
                  {confPct !== null && (
                    <div style={{ fontSize: 11.5, color: decision.color, fontWeight: 600, marginTop: 3 }}>
                      {confPct}% confidence
                    </div>
                  )}
                </div>
              </div>
              {parameter.exactQuote && (
                <>
                  <button onClick={() => setShowReasoning(v => !v)} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    width: "100%", padding: "9px 12px",
                    background: "#F8FAFC", border: "1px solid var(--border-light)",
                    borderRadius: showReasoning ? "6px 6px 0 0" : 6,
                    cursor: "pointer", fontSize: 12, fontWeight: 600,
                    color: "var(--gem-navy)", fontFamily: "inherit",
                  }}>
                    <Brain size={13} /> AI Reasoning
                    {showReasoning ? <ChevronUp size={12} style={{ marginLeft: "auto" }} /> : <ChevronDown size={12} style={{ marginLeft: "auto" }} />}
                  </button>
                  {showReasoning && (
                    <div style={{
                      padding: "12px 14px", background: "#fff",
                      border: "1px solid var(--border-light)", borderTop: "none",
                      borderRadius: "0 0 6px 6px",
                      fontSize: 12.5, color: "var(--text-body)", lineHeight: 1.7,
                      marginTop: -8,
                    }}>
                      The AI engine located the relevant clause on page {parameter.pageNumber} using semantic matching. Extracted value: <strong>{parameter.extractedValue}</strong>.
                      {parameter.confidenceScore >= 0.8 ? " High lexical similarity indicates a strong match." : " The language was ambiguous — manual verification recommended."}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
