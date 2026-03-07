import { StatsCards } from '@/components/dashboard/stats-cards';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { RecentActivities } from '@/components/dashboard/recent-activities';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Operacional</h1>
        <p className="text-muted-foreground">
          Visão geral das métricas e atividades da Renascer Transfer Tour.
        </p>
      </div>
      
      <StatsCards />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div className="lg:col-span-1">
          <RecentActivities />
        </div>
      </div>
    </div>
  );
}
