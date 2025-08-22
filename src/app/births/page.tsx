
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
import type { Birth } from '@/lib/data-schemas';
import { useData } from '@/contexts/data-context';

type ColumnKey = keyof Birth;
type SortDirection = 'asc' | 'desc' | null;

export default function BirthsPage() {
  const { births: allBirths } = useData();
  const [filters, setFilters] = React.useState<Record<string, string[]>>({
     cowId: [], date: [], sex: [], farm: [], breed: [], sire: [], lot: [], location: [], observations: [], obs1: [], jvvo: []
  });
  const [sort, setSort] = React.useState<{ column: ColumnKey | null; direction: SortDirection }>({ column: null, direction: null });
  const [searchTerms, setSearchTerms] = React.useState<Record<string, string>>({
    cowId: '', date: '', sex: '', farm: '', breed: '', sire: '', lot: '', location: '', observations: '', obs1: '', jvvo: ''
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
            // @ts-ignore
            return values.includes(itemValue);
        });
    });

    if (sort.column && sort.direction) {
      filteredData.sort((a, b) => {
        const aValue = a[sort.column!];
        const bValue = b[sort.column!];
        // @ts-ignore
        if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
        // @ts-ignore
        if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredData;
  };
  
  const getUniqueValues = (dataSet: Birth[], column: ColumnKey) => {
    const searchTerm = searchTerms[column].toLowerCase();
    // @ts-ignore
    const uniqueValues = Array.from(new Set(dataSet.map(item => item[column]))).sort();
    if (!searchTerm) return uniqueValues;
    // @ts-ignore
    return uniqueValues.filter(value => value && value.toLowerCase().includes(searchTerm));
  };
  
  const clearFilter = (column: ColumnKey) => {
    setFilters(prev => ({ ...prev, [column]: [] }));
  };

  const selectAll = (column: ColumnKey, allValues: string[]) => {
    setFilters(prev => ({ ...prev, [column]: allValues }));
  }

  const renderFilterableHeader = (column: ColumnKey, label: string, dataSet: Birth[]) => {
    const uniqueValues = getUniqueValues(dataSet, column);
    // @ts-ignore
    const allUniqueValuesForSelectAll = Array.from(new Set(dataSet.map(item => item[column]))).filter(Boolean).sort();

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
                    checked={filters[column].length === allUniqueValuesForSelectAll.length && allUniqueValuesForSelectAll.length > 0}
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
                        // @ts-ignore
                        key={value}
                        // @ts-ignore
                        checked={filters[column].includes(value)}
                        // @ts-ignore
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


  const farms = Array.from(new Set(allBirths.map(b => b.farm)));

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
                {renderFilterableHeader('cowId', 'Brinco Nº', allData)}
                {renderFilterableHeader('sex', 'Sexo do Bezerro', allData)}
                {renderFilterableHeader('breed', 'Raça do Bezerro', allData)}
                {renderFilterableHeader('sire', 'Nome do Pai', allData)}
                {renderFilterableHeader('date', 'Data Nascimento', allData)}
                {renderFilterableHeader('lot', 'Lote', allData)}
                {renderFilterableHeader('obs1', 'Obs: 1', allData)}
                {renderFilterableHeader('jvvo', 'JV - Vo', allData)}
                {renderFilterableHeader('farm', 'Fazenda', allData)}
                {renderFilterableHeader('location', 'Localização', allData)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((birth, index) => (
                <TableRow key={index}>
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
                  <TableCell>{birth.obs1 || '-'}</TableCell>
                  <TableCell>{birth.jvvo || '-'}</TableCell>
                  <TableCell>{birth.farm}</TableCell>
                  <TableCell>{birth.location}</TableCell>
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

    