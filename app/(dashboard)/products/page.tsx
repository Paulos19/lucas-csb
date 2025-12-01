// app/(dashboard)/products/page.tsx
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Shield, Car, Heart, Home } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const prisma = new PrismaClient();

// Ícones dinâmicos por categoria
const getIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('auto') || cat.includes('carro')) return <Car className="h-5 w-5" />;
  if (cat.includes('vida')) return <Heart className="h-5 w-5" />;
  if (cat.includes('resid')) return <Home className="h-5 w-5" />;
  return <Shield className="h-5 w-5" />;
};

export default async function ProductsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const products = await prisma.product.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Meus Produtos CSB</h2>
          <p className="text-muted-foreground">Gerencie os seguros e argumentos de venda do Lucas.</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button><Plus className="mr-2 h-4 w-4" /> Novo Produto</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  {product.name}
                </CardTitle>
                <Badge variant="secondary">{product.category}</Badge>
              </div>
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                {getIcon(product.category)}
              </div>
            </CardHeader>
            <CardContent className="mt-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {product.salesArguments || "Sem argumentos de venda definidos."}
              </p>
              <div className="mt-4 flex justify-end">
                 <Link href={`/dashboard/products/${product.id}`}>
                    <Button variant="outline" size="sm">Editar Argumentos</Button>
                 </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {products.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
            <Shield className="h-10 w-10 mb-4 opacity-50" />
            <p>Nenhum produto cadastrado.</p>
            <p className="text-sm">Cadastre um seguro para começar a vender.</p>
          </div>
        )}
      </div>
    </div>
  );
}