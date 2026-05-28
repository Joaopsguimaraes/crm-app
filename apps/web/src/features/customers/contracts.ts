import { z } from "zod";

export const customerStatuses = ["active", "inactive", "archived", "blocked"] as const;
export const customerContactRoles = ["commercial", "financial", "other"] as const;
export const customerAddressTypes = ["main", "shipping", "billing", "other"] as const;
export const pageSizeOptions = [25, 50, 100] as const;
export const customerSortOptions = ["name", "createdAt"] as const;
export const editableCustomerFields = ["name", "email", "phone", "status"] as const;

export type CustomerStatus = (typeof customerStatuses)[number];
export type CustomerContactRole = (typeof customerContactRoles)[number];
export type CustomerAddressType = (typeof customerAddressTypes)[number];
export type CustomerSort = (typeof customerSortOptions)[number];
export type EditableCustomerField = (typeof editableCustomerFields)[number];

const emptyStringToUndefined = (value: unknown): unknown => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const optionalTrimmedString = (maxLength: number) =>
  z.preprocess(emptyStringToUndefined, z.string().trim().max(maxLength).optional());

const nullableString = z.string().nullable();
const isoDateString = z.iso.datetime();

export const customerCompletenessSchema = z.object({
  hasPrimaryChannel: z.boolean(),
  hasAddress: z.boolean(),
  pending: z.array(z.string())
});

export const customerDuplicateSignalSchema = z.object({
  customerId: z.uuid(),
  fields: z.array(z.string())
});

export const customerSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  status: z.enum(customerStatuses),
  email: nullableString,
  phone: nullableString,
  notes: nullableString,
  completeness: customerCompletenessSchema,
  duplicateSignals: z.array(customerDuplicateSignalSchema),
  createdAt: isoDateString,
  updatedAt: isoDateString,
  archivedAt: isoDateString.nullable()
});

export const customerPaginationSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1).max(100),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasMore: z.boolean()
});

export const customerListResponseSchema = z.object({
  data: z.array(customerSchema),
  pagination: customerPaginationSchema
});

export const customerContactSchema = z.object({
  id: z.uuid(),
  customerId: z.uuid(),
  name: z.string(),
  role: z.enum(customerContactRoles),
  email: nullableString,
  phone: nullableString,
  notes: nullableString,
  createdAt: isoDateString,
  updatedAt: isoDateString
});

export const customerAddressSchema = z.object({
  id: z.uuid(),
  customerId: z.uuid(),
  type: z.enum(customerAddressTypes),
  isDefault: z.boolean(),
  line1: nullableString,
  line2: nullableString,
  city: nullableString,
  state: nullableString,
  postalCode: nullableString,
  country: nullableString,
  createdAt: isoDateString,
  updatedAt: isoDateString
});

export const createCustomerInputSchema = z.object({
  name: z.preprocess(emptyStringToUndefined, z.string().trim().min(1, "Name is required.").max(200)),
  email: optionalTrimmedString(320).pipe(z.email("Enter a valid email.").optional()),
  phone: optionalTrimmedString(50)
});

export const updateCustomerInputSchema = z.object({
  name: optionalTrimmedString(200),
  email: optionalTrimmedString(320).pipe(z.email("Enter a valid email.").optional()),
  phone: optionalTrimmedString(50),
  notes: optionalTrimmedString(2_000)
});

export const customerInlineFieldSchema = z.discriminatedUnion("field", [
  z.object({
    customerId: z.uuid(),
    field: z.literal("name"),
    value: z.preprocess(emptyStringToUndefined, z.string().trim().min(1, "Name is required.").max(200))
  }),
  z.object({
    customerId: z.uuid(),
    field: z.literal("email"),
    value: optionalTrimmedString(320).pipe(z.email("Enter a valid email.").optional())
  }),
  z.object({
    customerId: z.uuid(),
    field: z.literal("phone"),
    value: optionalTrimmedString(50)
  }),
  z.object({
    customerId: z.uuid(),
    field: z.literal("status"),
    value: z.enum(customerStatuses)
  })
]);

export const createContactInputSchema = z.object({
  name: z.preprocess(emptyStringToUndefined, z.string().trim().min(1, "Name is required.").max(200)),
  role: z.enum(customerContactRoles).optional(),
  email: optionalTrimmedString(320).pipe(z.email("Enter a valid email.").optional()),
  phone: optionalTrimmedString(50),
  notes: optionalTrimmedString(1_000)
});

export const updateContactInputSchema = createContactInputSchema.partial().extend({
  name: optionalTrimmedString(200)
});

export const addressInputSchema = z.object({
  type: z.enum(customerAddressTypes).optional(),
  isDefault: z.boolean().optional(),
  line1: optionalTrimmedString(200),
  line2: optionalTrimmedString(200),
  city: optionalTrimmedString(120),
  state: optionalTrimmedString(80),
  postalCode: optionalTrimmedString(30),
  country: optionalTrimmedString(80)
});

export type Customer = z.infer<typeof customerSchema>;
export type CustomerListResponse = z.infer<typeof customerListResponseSchema>;
export type CustomerContact = z.infer<typeof customerContactSchema>;
export type CustomerAddress = z.infer<typeof customerAddressSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerInputSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerInputSchema>;
export type CreateContactInput = z.infer<typeof createContactInputSchema>;
export type UpdateContactInput = z.infer<typeof updateContactInputSchema>;
export type AddressInput = z.infer<typeof addressInputSchema>;

export type ActionState<TData = unknown> = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
  data?: TData;
};

type SearchParamValue = string | string[] | undefined;

export type CustomerListParams = {
  search?: string;
  status: CustomerStatus[];
  includeArchived: boolean;
  page: number;
  pageSize: (typeof pageSizeOptions)[number];
  sort: CustomerSort;
};

const firstParam = (value: SearchParamValue): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const allParamValues = (value: SearchParamValue): string[] => {
  if (Array.isArray(value)) {
    return value;
  }

  return value ? value.split(",") : [];
};

const toBoundedPage = (value: SearchParamValue): number => {
  const parsed = Number(firstParam(value));
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
};

const toPageSize = (value: SearchParamValue): (typeof pageSizeOptions)[number] => {
  const parsed = Number(firstParam(value));
  return pageSizeOptions.includes(parsed as (typeof pageSizeOptions)[number])
    ? (parsed as (typeof pageSizeOptions)[number])
    : 25;
};

export function normalizeCustomerListParams(params: Record<string, SearchParamValue>): CustomerListParams {
  const search = firstParam(params.search)?.trim();
  const statuses = allParamValues(params.status).filter((status): status is CustomerStatus =>
    customerStatuses.includes(status as CustomerStatus)
  );
  const sort = firstParam(params.sort);

  return {
    search: search ? search.slice(0, 200) : undefined,
    status: statuses.length > 0 ? statuses : ["active"],
    includeArchived: firstParam(params.includeArchived) === "true",
    page: toBoundedPage(params.page),
    pageSize: toPageSize(params.pageSize),
    sort: customerSortOptions.includes(sort as CustomerSort) ? (sort as CustomerSort) : "name"
  };
}
