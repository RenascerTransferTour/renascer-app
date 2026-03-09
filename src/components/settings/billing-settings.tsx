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
import { mockPlans } from "@/lib/mock-data";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export function BillingSettings() {
    return (
        <Card>
            <CardHeader>
              <CardTitle>Plano e Assinatura</CardTitle>
              <CardDescription>
                Gerencie seu plano atual ou explore novas opções.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mockPlans.map(plan => (
                <Card key={plan.name} className={cn(plan.popular && "border-primary")}>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            {plan.name}
                            {plan.popular && <Badge variant="default">Popular</Badge>}
                        </CardTitle>
                        <div className="text-3xl font-bold">{plan.price}<span className="text-sm font-normal text-muted-foreground">/mês</span></div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {plan.features.map(feature => (
                            <div key={feature} className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-green-500" />
                                <span className="text-muted-foreground">{feature}</span>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" disabled={plan.name === 'Profissional'}>
                            {plan.name === 'Profissional' ? 'Plano Atual' : plan.cta}
                        </Button>
                    </CardFooter>
                </Card>
              ))}
            </CardContent>
        </Card>
    )
}
