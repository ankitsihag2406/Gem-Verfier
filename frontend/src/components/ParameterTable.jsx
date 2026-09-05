import { useState } from "react";
import { getComplianceSummary } from "@/lib/mockData";
import StatusBadge from "./StatusBadge";
import { ChevronDown, ChevronUp, Brain, Clock, FileText, Quote } from "lucide-react";

export default function ParameterTable({ parameters, onSelectParameter, selectedParamId }) {
  const [showPending, setShowPending] = useState(false);
  const aiParams = parameters.filter(p => p.category === "AI_VERIFIED");
  const pendingParams = parameters.filter(p => p.status === "PENDING");
  const { compliant, nonCompliant, flagged } = getComplianceSummary(parameters);

  return (
    <div>
      {/* Summary strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
        {[
          { label: "Compliant",       val: compliant,    color: "var(--status-green)", bg: "#F0FDF4", border: "#BBF7D0" },
          { label: "Non-Compliant",   val: nonCompliant, color: "var(--status-red)",   bg: "#FEF2F2", border: "#FECACA" },
          { label: "Flagged/Missing", val: flagged,      color: "var(--status-amber)", bg: "#FFFBEB", border: "#FDE68A" },
        ].map(({ label, val, color, bg, border }) => (
          <div key={label} style={{ padding: "10px 14px", background: bg, border: `1px solid ${border}`, borderRadius: 6, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: 11, color, fontWeight: 600, marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="section-heading" style={{ marginBottom: 8 }}>
        <Brain size={13} />
        AI-Verified Parameters ({aiParams.length})
        <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 400, color: "var(--text-secondary)" }}>
          Click row to view evidence
        </span>
      </div>

      <div className="card" style={{ marginBottom: 14, overflow: "hidden" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Extracted Value</th>
              <th>Requirement</th>
              <th>Confidence</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {aiParams.map(param => {
              const isSelected = selectedParamId === param.id;
              const clickable = !!param.exactQuote;
              return (
                <tr
                  key={param.id}
                  className={`${clickable ? "row-clickable" : ""}${isSelected ? " row-selected" : ""}`}
                  onClick={() => clickable && onSelectParameter?.(param)}
                >
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <Quote size={12} color={clickable ? "var(--gem-navy)" : "var(--text-muted)"} style={{ flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: 13 }}>{param.parameterName}</span>
                    </div>
                  </td>
                  <td>
                    <span className="mono" style={{
                      fontWeight: 700,
                      color: param.status === "COMPLIANT" ? "var(--status-green)"
                        : param.status === "NON_COMPLIANT" ? "var(--status-red)"
                        : param.status === "NOT_FOUND" ? "var(--text-muted)"
                        : "var(--status-amber)",
                    }}>
                      {param.extractedValue ?? "—"}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-secondary)", fontSize: 12.5 }}>{param.requirement}</td>
                  <td>
                    {param.confidenceScore !== null ? (
                      <div className="conf-bar-wrap">
                        <div className="conf-bar">
                          <div
                            className={`conf-bar-fill ${param.confidenceScore >= 0.8 ? "conf-high" : param.confidenceScore >= 0.6 ? "conf-medium" : "conf-low"}`}
                            style={{ width: `${param.confidenceScore * 100}%` }}
                          />
                        </div>
                        <span style={{
                          fontSize: 12, fontWeight: 700,
                          color: param.confidenceScore >= 0.8 ? "var(--status-green)" : "var(--status-amber)",
                        }}>
                          {Math.round(param.confidenceScore * 100)}%
                        </span>
                      </div>
                    ) : <span style={{ color: "var(--text-muted)", fontSize: 12 }}>—</span>}
                  </td>
                  <td><StatusBadge status={param.status} size="sm" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pendingParams.length > 0 && (
        <>
          <button
            onClick={() => setShowPending(v => !v)}
            style={{
              display: "flex", alignItems: "center", gap: 8, width: "100%",
              padding: "9px 14px",
              background: "#F9FAFB", border: "1px solid var(--border-light)",
              borderRadius: showPending ? "6px 6px 0 0" : 6,
              color: "var(--text-secondary)", cursor: "pointer",
              fontSize: 13, fontWeight: 600, fontFamily: "inherit",
            }}
          >
            <Clock size={14} />
            Pending Manual Verification ({pendingParams.length} parameters)
            {showPending ? <ChevronUp size={13} style={{ marginLeft: "auto" }} /> : <ChevronDown size={13} style={{ marginLeft: "auto" }} />}
          </button>
          {showPending && (
            <div style={{ border: "1px solid var(--border-light)", borderTop: "none", borderRadius: "0 0 6px 6px", overflow: "hidden" }}>
              {pendingParams.map((p, i) => (
                <div key={p.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 14px",
                  borderBottom: i < pendingParams.length - 1 ? "1px solid var(--border-light)" : "none",
                  background: i % 2 === 0 ? "#fff" : "#F9FAFB",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FileText size={13} color="var(--text-muted)" />
                    <span style={{ fontSize: 13, color: "var(--text-body)" }}>{p.parameterName}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.requirement}</span>
                    <StatusBadge status="PENDING" size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
