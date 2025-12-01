// app/api/register/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { sanitizePhoneForEvo } from '@/lib/phoneUtils'; // Importamos a função

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ error: 'Preencha todos os campos.' }, { status: 400 });
    }

    // 1. Aplica a regra: Remove o 9º dígito se existir
    const finalPhone = sanitizePhoneForEvo(phone);

    // 2. Validação de duplicidade (Email ou Telefone já existente)
    const userExists = await prisma.user.findFirst({
      where: { 
        OR: [{ email }, { phone: finalPhone }] 
      }
    });

    if (userExists) {
      return NextResponse.json({ error: 'E-mail ou telefone já cadastrado.' }, { status: 409 });
    }

    // 3. Cria o corretor
    const hashedPassword = await hash(password, 12);
    
    await prisma.user.create({
      data: {
        name,
        email,
        phone: finalPhone, // Salva o número limpo
        password: hashedPassword,
        ragKnowledgeBase: "Olá, sou o Lucas, seu assistente virtual especializado em seguros." // Valor padrão inicial
      }
    });

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error) {
    console.error("Erro no registro:", error);
    return NextResponse.json({ error: 'Erro ao criar conta.' }, { status: 500 });
  }
}