"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Conversation, Customer } from "@/lib/types"
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

type InboxItem = Conversation & { customer: Customer | undefined }

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
    accessorKey: "customer",
    header: "Cliente",
    cell: ({ row }) => {
      const customer = row.original.customer;
      return (
        <Link href={`/inbox/${row.original.id}`}>
          <div className="flex items-center gap-3 group">
            <Avatar>
              <AvatarImage src={customer?.avatar} data-ai-hint="person avatar"/>
              <AvatarFallback>{customer?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium group-hover:underline">{customer?.name}</span>
              <span className="text-xs text-muted-foreground">{customer?.phone}</span>
            </div>
          </div>
        </Link>
      )
    }
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
    accessorKey: "channel",
    header: "Canal",
    cell: ({ row }) => <Badge variant="outline" className="font-normal">{row.getValue("channel")}</Badge>,
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
      const isAiActive: boolean = row.getValue("isAiActive");
      const status = isAiActive ? 'IA' : 'Humano';
      const badgeClass = isAiActive ? getStatusBadgeClasses('open') : getStatusBadgeClasses('aguardando humano');
      return (
        <Badge className={`${badgeClass} gap-2`}>
          {isAiActive ? <Bot className="size-3.5" /> : <User className="size-3.5" />}
          <span className="text-sm font-medium">{status}</span>
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
