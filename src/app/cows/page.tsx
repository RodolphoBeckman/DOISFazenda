"use client"

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button"
import { PaginationComponent } from '@/components/pagination';
import { ChevronDown } from "lucide-react"

const allCows = [
  { id: '826', animal: 'Bezerras 2024', origem: 'Cria da Fazenda', farm: 'Segredo', lot: 'N', location: 'Pasto Palhada', status: 'Vazia', registrationStatus: 'Ativo' },
  { id: '827', animal: 'Bezerras 2024', origem: 'Cria da Fazenda', farm: 'Segredo', lot: 'N', location: 'Pasto Palhada', status: 'Vazia', registrationStatus: 'Ativo' },
  { id: 'VACA-001', farm: 'São Francisco', lot: 'Lote 1', status: 'Prenha', animal: 'Vaca Adulta', origem: 'Compra', location: 'Pasto A', registrationStatus: 'Ativo' },
  { id: 'VACA-002', farm: 'Segredo', lot: 'Lote 2', status: 'Vazia', animal: 'Vaca Adulta', origem: 'Compra', location: 'Pasto B', registrationStatus: 'Ativo' },
  { id: 'VACA-003', farm: 'Dois', lot: 'Lote 1', status: 'Prenha', animal: 'Novilha', origem: 'Cria da Fazenda', location: 'Pasto C', registrationStatus: 'Ativo' },
  { id: 'VACA-005', farm: 'Segredo', lot: 'Lote 2', status: 'Com cria', animal: 'Vaca Adulta', origem: 'Cria da Fazenda', location: 'Pasto D', registrationStatus: 'Ativo' },
];

type Cow = typeof allCows[0];
type ColumnKey = keyof Cow;


export default function CowsPage() {
  const [filters, setFilters] = React.useState<Record<ColumnKey, string[]>>({
    id: [], animal: [], origem: [], farm: [], lot: [], location: [], status: [], registrationStatus: [],
  });
  
  const handleFilterChange = (column: ColumnKey, value: string) => {
    setFilters(prev => {
      const newColumnFilters = prev[column].includes(value)
        ? prev[column].filter(v => v !== value)
        : [...prev[column], value];
      return { ...prev, [column]: newColumnFilters };
    });
  };

  const getFilteredData = (data: Cow[]) => {
    return data.filter(item => {
        return Object.entries(filters).every(([key, values]) => {
            if (values.length === 0) return true;
            const itemValue = item[key as ColumnKey];
            return values.includes(itemValue);
        });
    });
  };
  
  const getUniqueValues = (data: Cow[], column: ColumnKey) => {
    return Array.from(new Set(data.map(item => item[column]))).sort();
  };

  const renderFilterableHeader = (column: ColumnKey, label: string) => (
    <TableHead>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="p-1 h-auto">
            {label} <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Filtrar por {label}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {getUniqueValues(allCows, column).map(value => (
            <DropdownMenuCheckboxItem
              key={value}
              checked={filters[column].includes(value)}
              onCheckedChange={() => handleFilterChange(column, value)}
            >
              {value}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </TableHead>
  );

  const statuses = ['Prenha', 'Vazia', 'Com cria'];

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h1 className="text-3xl font-bold tracking-tight font-headline">
        Gerenciar Vacas
      </h1>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          {statuses.map(status => (
            <TabsTrigger key={status} value={status.toLowerCase().replace(' ', '-')}>{status}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <CardWithTable title="Todas as Vacas" data={getFilteredData(allCows)} renderFilterableHeader={renderFilterableHeader}/>
        </TabsContent>
        {statuses.map(status => (
            <TabsContent key={status} value={status.toLowerCase().replace(' ', '-')}>
                <CardWithTable
                    title={`Vacas ${status}`}
                    data={getFilteredData(allCows.filter((c) => c.status === status))}
                    renderFilterableHeader={renderFilterableHeader}
                />
            </TabsContent>
        ))}
      </Tabs>
    </main>
  );
}

function CardWithTable({ title, data, renderFilterableHeader }: { title: string; data: Cow[], renderFilterableHeader: (column: ColumnKey, label: string) => React.ReactNode }) {
  return (
    <div className="border bg-card text-card-foreground shadow-sm rounded-lg mt-4">
      <div className="p-6">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      </div>
      <div className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {renderFilterableHeader('id', 'Brinco')}
              {renderFilterableHeader('animal', 'Animal')}
              {renderFilterableHeader('origem', 'Origem')}
              {renderFilterableHeader('farm', 'Fazenda')}
              {renderFilterableHeader('lot', 'Lote')}
              {renderFilterableHeader('location', 'Localização')}
              {renderFilterableHeader('status', 'Status')}
              {renderFilterableHeader('registrationStatus', 'Status Cadastro')}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((cow) => (
              <TableRow key={cow.id}>
                <TableCell className="font-medium">{cow.id}</TableCell>
                <TableCell>{cow.animal}</TableCell>
                <TableCell>{cow.origem}</TableCell>
                <TableCell>{cow.farm}</TableCell>
                <TableCell>{cow.lot}</TableCell>
                <TableCell>{cow.location}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      cow.status === 'Prenha'
                        ? 'default'
                        : cow.status === 'Com cria'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {cow.status}
                  </Badge>
                </TableCell>
                <TableCell>
                   <Badge
                    variant={
                      cow.registrationStatus === 'Ativo'
                        ? 'default'
                        : 'destructive'
                    }
                    className={cow.registrationStatus === 'Ativo' ? 'bg-green-600' : ''}
                  >
                    {cow.registrationStatus}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="p-6">
        <PaginationComponent pageCount={10} />
      </div>
    </div>
  );
}
