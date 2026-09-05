"use client";

import { ParameterStatus } from "@/lib/mockData";
import { CheckCircle2, XCircle, AlertTriangle, Clock, HelpCircle } from "lucide-react";

const CONFIG: Record<ParameterStatus, {
  label: string; className: string; Icon: React.ElementType;
}> = {
  COMPLIANT:      { label: "Compliant",       className: "badge badge-compliant",     Icon: CheckCircle2 },
  NON_COMPLIANT:  { label: "Non-Compliant",   className: "badge badge-non-compliant", Icon: XCircle },
  FLAG_FOR_REVIEW:{ label: "Flag for Review", className: "badge badge-flag",          Icon: AlertTriangle },
  NOT_FOUND:      { label: "Not Found",       className: "badge badge-not-found",     Icon: HelpCircle },
  PENDING:        { label: "Pending",         className: "badge badge-pending",        Icon: Clock },
};

interface Props { status: ParameterStatus; size?: "sm" | "md"; }

export default function StatusBadge({ status, size = "md" }: Props) {
  const { label, className, Icon } = CONFIG[status];
  const iconSize = size === "sm" ? 10 : 11;
  const style = size === "sm"
    ? { fontSize: "10px", padding: "2px 8px" }
    : {};
  return (
    <span className={className} style={style}>
      <Icon size={iconSize} />
      {label}
    </span>
  );
}
