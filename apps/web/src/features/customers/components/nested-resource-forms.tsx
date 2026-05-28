"use client";

import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useActionState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  customerAddressTypes,
  customerContactRoles,
  type ActionState,
  type CustomerAddress,
  type CustomerContact
} from "@/features/customers/contracts";
import {
  removeAddressAction,
  removeContactAction,
  saveAddressAction,
  saveContactAction
} from "@/features/customers/server/actions";

const initialState: ActionState = { ok: false };

function SubmitButton({ label }: { label: string }) {
  return <Button type="submit">{label}</Button>;
}

export function ContactSheet({ customerId, contact }: { customerId: string; contact?: CustomerContact }) {
  const [state, formAction] = useActionState(saveContactAction, initialState);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={contact ? "icon-sm" : "sm"} variant={contact ? "ghost" : "outline"}>
          {contact ? <IconPencil /> : <IconPlus data-icon="inline-start" />}
          {contact ? <span className="sr-only">Edit contact</span> : "Add contact"}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{contact ? "Edit contact" : "Add contact"}</SheetTitle>
          <SheetDescription>Contacts stay scoped to this Customer record.</SheetDescription>
        </SheetHeader>
        <form action={formAction} className="px-4 pb-4">
          <input name="customerId" type="hidden" value={customerId} />
          {contact ? <input name="contactId" type="hidden" value={contact.id} /> : null}
          <FieldGroup>
            <Field data-invalid={Boolean(state.fieldErrors?.name)}>
              <FieldLabel htmlFor={`contact-name-${contact?.id ?? "new"}`}>Name</FieldLabel>
              <Input
                aria-invalid={Boolean(state.fieldErrors?.name)}
                defaultValue={contact?.name}
                id={`contact-name-${contact?.id ?? "new"}`}
                name="name"
                required
              />
              <FieldError errors={state.fieldErrors?.name?.map((message) => ({ message }))} />
            </Field>
            <Field>
              <FieldLabel>Role</FieldLabel>
              <Select defaultValue={contact?.role ?? "commercial"} name="role">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {customerContactRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor={`contact-email-${contact?.id ?? "new"}`}>Email</FieldLabel>
              <Input defaultValue={contact?.email ?? ""} id={`contact-email-${contact?.id ?? "new"}`} name="email" type="email" />
            </Field>
            <Field>
              <FieldLabel htmlFor={`contact-phone-${contact?.id ?? "new"}`}>Phone</FieldLabel>
              <Input defaultValue={contact?.phone ?? ""} id={`contact-phone-${contact?.id ?? "new"}`} name="phone" />
            </Field>
            <Field>
              <FieldLabel htmlFor={`contact-notes-${contact?.id ?? "new"}`}>Notes</FieldLabel>
              <Textarea defaultValue={contact?.notes ?? ""} id={`contact-notes-${contact?.id ?? "new"}`} name="notes" />
            </Field>
            {state.message ? <FieldError>{state.message}</FieldError> : null}
            <SubmitButton label="Save contact" />
          </FieldGroup>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export function AddressSheet({ customerId, address }: { customerId: string; address?: CustomerAddress }) {
  const [state, formAction] = useActionState(saveAddressAction, initialState);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={address ? "icon-sm" : "sm"} variant={address ? "ghost" : "outline"}>
          {address ? <IconPencil /> : <IconPlus data-icon="inline-start" />}
          {address ? <span className="sr-only">Edit address</span> : "Add address"}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{address ? "Edit address" : "Add address"}</SheetTitle>
          <SheetDescription>Addresses are managed inside the current Customer.</SheetDescription>
        </SheetHeader>
        <form action={formAction} className="px-4 pb-4">
          <input name="customerId" type="hidden" value={customerId} />
          {address ? <input name="addressId" type="hidden" value={address.id} /> : null}
          <FieldGroup>
            <Field>
              <FieldLabel>Type</FieldLabel>
              <Select defaultValue={address?.type ?? "main"} name="type">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {customerAddressTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field orientation="horizontal">
              <Checkbox defaultChecked={address?.isDefault} id={`address-default-${address?.id ?? "new"}`} name="isDefault" />
              <FieldLabel htmlFor={`address-default-${address?.id ?? "new"}`}>Default address</FieldLabel>
            </Field>
            {["line1", "line2", "city", "state", "postalCode", "country"].map((field) => (
              <Field key={field}>
                <FieldLabel htmlFor={`address-${field}-${address?.id ?? "new"}`}>{field}</FieldLabel>
                <Input
                  defaultValue={(address?.[field as keyof CustomerAddress] as string | null | undefined) ?? ""}
                  id={`address-${field}-${address?.id ?? "new"}`}
                  name={field}
                />
              </Field>
            ))}
            {state.message ? <FieldError>{state.message}</FieldError> : null}
            <SubmitButton label="Save address" />
          </FieldGroup>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export function RemoveContactDialog({ customerId, contact }: { customerId: string; contact: CustomerContact }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button aria-label={`Remove ${contact.name}`} size="icon-sm" variant="ghost">
          <IconTrash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove contact?</AlertDialogTitle>
          <AlertDialogDescription>This removes {contact.name} from the visible Customer record.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={removeContactAction}>
            <input name="customerId" type="hidden" value={customerId} />
            <input name="contactId" type="hidden" value={contact.id} />
            <AlertDialogAction type="submit" variant="destructive">
              Remove
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function RemoveAddressDialog({ customerId, address }: { customerId: string; address: CustomerAddress }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button aria-label="Remove address" size="icon-sm" variant="ghost">
          <IconTrash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove address?</AlertDialogTitle>
          <AlertDialogDescription>This removes the address from the visible Customer record.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={removeAddressAction}>
            <input name="customerId" type="hidden" value={customerId} />
            <input name="addressId" type="hidden" value={address.id} />
            <AlertDialogAction type="submit" variant="destructive">
              Remove
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
