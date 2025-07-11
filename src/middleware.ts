import { auth } from "@/auth";

export default auth((req) => {
  const isAuthenticated = !!req.auth;
  const pathname = req.nextUrl.pathname;
  const baseURL = req.nextUrl.origin;

  if (!isAuthenticated && pathname === "/profile") {
    const newUrl = new URL("/auth/signin", baseURL);
    return Response.redirect(newUrl);
  }

  if (isAuthenticated && pathname === "/auth/signin") {
    const newUrl = new URL(baseURL);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/auth/signin", "/profile"],
};
