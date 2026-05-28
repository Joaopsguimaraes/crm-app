"use client";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  IconArchive,
  IconBuilding,
  IconExternalLink,
  IconFilter,
  IconSearch,
  IconSortAscending,
} from "@tabler/icons-react";
import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { EditableCell } from "@/components/data-table/editable-cell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  bulkArchiveCustomersAction,
  bulkUpdateCustomerStatusAction,
  updateCustomerFieldAction,
} from "@/features/customers/server/actions";
import {
  customerStatuses,
  pageSizeOptions,
  type Customer,
  type CustomerListParams,
  type CustomerListResponse,
  type CustomerStatus,
} from "@/features/customers/contracts";
import { CustomerCreateSheet } from "@/features/customers/components/customer-create-sheet";
import { statusLabels } from "@/features/customers/components/status-badge";

type CustomerListClientProps = {
  response: CustomerListResponse;
  params: CustomerListParams;
};

function searchParamsFor(params: CustomerListParams, patch: Partial<CustomerListParams>): string {
  const nextParams = { ...params, ...patch };
  const searchParams = new URLSearchParams({
    status: nextParams.status.join(","),
    includeArchived: String(nextParams.includeArchived),
    page: String(nextParams.page),
    pageSize: String(nextParams.pageSize),
    sort: nextParams.sort,
  });

  if (nextParams.search) {
    searchParams.set("search", nextParams.search);
  }

  return `/customers?${searchParams.toString()}`;
}

function statusValueFor(params: CustomerListParams): string {
  return params.status.join(",");
}

function inlineFieldValue(
  customer: Customer,
  field: "name" | "email" | "phone" | "status",
): string {
  const value = customer[field];
  return value ?? "";
}

type CustomerToolbarProps = {
  params: CustomerListParams;
  pagination: CustomerListResponse["pagination"];
  selectedIds: string[];
  clearSelection: () => void;
  columnOptions: ReactNode;
  bulkStatus: CustomerStatus;
  isPending: boolean;
  onBulkStatusChange: (status: CustomerStatus) => void;
  onArchiveSelected: () => void;
  onApplyStatus: () => void;
};

