import { assertCustomerUiEnabled } from "@/features/customers/server/route-gate";
import { redirect } from "next/navigation";

export default function NewCustomerPage(): never {
  assertCustomerUiEnabled();
  redirect("/customers");
}
