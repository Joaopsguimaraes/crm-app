export const customerCacheTags = {
  list: "customers:list",
  listForParams: (paramsKey: string) => `customers:list:${paramsKey}`,
  detail: (customerId: string) => `customers:${customerId}`,
  contacts: (customerId: string) => `customers:${customerId}:contacts`,
  addresses: (customerId: string) => `customers:${customerId}:addresses`
} as const;

export function customerListParamsKey(params: {
  search?: string;
  status: string[];
  includeArchived: boolean;
  page: number;
  pageSize: number;
  sort: string;
}): string {
  return [
    params.search ?? "",
    params.status.join(","),
    params.includeArchived ? "with-archived" : "active-scope",
    String(params.page),
    String(params.pageSize),
    params.sort
  ].join("|");
}
