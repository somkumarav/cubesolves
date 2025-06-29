import { auth } from "@/auth";

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname === "/profile") {
    const newUrl = new URL("/auth/signin", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  if (req.auth && req.nextUrl.pathname === "/auth/signin") {
    const newUrl = new URL(req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/auth/signin", "/profile"],
};
