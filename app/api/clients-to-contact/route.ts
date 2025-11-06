import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { FollowUpStatus } from '@prisma/client';

/**
 * GET /api/clients-to-contact
 * Busca clientes para o agente n8n (Lucas) iniciar o contacto.
 * * Lógica:
 * 1. Busca clientes com status PENDING (novo) ou REJECTED (tentar novamente).
 * 2. Filtra apenas aqueles cuja 'nextFollowUpDate' é hoje ou já passou.
 */
export async function GET() {
  try {
    const now = new Date();

    const clientsToContact = await prisma.client.findMany({
      where: {
        // O status deve ser PENDING ou REJECTED
        OR: [
          { status: FollowUpStatus.PENDING },
          { status: FollowUpStatus.REJECTED }
        ],
        // E a data de próximo contacto é hoje ou já passou
        nextFollowUpDate: {
          lte: now // lte = Less Than or Equal (Menor ou igual a)
        }
      },
      // Devolvemos apenas a informação que o n8n precisa
      select: {
        name: true,
        whatsapp: true,
        productSold: true
      }
    });

    return NextResponse.json(clientsToContact);

  } catch (error) {
    console.error('[API_GET_CLIENTS_ERROR]', error);
    return NextResponse.json(
      { error: 'Falha ao buscar clientes para contacto.' },
      { status: 500 }
    );
  }
}