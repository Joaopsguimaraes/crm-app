import { notFound } from "next/navigation";

export function assertCustomerUiEnabled(): void {
  if (process.env.CUSTOMER_UI_ENABLED !== "true") {
    notFound();
  }
}
