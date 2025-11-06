"use client"; // Marcamos como 'client' para permitir interatividade futura (filtros, etc)

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Client, FollowUpStatus } from "@prisma/client"; // Importa os tipos gerados

// Props para o nosso componente
interface ClientTableProps {
  clients: Client[];
}

export function ClientTable({ clients }: ClientTableProps) {
  
  // Mapeia os status para cores/texto da Badge da Shadcn
  const getStatusVariant = (status: FollowUpStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "PENDING":
        return "default";
      case "IN_PROGRESS":
      case "CONTACTED":
        return "secondary";
      // Você pode adicionar uma cor 'success' no seu tailwind.config.js
      case "CONVERTED":
        return "default"; // Usando default por enquanto
      case "REJECTED":
      case "PAUSED":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Produto de Origem</TableHead>
            <TableHead>Data Venda</TableHead>
            <TableHead>Próximo Contato</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhum cliente cadastrado.
              </TableCell>
            </TableRow>
          )}
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell>{client.whatsapp}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(client.status)}>
                  {client.status}
                </Badge>
              </TableCell>
              <TableCell>{client.productSold ?? "N/A"}</TableCell>
              <TableCell>
                {client.saleDate
                  ? new Date(client.saleDate).toLocaleDateString("pt-BR", {timeZone: 'UTC'})
                  : "N/A"}
              </TableCell>
              <TableCell>
                {new Date(client.nextFollowUpDate).toLocaleDateString("pt-BR")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}