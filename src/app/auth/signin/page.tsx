import { CredentialLoginForm } from "@/components/auth/credential-login-form";

export default async function SignIn() {
  return (
    <>
      <div className='w-full space-x-2 flex items-center'>
        <p>Login</p>
      </div>
      <CredentialLoginForm />
    </>
  );
}
