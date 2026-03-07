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
import { Loader2, AlertTriangle, ShieldCheck, Bot, Info, History, SlidersHorizontal, MessageSquare, Workflow, Lock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

const flowPermissionsData = [
    { id: 'welcome', label: 'Boas-Vindas', description: 'Permite que a IA envie a primeira mensagem de boas-vindas.' },
    { id: 'qualification', label: 'Qualificação', description: 'Permite que a IA faça perguntas para coletar dados do cliente.' },
    { id: 'faq', label: 'Respostas Frequentes', description: 'Permite que a IA responda perguntas gerais da base de conhecimento.' },
    { id: 'quoteCreation', label: 'Criação de Orçamento', description: 'Permite que a IA crie rascunhos de orçamentos.' },
    { id: 'bookingCreation', label: 'Criação de Reserva', description: 'Permite que a IA crie rascunhos de reservas.' },
    { id: 'crmUpdate', label: 'Avanço no CRM', description: 'Permite que a IA mova cards entre etapas no pipeline.' },
    { id: 'saleClosing', label: 'Fechamento de Venda', description: 'Permite que a IA marque um negócio como "Fechado".' },
    { id: 'postSale', label: 'Pós-Venda', description: 'Permite que a IA envie mensagens de acompanhamento.' },
];

const channelPermissionsData = [
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'website', label: 'Website' },
];


