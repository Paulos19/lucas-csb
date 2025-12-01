// lib/phoneUtils.ts

/**
 * Normaliza o telefone para o padrão da Evolution API (sem 9º dígito).
 * Ex: (11) 98888-7777 -> 551188887777
 */
export function sanitizePhoneForEvo(phone: string): string {
  // 1. Remove tudo que não for número
  let clean = phone.replace(/\D/g, '');

  // 2. Garante o DDI 55 (Brasil) se não estiver presente
  if (!clean.startsWith('55')) {
    clean = `55${clean}`;
  }

  // 3. Regra do 9º dígito:
  // Se o número tiver 13 dígitos (55 + 2 DDD + 9 dígitos), verificamos o terceiro dígito após o DDI.
  if (clean.length === 13) {
     const ddd = clean.substring(2, 4);
     const numberPart = clean.substring(4);
     
     // Se o número começar com 9 (celular), removemos ele.
     if (numberPart.startsWith('9')) {
       return `55${ddd}${numberPart.substring(1)}`;
     }
  }

  return clean;
}