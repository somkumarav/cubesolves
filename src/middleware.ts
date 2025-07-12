import NextAuth from "next-auth";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  try {
    const isAuthenticated = !!req.auth;
    const pathname = req.nextUrl.pathname;
    const baseURL = req.nextUrl.origin;
    const authRoutes = ["/auth/signin", "/auth/signup"];

    if (!isAuthenticated && pathname === "/profile") {
      const newUrl = new URL("/auth/signin", baseURL);
      return Response.redirect(newUrl);
    }

    if (isAuthenticated && authRoutes.includes(pathname)) {
      const newUrl = new URL(baseURL);
      return Response.redirect(newUrl);
    }
  } catch (error) {
    console.error(error);
  }
});

export const config = {
  matcher: ["/auth/signin", "/profile", "/auth/signup"],
};
