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
import { Textarea } from "@/components/ui/textarea"

export function ProfileSettings() {
    return (
        <Card>
            <CardHeader>
              <CardTitle>Perfil da Empresa</CardTitle>
              <CardDescription>
                Informações públicas da sua empresa.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Nome da Empresa</Label>
                  <Input
                    id="name"
                    type="text"
                    className="w-full"
                    defaultValue="Renascer Transfer Tour"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    defaultValue="Agência de Turismo, Viagens, Transporte e Transferências no Rio de Janeiro."
                    className="min-h-32"
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Salvar</Button>
            </CardFooter>
        </Card>
    )
}
