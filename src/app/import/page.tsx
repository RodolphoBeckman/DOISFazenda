
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
import { useData } from '@/contexts/data-context';
import { useSettings } from '@/contexts/settings-context';
import { CowSchema, BirthSchema } from '@/lib/data-schemas';

type ParsedData = {
  headers: string[];
  rows: (string | number | null)[][];
};

type FullParsedData = (string | number | null)[][];


export default function ImportPage() {
  const { toast } = useToast();
  const { addCow, addBirth } = useData();
  const { settings, addSettingItem } = useSettings();
  
  const [file, setFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<string>("");
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false);
  const [isLoadingImport, setIsLoadingImport] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<ParsedData>({ headers: [], rows: [] });
  const [fullData, setFullData] = useState<FullParsedData>([]);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
        if (selectedFile.type === "text/csv" || selectedFile.name.endsWith('.csv') || selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || selectedFile.name.endsWith('.xlsx')) {
            setFile(selectedFile);
            setShowPreview(false);
            setPreviewData({ headers: [], rows: [] });
            setFullData([]);
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

  const parseFile = (file: File): Promise<{ preview: ParsedData; full: FullParsedData }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = xlsx.read(data, { type: 'array', cellDates: true });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: null, raw: false }) as (string | number | null)[][];
          
          if (jsonData.length > 0) {
            const headers = jsonData[0] as string[];
            const previewRows = jsonData.slice(1, 4); 
            const fullRows = jsonData.slice(1);
            resolve({ preview: { headers, rows: previewRows }, full: fullRows });
          } else {
            resolve({ preview: { headers: [], rows: [] }, full: [] });
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
      const { preview, full } = await parseFile(file);
      setPreviewData(preview);
      setFullData(full);
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

  const handleImport = async () => {
    if (!showPreview || fullData.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Pré-visualização necessária',
        description: 'Gere e verifique a pré-visualização antes de importar.',
      });
      return;
    }
    setIsLoadingImport(true);

    const headers = previewData.headers.map(h => h ? String(h).trim() : "");
    
    let importedCount = 0;
    let errorCount = 0;

    for (const row of fullData) {
        if (!row || row.every(cell => cell === null || cell === '')) {
            continue; 
        }

        const rowData: { [key: string]: any } = {};
        headers.forEach((header, index) => {
            rowData[header] = row[index];
        });
        
        try {
          if (importType === 'vacas') {
              const cowData = {
                  id: String(rowData['Brinco Nº'] || ''),
                  animal: String(rowData['Animal'] || ''),
                  origem: String(rowData['Origem'] || ''),
                  farm: String(rowData['Fazenda'] || ''),
                  lot: String(rowData['Lote'] || ''),
                  location: String(rowData['Localização'] || ''),
                  status: String(rowData['Status'] || 'Vazia'),
                  registrationStatus: String(rowData['Status do Cadastro'] || 'Ativo'),
              };
              
              if (!cowData.id || !cowData.animal || !cowData.location) {
                  continue;
              }

              const newFarm = cowData.farm;
              if (newFarm && !settings.farms.some(f => f.name === newFarm)) {
                  addSettingItem('farms', { id: crypto.randomUUID(), name: newFarm });
              }
              const newLot = cowData.lot;
              if (newLot && !settings.lots.some(l => l.name === newLot)) {
                  addSettingItem('lots', { id: crypto.randomUUID(), name: newLot });
              }

              const cow = CowSchema.parse(cowData);
              addCow(cow);
              importedCount++;

          } else if (importType === 'nascimentos') {
               const birthData = {
                  cowId: String(rowData['Brinco Nº (Mãe)'] || ''),
                  date: rowData['Data Nascim.'] ? new Date(rowData['Data Nascim.']) : undefined,
                  sex: String(rowData['Sexo do Bezerro'] || ''),
                  breed: String(rowData['Raça do Bezerro'] || ''),
                  sire: String(rowData['Nome do Pai'] || ''),
                  lot: String(rowData['Lote'] || ''),
                  farm: String(rowData['Fazenda'] || ''),
                  location: String(rowData['Localização'] || ''),
                  observations: String(rowData['Observações'] || ''),
              }

              if (!birthData.cowId || !birthData.date || !birthData.sex || !birthData.breed || !birthData.lot || !birthData.farm || !birthData.location) {
                  continue;
              }
              
              const newFarm = birthData.farm;
              if (newFarm && !settings.farms.some(f => f.name === newFarm)) {
                  addSettingItem('farms', { id: crypto.randomUUID(), name: newFarm });
              }
              const newLot = birthData.lot;
              if (newLot && !settings.lots.some(l => l.name === newLot)) {
                  addSettingItem('lots', { id: crypto.randomUUID(), name: newLot });
              }
              const newBreed = birthData.breed;
              if (newBreed && !settings.breeds.some(b => b.name === newBreed)) {
                   addSettingItem('breeds', { id: crypto.randomUUID(), name: newBreed });
              }

              const birth = BirthSchema.parse(birthData);
              addBirth(birth);
              importedCount++;
          }
        } catch (e) {
            errorCount++;
            console.error('Validation Error on row:', rowData, e);
        }
    }

    setIsLoadingImport(false);
    
    if (importedCount > 0) {
        toast({
            title: 'Importação Concluída!',
            description: `${importedCount} registros importados com sucesso. ${errorCount > 0 ? `${errorCount} registros com erro.` : ''}`,
        });
    } else {
         toast({
            variant: 'destructive',
            title: 'Nenhum registro importado.',
            description: `Verifique se as colunas do arquivo correspondem ao esperado ou se os dados obrigatórios estão preenchidos. ${errorCount > 0 ? `${errorCount} registros com erro.` : ''}`,
        });
    }

    setFile(null);
    setImportType("");
    setShowPreview(false);
    setPreviewData({ headers: [], rows: [] });
    setFullData([]);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
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
            <Button onClick={handleImport} disabled={!showPreview || fullData.length === 0 || isLoadingImport || isLoadingPreview}>
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
