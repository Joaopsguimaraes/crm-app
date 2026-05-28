"use client";

import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useCallback, useState, type ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CustomerCreateForm } from "@/features/customers/components/customer-create-form";

type CustomerCreateSheetProps = {
  buttonSize?: ComponentProps<typeof Button>["size"];
  buttonVariant?: ComponentProps<typeof Button>["variant"];
  label?: string;
};

export function CustomerCreateSheet({
  buttonSize,
  buttonVariant,
  label = "New customer",
}: CustomerCreateSheetProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleCreated = useCallback(
    () => {
      setOpen(false);
      router.refresh();
    },
    [router],
  );

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button size={buttonSize} type="button" variant={buttonVariant}>
          <IconPlus data-icon="inline-start" />
          {label}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>New customer</SheetTitle>
          <SheetDescription>
            Create the record now and enrich it from the customer list when needed.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          <CustomerCreateForm className="max-w-none" onCreated={handleCreated} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
