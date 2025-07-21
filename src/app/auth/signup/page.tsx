import { CredentialSignUpForm } from "@/components/auth/credential-signup-form";

export default async function SignIn() {
  return (
    <>
      <div className='w-full space-x-2 flex items-center'>
        <p>Register</p>
      </div>
      <CredentialSignUpForm />
    </>
  );
}
