"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import {
  addressInputSchema,
  createContactInputSchema,
  createCustomerInputSchema,
  customerInlineFieldSchema,
  type ActionState,
  type Customer,
  type CustomerStatus
} from "@/features/customers/contracts";
import {
  archiveCustomer,
  createCustomer,
  createCustomerAddress,
  createCustomerContact,
  removeCustomerAddress,
  removeCustomerContact,
  unarchiveCustomer,
  updateCustomerAddress,
  updateCustomerContact,
  updateCustomerFields,
  updateCustomerStatus
} from "@/features/customers/server/api";
import { customerCacheTags } from "@/features/customers/server/cache-tags";
import { z } from "zod";

const idSchema = z.uuid();

function formString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

function checkboxValue(formData: FormData, key: string): boolean | undefined {
  if (!formData.has(key)) {
    return undefined;
  }

  return formData.get(key) === "on" || formData.get(key) === "true";
}

function validationState<TData = unknown>(error: z.ZodError): ActionState<TData> {
  return {
    ok: false,
    message: "Check the highlighted fields.",
    fieldErrors: z.flattenError(error).fieldErrors
  };
}

function resultState<TData>(result: { ok: true; data: TData } | { ok: false; error: { message: string } }): ActionState<TData> {
  if (result.ok) {
    return { ok: true, data: result.data };
  }

  return { ok: false, message: result.error.message };
}

function revalidateCustomer(customerId?: string): void {
  revalidateTag(customerCacheTags.list, "max");

  if (customerId) {
    revalidateTag(customerCacheTags.detail(customerId), "max");
  }
}

function revalidateNested(customerId: string, nestedTag: string): void {
  revalidateTag(nestedTag, "max");
  revalidateTag(customerCacheTags.detail(customerId), "max");
}

export async function createCustomerAction(_previousState: ActionState<Customer>, formData: FormData): Promise<ActionState<Customer>> {
  const parsed = createCustomerInputSchema.safeParse({
    name: formString(formData, "name"),
    email: formString(formData, "email"),
    phone: formString(formData, "phone")
  });

  if (!parsed.success) {
    return validationState<Customer>(parsed.error);
  }

  const result = await createCustomer(parsed.data);

  if (!result.ok) {
    return resultState(result);
  }

  revalidateCustomer(result.data.id);
  revalidatePath("/customers");

  return { ok: true, data: result.data };
}

export async function updateCustomerFieldAction(input: {
  customerId: string;
  field: "name" | "email" | "phone" | "status";
  value: string;
}): Promise<ActionState<Customer>> {
  const parsed = customerInlineFieldSchema.safeParse(input);

  if (!parsed.success) {
    return validationState<Customer>(parsed.error);
  }

  const result =
    parsed.data.field === "status"
      ? await updateCustomerStatus(parsed.data.customerId, parsed.data.value)
      : await updateCustomerFields(parsed.data.customerId, { [parsed.data.field]: parsed.data.value });

  if (result.ok) {
    revalidateCustomer(parsed.data.customerId);
  }

  return resultState(result);
}

export async function archiveCustomerAction(formData: FormData): Promise<void> {
  const customerId = idSchema.parse(formString(formData, "customerId"));
  const result = await archiveCustomer(customerId);

  if (result.ok) {
    revalidateCustomer(customerId);
    revalidatePath("/customers");
  }
}

export async function unarchiveCustomerAction(formData: FormData): Promise<void> {
  const customerId = idSchema.parse(formString(formData, "customerId"));
  const result = await unarchiveCustomer(customerId);

  if (result.ok) {
    revalidateCustomer(customerId);
    revalidatePath("/customers");
  }
}

