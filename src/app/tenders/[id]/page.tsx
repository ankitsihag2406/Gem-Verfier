"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import Link from "next/link";
import { getTenderById, getBidsByTender, formatCurrency, formatDate } from "@/lib/mockData";
import StatusBadge from "@/components/StatusBadge";
import UploadDropzone from "@/components/UploadDropzone";
import { ArrowRight, CheckCircle2, XCircle, AlertTriangle, Hash, Building2, Calendar, Upload } from "lucide-react";

export default function TenderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const tender = getTenderById(id);
  if (!tender) return notFound();
  const bids = getBidsByTender(id);

  return (
    <AppShell>
      <div className="page-bar">
        <div>
          <div className="page-title">{tender.name}</div>
          <div className="breadcrumb" style={{ marginTop: 2 }}>
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <Link href="/tenders">Tenders</Link>
            <span className="breadcrumb-sep">/</span>
            <span>{tender.tenderRef}</span>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 18, alignItems: "start" }}>
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Tender Info */}
            <div className="card">
              <div className="card-header">
                <div className="card-header-title">Tender Details</div>
                <span className="chip">Active</span>
              </div>
              <div className="card-body">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 24px", marginBottom: 16 }}>
                  {[
                    { icon: Hash, label: "Reference", val: tender.tenderRef },
                    { icon: Building2, label: "Department", val: tender.department },
                    { icon: Calendar, label: "Deadline", val: tender.deadline },
                  ].map(({ icon: Icon, label, val }) => (
                    <div key={label}>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>{label}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3, fontSize: 13.5, fontWeight: 600, color: "var(--text-heading)" }}>
                        <Icon size={13} color="var(--gem-navy)" />{val}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="divider" style={{ marginBottom: 16 }} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                  {[
                    { label: "EMD Required", val: formatCurrency(tender.emdRequired), color: "var(--gem-navy)" },
                    { label: "Min Annual Turnover", val: formatCurrency(tender.minAnnualTurnover), color: "var(--gem-green)" },
                    { label: "Min Experience", val: `${tender.minExperienceYears} Years`, color: "var(--gem-orange)" },
                  ].map(({ label, val, color }) => (
                    <div key={label} style={{
                      padding: "12px 14px", background: "#F8FAFC",
                      border: "1px solid var(--border-light)", borderRadius: 6,
                    }}>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 5 }}>{label}</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bids Table */}
            <div className="card">
              <div className="card-header">
                <div className="card-header-title">
                  Submitted Bids
                  <span className="chip" style={{ marginLeft: 4 }}>{bids.length}</span>
                </div>
              </div>
              {bids.length === 0 ? (
                <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                  No bids submitted yet.
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>PDF File</th>
                      <th>Submitted</th>
                      <th>Result</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {bids.map(bid => {
                      const color = bid.overallCompliance === "COMPLIANT" ? "#15803D"
                        : bid.overallCompliance === "NON_COMPLIANT" ? "#DC2626" : "#B45309";
                      const Icon = bid.overallCompliance === "COMPLIANT" ? CheckCircle2
                        : bid.overallCompliance === "NON_COMPLIANT" ? XCircle : AlertTriangle;
                      return (
                        <tr key={bid.id}>
                          <td style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: 13 }}>{bid.companyName}</td>
                          <td><span className="mono" style={{ fontSize: 12 }}>{bid.pdfName}</span></td>
                          <td style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{formatDate(bid.uploadedAt)}</td>
                          <td>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color }}>
                              <Icon size={14} />{bid.overallCompliance.replace("_", " ")}
                            </span>
                          </td>
                          <td>
                            <Link href={`/bids/${bid.id}`} className="row-action">
                              View Analysis <ArrowRight size={12} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Right: Upload */}
          <div className="card" style={{ position: "sticky", top: 80 }}>
            <div className="card-header">
              <div className="card-header-title">
                <Upload size={15} /> Submit New Bid
              </div>
            </div>
            <div className="card-body">
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14, lineHeight: 1.6 }}>
                Upload a bidder&apos;s proposal PDF. The AI engine will automatically extract and verify all compliance parameters against this tender&apos;s requirements.
              </p>
              <UploadDropzone tenderId={id} />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
