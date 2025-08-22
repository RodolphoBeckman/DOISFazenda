
"use client";

import { useState } from 'react';
import { FileUp, Loader2, Upload } from 'lucide-react';
import * as xlsx from 'xlsx';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

type ParsedData = {
  headers: string[];
  rows: (string | number | null)[][];
};

export default function ImportPage() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<string>("");
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false);
  const [isLoadingImport, setIsLoadingImport] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<ParsedData>({ headers: [], rows: [] });
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
        if (selectedFile.type === "text/csv" || selectedFile.name.endsWith('.csv') || selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || selectedFile.name.endsWith('.xlsx')) {
            setFile(selectedFile);
            setShowPreview(false);
            setPreviewData({ headers: [], rows: [] });
        } else {
            toast({
                variant: 'destructive',
                title: 'Tipo de arquivo inválido',
                description: 'Por favor, selecione um arquivo CSV ou XLSX.',
            });
            event.target.value = '';
        }
    }
  };

  const parseFile = (file: File): Promise<ParsedData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = xlsx.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: null }) as (string | number | null)[][];
          
          if (jsonData.length > 0) {
            const headers = jsonData[0] as string[];
            const rows = jsonData.slice(1, 4); // Preview first 3 data rows
            resolve({ headers, rows });
          } else {
            resolve({ headers: [], rows: [] });
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const handlePreview = async () => {
    if (!file || !importType) {
      toast({
        variant: 'destructive',
        title: 'Faltam informações',
        description: 'Por favor, selecione um arquivo e o tipo de importação.',
      });
      return;
    }

    setIsLoadingPreview(true);
    setShowPreview(true);

    try {
      const parsed = await parseFile(file);
      setPreviewData(parsed);
    } catch (error) {
      console.error("File parsing error:", error);
      toast({
        variant: 'destructive',
        title: 'Erro ao ler arquivo',
        description: 'Não foi possível processar o arquivo. Verifique se o formato está correto.',
      });
      setShowPreview(false);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleImport = () => {
    if (!showPreview || previewData.rows.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Pré-visualização necessária',
        description: 'Gere e verifique a pré-visualização antes de importar.',
      });
      return;
    }
    setIsLoadingImport(true);
    console.log("Importing data for:", importType);
    console.log("Headers:", previewData.headers);
    console.log("All file rows would be processed here...");
    
    // Simulate API call
    setTimeout(() => {
        setIsLoadingImport(false);
        toast({
            title: 'Importação Concluída!',
            description: `Os dados de ${importType} foram importados com sucesso.`,
        });
        
        // Reset state after import
        setFile(null);
        setImportType("");
        setShowPreview(false);
        setPreviewData({ headers: [], rows: [] });
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if(fileInput) fileInput.value = '';

    }, 1500);
  };

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Importar Dados
        </h1>
      </div>

      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Upload de Planilha</CardTitle>
          <CardDescription>
            Importe dados de Vacas ou Nascimentos a partir de um arquivo CSV ou XLSX.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="import-type">Tipo de Importação</Label>
                <Select value={importType} onValueChange={setImportType} disabled={isLoadingPreview || isLoadingImport}>
                    <SelectTrigger id="import-type">
                        <SelectValue placeholder="Selecione o tipo..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="vacas">Cadastro de Vacas</SelectItem>
                        <SelectItem value="nascimentos">Registro de Nascimentos</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="file-upload">Arquivo (CSV, XLSX)</Label>
                <Input id="file-upload" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .xlsx" onChange={handleFileChange} disabled={isLoadingPreview || isLoadingImport} />
            </div>
          </div>
           {file && (
            <div className="text-sm text-muted-foreground">
                Arquivo selecionado: <span className="font-medium">{file.name}</span>
            </div>
            )}

        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t pt-6">
            <Button onClick={handlePreview} variant="outline" disabled={!file || !importType || isLoadingPreview || isLoadingImport}>
                {isLoadingPreview ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
                Pré-visualizar
            </Button>
            <Button onClick={handleImport} disabled={!showPreview || previewData.rows.length === 0 || isLoadingImport || isLoadingPreview}>
            {isLoadingImport ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Upload className="mr-2 h-4 w-4" />
            )}
            Importar Dados
          </Button>
        </CardFooter>
      </Card>
      
      {showPreview && (
        <Card className="w-full max-w-3xl mx-auto mt-6">
            <CardHeader>
                <CardTitle>Pré-visualização dos Dados</CardTitle>
                <CardDescription>
                    Confira se as colunas e os dados estão corretos antes de importar. Serão exibidas as 3 primeiras linhas do arquivo como exemplo.
                </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPreview ? (
                  <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
              ) : previewData.rows.length > 0 ? (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {previewData.headers.map((header) => <TableHead key={header}>{header}</TableHead>)}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {previewData.rows.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {row.map((cell, cellIndex) => <TableCell key={cellIndex}>{String(cell ?? '')}</TableCell>)}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Nenhum dado encontrado no arquivo ou o arquivo está vazio.
                </div>
              )}
            </CardContent>
        </Card>
      )}

    </main>
  );
}
