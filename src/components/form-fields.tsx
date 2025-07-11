"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function FieldLabel(props: {
  children?: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <FormLabel className={cn("flex", props.className)}>
      {props.children}
      {props.required ? <span className='ml-1 text-destructive'>*</span> : null}
    </FormLabel>
  );
}

export function InputField<F extends FieldValues>(props: {
  control: Control<F>;
  name: Path<F>;
  label: React.ReactNode;
  placeholder?: string;
  required?: boolean;
  type?: string;
  disabled?: boolean;
  className?: string;
  formItemClassName?: string;
}) {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className={props.formItemClassName}>
          <FormControl>
            <Input
              {...field}
              value={field.value ?? ""}
              placeholder={props.placeholder}
              className={cn("", props.className)}
              disabled={props.disabled}
              type={props.type}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// placeholder = '•••••••••••••';
// className =
//   'placeholder:font-bold placeholder:text-xl placeholder:tracking-wide';
