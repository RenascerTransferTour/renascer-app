import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getStatusBadgeClasses = (status?: string) => {
  if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';
  switch (status.toLowerCase()) {
    // Green
    case 'confirmada':
    case 'aprovado':
    case 'closed-won':
    case 'concluída':
    case 'ativo':
    case 'ia autorizada':
    case 'connected':
      return 'border-transparent bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300';
    // Yellow / Amber
    case 'não confirmado':
    case 'pendente':
    case 'em revisão':
    case 'negotiation':
    case 'aguardando aprovação':
      return 'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300';
    // Red / Destructive
    case 'cancelada':
    case 'cancelado':
    case 'perdido':
    case 'closed-lost':
    case 'ia bloqueada':
    case 'failing':
    case 'disconnected':
    case 'expired':
      return 'border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20';
    // Blue / Info
    case 'em andamento':
    case 'open':
    case 'qualified':
    case 'new-lead':
    case 'ia assistida':
      return 'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300';
    // Orange / Warning
    case 'aguardando humano':
    case 'humano':
    case 'aguardando fechamento':
    case 'awaiting_qr':
      return 'border-transparent bg-orange-100 text-orange-800 dark:bg-orange-800/30 dark:text-orange-300';
    // Purple / Special
    case 'enviado':
    case 'quote-sent':
    case 'concluído pela ia':
      return 'border-transparent bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-300';
    // Cyan / Rescheduled
    case 'reagendada':
        return 'border-transparent bg-cyan-100 text-cyan-800 dark:bg-cyan-800/30 dark:text-cyan-300';
    // Gray / Neutral
    case 'closed':
    case 'rascunho':
    case 'concluído por humano':
    case 'mock':
    default:
      return 'border-transparent bg-muted text-muted-foreground hover:bg-muted/80';
  }
};
