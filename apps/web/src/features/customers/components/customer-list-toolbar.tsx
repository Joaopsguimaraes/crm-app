import { Field, FieldLabel } from "@/components/ui/field";
import { CustomerListParams, customerStatuses } from "../contracts";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { IconSearch } from "@tabler/icons-react";

type Props = {
  params: CustomerListParams;
};

export function CustomerListToolbar({ params }: Props) {
  return (
    <form
      action="/customers"
      className="grid gap-3 rounded-lg border bg-card p-3 shadow-xs md:grid-cols-[minmax(240px,1fr)_180px_auto_auto] md:items-end"
    >
      <Field>
        <FieldLabel htmlFor="customer-search">Search</FieldLabel>
        <Input
          defaultValue={params.search}
          id="customer-search"
          name="search"
          placeholder="Name, email, or phone"
        />
      </Field>
      <Field>
        <FieldLabel>Status</FieldLabel>
        <Select defaultValue={params.status.join(",")} name="status">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {customerStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
              <SelectItem value="active,inactive,blocked">operational</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field orientation="horizontal">
        <Switch defaultChecked={params.includeArchived} name="includeArchived" value="true" />
        <FieldLabel>Archived</FieldLabel>
      </Field>
      <input name="page" type="hidden" value="1" />
      <input name="pageSize" type="hidden" value={params.pageSize} />
      <input name="sort" type="hidden" value={params.sort} />
      <Button type="submit">
        <IconSearch data-icon="inline-start" />
        Search
      </Button>
    </form>
  );
}
