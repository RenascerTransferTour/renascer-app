'use client'

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { QrCode, CheckCircle2, AlertTriangle, Clock, XCircle, Share2, Server, KeyRound, Phone, Webhook, History, Link2, Info, Loader2, Save } from "lucide-react"
import type { Channel } from "@/lib/db/data-model"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { format, formatDistanceToNow, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { getStatusBadgeClasses } from "@/lib/utils"

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M16.75 13.96c.25.13.43.2.5.28.08.08.14.18.18.3.04.1.06.2.04.3s-.04.2-.1.32c-.04.1-.1.18-.18.25a.87.87 0 01-.43.18c-.2.03-.43.02-.7-.02-.25-.04-.53-.1-.82-.18-.3-.08-.58-.18-.88-.32a9.44 9.44 0 01-1.4-.82 8.37 8.37 0 01-1.14-1.1c-.3-.4-.58-.8-.8-1.24-.24-.46-.4-1-.48-1.53a3.2 3.2 0 01-.04-.48c0-.18.02-.35.08-.5.05-.16.14-.3.26-.42.12-.12.25-.2.4-.26.15-.05.3-.07.46-.07.13 0 .26.02.38.05.12.03.24.08.34.15.1.07.2.16.28.28.08.1.13.23.14.35.02.12.02.26 0 .4-.02.16-.06.3-.12.44s-.13.25-.22.34c-.1.1-.2.18-.3.25-.1.08-.18.14-.24.2-.06.05-.1.1-.14.13-.03.03-.04.04-.02.07.02.03.1.1.2.18.1.07.2.14.32.23.1.1.2.17.3.25.3.23.6.43.9.6.34.18.66.3.96.36.1.02.2.04.3.05.1 0 .2.02.3.02.13 0 .25-.02.38-.05.12-.03.24-.08.34-.15.1-.07.18-.16.24-.25.06-.1.1-.2.12-.32.02-.1.02-.2 0-.32a.8.8 0 00-.06-.32.74.74 0 00-.16-.3c-.06-.08-.14-.15-.22-.2-.08-.05-.17-.1-.26-.12-.1-.02-.2-.02-.3-.02s-.2.02-.3.04-.18.06-.25.1c-.07.04-.13.1-.18.15-.05.06-.1.1-.13.16-.03.05-.06.1-.08.15-.02.05-.03.1-.02.13.01.03.02.06.04.08a.3.3 0 00.08.08.3.3 0 00.1.04.3.3 0 00.12 0 .3.3 0 00.1-.04.34.34 0 00.08-.08.3.3 0 00.04-.1.2.2 0 000-.12zM12 2a10 10 0 00-10 10 10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2zm0 18a8 8 0 01-8-8 8 8 0 018-8 8 8 0 018 8 8 8 0 01-8 8z" /></svg>
)
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 2c2.7 0 3 .01 4.06.06a6.4 6.4 0 014.4 1.48 6.4 6.4 0 011.48 4.4c.05 1.07.06 1.35.06 4.06s-.01 3-.06 4.06a6.4 6.4 0 01-1.48 4.4 6.4 6.4 0 01-4.4 1.48c-1.07.05-1.35.06-4.06.06s-3 0-4.06-.06a6.4 6.4 0 01-4.4-1.48 6.4 6.4 0 01-1.48-4.4C2.01 15 2 14.7 2 12s0-3 .06-4.06A6.4 6.4 0 013.54 3.54 6.4 6.4 0 017.94 2.06C8.99 2.01 9.3 2 12 2zm0 2a8.1 8.1 0 00-4.1.06A4.4 4.4 0 005.37 5.37a4.4 4.4 0 00-1.3 2.53C4.01 9 4 9.3 4 12s0 3 .06 4.1a4.4 4.4 0 001.3 2.53 4.4 4.4 0 002.53 1.3c1.1.06 1.4.06 4.1.06s3 0 4.1-.06a4.4 4.4 0 002.53-1.3 4.4 4.4 0 001.3-2.53c.06-1.1.06-1.4.06-4.1s0-3-.06-4.1a4.4 4.4 0 00-1.3-2.53A4.4 4.4 0 0016.1 4.06C15.1 4 14.7 4 12 4zm0 4a6 6 0 100 12 6 6 0 000-12zm0 2a4 4 0 110 8 4 4 0 010-8zm6.5-3a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>
)
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" /></svg>
)

