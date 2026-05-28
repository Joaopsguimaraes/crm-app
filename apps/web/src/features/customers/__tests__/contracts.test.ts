import { describe, expect, it } from "vitest";
import { createCustomerInputSchema, normalizeCustomerListParams } from "@/features/customers/contracts";

describe("Customer contracts", () => {
  it("normalizes list params to active records by default", () => {
    expect(normalizeCustomerListParams({})).toEqual({
      includeArchived: false,
      page: 1,
      pageSize: 25,
      search: undefined,
      sort: "name",
      status: ["active"]
    });
  });

  it("bounds list params and accepts comma-separated statuses", () => {
    expect(
      normalizeCustomerListParams({
        includeArchived: "true",
        page: "-2",
        pageSize: "500",
        search: "  ACME  ",
        sort: "createdAt",
        status: "active,blocked,unknown"
      })
    ).toEqual({
      includeArchived: true,
      page: 1,
      pageSize: 25,
      search: "ACME",
      sort: "createdAt",
      status: ["active", "blocked"]
    });
  });

  it("validates progressive customer create payloads", () => {
    expect(createCustomerInputSchema.parse({ name: "  ACME  ", email: "", phone: "" })).toEqual({
      name: "ACME",
      email: undefined,
      phone: undefined
    });

    expect(createCustomerInputSchema.safeParse({ name: "", email: "bad", phone: "" }).success).toBe(false);
  });
});
