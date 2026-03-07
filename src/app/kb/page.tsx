import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { knowledgeBaseArticles } from "@/lib/db/mock-data"
import { Search } from "lucide-react"

const categories = Array.from(new Set(knowledgeBaseArticles.map(a => a.category)));

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Base de Conhecimento</h1>
        <p className="text-muted-foreground">
          Encontre respostas, políticas e informações sobre os serviços.
        </p>
      </div>
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
                        <AccordionTrigger className="text-lg font-semibold">{category}</AccordionTrigger>
                        <AccordionContent>
                           <Accordion type="single" collapsible className="w-full pl-4">
                                {articlesInCategory.map(article => (
                                    <AccordionItem value={article.id} key={article.id}>
                                        <AccordionTrigger>{article.title}</AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            {article.content}
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
