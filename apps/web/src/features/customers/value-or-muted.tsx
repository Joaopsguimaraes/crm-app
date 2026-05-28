import { ReactElement } from "react";

export function valueOrMuted(value: string | null): ReactElement {
  return value ? <span>{value}</span> : <span className="text-muted-foreground">Not provided</span>;
}
