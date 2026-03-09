import { redirect } from 'next/navigation';

export default function SettingsRootPage() {
  // Redireciona para a primeira página de configurações por padrão
  redirect('/settings/profile');
}
