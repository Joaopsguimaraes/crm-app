"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  IconArrowsSort,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconChevronUp,
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type DataTablePagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowId: (row: TData) => string;
  pagination: DataTablePagination;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  pageHref: (page: number) => string;
  pageSizeHref?: (pageSize: number) => string;
  pageSizeOptions?: readonly number[];
  toolbar?: (tableState: {
    selectedIds: string[];
    clearSelection: () => void;
    columnOptions: ReactNode;
  }) => ReactNode;
  footer?: ReactNode;
  emptyState?: ReactNode;
  className?: string;
  rowClassName?: (row: TData) => string | undefined;
};

type PaginationIconButtonProps = {
  "aria-label": string;
  disabled: boolean;
  href: string;
  icon: ReactNode;
};

function PaginationIconButton({
  "aria-label": ariaLabel,
  disabled,
  href,
  icon,
}: PaginationIconButtonProps) {
  if (disabled) {
    return (
      <Button aria-label={ariaLabel} disabled size="icon-sm" type="button" variant="outline">
        {icon}
      </Button>
    );
  }

  return (
    <Button asChild aria-label={ariaLabel} size="icon-sm" variant="outline">
      <a href={href}>{icon}</a>
    </Button>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  getRowId,
  pagination,
  sorting,
  onSortingChange,
  pageHref,
  pageSizeHref,
  pageSizeOptions,
  toolbar,
  footer,
  emptyState,
  className,
  rowClassName,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const selectedIds = useMemo(
    () => Object.keys(rowSelection).filter((id) => rowSelection[id]),
    [rowSelection],
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
    manualPagination: true,
    manualSorting: true,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange,
    pageCount: pagination.totalPages,
    state: {
      columnVisibility,
      rowSelection,
      sorting,
    },
  });

  const columnOptions = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          Options
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              checked={column.getIsVisible()}
              key={column.id}
              onCheckedChange={(value) => column.toggleVisibility(value)}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
  const firstPage = 1;
  const lastPage = Math.max(pagination.totalPages, 1);
  const previousPage = Math.max(firstPage, pagination.page - 1);
  const nextPage = Math.min(lastPage, pagination.page + 1);
  const isFirstPage = pagination.page <= firstPage;
  const isLastPage = pagination.page >= lastPage;

  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-border/80 bg-card/95 shadow-[0_18px_55px_-38px_oklch(0.2_0_0)] backdrop-blur-xl",
        className,
      )}
    >
      {toolbar ? (
        <div className="border-b border-border/70 bg-card/70 px-3 py-2">
          {toolbar({ selectedIds, clearSelection: () => setRowSelection({}), columnOptions })}
        </div>
      ) : (
        <div className="flex justify-end border-b border-border/70 bg-card/70 px-3 py-2">
          {columnOptions}
        </div>
      )}
      <div className="overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/45">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();

                  return (
                    <TableHead
                      className="h-8 border-r border-border/55 text-muted-foreground last:border-r-0"
                      key={header.id}
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <Button
                          className="-ml-2"
                          onClick={header.column.getToggleSortingHandler()}
                          size="sm"
                          type="button"
                          variant="ghost"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sorted === "asc" ? (
                            <IconChevronUp data-icon="inline-end" />
                          ) : sorted === "desc" ? (
                            <IconChevronDown data-icon="inline-end" />
                          ) : (
                            <IconArrowsSort data-icon="inline-end" />
                          )}
                        </Button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className={cn("hover:bg-muted/35", rowClassName?.(row.original))}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className="h-8 border-r border-border/40 py-1.5 last:border-r-0"
                      key={cell.id}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-32 text-center text-muted-foreground"
                  colSpan={columns.length}
                >
                  {emptyState ?? "No records found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 bg-card/70 px-3 py-2 text-xs text-muted-foreground">
        <span>
          {selectedIds.length} of {pagination.total} row(s) selected.
        </span>
        <div className="flex flex-wrap items-center gap-4">
          {pageSizeHref && pageSizeOptions ? (
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">Rows per page</span>
              <Select
                onValueChange={(value) => {
                  window.location.href = pageSizeHref(Number(value));
                }}
                value={String(pagination.pageSize)}
              >
                <SelectTrigger aria-label="Rows per page" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectGroup>
                    {pageSizeOptions.map((pageSize) => (
                      <SelectItem key={pageSize} value={String(pageSize)}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ) : null}
          <span className="font-medium text-foreground">
            Page {pagination.page} of {lastPage}
          </span>
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationIconButton
                  aria-label="Go to first page"
                  disabled={isFirstPage}
                  href={pageHref(firstPage)}
                  icon={<IconChevronsLeft />}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationIconButton
                  aria-label="Go to previous page"
                  disabled={isFirstPage}
                  href={pageHref(previousPage)}
                  icon={<IconChevronLeft />}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationIconButton
                  aria-label="Go to next page"
                  disabled={isLastPage}
                  href={pageHref(nextPage)}
                  icon={<IconChevronRight />}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationIconButton
                  aria-label="Go to last page"
                  disabled={isLastPage}
                  href={pageHref(lastPage)}
                  icon={<IconChevronsRight />}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      {footer ? <div className="border-t">{footer}</div> : null}
    </section>
  );
}
