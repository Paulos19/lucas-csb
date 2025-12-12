export { auth as middleware } from "@/lib/auth";

export const config = {
  // Matcher para ignorar arquivos estáticos e rotas de API públicas
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};