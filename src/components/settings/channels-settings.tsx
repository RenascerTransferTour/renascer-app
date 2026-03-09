'use client';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "../ui/alert"
import { Info, AlertTriangle, ScanLine } from "lucide-react"

export function ChannelsSettings() {
    return (
        <Card>
            <CardHeader>
              <CardTitle>Canais</CardTitle>
              <CardDescription>
                Conecte suas contas do WhatsApp, Instagram e outros canais.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Funcionalidade Em Desenvolvimento</AlertTitle>
                    <AlertDescription>
                        A integração real com os canais (WhatsApp, Instagram, etc.) ainda não foi implementada. Esta é uma representação visual de como a funcionalidade irá operar.
                    </AlertDescription>
                </Alert>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">WhatsApp Business</CardTitle>
                            <CardDescription>Via API Oficial da Meta</CardDescription>
                        </div>
                        <Button variant="outline" disabled>Conectar</Button>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Conecte sua conta do WhatsApp para receber e enviar mensagens diretamente do sistema.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Instagram Direct</CardTitle>
                            <CardDescription>Responda DMs do Instagram</CardDescription>
                        </div>
                        <Button variant="outline" disabled>Conectar</Button>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Gerencie suas mensagens diretas do Instagram sem sair da plataforma.</p>
                    </CardContent>
                </Card>
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Atenção: QR Code é Simulado</AlertTitle>
                    <AlertDescription>
                       A opção de conexão via QR Code (não oficial) foi removida para evitar confusão e garantir a conformidade com as políticas da Meta. A única forma de integração futura será via API Oficial.
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    )
}