const statusConfig: Record<string, { icon: React.ElementType, text: string, className: string, tooltip?: string }> = {
    'connected': { icon: CheckCircle2, text: 'Conectado', className: getStatusBadgeClasses('connected') },
    'disconnected': { icon: XCircle, text: 'Desconectado', className: getStatusBadgeClasses('disconnected') },
    'pending': { icon: Clock, text: 'Pendente', className: getStatusBadgeClasses('pending') },
    'awaiting_qr': { icon: QrCode, text: 'Aguardando Leitura', className: getStatusBadgeClasses('awaiting_qr') },
    'failing': { icon: AlertTriangle, text: 'Falha', className: getStatusBadgeClasses('failing') },
    'expired': { icon: AlertTriangle, text: 'Expirado', className: getStatusBadgeClasses('expired') },
    'mock': { 
        icon: Info, 
        text: 'Modo Simulado', 
        className: getStatusBadgeClasses('mock'),
        tooltip: 'Este canal opera com dados locais e não está conectado a uma API real.'
    }
};

const StatusBadge = ({ status, isMock = false }: { status: Channel['status'], isMock?: boolean }) => {
    // If the channel is mocked AND its base status is "connected", show "Modo Simulado" instead.
    if (isMock && status === 'connected') {
        const config = statusConfig.mock;
        const { icon: Icon, text, className, tooltip } = config;
        return (
            <Tooltip>
                <TooltipTrigger>
                    <Badge className={cn(className, "gap-1.5 capitalize")}><Icon className="h-3 w-3" />{text}</Badge>
                </TooltipTrigger>
                {tooltip && <TooltipContent><p>{tooltip}</p></TooltipContent>}
            </Tooltip>
        );
    }

    // For all other statuses, show the real status.
    const config = statusConfig[status] || statusConfig.disconnected;
    const { icon: Icon, text, className } = config;
    return (
      <Badge className={cn(className, "gap-1.5 capitalize")}><Icon className="h-3 w-3" />{text}</Badge>
    );
};

