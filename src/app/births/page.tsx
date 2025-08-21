
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button"
import { PaginationComponent } from '@/components/pagination';
import { ArrowDownAZ, ArrowUpAZ, ChevronDown, FilterX, Search } from "lucide-react"
import { Input } from '@/components/ui/input';

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
type SortDirection = 'asc' | 'desc' | null;

export default function BirthsPage() {
  const [data, setData] = React.useState(allBirths);
  const [filters, setFilters] = React.useState<Record<ColumnKey, string[]>>({
    id: [], cowId: [], date: [], sex: [], farm: [], breed: [], sire: [], lot: [], location: [], observations: [],
  });
  const [sort, setSort] = React.useState<{ column: ColumnKey | null; direction: SortDirection }>({ column: null, direction: null });
  const [searchTerms, setSearchTerms] = React.useState<Record<ColumnKey, string>>({
    id: '', cowId: '', date: '', sex: '', farm: '', breed: '', sire: '', lot: '', location: '', observations: '',
  });

  const handleFilterChange = (column: ColumnKey, value: string) => {
    setFilters(prev => {
      const newColumnFilters = prev[column].includes(value)
        ? prev[column].filter(v => v !== value)
        : [...prev[column], value];
      return { ...prev, [column]: newColumnFilters };
    });
  };

  const handleSort = (column: ColumnKey) => {
    setSort(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSearchChange = (column: ColumnKey, term: string) => {
    setSearchTerms(prev => ({ ...prev, [column]: term }));
  };

  const getFilteredAndSortedData = (dataSet: Birth[]) => {
    let filteredData = dataSet.filter(item => {
        return Object.entries(filters).every(([key, values]) => {
            if (values.length === 0) return true;
            const itemValue = item[key as ColumnKey];
            return values.includes(itemValue);
        });
    });

    if (sort.column && sort.direction) {
      filteredData.sort((a, b) => {
        const aValue = a[sort.column!];
        const bValue = b[sort.column!];
        if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredData;
  };
  
  const getUniqueValues = (dataSet: Birth[], column: ColumnKey) => {
    const searchTerm = searchTerms[column].toLowerCase();
    const uniqueValues = Array.from(new Set(dataSet.map(item => item[column]))).sort();
    if (!searchTerm) return uniqueValues;
    return uniqueValues.filter(value => value.toLowerCase().includes(searchTerm));
  };
  
  const clearFilter = (column: ColumnKey) => {
    setFilters(prev => ({ ...prev, [column]: [] }));
  };

  const selectAll = (column: ColumnKey, allValues: string[]) => {
    setFilters(prev => ({ ...prev, [column]: allValues }));
  }

  const renderFilterableHeader = (column: ColumnKey, label: string, dataSet: Birth[]) => {
    const uniqueValues = getUniqueValues(dataSet, column);
    const allUniqueValuesForSelectAll = Array.from(new Set(dataSet.map(item => item[column]))).sort();

    return (
        <TableHead>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
                <span>{label}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-60">
                <DropdownMenuItem onClick={() => handleSort(column)}>
                    <ArrowDownAZ className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                    Ascendente
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort(column)}>
                    <ArrowUpAZ className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                    Descendente
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => clearFilter(column)}>
                    <FilterX className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                    Limpar Filtro
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="p-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Pesquisar..."
                            className="pl-8"
                            value={searchTerms[column]}
                            onChange={(e) => handleSearchChange(column, e.target.value)}
                        />
                    </div>
                </div>
                 <DropdownMenuCheckboxItem
                    checked={filters[column].length === allUniqueValuesForSelectAll.length}
                    onCheckedChange={() => {
                        if (filters[column].length === allUniqueValuesForSelectAll.length) {
                            clearFilter(column);
                        } else {
                            selectAll(column, allUniqueValuesForSelectAll);
                        }
                    }}
                >
                    (Selecionar Tudo)
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <div className="max-h-40 overflow-y-auto">
                    {uniqueValues.map(value => (
                        <DropdownMenuCheckboxItem
                        key={value}
                        checked={filters[column].includes(value)}
                        onCheckedChange={() => handleFilterChange(column, value)}
                        >
                        {value || '(Vazio)'}
                        </DropdownMenuCheckboxItem>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
        </TableHead>
    );
  }


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
            <CardWithTable title="Todos os Nascimentos" data={getFilteredAndSortedData(allBirths)} allData={allBirths} renderFilterableHeader={renderFilterableHeader} />
        </TabsContent>
        {farms.map(farm => (
            <TabsContent key={farm} value={farm}>
                <CardWithTable title={`Nascimentos em ${farm}`} data={getFilteredAndSortedData(allBirths.filter(b => b.farm === farm))} allData={allBirths} renderFilterableHeader={renderFilterableHeader} />
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
        <div className="overflow-x-auto">
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
                  <TableCell className="max-w-[200px] truncate">{birth.observations || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="p-6">
        <PaginationComponent pageCount={5} />
      </div>
    </div>
  );
}

    