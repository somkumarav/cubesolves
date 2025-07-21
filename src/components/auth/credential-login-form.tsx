"use client";
import { Login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { LogInSchema, logInSchema } from "@/schemas/auth";
import { FormProvider } from "@/components/form-provider";
import { InputField } from "@/components/form-fields";

export const CredentialLoginForm = () => {
  const onSubmit = async (data: LogInSchema) => {
    const res = await Login(data);
    console.log(res);
  };

  return (
    <FormProvider
      defaultValues={{ email: "", password: "" }}
      formSchema={logInSchema}
      onSubmit={onSubmit}
      className='w-full'
      render={(form) => (
        <div className='space-y-2'>
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

// <form
//   {...form}
//   onSubmit={(e) =>
//     form.handleSubmit(() => {
//       console.log(e);
//     })
//   }
//   // action={async () => {
//   //   "use server";
//   //   await signIn("credentials", {
//   //     username: "testuser",
//   //     password: "testpassword",
//   //   });
//   // }}
//   className='w-full space-y-2'
// >
//   <Input placeholder='username' />
//   <Input type='password' placeholder='password' />
//   <Button className='w-full font-normal'>sign up</Button>
// </form>
