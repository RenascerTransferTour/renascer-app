import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AiSettingsForm } from "@/components/ai-settings-form"

export default function AiSettingsPage() {
  return (
    <div className="space-y-6">
        <AiSettingsForm />
    </div>
  )
}
