import prisma from "@/lib/prisma";
import { AddClientForm } from "./components/add-client-form";
import { ClientTable } from "./components/client-table";

async function getClients() {
  const clients = await prisma.client.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return clients;
}

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clientes (Pós-Venda)</h1>
        <AddClientForm />
      </div>

      <ClientTable clients={clients} />
    </div>
  );
}