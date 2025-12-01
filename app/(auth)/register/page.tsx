'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, Mail, Lock, Phone } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta.');
      }

      toast.success('Conta criada! O número foi formatado para o padrão do Lucas.');
      
      // Pequeno delay para o usuário ler o toast
      setTimeout(() => {
        router.push('/login');
      }, 1500);

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-t-4 border-t-blue-600">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Junte-se ao Lucas</CardTitle>
        <CardDescription className="text-center">
          Automação imobiliária inteligente
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Corretor</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="name" placeholder="João Silva" className="pl-9" required onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail Profissional</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="joao@imobiliaria.com" className="pl-9" required onChange={handleChange} />
            </div>
          </div>

           <div className="space-y-2">
            <Label htmlFor="phone">WhatsApp (Instância Evo)</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="phone" type="tel" placeholder="5511999998888" className="pl-9" required onChange={handleChange} />
            </div>
            <p className="text-[10px] text-muted-foreground">
              *Se digitar o 9º dígito, nós o ajustaremos automaticamente.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="password" type="password" placeholder="******" className="pl-9" required minLength={6} onChange={handleChange} />
            </div>
          </div>

        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Criar Conta'}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Já tem acesso? <Link href="/login" className="text-blue-600 hover:underline">Fazer login</Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}