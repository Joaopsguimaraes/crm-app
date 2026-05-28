"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { ActionState, Customer } from "@/features/customers/contracts";
import { createCustomerAction } from "@/features/customers/server/actions";
import { cn } from "@/lib/utils";

const initialState: ActionState<Customer> = { ok: false };

type CustomerCreateFormProps = {
  className?: string;
  onCreated?: (customer: Customer) => void;
};

function CustomerCreateSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      {pending ? <Spinner data-icon="inline-start" /> : null}
      Create customer
    </Button>
  );
}

export function CustomerCreateForm({ className, onCreated }: CustomerCreateFormProps) {
  const [state, formAction] = useActionState(createCustomerAction, initialState);

  useEffect(() => {
    if (state.ok && state.data) {
      onCreated?.(state.data);
    }
  }, [onCreated, state]);

  return (
    <form action={formAction} className={cn("max-w-xl", className)}>
      <FieldGroup>
        <Field data-invalid={Boolean(state.fieldErrors?.name)}>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input aria-invalid={Boolean(state.fieldErrors?.name)} id="name" name="name" required />
          <FieldError errors={state.fieldErrors?.name?.map((message) => ({ message }))} />
        </Field>
        <Field data-invalid={Boolean(state.fieldErrors?.email)}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input aria-invalid={Boolean(state.fieldErrors?.email)} id="email" name="email" type="email" />
          <FieldError errors={state.fieldErrors?.email?.map((message) => ({ message }))} />
        </Field>
        <Field data-invalid={Boolean(state.fieldErrors?.phone)}>
          <FieldLabel htmlFor="phone">Phone</FieldLabel>
          <Input aria-invalid={Boolean(state.fieldErrors?.phone)} id="phone" name="phone" />
          <FieldError errors={state.fieldErrors?.phone?.map((message) => ({ message }))} />
        </Field>
        {state.message ? <FieldError>{state.message}</FieldError> : null}
        <CustomerCreateSubmitButton />
      </FieldGroup>
    </form>
  );
}
