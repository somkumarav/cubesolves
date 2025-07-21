import { ErrorResponseType } from "@/lib/errors";
import { SuccessResponseType } from "@/lib/success";

export type ServerActionReturnType<T = unknown> =
  | SuccessResponseType<T>
  | ErrorResponseType;
