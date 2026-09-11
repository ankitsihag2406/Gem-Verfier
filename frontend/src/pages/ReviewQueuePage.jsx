import { Link } from "react-router-dom";
import AppShell from "@/components/AppShell";
import StatusBadge from "@/components/StatusBadge";
import { MOCK_BIDS, getTenderById, formatDate } from "@/lib/mockData";
import {
  AlertTriangle, ArrowRight, Building2, Clock, FileText, Hash,
} from "lucide-react";

export default function ReviewQueuePage() {
  const reviewBids = MOCK_BIDS.filter(b => b.overallCompliance === "PARTIAL");

  return (
    <AppShell>
      <div className="page-bar">
        <div>
          <div className="page-title">Review Queue</div>
          <div className="breadcrumb" style={{ marginTop: 2 }}>
            <Link to="/">Home</Link><span className="breadcrumb-sep">/</span>
            <span>Review Queue</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            padding: "4px 12px", background: "#FFFBEB",
            border: "1px solid #FDE68A", borderRadius: 20,
            fontSize: 12, fontWeight: 700, color: "#B45309",
          }}>
            <AlertTriangle size={12} style={{ display: "inline", verticalAlign: "-2px", marginRight: 4 }} />
            {reviewBids.length} bid{reviewBids.length !== 1 ? "s" : ""} awaiting review
          </div>
        </div>
      </div>

      <div className="page-content">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {reviewBids.length === 0 ? (
            <div className="card" style={{ padding: "48px 24px", textAlign: "center" }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, margin: "0 auto 14px",
                background: "#F0FDF4", border: "1px solid #BBF7D0",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Clock size={22} color="#15803D" />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-heading)", marginBottom: 6 }}>Queue Empty</div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 340, margin: "0 auto", lineHeight: 1.6 }}>
                No bids require manual review at this time. All AI-verified bids have been processed with high confidence.
              </p>
            </div>
          ) : (
            reviewBids.map(bid => {
              const tender = getTenderById(bid.tenderId);
              const flaggedParams = bid.parameters.filter(
                p => p.status === "FLAG_FOR_REVIEW" || p.status === "NOT_FOUND"
              );
              return (
                <div key={bid.id} className="card">
                  <div className="card-header">
                    <div className="card-header-title">
                      <Building2 size={15} color="var(--gem-navy)" />
                      {bid.companyName}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <StatusBadge status="FLAG_FOR_REVIEW" size="sm" />
                      <Link to={`/bids/${bid.id}`} className="btn btn-primary btn-xs">
                        Review Now <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                  <div className="card-body">
                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 16 }}>
                      {tender && (
                        <div>
                          <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Tender</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 600, color: "var(--text-heading)" }}>
                            <Hash size={12} color="var(--gem-navy)" />{tender.tenderRef}
                          </div>
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Document</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--text-body)" }}>
                          <FileText size={12} color="var(--text-secondary)" />
                          <span className="mono" style={{ fontSize: 12 }}>{bid.pdfName}</span>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Submitted</div>
                        <div style={{ fontSize: 13, color: "var(--text-body)" }}>{formatDate(bid.uploadedAt)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Avg Confidence</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: bid.avgConfidence >= 0.8 ? "var(--status-green)" : "#B45309" }}>
                          {bid.avgConfidence !== null ? `${Math.round(bid.avgConfidence * 100)}%` : "—"}
                        </div>
                      </div>
                    </div>

                    {flaggedParams.length > 0 && (
                      <>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                          Flagged Parameters ({flaggedParams.length})
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {flaggedParams.map(p => (
                            <div key={p.id} style={{
                              display: "flex", alignItems: "center", gap: 6,
                              padding: "6px 12px", background: "#FFFBEB",
                              border: "1px solid #FDE68A", borderRadius: 6,
                              fontSize: 12.5, color: "#92400E",
                            }}>
                              <AlertTriangle size={12} />
                              <span style={{ fontWeight: 600 }}>{p.parameterName}</span>
                              {p.confidenceScore !== null && (
                                <span style={{ fontWeight: 700, color: "#B45309" }}>
                                  {Math.round(p.confidenceScore * 100)}%
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppShell>
  );
}
