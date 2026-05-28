import { CustomerListClient } from "@/features/customers/components/customer-list-client";
import { normalizeCustomerListParams } from "@/features/customers/contracts";
import { listCustomers } from "@/features/customers/server/api";
import { assertCustomerUiEnabled } from "@/features/customers/server/route-gate";
import Link from "next/link";
import type { ReactElement } from "react";

type CustomersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CustomersPage({
  searchParams,
}: CustomersPageProps): Promise<ReactElement> {
  assertCustomerUiEnabled();

  const params = normalizeCustomerListParams(await searchParams);
  const response = await listCustomers(params);

  return (
    <main className="mx-auto flex w-full max-w-360 flex-col gap-4 px-3 py-4 sm:px-5">
      {response.ok ? (
        <CustomerListClient params={params} response={response.data} />
      ) : (
        <section className="rounded-md border border-destructive/30 bg-card p-4 text-sm text-destructive shadow-xs">
          {response.error.message}
        </section>
      )}

      <nav className="sr-only" aria-label="Customer list shortcuts">
        <Link href="/customers">First page</Link>
      </nav>
    </main>
  );
}
