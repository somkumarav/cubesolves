import { auth } from "@/auth";
import { initializeUserSettings } from "@/actions/home";
import HomePageView from "./home-page-view";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return <div>local page</div>;
  }

  const initialUserSettings = await initializeUserSettings();
  if (
    !initialUserSettings.status ||
    !initialUserSettings.additional?.cube ||
    !initialUserSettings.additional.latestSolveSessionId
  ) {
    return (
      <div className='h-[90vh] flex flex-col items-center justify-center'>
        <p className='text-xl text-destructive-light'>Something went wrong!</p>
        <p className='text-sm'>
          Please try login in back. If error persists contact support.
        </p>
      </div>
    );
  }

  return (
    <HomePageView
      cubeType={initialUserSettings.additional?.cube}
      solveSessionId={initialUserSettings.additional?.latestSolveSessionId}
    />
  );
}
