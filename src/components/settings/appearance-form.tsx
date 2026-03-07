"use client"

import { useState } from 'react'
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
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import {
  Palette,
  Image as ImageIcon,
  Smartphone,
  MessageSquare,
  Sidebar as SidebarIcon,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ColorPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className="flex items-center gap-2">
      <Input
        type="color"
        value={value}
        onChange={onChange}
        className="h-10 w-10 p-1"
      />
      <Input
        type="text"
        value={value}
        onChange={onChange}
        className="max-w-[120px]"
      />
    </div>
  </div>
)

const FileUpload = ({ label, description }: { label: string, description: string }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor={label.replace(/\s+/g, '-').toLowerCase()}
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <ImageIcon className="w-8 h-8 mb-4 text-muted-foreground" />
          <p className="mb-2 text-sm text-muted-foreground">
            <span className="font-semibold">Clique para enviar</span> ou arraste e solte
          </p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <input id={label.replace(/\s+/g, '-').toLowerCase()} type="file" className="hidden" />
      </label>
    </div>
  </div>
)

export function AppearanceForm() {
    const { toast } = useToast()

    const defaultState = {
        companyName: 'Renascer',
        slogan: 'Inteligência em Atendimento',
        primaryColor: '#4A4270',
        secondaryColor: '#FFFFFF',
        accentColor: '#3C72DD',
        theme: 'light',
        sidebarStyle: 'sidebar',
        backgroundColor: '#F0F0F5',
      };

    const [settings, setSettings] = useState(defaultState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setSettings(prev => ({ ...prev, [id]: value }));
    }

    const handleSelectChange = (id: string, value: string) => {
        setSettings(prev => ({ ...prev, [id]: value }));
    }
    
    const handleSave = () => {
        toast({
            title: "Configurações Salvas",
            description: "A aparência do sistema foi atualizada.",
        })
    }

    const handleReset = () => {
        setSettings(defaultState);
        toast({
            title: "Configurações Restauradas",
            description: "A aparência foi redefinida para os padrões.",
        })
    }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Identidade Visual</CardTitle>
                    <CardDescription>
                        Personalize o logo, nome e slogan da sua empresa.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FileUpload label="Logo Principal" description="PNG, JPG, SVG (max. 800x400px)" />
                        <FileUpload label="Logo Compacto / Favicon" description="PNG, ICO, SVG (max. 50x50px)" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="companyName">Nome da Empresa</Label>
                        <Input id="companyName" value={settings.companyName} onChange={handleInputChange}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slogan">Slogan</Label>
                        <Input id="slogan" value={settings.slogan} onChange={handleInputChange} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Esquema de Cores</CardTitle>
                    <CardDescription>
                        Ajuste as cores para combinar com a identidade da sua marca.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <ColorPicker label="Primária" value={settings.primaryColor} onChange={e => setSettings(p => ({...p, primaryColor: e.target.value}))}/>
                    <ColorPicker label="Fundo" value={settings.backgroundColor} onChange={e => setSettings(p => ({...p, backgroundColor: e.target.value}))}/>
                    <ColorPicker label="Cards/Secundária" value={settings.secondaryColor} onChange={e => setSettings(p => ({...p, secondaryColor: e.target.value}))}/>
                    <ColorPicker label="Destaque" value={settings.accentColor} onChange={e => setSettings(p => ({...p, accentColor: e.target.value}))}/>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Estilos e Aparência</CardTitle>
                    <CardDescription>
                        Defina o tema da interface e o estilo da barra lateral.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Tema da Interface</Label>
                        <Select value={settings.theme} onValueChange={(v) => handleSelectChange('theme', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o tema" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light"><div className="flex items-center gap-2"><Sun className="h-4 w-4"/> Modo Claro</div></SelectItem>
                                <SelectItem value="dark"><div className="flex items-center gap-2"><Moon className="h-4 w-4"/> Modo Escuro</div></SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Estilo da Barra Lateral</Label>
                        <Select value={settings.sidebarStyle} onValueChange={(v) => handleSelectChange('sidebarStyle', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o estilo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sidebar">Padrão</SelectItem>
                                <SelectItem value="floating">Flutuante</SelectItem>
                                <SelectItem value="inset">Interno</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-2">
                        <FileUpload label="Imagem de Fundo do Login" description="JPG, PNG (recomendado: 1920x1080px)"/>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Assinatura de Mensagem</CardTitle>
                    <CardDescription>
                        Visualize como sua marca aparecerá nas mensagens automáticas.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg bg-muted p-4 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="rounded-full flex items-center justify-center size-10" style={{ backgroundColor: settings.primaryColor }}>
                                <Sparkles className="size-5" style={{ color: settings.secondaryColor }} />
                            </div>
                            <div>
                                <p className="font-bold" style={{ color: settings.primaryColor }}>{settings.companyName}</p>
                                <div className="mt-1 text-sm text-foreground bg-card p-3 rounded-lg rounded-tl-none shadow">
                                    Olá! Esta é uma mensagem de exemplo para mostrar como sua assinatura aparecerá.
                                    <p className="text-xs text-muted-foreground mt-2">- {settings.slogan}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                    <Button variant="ghost" onClick={handleReset}>Redefinir Padrão</Button>
                    <Button onClick={handleSave}>Salvar Alterações</Button>
                </CardFooter>
            </Card>
        </div>
        <div className="lg:col-span-1">
            <Card className="sticky top-20">
                <CardHeader>
                    <CardTitle>Pré-visualização</CardTitle>
                    <CardDescription>Veja como as alterações aparecerão.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                        className={cn(
                            'w-full aspect-[9/16] rounded-lg border-4 border-foreground/50 overflow-hidden shadow-lg transition-colors',
                             settings.theme === 'dark' ? 'dark' : ''
                        )}
                        style={{
                            backgroundColor: settings.backgroundColor,
                        }}
                    >
                         <div className="flex h-full flex-col bg-transparent">
                            {/* Header */}
                            <div className="flex items-center justify-between p-3 border-b" style={{backgroundColor: settings.secondaryColor, borderColor: 'hsl(var(--border))'}}>
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded" style={{backgroundColor: settings.primaryColor}}>
                                        <SidebarIcon className="size-4" style={{color: settings.theme === 'light' ? 'white' : 'black'}}/>
                                    </div>
                                    <p className="text-sm font-bold" style={{color: settings.primaryColor}}>{settings.companyName}</p>
                                </div>
                                <div className="size-6 rounded-full bg-muted" />
                            </div>
                            {/* Content */}
                            <div className="p-4 flex-1">
                                <h2 className="font-bold text-lg text-foreground">Dashboard</h2>
                                <div className="mt-4 p-3 rounded-lg" style={{backgroundColor: settings.secondaryColor}}>
                                    <p className="text-sm font-semibold text-card-foreground">Novo Lead!</p>
                                    <p className="text-xs text-muted-foreground mt-1">Um novo lead acaba de chegar via WhatsApp.</p>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <Button size="sm" className="flex-1" style={{ backgroundColor: settings.primaryColor, color: settings.theme === 'light' ? 'white' : 'black'}}>Ver</Button>
                                    <Button size="sm" variant="outline" className="flex-1" style={{ borderColor: settings.accentColor, color: settings.accentColor}}>Ignorar</Button>
                                </div>
                            </div>
                            {/* Nav */}
                            <div className="flex justify-around p-2 border-t" style={{backgroundColor: settings.secondaryColor, borderColor: 'hsl(var(--border))'}}>
                                <Smartphone className="size-5" style={{color: settings.accentColor}} />
                                <MessageSquare className="size-5 text-muted-foreground" />
                                <SidebarIcon className="size-5 text-muted-foreground" />
                            </div>
                         </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
