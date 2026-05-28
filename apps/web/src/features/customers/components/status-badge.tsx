import { Badge } from "@/components/ui/badge";
import type { CustomerStatus } from "@/features/customers/contracts";

const statusLabels: Record<CustomerStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  archived: "Archived",
  blocked: "Blocked"
};

export function StatusBadge({ status }: { status: CustomerStatus }) {
  return <Badge variant={status === "active" ? "default" : status === "blocked" ? "destructive" : "secondary"}>{statusLabels[status]}</Badge>;
}

export { statusLabels };
