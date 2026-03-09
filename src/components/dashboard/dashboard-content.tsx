'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchWithDelay, mockDashboardData } from '@/lib/mock-data';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from './stat-card';
import { Alerts } from './alerts';
import { UpcomingBookings } from './upcoming-bookings';
import { RecentActivity } from './recent-activity';

type DashboardData = typeof mockDashboardData;

export function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const dashboardData = await fetchWithDelay(mockDashboardData, 1000);
      setData(dashboardData);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {loading || !data
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[126px]" />)
          : data.stats.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                <Alerts loading={loading} alerts={data?.alerts} />
            </div>
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>
                Últimos atendimentos, orçamentos e agendamentos no sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <RecentActivity />
            </CardContent>
          </Card>
        </div>
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
            <CardDescription>Serviços agendados para hoje.</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingBookings loading={loading} bookings={data?.upcomingBookings} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
