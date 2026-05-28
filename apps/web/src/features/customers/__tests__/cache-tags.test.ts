import { describe, expect, it } from "vitest";
import { customerCacheTags, customerListParamsKey } from "@/features/customers/server/cache-tags";

describe("Customer cache tags", () => {
  it("builds stable cache tags", () => {
    expect(customerCacheTags.detail("customer-id")).toBe("customers:customer-id");
    expect(customerCacheTags.contacts("customer-id")).toBe("customers:customer-id:contacts");
    expect(customerCacheTags.addresses("customer-id")).toBe("customers:customer-id:addresses");
  });

  it("builds a stable list params key", () => {
    expect(
      customerListParamsKey({
        includeArchived: false,
        page: 2,
        pageSize: 50,
        search: "ACME",
        sort: "name",
        status: ["active", "blocked"]
      })
    ).toBe("ACME|active,blocked|active-scope|2|50|name");
  });
});
