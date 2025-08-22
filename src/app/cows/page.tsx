
"use client"

import * as React from 'react';
import Link from "next/link";
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
import { ArrowDownAZ, ArrowUpAZ, ChevronDown, FilterX, PlusCircle, Search } from "lucide-react"
import { Input } from '@/components/ui/input';
import { useData } from '@/contexts/data-context';
import type { Cow } from '@/lib/data-schemas';


type ColumnKey = keyof Cow;
type SortDirection = 'asc' | 'desc' | null;

export default function CowsPage() {
  const { data: allCows } = useData();
  const [filters, setFilters] = React.useState<Record<ColumnKey, string[]>>({
    id: [], animal: [], origem: [], farm: [], lot: [], location: [], status: [], registrationStatus: [], loteT: [], obs1: [], motivoDoDescarte: [], mes: [], ano: []
  });
  const [sort, setSort] = React.useState<{ column: ColumnKey | null; direction: SortDirection }>({ column: null, direction: null });
  const [searchTerms, setSearchTerms] = React.useState<Record<ColumnKey, string>>({
    id: '', animal: '', origem: '', farm: '', lot: '', location: '', status: '', registrationStatus: '', loteT: '', obs1: '', motivoDoDescarte: '', mes: '', ano: ''
  });
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);


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

  const getFilteredAndSortedData = (dataSet: Cow[]) => {
    let filteredData = dataSet.filter(item => {
        return Object.entries(filters).every(([key, values]) => {
            if (values.length === 0) return true;
            // @ts-ignore
            const itemValue = item[key as ColumnKey];
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
  
  const getUniqueValues = (dataSet: Cow[], column: ColumnKey) => {
    const searchTerm = searchTerms[column].toLowerCase();
    // @ts-ignore
    const uniqueValues = Array.from(new Set(dataSet.map(item => item[column]))).sort();
    if (!searchTerm) return uniqueValues;
    // @ts-ignore
    return uniqueValues.filter(value => String(value).toLowerCase().includes(searchTerm));
  };
  
  const clearFilter = (column: ColumnKey) => {
    setFilters(prev => ({ ...prev, [column]: [] }));
  };

  const selectAll = (column: ColumnKey, allValues: (string | undefined)[]) => {
    // @ts-ignore
    setFilters(prev => ({ ...prev, [column]: allValues.map(v => String(v)) }));
  }

  const renderFilterableHeader = (column: ColumnKey, label: string) => {
    const uniqueValues = getUniqueValues(allCows, column);
    // @ts-ignore
    const allUniqueValuesForSelectAll = Array.from(new Set(allCows.map(item => item[column]))).sort();

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
                        key={String(value)}
                        checked={filters[column].includes(String(value))}
                        onCheckedChange={() => handleFilterChange(column, String(value))}
                        >
                        {String(value) || '(Vazio)'}
                        </DropdownMenuCheckboxItem>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
        </TableHead>
    );
  }

  const statuses = Array.from(new Set(allCows.map(cow => cow.status))).filter(Boolean) as string[];


  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight font-headline">
            Gerenciar Vacas
        </h1>
        <Button asChild>
            <Link href="/cows/new">
              <PlusCircle /> 
              <span>Nova Vaca</span>
            </Link>
          </Button>
      </div>
     
      {isClient && (
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          {statuses.map(status => (
            <TabsTrigger key={status} value={status.toLowerCase().replace(' ', '-')}>{status}</TabsTrigger>

          ))}
        </TabsList>

        <TabsContent value="all">
          <CardWithTable title="Todas as Vacas" data={getFilteredAndSortedData(allCows)} renderFilterableHeader={renderFilterableHeader}/>
        </TabsContent>
        {statuses.map(status => (
            <TabsContent key={status} value={status.toLowerCase().replace(' ', '-')}>
                <CardWithTable
                    title={`Vacas ${status}`}
                    data={getFilteredAndSortedData(allCows.filter((c) => c.status === status))}
                    renderFilterableHeader={renderFilterableHeader}
                />
            </TabsContent>
        ))}
      </Tabs>
      )}
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {renderFilterableHeader('id', 'Brinco Nº')}
                {renderFilterableHeader('animal', 'Animal')}
                {renderFilterableHeader('loteT', 'Lote T.')}
                {renderFilterableHeader('origem', 'Origem')}
                {renderFilterableHeader('status', 'Status')}
                {renderFilterableHeader('obs1', 'Obs: 1')}
                {renderFilterableHeader('farm', 'Fazenda')}
                {renderFilterableHeader('motivoDoDescarte', 'Motivo do Descarte')}
                {renderFilterableHeader('mes', 'Mês')}
                {renderFilterableHeader('ano', 'Ano')}
                {renderFilterableHeader('location', 'Localização')}
                {renderFilterableHeader('registrationStatus', 'Status Cadastro')}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((cow) => (
                <TableRow key={cow.id}>
                  <TableCell className="font-medium">{cow.id}</TableCell>
                  <TableCell>{cow.animal}</TableCell>
                  <TableCell>{cow.loteT}</TableCell>
                  <TableCell>{cow.origem}</TableCell>
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
                  <TableCell>{cow.obs1}</TableCell>
                  <TableCell>{cow.farm}</TableCell>
                  <TableCell>{cow.motivoDoDescarte}</TableCell>
                  <TableCell>{cow.mes}</TableCell>
                  <TableCell>{cow.ano}</TableCell>
                  <TableCell>{cow.location}</TableCell>
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
      </div>
      <div className="p-6">
        <PaginationComponent pageCount={10} />
      </div>
    </div>
  );
}
