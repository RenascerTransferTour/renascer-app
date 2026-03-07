

"use client"

import { useState, useEffect, useCallback } from "react"
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
import { type TestAiChatPromptOutput } from "@/ai/flows/test-ai-chat-prompt-flow"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertTriangle, ShieldCheck, Bot, Info, History, SlidersHorizontal, MessageSquare, Workflow, Lock, KeyRound, Server, ChevronRight, Power, HelpCircle, CheckCircle, XCircle, ShieldOff, Check, Ban } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { Skeleton } from "./ui/skeleton"
import type { AiSettings, AiPrompt, AiFlowPermission } from "@/lib/db/data-model"
import type { ProviderStatus } from "@/app/api/settings/ai/providers/route"
import { cn } from "@/lib/utils"
import { getStatusBadgeClasses } from "@/lib/utils"

const flowPermissionsData: {id: AiFlowPermission['flowName']; label: string; description: string;}[] = [
    { id: 'welcome', label: 'Boas-Vindas', description: 'Permite que a IA envie a primeira mensagem de boas-vindas.' },
    { id: 'qualification', label: 'Qualificação', description: 'Permite que a IA faça perguntas para coletar dados do cliente.' },
    { id: 'summarization', label: 'Geração de Resumo', description: 'Permite que a IA gere resumos de conversas.' },
    { id: 'faq', label: 'Respostas Frequentes', description: 'Permite que a IA responda perguntas gerais da base de conhecimento.' },
    { id: 'quoteCreation', label: 'Criação de Orçamento', description: 'Permite que a IA crie rascunhos de orçamentos.' },
    { id: 'bookingCreation', label: 'Criação de Reserva', description: 'Permite que a IA crie rascunhos de reservas.' },
    { id: 'crmUpdate', label: 'Avanço no CRM', description: 'Permite que a IA mova cards entre etapas no pipeline.' },
    { id: 'saleClosing', label: 'Fechamento de Venda', description: 'Permite que a IA marque um negócio como "Fechado".' },
    { id: 'postSale', label: 'Pós-Venda', description: 'Permite que a IA envie mensagens de acompanhamento.' },
];

const allowedNow = ['welcome', 'qualification', 'faq', 'summarization', 'quoteCreation', 'bookingCreation', 'crmUpdate'];

