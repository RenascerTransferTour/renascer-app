import { SettingsNav } from '@/components/layout/settings-nav';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da plataforma e da inteligência artificial.
        </p>
      </div>
      <SettingsNav />
      <div className="pt-4">
        {children}
      </div>
    </div>
  );
}
