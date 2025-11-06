import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { FollowUpStatus } from '@prisma/client';
import { z } from 'zod';

// 1. Schema para validar o corpo (body) do pedido que o n8n irá enviar
// Isto garante que o n8n só pode enviar um status válido do nosso Enum
const statusUpdateSchema = z.object({
  status: z.nativeEnum(FollowUpStatus),
});

/**
 * PATCH /api/clients/[whatsapp]/status
 * Atualiza o status de um cliente específico.
 * Usado pelo agente n8n (Lucas) após uma interação.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { whatsapp: string } }
) {
  try {
    const { whatsapp } = params;
    const body = await request.json();

    // 2. Validar o body
    const validation = statusUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Status inválido', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { status } = validation.data;

    // 3. Preparar os dados para a atualização
    // Usamos 'any' aqui para construir o objeto de dados dinamicamente
    const dataToUpdate: any = {
      status: status,
      lastContactDate: new Date(), // Sempre atualizamos a data do último contacto
    };

    // 4. [LÓGICA DE NEGÓCIO CRÍTICA]
    // Se o cliente rejeitou, agendamos a próxima tentativa para daqui a 7 dias.
    if (status === FollowUpStatus.REJECTED) {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 7);
      dataToUpdate.nextFollowUpDate = nextDate;
    }

    // 5. Atualizar o cliente no banco de dados
    const updatedClient = await prisma.client.update({
      where: {
        whatsapp: whatsapp,
      },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedClient);

  } catch (error: any) {
    // 6. Tratar erros (ex: cliente não encontrado)
    if (error.code === 'P2025') { // Código do Prisma para "Record not found"
      return NextResponse.json(
        { error: `Cliente com WhatsApp ${params.whatsapp} não encontrado.` },
        { status: 404 }
      );
    }

    console.error('[API_UPDATE_STATUS_ERROR]', error);
    return NextResponse.json(
      { error: 'Falha ao atualizar o status do cliente.' },
      { status: 500 }
    );
  }
}