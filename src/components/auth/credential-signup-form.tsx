"use client";
import { SignUp } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { SignUpSchema, signUpSchema } from "@/schemas/auth";
import { FormProvider } from "@/components/form-provider";
import { InputField } from "@/components/form-fields";

export const CredentialSignUpForm = () => {
  const onSubmit = async (data: SignUpSchema) => {
    const res = await SignUp(data);
    console.log(res);
  };

  return (
    <FormProvider
      defaultValues={{ email: "", password: "" }}
      formSchema={signUpSchema}
      onSubmit={onSubmit}
      className='w-full'
      render={(form) => (
        <div className='space-y-2'>
          <InputField
            {...form}
            disabled={form.formState.isSubmitting}
            name='name'
            label='username'
            className='w-full'
            placeholder='username'
          />
          <InputField
            {...form}
            disabled={form.formState.isSubmitting}
            name='email'
            label='email'
            className='w-full'
            placeholder='email'
          />
          <InputField
            {...form}
            disabled={form.formState.isSubmitting}
            name='password'
            type='password'
            label='email'
            className='w-full'
            placeholder='password'
          />
          <Button disabled={form.formState.isSubmitting} className='w-full'>
            sing in
          </Button>
        </div>
      )}
    />
  );
};