function CustomerToolbar({
  params,
  pagination,
  selectedIds,
  clearSelection,
  columnOptions,
  bulkStatus,
  isPending,
  onBulkStatusChange,
  onArchiveSelected,
  onApplyStatus,
}: CustomerToolbarProps) {
  const currentStatusValue = statusValueFor(params);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex min-w-48 items-center gap-2">
        <span className="flex size-5 items-center justify-center rounded-sm bg-blue-100 text-blue-700 ring-1 ring-blue-200">
          <IconBuilding className="size-3.5" />
        </span>
        <div className="flex items-baseline gap-1.5">
          <h1 className="text-sm font-medium text-foreground">Companies</h1>
          <span className="text-xs text-muted-foreground">{pagination.total}</span>
        </div>
      </div>

      <form
        action="/customers"
        className="flex min-w-56 flex-1 items-center gap-1.5 sm:max-w-xs"
        method="get"
      >
        <div className="relative flex-1">
          <IconSearch className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-7 border-transparent bg-muted/70 pl-7 shadow-none focus-visible:bg-background"
            defaultValue={params.search}
            name="search"
            placeholder="Search companies"
          />
        </div>
        <input name="status" type="hidden" value={currentStatusValue} />
        <input name="includeArchived" type="hidden" value={String(params.includeArchived)} />
        <input name="page" type="hidden" value="1" />
        <input name="pageSize" type="hidden" value={params.pageSize} />
        <input name="sort" type="hidden" value={params.sort} />
        <Button aria-label="Search customers" size="icon-sm" type="submit" variant="outline">
          <IconSearch />
        </Button>
      </form>

      {selectedIds.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">{selectedIds.length} selected</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={isPending} size="sm" variant="destructive">
                <IconArchive data-icon="inline-start" />
                Archive
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Archive selected customers?</AlertDialogTitle>
                <AlertDialogDescription>
                  Archived customers leave the default operational list but remain available when
                  archived records are included.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onArchiveSelected} variant="destructive">
                  Archive
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Select
            onValueChange={(value) => onBulkStatusChange(value as CustomerStatus)}
            value={bulkStatus}
          >
            <SelectTrigger aria-label="Bulk status" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {customerStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {statusLabels[status]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            disabled={isPending}
            onClick={onApplyStatus}
            size="sm"
            type="button"
            variant="outline"
          >
            Apply status
          </Button>
          <Button
            disabled={isPending}
            onClick={clearSelection}
            size="sm"
            type="button"
            variant="ghost"
          >
            Clear
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost">
                <IconFilter data-icon="inline-start" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                onValueChange={(value) => {
                  window.location.href = searchParamsFor(params, {
                    page: 1,
                    status: value.split(",") as CustomerStatus[],
                  });
                }}
                value={currentStatusValue}
              >
                {customerStatuses.map((status) => (
                  <DropdownMenuRadioItem key={status} value={status}>
                    {statusLabels[status]}
                  </DropdownMenuRadioItem>
                ))}
                <DropdownMenuRadioItem value="active,inactive,blocked">
                  Operational
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={params.includeArchived}
                onCheckedChange={(checked) => {
                  window.location.href = searchParamsFor(params, {
                    includeArchived: checked,
                    page: 1,
                  });
                }}
              >
                Include archived
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost">
                <IconSortAscending data-icon="inline-start" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuRadioGroup
                onValueChange={(value) => {
                  window.location.href = searchParamsFor(params, {
                    page: 1,
                    sort: value === "createdAt" ? "createdAt" : "name",
                  });
                }}
                value={params.sort}
              >
                <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="createdAt">Created</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {columnOptions}

          <CustomerCreateSheet buttonSize="sm" buttonVariant="outline" label="New" />
        </div>
      )}
    </div>
  );
}

