import { Transform } from "class-transformer";

type TransformInput = {
  value: unknown;
};

const trimOrUndefined = ({ value }: TransformInput): unknown => (typeof value === "string" ? value.trim() : value);

const toStatusArray = ({ value }: TransformInput): unknown => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((status) => status.trim())
      .filter(Boolean);
  }

  return value;
};

const toOptionalBoolean = ({ value }: TransformInput): unknown => {
  if (value === undefined || value === null || typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value === "true") {
      return true;
    }

    if (value === "false") {
      return false;
    }
  }

  return value;
};

export const customerDtoTransformers = {
  optionalTrimmedString: (): PropertyDecorator => Transform(trimOrUndefined),
  optionalBoolean: Transform(toOptionalBoolean),
  statusArray: Transform(toStatusArray)
};
