'use client'

import { useState } from "react"
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
import { QrCode, CheckCircle2, AlertTriangle, Clock, XCircle, Share2, Server, KeyRound, Phone, Webhook, History, Link2, Info } from "lucide-react"

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M16.75 13.96c.25.13.43.2.5.28.08.08.14.18.18.3.04.1.06.2.04.3s-.04.2-.1.32c-.04.1-.1.18-.18.25a.87.87 0 01-.43.18c-.2.03-.43.02-.7-.02-.25-.04-.53-.1-.82-.18-.3-.08-.58-.18-.88-.32a9.44 9.44 0 01-1.4-.82 8.37 8.37 0 01-1.14-1.1c-.3-.4-.58-.8-.8-1.24-.24-.46-.4-1-.48-1.53a3.2 3.2 0 01-.04-.48c0-.18.02-.35.08-.5.05-.16.14-.3.26-.42.12-.12.25-.2.4-.26.15-.05.3-.07.46-.07.13 0 .26.02.38.05.12.03.24.08.34.15.1.07.2.16.28.28.08.1.13.23.14.35.02.12.02.26 0 .4-.02.16-.06.3-.12.44s-.13.25-.22.34c-.1.1-.2.18-.3.25-.1.08-.18.14-.24.2-.06.05-.1.1-.14.13-.03.03-.04.04-.02.07.02.03.1.1.2.18.1.07.2.14.32.23.1.1.2.17.3.25.3.23.6.43.9.6.34.18.66.3.96.36.1.02.2.04.3.05.1 0 .2.02.3.02.13 0 .25-.02.38-.05.12-.03.24-.08.34-.15.1-.07.18-.16.24-.25.06-.1.1-.2.12-.32.02-.1.02-.2 0-.32a.8.8 0 00-.06-.32.74.74 0 00-.16-.3c-.06-.08-.14-.15-.22-.2-.08-.05-.17-.1-.26-.12-.1-.02-.2-.02-.3-.02s-.2.02-.3.04-.18.06-.25.1c-.07.04-.13.1-.18.15-.05.06-.1.1-.13.16-.03.05-.06.1-.08.15-.02.05-.03.1-.02.13.01.03.02.06.04.08a.3.3 0 00.08.08.3.3 0 00.1.04.3.3 0 00.12 0 .3.3 0 00.1-.04.34.34 0 00.08-.08.3.3 0 00.04-.1.2.2 0 000-.12zM12 2a10 10 0 00-10 10 10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2zm0 18a8 8 0 01-8-8 8 8 0 018-8 8 8 0 018 8 8 8 0 01-8 8z" /></svg>
)
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 2c2.7 0 3 .01 4.06.06a6.4 6.4 0 014.4 1.48 6.4 6.4 0 011.48 4.4c.05 1.07.06 1.35.06 4.06s-.01 3-.06 4.06a6.4 6.4 0 01-1.48 4.4 6.4 6.4 0 01-4.4 1.48c-1.07.05-1.35.06-4.06.06s-3 0-4.06-.06a6.4 6.4 0 01-4.4-1.48 6.4 6.4 0 01-1.48-4.4C2.01 15 2 14.7 2 12s0-3 .06-4.06A6.4 6.4 0 013.54 3.54 6.4 6.4 0 017.94 2.06C8.99 2.01 9.3 2 12 2zm0 2a8.1 8.1 0 00-4.1.06A4.4 4.4 0 005.37 5.37a4.4 4.4 0 00-1.3 2.53C4.01 9 4 9.3 4 12s0 3 .06 4.1a4.4 4.4 0 001.3 2.53 4.4 4.4 0 002.53 1.3c1.1.06 1.4.06 4.1.06s3 0 4.1-.06a4.4 4.4 0 002.53-1.3 4.4 4.4 0 001.3-2.53c.06-1.1.06-1.4.06-4.1s0-3-.06-4.1a4.4 4.4 0 00-1.3-2.53A4.4 4.4 0 0016.1 4.06C15.1 4 14.7 4 12 4zm0 4a6 6 0 100 12 6 6 0 000-12zm0 2a4 4 0 110 8 4 4 0 010-8zm6.5-3a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>
)
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" /></svg>
)

const StatusBadge = ({ status }: { status: 'conectado' | 'desconectado' | 'pendente' | 'aguardando' | 'expirado' }) => {
    const statusConfig = {
      'conectado': { icon: CheckCircle2, className: 'border-transparent bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300' },
      'desconectado': { icon: XCircle, className: 'border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20' },
      'pendente': { icon: Clock, className: 'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300' },
      'aguardando': { icon: Clock, className: 'border-transparent bg-orange-100 text-orange-800 dark:bg-orange-800/30 dark:text-orange-300' },
      'expirado': { icon: AlertTriangle, className: 'border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20' }
    };
    const { icon: Icon, className } = statusConfig[status];
    return (
      <Badge className={`${className} gap-1.5 capitalize`}><Icon className="h-3 w-3" />{status}</Badge>
    );
};

