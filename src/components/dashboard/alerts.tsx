import { AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { mockDashboardData } from '@/lib/mock-data';

type Alert = (typeof mockDashboardData.alerts)[0];

interface AlertsProps {
  loading: boolean;
  alerts: Alert[] | undefined;
}

export function Alerts({ loading, alerts }: AlertsProps) {
  if (loading) {
    return (
        <>
            <Skeleton className="sm:col-span-2 h-[126px]" />
            <Skeleton className="sm:col-span-2 h-[126px]" />
        </>
    )
  }

  const highPriorityAlert = alerts?.find(a => a.priority === 'high');
  const mediumPriorityAlert = alerts?.find(a => a.priority === 'medium');

  return (
    <>
      <Card className="sm:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Alerta Urgente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <span className='font-semibold'>{highPriorityAlert?.title}:</span> {highPriorityAlert?.description}
          </div>
        </CardContent>
      </Card>
      <Card className="sm:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-yellow-600">
            <Info className="h-5 w-5" />
            Aviso Importante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
          <span className='font-semibold'>{mediumPriorityAlert?.title}:</span> {mediumPriorityAlert?.description}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
