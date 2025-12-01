// next-auth.d.ts

import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Estende o tipo padrão da sessão para incluir nossas propriedades customizadas.
   * Isso permite acessar session.user.id e session.user.phone sem erros de TS.
   */
  interface Session {
    user: {
      id: string;
      phone: string;
    } & DefaultSession['user']; // Mantém propriedades padrão como name, email, image
  }

  /**
   * Estende o tipo de usuário padrão do NextAuth.
   * O objeto 'user' retornado pelo authorize no Credentials Provider deve corresponder a isso.
   */
  interface User {
    id: string;
    phone: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Estende o token JWT para que possamos adicionar propriedades customizadas a ele.
   */
  interface JWT {
    id?: string;
    // Opcionalmente você pode tipar o phone aqui também se estiver passando ele para o token no callback jwt
    // phone?: string; 
  }
}