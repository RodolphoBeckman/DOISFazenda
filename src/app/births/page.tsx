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

const allBirths = [
    { id: 'NASC-001', cowId: 'VACA-001', date: '2024-03-15', sex: 'Macho', farm: 'São Francisco', breed: 'Nelore', sire: 'Touro A', lot: 'Lote 1', location: 'Pasto da Represa', observations: 'Parto normal' },
    { id: 'NASC-002', cowId: 'VACA-003', date: '2024-03-18', sex: 'Fêmea', farm: 'Dois', breed: 'Angus', sire: 'Touro B', lot: 'D-B', location: 'Pasto do Meio', observations: '' },
    { id: 'NASC-003', cowId: 'VACA-006', date: '2024-03-20', sex: 'Macho', farm: 'Dois', breed: 'Nelore', sire: 'Comprou Prenha', lot: 'D-B', location: 'Pasto da Represa', observations: 'Parto assistido' },
    { id: 'NASC-004', cowId: 'VACA-009', date: '2024-04-01', sex: 'Fêmea', farm: 'Dois', breed: 'Nelore', sire: 'Touro C', lot: 'Lote 2', location: 'Pasto Novo', observations: '' },
    { id: 'NASC-005', cowId: 'VACA-011', date: '2024-04-05', sex: 'Macho', farm: 'Segredo', breed: 'Angus', sire: 'Comprou Prenha', lot: 'Lote 3', location: 'Pasto da Sede', observations: '' },
    { id: 'NASC-006', cowId: 'VACA-012', date: '2024-04-10', sex: 'Macho', farm: 'São Francisco', breed: 'Nelore', sire: 'Touro A', lot: 'Lote 1', location: 'Pasto da Represa', observations: '' },
    { id: 'NASC-007', cowId: 'VACA-015', date: '2024-04-12', sex: 'Fêmea', farm: 'Segredo', breed: 'Angus', sire: 'Touro D', lot: 'Lote 3', location: 'Pasto da Sede', observations: 'Gêmeos' },
    { id: 'NASC-008', cowId: 'VACA-018', date: '2024-04-22', sex: 'Fêmea', farm: 'Dois', breed: 'Nelore', sire: 'Comprou Prenha', lot: 'D-B', location: 'Pasto do Meio', observations: '' },
    { id: 'NASC-009', cowId: 'VACA-021', date: '2024-05-01', sex: 'Macho', farm: 'São Francisco', breed: 'Nelore', sire: 'Touro A', lot: 'Lote 1', location: 'Pasto da Represa', observations: '' },
    { id: 'NASC-010', cowId: 'VACA-025', date: '2024-05-03', sex: 'Fêmea', farm: 'Segredo', breed: 'Angus', sire: 'Touro D', lot: 'Lote 3', location: 'Pasto da Sede', observations: '' },
];

type Birth = typeof allBirths[0];
type ColumnKey = keyof Birth;

export default function BirthsPage() {
  const [filters, setFilters] = React.useState<Record<ColumnKey, string[]>>({
    id: [], cowId: [], date: [], sex: [], farm: [], breed: [], sire: [], lot: [], location: [], observations: [],
  });

  const handleFilterChange = (column: ColumnKey, value: string) => {
    setFilters(prev => {
      const newColumnFilters = prev[column].includes(value)
        ? prev[column].filter(v => v !== value)
        : [...prev[column], value];
      return { ...prev, [column]: newColumnFilters };
    });
  };
  
  const getFilteredData = (data: Birth[]) => {
    return data.filter(item => {
        return Object.entries(filters).every(([key, values]) => {
            if (values.length === 0) return true;
            const itemValue = item[key as ColumnKey];
            return values.includes(itemValue);
        });
    });
  };

  const getUniqueValues = (data: Birth[], column: ColumnKey) => {
    return Array.from(new Set(data.map(item => item[column]))).sort();
  };

  const renderFilterableHeader = (column: ColumnKey, label: string, data: Birth[]) => (
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
          {getUniqueValues(data, column).map(value => (
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

  const farms = ['São Francisco', 'Segredo', 'Dois'];

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h1 className="text-3xl font-bold tracking-tight font-headline">
        Registro de Nascimentos
      </h1>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          {farms.map(farm => (
            <TabsTrigger key={farm} value={farm}>{farm}</TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all">
            <CardWithTable title="Todos os Nascimentos" data={getFilteredData(allBirths)} allData={allBirths} renderFilterableHeader={renderFilterableHeader} />
        </TabsContent>
        {farms.map(farm => (
            <TabsContent key={farm} value={farm}>
                <CardWithTable title={`Nascimentos em ${farm}`} data={getFilteredData(allBirths.filter(b => b.farm === farm))} allData={allBirths} renderFilterableHeader={renderFilterableHeader} />
            </TabsContent>
        ))}
      </Tabs>
    </main>
  );
}


function CardWithTable({ title, data, allData, renderFilterableHeader }: { title: string; data: Birth[], allData: Birth[], renderFilterableHeader: (column: ColumnKey, label: string, data: Birth[]) => React.ReactNode }) {
  return (
    <div className="border bg-card text-card-foreground shadow-sm rounded-lg mt-4">
      <div className="p-6">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      </div>
      <div className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {renderFilterableHeader('cowId', 'Brinco Mãe', allData)}
              {renderFilterableHeader('sex', 'Sexo Bezerro', allData)}
              {renderFilterableHeader('breed', 'Raça Bezerro', allData)}
              {renderFilterableHeader('sire', 'Nome do Pai', allData)}
              {renderFilterableHeader('date', 'Data Nasc.', allData)}
              {renderFilterableHeader('lot', 'Lote', allData)}
              {renderFilterableHeader('farm', 'Fazenda', allData)}
              {renderFilterableHeader('location', 'Localização', allData)}
              {renderFilterableHeader('observations', 'Observações', allData)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((birth) => (
              <TableRow key={birth.id}>
                <TableCell className="font-medium">{birth.cowId}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      birth.sex === 'Macho'
                        ? 'secondary'
                        : 'default'
                    }
                  >
                    {birth.sex}
                  </Badge>
                </TableCell>
                <TableCell>{birth.breed}</TableCell>
                <TableCell>{birth.sire}</TableCell>
                <TableCell>{new Date(birth.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                <TableCell>{birth.lot}</TableCell>
                <TableCell>{birth.farm}</TableCell>
                <TableCell>{birth.location}</TableCell>
                <TableCell className="max-w-[200px] truncate">{birth.observations}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="p-6">
        <PaginationComponent pageCount={5} />
      </div>
    </div>
  );
}
