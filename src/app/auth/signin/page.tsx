import { BsGoogle } from "react-icons/bs";
import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
      className='mx-auto space-y-2 flex flex-col items-center justify-center min-h-screen w-[20rem]'
    >
      <p className='w-full text-xl'>Login</p>
      <Button size='lg' className='w-full'>
        sign in with google
        <BsGoogle />
      </Button>
    </form>
  );
}
