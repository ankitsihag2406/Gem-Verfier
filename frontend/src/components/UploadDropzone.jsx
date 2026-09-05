import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, AlertCircle, CheckCircle2 } from "lucide-react";
import ProcessingProgress from "./ProcessingProgress";
import { MOCK_BIDS } from "@/lib/mockData";

export default function UploadDropzone({ tenderId }) {
  const navigate = useNavigate();
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type !== "application/pdf") { setError("Only PDF files are accepted."); return; }
    setFile(dropped); setError("");
  }, []);

  const handleFileInput = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") { setError("Only PDF files are accepted."); return; }
    setFile(f); setError("");
  };

  const handleSubmit = () => {
    if (!file) { setError("Please upload a bid document (PDF)."); return; }
    if (!companyName.trim()) { setError("Please enter the company / bidder name."); return; }
    setError("");
    setProcessing(true);
  };

  if (processing) {
    return (
      <ProcessingProgress onComplete={() => {
        const bids = MOCK_BIDS.filter(b => b.tenderId === tenderId);
        const bid = bids[Math.floor(Math.random() * bids.length)];
        navigate(`/bids/${bid?.id ?? "bid-001"}`);
      }} />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <label className="field-label">Company / Bidder Name <span style={{ color: "var(--status-red)" }}>*</span></label>
        <input className="input-field" type="text" value={companyName}
          onChange={e => setCompanyName(e.target.value)}
          placeholder="e.g. Apex Technology Solutions Pvt. Ltd." />
      </div>

      <div>
        <label className="field-label">Bid Document (PDF) <span style={{ color: "var(--status-red)" }}>*</span></label>
        <div
          className={`dropzone${dragOver ? " drag-over" : ""}`}
          style={{ padding: "28px 16px", textAlign: "center" }}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("upload-input")?.click()}
        >
          <input id="upload-input" type="file" accept=".pdf" style={{ display: "none" }} onChange={handleFileInput} />
          {file ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle2 size={22} color="var(--status-green)" />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: 14 }}>{file.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{(file.size / 1024).toFixed(1)} KB · PDF</div>
              </div>
              <button onClick={e => { e.stopPropagation(); setFile(null); }} className="btn btn-ghost btn-sm" style={{ marginTop: 4 }}>
                <X size={12} /> Remove File
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #BFDBFE" }}>
                <Upload size={22} color="var(--gem-navy)" />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: 13.5 }}>
                  Drag &amp; drop or <span style={{ color: "var(--gem-navy)", textDecoration: "underline" }}>browse</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>PDF format · Maximum 50 MB</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{error}</span>
        </div>
      )}

      <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "11px" }} onClick={handleSubmit}>
        <Upload size={15} /> Submit for AI Verification
      </button>
      <p style={{ fontSize: 11.5, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.6 }}>
        Document is processed in-memory. No data is retained after verification.
      </p>
    </div>
  );
}
