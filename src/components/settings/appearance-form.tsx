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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import {
  Image as ImageIcon,
  Sun,
  Moon,
  Sparkles,
  Car,
  LayoutDashboard,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '../ui/separator'

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
            <span className="font-semibold">Clique para enviar</span> ou arraste
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
        companyName: 'Renascer Transfer Tour',
        slogan: 'Conforto, segurança, pontualidade e atendimento 24h',
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
                </CardContent>
                 <CardFooter className="justify-end gap-2">
                    <Button variant="ghost" onClick={handleReset}>Redefinir</Button>
                    <Button onClick={handleSave}>Salvar Alterações</Button>
                </CardFooter>
            </Card>
        </div>
        <div className="lg:col-span-1">
            <Card className="sticky top-20">
                <CardHeader>
                    <CardTitle>Pré-visualização</CardTitle>
                    <CardDescription>Veja suas alterações em tempo real.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                        className={cn(
                            'w-full rounded-lg border bg-background overflow-hidden shadow-lg transition-colors',
                             settings.theme === 'dark' ? 'dark bg-zinc-900' : 'bg-zinc-100'
                        )}
                        style={{
                            backgroundColor: settings.backgroundColor,
                        }}
                    >
                         <div className="flex h-full">
                            {/* Sidebar Preview */}
                            <div className="w-16 p-2 flex flex-col items-center gap-2" style={{ backgroundColor: settings.primaryColor }}>
                                <div className="p-2 rounded-md" style={{ backgroundColor: settings.secondaryColor}}>
                                    <Car className="size-5" style={{ color: settings.primaryColor }}/>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <div className="p-2 rounded-md" style={{backgroundColor: settings.accentColor}}>
                                        <LayoutDashboard className="size-5" style={{ color: settings.theme === 'light' ? 'white' : 'black' }}/>
                                    </div>
                                    <div className="p-2 rounded-md bg-transparent">
                                         <MessageSquare className="size-5" style={{ color: settings.secondaryColor }} />
                                    </div>
                                </div>
                            </div>
                            {/* Main content preview */}
                            <div className="flex-1">
                                {/* Header Preview */}
                                <div className="p-3 border-b flex justify-between items-center" style={{ backgroundColor: settings.secondaryColor, borderColor: 'rgba(0,0,0,0.1)' }}>
                                    <p className="text-sm font-bold" style={{ color: settings.primaryColor}}>{settings.companyName}</p>
                                    <div className="size-6 rounded-full bg-muted" />
                                </div>

                                {/* Dashboard Card Preview */}
                                <div className="p-4">
                                    <div className="p-3 rounded-lg shadow-sm" style={{ backgroundColor: settings.secondaryColor }}>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs font-semibold text-card-foreground">Novos Contatos</p>
                                            <Sparkles className="size-4" style={{color: settings.accentColor}}/>
                                        </div>
                                        <p className="text-xl font-bold text-card-foreground mt-1">12</p>
                                    </div>
                                </div>
                                
                                <Separator className='my-2'/>

                                 {/* Conversation Preview */}
                                <div className='p-4'>
                                    <div className="flex items-start gap-2">
                                        <div className="size-7 rounded-full bg-muted flex-shrink-0" />
                                        <div className="p-2 rounded-lg max-w-[150px]" style={{backgroundColor: settings.primaryColor}}>
                                            <p className="text-xs" style={{color: settings.secondaryColor}}>Olá! Gostaria de um orçamento.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start justify-end gap-2 mt-2">
                                        <div className="p-2 rounded-lg bg-muted max-w-[150px]">
                                            <p className="text-xs text-foreground">Claro! Para qual serviço?</p>
                                        </div>
                                        <div className="size-7 rounded-full bg-muted flex-shrink-0" />
                                    </div>
                                </div>

                            </div>
                         </div>
                    </div>
                    <p className='text-xs text-muted-foreground mt-4'>
                        Pré-visualização da assinatura de mensagem automática:
                    </p>
                    <div className="rounded-lg bg-muted p-4 mt-2">
                        <div className="flex items-start gap-3">
                            <div className="rounded-full flex items-center justify-center size-10" style={{ backgroundColor: settings.primaryColor }}>
                                <Sparkles className="size-5" style={{ color: settings.secondaryColor }} />
                            </div>
                            <div>
                                <p className="font-bold" style={{ color: settings.primaryColor }}>{settings.companyName}</p>
                                <div className="mt-1 text-sm text-foreground bg-card p-3 rounded-lg rounded-tl-none shadow">
                                    Olá! Esta é uma mensagem automática. Em breve um de nossos especialistas irá te atender.
                                    <p className="text-xs text-muted-foreground mt-2">- {settings.slogan}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
