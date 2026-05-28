import { IconArchive, IconRotateClockwise } from "@tabler/icons-react";
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/features/customers/components/status-badge";
import {
  AddressSheet,
  ContactSheet,
  RemoveAddressDialog,
  RemoveContactDialog,
} from "@/features/customers/components/nested-resource-forms";
import {
  archiveCustomerAction,
  unarchiveCustomerAction,
} from "@/features/customers/server/actions";
import {
  getCustomer,
  listCustomerAddresses,
  listCustomerContacts,
} from "@/features/customers/server/api";
import { assertCustomerUiEnabled } from "@/features/customers/server/route-gate";
import { valueOrMuted } from "@/features/customers/value-or-muted";

type CustomerDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps): Promise<ReactElement> {
  assertCustomerUiEnabled();

  const { id } = await params;
  const [customerResult, contactsResult, addressesResult] = await Promise.all([
    getCustomer(id),
    listCustomerContacts(id),
    listCustomerAddresses(id),
  ]);

  if (!customerResult.ok) {
    if (customerResult.error.code === "not_found") {
      notFound();
    }

    return (
      <main className="mx-auto max-w-4xl px-4 py-6">
        <section className="rounded-md border border-destructive/30 bg-card p-4 text-sm text-destructive">
          {customerResult.error.message}
        </section>
      </main>
    );
  }

  const customer = customerResult.data;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <Button asChild className="w-fit" size="sm" variant="ghost">
            <Link href="/customers">Back to customers</Link>
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-2xl font-semibold">{customer.name}</h1>
            <StatusBadge status={customer.status} />
            {customer.archivedAt ? <Badge variant="secondary">Archived</Badge> : null}
          </div>
        </div>
        <form action={customer.archivedAt ? unarchiveCustomerAction : archiveCustomerAction}>
          <input name="customerId" type="hidden" value={customer.id} />
          <Button variant={customer.archivedAt ? "outline" : "destructive"} type="submit">
            {customer.archivedAt ? (
              <IconRotateClockwise data-icon="inline-start" />
            ) : (
              <IconArchive data-icon="inline-start" />
            )}
            {customer.archivedAt ? "Unarchive" : "Archive"}
          </Button>
        </form>
      </header>

      {customer.archivedAt ? (
        <section className="rounded-md border bg-muted p-3 text-sm">
          This Customer is archived and hidden from the default list.
        </section>
      ) : null}

      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-md border bg-card p-4">
          <h2 className="font-heading text-sm font-medium">Overview</h2>
          <dl className="mt-3 grid gap-2 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Email</dt>
              <dd>{valueOrMuted(customer.email)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Phone</dt>
              <dd>{valueOrMuted(customer.phone)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Notes</dt>
              <dd>{valueOrMuted(customer.notes)}</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-md border bg-card p-4">
          <h2 className="font-heading text-sm font-medium">Completeness</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant={customer.completeness.hasPrimaryChannel ? "default" : "outline"}>
              Primary channel
            </Badge>
            <Badge variant={customer.completeness.hasAddress ? "default" : "outline"}>
              Address
            </Badge>
          </div>
        </div>
        <div className="rounded-md border bg-card p-4">
          <h2 className="font-heading text-sm font-medium">Duplicate signals</h2>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            {customer.duplicateSignals.length > 0 ? (
              customer.duplicateSignals.map((signal) => (
                <Link
                  className="text-primary underline-offset-4 hover:underline"
                  href={`/customers/${signal.customerId}` as Route}
                  key={signal.customerId}
                >
                  Possible match on {signal.fields.join(", ")}
                </Link>
              ))
            ) : (
              <span className="text-muted-foreground">No signals</span>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-md border bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-sm font-medium">Contacts</h2>
          <ContactSheet customerId={customer.id} />
        </div>
        <Separator className="my-3" />
        <div className="flex flex-col gap-2">
          {contactsResult.ok && contactsResult.data.length > 0 ? (
            contactsResult.data.map((contact) => (
              <div
                className="grid gap-2 rounded-md border p-3 text-sm md:grid-cols-[1fr_1fr_auto]"
                key={contact.id}
              >
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">{contact.role}</p>
                </div>
                <div className="text-muted-foreground">
                  <p>{contact.email ?? "No email"}</p>
                  <p>{contact.phone ?? "No phone"}</p>
                </div>
                <div className="flex items-center gap-1">
                  <ContactSheet contact={contact} customerId={customer.id} />
                  <RemoveContactDialog contact={contact} customerId={customer.id} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              {contactsResult.ok ? "No contacts yet." : contactsResult.error.message}
            </p>
          )}
        </div>
      </section>

      <section className="rounded-md border bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-sm font-medium">Addresses</h2>
          <AddressSheet customerId={customer.id} />
        </div>
        <Separator className="my-3" />
        <div className="flex flex-col gap-2">
          {addressesResult.ok && addressesResult.data.length > 0 ? (
            addressesResult.data.map((address) => (
              <div
                className="grid gap-2 rounded-md border p-3 text-sm md:grid-cols-[1fr_1fr_auto]"
                key={address.id}
              >
                <div>
                  <p className="font-medium">{address.type}</p>
                  <p className="text-xs text-muted-foreground">
                    {address.isDefault ? "Default" : "Secondary"}
                  </p>
                </div>
                <div className="text-muted-foreground">
                  <p>
                    {[address.line1, address.line2].filter(Boolean).join(", ") || "No street line"}
                  </p>
                  <p>
                    {[address.city, address.state, address.country].filter(Boolean).join(", ") ||
                      "No location"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <AddressSheet address={address} customerId={customer.id} />
                  <RemoveAddressDialog address={address} customerId={customer.id} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              {addressesResult.ok ? "No addresses yet." : addressesResult.error.message}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
