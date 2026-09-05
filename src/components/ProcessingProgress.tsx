"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const STAGES = [
  { label: "Document received & validated",     pct: 12 },
  { label: "Parsing PDF structure",             pct: 28 },
  { label: "Extracting text content (OCR)",     pct: 46 },
  { label: "Running AI language model",         pct: 68 },
  { label: "Validating against tender rules",   pct: 85 },
  { label: "Generating compliance report",      pct: 100 },
];

export default function ProcessingProgress({ onComplete }: { onComplete: () => void }) {
  const [stageIdx, setStageIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const dotsInt = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 500);
    return () => clearInterval(dotsInt);
  }, []);

  useEffect(() => {
    const target = STAGES[stageIdx]?.pct ?? 100;
    let cur = progress;

    const intv = setInterval(() => {
      cur += 2;
      setProgress(Math.min(cur, target));
      if (cur >= target) {
        clearInterval(intv);
        setTimeout(() => {
          if (stageIdx < STAGES.length - 1) setStageIdx(i => i + 1);
          else setTimeout(onComplete, 500);
        }, 700);
      }
    }, 20);

    return () => clearInterval(intv);
  }, [stageIdx]); // eslint-disable-line

  const current = STAGES[stageIdx];

  return (
    <div style={{ padding: "36px 24px", textAlign: "center" }}>
      {/* Spinner */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "#EFF6FF",
          border: "2px solid #BFDBFE",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Loader2 size={28} color="var(--gem-navy)" className="animate-spin" />
        </div>
      </div>

      {/* Stage */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-heading)", marginBottom: 4 }}>
          Processing Document{dots}
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          {current?.label}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ maxWidth: 360, margin: "0 auto 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>
          <span>Stage {stageIdx + 1} of {STAGES.length}</span>
          <span style={{ fontWeight: 700, color: "var(--gem-navy)" }}>{progress}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Stage pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
        {STAGES.map((s, i) => (
          <span key={i} style={{
            fontSize: 11,
            padding: "2px 10px",
            borderRadius: 999,
            fontWeight: 600,
            background: i < stageIdx ? "#F0FDF4" : i === stageIdx ? "#EFF6FF" : "#F9FAFB",
            color: i < stageIdx ? "var(--status-green)" : i === stageIdx ? "var(--gem-navy)" : "var(--text-muted)",
            border: `1px solid ${i < stageIdx ? "#BBF7D0" : i === stageIdx ? "#BFDBFE" : "#E5E7EB"}`,
          }}>
            {i < stageIdx ? "✓ " : ""}{s.label}
          </span>
        ))}
      </div>

      <p style={{ marginTop: 16, fontSize: 12, color: "var(--text-muted)", maxWidth: 320, margin: "20px auto 0", lineHeight: 1.6 }}>
        The AI engine is extracting compliance parameters and cross-referencing them against the tender requirements.
      </p>
    </div>
  );
}
