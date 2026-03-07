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

type InboxItem = Conversation & { customer: Customer | undefined }

const getPriorityVariant = (priority: 'low' | 'medium' | 'high') => {
  switch (priority) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'secondary';
    default:
      return 'outline';
  }
};

const getStatusVariant = (status: 'open' | 'closed' | 'pending') => {
    switch (status) {
      case 'open':
        return 'default';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };


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
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={customer?.avatar} data-ai-hint="person avatar"/>
              <AvatarFallback>{customer?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{customer?.name}</span>
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
            <Link href={`/inbox/${row.original.id}`}>
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
    cell: ({ row }) => <Badge variant="outline">{row.getValue("channel")}</Badge>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge variant={getStatusVariant(row.getValue("status"))}>{row.getValue("status")}</Badge>,
  },
  {
    accessorKey: "priority",
    header: "Prioridade",
    cell: ({ row }) => (
      <Badge variant={getPriorityVariant(row.getValue("priority"))}>{row.getValue("priority")}</Badge>
    )
  },
  {
    accessorKey: "isAiActive",
    header: "Atendente",
    cell: ({ row }) => {
      const isAiActive: boolean = row.getValue("isAiActive");
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          {isAiActive ? <Bot className="size-4" /> : <User className="size-4" />}
          <span className="text-sm">{isAiActive ? 'IA' : 'Humano'}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "lastMessageAt",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Atualizado em
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    cell: ({ row }) => {
        const date = parseISO(row.getValue("lastMessageAt"));
        return <div className="text-right pr-4">{format(date, "dd/MM/yyyy HH:mm", { locale: ptBR })}</div>
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(conversation.id)}
            >
              Copiar ID da Conversa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href={`/inbox/${conversation.id}`}>Ver Conversa</Link></DropdownMenuItem>
            <DropdownMenuItem>Fechar Atendimento</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
