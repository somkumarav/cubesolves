import { Session } from "next-auth";
import { auth } from "@/auth";
import { withServerActionAsyncCatcher } from "@/lib/async-catcher";
import { ErrorHandler } from "@/lib/errors";

type withSessionType<T, R> = (session: Session, args?: T) => Promise<R>;

export function withSession<T, R>(
  serverAction: withSessionType<T, R>
): (args?: T) => Promise<R> {
  return withServerActionAsyncCatcher(async (args?: T) => {
    const session = await auth();
    if (!session || !session.user) {
      throw new ErrorHandler(
        "You must be authenticated to access this resource.",
        "UNAUTHORIZED"
      );
    }
    return await serverAction(session, args);
  });
}
