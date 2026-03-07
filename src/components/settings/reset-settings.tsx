"use client"

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ResetSettings() {
    const [loading, setLoading] = useState<'' | 'operational' | 'full'>('');
    const { toast } = useToast();

    const handleReset = async (level: 'operational' | 'full') => {
        setLoading(level);
        try {
            const res = await fetch('/api/system/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ level }),
            });
            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.error || 'Falha ao resetar os dados.');
            }
            toast({
                title: 'Sistema Resetado',
                description: result.message,
            });
            // Reload the page to see the changes
            window.location.reload();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao Resetar',
                description: error instanceof Error ? error.message : 'Ocorreu um erro inesperado.',
            });
        } finally {
            setLoading('');
        }
    }

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
        <CardDescription>
          Ações nesta área são permanentes e não podem ser desfeitas. Use com cuidado.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-dashed border-destructive/50 rounded-lg">
            <div>
                <h4 className='font-semibold'>Resetar Dados Operacionais</h4>
                <p className='text-sm text-muted-foreground'>Limpa todos os dados de teste (conversas, leads, orçamentos, etc.), mantendo suas configurações.</p>
            </div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="mt-2 sm:mt-0">
                        {loading === 'operational' ? <Loader2 className='mr-2 size-4 animate-spin' /> : <AlertTriangle className='mr-2 size-4' />}
                        Resetar Dados
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso limpará permanentemente todos os dados operacionais do mock-backend, como conversas, leads, orçamentos e reservas. Suas configurações de IA e aparência serão mantidas.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleReset('operational')}>Sim, resetar dados</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-dashed border-destructive/50 rounded-lg">
            <div>
                <h4 className='font-semibold'>Reset Completo do Sistema</h4>
                <p className='text-sm text-muted-foreground'>Restaura todo o sistema para o estado inicial, incluindo todas as configurações.</p>
            </div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="mt-2 sm:mt-0">
                        {loading === 'full' ? <Loader2 className='mr-2 size-4 animate-spin' /> : <AlertTriangle className='mr-2 size-4' />}
                        Reset Completo
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação é irreversível. Isso limpará TODOS os dados e configurações do mock-backend, restaurando o aplicativo para seu estado inicial de fábrica.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleReset('full')}>Sim, resetar tudo</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
