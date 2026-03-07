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
import { testAiChatPrompt } from "@/ai/flows/test-ai-chat-prompt-flow"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function AiSettingsForm() {
    const [masterPrompt, setMasterPrompt] = useState(`You are an intelligent customer support AI for "Central de Atendimento IA Renascer". Your goal is to assist customers by understanding their inquiries, gathering necessary information, providing automated responses, and escalating to a human agent when appropriate. Act as a helpful, polite, and efficient virtual assistant. Prioritize gathering key details for service requests, like customer name, contact info, service type, destination, dates, times, and number of passengers.`);
    const [testUserPrompt, setTestUserPrompt] = useState("Olá, quanto custa um transfer para o aeroporto?");
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
      <div className="flex items-center space-x-2">
        <Switch id="ai-active" defaultChecked />
        <Label htmlFor="ai-active">Ativar IA globalmente</Label>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="master-prompt">Prompt Mestre</Label>
        <Textarea
          id="master-prompt"
          placeholder="Defina as instruções principais para a IA..."
          className="min-h-[200px]"
          value={masterPrompt}
          onChange={(e) => setMasterPrompt(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Este é o prompt principal que guia todas as interações da IA.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Regras de Negócio</h3>
        <div className="space-y-2">
          <Label htmlFor="forbidden-words">Mensagens Proibidas (separadas por vírgula)</Label>
          <Input id="forbidden-words" placeholder="ex: promoção, desconto, grátis" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mandatory-questions">Perguntas Obrigatórias (separadas por vírgula)</Label>
          <Input id="mandatory-questions" placeholder="ex: Qual seu nome?, Qual seu email?" />
        </div>
      </div>
      
      <Separator />
      
      <div className="flex items-center justify-between">
        <div>
            <h3 className="font-medium">Versão do Prompt</h3>
            <p className="text-sm text-muted-foreground">Rascunho (não publicado)</p>
        </div>
        <div className="flex gap-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Testar Prompt</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Testar Prompt da IA</DialogTitle>
                    <DialogDescription>
                        Envie um prompt de usuário para ver como a IA responderá com as configurações atuais.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="test-prompt" className="text-right">
                                Prompt
                            </Label>
                            <Input
                            id="test-prompt"
                            value={testUserPrompt}
                            onChange={(e) => setTestUserPrompt(e.target.value)}
                            className="col-span-3"
                            />
                        </div>
                        {isTesting && (
                             <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin" />
                             </div>
                        )}
                        {testResponse && (
                            <div className="rounded-md border bg-muted p-4 text-sm">
                                {testResponse}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                    <Button type="submit" onClick={handleTestPrompt} disabled={isTesting}>Testar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Button>Salvar e Publicar</Button>
        </div>
      </div>
    </div>
  )
}
