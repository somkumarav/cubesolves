import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import Zod, { ZodObject } from "zod";

export function FormProvider<F extends FieldValues>(props: {
  defaultValues?: DefaultValues<F>;
  onSubmit: (values: Zod.infer<ZodObject<F>>) => Promise<void> | void;
  formSchema: ZodObject<F>;
  className?: string;
  render: (form: UseFormReturn<Zod.infer<ZodObject<F>>>) => React.ReactNode;
}) {
  const form = useForm({
    resolver: zodResolver(props.formSchema),
    defaultValues: props.defaultValues as DefaultValues<
      Zod.infer<ZodObject<F>>
    >,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => form.handleSubmit(props.onSubmit)(e)}
        className={props.className}
        // id={formId}
      >
        {props.render(form)}
      </form>
    </Form>
  );
}
