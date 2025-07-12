import { OAuthForm } from "@/components/auth/oauth-form";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='mx-auto space-y-2 flex flex-col items-center justify-center min-h-screen w-[20rem]'>
      <div className='w-full space-x-2 flex items-center'>
        <p>Login</p>
      </div>
      {children}
      <div className='w-full flex items-center justify-center space-x-2'>
        <div className='h-1 grow bg-component rounded-full'></div>
        <p className='grow-0'>or</p>
        <div className='h-1 grow bg-component rounded-full'></div>
      </div>
      <OAuthForm />
    </div>
  );
}
