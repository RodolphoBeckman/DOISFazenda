
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button"
import { PaginationComponent } from '@/components/pagination';
import { ArrowDownAZ, ArrowUpAZ, ChevronDown, FilterX, Search, PlusCircle, PencilRuler, Trash2 } from "lucide-react"
import { Input } from '@/components/ui/input';
import type { Birth } from '@/lib/data-schemas';
import { useData } from '@/contexts/data-context';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import EditBirthDialog from '@/components/edit-birth-dialog';
import BulkUpdateBirthDialog from '@/components/bulk-update-birth-dialog';

type ColumnKey = keyof Birth | 'id';
type SortDirection = 'asc' | 'desc' | null;

export default function BirthsPage() {
  const { births: allBirths, deleteBirth } = useData();
  const { toast } = useToast();
  const [isClient, setIsClient] = React.useState(false);
  const [filters, setFilters] = React.useState<Record<string, string[]>>({
     cowId: [], date: [], sex: [], farm: [], breed: [], sire: [], lot: [], location: [], observations: [], obs1: [], jvvo: []
  });
  const [sort, setSort] = React.useState<{ column: ColumnKey | null; direction: SortDirection }>({ column: null, direction: null });
  const [searchTerms, setSearchTerms] = React.useState<Record<string, string>>({
    cowId: '', date: '', sex: '', farm: '', breed: '', sire: '', lot: '', location: '', observations: '', obs1: '', jvvo: ''
  });
  
  const [selectedBirths, setSelectedBirths] = React.useState<string[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isBulkUpdateDialogOpen, setIsBulkUpdateDialogOpen] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [birthToDelete, setBirthToDelete] = React.useState<Birth | null>(null);
  const [selectedBirth, setSelectedBirth] = React.useState<Birth | null>(null);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleEditClick = (birth: Birth) => {
    setSelectedBirth(birth);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = (birth: Birth) => {
    setBirthToDelete(birth);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (birthToDelete?.id) {
      deleteBirth(birthToDelete.id);
      toast({
        title: "Nascimento Excluído",
        description: `O registro de nascimento da vaca ${birthToDelete.cowId} foi removido.`,
      });
      setIsAlertOpen(false);
      setBirthToDelete(null);
    }
  };

  const handleSelectBirth = (birthId: string | undefined) => {
    if (!birthId) return;
    setSelectedBirths(prev => {
      if (prev.includes(birthId)) {
        return prev.filter(id => id !== birthId);
      } else {
        return [...prev, birthId];
      }
    });
  };

  const handleSelectAllBirths = (filteredData: Birth[]) => {
     if (selectedBirths.length === filteredData.length) {
      setSelectedBirths([]);
    } else {
      setSelectedBirths(filteredData.map(b => b.id!).filter(Boolean));
    }
  }


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
            const itemValue = item[key as keyof Birth];
            // @ts-ignore
            if (key === 'date') {
                 // @ts-ignore
                 return values.includes(item.date ? new Date(item.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Data não informada');
            }
            return values.includes(String(itemValue));
        });
    });

    if (sort.column && sort.direction) {
      filteredData.sort((a, b) => {
        const aValue = a[sort.column! as keyof Birth];
        const bValue = b[sort.column! as keyof Birth];
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
    
    let uniqueValues;
    if (column === 'date') {
       uniqueValues = Array.from(new Set(dataSet.map(item => item.date ? new Date(item.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Data não informada'))).sort((a, b) => {
        if (a === 'Data não informada') return 1;
        if (b === 'Data não informada') return -1;
        // @ts-ignore
        return new Date(b.split('/').reverse().join('-')) - new Date(a.split('/').reverse().join('-'));
       });
    } else {
        // @ts-ignore
       uniqueValues = Array.from(new Set(dataSet.map(item => item[column as keyof Birth]))).sort();
    }
    
    if (!searchTerm) return uniqueValues;
    // @ts-ignore
    return uniqueValues.filter(value => value && String(value).toLowerCase().includes(searchTerm));
  };
  
  const clearFilter = (column: ColumnKey) => {
    setFilters(prev => ({ ...prev, [column]: [] }));
  };

  const selectAll = (column: ColumnKey, allValues: string[]) => {
    setFilters(prev => ({ ...prev, [column]: allValues }));
  }

  const renderFilterableHeader = (column: ColumnKey, label: string, dataSet: Birth[]) => {
    const uniqueValues = getUniqueValues(dataSet, column);
    let allUniqueValuesForSelectAll;

     if (column === 'date') {
        allUniqueValuesForSelectAll = Array.from(new Set(dataSet.map(item => item.date ? new Date(item.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Data não informada'))).filter(Boolean).sort();
    } else {
       // @ts-ignore
       allUniqueValuesForSelectAll = Array.from(new Set(dataSet.map(item => String(item[column as keyof Birth])))).filter(Boolean).sort();
    }

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


  const farms = Array.from(new Set(allBirths.map(b => b.farm).filter(Boolean) as string[]));

  const filteredDataForAll = getFilteredAndSortedData(allBirths);

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Registro de Nascimentos
        </h1>
        <div className="flex items-center gap-2">
            <Button onClick={() => setIsBulkUpdateDialogOpen(true)} disabled={selectedBirths.length === 0}>
                <PencilRuler />
                <span>Alterar em Massa ({selectedBirths.length})</span>
            </Button>
            <Button asChild>
                <Link href="/births/new">
                <PlusCircle /> 
                <span>Novo Nascimento</span>
                </Link>
            </Button>
        </div>
      </div>
      
      {isClient && (
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          {farms.map(farm => (
            <TabsTrigger key={farm} value={farm}>{farm}</TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all">
            <CardWithTable 
              title="Todos os Nascimentos" 
              data={filteredDataForAll} 
              allData={allBirths} 
              renderFilterableHeader={renderFilterableHeader}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
              selectedBirths={selectedBirths}
              onSelectBirth={handleSelectBirth}
              onSelectAllBirths={() => handleSelectAllBirths(filteredDataForAll)}
            />
        </TabsContent>
        {farms.map(farm => {
          const farmFilteredData = getFilteredAndSortedData(allBirths.filter(b => b.farm === farm));
          return (
            <TabsContent key={farm} value={farm}>
                <CardWithTable 
                  title={`Nascimentos em ${farm}`} 
                  data={farmFilteredData} 
                  allData={allBirths} 
                  renderFilterableHeader={renderFilterableHeader} 
                  onEditClick={handleEditClick}
                  onDeleteClick={handleDeleteClick}
                  selectedBirths={selectedBirths}
                  onSelectBirth={handleSelectBirth}
                  onSelectAllBirths={() => handleSelectAllBirths(farmFilteredData)}
                />
            </TabsContent>
          )
        })}
      </Tabs>
      )}
       <EditBirthDialog
        birth={selectedBirth}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
       <BulkUpdateBirthDialog
        isOpen={isBulkUpdateDialogOpen}
        onClose={() => setIsBulkUpdateDialogOpen(false)}
        birthsToUpdate={selectedBirths}
        onSuccess={() => setSelectedBirths([])}
      />
       <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o registro de nascimento da vaca
              <span className="font-bold"> Nº {birthToDelete?.cowId}</span> do dia {birthToDelete?.date?.toLocaleDateString('pt-BR')}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBirthToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

interface CardWithTableProps {
  title: string;
  data: Birth[];
  allData: Birth[];
  renderFilterableHeader: (column: ColumnKey, label: string, data: Birth[]) => React.ReactNode;
  onEditClick: (birth: Birth) => void;
  onDeleteClick: (birth: Birth) => void;
  selectedBirths: string[];
  onSelectBirth: (birthId: string | undefined) => void;
  onSelectAllBirths: () => void;
}


function CardWithTable({ title, data, allData, renderFilterableHeader, onEditClick, onDeleteClick, selectedBirths, onSelectBirth, onSelectAllBirths }: CardWithTableProps) {
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
                 <TableHead className="w-[50px]">
                    <Checkbox
                        checked={data.length > 0 && selectedBirths.length === data.length}
                        onCheckedChange={onSelectAllBirths}
                        aria-label="Selecionar todas as linhas"
                    />
                </TableHead>
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
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((birth, index) => (
                <TableRow 
                  key={birth.id || `${birth.cowId}-${index}`}
                  data-state={birth.id && selectedBirths.includes(birth.id) ? "selected" : ""}
                >
                   <TableCell>
                      <Checkbox
                          checked={birth.id ? selectedBirths.includes(birth.id) : false}
                          onCheckedChange={() => onSelectBirth(birth.id)}
                          aria-label={`Selecionar linha ${index + 1}`}
                          disabled={!birth.id}
                      />
                  </TableCell>
                  <TableCell className="font-medium">{birth.cowId}</TableCell>
                  <TableCell>
                    {birth.sex ? (
                      <Badge
                        variant={
                           birth.sex === 'Aborto'
                            ? 'destructive'
                            : birth.sex === 'Macho'
                            ? 'secondary'
                            : birth.sex === 'Fêmea'
                            ? 'default'
                            : 'outline'
                        }
                      >
                        {birth.sex}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Não Definido</Badge>
                    )}
                  </TableCell>
                  <TableCell>{birth.breed || '-'}</TableCell>
                  <TableCell>{birth.sire || '-'}</TableCell>
                  <TableCell>{birth.date ? new Date(birth.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Data não informada'}</TableCell>
                  <TableCell>{birth.lot || '-'}</TableCell>
                  <TableCell>{birth.obs1 || '-'}</TableCell>
                  <TableCell>{birth.jvvo || '-'}</TableCell>
                  <TableCell>{birth.farm || '-'}</TableCell>
                  <TableCell>{birth.location || '-'}</TableCell>
                   <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <Button variant="ghost" size="icon" onClick={() => onEditClick(birth)}>
                          <PencilRuler className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteClick(birth)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </TableCell>
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
