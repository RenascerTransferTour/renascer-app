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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { getInitials } from "@/lib/utils";
import { mockTeamMembers } from "@/lib/mock-data";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";

const statusVariant: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
    active: 'default',
    inactive: 'destructive',
    pending: 'secondary',
};

export function UsersSettings() {
    return (
        <Card>
            <CardHeader>
              <CardTitle>Usuários e Permissões</CardTitle>
              <CardDescription>
                Gerencie os membros da sua equipe e seus papéis.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Papel</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead><span className="sr-only">Ações</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockTeamMembers.map(member => (
                            <TableRow key={member.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={`https://picsum.photos/seed/${member.id}/40/40`} />
                                            <AvatarFallback>{getInitials(member.name || member.email)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{member.name || 'Pendente'}</p>
                                            <p className="text-sm text-muted-foreground">{member.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{member.role}</TableCell>
                                <TableCell>
                                    <Badge variant={statusVariant[member.status]} className="capitalize">{member.status}</Badge>
                                </TableCell>
                                <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Editar</DropdownMenuItem>
                                    <DropdownMenuItem>Remover</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Convidar Novo Usuário</Button>
            </CardFooter>
        </Card>
    )
}
