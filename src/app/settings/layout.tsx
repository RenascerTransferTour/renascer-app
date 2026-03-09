import { SettingsNav } from "@/components/settings/settings-nav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-2">
      <h1 className="text-3xl font-semibold">Configurações</h1>
      <div className="grid gap-6 md:grid-cols-[180px_1fr]">
        <SettingsNav />
        <div className="grid gap-6">{children}</div>
      </div>
    </div>
  );
}
