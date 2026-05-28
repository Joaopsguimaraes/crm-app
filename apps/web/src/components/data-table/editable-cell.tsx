"use client";

import { IconAlertCircle, IconLoader2 } from "@tabler/icons-react";
import { useRef, useState, useTransition, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type EditableCellState = "idle" | "editing" | "saving" | "error";

type EditableCellOption = {
  label: string;
  value: string;
};

export type EditableCellProps = {
  value: string;
  label: string;
  options?: EditableCellOption[];
  placeholder?: string;
  validate?: (value: string) => string | undefined;
  onSave: (value: string) => Promise<{ ok: boolean; value?: string; message?: string }>;
  onSaved?: () => void;
};

export function EditableCell({
  value,
  label,
  options,
  placeholder,
  validate,
  onSave,
  onSaved,
}: EditableCellProps) {
  const [committedValue, setCommittedValue] = useState(value);
  const [draftValue, setDraftValue] = useState(value);
  const [state, setState] = useState<EditableCellState>("idle");
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const requestIdRef = useRef(0);

  const visibleValue = committedValue.length > 0 ? committedValue : (placeholder ?? "Empty");

  async function save(nextValue: string): Promise<void> {
    if (state === "saving" || nextValue === committedValue) {
      setState("idle");
      setDraftValue(committedValue);
      return;
    }

    const validationError = validate?.(nextValue);

    if (validationError) {
      setState("error");
      setError(validationError);
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setState("saving");
    setError(undefined);

    const result = await onSave(nextValue);

    if (requestIdRef.current !== requestId) {
      return;
    }

    if (result.ok) {
      const authoritativeValue = result.value ?? nextValue;
      setCommittedValue(authoritativeValue);
      setDraftValue(authoritativeValue);
      setState("idle");
      onSaved?.();
      return;
    }

    setState("error");
    setError(result.message ?? "Could not save this value.");
  }

  function cancel(): void {
    setDraftValue(committedValue);
    setError(undefined);
    setState("idle");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Enter") {
      event.preventDefault();
      startTransition(() => {
        void save(draftValue);
      });
    }

    if (event.key === "Escape") {
      event.preventDefault();
      cancel();
    }
  }

  if (state === "editing" || (state === "error" && !options)) {
    return (
      <div className="flex min-w-40 flex-col gap-1">
        <Input
          aria-invalid={state === "error"}
          aria-label={label}
          autoFocus
          onBlur={() => {
            startTransition(() => {
              void save(draftValue);
            });
          }}
          onChange={(event) => setDraftValue(event.target.value)}
          onKeyDown={handleKeyDown}
          value={draftValue}
        />
        {error ? (
          <span className="flex items-center gap-1 text-xs text-destructive">
            <IconAlertCircle />
            {error}
          </span>
        ) : null}
      </div>
    );
  }

  if (options) {
    return (
      <div className="flex min-w-36 flex-col gap-1">
        <Select
          disabled={state === "saving" || isPending}
          onValueChange={(nextValue) => {
            setDraftValue(nextValue);
            startTransition(() => {
              void save(nextValue);
            });
          }}
          value={draftValue}
        >
          <SelectTrigger
            aria-invalid={state === "error"}
            aria-label={label}
            className="w-full"
            size="sm"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {state === "saving" ? (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <IconLoader2 />
            Saving
          </span>
        ) : null}
        {error ? (
          <span className="flex items-center gap-1 text-xs text-destructive">
            <IconAlertCircle />
            {error}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <button
      aria-label={`Edit ${label}`}
      className={cn(
        "flex min-h-7 w-full min-w-32 items-center gap-1 rounded-md px-1 text-left text-xs outline-none hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring",
        !committedValue && "text-muted-foreground",
      )}
      onClick={() => setState("editing")}
      type="button"
    >
      <span className="truncate">{visibleValue}</span>
      {state === "saving" ? <IconLoader2 data-icon="inline-end" /> : null}
    </button>
  );
}
