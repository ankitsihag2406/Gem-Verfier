// ─── Mock Data Store ────────────────────────────────────────────────────────
// Central "database" for the frontend-only prototype.

export const MOCK_TENDERS = [
  {
    id: "tender-001",
    name: "Supply of IT Infrastructure for District Offices",
    tenderRef: "GEM/2024/B/4529187",
    department: "Ministry of Electronics & IT",
    createdAt: "2024-08-12",
    deadline: "2024-09-15",
    emdRequired: 500000,
    minExperienceYears: 5,
    minAnnualTurnover: 10000000,
    totalBids: 4,
    compliantBids: 1,
  },
  {
    id: "tender-002",
    name: "Procurement of Office Furniture — Central Secretariat",
    tenderRef: "GEM/2024/B/3891045",
    department: "Ministry of Finance",
    createdAt: "2024-08-20",
    deadline: "2024-09-25",
    emdRequired: 250000,
    minExperienceYears: 3,
    minAnnualTurnover: 5000000,
    totalBids: 5,
    compliantBids: 3,
  },
  {
    id: "tender-003",
    name: "Annual Maintenance of CCTV Systems — Airport Authority",
    tenderRef: "GEM/2024/B/5102934",
    department: "Ministry of Civil Aviation",
    createdAt: "2024-08-25",
    deadline: "2024-10-01",
    emdRequired: 150000,
    minExperienceYears: 2,
    minAnnualTurnover: 3000000,
    totalBids: 8,
    compliantBids: 5,
  },
];

const PENDING_PARAMETERS = [
  { id: "p4",  parameterName: "GST Registration Certificate", extractedValue: null, confidenceScore: null, exactQuote: null, pageNumber: null, status: "PENDING", requirement: "Valid GSTIN required", category: "PENDING" },
  { id: "p5",  parameterName: "PAN Card Copy", extractedValue: null, confidenceScore: null, exactQuote: null, pageNumber: null, status: "PENDING", requirement: "Valid PAN required", category: "PENDING" },
  { id: "p6",  parameterName: "Certificate of Incorporation", extractedValue: null, confidenceScore: null, exactQuote: null, pageNumber: null, status: "PENDING", requirement: "Company must be registered", category: "PENDING" },
  { id: "p7",  parameterName: "ISO Certification", extractedValue: null, confidenceScore: null, exactQuote: null, pageNumber: null, status: "PENDING", requirement: "ISO 9001:2015 mandatory", category: "PENDING" },
  { id: "p8",  parameterName: "Bank Solvency Certificate", extractedValue: null, confidenceScore: null, exactQuote: null, pageNumber: null, status: "PENDING", requirement: "Solvency ≥ ₹50 Lakh", category: "PENDING" },
  { id: "p9",  parameterName: "Performance Bank Guarantee", extractedValue: null, confidenceScore: null, exactQuote: null, pageNumber: null, status: "PENDING", requirement: "5% of contract value", category: "PENDING" },
  { id: "p10", parameterName: "Blacklisting Declaration", extractedValue: null, confidenceScore: null, exactQuote: null, pageNumber: null, status: "PENDING", requirement: "Self-declaration of non-blacklisting", category: "PENDING" },
];

