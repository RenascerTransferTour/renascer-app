'use client';
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { fetchWithDelay, mockKnowledgeBaseArticles } from '@/lib/mock-data';
import type { KnowledgeBaseArticle } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from '../ui/skeleton';

export function KnowledgeBaseContent() {
    const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await fetchWithDelay(mockKnowledgeBaseArticles, 500);
            setArticles(data);
            setLoading(false);
        }
        loadData();
    }, []);

    const categories = [...new Set(articles.map(a => a.category))];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Base de Conhecimento</h1>
                <p className="text-muted-foreground">
                    Encontre artigos, procedimentos e políticas internas.
                </p>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar na base de conhecimento..." className="pl-10" />
            </div>

            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            ) : (
            <Accordion type="multiple" defaultValue={categories} className="w-full space-y-2">
                {categories.map(category => {
                    const categoryArticles = articles.filter(a => a.category === category);
                    return (
                        <AccordionItem value={category} key={category} className="border rounded-lg bg-card">
                            <AccordionTrigger className="px-4 text-lg font-medium">{category}</AccordionTrigger>
                            <AccordionContent className="px-4">
                                <div className="space-y-2">
                                {categoryArticles.map(article => (
                                    <div key={article.id} className="p-3 rounded-md hover:bg-muted/50">
                                        <h4 className="font-semibold">{article.title}</h4>
                                        <p className="text-sm text-muted-foreground">{article.summary}</p>
                                        <div className="text-xs text-muted-foreground mt-2">
                                            <span>Por {article.author}</span> • <span>{format(new Date(article.lastUpdated), 'dd/MM/yyyy')}</span>
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
            )}
        </div>
    )
}
