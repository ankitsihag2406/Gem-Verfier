import { useState } from "react";
import StatusBadge from "./StatusBadge";
import {
  X, Brain, AlertTriangle, BookOpen, Hash, Quote, FileX,
  CheckCircle2, FileText, ChevronDown, ChevronUp,
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

function ChainStep({ step, label, children, isLast = false }) {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          width: 24, height: 24, borderRadius: "50%",
          background: "var(--gem-navy)", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, flexShrink: 0,
        }}>
          {step}
        </div>
        {!isLast && <div style={{ width: 1, flex: 1, background: "#DBEAFE", minHeight: 16, marginTop: 4 }} />}
      </div>
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : 16, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--gem-navy)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
          {label}
        </div>
        {children}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", textAlign: "center", height: "100%" }}>
      <div style={{ width: 48, height: 48, borderRadius: 10, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, border: "1px solid #BFDBFE" }}>
        <Quote size={20} color="var(--gem-navy)" />
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-heading)", marginBottom: 6 }}>Evidence Chain</div>
      <p style={{ fontSize: 12.5, color: "var(--text-secondary)", maxWidth: 210, lineHeight: 1.6 }}>
        Select an AI-verified parameter from the compliance matrix to view the full evidence chain.
      </p>
    </div>
  );
}

export default function EvidencePanel({ parameter, onClose }) {
  const [showReasoning, setShowReasoning] = useState(false);
  if (!parameter) return <EmptyState />;

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
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ padding: "11px 14px", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "flex-start", gap: 10, background: "#F8FAFC", flexShrink: 0 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, color: "var(--gem-navy)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>
            Evidence Chain · AI Extraction
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-heading)", lineHeight: 1.3 }}>{parameter.parameterName}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <StatusBadge status={parameter.status} size="sm" />
          <button onClick={onClose} style={{ background: "none", border: "1px solid var(--border-light)", cursor: "pointer", color: "var(--text-secondary)", padding: 4, borderRadius: 4, display: "flex" }}>
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px" }}>
        {isLow && parameter.status !== "NOT_FOUND" && (
          <div className="alert alert-warn" style={{ marginBottom: 16 }}>
            <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontWeight: 700, marginBottom: 2, fontSize: 12.5 }}>Human Review Required</div>
              <div style={{ fontSize: 12, lineHeight: 1.5 }}>AI confidence below 80%. Flagged for manual verification.</div>
              <button style={{ marginTop: 8, padding: "4px 12px", background: "#B45309", color: "#fff", border: "none", borderRadius: 4, fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>
                Mark for Review
              </button>
            </div>
          </div>
        )}

        <ChainStep step={1} label="Tender Requirement">
          <div style={{ padding: "9px 12px", background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 5, fontSize: 12.5, color: "var(--text-body)", lineHeight: 1.6 }}>
            {parameter.requirement}
          </div>
        </ChainStep>

        <ChainStep step={2} label="Bidder Evidence">
          {parameter.exactQuote ? (
            <div style={{ padding: "10px 12px", background: "#FEFCE8", border: "1px solid #FDE047", borderLeft: "3px solid #CA8A04", borderRadius: "0 5px 5px 0", fontSize: 12.5, color: "#451A03", lineHeight: 1.7, fontStyle: "italic" }}>
              &ldquo;{parameter.exactQuote}&rdquo;
            </div>
          ) : (
            <div style={{ padding: "10px 12px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 5, display: "flex", alignItems: "center", gap: 8 }}>
              <FileX size={14} color="#DC2626" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: "#DC2626", fontWeight: 600 }}>No matching text found in document</span>
            </div>
          )}
        </ChainStep>

        <ChainStep step={3} label="Document Reference">
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1, padding: "8px 10px", background: "#F8FAFC", border: "1px solid var(--border-light)", borderRadius: 5, display: "flex", alignItems: "center", gap: 7 }}>
              <FileText size={13} color="var(--gem-navy)" />
              <span style={{ fontSize: 12, color: "var(--text-body)", fontFamily: "monospace" }}>bidder_submission.pdf</span>
            </div>
            {parameter.pageNumber && (
              <div style={{ padding: "8px 12px", background: "#F8FAFC", border: "1px solid var(--border-light)", borderRadius: 5, display: "flex", alignItems: "center", gap: 5 }}>
                <Hash size={12} color="var(--text-muted)" />
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--gem-navy)" }}>Page {parameter.pageNumber}</span>
              </div>
            )}
          </div>
        </ChainStep>

        <ChainStep step={4} label="AI Extracted Value">
          <div style={{ padding: "10px 14px", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 5, fontFamily: "Courier New, monospace", fontSize: 16, fontWeight: 700, color: "var(--gem-navy)", marginBottom: 10 }}>
            {parameter.extractedValue ?? "NOT FOUND"}
          </div>
          {confPct !== null && (
            <div style={{ padding: "10px 12px", background: "#F8FAFC", border: "1px solid var(--border-light)", borderRadius: 5 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
                <span style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>{confLabel}</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: confColor, lineHeight: 1 }}>{confPct}%</span>
              </div>
              <div style={{ height: 5, background: "#E5E7EB", borderRadius: 999, marginBottom: 10 }}>
                <div style={{ height: "100%", width: `${confPct}%`, background: confColor, borderRadius: 999, transition: "width 0.6s ease" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {indicators.map(({ label, ok }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12 }}>
                    {ok ? <CheckCircle2 size={12} color="#15803D" /> : <X size={12} color="#DC2626" />}
                    <span style={{ color: ok ? "#15803D" : "#DC2626", fontWeight: ok ? 600 : 400 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ChainStep>

        <ChainStep step={5} label="Compliance Decision" isLast>
          <div style={{ padding: "11px 14px", background: decision.bg, border: `1px solid ${decision.border}`, borderRadius: 6, display: "flex", alignItems: "center", gap: 10 }}>
            <decision.Icon size={16} color={decision.color} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 800, color: decision.color }}>{decision.label}</span>
            {confPct !== null && (
              <span style={{ marginLeft: "auto", fontSize: 11.5, color: decision.color, fontWeight: 700, background: "rgba(0,0,0,0.05)", padding: "2px 8px", borderRadius: 4 }}>
                {confPct}% confidence
              </span>
            )}
          </div>
          {parameter.exactQuote && (
            <div style={{ marginTop: 10 }}>
              <button onClick={() => setShowReasoning(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", padding: "7px 10px", background: "#F8FAFC", border: "1px solid var(--border-light)", borderRadius: showReasoning ? "5px 5px 0 0" : 5, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "var(--gem-navy)", fontFamily: "inherit" }}>
                <Brain size={13} /> AI Reasoning
                {showReasoning ? <ChevronUp size={12} style={{ marginLeft: "auto" }} /> : <ChevronDown size={12} style={{ marginLeft: "auto" }} />}
              </button>
              {showReasoning && (
                <div style={{ padding: "10px 12px", background: "#fff", border: "1px solid var(--border-light)", borderTop: "none", borderRadius: "0 0 5px 5px", fontSize: 12.5, color: "var(--text-body)", lineHeight: 1.7 }}>
                  The AI engine located the relevant clause on page {parameter.pageNumber} using semantic matching. Extracted value: <strong>{parameter.extractedValue}</strong>.
                  {parameter.confidenceScore >= 0.8 ? " High lexical similarity indicates a strong match." : " The language was ambiguous — manual verification recommended."}
                </div>
              )}
            </div>
          )}
        </ChainStep>
      </div>
    </div>
  );
}
