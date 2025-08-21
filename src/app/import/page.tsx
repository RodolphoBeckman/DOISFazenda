
"use client";

import { useState } from 'react';
import { FileUp, Loader2, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

// Mock data for preview, replace with actual parsed data
const previewData = {
  headers: ["Brinco", "Animal", "Origem", "Fazenda", "Lote", "Status"],
  rows: [
    ["101", "Vaca Adulta", "Compra", "São Francisco", "Lote 1", "Prenha"],
    ["102", "Novilha", "Cria da Fazenda", "Segredo", "Lote 2", "Vazia"],
    ["103", "Vaca Adulta", "Compra", "Dois", "Lote 3", "Com cria"],
  ],
};

export default function ImportPage() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
        // Basic file type validation
        if (selectedFile.type === "text/csv" || selectedFile.name.endsWith('.csv') || selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || selectedFile.name.endsWith('.xlsx')) {
            setFile(selectedFile);
            setShowPreview(false);
        } else {
            toast({
                variant: 'destructive',
                title: 'Tipo de arquivo inválido',
                description: 'Por favor, selecione um arquivo CSV ou XLSX.',
            });
            event.target.value = ''; // Clear the input
        }
    }
  };

  const handlePreview = () => {
    if (!file || !importType) {
      toast({
        variant: 'destructive',
        title: 'Faltam informações',
        description: 'Por favor, selecione um arquivo e o tipo de importação.',
      });
      return;
    }
    // Here you would typically parse the file and show real data
    console.log("Generating preview for:", file.name, "as", importType);
    setShowPreview(true);
  };

   const handleImport = () => {
    if (!showPreview) {
      toast({
        variant: 'destructive',
        title: 'Pré-visualização necessária',
        description: 'Gere a pré-visualização antes de importar.',
      });
      return;
    }
    setIsLoading(true);
    console.log("Importing data...");
    
    // Simulate import process
    setTimeout(() => {
        setIsLoading(false);
        toast({
            title: 'Importação Concluída!',
            description: `Os dados de ${importType} foram importados com sucesso.`,
        });
        // Reset state
        setFile(null);
        setImportType("");
        setShowPreview(false);
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if(fileInput) fileInput.value = '';

    }, 2000);
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
                <Select value={importType} onValueChange={setImportType}>
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
                <Input id="file-upload" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={handleFileChange} />
            </div>
          </div>
           {file && (
            <div className="text-sm text-muted-foreground">
                Arquivo selecionado: <span className="font-medium">{file.name}</span>
            </div>
            )}

        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t pt-6">
            <Button onClick={handlePreview} variant="outline" disabled={!file || !importType}>
                <FileUp className="mr-2 h-4 w-4" />
                Pré-visualizar
            </Button>
            <Button onClick={handleImport} disabled={!showPreview || isLoading}>
            {isLoading ? (
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
                    Confira se as colunas e os dados estão corretos antes de importar. Serão importadas as 3 primeiras linhas como exemplo.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {previewData.headers.map((header) => <TableHead key={header}>{header}</TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {previewData.rows.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {row.map((cell, cellIndex) => <TableCell key={cellIndex}>{cell}</TableCell>)}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      )}

    </main>
  );
}
