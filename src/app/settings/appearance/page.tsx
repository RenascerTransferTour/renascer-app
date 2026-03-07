import { AppearanceForm } from "@/components/settings/appearance-form"
import { ResetSettings } from "@/components/settings/reset-settings"

export default function AppearanceSettingsPage() {
  return (
    <div className="space-y-8">
        <AppearanceForm />
        <ResetSettings />
    </div>
  )
}
