import "server-only";

import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import {
  addressInputSchema,
  createContactInputSchema,
  createCustomerInputSchema,
  customerAddressSchema,
  customerContactSchema,
  customerListResponseSchema,
  customerSchema,
  type AddressInput,
  type CreateContactInput,
  type CreateCustomerInput,
  type Customer,
  type CustomerAddress,
  type CustomerContact,
  type CustomerListParams,
  type CustomerListResponse,
  type CustomerStatus,
  type UpdateContactInput,
  type UpdateCustomerInput,
  updateContactInputSchema,
  updateCustomerInputSchema
} from "@/features/customers/contracts";
import { customerCacheTags, customerListParamsKey } from "@/features/customers/server/cache-tags";
import { z } from "zod";

export type CustomerApiErrorCode = "config" | "validation" | "not_found" | "domain" | "unexpected";

export type CustomerApiError = {
  code: CustomerApiErrorCode;
  message: string;
  fieldErrors?: Record<string, string[]>;
  status?: number;
};

export type CustomerApiResult<TData> =
  | {
      ok: true;
      data: TData;
    }
  | {
      ok: false;
      error: CustomerApiError;
    };

const errorBodySchema = z.looseObject({
    message: z.union([z.string(), z.array(z.string())]).optional(),
    error: z.string().optional(),
    statusCode: z.number().optional()
  });

function apiBaseUrl(): CustomerApiResult<URL> {
  const configuredUrl = process.env.CRM_API_URL;

  if (!configuredUrl) {
    return {
      ok: false,
      error: {
        code: "config",
        message: "CRM_API_URL is required to load Customer data."
      }
    };
  }

  try {
    return { ok: true, data: new URL(configuredUrl) };
  } catch {
    return {
      ok: false,
      error: {
        code: "config",
        message: "CRM_API_URL must be a valid URL."
      }
    };
  }
}

function endpoint(path: string, params?: URLSearchParams): CustomerApiResult<string> {
  const baseResult = apiBaseUrl();

  if (!baseResult.ok) {
    return baseResult;
  }

  const url = new URL(path, baseResult.data);

  if (params) {
    url.search = params.toString();
  }

  return { ok: true, data: url.toString() };
}

function mapHttpError(status: number, body: unknown): CustomerApiError {
  const parsedBody = errorBodySchema.safeParse(body);
  const bodyMessage = parsedBody.success ? parsedBody.data.message : undefined;
  const message = Array.isArray(bodyMessage) ? bodyMessage.join(" ") : bodyMessage;

  if (status === 400) {
    return {
      code: "validation",
      message: message ?? "The Customer request is invalid.",
      status
    };
  }

  if (status === 404) {
    return {
      code: "not_found",
      message: "Customer record was not found.",
      status
    };
  }

  if (status >= 400 && status < 500) {
    return {
      code: "domain",
      message: message ?? "The Customer request could not be completed.",
      status
    };
  }

  return {
    code: "unexpected",
    message: "Customer service is unavailable.",
    status
  };
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const text = await response.text();

  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

async function request<TData>(
  path: string,
  schema: z.ZodType<TData>,
  init?: RequestInit,
  params?: URLSearchParams
): Promise<CustomerApiResult<TData>> {
  const endpointResult = endpoint(path, params);

  if (!endpointResult.ok) {
    return endpointResult;
  }

  let response: Response;

  try {
    const headers = new Headers(init?.headers);
    headers.set("Accept", "application/json");

    if (init?.body) {
      headers.set("Content-Type", "application/json");
    }

    response = await fetch(endpointResult.data, {
      ...init,
      headers
    });
  } catch {
    return {
      ok: false,
      error: {
        code: "unexpected",
        message: "Customer service could not be reached."
      }
    };
  }

  const body = await parseResponseBody(response);

  if (!response.ok) {
    return { ok: false, error: mapHttpError(response.status, body) };
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: "unexpected",
        message: "Customer service returned an unexpected response."
      }
    };
  }

  return { ok: true, data: parsed.data };
}

const emptyResponseSchema = z.undefined();

function jsonBody(input: unknown): string {
  return JSON.stringify(input);
}

