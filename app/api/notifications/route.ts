import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Schema para validar o body que o n8n enviará
const notificationSchema = z.object({
  motivo: z.string().min(1, "O motivo é obrigatório"),
  whatsapp_number: z.string().min(10, "WhatsApp é obrigatório"),
});

/**
 * POST /api/notifications
 * Cria um novo registo de notificação no banco de dados.
 * Usado pelo n8n quando o cliente pede atendimento humano.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validar o body
    const validation = notificationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { motivo, whatsapp_number } = validation.data;

    // 2. Criar a notificação no banco de dados
    const notification = await prisma.notification.create({
      data: {
        motivo: motivo,
        whatsapp_number: whatsapp_number, // Salva o número para referência
      },
    });

    return NextResponse.json(notification, { status: 201 }); // 201 = Created

  } catch (error: any) {
    console.error('[API_POST_NOTIFICATION_ERROR]', error);
    return NextResponse.json(
      { error: 'Falha ao criar a notificação.' },
      { status: 500 }
    );
  }
}