import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Conversation } from '@/lib/types';
import { Separator } from '../ui/separator';
import { Phone, Mail, Clock, CircleDollarSign, Tag, History } from 'lucide-react';
import { Badge } from '../ui/badge';

interface CustomerInfoPanelProps {
  conversation: Conversation;
}

export function CustomerInfoPanel({ conversation }: CustomerInfoPanelProps) {
  return (
    <div className="hidden w-80 flex-col border-l bg-background lg:flex">
      <div className="p-4">
        <h3 className="font-semibold">Detalhes do Cliente</h3>
      </div>
      <Separator />
      <div className="flex-1 p-4 space-y-4">
        <div className='flex items-center gap-2'>
            <Phone className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm text-muted-foreground'>+55 11 98765-4321</span>
        </div>
        <div className='flex items-center gap-2'>
            <Mail className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm text-muted-foreground'>mariana.lima@email.com</span>
        </div>
        <Separator />
        <div>
            <h4 className='font-semibold text-sm mb-2'>Etiquetas</h4>
            <div className='flex flex-wrap gap-2'>
                <Badge variant="outline">VIP</Badge>
                <Badge variant="outline">Transfer</Badge>
                <Badge variant="outline">Aeroporto GRU</Badge>
            </div>
        </div>
        <Separator />
        <div>
            <h4 className='font-semibold text-sm mb-2'>Histórico</h4>
            <div className='space-y-2 text-sm text-muted-foreground'>
                <p>2 Orçamentos</p>
                <p>5 Agendamentos (1 cancelado)</p>
                <p>Cliente desde: 12/01/2023</p>
            </div>
        </div>
      </div>
      <div className="p-4 border-t">
        <Button className="w-full">Ver Perfil Completo no CRM</Button>
      </div>
    </div>
  );
}