export async function listCustomers(params: CustomerListParams): Promise<CustomerApiResult<CustomerListResponse>> {
  "use cache";

  cacheTag(customerCacheTags.list);
  cacheTag(customerCacheTags.listForParams(customerListParamsKey(params)));

  const searchParams = new URLSearchParams({
    status: params.status.join(","),
    includeArchived: String(params.includeArchived),
    page: String(params.page),
    pageSize: String(params.pageSize),
    sort: params.sort
  });

  if (params.search) {
    searchParams.set("search", params.search);
  }

  return request("/customers", customerListResponseSchema, {}, searchParams);
}

export async function getCustomer(customerId: string): Promise<CustomerApiResult<Customer>> {
  "use cache";

  cacheTag(customerCacheTags.detail(customerId));

  return request(`/customers/${customerId}`, customerSchema);
}

export async function createCustomer(input: CreateCustomerInput): Promise<CustomerApiResult<Customer>> {
  const parsed = createCustomerInputSchema.parse(input);

  return request("/customers", customerSchema, {
    body: jsonBody(parsed),
    method: "POST"
  });
}

export async function updateCustomerFields(
  customerId: string,
  input: UpdateCustomerInput
): Promise<CustomerApiResult<Customer>> {
  const parsed = updateCustomerInputSchema.parse(input);

  return request(`/customers/${customerId}`, customerSchema, {
    body: jsonBody(parsed),
    method: "PATCH"
  });
}

export async function updateCustomerStatus(
  customerId: string,
  status: CustomerStatus
): Promise<CustomerApiResult<Customer>> {
  return request(`/customers/${customerId}/status`, customerSchema, {
    body: jsonBody({ status }),
    method: "PATCH"
  });
}

export async function archiveCustomer(customerId: string): Promise<CustomerApiResult<Customer>> {
  return request(`/customers/${customerId}/archive`, customerSchema, { method: "POST" });
}

export async function unarchiveCustomer(customerId: string): Promise<CustomerApiResult<Customer>> {
  return request(`/customers/${customerId}/unarchive`, customerSchema, { method: "POST" });
}

export async function listCustomerContacts(customerId: string): Promise<CustomerApiResult<CustomerContact[]>> {
  "use cache";

  cacheTag(customerCacheTags.contacts(customerId));

  return request(`/customers/${customerId}/contacts`, z.array(customerContactSchema));
}

export async function createCustomerContact(
  customerId: string,
  input: CreateContactInput
): Promise<CustomerApiResult<CustomerContact>> {
  const parsed = createContactInputSchema.parse(input);

  return request(`/customers/${customerId}/contacts`, customerContactSchema, {
    body: jsonBody(parsed),
    method: "POST"
  });
}

export async function updateCustomerContact(
  customerId: string,
  contactId: string,
  input: UpdateContactInput
): Promise<CustomerApiResult<CustomerContact>> {
  const parsed = updateContactInputSchema.parse(input);

  return request(`/customers/${customerId}/contacts/${contactId}`, customerContactSchema, {
    body: jsonBody(parsed),
    method: "PATCH"
  });
}

export async function removeCustomerContact(customerId: string, contactId: string): Promise<CustomerApiResult<void>> {
  return request(`/customers/${customerId}/contacts/${contactId}`, emptyResponseSchema, { method: "DELETE" });
}

export async function listCustomerAddresses(customerId: string): Promise<CustomerApiResult<CustomerAddress[]>> {
  "use cache";

  cacheTag(customerCacheTags.addresses(customerId));

  return request(`/customers/${customerId}/addresses`, z.array(customerAddressSchema));
}

export async function createCustomerAddress(
  customerId: string,
  input: AddressInput
): Promise<CustomerApiResult<CustomerAddress>> {
  const parsed = addressInputSchema.parse(input);

  return request(`/customers/${customerId}/addresses`, customerAddressSchema, {
    body: jsonBody(parsed),
    method: "POST"
  });
}

export async function updateCustomerAddress(
  customerId: string,
  addressId: string,
  input: AddressInput
): Promise<CustomerApiResult<CustomerAddress>> {
  const parsed = addressInputSchema.parse(input);

  return request(`/customers/${customerId}/addresses/${addressId}`, customerAddressSchema, {
    body: jsonBody(parsed),
    method: "PATCH"
  });
}

export async function removeCustomerAddress(customerId: string, addressId: string): Promise<CustomerApiResult<void>> {
  return request(`/customers/${customerId}/addresses/${addressId}`, emptyResponseSchema, { method: "DELETE" });
}