export default function ChannelsPage() {
    const [state, setState] = useState({
        channels: {
            whatsapp: {
                connected: true,
                mode: 'api', // 'api' or 'qrcode'
                status: 'conectado',
                lastSync: '2 minutos atrás',
                api: {
                    accessToken: '**********',
                    phoneNumberId: '10987654321',
                    businessAccountId: '12345678901',
                    webhookToken: '**********',
                },
                qrcode: {
                    status: 'expirado',
                }
            },
            instagram: {
                connected: false,
                status: 'desconectado',
                lastSync: 'Nunca',
            },
            facebook: {
                connected: true,
                status: 'conectado',
                lastSync: '1 hora atrás',
            }
        },
        rules: {
            whatsapp: { aiActive: true, humanRequired: false },
            instagram: { aiActive: true, humanRequired: true },
            facebook: { aiActive: false, humanRequired: true },
        },
    })
    
    const mockHistory = [
        { channel: 'WhatsApp', event: 'Webhook Received', date: '2024-07-30 14:32:10', status: 'Sucesso', details: 'Nova mensagem de +55 11 9....'},
        { channel: 'Instagram', event: 'API Connection', date: '2024-07-30 13:05:00', status: 'Falhou', details: 'Token de acesso inválido'},
        { channel: 'WhatsApp', event: 'QR Code Generated', date: '2024-07-29 10:15:40', status: 'Sucesso', details: 'Sessão aguardando leitura'},
        { channel: 'Facebook', event: 'Webhook Test', date: '2024-07-29 09:00:00', status: 'Sucesso', details: 'Endpoint verificado com sucesso'},
    ];

    return (
        <TooltipProvider>
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Canais e Conexões</h1>
                <p className="text-muted-foreground">
                Gerencie as integrações com os canais de comunicação da sua empresa.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Visão Geral</CardTitle>
                    <CardDescription>Status atual das suas conexões.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Canais Conectados</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2</div>
                            <p className="text-xs text-muted-foreground">de 3 canais estão ativos</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Conexões Pendentes</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1</div>
                            <p className="text-xs text-muted-foreground">requer configuração (Instagram)</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Saúde das Conexões</CardTitle>
                            <Server className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-500">Normal</div>
                            <p className="text-xs text-muted-foreground">Todos os webhooks respondendo</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Última Sincronização</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Agora</div>
                            <p className="text-xs text-muted-foreground">via WhatsApp</p>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>

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
                                <StatusBadge status={state.channels.whatsapp.status as any}/>
                            </div>
                        </CardHeader>
                        <Tabs defaultValue="api" className="w-full">
                            <CardContent>
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="api">API Oficial da Meta</TabsTrigger>
                                    <TabsTrigger value="qrcode">Pareamento por QR Code</TabsTrigger>
                                </TabsList>
                            </CardContent>
                            <TabsContent value="api" className="px-6 pb-6 space-y-4">
                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertTitle>Modo Recomendado</AlertTitle>
                                    <AlertDescription>
                                        A API Oficial oferece mais estabilidade, segurança e recursos para automação.
                                    </AlertDescription>
                                </Alert>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="wa-phone-id">Phone Number ID</Label>
                                        <Input id="wa-phone-id" value={state.channels.whatsapp.api.phoneNumberId} disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="wa-account-id">Business Account ID</Label>
                                        <Input id="wa-account-id" value={state.channels.whatsapp.api.businessAccountId} disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="wa-token">Token de Acesso</Label>
                                        <Input id="wa-token" type="password" value={state.channels.whatsapp.api.accessToken} disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="wa-webhook">Webhook Verify Token</Label>
                                        <Input id="wa-webhook" type="password" value={state.channels.whatsapp.api.webhookToken} disabled />
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
                                    <Button variant="destructive">Desconectar</Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="qrcode" className="px-6 pb-6 space-y-4">
                                <Alert variant="default">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Modo Opcional</AlertTitle>
                                    <AlertDescription>
                                       Este modo usa a conexão do seu celular e pode ser instável. Use a API Oficial para produção.
                                    </AlertDescription>
                                </Alert>
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <div className="p-4 border rounded-lg bg-muted/50 flex items-center justify-center w-48 h-48">
                                        <QrCode className="h-32 w-32 text-muted-foreground"/>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span>Status:</span>
                                            <StatusBadge status="aguardando" />
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
                                <StatusBadge status={state.channels.instagram.status as any}/>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                                <StatusBadge status={state.channels.facebook.status as any}/>
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
                        {Object.entries(state.rules).map(([channel, rules]) => (
                            <div key={channel} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b last:border-b-0">
                                <div className="flex items-center gap-3 mb-4 md:mb-0">
                                    {channel === 'whatsapp' && <WhatsAppIcon className="h-6 w-6 text-green-500"/>}
                                    {channel === 'instagram' && <InstagramIcon className="h-6 w-6 text-pink-500"/>}
                                    {channel === 'facebook' && <FacebookIcon className="h-6 w-6 text-blue-600"/>}
                                    <span className="font-semibold capitalize">{channel}</span>
                                </div>
                                <div className="flex flex-wrap gap-x-6 gap-y-4">
                                     <div className="flex items-center space-x-2">
                                        <Switch id={`ai-active-${channel}`} checked={rules.aiActive} />
                                        <Label htmlFor={`ai-active-${channel}`}>IA Ativa</Label>
                                    </div>
                                     <div className="flex items-center space-x-2">
                                        <Switch id={`human-req-${channel}`} checked={rules.humanRequired} />
                                        <Label htmlFor={`human-req-${channel}`}>Humano Obrigatório</Label>
                                    </div>
                                     <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
                                                <Switch id={`provider-${channel}`} disabled />
                                                <Label htmlFor={`provider-${channel}`}>Usar Fallback</Label>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Configuração de provedor por canal em breve.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Eventos</CardTitle>
                    <CardDescription>Registro das últimas atividades e webhooks recebidos dos canais.</CardDescription>
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
                                        <Badge variant={log.status === 'Sucesso' ? 'default': 'destructive'} className={log.status === 'Sucesso' ? 'bg-green-100 text-green-800' : ''}>
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
