"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  return (
    <div>
        <div className="flex items-center py-4 gap-2">
            <Input
            placeholder="Filtrar por nome do cliente..."
            value={(table.getColumn("contact")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn("contact")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
            <Select onValueChange={(value) => table.getColumn("channelId")?.setFilterValue(value === "all" ? "" : `channel-${value}`)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Canal" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos Canais</SelectItem>
                    <SelectItem value="wa">WhatsApp</SelectItem>
                    <SelectItem value="ig">Instagram</SelectItem>
                    <SelectItem value="fb">Facebook</SelectItem>
                    <SelectItem value="web">Website</SelectItem>
                </SelectContent>
            </Select>
            <Select onValueChange={(value) => table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Situação" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas Situações</SelectItem>
                    <SelectItem value="open">Aberto</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="aguardando humano">Aguardando Humano</SelectItem>
                    <SelectItem value="IA assistida">IA Assistida</SelectItem>
                    <SelectItem value="unconfirmed">Não Confirmado</SelectItem>
                    <SelectItem value="canceled">Cancelado</SelectItem>
                    <SelectItem value="closed">Fechado</SelectItem>
                </SelectContent>
            </Select>
            
        </div>
        <div className="rounded-md border">
        <Table>
            <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return (
                    <TableHead key={header.id}>
                        {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                            )}
                    </TableHead>
                    )
                })}
                </TableRow>
            ))}
            </TableHeader>
            <TableBody>
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                >
                    {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    ))}
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    Nenhum resultado encontrado.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            >
            Anterior
            </Button>
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            >
            Próximo
            </Button>
        </div>
    </div>
  )
}
