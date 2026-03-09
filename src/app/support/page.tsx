import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SupportPage() {
    return (
        <div className="mx-auto grid w-full max-w-4xl gap-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Central de Ajuda</h1>
                <p className="text-muted-foreground">Encontre respostas ou entre em contato com nosso suporte.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Documentação</CardTitle>
                    <CardDescription>
                        Aprenda a usar todas as funcionalidades do sistema com nossos guias completos.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button>Acessar Documentação</Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Fale Conosco</CardTitle>
                    <CardDescription>
                        Não encontrou o que procurava? Nossa equipe está pronta para ajudar.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-2"><strong>Email:</strong> suporte@renascertour.ai</p>
                    <p><strong>Horário de Atendimento:</strong> Seg-Sex, 9h às 18h.</p>
                </CardContent>
            </Card>
        </div>
    )
}
