import { OAuthForm } from "@/components/auth/oauth-form";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='mx-auto space-y-2 flex flex-col items-center justify-center min-h-[90vh] w-[20rem]'>
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
