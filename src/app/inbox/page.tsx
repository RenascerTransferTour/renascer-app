import { conversations, customers } from "@/lib/data"
import type { Conversation, Customer } from "@/lib/types"
import { DataTable } from "./data-table"
import { columns } from "./columns"

type InboxItem = Conversation & { customer: Customer | undefined }

export default function InboxPage() {
  const data: InboxItem[] = conversations.map(conv => ({
    ...conv,
    customer: customers.find(c => c.id === conv.customerId)
  }))

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Caixa de Entrada Omnichannel</h1>
        <p className="text-muted-foreground">
          Gerencie todas as suas conversas em um único lugar.
        </p>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
