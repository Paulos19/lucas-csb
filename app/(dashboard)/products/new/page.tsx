'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    salesArguments: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Erro ao salvar');

      toast.success('Produto criado com sucesso!');
      router.push('/dashboard/products');
      router.refresh();
    } catch (error) {
      toast.error('Erro ao criar produto.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Cadastrar Novo Produto</CardTitle>
          <CardDescription>Defina as informações que o Lucas usará para vender este seguro.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome do Produto</Label>
                <Input 
                  placeholder="Ex: Bradesco Auto Frota" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select onValueChange={(val) => setFormData({...formData, category: val})} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Auto">Automóvel</SelectItem>
                    <SelectItem value="Vida">Vida / Previdência</SelectItem>
                    <SelectItem value="Saúde">Saúde / Odonto</SelectItem>
                    <SelectItem value="Residencial">Residencial</SelectItem>
                    <SelectItem value="Empresarial">Empresarial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descrição Básica</Label>
              <Textarea 
                placeholder="Detalhes técnicos do produto..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-primary font-bold flex items-center gap-2">
                Argumentos de Venda (Cérebro do Lucas) ✨
              </Label>
              <Textarea 
                className="min-h-[150px] bg-primary/5 border-primary/20"
                placeholder="Digite aqui os pontos fortes que o Lucas deve usar.&#10;Ex: 'Focar que cobrimos 110% da FIPE', 'Mencionar a rede de oficinas premium', 'Oferecer desconto se fechar hoje'."
                value={formData.salesArguments}
                onChange={(e) => setFormData({...formData, salesArguments: e.target.value})}
                required
              />
              <p className="text-xs text-muted-foreground">
                Essas informações serão injetadas no prompt da IA quando o Lucas estiver negociando este produto específico.
              </p>
            </div>

          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Salvar Produto
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}