export function CustomerListClient({ response, params }: CustomerListClientProps) {
  const [bulkStatus, setBulkStatus] = useState<CustomerStatus>("inactive");
  const [recentlyUpdatedIds, setRecentlyUpdatedIds] = useState<Set<string>>(() => new Set());
  const [isPending, startTransition] = useTransition();
  const rowHighlightTimeouts = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const sorting = useMemo<SortingState>(() => [{ id: params.sort, desc: false }], [params.sort]);

  useEffect(() => {
    const timeouts = rowHighlightTimeouts.current;

    return () => {
      for (const timeout of timeouts.values()) {
        clearTimeout(timeout);
      }
      timeouts.clear();
    };
  }, []);

  const markCustomerUpdated = useCallback((customerId: string): void => {
    setRecentlyUpdatedIds((current) => {
      const next = new Set(current);
      next.add(customerId);
      return next;
    });

    const existingTimeout = rowHighlightTimeouts.current.get(customerId);

    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeout = setTimeout(() => {
      rowHighlightTimeouts.current.delete(customerId);
      setRecentlyUpdatedIds((current) => {
        if (!current.has(customerId)) {
          return current;
        }

        const next = new Set(current);
        next.delete(customerId);
        return next;
      });
    }, 3_000);

    rowHighlightTimeouts.current.set(customerId, timeout);
  }, []);

  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        id: "select",
        enableHiding: false,
        header: ({ table }) => (
          <Checkbox
            aria-label="Select all customers on this page"
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            aria-label={`Select ${row.original.name}`}
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
          />
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
        cell: ({ row }) => (
          <EditableCell
            label="Customer name"
            onSave={async (value) => {
              const result = await updateCustomerFieldAction({
                customerId: row.original.id,
                field: "name",
                value,
              });
              return { ok: result.ok, value: result.data?.name, message: result.message };
            }}
            onSaved={() => markCustomerUpdated(row.original.id)}
            validate={(value) => (value.trim().length > 0 ? undefined : "Name is required.")}
            value={row.original.name}
          />
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <EditableCell
            label="Customer email"
            onSave={async (value) => {
              const result = await updateCustomerFieldAction({
                customerId: row.original.id,
                field: "email",
                value,
              });
              return { ok: result.ok, value: result.data?.email ?? "", message: result.message };
            }}
            onSaved={() => markCustomerUpdated(row.original.id)}
            placeholder="No email"
            value={inlineFieldValue(row.original, "email")}
          />
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (
          <EditableCell
            label="Customer phone"
            onSave={async (value) => {
              const result = await updateCustomerFieldAction({
                customerId: row.original.id,
                field: "phone",
                value,
              });
              return { ok: result.ok, value: result.data?.phone ?? "", message: result.message };
            }}
            onSaved={() => markCustomerUpdated(row.original.id)}
            placeholder="No phone"
            value={inlineFieldValue(row.original, "phone")}
          />
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <EditableCell
            label="Customer status"
            onSave={async (value) => {
              const result = await updateCustomerFieldAction({
                customerId: row.original.id,
                field: "status",
                value,
              });
              return { ok: result.ok, value: result.data?.status, message: result.message };
            }}
            onSaved={() => markCustomerUpdated(row.original.id)}
            options={customerStatuses.map((status) => ({
              label: statusLabels[status],
              value: status,
            }))}
            value={row.original.status}
          />
        ),
      },
      {
        id: "signals",
        header: "Signals",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {!row.original.completeness.hasPrimaryChannel ? (
              <Badge variant="outline">Missing channel</Badge>
            ) : null}
            {!row.original.completeness.hasAddress ? (
              <Badge variant="outline">Missing address</Badge>
            ) : null}
            {row.original.duplicateSignals.length > 0 ? (
              <Badge variant="secondary">Duplicate signal</Badge>
            ) : null}
          </div>
        ),
      },
      {
        id: "details",
        enableHiding: false,
        header: "",
        cell: ({ row }) => (
          <Button asChild size="icon-sm" variant="ghost">
            <Link
              aria-label={`Open ${row.original.name}`}
              href={`/customers/${row.original.id}` as Route}
            >
              <IconExternalLink />
            </Link>
          </Button>
        ),
      },
    ],
    [markCustomerUpdated],
  );

  return (
    <DataTable
      columns={columns}
      data={response.data}
      emptyState="No customers match the current filters."
      getRowId={(customer) => customer.id}
      pageHref={(page) => searchParamsFor(params, { page })}
      pageSizeHref={(pageSize) =>
        searchParamsFor(params, { page: 1, pageSize: pageSize as CustomerListParams["pageSize"] })
      }
      pageSizeOptions={pageSizeOptions}
      pagination={response.pagination}
      rowClassName={(customer) =>
        recentlyUpdatedIds.has(customer.id) ? "bg-primary/10 hover:bg-primary/15" : undefined
      }
      sorting={sorting}
      onSortingChange={(updater) => {
        const nextSorting = typeof updater === "function" ? updater(sorting) : updater;
        const firstSort = nextSorting[0]?.id === "createdAt" ? "createdAt" : "name";
        window.location.href = searchParamsFor(params, { page: 1, sort: firstSort });
      }}
      toolbar={({ selectedIds, clearSelection, columnOptions }) => (
        <CustomerToolbar
          bulkStatus={bulkStatus}
          clearSelection={clearSelection}
          columnOptions={columnOptions}
          isPending={isPending}
          onApplyStatus={() => {
            startTransition(async () => {
              await bulkUpdateCustomerStatusAction(selectedIds, bulkStatus);
              clearSelection();
            });
          }}
          onArchiveSelected={() => {
            startTransition(async () => {
              await bulkArchiveCustomersAction(selectedIds);
              clearSelection();
            });
          }}
          onBulkStatusChange={setBulkStatus}
          pagination={response.pagination}
          params={params}
          selectedIds={selectedIds}
        />
      )}
    />
  );
}