export async function bulkArchiveCustomersAction(customerIds: string[]): Promise<ActionState<{ archived: number }>> {
  const ids = z.array(idSchema).min(1, "Select at least one customer.").safeParse(customerIds);

  if (!ids.success) {
    return validationState<{ archived: number }>(ids.error);
  }

  const results = await Promise.all(ids.data.map((customerId) => archiveCustomer(customerId)));
  const failed = results.find((result) => !result.ok);

  if (failed !== undefined) {
    return resultState(failed);
  }

  for (const customerId of ids.data) {
    revalidateCustomer(customerId);
  }

  revalidatePath("/customers");
  return { ok: true, data: { archived: ids.data.length } };
}

export async function bulkUpdateCustomerStatusAction(
  customerIds: string[],
  status: CustomerStatus
): Promise<ActionState<{ updated: number }>> {
  const parsed = z.object({ customerIds: z.array(idSchema).min(1), status: z.enum(["active", "inactive", "archived", "blocked"]) }).safeParse({
    customerIds,
    status
  });

  if (!parsed.success) {
    return validationState<{ updated: number }>(parsed.error);
  }

  const results = await Promise.all(
    parsed.data.customerIds.map((customerId) => updateCustomerStatus(customerId, parsed.data.status))
  );
  const failed = results.find((result) => !result.ok);

  if (failed !== undefined) {
    return resultState(failed);
  }

  for (const customerId of parsed.data.customerIds) {
    revalidateCustomer(customerId);
  }

  revalidatePath("/customers");
  return { ok: true, data: { updated: parsed.data.customerIds.length } };
}

export async function saveContactAction(_previousState: ActionState, formData: FormData): Promise<ActionState> {
  const customerId = idSchema.parse(formString(formData, "customerId"));
  const contactId = formString(formData, "contactId");
  const parsed = createContactInputSchema.safeParse({
    name: formString(formData, "name"),
    role: formString(formData, "role") ?? undefined,
    email: formString(formData, "email"),
    phone: formString(formData, "phone"),
    notes: formString(formData, "notes")
  });

  if (!parsed.success) {
    return validationState(parsed.error);
  }

  const result = contactId
    ? await updateCustomerContact(customerId, idSchema.parse(contactId), parsed.data)
    : await createCustomerContact(customerId, parsed.data);

  if (result.ok) {
    revalidateNested(customerId, customerCacheTags.contacts(customerId));
  }

  return resultState(result);
}

export async function removeContactAction(formData: FormData): Promise<void> {
  const customerId = idSchema.parse(formString(formData, "customerId"));
  const contactId = idSchema.parse(formString(formData, "contactId"));
  const result = await removeCustomerContact(customerId, contactId);

  if (result.ok) {
    revalidateNested(customerId, customerCacheTags.contacts(customerId));
  }
}

export async function saveAddressAction(_previousState: ActionState, formData: FormData): Promise<ActionState> {
  const customerId = idSchema.parse(formString(formData, "customerId"));
  const addressId = formString(formData, "addressId");
  const parsed = addressInputSchema.safeParse({
    type: formString(formData, "type") ?? undefined,
    isDefault: checkboxValue(formData, "isDefault"),
    line1: formString(formData, "line1"),
    line2: formString(formData, "line2"),
    city: formString(formData, "city"),
    state: formString(formData, "state"),
    postalCode: formString(formData, "postalCode"),
    country: formString(formData, "country")
  });

  if (!parsed.success) {
    return validationState(parsed.error);
  }

  const result = addressId
    ? await updateCustomerAddress(customerId, idSchema.parse(addressId), parsed.data)
    : await createCustomerAddress(customerId, parsed.data);

  if (result.ok) {
    revalidateNested(customerId, customerCacheTags.addresses(customerId));
  }

  return resultState(result);
}

export async function removeAddressAction(formData: FormData): Promise<void> {
  const customerId = idSchema.parse(formString(formData, "customerId"));
  const addressId = idSchema.parse(formString(formData, "addressId"));
  const result = await removeCustomerAddress(customerId, addressId);

  if (result.ok) {
    revalidateNested(customerId, customerCacheTags.addresses(customerId));
  }
}
