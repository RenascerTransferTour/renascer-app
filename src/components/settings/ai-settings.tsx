'use client';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Bot, Info } from "lucide-react"

export function AiSettings() {
    return (
        <Card>
            <CardHeader>
              <CardTitle>IA Magnus</CardTitle>
              <CardDescription>
                Configure o comportamento, as permissões e o prompt do seu assistente de IA.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="ai-mode" className="text-base">Modo de Operação da IA</Label>
                        <p className="text-sm text-muted-foreground">
                            Atualmente em <span className="font-semibold">Modo Assistente</span>. A IA apenas cria rascunhos e sugestões para aprovação humana.
                        </p>
                    </div>
                    <Switch id="ai-mode" checked={true} disabled />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="prompt">Prompt Mestre</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Você é Magnus, o assistente virtual da Renascer Tour..."
                    className="min-h-60"
                  />
                   <p className="text-sm text-muted-foreground">
                    Este prompt define a personalidade e as regras principais da sua IA.
                  </p>
                </div>
                 <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Funcionalidades Avançadas Desativadas</AlertTitle>
                    <AlertDescription>
                        A ativação de geração de mídias (áudio, vídeo, imagem) e a autonomia comercial completa da IA são funcionalidades futuras e estão desativadas nesta versão para garantir a estabilidade. Os botões relacionados foram removidos da UI de configurações para evitar confusão.
                    </AlertDescription>
                </Alert>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Salvar Configurações da IA</Button>
            </CardFooter>
        </Card>
    )
}
