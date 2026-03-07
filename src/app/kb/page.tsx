import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { knowledgeBaseArticles } from "@/lib/db/mock-data"
import { cn, getStatusBadgeClasses } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { FileText, Bot, Search, Info, UserCircle, Calendar } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const categories = Array.from(new Set(knowledgeBaseArticles.map(a => a.category)));

const statusLabels: Record<string, string> = {
  draft: 'Rascunho',
  reviewed: 'Revisado',
  published: 'Publicado internamente',
  archived: 'Arquivado',
}

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Base de Conhecimento</h1>
        <p className="text-muted-foreground">
          Encontre e gerencie os conteúdos internos que apoiam a operação e que poderão ser usados pela IA no futuro.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Base em Modo Simulado</AlertTitle>
        <AlertDescription>
          O conteúdo é gerenciado localmente. O uso deste conteúdo pela IA para responder clientes ou sugerir ações é um recurso futuro e seu <span className="font-semibold">uso real ainda não está ativado</span>.
        </AlertDescription>
      </Alert>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Buscar na base de conhecimento..." className="pl-10" />
      </div>

      <div>
        <Accordion type="multiple" defaultValue={categories.map(c => c)} className="w-full">
            {categories.map(category => {
                const articlesInCategory = knowledgeBaseArticles.filter(a => a.category === category);
                return (
                    <AccordionItem value={category} key={category}>
                        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            {category}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <Accordion type="single" collapsible className="w-full pl-4 space-y-2">
                                {articlesInCategory.map(article => (
                                    <AccordionItem value={article.id} key={article.id} className="border rounded-md px-4 hover:bg-muted/50">
                                        <AccordionTrigger className="py-3">
                                          <p className="font-semibold flex-1 text-left">{article.title}</p>
                                          <div className="flex items-center gap-2 ml-4 shrink-0">
                                            {article.isEligibleForAI && (
                                              <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50 gap-1.5">
                                                <Bot className="h-3.5 w-3.5" />
                                                Elegível para IA
                                              </Badge>
                                            )}
                                            <Badge className={cn(getStatusBadgeClasses(article.status))}>{statusLabels[article.status] || article.status}</Badge>
                                          </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground pt-2 pb-4 space-y-4">
                                            <p className="text-sm text-foreground italic">{article.summary}</p>
                                            <Separator/>
                                            <p>{article.content}</p>
                                            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                                                <div className="flex items-center gap-1.5">
                                                  <UserCircle className="h-3.5 w-3.5" />
                                                  <span>Autor: {article.author === 'op-1' ? 'Cláudia Vaz' : 'Carlos'}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                  <Calendar className="h-3.5 w-3.5" />
                                                  <span>Última atualização: {format(parseISO(article.updatedAt), "dd/MM/yyyy", { locale: ptBR })}</span>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                           </Accordion>
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
        </Accordion>
      </div>
    </div>
  )
}