export default function ChannelsPage() {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/settings/channels');
                if (!res.ok) throw new Error('Failed to fetch channels');
                const data = await res.json();
                setChannels(data);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Erro ao carregar canais",
                    description: "Não foi possível buscar as configurações dos canais.",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchChannels();
    }, [toast]);
    
    const handleUpdateChannel = (id: string, field: keyof Channel, value: any) => {
        setChannels(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const handleSaveChanges = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/settings/channels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(channels),
            });
            if (!res.ok) throw new Error('Failed to save changes');
            toast({
                title: "Configurações salvas",
                description: "As regras dos canais foram atualizadas com sucesso.",
            });
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Erro ao salvar",
                description: "Não foi possível salvar as configurações dos canais.",
            });
        } finally {
            setSaving(false);
        }
    };

    const mockHistory = [
        { channel: 'WhatsApp', event: 'Webhook Received', date: '2024-07-30 14:32:10', status: 'Sucesso', details: 'Nova mensagem de +55 11 9....'},
        { channel: 'Instagram', event: 'API Connection', date: '2024-07-30 13:05:00', status: 'Falhou', details: 'Token de acesso inválido'},
        { channel: 'WhatsApp', event: 'QR Code Generated', date: '2024-07-29 10:15:40', status: 'Sucesso', details: 'Sessão aguardando leitura'},
        { channel: 'Facebook', event: 'Webhook Test', date: '2024-07-29 09:00:00', status: 'Sucesso', details: 'Endpoint verificado com sucesso'},
    ];

    const waChannel = channels.find(c => c.type === 'whatsapp');
    const igChannel = channels.find(c => c.type === 'instagram');
    const fbChannel = channels.find(c => c.type === 'facebook');

    if (loading) {
        return <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
    }

    return (
        <TooltipProvider>
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Canais e Conexões</h1>
                <p className="text-muted-foreground">
                Gerencie as integrações com os canais de comunicação da sua empresa.
                </p>
            </div>

            <Tabs defaultValue="whatsapp">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="whatsapp"><WhatsAppIcon className="w-5 h-5 mr-2"/> WhatsApp</TabsTrigger>
                    <TabsTrigger value="instagram"><InstagramIcon className="w-5 h-5 mr-2"/> Instagram</TabsTrigger>
                    <TabsTrigger value="facebook"><FacebookIcon className="w-5 h-5 mr-2"/> Facebook</TabsTrigger>
                </TabsList>
                
                <TabsContent value="whatsapp" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Conexão WhatsApp</CardTitle>
                                    <CardDescription>Gerencie a integração com a API do WhatsApp Business.</CardDescription>
                                </div>
                                {waChannel && <StatusBadge status={waChannel.status} />}
                            </div>
                        </CardHeader>
                        <Tabs defaultValue="qrcode" className="w-full">
                            <CardContent>
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="api">API Oficial da Meta</TabsTrigger>
                                    <TabsTrigger value="qrcode">Pareamento por QR Code</TabsTrigger>
                                </TabsList>
                            </CardContent>
                            <TabsContent value="api" className="px-6 pb-6 space-y-4">
                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertTitle>Modo Recomendado para Nuvem</AlertTitle>
                                    <AlertDescription>
                                        A API Oficial oferece mais estabilidade, segurança e recursos para automação em um ambiente de produção 24/7. Esta conexão é simulada.
                                    </AlertDescription>
                                </Alert>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="wa-phone-id">Phone Number ID</Label>
                                        <Input id="wa-phone-id" value="10987654321" disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="wa-account-id">Business Account ID</Label>
                                        <Input id="wa-account-id" value="12345678901" disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="wa-token">Token de Acesso</Label>
                                        <Input id="wa-token" type="password" value="*******************************" disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="wa-webhook">Webhook Verify Token</Label>
                                        <Input id="wa-webhook" type="password" value="*******************************" disabled />
                                    </div>
                                </div>
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Aviso de Segurança</AlertTitle>
                                    <AlertDescription>
                                        As chaves reais devem ser armazenadas com segurança no backend e nunca expostas no código do front-end. Estes campos são apenas representações visuais.
                                    </AlertDescription>
                                </Alert>
                                <div className="flex gap-2">
                                    <Button variant="outline">Testar Conexão</Button>
                                    <Button variant="destructive" disabled>Desconectar</Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="qrcode" className="px-6 pb-6 space-y-4">
                                <Alert variant="default">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Modo Alternativo (Não recomendado para produção)</AlertTitle>
                                    <AlertDescription>
                                       Este modo usa a conexão do seu celular e pode ser instável, não sendo ideal para operações 24/7. Use a API Oficial para produção em nuvem.
                                    </AlertDescription>
                                </Alert>
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <div className="p-4 border rounded-lg bg-muted/50 flex items-center justify-center w-48 h-48">
                                        <QrCode className="h-32 w-32 text-muted-foreground"/>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span>Status da Sessão:</span>
                                            {waChannel && <StatusBadge status={waChannel.status} />}
                                        </div>
                                        <p className="text-sm text-muted-foreground">Aponte a câmera do seu WhatsApp em <span className="font-semibold">Aparelhos Conectados &gt; Conectar um Aparelho</span> para escanear o código.</p>
                                        <div className="flex gap-2">
                                            <Button>Gerar Novo QR Code</Button>
                                            <Button variant="destructive" disabled>Desconectar Sessão</Button>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </Card>
                </TabsContent>

                <TabsContent value="instagram" className="space-y-6 mt-6">
                     <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Conexão Instagram</CardTitle>
                                    <CardDescription>Gerencie a integração com a API de Mensagens do Instagram.</CardDescription>
                                </div>
                                {igChannel && <StatusBadge status={igChannel.status}/>}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             {igChannel?.status === 'failing' && igChannel?.lastError && (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Último Erro</AlertTitle>
                                    <AlertDescription>
                                        {igChannel.lastError} (verificado {igChannel.lastChecked ? formatDistanceToNow(parseISO(igChannel.lastChecked), { addSuffix: true, locale: ptBR }) : 'agora'})
                                    </AlertDescription>
                                </Alert>
                            )}
                            <p className="text-sm text-muted-foreground">Conecte sua conta do Instagram para receber e responder mensagens diretamente da plataforma.</p>
                             <div className="space-y-2">
                                <Label>App ID</Label>
                                <Input disabled placeholder="Não configurado"/>
                            </div>
                             <div className="space-y-2">
                                <Label>Token de Acesso</Label>
                                <Input type="password" disabled placeholder="Não configurado"/>
                            </div>
                        </CardContent>
                        <CardFooter className="gap-2">
                            <Button>Conectar com Instagram</Button>
                            <Button variant="outline" disabled>Testar Conexão</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                 <TabsContent value="facebook" className="space-y-6 mt-6">
                     <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Conexão Facebook</CardTitle>
                                    <CardDescription>Gerencie a integração com o Facebook Messenger.</CardDescription>
                                </div>
                                {fbChannel && <StatusBadge status={fbChannel.status} isMock={true} />}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">Conecte sua página do Facebook para centralizar o atendimento.</p>
                             <div className="space-y-2">
                                <Label>Page ID</Label>
                                <Input disabled value="123456789098765"/>
                            </div>
                             <div className="space-y-2">
                                <Label>Token de Acesso</Label>
                                <Input type="password" disabled value="**********"/>
                            </div>
                        </CardContent>
                        <CardFooter className="gap-2">
                            <Button variant="outline">Testar Conexão</Button>
                             <Button variant="destructive">Desconectar</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>

            <Card>
                <CardHeader>
                    <CardTitle>Regras de Roteamento por Canal</CardTitle>
                    <CardDescription>Defina o comportamento da IA e do atendimento para cada canal conectado.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="rounded-md border">
                        {channels.map((channel) => (
                            <div key={channel.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b last:border-b-0">
                                <div className="flex items-center gap-3 mb-4 md:mb-0">
                                    {channel.type === 'whatsapp' && <WhatsAppIcon className="h-6 w-6 text-green-500"/>}
                                    {channel.type === 'instagram' && <InstagramIcon className="h-6 w-6 text-pink-500"/>}
                                    {channel.type === 'facebook' && <FacebookIcon className="h-6 w-6 text-blue-600"/>}
                                    {channel.type === 'website' && <Webhook className="h-6 w-6 text-slate-500"/>}
                                    <span className="font-semibold capitalize">{channel.name}</span>
                                    <StatusBadge status={channel.status} isMock={['facebook', 'website'].includes(channel.type)} />
                                </div>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                                     <div className="flex items-center space-x-2">
                                        <Switch 
                                            id={`ai-active-${channel.id}`} 
                                            checked={channel.aiEnabled}
                                            onCheckedChange={(checked) => handleUpdateChannel(channel.id, 'aiEnabled', checked)}
                                        />
                                        <Label htmlFor={`ai-active-${channel.id}`}>IA Ativa</Label>
                                    </div>
                                     <div className="flex items-center space-x-2">
                                        <Switch 
                                            id={`human-req-${channel.id}`} 
                                            checked={channel.requiresHuman}
                                            onCheckedChange={(checked) => handleUpdateChannel(channel.id, 'requiresHuman', checked)}
                                        />
                                        <Label htmlFor={`human-req-${channel.id}`}>Humano Obrigatório</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                    <Label htmlFor={`provider-${channel.id}`} className="text-sm">Provedor</Label>
                                    <Select 
                                        value={channel.provider}
                                        onValueChange={(value) => handleUpdateChannel(channel.id, 'provider', value)}
                                    >
                                        <SelectTrigger id={`provider-${channel.id}`} className="w-[160px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="automatic">Automático</SelectItem>
                                            <SelectItem value="gemini">Gemini</SelectItem>
                                            <SelectItem value="openai">OpenAI</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="justify-end">
                    <Button onClick={handleSaveChanges} disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar Regras dos Canais
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Eventos</CardTitle>
                    <CardDescription>Registro das últimas atividades e webhooks recebidos dos canais (simulado).</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="border rounded-lg">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Canal</TableHead>
                            <TableHead>Evento</TableHead>
                            <TableHead>Data/Hora</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Detalhes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockHistory.map((log, i) => (
                                 <TableRow key={i}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        {log.channel === 'WhatsApp' && <WhatsAppIcon className="h-4 w-4 text-green-500"/>}
                                        {log.channel === 'Instagram' && <InstagramIcon className="h-4 w-4 text-pink-500"/>}
                                        {log.channel === 'Facebook' && <FacebookIcon className="h-4 w-4 text-blue-600"/>}
                                        {log.channel}
                                    </TableCell>
                                    <TableCell>{log.event}</TableCell>
                                    <TableCell>{log.date}</TableCell>
                                    <TableCell>
                                        <Badge className={cn(getStatusBadgeClasses(log.status === 'Sucesso' ? 'connected' : 'failing'), 'gap-1.5')}>
                                            {log.status === 'Sucesso' ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                                            {log.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{log.details}</TableCell>
                                 </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
        </TooltipProvider>
    )
}