export function AiSettingsForm() {
    const [masterPrompt, setMasterPrompt] = useState(`You are a premium virtual assistant for "Renascer Transfer Tour", specializing in executive transport, transfers, and tours. Your tone is professional, welcoming, and efficient. You are a pre-service assistant. Your main goal is lead qualification and conversation organization.

Your primary goals are:
1.  **Welcome the user warmly**: Start with a professional and friendly greeting, introducing yourself as the virtual assistant for Renascer Transfer Tour.
2.  **Understand the user's need**: Quickly identify if they need a 'Transfer', 'Turismo', 'Transporte Executivo', 'Serviço para Eventos', or 'Viagem Longa'.
3.  **Extract Information**: Fill in the 'gatheredInformation' object with all relevant details you can find from the entire conversation. If a piece of information is not available or unclear, set the corresponding field to 'null'.
4.  **DO NOT PROVIDE PRICES OR QUOTES**: You are not authorized to give final prices or create quotes. Your role is to collect data.
5.  **Formulate a Handoff Response**: When the user requests a price or has provided enough information for a quote, your 'aiResponse' must state that you have gathered the necessary information and that a human specialist will take over.
    - Example response: "Obrigada pelas informações! Coletei tudo que preciso. A Cláudia, nossa especialista, irá preparar seu orçamento e entrará em contato em breve."
6.  **Decide on Escalation**: Set 'escalateToHuman' to 'true' in the following situations:
    - The user has provided enough information to generate a quote (e.g., origin, destination, date, number of passengers).
    - The customer explicitly requests to speak to a human (e.g., "quero falar com uma pessoa", "falar com atendente", "falar com Cláudia").
    - The inquiry is about a complaint, a very complex event, or a sensitive matter.
    - The customer expresses clear frustration or confusion.
    - You have already asked for key information twice and the customer has not provided it.
Otherwise, set 'escalateToHuman' to 'false' and continue the automated qualification service.`);
    
    const [testUserPrompt, setTestUserPrompt] = useState("Olá, quanto custa um transfer para o aeroporto de guarulhos?");
    const [testResponse, setTestResponse] = useState("");
    const [isTesting, setIsTesting] = useState(false);
    const { toast } = useToast();
    
    const [aiPermissions, setAiPermissions] = useState({
        globalOn: true,
        automationMode: 'assisted',
        requireHumanApproval: true,
        humanFallback: 'Claudia',
        flowPermissions: {
            welcome: true,
            qualification: true,
            faq: true,
            quoteCreation: false,
            bookingCreation: false,
            crmUpdate: false,
            saleClosing: false,
            postSale: false
        },
        channelPermissions: {
            whatsapp: true,
            instagram: true,
            facebook: false,
            website: true
        }
    });

    const handlePermissionChange = <T extends keyof typeof aiPermissions.flowPermissions>(id: T, checked: boolean) => {
        setAiPermissions(prev => ({...prev, flowPermissions: {...prev.flowPermissions, [id]: checked}}))
    };

    const handleChannelPermissionChange = <T extends keyof typeof aiPermissions.channelPermissions>(id: T, checked: boolean) => {
        setAiPermissions(prev => ({...prev, channelPermissions: {...prev.channelPermissions, [id]: checked}}))
    };


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
    
    const modeDescriptions: Record<string, string> = {
        'off': 'A IA está completamente desligada e não interagirá com os clientes.',
        'welcome': 'A IA apenas cumprimenta o cliente e imediatamente transfere para um humano.',
        'assisted': 'IA coleta dados iniciais e então transfere para um humano para o orçamento. (Padrão)',
        'partial': 'A IA pode criar rascunhos de orçamentos e reservas, mas um humano deve aprovar.',
        'full': 'A IA pode fechar vendas e confirmar reservas de forma autônoma. (Requer cuidado)',
    }

  return (
    <TooltipProvider>
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Controle Geral e Modo de Autonomia</CardTitle>
                <CardDescription>Ative ou desative a IA e defina seu nível de autonomia no sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Label htmlFor="ai-active" className="flex-1">
                        <h4 className='font-semibold'>Chave Geral da IA</h4>
                        <p className='text-xs text-muted-foreground'>Ativa ou desativa completamente a inteligência artificial em todos os canais.</p>
                    </Label>
                    <Switch id="ai-active" checked={aiPermissions.globalOn} onCheckedChange={(c) => setAiPermissions(p => ({...p, globalOn: c}))} />
                </div>
                
                <div className="space-y-2">
                    <Label>Modo de Automação</Label>
                    <RadioGroup value={aiPermissions.automationMode} onValueChange={(v) => setAiPermissions(p => ({...p, automationMode: v}))} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <RadioGroupItem value="off" id="r0" className="peer sr-only" />
                            <Label htmlFor="r0" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                <Bot className="mb-2"/>
                                IA Desligada
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="assisted" id="r2" className="peer sr-only" />
                            <Label htmlFor="r2" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                <Bot className="mb-2"/>
                                IA Assistida
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="partial" id="r3" className="peer sr-only"/>
                            <Label htmlFor="r3" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                <Bot className="mb-2"/>
                                IA Operacional Parcial
                            </Label>
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div>
                                    <RadioGroupItem value="full" id="r4" className="peer sr-only" disabled />
                                    <Label htmlFor="r4" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 opacity-60 cursor-not-allowed">
                                        <div className='relative'>
                                            <Bot className="mb-2"/>
                                            <Lock className='absolute -top-1 -right-1 size-3 bg-background text-muted-foreground p-0.5 rounded-full'/>
                                        </div>
                                        IA Completa (Autônoma)
                                    </Label>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Este modo estará disponível em breve.</p>
                            </TooltipContent>
                        </Tooltip>
                    </RadioGroup>
                    <Alert variant={aiPermissions.automationMode === 'full' ? 'destructive' : 'default'} className="mt-4">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Modo selecionado: {aiPermissions.automationMode}</AlertTitle>
                        <AlertDescription>
                            {modeDescriptions[aiPermissions.automationMode]}
                        </AlertDescription>
                    </Alert>
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
                    <Label htmlFor="master-prompt">Prompt Mestre (Rascunho)</Label>
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
                <CardTitle>Regras de Negócio e Permissões</CardTitle>
                <CardDescription>Defina quando a IA deve transferir o atendimento e quais ações ela pode tomar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label className="text-base">Exigir Aprovação Humana</Label>
                            <p className="text-sm text-muted-foreground">
                                Força a IA a encaminhar todas as ações comerciais (orçamentos, reservas, vendas) para revisão e aprovação manual. (Recomendado)
                            </p>
                        </div>
                        <Switch
                            checked={aiPermissions.requireHumanApproval}
                            onCheckedChange={(c) => setAiPermissions(p => ({...p, requireHumanApproval: c}))}
                            aria-label="Exigir Aprovação Humana"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="human-fallback">Responsável Humano (Fallback)</Label>
                        <Input id="human-fallback" value={aiPermissions.humanFallback} onChange={(e) => setAiPermissions(p => ({...p, humanFallback: e.target.value}))}/>
                        <p className="text-sm text-muted-foreground">Nome do humano que receberá as solicitações que a IA não pode concluir.</p>
                    </div>
                </div>
                <Separator/>

                 <div className="space-y-4">
                    <Label className="font-semibold flex items-center gap-2"><Workflow/> Autorizações de Fluxo (Flows)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-md border p-4">
                        {flowPermissionsData.map(perm => (
                             <div key={perm.id} className="flex flex-row items-start justify-between space-x-2">
                                <div className="space-y-0.5">
                                    <Label className='font-normal'>{perm.label}</Label>
                                    <p className="text-xs text-muted-foreground">
                                        {perm.description}
                                    </p>
                                </div>
                                <Switch
                                    checked={aiPermissions.flowPermissions[perm.id as keyof typeof aiPermissions.flowPermissions]}
                                    onCheckedChange={(c) => handlePermissionChange(perm.id as keyof typeof aiPermissions.flowPermissions, c)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <Label className="font-semibold flex items-center gap-2"><MessageSquare/> Autorizações de Canal</Label>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-md border p-4">
                        {channelPermissionsData.map(perm => (
                             <div key={perm.id} className="flex flex-row items-center justify-between">
                                <Label className='font-normal'>{perm.label}</Label>
                                <Switch
                                    checked={aiPermissions.channelPermissions[perm.id as keyof typeof aiPermissions.channelPermissions]}
                                    onCheckedChange={(c) => handleChannelPermissionChange(perm.id as keyof typeof aiPermissions.channelPermissions, c)}
                                />
                            </div>
                        ))}
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
    </TooltipProvider>
  )
}
