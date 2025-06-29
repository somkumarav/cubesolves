import { auth, signIn } from "@/auth";

export default async function SignIn() {
  const session = await auth();
  console.log("session", session);

  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
      className='bg-skin-base min-h-screen'
    >
      <p>{session?.user?.email}</p>
      <button>Sign in with google</button>
    </form>
  );
}
