import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: '/login', // Redireciona para nossa página customizada
  },
  providers: [], // Provedores serão configurados no auth.ts para evitar erro no Edge
  callbacks: {
    // Lógica de proteção de rotas (Middleware)
    authorized({ auth, request: nextUrl }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redireciona para login
      }
      
      // Se já estiver logado e tentar acessar login/register, redireciona pro dashboard
      if (isLoggedIn && (nextUrl.pathname === '/login' || nextUrl.pathname === '/register')) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      
      return true;
    },
  },
} satisfies NextAuthConfig;