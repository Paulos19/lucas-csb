"use server"; // Define que todas as funções aqui são Server Actions

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Definimos um schema de validação com Zod
const ClientSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório"),
  whatsapp: z
    .string()
    .min(11, "WhatsApp deve ter no mínimo 11 dígitos")
    .max(13, "WhatsApp deve ter no máximo 13 dígitos")
    .regex(/^\d+$/, "WhatsApp deve conter apenas números (ex: 55119...)"),
  productSold: z.string().optional(),
  saleDate: z.string().optional(), // Recebemos como string do formulário
});

export async function createClient(formData: FormData) {
  // 2. Extrair e validar os dados do formulário
  const validatedFields = ClientSchema.safeParse({
    name: formData.get("name"),
    whatsapp: formData.get("whatsapp"),
    productSold: formData.get("productSold"),
    saleDate: formData.get("saleDate"),
  });

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    return { success: false, message: "Dados inválidos." };
  }

  const { name, whatsapp, productSold, saleDate } = validatedFields.data;

  try {
    // 3. Tentar criar o cliente no banco
    await prisma.client.create({
      data: {
        name,
        whatsapp,
        productSold,
        // Converte a string de data (se existir) para o formato ISO
        saleDate: saleDate ? new Date(saleDate) : null,
      },
    });

    // 4. [IMPORTANTE] Revalidar o cache da página
    // Isso diz ao Next.js para buscar os dados da tabela novamente.
    revalidatePath("/(dashboard)/clients");

    return { success: true, message: "Cliente criado com sucesso." };

  } catch (e: any) {
    // 5. Tratar erros comuns
    if (e.code === 'P2002') { // Erro de constraint única do Prisma
      return { success: false, message: "Este WhatsApp já está cadastrado." };
    }
    console.error(e);
    return { success: false, message: "Erro desconhecido ao criar cliente." };
  }
}