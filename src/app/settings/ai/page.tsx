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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuração Avançada da IA</h1>
        <p className="text-muted-foreground">
          Gerencie o comportamento da IA, prompts, regras e mais.
        </p>
      </div>
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
    </div>
  )
}
