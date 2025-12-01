import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Inicializa NextAuth apenas com a configuração "leve" (sem Prisma)
export default NextAuth(authConfig).auth;

export const config = {
  // Protege todas as rotas, exceto estáticas e API
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};