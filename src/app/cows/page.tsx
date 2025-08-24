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
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from "@/components/ui/button"
import { PaginationComponent } from '@/components/pagination';
import { ArrowDownAZ, ArrowUpAZ, ChevronDown, FilterX, PencilRuler, PlusCircle, Search, Trash2, Archive, Users, GitCommitVertical, GitBranch, Download, Heart } from "lucide-react"
import { Input } from '@/components/ui/input';
import { useData } from '@/contexts/data-context';
import type { Cow } from '@/lib/data-schemas';
import EditCowDialog from '@/components/edit-cow-dialog';
import DiscardCowDialog from '@/components/discard-cow-dialog';
import BulkUpdateLotDialog from '@/components/bulk-update-lot-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as xlsx from 'xlsx';


type ColumnKey = keyof Cow;
type SortDirection = 'asc' | 'desc' | null;

export default function CowsPage() {
  const { data: allCows, deleteCow, addBirth } = useData();
  const { toast } = useToast();

  const [filters, setFilters] = React.useState<Record<ColumnKey, string[]>>({
    id: [], animal: [], origem: [], farm: [], lot: [], location: [], status: [], registrationStatus: [], loteT: [], obs1: [], motivoDoDescarte: [], mes: [], ano: []
  });
  const [sort, setSort] = React.useState<{ column: ColumnKey | null; direction: SortDirection }>({ column: null, direction: null });
  const [searchTerms, setSearchTerms] = React.useState<Record<ColumnKey, string>>({
    id: '', animal: '', origem: '', farm: '', lot: '', location: '', status: '', registrationStatus: '', loteT: '', obs1: '', motivoDoDescarte: '', mes: '', ano: ''
  });
  const [isClient, setIsClient] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = React.useState(false);
  const [isBulkUpdateDialogOpen, setIsBulkUpdateDialogOpen] = React.useState(false);
  const [selectedCow, setSelectedCow] = React.useState<Cow | null>(null);
  const [selectedCows, setSelectedCows] = React.useState<string[]>([]);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false);
  const [isBirthAlertOpen, setIsBirthAlertOpen] = React.useState(false);
  const [cowToDelete, setCowToDelete] = React.useState<Cow | null>(null);
  const [cowForBirth, setCowForBirth] = React.useState<Cow | null>(null);
  const [activeTab, setActiveTab] = React.useState('all');
  
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const animalCounts = React.useMemo(() => {
    return allCows.reduce((acc, cow) => {
      const animalType = cow.animal?.toLowerCase() || 'vaca';
      if (animalType.includes('bezerro')) {
        acc.bezerros++;
      } else if (animalType.includes('bezerra')) {
        acc.bezerras++;
      } else {
        acc.vacas++;
      }
      return acc;
    }, { vacas: 0, bezerros: 0, bezerras: 0 });
  }, [allCows]);


  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleEditClick = (cow: Cow) => {
    setSelectedCow(cow);
    setIsEditDialogOpen(true);
  };
  
  const handleDiscardClick = (cow: Cow) => {
    setSelectedCow(cow);
    setIsDiscardDialogOpen(true);
  };

  const handleDeleteClick = (cow: Cow) => {
    setCowToDelete(cow);
    setIsDeleteAlertOpen(true);
  };
  
  const handleCreatePregnancyClick = (cow: Cow) => {
    setCowForBirth(cow);
    setIsBirthAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (cowToDelete) {
      deleteCow(cowToDelete.id);
      toast({
        title: "Vaca Excluída",
        description: `A vaca com brinco Nº ${cowToDelete.id} foi removida.`,
      });
      setIsDeleteAlertOpen(false);
      setCowToDelete(null);
    }
  };

  const handleConfirmPregnancy = () => {
    if (cowForBirth) {
      addBirth({
        cowId: cowForBirth.id,
        farm: cowForBirth.farm,
        lot: cowForBirth.lot,
        location: cowForBirth.location,
        sex: "Não Definido",
        animal: "Prenhez",
      });
      toast({
        title: "Prenhez Registrada!",
        description: `Uma nova prenhez foi criada para a vaca Nº ${cowForBirth.id}.`,
      });
      setIsBirthAlertOpen(false);
      setCowForBirth(null);
    }
  };


  const handleSelectCow = (cowId: string) => {
    setSelectedCows(prev =>
      prev.includes(cowId)
        ? prev.filter(id => id !== cowId)
        : [...prev, cowId]
    );
  };

  const handleSelectAllCows = (filteredData: Cow[]) => {
    if (selectedCows.length === filteredData.length) {
      setSelectedCows([]);
    } else {
      setSelectedCows(filteredData.map(cow => cow.id));
    }
  };


  const handleFilterChange = (column: ColumnKey, value: string) => {
    setCurrentPage(1);
    setFilters(prev => {
      const newColumnFilters = prev[column].includes(value)
        ? prev[column].filter(v => v !== value)
        : [...prev[column], value];
      return { ...prev, [column]: newColumnFilters };
    });
  };

  const handleSort = (column: ColumnKey) => {
    setCurrentPage(1);
    setSort(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  const handleSearchChange = (column: ColumnKey, term: string) => {
    setCurrentPage(1);
    setSearchTerms(prev => ({ ...prev, [column]: term }));
  };

  const getFilteredAndSortedData = React.useCallback((dataSet: Cow[]) => {
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
        
        if (sort.column === 'id') {
             const numA = parseInt(aValue, 10);
             const numB = parseInt(bValue, 10);
             if (numA < numB) return sort.direction === 'asc' ? -1 : 1;
             if (numA > numB) return sort.direction === 'asc' ? 1 : -1;
             return 0;
        }

        // @ts-ignore
        if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
        // @ts-ignore
        if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredData;
  }, [filters, sort]);
  
  const getUniqueValues = (dataSet: Cow[], column: ColumnKey) => {
    const searchTerm = searchTerms[column].toLowerCase();
    // @ts-ignore
    const uniqueValues = Array.from(new Set(dataSet.map(item => item[column]))).sort();
    if (!searchTerm) return uniqueValues;
    // @ts-ignore
    return uniqueValues.filter(value => String(value).toLowerCase().includes(searchTerm));
  };
  
  const clearFilter = (column: ColumnKey) => {
    setCurrentPage(1);
    setFilters(prev => ({ ...prev, [column]: [] }));
  };

  const selectAll = (column: ColumnKey, allValues: (string | undefined)[]) => {
    setCurrentPage(1);
    // @ts-ignore
    setFilters(prev => ({ ...prev, [column]: allValues.filter(Boolean).map(v => String(v)) }));
  }

  const handleExport = (dataToExport: Cow[]) => {
    if (dataToExport.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhum dado para exportar",
        description: "A tabela atual está vazia ou os filtros não retornaram resultados.",
      });
      return;
    }
    
    const worksheet = xlsx.utils.json_to_sheet(dataToExport);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Vacas");
    xlsx.writeFile(workbook, "vacas.xlsx");

    toast({
        title: "Exportação Concluída!",
        description: `${dataToExport.length} registros foram exportados para vacas.xlsx`,
    });
  };

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
                    checked={filters[column].length === allUniqueValuesForSelectAll.filter(Boolean).length && allUniqueValuesForSelectAll.filter(Boolean).length > 0}
                    onCheckedChange={() => {
                        if (filters[column].length === allUniqueValuesForSelectAll.filter(Boolean).length) {
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
                    {uniqueValues.map((value, index) => (
                        <DropdownMenuCheckboxItem
                        key={`${String(value)}-${index}`}
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

  const filteredData = React.useMemo(() => getFilteredAndSortedData(allCows), [allCows, getFilteredAndSortedData]);
  
  const paginatedData = React.useMemo(() => {
    return rowsPerPage > 0 ? filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage) : filteredData;
  }, [filteredData, currentPage, rowsPerPage]);
  
  const pageCount = React.useMemo(() => {
    return rowsPerPage > 0 ? Math.ceil(filteredData.length / rowsPerPage) : 1;
  }, [filteredData, rowsPerPage]);
  
  const dataForActiveTab = React.useMemo(() => {
    if (activeTab === 'all') {
      return filteredData;
    }
    return getFilteredAndSortedData(allCows.filter(cow => cow.status === activeTab));
  }, [activeTab, allCows, getFilteredAndSortedData, filteredData]);


  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight font-headline">
            Gerenciar Vacas
        </h1>
        <div className="flex items-center gap-2">
            <Button onClick={() => handleExport(dataForActiveTab)}>
                <Download />
                <span>Exportar</span>
            </Button>
            <Button onClick={() => setIsBulkUpdateDialogOpen(true)} disabled={selectedCows.length === 0}>
                <PencilRuler />
                <span>Alterar Lote ({selectedCows.length})</span>
            </Button>
            <Button asChild>
                <Link href="/cows/new">
                <PlusCircle /> 
                <span>Nova Vaca</span>
                </Link>
            </Button>
        </div>
      </div>
      
      {isClient && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Vacas</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{animalCounts.vacas}</div>
                <p className="text-xs text-muted-foreground">Total de matrizes no rebanho</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Bezerros</CardTitle>
                <GitCommitVertical className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{animalCounts.bezerros}</div>
                 <p className="text-xs text-muted-foreground">Total de machos jovens</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Bezerras</CardTitle>
                <GitBranch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{animalCounts.bezerras}</div>
                <p className="text-xs text-muted-foreground">Total de fêmeas jovens</p>
              </CardContent>
            </Card>
          </div>
         
          <Tabs defaultValue="all" onValueChange={(value) => {setCurrentPage(1); setActiveTab(value)}}>
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              {statuses.map(status => (
                <TabsTrigger key={status} value={status}>{status}</TabsTrigger>

              ))}
            </TabsList>

            <TabsContent value="all">
              <CardWithTable 
                title="Todas as Vacas" 
                data={paginatedData}
                fullDataCount={filteredData.length}
                renderFilterableHeader={renderFilterableHeader} 
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
                onDiscardClick={handleDiscardClick}
                onCreatePregnancyClick={handleCreatePregnancyClick}
                selectedCows={selectedCows}
                onSelectCow={handleSelectCow}
                onSelectAllCows={() => handleSelectAllCows(filteredData)}
                currentPage={currentPage}
                pageCount={pageCount}
                onPageChange={setCurrentPage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(value) => {
                  setRowsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              />
            </TabsContent>
            {statuses.map(status => {
                const statusFilteredData = getFilteredAndSortedData(allCows.filter((c) => c.status === status));
                const statusPaginatedData = rowsPerPage > 0 ? statusFilteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage) : statusFilteredData;
                const statusPageCount = rowsPerPage > 0 ? Math.ceil(statusFilteredData.length / rowsPerPage) : 1;

                return (
                    <TabsContent key={status} value={status}>
                        <CardWithTable
                            title={`Vacas ${status}`}
                            data={statusPaginatedData}
                            fullDataCount={statusFilteredData.length}
                            renderFilterableHeader={renderFilterableHeader}
                            onEditClick={handleEditClick}
                            onDeleteClick={handleDeleteClick}
                            onDiscardClick={handleDiscardClick}
                            onCreatePregnancyClick={handleCreatePregnancyClick}
                            selectedCows={selectedCows}
                            onSelectCow={handleSelectCow}
                            onSelectAllCows={() => handleSelectAllCows(statusFilteredData)}
                            currentPage={currentPage}
                            pageCount={statusPageCount}
                            onPageChange={setCurrentPage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(value) => {
                                setRowsPerPage(Number(value));
                                setCurrentPage(1);
                            }}
                        />
                    </TabsContent>
                )
            })}
          </Tabs>
        </>
      )}
       <EditCowDialog
        cow={selectedCow}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
      <DiscardCowDialog
        cow={selectedCow}
        isOpen={isDiscardDialogOpen}
        onClose={() => setIsDiscardDialogOpen(false)}
      />
      <BulkUpdateLotDialog
        isOpen={isBulkUpdateDialogOpen}
        onClose={() => setIsBulkUpdateDialogOpen(false)}
        cowIds={selectedCows}
        onSuccess={() => setSelectedCows([])}
      />
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o registro da vaca com brinco
              <span className="font-bold"> Nº {cowToDelete?.id}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCowToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={isBirthAlertOpen} onOpenChange={setIsBirthAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Prenhez</AlertDialogTitle>
            <AlertDialogDescription>
               Deseja realmente registrar uma nova prenhez para a vaca com brinco
              <span className="font-bold"> Nº {cowForBirth?.id}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCowForBirth(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPregnancy}>Sim, Registrar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

interface CardWithTableProps {
    title: string;
    data: Cow[];
    fullDataCount: number;
    renderFilterableHeader: (column: ColumnKey, label: string) => React.ReactNode;
    onEditClick: (cow: Cow) => void;
    onDeleteClick: (cow: Cow) => void;
    onDiscardClick: (cow: Cow) => void;
    onCreatePregnancyClick: (cow: Cow) => void;
    selectedCows: string[];
    onSelectCow: (cowId: string) => void;
    onSelectAllCows: () => void;
    currentPage: number;
    pageCount: number;
    onPageChange: (page: number) => void;
    rowsPerPage: number;
    onRowsPerPageChange: (value: string) => void;
}

function CardWithTable({ 
    title, 
    data, 
    fullDataCount,
    renderFilterableHeader, 
    onEditClick, 
    onDeleteClick, 
    onDiscardClick,
    onCreatePregnancyClick,
    selectedCows, 
    onSelectCow, 
    onSelectAllCows,
    currentPage,
    pageCount,
    onPageChange,
    rowsPerPage,
    onRowsPerPageChange
}: CardWithTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
       <div className="relative w-full overflow-auto">
          <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                      <Checkbox
                          checked={data.length > 0 && selectedCows.length === data.length}
                          onCheckedChange={onSelectAllCows}
                          aria-label="Selecionar todas as linhas"
                      />
                  </TableHead>
                  {renderFilterableHeader('id', 'Brinco Nº')}
                  {renderFilterableHeader('animal', 'Animal')}
                  {renderFilterableHeader('origem', 'Origem')}
                  {renderFilterableHeader('lot', 'Lote')}
                  {renderFilterableHeader('obs1', 'Obs: 1')}
                  {renderFilterableHeader('farm', 'Fazenda')}
                  {renderFilterableHeader('location', 'Localização')}
                  {renderFilterableHeader('motivoDoDescarte', 'Motivo do Descarte')}
                  {renderFilterableHeader('mes', 'Mês')}
                  {renderFilterableHeader('ano', 'Ano')}
                  {renderFilterableHeader('registrationStatus', 'Status do Cadastro')}
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((cow, index) => (
                  <TableRow key={`${cow.id}-${index}`} data-state={selectedCows.includes(cow.id) ? "selected" : ""}>
                    <TableCell>
                        <Checkbox
                            checked={selectedCows.includes(cow.id)}
                            onCheckedChange={() => onSelectCow(cow.id)}
                            aria-label={`Selecionar linha ${index + 1}`}
                        />
                    </TableCell>
                    <TableCell className="font-medium">{cow.id}</TableCell>
                    <TableCell>{cow.animal}</TableCell>
                    <TableCell>{cow.origem}</TableCell>
                    <TableCell>{cow.lot}</TableCell>
                    <TableCell>{cow.obs1 || '-'}</TableCell>
                    <TableCell>{cow.farm}</TableCell>
                    <TableCell>{cow.location}</TableCell>
                    <TableCell>{cow.motivoDoDescarte || '-'}</TableCell>
                    <TableCell>{cow.mes || '-'}</TableCell>
                    <TableCell>{cow.ano || '-'}</TableCell>
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
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <Button variant="ghost" size="icon" title="Registrar Prenhez" onClick={() => onCreatePregnancyClick(cow)}>
                            <Heart className="h-4 w-4" />
                            <span className="sr-only">Registrar Prenhez</span>
                        </Button>
                        <Button variant="ghost" size="icon" title="Editar Vaca" onClick={() => onEditClick(cow)}>
                            <PencilRuler className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                        </Button>
                          <Button variant="ghost" size="icon" title="Descartar Vaca" onClick={() => onDiscardClick(cow)} disabled={cow.registrationStatus === 'Inativo'}>
                            <Archive className="h-4 w-4" />
                            <span className="sr-only">Descartar</span>
                        </Button>
                        <Button variant="ghost" size="icon" title="Excluir Vaca" onClick={() => onDeleteClick(cow)}>
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
      </CardContent>
       <CardFooter className="flex items-center justify-between p-4 border-t">
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Linhas por página:</span>
                <Select value={`${rowsPerPage}`} onValueChange={(value) => {
                  onRowsPerPageChange(value);
                  onPageChange(1);
                }}>
                    <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder={`${rowsPerPage}`} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                        <SelectItem value="-1">Todas</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="text-sm text-muted-foreground">
                Total de registros: {fullDataCount}
            </div>
            <PaginationComponent 
                currentPage={currentPage}
                pageCount={pageCount}
                onPageChange={onPageChange}
            />
        </CardFooter>
    </Card>
  );
}