import { BsGithub, BsGoogle } from "react-icons/bs";
import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export const OAuthForm = () => {
  return (
    <div className='w-full flex space-x-2'>
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
        className='w-1/2'
      >
        <Button size='icon' className='w-full'>
          <BsGoogle />
        </Button>
      </form>
      <form
        action={async () => {
          "use server";
          await signIn("github");
        }}
        className='w-1/2'
      >
        <Button size='icon' className='w-full'>
          <BsGithub />
        </Button>
      </form>
    </div>
  );
};