export function AiSettingsForm() {
    const [settings, setSettings] = useState<AiSettings | null>(null);
    const [prompts, setPrompts] = useState<AiPrompt[]>([]);
    const [permissions, setPermissions] = useState<AiFlowPermission[]>([]);
    
    const [providerStatus, setProviderStatus] = useState<ProviderStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const [draftPrompt, setDraftPrompt] = useState<AiPrompt | null>(null);
    const [publishedPrompt, setPublishedPrompt] = useState<AiPrompt | null>(null);

    const [testUserPrompt, setTestUserPrompt] = useState("Olá, quanto custa um transfer para o aeroporto de guarulhos?");
    const [testResult, setTestResult] = useState<Partial<TestAiChatPromptOutput> | null>(null);
    const [isTesting, setIsTesting] = useState(false);
    const { toast } = useToast();
    
    const [testProvider, setTestProvider] = useState<'openai' | 'gemini' | 'automatic'>('automatic');

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const processResponse = async (res: Response, name: string) => {
                if (!res.ok) {
                    const errorText = await res.text();
                    let errorDetails = errorText;
                    try { errorDetails = JSON.parse(errorText).details || errorText; } catch (e) { /* Not a JSON response */ }
                    throw new Error(`Falha ao buscar ${name}. Status: ${res.status}. Detalhes: ${errorDetails}`);
                }
                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    console.error(`Resposta não-JSON para ${name}`, await res.text());
                    throw new TypeError(`Resposta inesperada do servidor para ${name}.`);
                }
                return res.json();
            };

            const [settingsRes, promptsRes, providersRes, permissionsRes] = await Promise.all([
                fetch('/api/settings/ai'),
                fetch('/api/settings/prompts'),
                fetch('/api/settings/ai/providers'),
                fetch('/api/settings/ai/permissions')
            ]);
            
            const settingsData = await processResponse(settingsRes, 'configurações de IA');
            const promptsData = await processResponse(promptsRes, 'prompts');
            const providersData = await processResponse(providersRes, 'status do provedor');
            const permissionsData = await processResponse(permissionsRes, 'permissões de IA');
            
            setSettings(settingsData);
            setPrompts(promptsData);
            setProviderStatus(providersData);
            setPermissions(permissionsData);

            setDraftPrompt(promptsData.find((p: AiPrompt) => p.status === 'draft') || null);
            setPublishedPrompt(promptsData.find((p: AiPrompt) => p.status === 'published') || null);

        } catch (error) {
            console.error("Failed to fetch settings data", error);
            toast({
                variant: "destructive",
                title: "Erro ao carregar configurações",
                description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleTestPrompt = async () => {
        if (!testUserPrompt.trim() || !draftPrompt?.content) {
            toast({ variant: "destructive", title: "Aviso", description: "O prompt de rascunho e a mensagem do usuário não podem estar vazios." });
            return;
        }
        setIsTesting(true);
        setTestResult(null);
        try {
            const res = await fetch('/api/ai/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ masterPrompt: draftPrompt.content, userPrompt: testUserPrompt, provider: testProvider }),
            });
            const result = await res.json();
            if (!res.ok) {
                 throw new Error(result.blockReason || result.error || "A API retornou um erro inesperado.");
            }
            setTestResult(result);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Não foi possível obter uma resposta da IA.";
            setTestResult({ wasBlocked: true, blockReason: errorMessage });
            toast({ variant: "destructive", title: "Erro no Teste", description: errorMessage });
        } finally {
            setIsTesting(false);
        }
    };
    
    const handleSaveAll = async () => {
        setSaving(true);
        const results = await Promise.allSettled([
            fetch('/api/settings/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            }).then(async res => {
                if (!res.ok) return Promise.reject({ name: 'Configurações Gerais', error: await res.json() });
                return res.json();
            }),
            fetch('/api/settings/ai/permissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(permissions),
            }).then(async res => {
                if (!res.ok) return Promise.reject({ name: 'Permissões de Fluxo', error: await res.json() });
                return res.json();
            }),
        ]);
    
        let allSucceeded = true;
    
        results.forEach((result, index) => {
            const sectionName = index === 0 ? 'Configurações Gerais' : 'Permissões de Fluxo';
            if (result.status === 'fulfilled') {
                toast({
                    title: `Sucesso ao salvar ${sectionName}`,
                    description: `As configurações de ${sectionName.toLowerCase()} foram atualizadas.`,
                });
            } else {
                allSucceeded = false;
                toast({
                    variant: 'destructive',
                    title: `Erro ao salvar ${sectionName}`,
                    description: `Não foi possível atualizar ${sectionName.toLowerCase()}.`,
                });
            }
        });
    
        if (allSucceeded) {
            toast({
                title: 'Todas as configurações foram salvas!',
                className: 'bg-green-100 dark:bg-green-900',
            });
        }
    
        setSaving(false);
        await fetchData(); // Refetch data to show updated state
    };

    const handlePublishPrompt = async () => {
        if (!draftPrompt) return;
        setIsPublishing(true);
        try {
            // First, save the current draft content.
            const saveRes = await fetch('/api/settings/prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(draftPrompt),
            });
             if (!saveRes.ok) {
                const errorData = await saveRes.json();
                throw new Error(errorData.error || 'Falha ao salvar o rascunho do prompt.');
            }
    
            // Then, trigger the publish action.
            const publishRes = await fetch('/api/settings/prompts/publish', {
                method: 'POST',
            });
    
            if (!publishRes.ok) {
                const errorData = await publishRes.json();
                throw new Error(errorData.error || 'Falha ao publicar o prompt.');
            }
    
            toast({
                title: "Sucesso!",
                description: "O novo prompt foi publicado e está ativo no sistema.",
                className: 'bg-green-100 dark:bg-green-900',
            });
    
            // Refetch all data to update the UI with the new state.
            await fetchData();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao Publicar',
                description: error instanceof Error ? error.message : 'Ocorreu um erro inesperado.',
            });
        } finally {
            setIsPublishing(false);
        }
    };

    const handlePermissionChange = (flowName: AiFlowPermission['flowName'], field: keyof AiFlowPermission, value: any) => {
        setPermissions(prev => prev.map(p => p.flowName === flowName ? { ...p, [field]: value } : p));
    };

    const modeDescriptions: Record<string, string> = {
        'off': 'A IA está completamente desligada e não interagirá com os clientes.',
        'assisted': 'IA coleta dados iniciais e então transfere para um humano para o orçamento. (Padrão)',
        'partial_autonomous': 'IA pode criar rascunhos de orçamentos e reservas, mas um humano deve aprovar.',
        'full_autonomous': 'A IA pode fechar vendas e confirmar reservas de forma autônoma. (Requer cuidado)',
    };

    const openaiStatus = providerStatus.find(p => p.id === 'openai');
    const geminiStatus = providerStatus.find(p => p.id === 'gemini');

    if (loading || !settings) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        )
    }

  return (
    <TooltipProvider>
    <div className="space-y-8">

        <Card className="bg-gradient-to-br from-background to-muted/50">
            <CardHeader>
                <CardTitle>Status Geral da IA</CardTitle>
                <CardDescription>
                    Visão geral do estado atual da inteligência artificial no sistema.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col justify-center space-y-2 p-4 border rounded-lg bg-background">
                    <Label className="text-xs text-muted-foreground">Modo de Operação</Label>
                    <div className="flex items-center gap-2">
                        <Badge className={cn(getStatusBadgeClasses('IA assistida'), 'text-sm')}>
                            <Bot className="h-4 w-4"/>
                            Modo Assistente
                        </Badge>
                    </div>
                     <p className="text-sm text-muted-foreground pt-1">
                        A IA pode analisar, sugerir e preparar rascunhos, mas não finaliza ações automaticamente.
                    </p>
                </div>
                <div className="flex flex-col justify-center space-y-2 p-4 border rounded-lg bg-background">
                    <Label className="text-xs text-muted-foreground">Autorização Comercial</Label>
                     <div className="flex items-center gap-2">
                        <Badge className={cn(getStatusBadgeClasses('IA bloqueada'), 'text-sm')}>
                            <ShieldOff className="h-4 w-4" />
                            Chave de ativação não autorizada
                        </Badge>
                     </div>
                    <p className="text-sm text-muted-foreground pt-1">
                        A finalização automática de vendas e reservas está desabilitada.
                    </p>
                </div>
            </CardContent>
             <CardFooter>
                 <Alert variant="default" className="w-full">
                    <UserCheck className="h-4 w-4" />
                    <AlertTitle>Finalização Manual Obrigatória</AlertTitle>
                    <AlertDescription>
                        Todas as ações comerciais, como orçamentos e reservas, devem ser revisadas e finalizadas manualmente pela Cláudia.
                    </AlertDescription>
                </Alert>
             </CardFooter>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>Fluxo Operacional Híbrido</CardTitle>
                        <CardDescription>Etapas do processo comercial com a assistência da IA e finalização humana.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between overflow-x-auto py-4">
                        {['Recebido', 'Analisado pela IA', 'Rascunho gerado', 'Aguardando aprovação da Cláudia', 'Finalizado manualmente pela Cláudia'].map((step, index, arr) => (
                            <React.Fragment key={index}>
                                <div className="flex flex-col items-center text-center space-y-2 min-w-32">
                                    <div className={cn(
                                        "flex items-center justify-center size-10 rounded-full border-2",
                                        index < 3 ? "bg-blue-100 border-blue-200" : "bg-orange-100 border-orange-200"
                                    )}>
                                        {index < 3 ? <Bot className="size-5 text-blue-600"/> : <UserCheck className="size-5 text-orange-600"/>}
                                    </div>
                                    <p className="text-xs font-medium">{step}</p>
                                </div>
                                {index < arr.length - 1 && <ChevronRight className="size-5 text-muted-foreground shrink-0 mx-4"/>}
                            </React.Fragment>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Chave de Ativação Comercial</CardTitle>
                        <CardDescription>Controle a capacidade da IA de executar ações comerciais de forma autônoma.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                             <div className="space-y-0.5">
                                <Label className="text-base flex items-center gap-2">
                                     <Badge className={cn(getStatusBadgeClasses(settings.commercialActivationKey === 'authorized' ? 'connected' : 'disconnected'))}>
                                        {settings.commercialActivationKey === 'authorized' ? 'Ativada' : 'Desativada'}
                                    </Badge>
                                    <span>Ativação Comercial Autônoma</span>
                                </Label>
                                <p className="text-sm text-muted-foreground">A ativação comercial da IA só pode ser liberada com autorização explícita.</p>
                            </div>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="cursor-not-allowed">
                                        <Button disabled>
                                            <KeyRound className="mr-2"/>
                                            Autorizar Ativação
                                        </Button>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>A ativação real será configurada futuramente no backend.</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                 <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Permissões da IA</CardTitle>
                        <CardDescription>Ações que a IA pode ou não executar no modo assistente atual.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-sm mb-2">Permitido Agora</h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                {flowPermissionsData.filter(p => allowedNow.includes(p.id)).map(p => (
                                    <li key={p.id} className="flex items-center gap-2">
                                        <CheckCircle className="size-4 text-green-500" />
                                        <span>{p.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-semibold text-sm mb-2">Bloqueado por Enquanto</h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                {flowPermissionsData.filter(p => !allowedNow.includes(p.id)).map(p => (
                                    <li key={p.id} className="flex items-center gap-2">
                                        <Ban className="size-4 text-destructive" />
                                        <span>{p.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

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
                        <Textarea id="master-prompt" placeholder="Defina as instruções principais para a IA..." className="min-h-[250px] font-mono text-xs" value={draftPrompt?.content || ''} onChange={(e) => setDraftPrompt(p => p ? {...p, content: e.target.value} : null)} />
                        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Info className="size-4 shrink-0"/> <p>Você está editando o rascunho. Para aplicar as mudanças, salve e publique o prompt.</p></div>
                    </TabsContent>
                    <TabsContent value="published" className="space-y-4">
                        <Textarea id="master-prompt-published" className="min-h-[250px] font-mono text-xs bg-muted/70" value={publishedPrompt?.content || 'Nenhum prompt publicado encontrado.'} readOnly />
                        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Info className="size-4 shrink-0"/> <p>Esta é a versão atualmente em produção. Para alterá-la, edite o rascunho e publique.</p></div>
                    </TabsContent>
                </Tabs>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="w-full"><History className="mr-2"/> Ver Histórico de Versões</Button>
                    <Dialog><DialogTrigger asChild><Button variant="outline" className="w-full">Testar Prompt</Button></DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                            <DialogHeader><DialogTitle>Testar Prompt da IA</DialogTitle><DialogDescription>Envie uma mensagem de teste para ver como a IA responderá com o prompt de rascunho.</DialogDescription></DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="test-provider">Provedor para Teste</Label>
                                        <Select value={testProvider} onValueChange={(v) => setTestProvider(v as any)}>
                                            <SelectTrigger id="test-provider"><SelectValue placeholder="Selecione o provedor" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="automatic">Automático (usa configurações)</SelectItem>
                                                <SelectItem value="gemini" disabled={!geminiStatus?.configured}>Gemini (Simulado)</SelectItem>
                                                <SelectItem value="openai" disabled={!openaiStatus?.configured}>OpenAI (Simulado)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2"><Label>Status do Prompt</Label><div className="flex items-center gap-2 h-10 px-3 border rounded-md bg-muted text-sm">{publishedPrompt ? <CheckCircle className="size-4 text-green-500" /> : <XCircle className="size-4 text-destructive" />}<span>{publishedPrompt ? 'Publicado' : 'Não Publicado'}</span></div></div>
                                </div>
                                <div className="space-y-2"><Label htmlFor="test-prompt">Mensagem do Usuário:</Label><Textarea id="test-prompt" value={testUserPrompt} onChange={(e) => setTestUserPrompt(e.target.value)} className="min-h-[80px]" /></div>
                                {isTesting && (<div className="flex flex-col items-center justify-center p-4 gap-2"><Loader2 className="h-6 w-6 animate-spin" /><p className="text-sm text-muted-foreground">Aguardando resposta da IA...</p></div>)}
                                {testResult && (
                                    <div className="space-y-4">
                                        {testResult.wasBlocked ? (
                                            <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Ação Bloqueada</AlertTitle><AlertDescription>{testResult.blockReason || 'A configuração de autonomia atual impediu a IA de responder.'}</AlertDescription></Alert>
                                        ) : (
                                            <div><Label>Resposta da IA:</Label><div className="rounded-md border bg-muted p-4 text-sm mt-2">{testResult.response}</div></div>
                                        )}
                                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground border-t pt-4">
                                            <div className="flex items-center gap-2"><p>Provedor usado:</p><Badge variant="outline" className="capitalize">{testResult.providerUsed || 'N/D'}</Badge></div>
                                            <div className="flex items-center gap-2"><p>Fallback Ativado:</p><Badge variant={testResult.fallbackTriggered ? "default" : "outline"} className={cn(testResult.fallbackTriggered ? 'bg-orange-100 text-orange-800' : '')}>{testResult.fallbackTriggered ? 'Sim' : 'Não'}</Badge></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <DialogFooter><Button type="submit" onClick={handleTestPrompt} disabled={isTesting}>{isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Enviar Teste</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
            <CardFooter className="justify-end">
                <Button onClick={handlePublishPrompt} disabled={isPublishing || !draftPrompt}>
                    {isPublishing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Salvar e Publicar Prompt
                </Button>
            </CardFooter>
        </Card>
      
        <Card>
            <CardHeader><CardTitle>Regras de Negócio e Roteamento</CardTitle><CardDescription>Defina quando a IA deve transferir o atendimento e quais ações ela pode tomar.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label className="text-base">Exigir Aprovação Humana</Label>
                            <p className="text-sm text-muted-foreground">Força a IA a encaminhar ações comerciais (orçamentos, reservas) para revisão manual. (Recomendado)</p>
                        </div>
                        <Switch checked={settings.requireHumanApproval} onCheckedChange={(checked) => setSettings((s) => s ? ({ ...s, requireHumanApproval: checked }) : null)} aria-label="Exigir Aprovação Humana" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="human-fallback">Responsável Humano (Fallback)</Label>
                        <Input id="human-fallback" value={settings.fallbackHumanName} onChange={(e) => setSettings((s) => s ? ({ ...s, fallbackHumanName: e.target.value }) : null)} />
                        <p className="text-sm text-muted-foreground">Nome do humano que receberá as solicitações que a IA não pode concluir.</p>
                    </div>
                </div>
                <Separator/>
                <div className="space-y-4">
                    <Label className="font-semibold flex items-center gap-2"><Workflow/> Permissões de Fluxo (Flows)</Label>
                    <div className="rounded-md border">
                       {flowPermissionsData.map((perm) => {
                            const currentPerm = permissions.find(p => p.flowName === perm.id);
                            if (!currentPerm) return null;
                            return (
                                <div key={perm.id} className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2 p-4 border-b last:border-b-0">
                                    <div className="space-y-0.5 flex-1"><Label className='font-normal'>{perm.label}</Label><p className="text-xs text-muted-foreground">{perm.description}</p></div>
                                    <div className="flex items-center gap-4">
                                        <Select value={currentPerm.provider} onValueChange={(v) => handlePermissionChange(perm.id, 'provider', v as any)}>
                                            <SelectTrigger className="w-[160px] h-9"><SelectValue /></SelectTrigger>
                                            <SelectContent><SelectItem value="automatic">Automático</SelectItem><SelectItem value="gemini">Gemini</SelectItem><SelectItem value="openai">OpenAI</SelectItem></SelectContent>
                                        </Select>
                                        <Switch checked={currentPerm.enabled} onCheckedChange={(c) => handlePermissionChange(perm.id, 'enabled', c)} />
                                    </div>
                                </div>
                            )
                        })}
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
                <CardTitle>Provedores de IA e Credenciais</CardTitle>
                <CardDescription>A configuração real das chaves de API é feita no ambiente do servidor, não aqui.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                    <div className="space-y-2 flex-1">
                        <Label>Provedor Principal</Label>
                        <Select value={settings.activeProvider} onValueChange={(value) => setSettings((s) => s ? ({ ...s, activeProvider: value as any }) : null)}>
                            <SelectTrigger className="w-full sm:w-[280px]">
                                <SelectValue placeholder="Selecione um provedor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="gemini">Gemini (Google)</SelectItem>
                                <SelectItem value="openai">OpenAI (ChatGPT)</SelectItem>
                                <SelectItem value="automatic">Automático / Fallback</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <Label htmlFor="fallback-enabled" className="flex-1">
                            <h4 className='font-semibold'>Ativar Fallback</h4>
                            <p className='text-xs text-muted-foreground'>Se o provedor principal falhar, tentar o outro.</p>
                        </Label>
                        <Switch id="fallback-enabled" checked={settings.isFallbackEnabled} onCheckedChange={(checked) => setSettings((s) => s ? ({ ...s, isFallbackEnabled: checked }) : null)} />
                    </div>
                </div>
                <Separator/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {providerStatus.map(p => (
                        <Card key={p.id}>
                            <CardHeader className="flex-row items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg">{p.name}</CardTitle>
                                    <CardDescription>{p.model}</CardDescription>
                                </div>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Badge variant={p.configured ? 'secondary' : 'outline'} className={cn('gap-1.5', getStatusBadgeClasses(p.status))}>
                                            {p.configured ? <CheckCircle className="size-3" /> : <HelpCircle className="size-3" />}
                                            {p.status}
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{p.message}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor={`${p.id}-key`} className="text-xs text-muted-foreground flex items-center gap-1"><KeyRound className="size-3"/> Chave de API (somente visual)</Label>
                                    <Input id={`${p.id}-key`} type="password" readOnly value="*******************************" />
                                     <p className="text-[11px] text-muted-foreground pt-1">Este campo não edita o segredo real. A chave deve ser configurada no ambiente do servidor.</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
      
        <div className="flex items-center justify-end gap-4">
            <Button variant="outline" onClick={fetchData}>Descartar Alterações</Button>
            <Button onClick={handleSaveAll} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Todas as Configurações
            </Button>
        </div>
    </div>
    </TooltipProvider>
  )
}
