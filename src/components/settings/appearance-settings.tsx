'use client';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "../ui/alert"
import { Upload, Info } from "lucide-react"

export function AppearanceSettings() {
    return (
        <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>
                Personalize a aparência do sistema com a sua marca.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <Label>Logotipo</Label>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Logotipo Gerenciado por Código</AlertTitle>
                    <AlertDescription>
                        Nesta versão, a funcionalidade de upload de logotipo não está implementada. Para alterar o logo, é necessário editar o componente de ícone diretamente no código-fonte no arquivo: <code className="text-xs bg-muted p-1 rounded-sm">src/components/icons.tsx</code>.
                    </AlertDescription>
                  </Alert>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="primary-color">Cor Primária</Label>
                  <Input
                    id="primary-color"
                    type="text"
                    className="w-full"
                    defaultValue="#2563EB"
                  />
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Salvar Aparência</Button>
            </CardFooter>
        </Card>
    )
}
