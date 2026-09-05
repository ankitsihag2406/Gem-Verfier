"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import ParameterTable from "@/components/ParameterTable";
import EvidencePanel from "@/components/EvidencePanel";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import { getBidById, getTenderById, ExtractedParameter, getComplianceSummary } from "@/lib/mockData";
import {
  ArrowLeft, Download, Brain, FileText, Building2, Shield,
  CheckCircle2, XCircle, AlertTriangle, SplitSquareHorizontal, Hash,
} from "lucide-react";

// ── Fake PDF Document Viewer ─────────────────────────────────────────────────
function FakePdfViewer({ bid, highlightQuote }: {
  bid: ReturnType<typeof getBidById>;
  highlightQuote: string | null;
}) {
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
      content: "The bidder confirms compliance with all technical specifications outlined in the tender document. All equipment supplied shall conform to BIS standards and carry valid ISI marks where applicable. The bidder has the necessary infrastructure and manpower to execute the contract within the stipulated timeline.",
    },
    {
      title: "SECTION 5 — STATUTORY DECLARATION",
      content: "I/We hereby declare that:\n(a) The information provided in this bid is true and accurate.\n(b) The company is not blacklisted by any Central/State Government department.\n(c) All supporting documents enclosed are genuine and valid.\n\nPlace: New Delhi | Date: 22nd August 2024",
    },
  ];

  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#E8EDF2" }}>
      {/* Toolbar */}
      <div className="pdf-panel-header">
        <FileText size={13} color="var(--gem-navy)" />
        <span style={{ flex: 1, color: "var(--text-heading)" }}>{bid.pdfName}</span>
        <span style={{ color: "var(--text-muted)" }}>6 pages</span>
        {highlightQuote && (
          <span style={{
            fontSize: 11, padding: "2px 8px", background: "#FFFBEB",
            border: "1px solid #FDE68A", borderRadius: 4, color: "#B45309", fontWeight: 600,
          }}>
            ● Evidence Highlighted
          </span>
        )}
      </div>

      {/* Simulated A4 Page */}
      <div style={{ padding: "16px 24px" }}>
        <div style={{
          background: "#fff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
          borderRadius: 2,
          padding: "40px 48px",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 13,
          lineHeight: 1.8,
          color: "#1a1a1a",
          minHeight: "100%",
        }}>
          {/* Letterhead */}
          <div style={{
            borderBottom: "3px solid #003366", paddingBottom: 16, marginBottom: 24,
            display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#003366" }}>{bid.companyName}</div>
              <div style={{ fontSize: 11.5, color: "#555", marginTop: 3 }}>
                CIN: U72200HR2016PTC062418 · GSTIN: 06AABCA1234M1Z5
              </div>
            </div>
            <div style={{
              padding: "4px 12px", background: "#DC2626", color: "#fff",
              fontSize: 10, fontWeight: 700, borderRadius: 3, letterSpacing: "0.08em",
            }}>
              CONFIDENTIAL
            </div>
          </div>

          {/* Title block */}
          <div style={{ textAlign: "center", marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid #E5E7EB" }}>
            <div style={{ fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
              GOVERNMENT OF INDIA · Government e-Marketplace (GeM)
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#003366", marginBottom: 6 }}>
              BID SUBMISSION DOCUMENT
            </div>
            <div style={{ fontSize: 12.5, color: "#444" }}>Tender Reference: GEM/2024/B/4529187</div>
          </div>

          {/* Sections */}
          {sections.map((sec, idx) => {
            const isHighlighted = highlightQuote && sec.content.includes(highlightQuote.substring(0, 50));
            return (
              <div
                key={idx}
                id={isHighlighted ? "highlighted-quote" : undefined}
                style={{
                  marginBottom: 24,
                  background: isHighlighted ? "#FFFBEB" : "transparent",
                  borderLeft: isHighlighted ? "4px solid #F59E0B" : "none",
                  padding: isHighlighted ? "10px 14px" : "0",
                  borderRadius: isHighlighted ? "0 6px 6px 0" : 0,
                  transition: "background 0.3s",
                }}
              >
                {isHighlighted && (
                  <div style={{
                    fontSize: 10, fontWeight: 700, color: "#B45309",
                    textTransform: "uppercase", letterSpacing: "0.07em",
                    marginBottom: 8, fontFamily: "Noto Sans, sans-serif",
                  }}>
                    ◉ AI EVIDENCE MATCH
                  </div>
                )}
                <div style={{
                  fontSize: 11, fontWeight: 700, color: "#003366",
                  textTransform: "uppercase", letterSpacing: "0.06em",
                  marginBottom: 8, fontFamily: "Noto Sans, sans-serif",
                }}>
                  {sec.title}
                </div>
                <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.85 }}>{sec.content}</div>
                {idx < sections.length - 1 && (
                  <div style={{ marginTop: 20, borderBottom: "1px solid #E5E7EB" }} />
                )}
              </div>
            );
          })}

          {/* Footer */}
          <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid #E5E7EB", textAlign: "center", fontSize: 11, color: "#999" }}>
            Page 1 of 6 · {bid.pdfName}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function BidAnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const bid = getBidById(id);
  if (!bid) return notFound();

  const tender = getTenderById(bid.tenderId);
  const [selectedParam, setSelectedParam] = useState<ExtractedParameter | null>(null);
  const summary = getComplianceSummary(bid.parameters);

  const overallColor = bid.overallCompliance === "COMPLIANT" ? "#15803D"
    : bid.overallCompliance === "NON_COMPLIANT" ? "#DC2626" : "#B45309";
  const OverallIcon = bid.overallCompliance === "COMPLIANT" ? CheckCircle2
    : bid.overallCompliance === "NON_COMPLIANT" ? XCircle : AlertTriangle;

  const handleSelectParam = (param: ExtractedParameter) => {
    setSelectedParam(param);
    setTimeout(() => {
      document.getElementById("highlighted-quote")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <AppShell noPadding>
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}>

        {/* Page bar */}
        <div className="page-bar" style={{ flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href={`/tenders/${bid.tenderId}`} style={{
              display: "flex", alignItems: "center", gap: 5,
              color: "var(--text-secondary)", fontSize: 13, fontWeight: 500,
            }}>
              <ArrowLeft size={14} /> Back
            </Link>
            <span style={{ color: "var(--text-muted)" }}>/</span>
            <Building2 size={13} color="var(--text-muted)" />
            <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-heading)" }}>{bid.companyName}</span>
            <span style={{ color: "var(--text-muted)" }}>·</span>
            <span className="mono" style={{ fontSize: 12, color: "var(--text-secondary)" }}>{bid.pdfName}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Processing time */}
            {bid.processingTimeSec && (
              <div style={{
                fontSize: 11.5, color: "var(--text-secondary)",
                padding: "3px 10px", background: "#F8FAFC",
                border: "1px solid var(--border-light)", borderRadius: 4,
              }}>
                Processed in {(() => {
                  const s = bid.processingTimeSec!;
                  return s < 60 ? `${s}s` : `${Math.floor(s/60)}m ${s%60}s`;
                })()}
              </div>
            )}
            {/* Avg confidence */}
            {bid.avgConfidence !== null && (
              <div style={{
                fontSize: 12, fontWeight: 700,
                color: bid.avgConfidence >= 0.85 ? "#15803D" : "#B45309",
                padding: "3px 10px",
                background: bid.avgConfidence >= 0.85 ? "#F0FDF4" : "#FFFBEB",
                border: `1px solid ${bid.avgConfidence >= 0.85 ? "#BBF7D0" : "#FDE68A"}`,
                borderRadius: 4,
              }}>
                Avg Confidence: {Math.round(bid.avgConfidence * 100)}%
              </div>
            )}
            {/* Overall status pill */}
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "4px 12px",
              background: overallColor + "14",
              border: `1px solid ${overallColor}30`,
              borderRadius: 20, fontSize: 12.5, fontWeight: 700, color: overallColor,
            }}>
              <OverallIcon size={13} />
              {bid.overallCompliance.replace("_", " ")}
            </div>
            {/* Summary counts */}
            <span style={{ fontSize: 12, color: "var(--status-green)", fontWeight: 700 }}>✓ {summary.compliant}</span>
            <span style={{ fontSize: 12, color: "var(--status-red)", fontWeight: 700 }}>✗ {summary.nonCompliant}</span>
            <span style={{ fontSize: 12, color: "var(--status-amber)", fontWeight: 700 }}>⚠ {summary.flagged}</span>
            {/* Actions */}
            {bid.overallCompliance === "PARTIAL" && (
              <button style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "5px 12px", fontSize: 12, fontWeight: 700,
                background: "#B45309", color: "#fff",
                border: "none", borderRadius: 5, cursor: "pointer",
              }}>
                ✎ Override AI Decision
              </button>
            )}
            <button className="btn btn-ghost btn-sm">
              <Download size={13} /> Audit Report
            </button>
          </div>
        </div>

        {/* 3-Panel split */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 340px", overflow: "hidden" }}>

          {/* Panel 1: PDF */}
          <div style={{ borderRight: "1px solid var(--border-light)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div className="pdf-panel-header" style={{ flexShrink: 0 }}>
              <SplitSquareHorizontal size={13} color="var(--gem-navy)" />
              <span style={{ fontWeight: 700 }}>Source Document</span>
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <FakePdfViewer bid={bid} highlightQuote={selectedParam?.exactQuote ?? null} />
            </div>
          </div>

          {/* Panel 2: Parameter Table */}
          <div style={{ borderRight: "1px solid var(--border-light)", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{
              padding: "10px 16px", borderBottom: "1px solid var(--border-light)",
              background: "#F8FAFC", display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
            }}>
              <Brain size={14} color="var(--gem-navy)" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--gem-navy)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Compliance Analysis
              </span>
              {tender && (
                <>
                  <span style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--text-muted)" }}>
                    <Hash size={11} style={{ display: "inline" }} /> {tender.tenderRef}
                  </span>
                </>
              )}
            </div>
            <div style={{ padding: "14px 16px", flex: 1 }}>
              {/* Tender ref chip */}
              {tender && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "7px 10px",
                  background: "#F8FAFC", border: "1px solid var(--border-light)", borderRadius: 6, marginBottom: 14,
                }}>
                  <Shield size={13} color="var(--gem-navy)" />
                  <span style={{ fontSize: 12.5, color: "var(--text-body)", flex: 1, lineHeight: 1.3 }}>{tender.name}</span>
                </div>
              )}
              <ParameterTable
                parameters={bid.parameters}
                onSelectParameter={handleSelectParam}
                selectedParamId={selectedParam?.id}
              />
            </div>
          </div>

          {/* Panel 3: Evidence */}
          <div style={{ overflowY: "auto", background: "#FAFBFC", display: "flex", flexDirection: "column" }}>
            <div style={{
              padding: "10px 14px", borderBottom: "1px solid var(--border-light)",
              background: "#F8FAFC", flexShrink: 0,
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--gem-navy)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Evidence & Reasoning
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <EvidencePanel parameter={selectedParam} onClose={() => setSelectedParam(null)} />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
