"use client"

import { useState, useEffect } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { testAiChatPrompt, TestAiChatPromptOutput } from "@/ai/flows/test-ai-chat-prompt-flow"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertTriangle, ShieldCheck, Bot, Info, History, SlidersHorizontal, MessageSquare, Workflow, Lock, KeyRound, Server, ChevronRight, Power, HelpCircle, CheckCircle, XCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { Skeleton } from "./ui/skeleton"
import type { AiSettings, AiPrompt } from "@/lib/db/data-model"
import type { ProviderStatus } from "@/app/api/settings/ai/providers/route"
import { cn } from "@/lib/utils"

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
    const [settings, setSettings] = useState<any | null>(null);
    const [prompts, setPrompts] = useState<AiPrompt[]>([]);
    const [loading, setLoading] = useState(true);

    const [providerStatus, setProviderStatus] = useState<ProviderStatus[]>([]);
    const [loadingProviders, setLoadingProviders] = useState(true);

    const [draftPrompt, setDraftPrompt] = useState<AiPrompt | null>(null);
    const [publishedPrompt, setPublishedPrompt] = useState<AiPrompt | null>(null);

    const [testUserPrompt, setTestUserPrompt] = useState("Olá, quanto custa um transfer para o aeroporto de guarulhos?");
    const [testResult, setTestResult] = useState<Partial<TestAiChatPromptOutput> | null>(null);
    const [isTesting, setIsTesting] = useState(false);
    const { toast } = useToast();
    
    const [testProvider, setTestProvider] = useState<'openai' | 'gemini' | 'automatic'>('automatic');

    const handleFetchError = (error: any, context: string) => {
        console.error(`Failed to fetch ${context}`, error);
        toast({
            variant: "destructive",
            title: `Erro ao carregar ${context}`,
            description: error instanceof Error ? error.message : "O servidor retornou uma resposta inesperada.",
        });
    }

     useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setLoadingProviders(true);

                const processResponse = async (res: Response, name: string) => {
                    if (!res.ok) {
                        const errorText = await res.text();
                        let errorDetails = errorText;
                        try {
                           errorDetails = JSON.parse(errorText).details || errorText;
                        } catch (e) { /* Not a JSON response */ }
                        throw new Error(`Falha ao buscar ${name}. Status: ${res.status}. Detalhes: ${errorDetails}`);
                    }
                    const contentType = res.headers.get("content-type");
                    if (!contentType || !contentType.includes("application/json")) {
                        console.error(`Resposta não-JSON para ${name}`, await res.text());
                        throw new TypeError(`Resposta inesperada do servidor para ${name}.`);
                    }
                    return res.json();
                };

                const [settingsRes, promptsRes, providersRes] = await Promise.all([
                    fetch('/api/settings/ai'),
                    fetch('/api/settings/prompts'),
                    fetch('/api/settings/ai/providers')
                ]);
                
                const settingsData = await processResponse(settingsRes, 'configurações de IA');
                const promptsData = await processResponse(promptsRes, 'prompts');
                const providersData = await processResponse(providersRes, 'status do provedor');
                
                setSettings(settingsData);
                setPrompts(promptsData);
                setProviderStatus(providersData);

                const draft = promptsData.find((p: AiPrompt) => p.status === 'draft');
                const published = promptsData.find((p: AiPrompt) => p.status === 'published');
                setDraftPrompt(draft || null);
                setPublishedPrompt(published || null);

            } catch (error) {
                handleFetchError(error, "configurações");
            } finally {
                setLoading(false);
                setLoadingProviders(false);
            }
        };
        fetchData();
    }, [toast]);


    const handleTestPrompt = async () => {
        if (!testUserPrompt.trim() || !draftPrompt?.content) {
            toast({
                variant: "destructive",
                title: "Aviso",
                description: "O prompt de rascunho e a mensagem do usuário não podem estar vazios.",
            });
            return;
        }
        setIsTesting(true);
        setTestResult(null);
        try {
            const res = await fetch('/api/ai/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    masterPrompt: draftPrompt.content,
                    userPrompt: testUserPrompt,
                    provider: testProvider,
                }),
            });

            if (!res.ok) {
                 const errorBody = await res.text();
                 let errorDetails = "Ocorreu um erro no servidor.";
                 try {
                     const errorJson = JSON.parse(errorBody);
                     errorDetails = errorJson.details || errorJson.error || errorDetails;
                 } catch (e) {
                     console.error("Received non-JSON error response from test API", errorBody);
                     errorDetails = `Resposta inesperada do servidor: ${errorBody.substring(0, 100)}`;
                 }
                 throw new Error(errorDetails);
            }
            
            const result = await res.json();
            if (result.error) {
                 throw new Error(result.details || result.error);
            }

            setTestResult(result);
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "Não foi possível obter uma resposta da IA.";
            setTestResult({ wasBlocked: true, blockReason: errorMessage });
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
        'partial_autonomous': 'IA pode criar rascunhos de orçamentos e reservas, mas um humano deve aprovar.',
        'full_autonomous': 'A IA pode fechar vendas e confirmar reservas de forma autônoma. (Requer cuidado)',
    }

    const openaiStatus = providerStatus.find(p => p.id === 'openai');
    const geminiStatus = providerStatus.find(p => p.id === 'gemini');

    if (loading || !settings) {
        return (
            <div className="space-y-8">
                <Card><CardHeader><Skeleton className="h-8 w-64"/></CardHeader><CardContent><Skeleton className="h-40 w-full"/></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-8 w-72"/></CardHeader><CardContent><Skeleton className="h-32 w-full"/></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-8 w-80"/></CardHeader><CardContent><Skeleton className="h-64 w-full"/></CardContent></Card>
            </div>
        )
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
                    <Switch id="ai-active" checked={settings.globalAiEnabled} />
                </div>
                
                <div className="space-y-2">
                    <Label>Modo de Automação</Label>
                    <RadioGroup value={settings.aiMode} className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            <RadioGroupItem value="partial_autonomous" id="r3" className="peer sr-only"/>
                            <Label htmlFor="r3" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                <Bot className="mb-2"/>
                                IA Operacional Parcial
                            </Label>
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div>
                                    <RadioGroupItem value="full_autonomous" id="r4" className="peer sr-only" disabled />
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
                    <Alert variant={settings.aiMode === 'full_autonomous' ? 'destructive' : 'default'} className="mt-4">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Modo selecionado: {settings.aiMode}</AlertTitle>
                        <AlertDescription>
                            {modeDescriptions[settings.aiMode]}
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
                    <Select value={settings.activeProvider}>
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
                                <CardDescription>{openaiStatus?.model || 'gpt-4-turbo'}</CardDescription>
                            </div>
                            <Badge variant={openaiStatus?.configured ? 'secondary' : 'outline'} className={cn(openaiStatus?.configured ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground')}>
                                {loadingProviders ? 'Verificando...' : (openaiStatus?.status || 'Indisponível')}
                            </Badge>
                        </CardHeader>
                        <CardContent className="space-y-2">
                             <div className="space-y-1">
                                <Label htmlFor="openai-key" className="text-xs text-muted-foreground flex items-center gap-1"><KeyRound className="size-3"/> OPENAI_API_KEY</Label>
                                <Input id="openai-key" type="password" disabled value="*******************************" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full" disabled={!openaiStatus?.configured}>Testar Conexão</Button>
                        </CardFooter>
                    </Card>
                     <Card>
                        <CardHeader className="flex-row items-start justify-between">
                            <div>
                                <CardTitle className="text-lg">Gemini (Google)</CardTitle>
                                <CardDescription>{geminiStatus?.model || 'gemini-2.5-flash'}</CardDescription>
                            </div>
                             <Badge variant={geminiStatus?.configured ? 'secondary' : 'outline'} className={cn(geminiStatus?.configured ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground')}>
                                {loadingProviders ? 'Verificando...' : (geminiStatus?.status || 'Indisponível')}
                            </Badge>
                        </CardHeader>
                        <CardContent className="space-y-2">
                             <div className="space-y-1">
                                <Label htmlFor="gemini-key" className="text-xs text-muted-foreground flex items-center gap-1"><KeyRound className="size-3"/> GEMINI_API_KEY</Label>
                                <Input id="gemini-key" type="password" disabled value="*******************************" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full" disabled={!geminiStatus?.configured}>Testar Conexão</Button>
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
                        value={draftPrompt?.content || ''}
                        onChange={(e) => setDraftPrompt(p => p ? {...p, content: e.target.value} : null)}
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
                        value={publishedPrompt?.content || 'Nenhum prompt publicado encontrado.'}
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
                        <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                            <DialogTitle>Testar Prompt da IA</DialogTitle>
                            <DialogDescription>
                                Envie uma mensagem de teste para ver como a IA responderá com o prompt de rascunho.
                            </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="test-provider">Provedor para Teste</Label>
                                        <Select value={testProvider} onValueChange={(v) => setTestProvider(v as any)}>
                                            <SelectTrigger id="test-provider">
                                                <SelectValue placeholder="Selecione o provedor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="automatic">Automático (usa configurações)</SelectItem>
                                                <SelectItem value="gemini" disabled={!geminiStatus?.configured}>Gemini (Simulado)</SelectItem>
                                                <SelectItem value="openai" disabled={!openaiStatus?.configured}>OpenAI (Simulado)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Status do Prompt</Label>
                                        <div className="flex items-center gap-2 h-10 px-3 border rounded-md bg-muted text-sm">
                                            {publishedPrompt ? <CheckCircle className="size-4 text-green-500" /> : <XCircle className="size-4 text-destructive" />}
                                            <span>{publishedPrompt ? 'Publicado' : 'Não Publicado'}</span>
                                        </div>
                                    </div>
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
                                    <div className="flex flex-col items-center justify-center p-4 gap-2">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                        <p className="text-sm text-muted-foreground">Aguardando resposta da IA...</p>
                                    </div>
                                )}
                                {testResult && (
                                    <div className="space-y-4">
                                        {testResult.wasBlocked ? (
                                            <Alert variant="destructive">
                                                <AlertTriangle className="h-4 w-4" />
                                                <AlertTitle>Ação Bloqueada pela Política de Autonomia</AlertTitle>
                                                <AlertDescription>
                                                    {testResult.blockReason || 'A configuração de autonomia atual impediu a IA de responder.'}
                                                </AlertDescription>
                                            </Alert>
                                        ) : (
                                            <div>
                                                <Label>Resposta da IA:</Label>
                                                <div className="rounded-md border bg-muted p-4 text-sm mt-2">
                                                    {testResult.response}
                                                </div>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground border-t pt-4">
                                            <div className="flex items-center gap-2">
                                                <p>Provedor usado:</p>
                                                <Badge variant="outline" className="capitalize">{testResult.providerUsed || 'N/D'}</Badge>
                                            </div>
                                             <div className="flex items-center gap-2">
                                                <p>Fallback Ativado:</p>
                                                <Badge variant={testResult.fallbackTriggered ? "default" : "outline"} className={cn(testResult.fallbackTriggered ? 'bg-orange-100 text-orange-800' : '')}>
                                                    {testResult.fallbackTriggered ? 'Sim' : 'Não'}
                                                </Badge>
                                            </div>
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
                            checked={settings.requireHumanApproval}
                            aria-label="Exigir Aprovação Humana"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="human-fallback">Responsável Humano (Fallback)</Label>
                        <Input id="human-fallback" value={settings.fallbackHumanName} />
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
                                 <Select value={'automatic'}>
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
                        {['whatsapp', 'instagram', 'facebook', 'website'].map((id) => (
                             <div key={id} className="flex flex-row items-center justify-between">
                                <Label className='font-normal capitalize'>{id}</Label>
                                <Switch
                                    checked={true}
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
