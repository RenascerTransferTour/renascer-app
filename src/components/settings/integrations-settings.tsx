import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Info } from "lucide-react"
import { Button } from "../ui/button"
  
export function IntegrationsSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Integrações</CardTitle>
                <CardDescription>
                Conecte o sistema a outras ferramentas que você usa.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Funcionalidade Futura</AlertTitle>
                    <AlertDescription>
                        A loja de integrações e a conexão com outras ferramentas (como Google Calendar, RD Station, etc.) são funcionalidades planejadas para futuras versões.
                    </AlertDescription>
                </Alert>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Google Calendar</CardTitle>
                            <CardDescription>Sincronize agendamentos automaticamente.</CardDescription>
                        </div>
                        <Button variant="outline" disabled>Conectar</Button>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">RD Station</CardTitle>
                            <CardDescription>Envie leads qualificados para seu funil de marketing.</CardDescription>
                        </div>
                        <Button variant="outline" disabled>Conectar</Button>
                    </CardHeader>
                </Card>
            </CardContent>
        </Card>
    )
}