export const MOCK_BIDS = [
  {
    id: "bid-001",
    tenderId: "tender-001",
    companyName: "Apex Technology Solutions Pvt. Ltd.",
    uploadedAt: "2024-08-28T10:23:00Z",
    status: "COMPLETE",
    overallCompliance: "COMPLIANT",
    pdfName: "apex_tech_bid_submission.pdf",
    avgConfidence: 0.957,
    processingTimeSec: 222,
    parameters: [
      { id: "p1", parameterName: "Earnest Money Deposit (EMD)", extractedValue: "₹5,00,000", confidenceScore: 0.97, exactQuote: "We hereby enclose Earnest Money Deposit of Rs. 5,00,000 (Rupees Five Lakh Only) vide Demand Draft No. DD/2024/08/004521 dated 22nd August 2024, drawn on State Bank of India, New Delhi.", pageNumber: 3, status: "COMPLIANT", requirement: "Minimum ₹5,00,000 EMD required", category: "AI_VERIFIED" },
      { id: "p2", parameterName: "Years of Experience", extractedValue: "8 Years", confidenceScore: 0.94, exactQuote: "Apex Technology Solutions Pvt. Ltd. has been providing IT infrastructure solutions since 2016, accumulating over 8 years of experience in government sector deployments across 14 states.", pageNumber: 5, status: "COMPLIANT", requirement: "Minimum 5 years of relevant experience", category: "AI_VERIFIED" },
      { id: "p3", parameterName: "Annual Turnover", extractedValue: "₹2.4 Crore", confidenceScore: 0.96, exactQuote: "As per the audited financial statements for FY 2023-24, the company's annual turnover stands at INR 2,40,00,000 (Rupees Two Crore Forty Lakh), duly certified by M/s Sharma & Associates, Chartered Accountants.", pageNumber: 8, status: "COMPLIANT", requirement: "Minimum Annual Turnover of ₹1 Crore", category: "AI_VERIFIED" },
      ...PENDING_PARAMETERS,
    ],
  },
  {
    id: "bid-002",
    tenderId: "tender-001",
    companyName: "TechVision Enterprises Ltd.",
    uploadedAt: "2024-08-29T14:05:00Z",
    status: "COMPLETE",
    overallCompliance: "NON_COMPLIANT",
    pdfName: "techvision_bid_submission.pdf",
    avgConfidence: 0.94,
    processingTimeSec: 198,
    parameters: [
      { id: "p1", parameterName: "Earnest Money Deposit (EMD)", extractedValue: "₹4,50,000", confidenceScore: 0.98, exactQuote: "The Earnest Money Deposit of Rs. 4,50,000 (Rupees Four Lakh Fifty Thousand) is submitted herewith via NEFT transfer (UTR No. SBIN024082900012) to the designated GeM account.", pageNumber: 2, status: "NON_COMPLIANT", requirement: "Minimum ₹5,00,000 EMD required", category: "AI_VERIFIED" },
      { id: "p2", parameterName: "Years of Experience", extractedValue: "7 Years", confidenceScore: 0.91, exactQuote: "TechVision Enterprises Ltd. was established in 2017 and has been operational for 7 years, serving both private and public sector clients in IT hardware procurement.", pageNumber: 4, status: "COMPLIANT", requirement: "Minimum 5 years of relevant experience", category: "AI_VERIFIED" },
      { id: "p3", parameterName: "Annual Turnover", extractedValue: "₹1.85 Crore", confidenceScore: 0.93, exactQuote: "Total revenue from operations for the financial year 2023-24 amounts to INR 1,85,00,000 as per the Balance Sheet certified by M/s Verma & Co., Chartered Accountants, Delhi.", pageNumber: 7, status: "COMPLIANT", requirement: "Minimum Annual Turnover of ₹1 Crore", category: "AI_VERIFIED" },
      ...PENDING_PARAMETERS,
    ],
  },
  {
    id: "bid-003",
    tenderId: "tender-001",
    companyName: "Sunrise Digital Infrastructure Co.",
    uploadedAt: "2024-08-30T09:15:00Z",
    status: "COMPLETE",
    overallCompliance: "PARTIAL",
    pdfName: "sunrise_digital_bid.pdf",
    avgConfidence: 0.68,
    processingTimeSec: 341,
    parameters: [
      { id: "p1", parameterName: "Earnest Money Deposit (EMD)", extractedValue: "₹5,00,000", confidenceScore: 0.95, exactQuote: "EMD of Rs. Five Lakh deposited via Pay Order No. 2024/PO/88821, State Bank of India, Branch: Connaught Place, New Delhi.", pageNumber: 3, status: "COMPLIANT", requirement: "Minimum ₹5,00,000 EMD required", category: "AI_VERIFIED" },
      { id: "p2", parameterName: "Years of Experience", extractedValue: "~3–5 Years (Ambiguous)", confidenceScore: 0.61, exactQuote: "Our organization has been involved in digital infrastructure and related services for several years, with our team members bringing extensive industry experience from their prior roles in various technology companies.", pageNumber: 6, status: "FLAG_FOR_REVIEW", requirement: "Minimum 5 years of relevant experience", category: "AI_VERIFIED" },
      { id: "p3", parameterName: "Annual Turnover", extractedValue: "NOT FOUND", confidenceScore: 0.88, exactQuote: null, pageNumber: null, status: "NOT_FOUND", requirement: "Minimum Annual Turnover of ₹1 Crore", category: "AI_VERIFIED" },
      ...PENDING_PARAMETERS,
    ],
  },
  {
    id: "bid-004",
    tenderId: "tender-001",
    companyName: "Bharat Systems & Services Pvt. Ltd.",
    uploadedAt: "2024-08-31T16:40:00Z",
    status: "FAILED",
    overallCompliance: "PROCESSING",
    pdfName: "bharat_systems_bid_SCAN.pdf",
    avgConfidence: null,
    processingTimeSec: null,
    failureReason: "Document quality insufficient — scanned pages have DPI < 150. Text extraction failed on 31/47 pages. Please re-upload a machine-readable or higher-resolution scan.",
    parameters: [],
  },
];

export function getBidsByTender(tenderId) {
  return MOCK_BIDS.filter(b => b.tenderId === tenderId);
}

export function getBidById(bidId) {
  return MOCK_BIDS.find(b => b.id === bidId);
}

export function getTenderById(tenderId) {
  return MOCK_TENDERS.find(t => t.id === tenderId);
}

export function formatCurrency(amount) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export function formatProcessingTime(sec) {
  if (!sec) return "—";
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
}

export function getComplianceSummary(parameters) {
  const ai = parameters.filter(p => p.category === "AI_VERIFIED");
  const compliant = ai.filter(p => p.status === "COMPLIANT").length;
  const nonCompliant = ai.filter(p => p.status === "NON_COMPLIANT").length;
  const flagged = ai.filter(p => p.status === "FLAG_FOR_REVIEW" || p.status === "NOT_FOUND").length;
  const pending = parameters.filter(p => p.status === "PENDING").length;
  return { compliant, nonCompliant, flagged, pending, total: parameters.length, aiVerified: ai.length };
}
