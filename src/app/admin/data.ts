
import { CheckCircle2, Circle, HelpCircle, XCircle, Hourglass } from "lucide-react";

export const statuses = [
  {
    value: "pending",
    label: "Pending",
    icon: HelpCircle,
  },
  {
    value: "in_review",
    label: "In Review",
    icon: Hourglass,
  },
  {
    value: "resolved",
    label: "Resolved",
    icon: CheckCircle2,
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: XCircle,
  },
]
