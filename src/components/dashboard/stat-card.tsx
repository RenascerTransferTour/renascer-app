import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon, MessagesSquare, CalendarCheck, FileText, DollarSign } from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  MessagesSquare,
  CalendarCheck,
  FileText,
  DollarSign,
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
}

export function StatCard({ title, value, change, icon }: StatCardProps) {
  const Icon = iconMap[icon] || DollarSign;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  );
}
