import Zod, { ZodObject, ZodRawShape } from "zod";
import { ErrorHandler } from "./HOC/errors";

export function zodSafeParser<F extends ZodRawShape>(
  values: unknown,
  schema: ZodObject<F>
): Zod.infer<ZodObject<F>> {
  const validatedFields = schema.safeParse(values);

  if (!validatedFields.success) {
    console.error(validatedFields);
    throw new ErrorHandler(
      "invalid fields",
      "BAD_REQUEST",
      validatedFields.error
    );
  }
  return validatedFields.data;
}
