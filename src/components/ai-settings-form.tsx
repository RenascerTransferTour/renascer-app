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
import { Loader2, AlertTriangle, ShieldCheck, Bot, Info, History, SlidersHorizontal, MessageSquare, Workflow, Lock, KeyRound, Server, ChevronRight, Power } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"

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
        primaryProvider: 'gemini',
        isFallbackEnabled: false,
        fallbackProvider: 'openai',
        channelPermissions: {
            whatsapp: true,
            instagram: true,
            facebook: false,
            website: true
        },
        flowRouting: {
            welcome: 'gemini',
            qualification: 'gemini',
            faq: 'gemini',
            quoteCreation: 'automatic',
            bookingCreation: 'automatic',
            crmUpdate: 'automatic',
            saleClosing: 'automatic',
            postSale: 'automatic',
        }
    });

    const [testProvider, setTestProvider] = useState<'openai' | 'gemini'>('gemini');

    const handleTestPrompt = async () => {
        if (!testUserPrompt.trim()) return;
        setIsTesting(true);
        setTestResponse("");
        try {
            const result = await testAiChatPrompt({
                masterPrompt,
                userPrompt: testUserPrompt,
                provider: testProvider,
            });
            setTestResponse(result.response);
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "Não foi possível obter uma resposta da IA.";
            toast({
                variant: "destructive",
                title: "Erro no Teste",
                description: errorMessage,
            })
        } finally {
            setIsTesting(false);
        }
    }
    
    const modeDescriptions: Record<string, string> = {
        'off': 'A IA está completamente desligada e não interagirá com os clientes.',
        'assisted': 'IA coleta dados iniciais e então transfere para um humano para o orçamento. (Padrão)',
        'partial': 'IA pode criar rascunhos de orçamentos e reservas, mas um humano deve aprovar.',
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
                    <RadioGroup value={aiPermissions.automationMode} onValueChange={(v) => setAiPermissions(p => ({...p, automationMode: v}))} className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <CardTitle>Provedores de IA e Credenciais</CardTitle>
                <CardDescription>Gerencie quais modelos de IA são usados e suas credenciais (placeholders).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Provedor Principal</Label>
                    <Select value={aiPermissions.primaryProvider} onValueChange={(v) => setAiPermissions(p => ({...p, primaryProvider: v}))}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Selecione um provedor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="gemini">Gemini (Google)</SelectItem>
                            <SelectItem value="openai">OpenAI (ChatGPT)</SelectItem>
                            <SelectItem value="automatic">Automático / Fallback</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Separator/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="flex-row items-start justify-between">
                            <div>
                                <CardTitle className="text-lg">OpenAI (ChatGPT)</CardTitle>
                                <CardDescription>gpt-4-turbo</CardDescription>
                            </div>
                            <Badge variant="secondary">Configurado</Badge>
                        </CardHeader>
                        <CardContent className="space-y-2">
                             <div className="space-y-1">
                                <Label htmlFor="openai-key" className="text-xs text-muted-foreground flex items-center gap-1"><KeyRound className="size-3"/> OPENAI_API_KEY</Label>
                                <Input id="openai-key" type="password" disabled value="*******************************" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">Testar Conexão</Button>
                        </CardFooter>
                    </Card>
                     <Card>
                        <CardHeader className="flex-row items-start justify-between">
                            <div>
                                <CardTitle className="text-lg">Gemini (Google)</CardTitle>
                                <CardDescription>gemini-2.5-flash</CardDescription>
                            </div>
                            <Badge variant="secondary">Configurado</Badge>
                        </CardHeader>
                        <CardContent className="space-y-2">
                             <div className="space-y-1">
                                <Label htmlFor="gemini-key" className="text-xs text-muted-foreground flex items-center gap-1"><KeyRound className="size-3"/> GEMINI_API_KEY</Label>
                                <Input id="gemini-key" type="password" disabled value="*******************************" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">Testar Conexão</Button>
                        </CardFooter>
                    </Card>
                </div>
                 <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Aviso de Segurança</AlertTitle>
                    <AlertDescription>
                        As chaves de API reais devem ser armazenadas com segurança no backend (ex: environment variables) e nunca expostas no código do front-end. Estes campos são apenas representações visuais.
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Gerenciamento do Prompt Mestre</CardTitle>
                <CardDescription>Defina as instruções, identidade e regras do seu assistente de IA. Publique e teste suas alterações.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Tabs defaultValue="draft">
                    <TabsList>
                        <TabsTrigger value="draft">Rascunho</TabsTrigger>
                        <TabsTrigger value="published">Publicado</TabsTrigger>
                    </TabsList>
                    <TabsContent value="draft" className="space-y-4">
                        <Textarea
                        id="master-prompt"
                        placeholder="Defina as instruções principais para a IA..."
                        className="min-h-[250px] font-mono text-xs"
                        value={masterPrompt}
                        onChange={(e) => setMasterPrompt(e.target.value)}
                        />
                         <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Info className="size-4 shrink-0"/> 
                            <p>Você está editando o rascunho. Para aplicar as mudanças, salve e publique o prompt.</p>
                        </div>
                    </TabsContent>
                     <TabsContent value="published" className="space-y-4">
                        <Textarea
                        id="master-prompt-published"
                        className="min-h-[250px] font-mono text-xs bg-muted/70"
                        value={masterPrompt} // In a real app, this would be the last published version
                        readOnly
                        />
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Info className="size-4 shrink-0"/> 
                            <p>Esta é a versão atualmente em produção. Para alterá-la, edite o rascunho e publique.</p>
                        </div>
                    </TabsContent>
                </Tabs>
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
                                Envie uma mensagem de teste para ver como a IA responderá com o prompt de rascunho.
                            </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                 <div className="space-y-2">
                                    <Label htmlFor="test-provider">Provedor para Teste</Label>
                                    <Select value={testProvider} onValueChange={(v) => setTestProvider(v as any)}>
                                        <SelectTrigger id="test-provider">
                                            <SelectValue placeholder="Selecione o provedor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="gemini">Gemini (Simulado)</SelectItem>
                                            <SelectItem value="openai">OpenAI (Simulado)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
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
                                        <Label>Resposta da IA (Simulada via {testProvider}):</Label>
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
                 <div className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-sm">Compatibilidade do Prompt</h4>
                    <div className="flex items-center justify-between text-sm">
                        <p className="flex items-center gap-2"><span className="font-semibold">OpenAI</span> (gpt-4, gpt-3.5-turbo)</p>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Compatível</Badge>
                    </div>
                     <div className="flex items-center justify-between text-sm">
                        <p className="flex items-center gap-2"><span className="font-semibold">Gemini</span> (gemini-2.5-flash)</p>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Compatível</Badge>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="justify-end">
                 <Button>Salvar e Publicar Prompt</Button>
            </CardFooter>
        </Card>
      
        <Card>
            <CardHeader>
                <CardTitle>Regras de Negócio e Roteamento</CardTitle>
                <CardDescription>Defina quando a IA deve transferir o atendimento e quais ações ela pode tomar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label className="text-base">Exigir Aprovação Humana</Label>
                            <p className="text-sm text-muted-foreground">
                                Força a IA a encaminhar ações comerciais (orçamentos, reservas) para revisão manual. (Recomendado)
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
                    <Label className="font-semibold flex items-center gap-2"><Workflow/> Roteamento por Fluxo (Flows)</Label>
                    <div className="rounded-md border">
                       {flowPermissionsData.map((perm, index) => (
                             <div key={perm.id} className="flex flex-row items-center justify-between space-x-2 p-4">
                                <div className="space-y-0.5">
                                    <Label className='font-normal'>{perm.label}</Label>
                                    <p className="text-xs text-muted-foreground">
                                        {perm.description}
                                    </p>
                                </div>
                                 <Select value={aiPermissions.flowRouting[perm.id as keyof typeof aiPermissions.flowRouting]} onValueChange={v => setAiPermissions(p => ({...p, flowRouting: {...p.flowRouting, [perm.id]: v}}))}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Selecione Provedor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="automatic">Automático</SelectItem>
                                        <SelectItem value="gemini">Gemini</SelectItem>
                                        <SelectItem value="openai">OpenAI</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <Label className="font-semibold flex items-center gap-2"><MessageSquare/> Autorizações de Canal</Label>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-md border p-4">
                        {Object.entries(aiPermissions.channelPermissions).map(([id, checked]) => (
                             <div key={id} className="flex flex-row items-center justify-between">
                                <Label className='font-normal capitalize'>{id}</Label>
                                <Switch
                                    checked={checked}
                                    onCheckedChange={(c) => setAiPermissions(p => ({...p, channelPermissions: {...p.channelPermissions, [id]: c}}))}
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
      
        <div className="flex items-center justify-end gap-4">
            <Button variant="outline">Descartar Alterações</Button>
            <Button>Salvar e Publicar Alterações</Button>
        </div>
    </div>
    </TooltipProvider>
  )
}
