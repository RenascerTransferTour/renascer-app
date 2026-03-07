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
    CardFooter,
  } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { testAiChatPrompt } from "@/ai/flows/test-ai-chat-prompt-flow"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertTriangle, ShieldCheck, Bot, Info, History } from "lucide-react"

export function AiSettingsForm() {
    const [masterPrompt, setMasterPrompt] = useState(`You are a premium virtual assistant for "Renascer Transfer Tour", specializing in executive transport, transfers, and tours. Your tone is professional, welcoming, and efficient.

Your primary goals are:
1.  **Welcome the user warmly**: Start with a professional and friendly greeting.
2.  **Understand the user's need**: Quickly identify if they need a Transfer, Tour, Executive Transport, or something else.
3.  **Gather key information**: Proactively ask for essential details to create a quote or booking, such as: Origin, Destination, Date, Time, Number of passengers.
4.  **Handoff to human**: Once enough information is gathered for a quote, inform the user that a specialist (Claudia) will take over. DO NOT provide prices or finalize bookings.
5.  **Escalate when necessary**: If the user asks to speak to a human, expresses frustration, or has a complex request, set 'escalateToHuman' to true.`);
    
    const [testUserPrompt, setTestUserPrompt] = useState("Olá, quanto custa um transfer para o aeroporto de guarulhos?");
    const [testResponse, setTestResponse] = useState("");
    const [isTesting, setIsTesting] = useState(false);
    const { toast } = useToast();
    
    const [aiPermissions, setAiPermissions] = useState({
        allowQuoteSuggestion: false,
        allowBookingDraft: true,
        allowSaleCompletion: false,
        requireHumanApproval: true,
    })

    const handlePermissionChange = (id: keyof typeof aiPermissions, checked: boolean) => {
        setAiPermissions(prev => ({...prev, [id]: checked}))
    }


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
                <CardTitle>Controle Geral e Modo de Operação</CardTitle>
                <CardDescription>Ative ou desative a IA e defina seu nível de autonomia no sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <Switch id="ai-active" defaultChecked />
                    <Label htmlFor="ai-active" className="text-base">IA Globalmente Ativa</Label>
                </div>
                
                <div className="space-y-2">
                    <Label>Modo de Operação da IA</Label>
                    <RadioGroup defaultValue="qualification" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <RadioGroupItem value="welcome" id="r1" className="peer sr-only" />
                            <Label htmlFor="r1" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                IA Somente Boas-Vindas
                                <p className="text-xs text-muted-foreground text-center mt-2">A IA apenas cumprimenta o cliente e imediatamente transfere para um humano.</p>
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="qualification" id="r2" className="peer sr-only" />
                            <Label htmlFor="r2" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                IA Somente Qualificação
                                <p className="text-xs text-muted-foreground text-center mt-2">A IA coleta dados iniciais e então transfere para Claudia para o orçamento. (Padrão)</p>
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="assisted" id="r3" className="peer sr-only" disabled/>
                            <Label htmlFor="r3" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary opacity-50 cursor-not-allowed">
                                IA Atendimento Assistido
                                <p className="text-xs text-muted-foreground text-center mt-2">A IA pode sugerir orçamentos e rascunhos de reserva, mas Claudia deve aprovar.</p>
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="full" id="r4" className="peer sr-only" disabled />
                            <Label htmlFor="r4" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary opacity-50 cursor-not-allowed">
                                IA Atendimento Completo
                                <p className="text-xs text-muted-foreground text-center mt-2">A IA pode fechar vendas e confirmar reservas de forma autônoma. (Futuro)</p>
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Gerenciamento do Prompt Mestre</CardTitle>
                <CardDescription>Defina as instruções principais, identidade e regras de comportamento do seu assistente de IA.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="master-prompt">Prompt Mestre (Instrução Principal)</Label>
                    <Textarea
                    id="master-prompt"
                    placeholder="Defina as instruções principais para a IA..."
                    className="min-h-[250px] font-mono text-xs"
                    value={masterPrompt}
                    onChange={(e) => setMasterPrompt(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Info className="size-4"/> Este é o prompt que guia todas as interações da IA. Seja claro sobre o tom, objetivo e regras.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="w-full">
                        <History className="mr-2"/> Ver Histórico de Versões
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full">Testar Prompt</Button>
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
                </div>
            </CardContent>
            <CardFooter className="justify-end">
                 <Button>Salvar e Publicar Prompt</Button>
            </CardFooter>
        </Card>
      
        <Card>
            <CardHeader>
                <CardTitle>Regras de Negócio e Permissões de Handoff</CardTitle>
                <CardDescription>Defina quando a IA deve transferir o atendimento para um humano e quais ações ela pode tomar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Alert>
                    <Bot className="h-4 w-4" />
                    <AlertTitle>Responsável Humano</AlertTitle>
                    <AlertDescription>
                        Atualmente, <strong>Cláudia</strong> é a responsável por todos os orçamentos, reservas e fechamentos de vendas.
                    </AlertDescription>
                </Alert>
                <div className="space-y-4 rounded-md border p-4">
                     <div className="flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                        <Label>Exigir Aprovação Humana</Label>
                        <p className="text-xs text-muted-foreground">
                            Força a IA a encaminhar todas as ações comerciais para Cláudia. (Recomendado)
                        </p>
                        </div>
                        <Switch
                            checked={aiPermissions.requireHumanApproval}
                            onCheckedChange={(c) => handlePermissionChange('requireHumanApproval', c)}
                        />
                    </div>
                    <Separator/>
                    <div className="flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                        <Label>Permitir IA sugerir orçamentos</Label>
                        <p className="text-xs text-muted-foreground">
                            Permite que a IA envie uma faixa de preço estimada para o cliente.
                        </p>
                        </div>
                        <Switch
                            checked={aiPermissions.allowQuoteSuggestion}
                            onCheckedChange={(c) => handlePermissionChange('allowQuoteSuggestion', c)}
                        />
                    </div>
                     <div className="flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                        <Label>Permitir IA criar rascunho de reserva</Label>
                        <p className="text-xs text-muted-foreground">
                           A IA pode criar uma reserva com status "não confirmado".
                        </p>
                        </div>
                        <Switch
                            checked={aiPermissions.allowBookingDraft}
                            onCheckedChange={(c) => handlePermissionChange('allowBookingDraft', c)}
                        />
                    </div>
                     <div className="flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                        <Label>Permitir IA concluir venda</Label>
                        <p className="text-xs text-muted-foreground">
                           Permite que a IA mova um card para "Fechado" no pipeline de vendas.
                        </p>
                        </div>
                        <Switch
                            checked={aiPermissions.allowSaleCompletion}
                            onCheckedChange={(c) => handlePermissionChange('allowSaleCompletion', c)}
                        />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="forbidden-words">Palavras-chave para Handoff Imediato (separadas por vírgula)</Label>
                    <Input id="forbidden-words" defaultValue="falar com atendente, falar com claudia, reclamar, problema, procon" />
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
            <Button variant="destructive">Descartar Alterações</Button>
            <Button>Salvar e Publicar Alterações</Button>
        </div>
    </div>
  )
}
