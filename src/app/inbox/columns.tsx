"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Conversation, Contact } from "@/lib/db/data-model"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ArrowUpDown, Bot, User } from "lucide-react"
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from "next/link"
import { getStatusBadgeClasses } from "@/lib/utils"

type InboxItem = Conversation & { contact: Contact }

const priorityLabels: Record<string, string> = {
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa',
}

const statusLabels: Record<string, string> = {
    open: 'Aberto',
    closed: 'Fechado',
    pending: 'Pendente',
    unconfirmed: 'Não Confirmado',
    canceled: 'Cancelado',
    'aguardando humano': 'Aguardando Humano',
    'IA assistida': 'IA Assistida',
    'IA bloqueada': 'IA Bloqueada',
    'IA autorizada': 'IA Autorizada',
    'concluído pela IA': 'Concluído pela IA',
    'concluído por humano': 'Concluído por Humano',
}


export const columns: ColumnDef<InboxItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "contact",
    header: "Cliente",
    cell: ({ row }) => {
      const contact = row.original.contact;
      return (
        <Link href={`/inbox/${row.original.id}`}>
          <div className="flex items-center gap-3 group">
            <Avatar>
              <AvatarImage src={contact?.avatar} data-ai-hint="person avatar"/>
              <AvatarFallback>{contact?.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium group-hover:underline">{contact?.fullName}</span>
              <span className="text-xs text-muted-foreground">{contact?.phone}</span>
            </div>
          </div>
        </Link>
      )
    },
    filterFn: (row, id, value) => {
        return row.original.contact.fullName.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "lastMessage",
    header: "Última Mensagem",
    cell: ({ row }) => {
        return (
            <Link href={`/inbox/${row.original.id}`} className="hover:underline">
                <p className="max-w-[300px] truncate text-sm text-muted-foreground">
                    {row.original.lastMessage}
                </p>
            </Link>
        )
    }
  },
  {
    accessorKey: "channelId",
    header: "Canal",
    cell: ({ row }) => {
        const channelId = row.getValue("channelId") as string;
        // This is a simplification. In a real app, you'd fetch channel names.
        const channelName = channelId.replace('channel-', '');
        return <Badge variant="outline" className="font-normal capitalize">{channelName}</Badge>
    },
    filterFn: (row, id, value) => {
        return row.original.channelId.includes(value);
    }
  },
  {
    accessorKey: "status",
    header: "Situação",
    cell: ({ row }) => {
        const status = row.getValue("status") as any;
        return (
            <Badge className={`${getStatusBadgeClasses(status)} capitalize`}>{statusLabels[status] || status}</Badge>
        )
    }
  },
  {
    accessorKey: "priority",
    header: "Prioridade",
    cell: ({ row }) => {
        const priority = row.getValue("priority") as any;
        return(
            <Badge variant={priority === 'high' ? 'destructive' : (priority === 'medium' ? 'secondary' : 'outline')} className="capitalize">{priorityLabels[priority] || priority}</Badge>
        )
    }
  },
  {
    accessorKey: "isAiActive",
    header: "Atendente",
    cell: ({ row }) => {
      const isAiActive: boolean = row.original.isAiActive;
      const humanOwnerId = row.original.humanOwnerId;
      // In a real app, you'd fetch operator names
      const agent = humanOwnerId === 'op-1' ? 'Claudia' : (humanOwnerId === 'op-2' ? 'Carlos' : null);
      const attendant = isAiActive ? 'IA' : (agent || 'Humano');
      const badgeClass = isAiActive ? getStatusBadgeClasses('IA assistida') : getStatusBadgeClasses('humano');
      
      return (
        <Badge className={`${badgeClass} gap-2`}>
          {isAiActive ? <Bot className="size-3.5" /> : <User className="size-3.5" />}
          <span className="text-sm font-medium">{attendant}</span>
        </Badge>
      )
    }
  },
  {
    accessorKey: "lastMessageAt",
    header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Atualizado em
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
    cell: ({ row }) => {
        const date = parseISO(row.getValue("lastMessageAt"));
        return <div className="text-right pr-4 text-muted-foreground">{format(date, "dd/MM/yyyy HH:mm", { locale: ptBR })}</div>
      },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const conversation = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem asChild><Link href={`/inbox/${conversation.id}`}>Ver Conversa</Link></DropdownMenuItem>
            <DropdownMenuItem>Fechar Atendimento</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(conversation.id)}
            >
              Copiar ID da Conversa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
