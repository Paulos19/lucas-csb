import { NextResponse } from 'next/server';

/**
 * GET /api/get-knowledge/seguro-residencial
 * Devolve a base de conhecimento (RAG) para o agente "Lucas"
 * sobre o Seguro Residencial.
 */
export async function GET() {
  // No futuro, pode buscar isto de um CMS ou do banco de dados.
  // Por agora, usamos um JSON estático.
  const knowledge = {
    productName: "Seguro Residencial CSB",
    knowledgeText: `
- **Coberturas Principais:** Incêndio, queda de raio, explosão de qualquer natureza.
- **Coberturas Adicionais:** Danos elétricos, roubo ou furto qualificado, vendaval, quebra de vidros.
- **Assistência 24h:** Inclui chaveiro, eletricista, encanador e vidraceiro.
- **Preço:** A partir de R$ 25,00 por mês (valor fictício, apenas para cotação).
- **Vantagens:** Proteção completa para o lar, muito mais barato que arcar com os custos de um imprevisto, parcelamento facilitado.
    `
  };

  return NextResponse.json(knowledge);
}