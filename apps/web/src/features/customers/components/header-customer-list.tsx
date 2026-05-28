import { CustomerCreateSheet } from "@/features/customers/components/customer-create-sheet";

export function HeaderCustomerList() {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
          Customers
        </p>
        <h1 className="font-heading text-2xl font-semibold">Customer records</h1>
      </div>
      <CustomerCreateSheet />
    </header>
  );
}
