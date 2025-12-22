import { ErrorResponseType } from "@/lib/HOC/errors";
import { SuccessResponseType } from "@/lib/HOC/success";

export type ServerActionReturnType<T = unknown> =
  | SuccessResponseType<T>
  | ErrorResponseType;
