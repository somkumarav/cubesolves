import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        "font-medium bg-component placeholder:text-component-font-sub secondary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium ",
        "focus-visible:ring-button-font focus-visible:ring-2 hover:bg-component/80 transition-all",
        "aria-invalid:ring-destructive/50 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
