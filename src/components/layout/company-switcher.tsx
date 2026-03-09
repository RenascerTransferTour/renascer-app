'use client';

import { useState } from 'react';
import { ChevronsUpDown, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockCompanies } from '@/lib/mock-data';
import { Company } from '@/lib/types';
import { getInitials } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function CompanySwitcher() {
  const [selectedCompany, setSelectedCompany] = useState<Company>(mockCompanies[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="truncate">{selectedCompany.name}</span>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuLabel>Alternar empresa</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {mockCompanies.map((company) => (
            <DropdownMenuItem key={company.id} onSelect={() => setSelectedCompany(company)}>
              <Avatar className="mr-2 h-5 w-5">
                <AvatarFallback>{getInitials(company.name)}</AvatarFallback>
              </Avatar>
              <span>{company.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
