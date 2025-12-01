import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import { authConfig } from "@/auth.config";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig, // Herda a config base
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const email = credentials.email as string;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return null;

        const isValid = await compare(credentials.password as string, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks, // Mantém os callbacks do config
    // Adiciona dados extras à sessão (ID e Telefone)
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.phone = (token.phone as string) || "";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
      }
      return token;
    }
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET, // Garante uso do segredo
});