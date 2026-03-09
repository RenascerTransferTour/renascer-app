"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import {
  ImageIcon,
  Info,
  Palette,
  Type,
  Component,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { getStatusBadgeClasses } from '@/lib/utils'


const ColorSwatch = ({ label, color, varName }: { label: string, color: string, varName: string }) => (
    <div className="flex flex-col gap-2">
      <div className="w-full h-16 rounded-md border" style={{ backgroundColor: color }} />
      <div>
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{varName}</p>
      </div>
    </div>
  )

const FileUpload = ({ label, description }: { label: string, description: string }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor={label.replace(/\s+/g, '-').toLowerCase()}
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-not-allowed bg-muted/50 opacity-60"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <ImageIcon className="w-8 h-8 mb-4 text-muted-foreground" />
          <p className="mb-2 text-sm text-muted-foreground">
            <span className="font-semibold">Upload desativado</span>
          </p>
          <p className="text-xs text-muted-foreground text-center">{description}</p>
        </div>
        <input id={label.replace(/\s+/g, '-').toLowerCase()} type="file" className="hidden" disabled />
      </label>
    </div>
  </div>
)

export function AppearanceForm() {
    const { toast } = useToast()
    
    const handleSave = () => {
        toast({
            title: "Configurações Salvas (Simulado)",
            description: "A aparência do sistema foi atualizada localmente para preview.",
        })
    }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Identidade da Marca</CardTitle>
                    <CardDescription>
                        Posicionamento visual da marca: profissional, confiável, premium e claro.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Modo Simulado</AlertTitle>
                        <AlertDescription>
                            O logotipo atual é definido no código-fonte (`icons.tsx`). A função de upload é apenas uma representação visual e está desativada. As demais alterações são aplicadas localmente para preview, mas o salvamento real não está ativado.
                        </AlertDescription>
                    </Alert>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FileUpload label="Logo Principal (Preview)" description="O logo é definido em /src/components/icons.tsx" />
                        <FileUpload label="Logo Compacto / Favicon (Preview)" description="O Favicon é definido no sistema de arquivos" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="companyName">Nome da Empresa</Label>
                        <Input id="companyName" defaultValue="Renascer Transfer Tour" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Palette /> Paleta Principal</CardTitle>
                    <CardDescription>
                       As cores principais que definem a identidade visual de todo o sistema.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <ColorSwatch label='Primária' color='hsl(var(--primary))' varName='--primary'/>
                    <ColorSwatch label='Destaque' color='hsl(var(--accent))' varName='--accent'/>
                    <ColorSwatch label='Fundo' color='hsl(var(--background))' varName='--background'/>
                    <ColorSwatch label='Card' color='hsl(var(--card))' varName='--card'/>
                    <ColorSwatch label='Texto' color='hsl(var(--foreground))' varName='--foreground'/>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Type /> Tipografia</CardTitle>
                    <CardDescription>
                        A hierarquia de fontes garante legibilidade e consistência em toda a interface. A fonte utilizada é a Inter.
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <h1 className='text-3xl font-bold tracking-tight'>Título Principal (H1)</h1>
                    <h2 className='text-2xl font-semibold border-b pb-2'>Seção Importante (H2)</h2>
                    <h3 className='text-xl font-semibold'>Sub-seção (H3)</h3>
                    <p className='text-base'>Este é um parágrafo de corpo de texto, usado para descrições e conteúdos mais longos. A boa legibilidade é fundamental para a experiência do usuário.</p>
                    <p className='text-sm text-muted-foreground'>Este é um texto de apoio ou secundário, ideal para legendas, descrições de formulários e informações menos críticas.</p>
                </CardContent>
            </Card>
            
            <Card>
                 <CardFooter className="justify-end gap-2 pt-6">
                    <Button variant="ghost">Redefinir</Button>
                    <Button onClick={handleSave}>Salvar Alterações</Button>
                </CardFooter>
            </Card>
        </div>
        <div className="lg:col-span-1">
            <Card className="sticky top-20">
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Component /> Componentes da Marca</CardTitle>
                    <CardDescription>Preview dos componentes principais com o tema aplicado.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className='space-y-2'>
                        <Label>Botões</Label>
                        <div className='flex flex-wrap gap-2'>
                            <Button>Primário</Button>
                            <Button variant='secondary'>Secundário</Button>
                            <Button variant='destructive'>Destrutivo</Button>
                            <Button variant='outline'>Outline</Button>
                        </div>
                    </div>
                     <div className='space-y-2'>
                        <Label>Badges de Status</Label>
                        <div className='flex flex-wrap gap-2'>
                            <Badge className={cn(getStatusBadgeClasses('confirmada'))}>Sucesso</Badge>
                            <Badge className={cn(getStatusBadgeClasses('aguardando humano'))}>Aviso</Badge>
                            <Badge className={cn(getStatusBadgeClasses('cancelada'))}>Erro</Badge>
                             <Badge className={cn(getStatusBadgeClasses('open'))}>Info</Badge>
                            <Badge className={cn(getStatusBadgeClasses('rascunho'))}>Neutro</Badge>
                        </div>
                    </div>
                     <div className='space-y-2'>
                        <Label htmlFor='preview-input'>Input de Formulário</Label>
                        <Input id='preview-input' placeholder='ex: contato@renascer.ai' />
                    </div>
                     <div className='space-y-2'>
                        <Label>Alertas de Sistema</Label>
                        <div className='space-y-2'>
                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertTitle>Aviso</AlertTitle>
                                <AlertDescription>
                                    Este é um aviso informativo para o usuário.
                                </AlertDescription>
                            </Alert>
                             <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Erro Crítico</AlertTitle>
                                <AlertDescription>
                                   Esta ação não pode ser desfeita.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>
                    <div className='space-y-2'>
                         <Label>Exemplo de Tabela</Label>
                         <div className='border rounded-lg'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className='font-medium'>Ana Silva</TableCell>
                                        <TableCell><Badge className={cn(getStatusBadgeClasses('confirmada'))}>Confirmada</Badge></TableCell>
                                    </TableRow>
                                     <TableRow>
                                        <TableCell className='font-medium'>Bruno Costa</TableCell>
                                        <TableCell><Badge className={cn(getStatusBadgeClasses('pendente'))}>Pendente</Badge></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                         </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
