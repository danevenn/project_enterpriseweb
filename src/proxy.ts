import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// En Next.js 16 el antiguo `middleware.ts` se llama `proxy.ts` (un único archivo
// por proyecto). Aquí combinamos dos responsabilidades:
//   1. Cabeceras de seguridad en todas las respuestas.
//   2. Protección de la zona privada `/panel/*` mediante NextAuth (withAuth).
// La callback `authorized` solo exige sesión bajo `/panel`; el resto del sitio
// es público y únicamente recibe las cabeceras.

function withSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  return response;
}

export default withAuth(
  function proxy() {
    return withSecurityHeaders(NextResponse.next());
  },
  {
    pages: { signIn: "/login" },
    callbacks: {
      authorized: ({ token, req }) => {
        // Solo /panel/* requiere sesión; el resto del sitio es público.
        if (req.nextUrl.pathname.startsWith("/panel")) {
          return token != null;
        }
        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
