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
    <Card>
      <CardHeader>
        <CardTitle>Controle Geral da IA</CardTitle>
        <CardDescription>
          Use esta seção para definir as instruções principais e o comportamento geral do seu assistente de IA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AiSettingsForm />
      </CardContent>
    </Card>
  )
}
