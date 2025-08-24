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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { ArrowDownAZ, ArrowUpAZ, ChevronDown, FilterX, Search, PlusCircle, PencilRuler, Trash2, Download } from "lucide-react"
import { Input } from '@/components/ui/input';
import type { IATF } from '@/lib/data-schemas';
import { useData } from '@/contexts/data-context';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import EditIATFDialog from '@/components/edit-iatf-dialog';
import { format } from 'date-fns';
import * as xlsx from 'xlsx';


type ColumnKey = keyof IATF | 'id';
type SortDirection = 'asc' | 'desc' | null;

export default function IATFsPage() {
  const { iatfs, deleteIATF } = useData();
  const { toast } = useToast();
  const [isClient, setIsClient] = React.useState(false);
  const [filters, setFilters] = React.useState<Record<string, string[]>>({
     cowId: [], inseminationDate: [], bull: [], protocol: [], diagnosisDate: [], result: []
  });
  const [sort, setSort] = React.useState<{ column: ColumnKey | null; direction: SortDirection }>({ column: null, direction: null });
  const [searchTerms, setSearchTerms] = React.useState<Record<string, string>>({
    cowId: '', inseminationDate: '', bull: '', protocol: '', diagnosisDate: '', result: ''
  });
  
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [iatfToDelete, setIatfToDelete] = React.useState<IATF | null>(null);
  const [selectedIATF, setSelectedIATF] = React.useState<IATF | null>(null);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleEditClick = (iatf: IATF) => {
    setSelectedIATF(iatf);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = (iatf: IATF) => {
    setIatfToDelete(iatf);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (iatfToDelete?.id) {
      deleteIATF(iatfToDelete.id);
      toast({
        title: "Registro IATF Excluído",
        description: `O registro IATF da vaca ${iatfToDelete.cowId} foi removido.`,
      });
      setIsAlertOpen(false);
      setIatfToDelete(null);
    }
  };

  const handleFilterChange = (column: ColumnKey, value: string) => {
    setFilters(prev => {
      const currentFilters = prev[column] || [];
      const newColumnFilters = currentFilters.includes(value)
        ? currentFilters.filter(v => v !== value)
        : [...currentFilters, value];
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

  const getFilteredAndSortedData = (dataSet: IATF[]) => {
    let filteredData = dataSet.filter(item => {
        return Object.entries(filters).every(([key, values]) => {
            if (!values || values.length === 0) return true;
            const itemValue = item[key as keyof IATF];
            if (key.endsWith('Date')) {
                 return values.includes(itemValue ? format(new Date(itemValue), 'dd/MM/yyyy') : 'Data não informada');
            }
            return values.includes(String(itemValue));
        });
    });

    if (sort.column && sort.direction) {
      filteredData.sort((a, b) => {
        const aValue = a[sort.column! as keyof IATF];
        const bValue = b[sort.column! as keyof IATF];
        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;
        // @ts-ignore
        if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
        // @ts-ignore
        if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filteredData;
  };
  
  const getUniqueValues = (dataSet: IATF[], column: ColumnKey) => {
    const searchTerm = searchTerms[column]?.toLowerCase() || '';
    
    let uniqueValues;
    if (column.endsWith('Date')) {
       uniqueValues = Array.from(new Set(dataSet.map(item => {
        const dateValue = item[column as keyof IATF];
        return dateValue ? format(new Date(dateValue), 'dd/MM/yyyy') : 'Data não informada';
       }))).sort((a, b) => {
        if (a === 'Data não informada') return 1;
        if (b === 'Data não informada') return -1;
        // @ts-ignore
        return new Date(b.split('/').reverse().join('-')) - new Date(a.split('/').reverse().join('-'));
       });
    } else {
        // @ts-ignore
       uniqueValues = Array.from(new Set(dataSet.map(item => item[column as keyof IATF]))).sort();
    }
    
    if (!searchTerm) return uniqueValues;
    return uniqueValues.filter(value => value && String(value).toLowerCase().includes(searchTerm));
  };
  
  const clearFilter = (column: ColumnKey) => {
    setFilters(prev => ({ ...prev, [column]: [] }));
  };

  const selectAll = (column: ColumnKey, allValues: (string | undefined)[]) => {
    setFilters(prev => ({ ...prev, [column]: allValues.filter((v): v is string => v !== undefined && v !== null) }));
  }

  const handleExport = (dataToExport: IATF[]) => {
    if (dataToExport.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhum dado para exportar",
        description: "A tabela atual está vazia ou os filtros não retornaram resultados.",
      });
      return;
    }

    const formattedData = dataToExport.map(iatf => ({
      "Brinco Nº (Vaca)": iatf.cowId,
      "Data Inseminação": iatf.inseminationDate ? format(iatf.inseminationDate, 'dd/MM/yyyy') : '',
      "Touro": iatf.bull,
      "Protocolo": iatf.protocol,
      "Data Diagnóstico": iatf.diagnosisDate ? format(iatf.diagnosisDate, 'dd/MM/yyyy') : '',
      "Resultado": iatf.result,
    }));

    const worksheet = xlsx.utils.json_to_sheet(formattedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "IATF");
    xlsx.writeFile(workbook, "iatf.xlsx");

    toast({
        title: "Exportação Concluída!",
        description: `${dataToExport.length} registros foram exportados para iatf.xlsx`,
    });
  };

  const renderFilterableHeader = (column: ColumnKey, label: string, dataSet: IATF[]) => {
    const uniqueValues = getUniqueValues(dataSet, column);
    let allUniqueValuesForSelectAll;

     if (column.endsWith('Date')) {
        allUniqueValuesForSelectAll = Array.from(new Set(dataSet.map(item => {
            const dateValue = item[column as keyof IATF];
            return dateValue ? format(new Date(dateValue), 'dd/MM/yyyy') : 'Data não informada'
        }))).filter(Boolean).sort();
    } else {
       allUniqueValuesForSelectAll = Array.from(new Set(dataSet.map(item => String(item[column as keyof IATF])))).filter(Boolean).sort();
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
                    checked={filters[column]?.length === allUniqueValuesForSelectAll.length && allUniqueValuesForSelectAll.length > 0}
                    onCheckedChange={() => {
                        if (filters[column]?.length === allUniqueValuesForSelectAll.length) {
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
                        checked={filters[column]?.includes(String(value))}
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

  const filteredData = getFilteredAndSortedData(iatfs);

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Controle de IATF
        </h1>
        <div className="flex items-center gap-2">
             <Button onClick={() => handleExport(filteredData)}>
              <Download />
              <span>Exportar</span>
            </Button>
            <Button asChild>
                <Link href="/iaths/new">
                <PlusCircle /> 
                <span>Novo Registro IATF</span>
                </Link>
            </Button>
        </div>
      </div>
      
      {isClient && (
        <div className="border bg-card text-card-foreground shadow-sm rounded-lg mt-4">
            <div className="p-6">
                <h3 className="text-xl font-semibold tracking-tight">Todos os Registros</h3>
            </div>
            <div className="relative w-full overflow-auto">
              <Table>
                      <TableHeader>
                      <TableRow>
                          {renderFilterableHeader('cowId', 'Brinco Nº', iatfs)}
                          {renderFilterableHeader('inseminationDate', 'Data Inseminação', iatfs)}
                          {renderFilterableHeader('bull', 'Touro', iatfs)}
                          {renderFilterableHeader('protocol', 'Protocolo', iatfs)}
                          {renderFilterableHeader('diagnosisDate', 'Data Diagnóstico', iatfs)}
                          {renderFilterableHeader('result', 'Resultado', iatfs)}
                          <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                      </TableHeader>
                      <TableBody>
                      {filteredData.map((iatf) => (
                          <TableRow key={iatf.id}>
                          <TableCell className="font-medium">{iatf.cowId}</TableCell>
                          <TableCell>{iatf.inseminationDate ? format(new Date(iatf.inseminationDate), 'dd/MM/yyyy') : '-'}</TableCell>
                          <TableCell>{iatf.bull || '-'}</TableCell>
                          <TableCell>{iatf.protocol || '-'}</TableCell>
                          <TableCell>{iatf.diagnosisDate ? format(new Date(iatf.diagnosisDate), 'dd/MM/yyyy') : '-'}</TableCell>
                          <TableCell>
                              {iatf.result ? (
                              <Badge
                                  variant={
                                  iatf.result === 'Prenha'
                                      ? 'default'
                                      : iatf.result === 'Vazia'
                                      ? 'destructive'
                                      : 'secondary'
                                  }
                                  className={iatf.result === 'Prenha' ? 'bg-green-600' : ''}
                              >
                                  {iatf.result}
                              </Badge>
                              ) : (
                              <Badge variant="outline">Não checado</Badge>
                              )}
                          </TableCell>
                          <TableCell className="text-right">
                              <div className="flex items-center justify-end">
                              <Button variant="ghost" size="icon" onClick={() => handleEditClick(iatf)}>
                                  <PencilRuler className="h-4 w-4" />
                                  <span className="sr-only">Editar</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(iatf)}>
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
            <div className="p-6 border-t">
                <PaginationComponent pageCount={5} />
            </div>
        </div>
      )}
       <EditIATFDialog
        iatf={selectedIATF}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
       <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o registro de IATF da vaca
              <span className="font-bold"> Nº {iatfToDelete?.cowId}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIatfToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
