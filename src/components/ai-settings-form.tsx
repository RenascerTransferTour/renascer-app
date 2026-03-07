"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { testAiChatPrompt } from "@/ai/flows/test-ai-chat-prompt-flow"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertTriangle, ShieldCheck } from "lucide-react"

export function AiSettingsForm() {
    const [masterPrompt, setMasterPrompt] = useState(`You are a premium virtual assistant for "Renascer Transfer Tour", specializing in executive transport, transfers, and tours. Your tone is professional, welcoming, and efficient.

Your primary goals are:
1.  **Welcome the user warmly**: Start with a professional and friendly greeting.
2.  **Understand the user's need**: Quickly identify if they need a Transfer, Tour, Executive Transport, or something else.
3.  **Gather key information**: Proactively ask for essential details to create a quote or booking, such as:
    -   Origin and Destination
    -   Date and Time
    -   Number of passengers
    -   Type of vehicle needed (if they know)
4.  **Be concise and clear**: Provide information directly and avoid jargon.
5.  **Escalate when necessary**: If the user asks to speak to a human, expresses frustration, or has a complex request (e.g., multi-day event logistics), set 'escalateToHuman' to true.`);
    const [testUserPrompt, setTestUserPrompt] = useState("Olá, quanto custa um transfer para o aeroporto de guarulhos?");
    const [testResponse, setTestResponse] = useState("");
    const [isTesting, setIsTesting] = useState(false);
    const { toast } = useToast();


    const handleTestPrompt = async () => {
        if (!testUserPrompt.trim()) return;
        setIsTesting(true);
        setTestResponse("");
        try {
            const result = await testAiChatPrompt({
                masterPrompt,
                userPrompt: testUserPrompt,
            });
            setTestResponse(result.response);
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Erro no Teste",
                description: "Não foi possível obter uma resposta da IA.",
            })
        } finally {
            setIsTesting(false);
        }
    }


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
            <CardTitle>Comportamento Geral da IA</CardTitle>
            <CardDescription>Defina as instruções principais e o comportamento geral do seu assistente de IA.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
                <Switch id="ai-active" defaultChecked />
                <Label htmlFor="ai-active">Ativar IA globalmente no sistema</Label>
            </div>
            <Separator />
             <div className="space-y-2">
                <Label htmlFor="master-prompt">Prompt Mestre (Instrução Principal)</Label>
                <Textarea
                id="master-prompt"
                placeholder="Defina as instruções principais para a IA..."
                className="min-h-[250px] font-mono text-xs"
                value={masterPrompt}
                onChange={(e) => setMasterPrompt(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                Este é o prompt principal que guia todas as interações da IA. Seja claro e detalhado sobre o tom, objetivo e regras.
                </p>
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Regras de Negócio e Handoff</CardTitle>
            <CardDescription>Defina regras para automação, qualificação e transferência para um atendente humano.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="mandatory-questions">Perguntas Obrigatórias (separadas por vírgula)</Label>
                <Input id="mandatory-questions" placeholder="ex: Qual seu nome?, Qual seu email de contato?" />
                <p className="text-sm text-muted-foreground">A IA tentará obter essas informações antes de passar para um humano.</p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="forbidden-words">Palavras-chave para Handoff Imediato (separadas por vírgula)</Label>
                <Input id="forbidden-words" placeholder="ex: falar com atendente, reclamar, problema" />
                <p className="text-sm text-muted-foreground">Se o cliente usar uma dessas palavras, a IA irá transferir o atendimento imediatamente.</p>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <div className="flex items-center gap-2">
                <AlertTriangle className="text-destructive"/>
                <CardTitle>Configuração Avançada</CardTitle>
            </div>
            <CardDescription>Cuidado: alterações aqui podem impactar a integração com os serviços de IA.</CardDescription>
        </CardHeader>
        <CardContent>
             <div className="space-y-2">
                <Label htmlFor="api-key">Chave da API (Google AI)</Label>
                <div className="relative">
                    <Input id="api-key" type="password" value="**********************************" disabled />
                    <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                </div>
                <p className="text-sm text-muted-foreground">Sua chave de API é armazenada de forma segura e não é exposta no frontend.</p>
            </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-end gap-4">
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Testar Prompt</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                <DialogTitle>Testar Prompt da IA</DialogTitle>
                <DialogDescription>
                    Envie um prompt de usuário para ver como a IA responderá com as configurações atuais.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="test-prompt">
                            Mensagem do Usuário:
                        </Label>
                        <Textarea
                        id="test-prompt"
                        value={testUserPrompt}
                        onChange={(e) => setTestUserPrompt(e.target.value)}
                        className="min-h-[80px]"
                        />
                    </div>
                    {isTesting && (
                         <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-6 w-6 animate-spin" />
                         </div>
                    )}
                    {testResponse && (
                        <div>
                            <Label>Resposta da IA:</Label>
                            <div className="rounded-md border bg-muted p-4 text-sm mt-2">
                                {testResponse}
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                <Button type="submit" onClick={handleTestPrompt} disabled={isTesting}>
                    {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    Enviar Teste
                </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        <Button>Salvar e Publicar Alterações</Button>
      </div>
    </div>
  )
}
