# Cópia do Código de Desenvolvimento do Aplicativo

Este arquivo contém uma cópia completa de todo o código-fonte do aplicativo para referência e análise.

---
## .env
---

```

```

---
## components.json
---

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

---
## next.config.ts
---

```ts
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

```

---
## package.json
---

```json
{
  "name": "nextn",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack -p 9002",
    "genkit:dev": "genkit start -- tsx src/ai/dev.ts",
    "genkit:watch": "genkit start -- tsx --watch src/ai/dev.ts",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@genkit-ai/googleai": "^1.14.1",
    "@genkit-ai/next": "^1.14.1",
    "@hookform/resolvers": "^4.1.3",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-menubar": "^1.1.6",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.1.8",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "dotenv": "^16.5.0",
    "embla-carousel-react": "^8.6.0",
    "firebase": "^11.9.1",
    "genkit": "^1.14.1",
    "lucide-react": "^0.475.0",
    "next": "15.3.3",
    "patch-package": "^8.0.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.54.2",
    "recharts": "^2.15.1",
    "tailwind-merge": "^3.0.1",
    "tailwindcss-animate": "^1.0.7",
    "xlsx": "^0.18.5",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "genkit-cli": "^1.14.1",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

---
## src/ai/dev.ts
---

```ts
import { config } from 'dotenv';
config();

import '@/ai/flows/calving-prediction.ts';
```

---
## src/ai/flows/calving-prediction.ts
---

```ts
// src/ai/flows/calving-prediction.ts
'use server';

/**
 * @fileOverview A flow to predict the calving date based on the insemination date.
 *
 * - predictCalvingDate - A function that predicts the calving date based on the insemination date.
 * - PredictCalvingDateInput - The input type for the predictCalvingDate function.
 * - PredictCalvingDateOutput - The return type for the predictCalvingDate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictCalvingDateInputSchema = z.object({
  inseminationDate: z
    .string() // Changed to string to accept date strings from the form
    .describe('The date of insemination in ISO format (YYYY-MM-DD).'),
});
export type PredictCalvingDateInput = z.infer<typeof PredictCalvingDateInputSchema>;

const PredictCalvingDateOutputSchema = z.object({
  predictedCalvingDate: z
    .string()
    .describe('The predicted calving date in ISO format (YYYY-MM-DD).'),
  daysUntilCalving: z
    .number()
    .describe('The number of days until the predicted calving date.'),
  isNearCalving: z
    .boolean()
    .describe(
      'Whether the predicted calving date is near (within a configurable number of days).'
    ),
});
export type PredictCalvingDateOutput = z.infer<typeof PredictCalvingDateOutputSchema>;

export async function predictCalvingDate(
  input: PredictCalvingDateInput
): Promise<PredictCalvingDateOutput> {
  return predictCalvingDateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictCalvingDatePrompt',
  input: {schema: PredictCalvingDateInputSchema},
  output: {schema: PredictCalvingDateOutputSchema},
  prompt: `You are an AI assistant specialized in predicting calving dates for cattle.

  Given the insemination date, calculate the predicted calving date assuming a gestation period of 283 days.

  Input Insemination Date: {{{inseminationDate}}}

  Output the predicted calving date in ISO format (YYYY-MM-DD), the number of days until calving, and whether the calving date is near (within 30 days).

  Ensure the predictedCalvingDate is in ISO format (YYYY-MM-DD).`,
});

const predictCalvingDateFlow = ai.defineFlow(
  {
    name: 'predictCalvingDateFlow',
    inputSchema: PredictCalvingDateInputSchema,
    outputSchema: PredictCalvingDateOutputSchema,
  },
  async input => {
    // Parse the insemination date string into a Date object
    const inseminationDate = new Date(input.inseminationDate);

    // Calculate the predicted calving date (283 days gestation period)
    const gestationPeriodDays = 283;
    const calvingDate = new Date(
      inseminationDate.getTime() + gestationPeriodDays * 24 * 60 * 60 * 1000
    );

    // Format the calving date as ISO string (YYYY-MM-DD)
    const predictedCalvingDateISO = calvingDate.toISOString().slice(0, 10);

    // Calculate the number of days until calving
    const today = new Date();
    const timeDiff = calvingDate.getTime() - today.getTime();
    const daysUntilCalving = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Determine if the calving date is near (within 30 days)
    const isNearCalving = daysUntilCalving <= 30;

    // Call the prompt to get the formatted output
    const {output} = await prompt({
      ...input,
      predictedCalvingDate: predictedCalvingDateISO,
      daysUntilCalving: daysUntilCalving,
      isNearCalving: isNearCalving,
    });

    return {
      predictedCalvingDate: predictedCalvingDateISO,
      daysUntilCalving: daysUntilCalving,
      isNearCalving: isNearCalving,
    };
  }
);
```

---
## src/ai/genkit.ts
---

```ts
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
```

---
## src/app/births/new/page.tsx
---

```tsx
"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, ChevronLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useSettings } from "@/contexts/settings-context"
import { useRouter } from "next/navigation"
import { useData } from "@/contexts/data-context"
import { BirthSchema } from "@/lib/data-schemas"

type FormValues = z.infer<typeof BirthSchema>;

export default function NewBirthPage() {
  const { toast } = useToast()
  const { settings } = useSettings();
  const { data: cows, addBirth } = useData();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(BirthSchema),
    defaultValues: {
      cowId: "",
      sex: undefined,
      breed: "",
      sire: "",
      lot: "",
      farm: "",
      location: "",
      observations: "",
      obs1: "",
      jvvo: "",
      animal: ""
    },
  });

  function onSubmit(data: FormValues) {
    addBirth(data);
    toast({
      title: "Sucesso!",
      description: "Nascimento registrado com sucesso.",
    })
    router.push('/births');
  }

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/births">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Registrar Novo Nascimento
        </h1>
      </div>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="pt-6 grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="cowId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brinco Nº (Mãe)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a vaca..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cows.map(cow => (
                          <SelectItem key={cow.id} value={cow.id}>
                            {cow.id} ({cow.farm})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Nascimento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Escolha uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("2020-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexo do Bezerro</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o sexo..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Macho">Macho</SelectItem>
                        <SelectItem value="Fêmea">Fêmea</SelectItem>
                        <SelectItem value="Aborto">Aborto</SelectItem>
                        <SelectItem value="Não Definido">Não Definido</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="animal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Animal</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Bezerro de 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="breed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raça do Bezerro</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a raça..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {settings.breeds.map((breed) => (
                          <SelectItem key={`${breed.id}-${breed.name}`} value={breed.name}>{breed.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="sire"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Pai</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Comprou Prenha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="lot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lote</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o lote..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {settings.lots.map((lot) => (
                          <SelectItem key={`${lot.id}-${lot.name}`} value={lot.name}>{lot.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="farm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fazenda</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a fazenda..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {settings.farms.map(farm => (
                          <SelectItem key={`${farm.id}-${farm.name}`} value={farm.name}>{farm.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Pasto da Represa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="obs1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Obs: 1</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jvvo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>JV - Vo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="observations"
                render={({ field }) => (
                  <FormItem className="md:col-span-3">
                    <FormLabel>Observações Gerais</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Alguma observação sobre o nascimento..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit">Salvar Nascimento</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </main>
  );
}
```

---
## src/app/births/page.tsx
---

```tsx
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
import { ArrowDownAZ, ArrowUpAZ, ChevronDown, FilterX, Search, PlusCircle, PencilRuler, Trash2, Send, GitCommitVertical, GitBranch, XCircle, HelpCircle, Download } from "lucide-react"
import { Input } from '@/components/ui/input';
import type { Birth } from '@/lib/data-schemas';
import { useData } from '@/contexts/data-context';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import EditBirthDialog from '@/components/edit-birth-dialog';
import BulkUpdateBirthDialog from '@/components/bulk-update-birth-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import * as xlsx from 'xlsx';

type ColumnKey = keyof Birth | 'id';
type SortDirection = 'asc' | 'desc' | null;

export default function BirthsPage() {
  const { births: allBirths, deleteBirth, transferBirthToCow } = useData();
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
  const [birthToTransfer, setBirthToTransfer] = React.useState<Birth | null>(null);
  const [isTransferAlertOpen, setIsTransferAlertOpen] = React.useState(false);
  const [selectedBirth, setSelectedBirth] = React.useState<Birth | null>(null);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [activeTab, setActiveTab] = React.useState('all');

  const sexCounts = React.useMemo(() => {
    return allBirths.reduce((acc, birth) => {
      const sex = birth.sex || 'Não Definido';
      acc[sex] = (acc[sex] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [allBirths]);


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
  
  const handleTransferClick = (birth: Birth) => {
    setBirthToTransfer(birth);
    setIsTransferAlertOpen(true);
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

  const handleConfirmTransfer = () => {
    if (birthToTransfer) {
      transferBirthToCow(birthToTransfer);
      toast({
        title: "Animal Transferido!",
        description: `O animal da vaca ${birthToTransfer.cowId} foi adicionado ao rebanho principal.`,
      });
    }
    setIsTransferAlertOpen(false);
    setBirthToTransfer(null);
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

  const getFilteredAndSortedData = React.useCallback((dataSet: Birth[]) => {
    let filteredData = dataSet.filter(item => {
        return Object.entries(filters).every(([key, values]) => {
            if (values.length === 0) return true;
            const itemValue = item[key as keyof Birth];
            if (key === 'date') {
                 // @ts-ignore
                 return values.includes(item.date ? format(item.date, 'dd/MM/yyyy') : 'Data não informada');
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
  }, [filters, sort]);
  
  const getUniqueValues = (dataSet: Birth[], column: ColumnKey) => {
    const searchTerm = searchTerms[column].toLowerCase();
    
    let uniqueValues;
    if (column === 'date') {
       uniqueValues = Array.from(new Set(dataSet.map(item => item.date ? format(item.date, 'dd/MM/yyyy') : 'Data não informada'))).sort((a, b) => {
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
    setCurrentPage(1);
    setFilters(prev => ({ ...prev, [column]: [] }));
  };

  const selectAll = (column: ColumnKey, allValues: string[]) => {
    setCurrentPage(1);
    setFilters(prev => ({ ...prev, [column]: allValues }));
  }

  const handleExport = (dataToExport: Birth[]) => {
    if (dataToExport.length === 0) {
        toast({
            variant: "destructive",
            title: "Nenhum dado para exportar",
            description: "A tabela atual está vazia ou os filtros não retornaram resultados.",
        });
        return;
    }
    
    const formattedData = dataToExport.map(birth => ({
        "Brinco Nº (Mãe)": birth.cowId,
        "Sexo do Bezerro": birth.sex,
        "Raça do Bezerro": birth.breed,
        "Nome do Pai": birth.sire,
        "Data Nascimento": birth.date ? format(birth.date, 'dd/MM/yyyy') : 'Data não informada',
        "Lote": birth.lot,
        "Obs: 1": birth.obs1,
        "JV - Vo": birth.jvvo,
        "Fazenda": birth.farm,
        "Localização": birth.location,
        "Animal": birth.animal,
        "Observações": birth.observations,
    }));

    const worksheet = xlsx.utils.json_to_sheet(formattedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Nascimentos");
    xlsx.writeFile(workbook, "nascimentos.xlsx");

    toast({
        title: "Exportação Concluída!",
        description: `${dataToExport.length} registros foram exportados para nascimentos.xlsx`,
    });
  };

  const renderFilterableHeader = (column: ColumnKey, label: string, dataSet: Birth[]) => {
    const uniqueValues = getUniqueValues(dataSet, column);
    let allUniqueValuesForSelectAll;

     if (column === 'date') {
        allUniqueValuesForSelectAll = Array.from(new Set(dataSet.map(item => item.date ? format(item.date, 'dd/MM/yyyy') : 'Data não informada'))).filter(Boolean).sort();
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

  const filteredDataForAll = React.useMemo(() => getFilteredAndSortedData(allBirths), [allBirths, getFilteredAndSortedData]);
  
  const paginatedDataForAll = React.useMemo(() => {
      return rowsPerPage > 0 ? filteredDataForAll.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage) : filteredDataForAll;
  }, [filteredDataForAll, currentPage, rowsPerPage]);

  const pageCountForAll = React.useMemo(() => {
    return rowsPerPage > 0 ? Math.ceil(filteredDataForAll.length / rowsPerPage) : 1;
  }, [filteredDataForAll, rowsPerPage]);

  const dataForActiveTab = React.useMemo(() => {
    if (activeTab === 'all') {
      return filteredDataForAll;
    }
    return getFilteredAndSortedData(allBirths.filter(b => b.farm === activeTab));
  }, [activeTab, allBirths, getFilteredAndSortedData, filteredDataForAll]);


  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Registro de Nascimentos
        </h1>
        <div className="flex items-center gap-2">
            <Button onClick={() => handleExport(dataForActiveTab)}>
              <Download />
              <span>Exportar</span>
            </Button>
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
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Machos</CardTitle>
                <GitCommitVertical className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sexCounts['Macho'] || 0}</div>
                <p className="text-xs text-muted-foreground">Total de bezerros machos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Fêmeas</CardTitle>
                <GitBranch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sexCounts['Fêmea'] || 0}</div>
                 <p className="text-xs text-muted-foreground">Total de bezerras fêmeas</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Abortos</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sexCounts['Aborto'] || 0}</div>
                <p className="text-xs text-muted-foreground">Total de perdas registradas</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sexo Não Definido</CardTitle>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sexCounts['Não Definido'] || 0}</div>
                <p className="text-xs text-muted-foreground">Total de registros sem sexo</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" onValueChange={(value) => { setCurrentPage(1); setActiveTab(value); }}>
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              {farms.map(farm => (
                <TabsTrigger key={farm} value={farm}>{farm}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="all">
                <CardWithTable 
                  title="Todos os Nascimentos" 
                  data={paginatedDataForAll}
                  fullDataCount={filteredDataForAll.length} 
                  allData={allBirths} 
                  renderFilterableHeader={renderFilterableHeader}
                  onEditClick={handleEditClick}
                  onDeleteClick={handleDeleteClick}
                  onTransferClick={handleTransferClick}
                  selectedBirths={selectedBirths}
                  onSelectBirth={handleSelectBirth}
                  onSelectAllBirths={() => handleSelectAllBirths(filteredDataForAll)}
                  currentPage={currentPage}
                  pageCount={pageCountForAll}
                  onPageChange={setCurrentPage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(value) => {
                    setRowsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                />
            </TabsContent>
            {farms.map(farm => {
              const farmFilteredData = getFilteredAndSortedData(allBirths.filter(b => b.farm === farm));
              const farmPaginatedData = rowsPerPage > 0 ? farmFilteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage) : farmFilteredData;
              const farmPageCount = rowsPerPage > 0 ? Math.ceil(farmFilteredData.length / rowsPerPage) : 1;

              return (
                <TabsContent key={farm} value={farm}>
                    <CardWithTable 
                      title={`Nascimentos em ${farm}`} 
                      data={farmPaginatedData} 
                      fullDataCount={farmFilteredData.length}
                      allData={allBirths} 
                      renderFilterableHeader={renderFilterableHeader} 
                      onEditClick={handleEditClick}
                      onDeleteClick={handleDeleteClick}
                      onTransferClick={handleTransferClick}
                      selectedBirths={selectedBirths}
                      onSelectBirth={handleSelectBirth}
                      onSelectAllBirths={() => handleSelectAllBirths(farmFilteredData)}
                      currentPage={currentPage}
                      pageCount={farmPageCount}
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
              <span className="font-bold"> Nº {birthToDelete?.cowId}</span> do dia {birthToDelete?.date ? format(birthToDelete.date, 'dd/MM/yyyy') : ''}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBirthToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={isTransferAlertOpen} onOpenChange={setIsTransferAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Transferência</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja transferir o animal da vaca 
              <span className="font-bold"> Nº {birthToTransfer?.cowId}</span> para o rebanho principal? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBirthToTransfer(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmTransfer}>Sim, Transferir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

interface CardWithTableProps {
  title: string;
  data: Birth[];
  fullDataCount: number;
  allData: Birth[];
  renderFilterableHeader: (column: ColumnKey, label: string, data: Birth[]) => React.ReactNode;
  onEditClick: (birth: Birth) => void;
  onDeleteClick: (birth: Birth) => void;
  onTransferClick: (birth: Birth) => void;
  selectedBirths: string[];
  onSelectBirth: (birthId: string | undefined) => void;
  onSelectAllBirths: () => void;
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
    allData, 
    renderFilterableHeader, 
    onEditClick, 
    onDeleteClick, 
    onTransferClick, 
    selectedBirths, 
    onSelectBirth, 
    onSelectAllBirths,
    currentPage,
    pageCount,
    onPageChange,
    rowsPerPage,
    onRowsPerPageChange
}: CardWithTableProps) {
  return (
    <div className="border bg-card text-card-foreground shadow-sm rounded-lg mt-4">
      <div className="p-6 flex justify-between items-center">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <div className="text-sm text-muted-foreground">
            Total de registros: {fullDataCount}
        </div>
      </div>
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
                  key={`${birth.id}-${birth.cowId}-${index}`}
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
                  <TableCell>{birth.date ? format(birth.date, 'dd/MM/yyyy') : 'Data não informada'}</TableCell>
                  <TableCell>{birth.lot || '-'}</TableCell>
                  <TableCell>{birth.obs1 || '-'}</TableCell>
                  <TableCell>{birth.jvvo || '-'}</TableCell>
                  <TableCell>{birth.farm || '-'}</TableCell>
                  <TableCell>{birth.location || '-'}</TableCell>
                    <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      {(birth.sex === 'Fêmea' || birth.sex === 'Macho') && (
                        <Button variant="ghost" size="icon" title="Transferir para Rebanho" onClick={() => onTransferClick(birth)}>
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Transferir</span>
                        </Button>
                      )}
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
      <div className="flex items-center justify-between p-4 border-t">
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
          <PaginationComponent 
              currentPage={currentPage}
              pageCount={pageCount}
              onPageChange={onPageChange}
          />
      </div>
    </div>
  );
}
```

---
## src/app/cows/new/page.tsx
---

```tsx
"use client"

import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useSettings } from "@/contexts/settings-context"
import { useData } from "@/contexts/data-context"
import { CowSchema } from "@/lib/data-schemas"

type FormValues = z.infer<typeof CowSchema>;

// Data for selectors
const statuses: string[] = ["Vazia", "Prenha", "Com cria"];
const origins: string[] = ["Nascimento", "Compra", "Transferência"]; // Example static origins
const registrationStatuses: string[] = ["Ativo", "Inativo"];

export default function NewCowPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { settings } = useSettings();
  const { addCow } = useData();

  const form = useForm<FormValues>({
    resolver: zodResolver(CowSchema),
    defaultValues: {
      id: "",
      animal: "",
      origem: "",
      farm: "",
      lot: "",
      location: "",
      status: undefined,
      registrationStatus: undefined,
    },
  });

  function onSubmit(data: FormValues) {
    addCow(data);
    toast({
      title: "Sucesso!",
      description: "Vaca registrada com sucesso.",
    })
    router.push('/cows');
  }

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/cows">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Registrar Nova Vaca
        </h1>
      </div>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="pt-6 grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brinco Nº</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 826" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="animal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Animal</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Bezerras 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="origem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origem</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a origem..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {origins.map((origin) => (
                          <SelectItem key={origin} value={origin}>{origin}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="farm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fazenda</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a fazenda..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {settings.farms.map((farm) => (
                          <SelectItem key={`${farm.id}-${farm.name}`} value={farm.name}>{farm.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lote</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o lote..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {settings.lots.map((lot) => (
                          <SelectItem key={`${lot.id}-${lot.name}`} value={lot.name}>{lot.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Pasto Palhada" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registrationStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status do Cadastro</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {registrationStatuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit">Salvar Vaca</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </main>
  );
}
```

---
## src/app/cows/page.tsx
---

```tsx
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button"
import { PaginationComponent } from '@/components/pagination';
import { ArrowDownAZ, ArrowUpAZ, ChevronDown, FilterX, PencilRuler, PlusCircle, Search, Trash2, Archive, Users, GitCommitVertical, GitBranch, Download } from "lucide-react"
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
  const { data: allCows, deleteCow } = useData();
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
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [cowToDelete, setCowToDelete] = React.useState<Cow | null>(null);
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
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (cowToDelete) {
      deleteCow(cowToDelete.id);
      toast({
        title: "Vaca Excluída",
        description: `A vaca com brinco Nº ${cowToDelete.id} foi removida.`,
      });
      setIsAlertOpen(false);
      setCowToDelete(null);
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
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
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
    <div className="border bg-card text-card-foreground shadow-sm rounded-lg mt-4">
      <div className="p-6 flex justify-between items-center">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
         <div className="text-sm text-muted-foreground">
            Total de registros: {fullDataCount}
        </div>
      </div>
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
                      <Button variant="ghost" size="icon" onClick={() => onEditClick(cow)}>
                          <PencilRuler className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                      </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDiscardClick(cow)} disabled={cow.registrationStatus === 'Inativo'}>
                          <Archive className="h-4 w-4" />
                          <span className="sr-only">Descartar</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteClick(cow)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
       <div className="flex items-center justify-between p-4 border-t">
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Linhas por página:</span>
                <Select value={`${rowsPerPage}`} onValueChange={(value) => {
                  setRowsPerPage(Number(value));
                  setCurrentPage(1);
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
            <PaginationComponent 
                currentPage={currentPage}
                pageCount={pageCount}
                onPageChange={onPageChange}
            />
        </div>
    </div>
  );
}
```

---
## src/app/globals.css
---

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 60 56% 91%; /* #F5F5DC */
    --foreground: 20 14% 4%; /* Near black for text */
    --card: 0 0% 100%;
    --card-foreground: 20 14% 4%;
    --popover: 0 0% 100%;
    --popover-foreground: 20 14% 4%;
    --primary: 81 33% 60%; /* #A7BE78 */
    --primary-foreground: 80 60% 10%;
    --secondary: 60 30% 85%;
    --secondary-foreground: 80 60% 10%;
    --muted: 60 30% 85%;
    --muted-foreground: 60 10% 45%;
    --accent: 25 57% 40%; /* #A0522D */
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 20% 98%;
    --border: 60 20% 75%;
    --input: 60 20% 80%;
    --ring: 81 33% 60%;
    --radius: 0.5rem;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 340 80% 55%;
    --chart-4: 40 70% 55%;
    --chart-5: 280 75% 50%;
    --sidebar-background: 240 4.8% 95.9%;
    --sidebar-foreground: 240 10% 3.9%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 0 0% 100%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 240 5.9% 90%;
    --sidebar-ring: 240 5.9% 10%;
  }

  .dark {
    --background: 20 14% 4%;
    --foreground: 60 30% 96%;
    --card: 24 10% 8%;
    --card-foreground: 60 30% 96%;
    --popover: 24 10% 8%;
    --popover-foreground: 60 30% 96%;
    --primary: 81 33% 60%;
    --primary-foreground: 80 60% 10%;
    --secondary: 25 15% 15%;
    --secondary-foreground: 60 30% 96%;
    --muted: 25 15% 15%;
    --muted-foreground: 60 10% 60%;
    --accent: 25 57% 50%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 20% 98%;
    --border: 25 15% 20%;
    --input: 25 15% 20%;
    --ring: 81 33% 60%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 340 80% 55%;
    --chart-4: 40 70% 55%;
    --chart-5: 280 75% 50%;
    --sidebar-background: 240 3.7% 15.9%;
    --sidebar-foreground: 0 0% 98%;
    --sidebar-primary: 0 0% 98%;
    --sidebar-primary-foreground: 240 5.9% 10%;
    --sidebar-accent: 240 10% 3.9%;
    --sidebar-accent-foreground: 0 0% 98%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 0 0% 98%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    position: relative;
    overflow-x: hidden;
  }
}

@layer utilities {
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    opacity: 0.2;
    background:
      radial-gradient(
        ellipse at 20% 80%,
        hsl(var(--primary) / 0.5),
        transparent 50%
      ),
      radial-gradient(
        ellipse at 80% 30%,
        hsl(var(--chart-2) / 0.5),
        transparent 50%
      ),
      radial-gradient(
        ellipse at 90% 90%,
        hsl(var(--accent) / 0.5),
        transparent 50%
      );
    animation: aurora-animation 15s infinite alternate;
  }
  
  .dark body::before {
    opacity: 0.15;
  }

  @keyframes aurora-animation {
    0% {
      transform: scale(1) rotate(0deg);
      filter: blur(20px);
    }
    50% {
      transform: scale(1.2) rotate(6deg);
       filter: blur(40px);
    }
    100% {
      transform: scale(1) rotate(0deg);
      filter: blur(20px);
    }
  }
}
```

---
## src/app/iaths/new/page.tsx
---

```tsx
"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, ChevronLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useData } from "@/contexts/data-context"
import { IATFSchema } from "@/lib/data-schemas"

type FormValues = z.infer<typeof IATFSchema>;

export default function NewIATFPage() {
  const { toast } = useToast()
  const { data: cows, addIATF } = useData();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(IATFSchema),
    defaultValues: {
      cowId: "",
      bull: "",
      protocol: "",
      result: "Não checado",
    },
  });

  function onSubmit(data: FormValues) {
    addIATF(data);
    toast({
      title: "Sucesso!",
      description: "Registro IATF criado com sucesso.",
    })
    router.push('/iaths');
  }

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/iaths">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Registrar Novo IATF
        </h1>
      </div>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="pt-6 grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="cowId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brinco Nº (Vaca)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a vaca..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cows.map(cow => (
                          <SelectItem key={cow.id} value={cow.id}>
                            {cow.id} ({cow.farm})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inseminationDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Inseminação</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Escolha uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("2020-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bull"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Touro</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome ou código do touro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="protocol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Protocolo</FormLabel>
                    <FormControl>
                      <Input placeholder="Protocolo utilizado" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="diagnosisDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data do Diagnóstico</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Escolha uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="result"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resultado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o resultado..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Prenha">Prenha</SelectItem>
                        <SelectItem value="Vazia">Vazia</SelectItem>
                        <SelectItem value="Não checado">Não checado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit">Salvar Registro</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </main>
  );
}
```

---
## src/app/iaths/page.tsx
---

```tsx
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
```

---
## src/app/import/page.tsx
---

```tsx
"use client";

import { useState } from 'react';
import { FileUp, Loader2, Upload, Download, UploadCloud } from 'lucide-react';
import * as xlsx from 'xlsx';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/data-context';
import { useSettings } from '@/contexts/settings-context';
import { CowSchema, BirthSchema, type Cow, type Birth } from '@/lib/data-schemas';

type ParsedData = {
  headers: string[];
  rows: (string | number | null)[][];
};

type FullParsedData = (string | number | null)[][];


export default function ImportPage() {
  const { toast } = useToast();
  const { data, births, iatfs, addCow, addBirth, replaceCows, replaceBirths, replaceAllData } = useData();
  const { settings, addSettingItem } = useSettings();
  
  // State for Sheet Import
  const [sheetFile, setSheetFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<string>("");
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false);
  const [isLoadingImport, setIsLoadingImport] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<ParsedData>({ headers: [], rows: [] });
  const [fullData, setFullData] = useState<FullParsedData>([]);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [replaceData, setReplaceData] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  
  // State for Backup/Restore
  const [backupFile, setBackupFile] = useState<File | null>(null);
  const [isRestoreLoading, setIsRestoreLoading] = useState(false);
  const [isRestoreAlertOpen, setIsRestoreAlertOpen] = useState(false);


  const handleSheetFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
        if (selectedFile.type === "text/csv" || selectedFile.name.endsWith('.csv') || selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || selectedFile.name.endsWith('.xlsx')) {
            setSheetFile(selectedFile);
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
          const workbook = xlsx.read(data, { type: 'array', cellDates: true, dateNF: 'yyyy-mm-dd' });
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
    if (!sheetFile || !importType) {
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
      const { preview, full } = await parseFile(sheetFile);
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
  
  const triggerImport = () => {
    if (!showPreview || fullData.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Pré-visualização necessária',
        description: 'Gere e verifique a pré-visualização antes de importar.',
      });
      return;
    }

    if (replaceData) {
      setIsAlertOpen(true);
    } else {
      handleImport();
    }
  };

  const handleImport = async () => {
    setIsLoadingImport(true);

    const getColumnValue = (rowObject: {[key: string]: any}, keys: string[]): any => {
        for (const key of keys) {
            const normalizedKey = key.toLowerCase();
            const foundKey = Object.keys(rowObject).find(rowKey => rowKey.trim().toLowerCase() === normalizedKey);
            if (foundKey && rowObject[foundKey] !== undefined && rowObject[foundKey] !== null && String(rowObject[foundKey]).trim() !== '') {
                return rowObject[foundKey];
            }
        }
        return undefined;
    };

    let importedCount = 0;
    let errorCount = 0;
    const newCows: Cow[] = [];
    const newBirths: Birth[] = [];

    for (const row of fullData) {
        if (!row || row.every(cell => cell === null || cell === '')) {
            continue; 
        }

        const rowData: { [key: string]: any } = {};
        previewData.headers.forEach((header, index) => {
            if (header) {
                rowData[String(header).trim()] = row[index];
            }
        });
        
        try {
          if (importType === 'vacas') {
              const cowId = getColumnValue(rowData, ['Brinco Nº']);
              if (!cowId) {
                  errorCount++;
                  continue; 
              }

              const cowData: any = {
                  id: String(cowId),
                  animal: getColumnValue(rowData, ['Animal']),
                  origem: getColumnValue(rowData, ['Origem']),
                  farm: getColumnValue(rowData, ['Fazenda']),
                  lot: getColumnValue(rowData, ['Lote']),
                  location: getColumnValue(rowData, ['Localização', 'Local']),
                  status: getColumnValue(rowData, ['Status']),
                  registrationStatus: getColumnValue(rowData, ['Status do Cadastro']) || 'Ativo',
                  loteT: getColumnValue(rowData, ['Lote T.']),
                  obs1: getColumnValue(rowData, ['Obs: 1']),
                  motivoDoDescarte: getColumnValue(rowData, ['Motivo do Descarte']),
                  mes: getColumnValue(rowData, ['Mês']),
                  ano: getColumnValue(rowData, ['Ano']),
              };
              
              if (!cowData.animal) {
                  errorCount++;
                  continue;
              }

              Object.keys(cowData).forEach(key => {
                  if (cowData[key] === undefined) {
                    (cowData as any)[key] = undefined;
                  }
              });

              const newFarm = cowData.farm;
              if (newFarm && !settings.farms.some(f => f.name.trim().toLowerCase() === newFarm.trim().toLowerCase())) {
                  addSettingItem('farms', { id: crypto.randomUUID(), name: newFarm });
              }
              const newLot = cowData.lot;
              if (newLot && !settings.lots.some(l => l.name.trim().toLowerCase() === newLot.trim().toLowerCase())) {
                  addSettingItem('lots', { id: crypto.randomUUID(), name: newLot });
              }

              const cow = CowSchema.parse(cowData);
              if (replaceData) {
                  newCows.push(cow);
              } else {
                  addCow(cow);
              }
              importedCount++;

          } else if (importType === 'nascimentos') {
               const rawCowId = getColumnValue(rowData, ['Brinco Nº (Mãe)', 'Brinco Nº']);
               const dateValue = getColumnValue(rowData, ['Data Nascimento', 'Data Nascim', 'Data Nasc']);
               
               if (!rawCowId) {
                  errorCount++;
                  continue; 
               }
               
               let parsedDate;
               if (dateValue) {
                 if (typeof dateValue === 'number') {
                    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
                    parsedDate = new Date(excelEpoch.getTime() + dateValue * 86400000);
                 } else if (typeof dateValue === 'string') {
                     const parts = dateValue.split(/[/.-]/);
                     if (parts.length === 3) {
                        let day, month, year;
                        if (parts[1].length === 2 && parseInt(parts[1], 10) > 12) { // DD/MM/YYYY vs MM/DD/YYYY heuristic
                          day = parts[1]; month = parts[0]; year = parts[2];
                        } else {
                          day = parts[0]; month = parts[1]; year = parts[2];
                        }
                        const fullYear = year.length === 4 ? year : (parseInt(year, 10) > 50 ? `19${year}`: `20${year}`);
                        const isoDateString = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00Z`;
                        parsedDate = new Date(isoDateString);
                     } else {
                        parsedDate = new Date(dateValue);
                     }
                 } else if (dateValue instanceof Date) {
                    parsedDate = dateValue;
                 }

                 if (!parsedDate || isNaN(parsedDate.getTime())) {
                     parsedDate = undefined;
                 }
               }


               const rawSexValue = getColumnValue(rowData, ['Sexo do Bezerro', 'Sexo']);
               let sexValue: 'Macho' | 'Fêmea' | 'Aborto' | 'Não Definido' | undefined = undefined;
               
                if (typeof rawSexValue === 'string' && rawSexValue.trim() !== '') {
                    const lowerSex = rawSexValue.trim().toLowerCase();
                    if (lowerSex.startsWith('f')) {
                        sexValue = 'Fêmea';
                    } else if (lowerSex.startsWith('m')) {
                        sexValue = 'Macho';
                    } else if (lowerSex.startsWith('a')) {
                        sexValue = 'Aborto';
                    } else if (lowerSex.startsWith('n')) {
                        sexValue = 'Não Definido'
                    }
                }

               const birthData: Partial<Birth> = {
                  cowId: String(rawCowId),
                  date: parsedDate,
                  sex: sexValue,
                  breed: getColumnValue(rowData, ['Raça do Bezerro', 'Raça']),
                  sire: getColumnValue(rowData, ['Nome do Pai']),
                  lot: getColumnValue(rowData, ['Lote']),
                  farm: getColumnValue(rowData, ['Fazenda']),
                  location: getColumnValue(rowData, ['Localização', 'Local']),
                  observations: getColumnValue(rowData, ['Observações']),
                  obs1: getColumnValue(rowData, ['Obs: 1']),
                  jvvo: getColumnValue(rowData, ['JV - Vo', 'JV - Võ']),
                  animal: getColumnValue(rowData, ['Animal']),
              };
               
              Object.keys(birthData).forEach(key => {
                  const typedKey = key as keyof typeof birthData;
                  if (birthData[typedKey] === null || birthData[typedKey] === undefined) {
                      (birthData as any)[typedKey] = undefined;
                  }
              });

              const newFarm = birthData.farm;
              if (newFarm && !settings.farms.some(f => f.name.trim().toLowerCase() === newFarm.trim().toLowerCase())) {
                  addSettingItem('farms', { id: crypto.randomUUID(), name: newFarm });
              }
              const newLot = birthData.lot;
              if (newLot && !settings.lots.some(l => l.name.trim().toLowerCase() === newLot.trim().toLowerCase())) {
                  addSettingItem('lots', { id: crypto.randomUUID(), name: newLot });
              }
              const newBreed = birthData.breed;
              if (newBreed && !settings.breeds.some(b => b.name.trim().toLowerCase() === newBreed.trim().toLowerCase())) {
                   addSettingItem('breeds', { id: crypto.randomUUID(), name: newBreed });
              }

              const birth = BirthSchema.parse(birthData);
              if (replaceData) {
                  newBirths.push(birth);
              } else {
                  addBirth(birth);
              }
              importedCount++;
          }
        } catch (e) {
            errorCount++;
            console.error('Validation Error on row:', rowData, e);
        }
    }
    
    if (replaceData) {
        if (importType === 'vacas') {
            replaceCows(newCows);
        } else if (importType === 'nascimentos') {
            replaceBirths(newBirths);
        }
    }

    setIsLoadingImport(false);
    
    if (importedCount > 0 || errorCount === 0) {
        toast({
            title: 'Importação Concluída!',
            description: `${importedCount} registros importados com sucesso. ${errorCount > 0 ? `${errorCount} registros com erro.` : ''}`,
        });
    } else {
         toast({
            variant: 'destructive',
            title: 'Nenhum registro novo importado.',
            description: `Verifique se as colunas do arquivo correspondem ao esperado, se os dados já existem no sistema, ou se os dados obrigatórios estão preenchidos. ${errorCount > 0 ? `${errorCount} registros com erro.` : ''}`,
        });
    }

    setSheetFile(null);
    setImportType("");
    setShowPreview(false);
    setPreviewData({ headers: [], rows: [] });
    setFullData([]);
    const fileInput = document.getElementById('sheet-file-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  };

  const handleExportAllData = () => {
    try {
      const allData = {
        cows: data,
        births,
        iatfs
      };
      const jsonString = JSON.stringify(allData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().slice(0, 10);
      link.download = `dois-backup-${date}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: 'Exportação Concluída',
        description: 'O backup do banco de dados foi baixado com sucesso.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro na Exportação',
        description: 'Não foi possível exportar os dados.',
      });
      console.error('Export error:', error);
    }
  };

  const handleBackupFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/json' || selectedFile.name.endsWith('.json')) {
        setBackupFile(selectedFile);
      } else {
        toast({
          variant: 'destructive',
          title: 'Tipo de arquivo inválido',
          description: 'Por favor, selecione um arquivo de backup .json.',
        });
        event.target.value = '';
      }
    }
  };

  const triggerRestore = () => {
    if (!backupFile) {
      toast({
        variant: 'destructive',
        title: 'Nenhum arquivo selecionado',
        description: 'Por favor, selecione um arquivo de backup para restaurar.',
      });
      return;
    }
    setIsRestoreAlertOpen(true);
  };

  const handleRestoreData = () => {
    if (!backupFile) return;

    setIsRestoreLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const restoredData = JSON.parse(text);
        
        // Basic validation to check if it looks like our data structure
        if ('cows' in restoredData && 'births' in restoredData && 'iatfs' in restoredData) {
          replaceAllData(restoredData);
          toast({
            title: 'Restauração Concluída!',
            description: 'Os dados foram restaurados com sucesso a partir do backup.',
          });
          setBackupFile(null);
          const fileInput = document.getElementById('backup-file-upload') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
        } else {
          throw new Error('Formato de arquivo de backup inválido.');
        }

      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Erro na Restauração',
          description: 'O arquivo de backup é inválido ou está corrompido. Nenhuma alteração foi feita.',
        });
        console.error('Restore error:', error);
      } finally {
        setIsRestoreLoading(false);
      }
    };
    reader.onerror = () => {
       toast({
          variant: 'destructive',
          title: 'Erro de Leitura',
          description: 'Não foi possível ler o arquivo selecionado.',
        });
       setIsRestoreLoading(false);
    }
    reader.readAsText(backupFile);
  };

  return (
    <>
      <main className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Importar e Exportar Dados
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
                  <Label htmlFor="sheet-file-upload">Arquivo (CSV, XLSX)</Label>
                  <Input id="sheet-file-upload" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .xlsx" onChange={handleSheetFileChange} disabled={isLoadingPreview || isLoadingImport} />
              </div>
            </div>
            {sheetFile && (
              <div className="text-sm text-muted-foreground">
                  Arquivo selecionado: <span className="font-medium">{sheetFile.name}</span>
              </div>
              )}
              <div className="flex items-center space-x-2">
                  <Switch 
                    id="replace-data" 
                    checked={replaceData} 
                    onCheckedChange={setReplaceData} 
                    disabled={isLoadingPreview || isLoadingImport}
                  />
                  <Label htmlFor="replace-data">Substituir dados existentes na importação da planilha</Label>
              </div>

          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t pt-6">
              <Button onClick={handlePreview} variant="outline" disabled={!sheetFile || !importType || isLoadingPreview || isLoadingImport}>
                  {isLoadingPreview ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
                  Pré-visualizar
              </Button>
              <Button onClick={triggerImport} disabled={!showPreview || fullData.length === 0 || isLoadingImport || isLoadingPreview}>
              {isLoadingImport ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                  <Upload className="mr-2 h-4 w-4" />
              )}
              Importar Planilha
            </Button>
          </CardFooter>
        </Card>
        
        {showPreview && (
          <Card className="w-full max-w-3xl mx-auto mt-6">
              <CardHeader>
                  <CardTitle>Pré-visualização dos Dados da Planilha</CardTitle>
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
                                  {previewData.headers.map((header, index) => <TableHead key={`${header}-${index}`}>{header}</TableHead>)}
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

        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Backup e Restauração</CardTitle>
            <CardDescription>
             Salve todos os dados do aplicativo em um arquivo ou restaure-os a partir de um backup.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="p-4 border rounded-md">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold">Exportar Banco de Dados</h3>
                        <p className="text-sm text-muted-foreground">Baixe um arquivo .json com todos os seus dados.</p>
                    </div>
                    <Button onClick={handleExportAllData}>
                        <Download className="mr-2 h-4 w-4"/>
                        Exportar
                    </Button>
                </div>
            </div>
             <div className="p-4 border rounded-md space-y-4">
                <div>
                    <h3 className="font-semibold">Importar Banco de Dados</h3>
                    <p className="text-sm text-muted-foreground">Restaure seus dados de um arquivo de backup .json. Isso substituirá TODOS os dados atuais.</p>
                </div>
                 <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="backup-file-upload">Arquivo de Backup (.json)</Label>
                  <Input id="backup-file-upload" type="file" accept=".json" onChange={handleBackupFileChange} disabled={isRestoreLoading} />
              </div>
                {backupFile && (
                <div className="text-sm text-muted-foreground">
                    Arquivo selecionado: <span className="font-medium">{backupFile.name}</span>
                </div>
                )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t pt-6">
              <Button onClick={triggerRestore} disabled={!backupFile || isRestoreLoading}>
              {isRestoreLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                  <UploadCloud className="mr-2 h-4 w-4" />
              )}
              Restaurar Backup
            </Button>
          </CardFooter>
        </Card>

      </main>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é irreversível. Todos os registros de 
              <span className="font-bold"> {importType === 'vacas' ? 'vacas' : 'nascimentos'} </span>
              existentes serão <span className="font-bold text-destructive">excluídos permanentemente</span> e substituídos pelos dados da planilha. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setIsAlertOpen(false);
              handleImport();
            }}>
              Sim, substituir dados
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isRestoreAlertOpen} onOpenChange={setIsRestoreAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Restauração?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é irreversível. <span className="font-bold text-destructive">Todos os dados atuais serão apagados</span> e substituídos pelos dados do arquivo de backup. Você tem certeza de que deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setIsRestoreAlertOpen(false);
              handleRestoreData();
            }}>
              Sim, Restaurar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```

---
## src/app/layout.tsx
---

```tsx
import type { Metadata } from "next";
import { PT_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from "@/components/layout/app-layout";
import { SettingsProvider } from "@/contexts/settings-context";
import { DataProvider } from "@/contexts/data-context";
import { AuthProvider } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "DOIS - Controle de Vacas Paridas",
  description: "Gestão de gado de corte: nascimentos, IATF, lotes e mais.",
  manifest: "/manifest.json",
};

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn("font-body antialiased", ptSans.variable)}>
        <div className="aurora-bg" />
         <AuthProvider>
            <SettingsProvider>
            <DataProvider>
                <AppLayout>{children}</AppLayout>
                <Toaster />
            </DataProvider>
            </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

---
## src/app/login/page.tsx
---

```tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulação de login
    setTimeout(() => {
      login();
      toast({
        title: "Login bem-sucedido!",
        description: "Você será redirecionado para o dashboard.",
      });
      router.push('/');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center p-4">
      <Image
        src="/imagem login.png"
        alt="Paisagem de uma fazenda ao amanhecer"
        layout="fill"
        objectFit="cover"
        className="-z-10"
      />
      <div className="absolute inset-0 bg-black/50 -z-10" />

      <Card className="w-full max-w-sm">
        <form onSubmit={handleLogin}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Image src="/Icone DOIS.png" alt="DOIS Logo" width={80} height={80} />
            </div>
            <CardTitle className="text-2xl font-headline">Acessar o Sistema</CardTitle>
            <CardDescription>Use suas credenciais para entrar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Entrar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
```

---
## src/app/page.tsx
---

```tsx
"use client";

import { Baby, Beaker, CalendarClock, PlusCircle, Users } from "lucide-react";
import Link from "next/link";
import { useData } from "@/contexts/data-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalvingPredictionCard } from "@/components/calving-prediction-card";
import { BirthsByFarmChart } from "@/components/charts/births-by-farm-chart";
import { BirthsBySexChart } from "@/components/charts/births-by-sex-chart";
import { useMemo } from "react";
import { format, isSameYear } from "date-fns";

export default function Dashboard() {
  const { data: cows, births, iatfs } = useData();

  const dashboardData = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();

    const birthsThisYear = births.filter(
      (b) => b.date && isSameYear(b.date, today)
    );

    const checkedIatfs = iatfs.filter((i) => i.result === "Prenha" || i.result === "Vazia");
    const pregnantIatfs = checkedIatfs.filter((i) => i.result === "Prenha");
    const pregnancyRate = checkedIatfs.length > 0 ? (pregnantIatfs.length / checkedIatfs.length) * 100 : 0;
    
    const activeCows = cows.filter(c => c.registrationStatus === 'Ativo');

    const nextCalving = iatfs
      .filter((i) => i.result === "Prenha" && i.inseminationDate)
      .map((i) => {
        const calvingDate = new Date(i.inseminationDate!);
        calvingDate.setDate(calvingDate.getDate() + 283);
        return calvingDate;
      })
      .filter((date) => date >= today)
      .sort((a, b) => a.getTime() - b.getTime())[0];

    const birthsBySex = births
      .filter(b => b.sex === 'Macho' || b.sex === 'Fêmea')
      .reduce((acc, birth) => {
        const sex = birth.sex!;
        acc[sex] = (acc[sex] || 0) + 1;
        return acc;
      }, {} as Record<"Macho" | "Fêmea", number>);

     const birthsByFarm = births.reduce((acc, birth) => {
      const farm = birth.farm || "Não informada";
      acc[farm] = (acc[farm] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      birthsThisYear: birthsThisYear.length,
      pregnancyRate: pregnancyRate.toFixed(0),
      totalCows: activeCows.length,
      nextCalvingDate: nextCalving,
      birthsBySexData: [
        { sex: "Macho", count: birthsBySex.Macho || 0, fill: "hsl(var(--chart-2))" },
        { sex: "Fêmea", count: birthsBySex.Fêmea || 0, fill: "hsl(var(--primary))" },
      ],
      birthsByFarmData: Object.entries(birthsByFarm).map(([farm, count], index) => ({
        farm,
        births: count,
        fill: `hsl(var(--chart-${(index % 5) + 1}))`,
      })),
    };
  }, [cows, births, iatfs]);

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Dashboard
        </h1>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/births/new">
              <PlusCircle /> Novo Nascimento
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/iaths/new">
              <PlusCircle /> Nova IATF
            </Link>
          </Button>
           <Button variant="secondary" asChild>
            <Link href="/cows/new">
              <PlusCircle /> Nova Vaca
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nascimentos no Ano
            </CardTitle>
            <Baby className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.birthsThisYear}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.birthsThisYear > 0
                ? `${dashboardData.birthsThisYear} nascimento(s) em ${new Date().getFullYear()}`
                : "Nenhum nascimento registrado ainda"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Prenhez</CardTitle>
            <Beaker className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.pregnancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              Baseado em IATFs checadas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vacas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalCows}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.totalCows > 0
                ? `${dashboardData.totalCows} animais ativos no rebanho`
                : "Nenhuma vaca registrada"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Parto</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
               {dashboardData.nextCalvingDate
                ? format(dashboardData.nextCalvingDate, "dd/MM/yyyy")
                : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.nextCalvingDate
                ? "Data de parto mais próxima"
                : "Nenhuma previsão disponível"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral de Nascimentos</CardTitle>
            <CardDescription>
              Nascimentos por fazenda no último ano.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <BirthsByFarmChart data={dashboardData.birthsByFarmData} />
          </CardContent>
        </Card>
        <div className="col-span-4 lg:col-span-3 flex flex-col gap-4">
          <CalvingPredictionCard />
          <Card className="flex-grow">
            <CardHeader>
              <CardTitle>Nascimentos por Sexo</CardTitle>
              <CardDescription>
                Distribuição de machos e fêmeas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BirthsBySexChart data={dashboardData.birthsBySexData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
```

---
## src/app/settings/page.tsx
---

```tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/settings-context";
import { type Item, type Category } from "@/lib/data-schemas";

const categoryLabels: Record<Category, { singular: string; plural: string }> = {
  lots: { singular: "Lote", plural: "Lotes" },
  pastures: { singular: "Pasto", plural: "Pastos" },
  farms: { singular: "Fazenda", plural: "Fazendas" },
  breeds: { singular: "Raça", plural: "Raças" },
};

export default function SettingsPage() {
  const { toast } = useToast();
  const { settings, addSettingItem, deleteSettingItem } = useSettings();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ category: Category; itemId: string; itemName: string } | null>(null);
  const [dialogCategory, setDialogCategory] = useState<Category | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleOpenDialog = (category: Category) => {
    setDialogCategory(category);
    setIsDialogOpen(true);
    setNewItemName("");
  };

  const handleAddItem = () => {
    if (!newItemName.trim() || !dialogCategory) return;
    
    addSettingItem(dialogCategory, { id: crypto.randomUUID(), name: newItemName.trim() });
    
    toast({
      title: "Sucesso!",
      description: `${categoryLabels[dialogCategory].singular} "${newItemName.trim()}" adicionado(a).`,
    });

    setIsDialogOpen(false);
  };
  
  const openDeleteConfirmDialog = (category: Category, itemId: string, itemName: string) => {
    setItemToDelete({ category, itemId, itemName });
    setIsAlertOpen(true);
  };

  const handleDeleteItem = () => {
    if (!itemToDelete) return;

    deleteSettingItem(itemToDelete.category, itemToDelete.itemId);

    toast({
      title: "Item Excluído",
      description: `O item "${itemToDelete.itemName}" foi removido com sucesso.`,
    });

    setIsAlertOpen(false);
    setItemToDelete(null);
  };

  const renderTable = (category: Category) => {
    const items = settings[category];
    const labels = categoryLabels[category];

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{labels.plural} Cadastrados</CardTitle>
          <Button onClick={() => handleOpenDialog(category)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo(a) {labels.singular}
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do {labels.singular}</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">
                       <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteConfirmDialog(category, item.id, item.name)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center">
                    Nenhum(a) {labels.singular.toLowerCase()} cadastrado(a).
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Configurações
        </h1>
        <p className="text-muted-foreground">
          Gerencie as configurações e cadastros básicos do sistema.
        </p>

        {isClient && (
          <Tabs defaultValue="lots">
            <TabsList>
              <TabsTrigger value="lots">Lotes</TabsTrigger>
              <TabsTrigger value="pastures">Pastos</TabsTrigger>
              <TabsTrigger value="farms">Fazendas</TabsTrigger>
              <TabsTrigger value="breeds">Raças</TabsTrigger>
            </TabsList>

            <TabsContent value="lots">{renderTable("lots")}</TabsContent>
            <TabsContent value="pastures">{renderTable("pastures")}</TabsContent>
            <TabsContent value="farms">{renderTable("farms")}</TabsContent>
            <TabsContent value="breeds">{renderTable("breeds")}</TabsContent>
          </Tabs>
        )}
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo(a) {dialogCategory ? categoryLabels[dialogCategory].singular : ''}</DialogTitle>
            <DialogDescription>
              Insira o nome para o novo item e clique em salvar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleAddItem}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o item
              <span className="font-bold"> "{itemToDelete?.itemName}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```

---
## src/components/bulk-update-birth-dialog.tsx
---

```tsx
"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useSettings } from "@/contexts/settings-context"
import { useData } from "@/contexts/data-context"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface BulkUpdateBirthDialogProps {
  isOpen: boolean
  onClose: () => void
  birthsToUpdate: string[]
  onSuccess: () => void
}

export default function BulkUpdateBirthDialog({ isOpen, onClose, birthsToUpdate, onSuccess }: BulkUpdateBirthDialogProps) {
  const { settings } = useSettings()
  const { updateBirthsLotAndSex } = useData()
  const { toast } = useToast()
  const [selectedLot, setSelectedLot] = React.useState<string | undefined>(undefined)
  const [selectedSex, setSelectedSex] = React.useState<'Macho' | 'Fêmea' | 'Aborto' | 'Não Definido' | undefined>(undefined)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleUpdate = () => {
    if (!selectedLot && !selectedSex) {
      toast({
        variant: "destructive",
        title: "Nenhuma alteração selecionada",
        description: "Por favor, selecione um lote ou um sexo para atualizar.",
      })
      return
    }

    setIsLoading(true)
    try {
      updateBirthsLotAndSex(birthsToUpdate, selectedLot, selectedSex)
      toast({
        title: "Sucesso!",
        description: `${birthsToUpdate.length} registro(s) de nascimento atualizado(s).`,
      })
      onSuccess()
      onClose()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na Atualização",
        description: "Não foi possível atualizar os registros selecionados.",
      })
    } finally {
      setIsLoading(false)
      setSelectedLot(undefined)
      setSelectedSex(undefined)
    }
  }

  React.useEffect(() => {
    if (!isOpen) {
        setSelectedLot(undefined);
        setSelectedSex(undefined);
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar Nascimentos em Massa</DialogTitle>
          <DialogDescription>
            Você selecionou {birthsToUpdate.length} nascimento(s). Escolha os novos valores para aplicar a todos.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lot" className="text-right">
              Lote
            </Label>
            <div className="col-span-3">
              <Select value={selectedLot} onValueChange={setSelectedLot}>
                <SelectTrigger id="lot">
                  <SelectValue placeholder="Selecione o lote..." />
                </SelectTrigger>
                <SelectContent>
                  {settings.lots.map((lot) => (
                    <SelectItem
                      key={`${lot.id}-${lot.name}`}
                      value={lot.name}
                    >
                      {lot.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sex" className="text-right">
              Sexo do Bezerro
            </Label>
            <div className="col-span-3">
              <Select value={selectedSex} onValueChange={setSelectedSex as (value: string) => void}>
                <SelectTrigger id="sex">
                  <SelectValue placeholder="Selecione o sexo..." />
                </SelectTrigger>
                 <SelectContent>
                    <SelectItem value="Macho">Macho</SelectItem>
                    <SelectItem value="Fêmea">Fêmea</SelectItem>
                    <SelectItem value="Aborto">Aborto</SelectItem>
                    <SelectItem value="Não Definido">Não Definido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleUpdate} disabled={isLoading || (!selectedLot && !selectedSex)}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

---
## src/components/bulk-update-lot-dialog.tsx
---

```tsx
"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useSettings } from "@/contexts/settings-context"
import { useData } from "@/contexts/data-context"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface BulkUpdateLotDialogProps {
  isOpen: boolean
  onClose: () => void
  cowIds: string[]
  onSuccess: () => void
}

export default function BulkUpdateLotDialog({ isOpen, onClose, cowIds, onSuccess }: BulkUpdateLotDialogProps) {
  const { settings } = useSettings()
  const { updateCowsLot } = useData()
  const { toast } = useToast()
  const [selectedLot, setSelectedLot] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleUpdate = () => {
    if (!selectedLot) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, selecione um lote de destino.",
      })
      return
    }

    setIsLoading(true)
    try {
      updateCowsLot(cowIds, selectedLot)
      toast({
        title: "Sucesso!",
        description: `${cowIds.length} vaca(s) atualizada(s) para o lote "${selectedLot}".`,
      })
      onSuccess()
      onClose()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na Atualização",
        description: "Não foi possível atualizar o lote das vacas selecionadas.",
      })
    } finally {
      setIsLoading(false)
      setSelectedLot("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar Lote em Massa</DialogTitle>
          <DialogDescription>
            Você selecionou {cowIds.length} vaca(s). Escolha o novo lote para
            aplicar a todas.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lot" className="text-right">
              Lote de Destino
            </Label>
            <div className="col-span-3">
              <Select value={selectedLot} onValueChange={setSelectedLot}>
                <SelectTrigger id="lot">
                  <SelectValue placeholder="Selecione o lote..." />
                </SelectTrigger>
                <SelectContent>
                  {settings.lots.map((lot) => (
                    <SelectItem
                      key={`${lot.id}-${lot.name}`}
                      value={lot.name}
                    >
                      {lot.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleUpdate} disabled={isLoading || !selectedLot}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

---
## src/components/calving-prediction-card.tsx
---

```tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { predictCalvingDate, type PredictCalvingDateOutput } from "@/ai/flows/calving-prediction";
import { useToast } from "@/hooks/use-toast";

const FormSchema = z.object({
  inseminationDate: z.date({
    required_error: "A data de inseminação é obrigatória.",
  }),
});

type FormValues = z.infer<typeof FormSchema>;

export function CalvingPredictionCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictCalvingDateOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    setPrediction(null);
    try {
      const result = await predictCalvingDate({
        inseminationDate: format(data.inseminationDate, "yyyy-MM-dd"),
      });
      setPrediction(result);
    } catch (error) {
      console.error("Prediction failed:", error);
      toast({
        variant: "destructive",
        title: "Erro na Previsão",
        description: "Não foi possível calcular a previsão de parto. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Sparkles className="text-primary" />
              Previsão de Parto
            </CardTitle>
            <CardDescription>
              Insira a data de inseminação para prever a data do parto.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="inseminationDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Inseminação</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>Escolha uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("2000-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {prediction && (
               <div className="p-4 bg-secondary/50 rounded-lg border border-secondary text-center space-y-2">
                <p className="text-sm text-muted-foreground">Data provável do parto</p>
                <p className="text-2xl font-bold text-accent">{format(new Date(prediction.predictedCalvingDate + 'T00:00:00'), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                <p className="text-sm text-muted-foreground">
                  Faltam aproximadamente <span className="font-bold">{prediction.daysUntilCalving} dias</span>
                </p>
                {prediction.isNearCalving && (
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-500 animate-pulse">
                        Atenção: Parto próximo!
                    </p>
                )}
               </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Prever Data
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
```

---
## src/components/charts/births-by-farm-chart.tsx
---

```tsx
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  births: {
    label: "Nascimentos",
  },
} satisfies ChartConfig

interface BirthsByFarmChartProps {
  data: { farm: string; births: number; fill: string }[];
}


export function BirthsByFarmChart({ data }: BirthsByFarmChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[250px] text-muted-foreground">
        Nenhum dado de nascimento para exibir.
      </div>
    )
  }
  
  const dynamicChartConfig = data.reduce((acc, item) => {
    acc[item.farm] = {
      label: item.farm,
      color: item.fill
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <ChartContainer config={{...chartConfig, ...dynamicChartConfig}} className="min-h-[200px] w-full">
      <ResponsiveContainer>
        <BarChart data={data} accessibilityLayer>
          <XAxis
            dataKey="farm"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            fontSize={12}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tickFormatter={(value) => `${value}`}
            allowDecimals={false}
          />
          <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
          <Bar dataKey="births" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
```

---
## src/components/charts/births-by-sex-chart.tsx
---

```tsx
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent
} from "@/components/ui/chart"


const chartConfig = {
  count: {
    label: "Contagem",
  },
  Macho: {
    label: "Macho",
    color: "hsl(var(--chart-2))",
  },
  Fêmea: {
    label: "Fêmea",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

interface BirthsBySexChartProps {
  data: { sex: string; count: number; fill: string }[];
}

export function BirthsBySexChart({ data }: BirthsBySexChartProps) {
    if (!data || data.every(d => d.count === 0)) {
    return (
      <div className="flex items-center justify-center h-[250px] text-muted-foreground">
        Nenhum dado para exibir.
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" accessibilityLayer>
           <YAxis
            dataKey="sex"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            fontSize={12}
            width={80}
          />
          <XAxis type="number" hide />
          <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
           <Legend content={<ChartLegendContent />} />
          <Bar dataKey="count" radius={5} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
```

---
## src/components/discard-cow-dialog.tsx
---

```tsx
"use client"

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useData } from "@/contexts/data-context";
import { useToast } from "@/hooks/use-toast";
import type { Cow } from "@/lib/data-schemas";
import { Textarea } from "./ui/textarea";

interface DiscardCowDialogProps {
  cow: Cow | null;
  isOpen: boolean;
  onClose: () => void;
}

const DiscardCowSchema = z.object({
  motivoDoDescarte: z.string().min(1, "O motivo do descarte é obrigatório."),
  mes: z.string().optional(),
  ano: z.string().optional(),
});

type FormValues = z.infer<typeof DiscardCowSchema>;

export default function DiscardCowDialog({ cow, isOpen, onClose }: DiscardCowDialogProps) {
  const { updateCow } = useData();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(DiscardCowSchema),
  });
  
  useEffect(() => {
    if (cow) {
      form.reset({
        motivoDoDescarte: cow.motivoDoDescarte || "",
        mes: cow.mes || "",
        ano: cow.ano || "",
      });
    }
  }, [cow, form]);

  const handleDiscard = (data: FormValues) => {
    if (!cow) return;

    const updatedCowData: Cow = {
      ...cow,
      registrationStatus: "Inativo",
      motivoDoDescarte: data.motivoDoDescarte,
      mes: data.mes,
      ano: data.ano,
    };
    
    updateCow(cow.id, updatedCowData);
    
    toast({
      title: "Vaca Descartada!",
      description: `A vaca com brinco Nº ${cow.id} foi marcada como inativa.`,
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Descartar Vaca: {cow?.id}</DialogTitle>
          <DialogDescription>
            Descreva o motivo do descarte. O status do cadastro será alterado para "Inativo".
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleDiscard)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="motivoDoDescarte"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo do Descarte</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex: Venda, Idade avançada, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="mes"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Mês</FormLabel>
                        <FormControl>
                        <Input placeholder="Ex: 08" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="ano"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ano</FormLabel>
                        <FormControl>
                        <Input placeholder="Ex: 2024" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Confirmar Descarte</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

---
## src/components/edit-birth-dialog.tsx
---

```tsx
"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { useSettings } from "@/contexts/settings-context"
import { useData } from "@/contexts/data-context"
import { BirthSchema, type Birth } from "@/lib/data-schemas"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Textarea } from "./ui/textarea"
import { Calendar } from "@/components/ui/calendar"


type FormValues = z.infer<typeof BirthSchema>;

interface EditBirthDialogProps {
    birth: Birth | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function EditBirthDialog({ birth, isOpen, onClose }: EditBirthDialogProps) {
  const { toast } = useToast()
  const { settings } = useSettings();
  const { data: cows, updateBirth } = useData();

  const form = useForm<FormValues>({
    resolver: zodResolver(BirthSchema),
    defaultValues: birth || {},
  });
  
  useEffect(() => {
    if (birth) {
      form.reset({
        ...birth,
        date: birth.date ? new Date(birth.date) : undefined
      });
    }
  }, [birth, form]);

  function onSubmit(data: FormValues) {
    if (!birth?.id) return;
    updateBirth(birth.id, data);
    toast({
      title: "Sucesso!",
      description: "Dados do nascimento atualizados.",
    })
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
                <DialogTitle>Editar Nascimento: Vaca {birth?.cowId}</DialogTitle>
                <DialogDescription>
                    Altere os dados e clique em salvar para atualizar o registro.
                </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="pt-6 grid gap-4 md:grid-cols-3">
                 <FormField
                    control={form.control}
                    name="cowId"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Brinco Nº (Mãe)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Selecione a vaca..." />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {cows.map(cow => (
                            <SelectItem key={cow.id} value={cow.id}>
                                {cow.id} ({cow.farm})
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Data de Nascimento</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                                )}
                            >
                                {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                                ) : (
                                <span>Escolha uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                                date > new Date() || date < new Date("2020-01-01")
                            }
                            initialFocus
                            />
                        </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="sex"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Sexo do Bezerro</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Selecione o sexo..." />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Macho">Macho</SelectItem>
                            <SelectItem value="Fêmea">Fêmea</SelectItem>
                            <SelectItem value="Aborto">Aborto</SelectItem>
                            <SelectItem value="Não Definido">Não Definido</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="breed"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Raça do Bezerro</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Selecione a raça..." />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {settings.breeds.map((breed) => (
                            <SelectItem key={`${breed.id}-${breed.name}`} value={breed.name}>{breed.name}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="sire"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nome do Pai</FormLabel>
                        <FormControl>
                        <Input placeholder="Ex: Comprou Prenha" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lot"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Lote</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Selecione o lote..." />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {settings.lots.map((lot) => (
                            <SelectItem key={`${lot.id}-${lot.name}`} value={lot.name}>{lot.name}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="farm"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Fazenda</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Selecione a fazenda..." />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {settings.farms.map(farm => (
                            <SelectItem key={`${farm.id}-${farm.name}`} value={farm.name}>{farm.name}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Localização</FormLabel>
                        <FormControl>
                        <Input placeholder="Ex: Pasto da Represa" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="obs1"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Obs: 1</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="jvvo"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>JV - Vo</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="observations"
                    render={({ field }) => (
                    <FormItem className="md:col-span-3">
                        <FormLabel>Observações Gerais</FormLabel>
                        <FormControl>
                        <Textarea
                            placeholder="Alguma observação sobre o nascimento..."
                            className="resize-none"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
                <DialogFooter className="border-t pt-4 mt-4">
                     <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button type="submit">Salvar Alterações</Button>
                </DialogFooter>
            </form>
            </Form>
        </DialogContent>
    </Dialog>
  );
}
```

---
## src/components/edit-cow-dialog.tsx
---

```tsx
"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useSettings } from "@/contexts/settings-context"
import { useData } from "@/contexts/data-context"
import { CowSchema, type Cow } from "@/lib/data-schemas"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

type FormValues = z.infer<typeof CowSchema>;

const statuses: string[] = ["Vazia", "Prenha", "Com cria"];
const origins: string[] = ["Nascimento", "Compra", "Transferência"];
const registrationStatuses: string[] = ["Ativo", "Inativo"];

interface EditCowDialogProps {
    cow: Cow | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function EditCowDialog({ cow, isOpen, onClose }: EditCowDialogProps) {
  const { toast } = useToast()
  const { settings } = useSettings();
  const { updateCow } = useData();

  const form = useForm<FormValues>({
    resolver: zodResolver(CowSchema),
    defaultValues: cow || {},
  });
  
  useEffect(() => {
    if (cow) {
      form.reset(cow);
    }
  }, [cow, form]);

  function onSubmit(data: FormValues) {
    if (!cow) return;
    updateCow(cow.id, data);
    toast({
      title: "Sucesso!",
      description: "Dados da vaca atualizados.",
    })
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
                <DialogTitle>Editar Vaca: {cow?.id}</DialogTitle>
                <DialogDescription>
                    Altere os dados e clique em salvar para atualizar o registro.
                </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="pt-6 grid gap-4 md:grid-cols-3">
                <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Brinco Nº</FormLabel>
                        <FormControl>
                        <Input placeholder="Ex: 826" {...field} disabled />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="animal"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Animal</FormLabel>
                        <FormControl>
                        <Input placeholder="Ex: Bezerras 2024" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="origem"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Origem</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Selecione a origem..." />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {origins.map((origin) => (
                            <SelectItem key={origin} value={origin}>{origin}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="farm"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Fazenda</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Selecione a fazenda..." />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {settings.farms.map((farm) => (
                            <SelectItem key={`${farm.id}-${farm.name}`} value={farm.name}>{farm.name}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="lot"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Lote</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Selecione o lote..." />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {settings.lots.map((lot) => (
                            <SelectItem key={`${lot.id}-${lot.name}`} value={lot.name}>{lot.name}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Localização</FormLabel>
                        <FormControl>
                        <Input placeholder="Ex: Pasto Palhada" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Selecione o status..." />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {statuses.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="registrationStatus"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Status do Cadastro</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Selecione o status..." />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {registrationStatuses.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="loteT"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Lote T.</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="obs1"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Obs: 1</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="motivoDoDescarte"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Motivo do Descarte</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="mes"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Mês</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="ano"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ano</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
                <DialogFooter className="border-t pt-4 mt-4">
                    <Button type="submit">Salvar Alterações</Button>
                </DialogFooter>
            </form>
            </Form>
        </DialogContent>
    </Dialog>
  );
}
```

---
## src/components/edit-iatf-dialog.tsx
---

```tsx
"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { useData } from "@/contexts/data-context"
import { IATFSchema, type IATF } from "@/lib/data-schemas"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

type FormValues = z.infer<typeof IATFSchema>;

interface EditIATFDialogProps {
    iatf: IATF | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function EditIATFDialog({ iatf, isOpen, onClose }: EditIATFDialogProps) {
  const { toast } = useToast()
  const { data: cows, updateIATF } = useData();

  const form = useForm<FormValues>({
    resolver: zodResolver(IATFSchema),
    defaultValues: iatf || {},
  });
  
  useEffect(() => {
    if (iatf) {
      form.reset({
        ...iatf,
        inseminationDate: iatf.inseminationDate ? new Date(iatf.inseminationDate) : undefined,
        diagnosisDate: iatf.diagnosisDate ? new Date(iatf.diagnosisDate) : undefined,
      });
    }
  }, [iatf, form]);

  function onSubmit(data: FormValues) {
    if (!iatf?.id) return;
    updateIATF(iatf.id, data);
    toast({
      title: "Sucesso!",
      description: "Dados do IATF atualizados.",
    })
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
                <DialogTitle>Editar IATF: Vaca {iatf?.cowId}</DialogTitle>
                <DialogDescription>
                    Altere os dados e clique em salvar para atualizar o registro.
                </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="pt-6 grid gap-4 md:grid-cols-2">
                 <FormField
                    control={form.control}
                    name="cowId"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Brinco Nº (Vaca)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Selecione a vaca..." />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {cows.map(cow => (
                            <SelectItem key={cow.id} value={cow.id}>
                                {cow.id} ({cow.farm})
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="inseminationDate"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Data de Inseminação</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                                )}
                            >
                                {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                                ) : (
                                <span>Escolha uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                                date > new Date() || date < new Date("2020-01-01")
                            }
                            initialFocus
                            />
                        </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bull"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Touro</FormLabel>
                        <FormControl>
                        <Input placeholder="Nome ou código do touro" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="protocol"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Protocolo</FormLabel>
                        <FormControl>
                        <Input placeholder="Protocolo utilizado" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="diagnosisDate"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Data do Diagnóstico</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                                )}
                            >
                                {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                                ) : (
                                <span>Escolha uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            />
                        </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="result"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Resultado</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Selecione o resultado..." />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Prenha">Prenha</SelectItem>
                            <SelectItem value="Vazia">Vazia</SelectItem>
                            <SelectItem value="Não checado">Não checado</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
                <DialogFooter className="border-t pt-4 mt-4">
                     <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button type="submit">Salvar Alterações</Button>
                </DialogFooter>
            </form>
            </Form>
        </DialogContent>
    </Dialog>
  );
}
```

---
## src/components/layout/app-layout.tsx
---

```tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import Header from "./header";

function AuthLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
             <div className="flex h-screen w-full items-center justify-center">
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            </div>
        );
    }
    
    if (!isAuthenticated) {
        return null;
    }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}


export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return <AuthLayout>{children}</AuthLayout>;
}
```

---
## src/components/layout/header.tsx
---

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Import,
  Settings,
  Users,
  Baby,
  Beaker,
  LogOut,
  Menu,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/cows", icon: Users, label: "Vacas" },
  { href: "/births", icon: Baby, label: "Nascimentos" },
  { href: "/iaths", icon: Beaker, label: "IATF" },
  { href: "/import", icon: Import, label: "Importar" },
  { href: "/settings", icon: Settings, label: "Configurações" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image 
        src="/Icone DOIS.png" 
        alt="DOIS Logo" 
        width={48} 
        height={48} 
        className="h-12 w-12"
      />
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container relative flex h-auto flex-col items-center justify-center gap-2 py-4">
        {/* Desktop Layout */}
        <div className="hidden w-full flex-col items-center gap-2 md:flex">
            <Logo />
            <nav className="flex items-center gap-1">
                {navItems.map((item) => (
                    <Button key={item.href} asChild variant="ghost" className={cn(pathname === item.href ? "text-primary" : "text-muted-foreground", "transition-colors")}>
                        <Link href={item.href}>{item.label}</Link>
                    </Button>
                ))}
            </nav>
        </div>
        <Button variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:inline-flex" onClick={handleLogout} title="Sair">
            <LogOut className="h-5 w-5" />
        </Button>

        {/* Mobile Layout */}
        <div className="flex w-full items-center justify-between md:hidden">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex h-full flex-col p-0">
                <div className="p-4 border-b">
                   <Logo />
                </div>
                <nav className="flex-1 grid gap-2 p-4">
                  {navItems.map((item) => (
                     <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                             pathname === item.href && "bg-muted text-primary"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                    </SheetClose>
                  ))}
                </nav>
                 <div className="mt-auto p-4 border-t">
                    <Button className="w-full justify-start gap-3" variant="ghost" onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
                        Sair
                    </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex-1 flex justify-center">
            <Logo />
          </div>
           <div className="w-10"></div>
        </div>
      </div>
    </header>
  );
}
```

---
## src/components/pagination.tsx
---

```tsx
"use client"

import * as React from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "./ui/button";

interface PaginationComponentProps {
    pageCount: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
}

export function PaginationComponent({ 
    pageCount, 
    currentPage, 
    onPageChange,
    siblingCount = 1 
}: PaginationComponentProps) {
    const paginationRange = React.useMemo(() => {
        const totalPageNumbers = siblingCount + 5; 

        if (totalPageNumbers >= pageCount) {
            return Array.from({ length: pageCount }, (_, i) => i + 1);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, pageCount);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < pageCount - 2;

        const firstPageIndex = 1;
        const lastPageIndex = pageCount;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
            return [...leftRange, -1, pageCount];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = Array.from({ length: rightItemCount }, (_, i) => pageCount - rightItemCount + i + 1);
            return [firstPageIndex, -1, ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = [];
            for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
                middleRange.push(i);
            }
            return [firstPageIndex, -1, ...middleRange, -1, lastPageIndex];
        }
        return []; 
    }, [pageCount, currentPage, siblingCount]);

    if (pageCount <= 1) {
        return null;
    }
  
    const onNext = () => {
        if (currentPage < pageCount) {
            onPageChange(currentPage + 1);
        }
    };

    const onPrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <Button 
                        variant="ghost" 
                        onClick={onPrevious} 
                        disabled={currentPage === 1}
                        className="gap-1 pl-2.5"
                    >
                        <PaginationPrevious className="h-4 w-4" />
                        <span className="sr-only">Anterior</span>
                    </Button>
                </PaginationItem>
                {paginationRange.map((pageNumber, index) => {
                    if (pageNumber === -1) {
                        return <PaginationItem key={`ellipsis-${index}`}><PaginationEllipsis /></PaginationItem>;
                    }
                    return (
                        <PaginationItem key={pageNumber}>
                            <PaginationLink 
                                href="#"
                                isActive={currentPage === pageNumber}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(pageNumber);
                                }}
                            >
                                {pageNumber}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
                <PaginationItem>
                    <Button 
                        variant="ghost" 
                        onClick={onNext} 
                        disabled={currentPage === pageCount}
                        className="gap-1 pr-2.5"
                    >
                        <span className="sr-only">Próximo</span>
                        <PaginationNext className="h-4 w-4" />
                    </Button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
```

---
## src/components/ui/accordion.tsx
---

```tsx
"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
```

---
## src/components/ui/alert-dialog.tsx
---

```tsx
"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
```

---
## src/components/ui/alert.tsx
---

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
```

---
## src/components/ui/avatar.tsx
---

```tsx
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
```

---
## src/components/ui/badge.tsx
---

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

---
## src/components/ui/button.tsx
---

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

---
## src/components/ui/calendar.tsx
---

```tsx
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
```

---
## src/components/ui/card.tsx
---

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

---
## src/components/ui/carousel.tsx
---

```tsx
"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("select", onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
```

---
## src/components/ui/chart.tsx
---

```tsx
"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
```

---
## src/components/ui/checkbox.tsx
---

```tsx
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
```

---
## src/components/ui/collapsible.tsx
---

```tsx
"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
```

---
## src/components/ui/dialog.tsx
---

```tsx
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
```

---
## src/components/ui/dropdown-menu.tsx
---

```tsx
"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
```

---
## src/components/ui/form.tsx
---

```tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
```

---
## src/components/ui/input.tsx
---

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

---
## src/components/ui/label.tsx
---

```tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

---
## src/components/ui/menubar.tsx
---

```tsx
"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal {...props} />
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup {...props} />
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
MenubarShortcut.displayname = "MenubarShortcut"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}
```

---
## src/components/ui/pagination.tsx
---

```tsx
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
```

---
## src/components/ui/popover.tsx
---

```tsx
"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
```

---
## src/components/ui/progress.tsx
---

```tsx
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
```

---
## src/components/ui/radio-group.tsx
---

```tsx
"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
```

---
## src/components/ui/scroll-area.tsx
---

```tsx
"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
```

---
## src/components/ui/select.tsx
---

```tsx
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
```

---
## src/components/ui/separator.tsx
---

```tsx
"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
```

---
## src/components/ui/sheet.tsx
---

```tsx
"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
```

---
## src/components/ui/skeleton.tsx
---

```tsx
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
```

---
## src/components/ui/slider.tsx
---

```tsx
"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
```

---
## src/components/ui/switch.tsx
---

```tsx
"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
```

---
## src/components/ui/table.tsx
---

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full min-w-[1200px] caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
```

---
## src/components/ui/tabs.tsx
---

```tsx
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

---
## src/components/ui/textarea.tsx
---

```tsx
import * as React from 'react';

import {cn} from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({className, ...props}, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};
```

---
## src/components/ui/toast.tsx
---

```tsx
"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
```

---
## src/components/ui/toaster.tsx
---

```tsx
"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
```

---
## src/components/ui/tooltip.tsx
---

```tsx
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
```

---
## src/contexts/auth-context.tsx
---

```tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'doisAuth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedAuth) {
        setIsAuthenticated(JSON.parse(storedAuth));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key “${AUTH_STORAGE_KEY}”:`, error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = () => {
    try {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(true));
      setIsAuthenticated(true);
    } catch (error) {
       console.warn(`Error setting localStorage key “${AUTH_STORAGE_KEY}”:`, error);
    }
  };

  const logout = () => {
     try {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(false));
      setIsAuthenticated(false);
    } catch (error) {
       console.warn(`Error setting localStorage key “${AUTH_STORAGE_KEY}”:`, error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

---
## src/contexts/data-context.tsx
---

```tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { type Cow, type Birth, type IATF } from '@/lib/data-schemas';

interface Data {
  cows: Cow[];
  births: Birth[];
  iatfs: IATF[];
}

interface DataContextType {
  data: Cow[];
  births: Birth[];
  iatfs: IATF[];
  addCow: (cow: Cow) => void;
  updateCow: (id: string, updatedCow: Cow) => void;
  deleteCow: (id: string) => void;
  updateCowsLot: (ids: string[], newLot: string) => void;
  addBirth: (birth: Birth) => void;
  updateBirth: (birthId: string, updatedBirth: Birth) => void;
  deleteBirth: (birthId: string) => void;
  transferBirthToCow: (birth: Birth) => void;
  updateBirthsLotAndSex: (birthIds: string[], newLot: string | undefined, newSex: 'Macho' | 'Fêmea' | 'Aborto' | 'Não Definido' | undefined) => void;
  replaceCows: (newCows: Cow[]) => void;
  replaceBirths: (newBirths: Birth[]) => void;
  addIATF: (iatf: IATF) => void;
  updateIATF: (id: string, updatedIATF: IATF) => void;
  deleteIATF: (id: string) => void;
  replaceAllData: (data: Data) => void;
}

const DATA_STORAGE_KEY = 'doisData';

const DataContext = createContext<DataContextType | undefined>(undefined);

const getInitialData = (): Data => {
  if (typeof window === 'undefined') {
    return { cows: [], births: [], iatfs: [] };
  }
  try {
    const item = window.localStorage.getItem(DATA_STORAGE_KEY);
    const data = item ? JSON.parse(item) : { cows: [], births: [], iatfs: [] };

    const birthsWithId = (data.births || []).map((b: any) => ({ // Use any to handle old data structure
      ...b,
      id: b.id || crypto.randomUUID(),
      date: b.date ? new Date(b.date) : undefined
    }));
    
    const iatfsWithId = (data.iatfs || []).map((i: any) => ({
      ...i,
      id: i.id || crypto.randomUUID(),
      inseminationDate: i.inseminationDate ? new Date(i.inseminationDate) : undefined,
      diagnosisDate: i.diagnosisDate ? new Date(i.diagnosisDate) : undefined,
    }));

    return {
      cows: data.cows || [],
      births: birthsWithId,
      iatfs: iatfsWithId
    };
  } catch (error) {
    console.warn(`Error reading localStorage key “${DATA_STORAGE_KEY}”:`, error);
    return { cows: [], births: [], iatfs: [] };
  }
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<Data>(getInitialData);

  useEffect(() => {
    try {
      window.localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
       console.warn(`Error setting localStorage key “${DATA_STORAGE_KEY}”:`, error);
    }
  }, [data]);

  const replaceAllData = (newData: Data) => {
    // Ensure dates are converted back to Date objects after parsing from JSON
    const parsedBirths = (newData.births || []).map((b: any) => ({
      ...b,
      id: b.id || crypto.randomUUID(),
      date: b.date ? new Date(b.date) : undefined,
    }));
    const parsedIatfs = (newData.iatfs || []).map((i: any) => ({
      ...i,
      id: i.id || crypto.randomUUID(),
      inseminationDate: i.inseminationDate ? new Date(i.inseminationDate) : undefined,
      diagnosisDate: i.diagnosisDate ? new Date(i.diagnosisDate) : undefined,
    }));
    setData({
      cows: newData.cows || [],
      births: parsedBirths,
      iatfs: parsedIatfs,
    });
  };


  const addCow = (cow: Cow) => {
    setData((prevData) => {
      // Avoid adding duplicates
      if (prevData.cows.some(c => c.id.trim().toLowerCase() === cow.id.trim().toLowerCase())) {
        return prevData;
      }
      return {
        ...prevData,
        cows: [...prevData.cows, cow],
      }
    });
  };

  const updateCow = (id: string, updatedCow: Cow) => {
    setData((prevData) => ({
      ...prevData,
      cows: prevData.cows.map(cow => cow.id === id ? updatedCow : cow),
    }));
  }

  const deleteCow = (id: string) => {
    setData((prevData) => ({
      ...prevData,
      cows: prevData.cows.filter(cow => cow.id !== id),
    }));
  };

  const updateCowsLot = (ids: string[], newLot: string) => {
    setData((prevData) => ({
      ...prevData,
      cows: prevData.cows.map(cow => 
        ids.includes(cow.id) ? { ...cow, lot: newLot } : cow
      ),
    }));
  };
  
  const addBirth = (birth: Birth) => {
    setData((prevData) => {
        const newBirth = { ...birth, id: birth.id || crypto.randomUUID() };

        // Avoid adding duplicates based on cowId and date if date exists
        const birthExists = prevData.births.some(b => 
            b.cowId.trim().toLowerCase() === newBirth.cowId.trim().toLowerCase() && 
            b.date && newBirth.date &&
            new Date(b.date).getTime() === new Date(newBirth.date).getTime()
        );
        if (newBirth.date && birthExists) {
            return prevData;
        }

        return {
            ...prevData,
            births: [...prevData.births, newBirth],
        };
    });
  };

  const updateBirth = (birthId: string, updatedBirth: Birth) => {
      setData(prevData => ({
          ...prevData,
          births: prevData.births.map(b => (b.id === birthId ? { ...b, ...updatedBirth } : b)),
      }));
  };

  const deleteBirth = (birthId: string) => {
      setData(prevData => ({
          ...prevData,
          births: prevData.births.filter(b => b.id !== birthId),
      }));
  };
  
  const transferBirthToCow = (birth: Birth) => {
    setData(prevData => {
      if (!birth.id) return prevData;
      
      const animalSexName = birth.sex === 'Macho' ? 'Bezerro' : 'Bezerra';
      const newCowId = `${animalSexName.toUpperCase()} DA ${birth.cowId}`;

      const newCow: Cow = {
        id: newCowId, 
        animal: animalSexName,
        origem: "Nascimento",
        farm: birth.farm || '',
        lot: birth.lot || '',
        location: birth.location || '',
        status: "Vazia",
        registrationStatus: "Ativo",
      };
      
      const newCows = [...prevData.cows, newCow];
      const newBirths = prevData.births.filter(b => b.id !== birth.id);

      return {
        ...prevData,
        cows: newCows,
        births: newBirths,
      };
    });
  };

  const updateBirthsLotAndSex = (birthIds: string[], newLot: string | undefined, newSex: 'Macho' | 'Fêmea' | 'Aborto' | 'Não Definido' | undefined) => {
    setData(prevData => ({
        ...prevData,
        births: prevData.births.map(birth => {
            if (birth.id && birthIds.includes(birth.id)) {
                 return {
                    ...birth,
                    lot: newLot !== undefined ? newLot : birth.lot,
                    sex: newSex !== undefined ? newSex : birth.sex,
                };
            }
            return birth;
        }),
    }));
  };

  const replaceCows = (newCows: Cow[]) => {
    setData(prevData => ({
      ...prevData,
      cows: newCows,
    }));
  };

  const replaceBirths = (newBirths: Birth[]) => {
    const birthsWithIds = newBirths.map(b => ({
      ...b,
      id: b.id || crypto.randomUUID(),
      date: b.date ? new Date(b.date) : undefined
    }));
    setData(prevData => ({
      ...prevData,
      births: birthsWithIds,
    }));
  };

  const addIATF = (iatf: IATF) => {
    setData(prevData => {
      const newIATF = { ...iatf, id: iatf.id || crypto.randomUUID() };
      return {
        ...prevData,
        iatfs: [...prevData.iatfs, newIATF],
      };
    });
  };

  const updateIATF = (id: string, updatedIATF: IATF) => {
    setData(prevData => ({
      ...prevData,
      iatfs: prevData.iatfs.map(i => (i.id === id ? { ...i, ...updatedIATF } : i)),
    }));
  };

  const deleteIATF = (id: string) => {
    setData(prevData => ({
      ...prevData,
      iatfs: prevData.iatfs.filter(i => i.id !== id),
    }));
  };

  return (
    <DataContext.Provider value={{ 
      data: data.cows, 
      births: data.births, 
      iatfs: data.iatfs,
      addCow, 
      updateCow, 
      deleteCow, 
      updateCowsLot, 
      addBirth,
      updateBirth,
      deleteBirth,
      transferBirthToCow,
      updateBirthsLotAndSex,
      replaceCows,
      replaceBirths,
      addIATF,
      updateIATF,
      deleteIATF,
      replaceAllData,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
```

---
## src/contexts/settings-context.tsx
---

```tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { type Item, type Category } from '@/lib/data-schemas';

interface Settings {
  lots: Item[];
  pastures: Item[];
  farms: Item[];
  breeds: Item[];
}

interface SettingsContextType {
  settings: Settings;
  addSettingItem: (category: Category, item: Item) => void;
  deleteSettingItem: (category: Category, itemId: string) => void;
}

const SETTINGS_STORAGE_KEY = 'doisSettings';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const getInitialSettings = (): Settings => {
  if (typeof window === 'undefined') {
    return { lots: [], pastures: [], farms: [], breeds: [] };
  }
  try {
    const item = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    const parsedSettings: Settings = item ? JSON.parse(item) : { lots: [], pastures: [], farms: [], breeds: [] };

    // Remove duplicates from each category
    Object.keys(parsedSettings).forEach((key) => {
      const category = key as Category;
      const uniqueNames = new Set<string>();
      parsedSettings[category] = parsedSettings[category].filter(item => {
        const lowerCaseName = item.name.toLowerCase();
        if (uniqueNames.has(lowerCaseName)) {
          return false;
        } else {
          uniqueNames.add(lowerCaseName);
          return true;
        }
      });
    });

    return parsedSettings;

  } catch (error) {
    console.warn(`Error reading localStorage key “${SETTINGS_STORAGE_KEY}”:`, error);
    return { lots: [], pastures: [], farms: [], breeds: [] };
  }
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(getInitialSettings);

  useEffect(() => {
    try {
      // Before saving, ensure data is still unique
      const uniqueSettings: Settings = { lots: [], pastures: [], farms: [], breeds: [] };
      Object.keys(settings).forEach(key => {
        const category = key as Category;
        const seen = new Set<string>();
        uniqueSettings[category] = settings[category].filter(item => {
           const lowerCaseName = item.name.toLowerCase();
           if (seen.has(lowerCaseName)) {
               return false;
           }
           seen.add(lowerCaseName);
           return true;
        });
      });
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(uniqueSettings));
    } catch (error) {
       console.warn(`Error setting localStorage key “${SETTINGS_STORAGE_KEY}”:`, error);
    }
  }, [settings]);


  const addSettingItem = (category: Category, item: Item) => {
     setSettings((prevSettings) => {
      const categoryItems = prevSettings[category];
      const itemExists = categoryItems.some(
        (existingItem) => existingItem.name.toLowerCase() === item.name.toLowerCase()
      );

      if (itemExists) {
        // Optionally, show a toast message to the user
        // toast({ variant: 'destructive', title: 'Erro', description: 'Este item já existe.' });
        return prevSettings; // Return current state if item exists
      }

      return {
        ...prevSettings,
        [category]: [...categoryItems, item],
      };
    });
  };

  const deleteSettingItem = (category: Category, itemId: string) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [category]: prevSettings[category].filter(item => item.id !== itemId),
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, addSettingItem, deleteSettingItem }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
```

---
## src/hooks/use-mobile.tsx
---

```tsx
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
```

---
## src/hooks/use-toast.ts
---

```ts
"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
```

---
## src/lib/data-schemas.ts
---

```ts
import { z } from 'zod';

// Esquema para o Cadastro de Animal (Vacas)
export const CowSchema = z.object({
  id: z.string().min(1, "O Brinco Nº é obrigatório."),
  animal: z.string().min(1, "O nome do animal é obrigatório."),
  origem: z.string({ required_error: "Selecione a origem." }),
  farm: z.string({ required_error: "Selecione a fazenda." }),
  lot: z.string({ required_error: "Selecione o lote." }),
  location: z.string().min(1, "A localização é obrigatória."),
  status: z.enum(["Vazia", "Prenha", "Com cria"]).optional(),
  registrationStatus: z.enum(["Ativo", "Inativo"], { required_error: "Selecione o status do cadastro."}),
  // Campos opcionais mantidos do esquema original, caso sejam usados no futuro
  loteT: z.string().optional(),
  obs1: z.string().optional(),
  motivoDoDescarte: z.string().optional(),
  mes: z.string().optional(),
  ano: z.string().optional(),
});
export type Cow = z.infer<typeof CowSchema>;


// Esquema para o Registro de Nascimento
export const BirthSchema = z.object({
  id: z.string().optional(), // Adicionado ID único opcional
  cowId: z.string({ required_error: "Selecione a vaca." }),
  date: z.date({ required_error: "A data de nascimento é obrigatória." }).optional(),
  sex: z.enum(["Macho", "Fêmea", "Aborto", "Não Definido"]).optional(),
  breed: z.string().optional(),
  sire: z.string().optional(),
  lot: z.string().min(1, 'O lote é obrigatório.'),
  farm: z.string().min(1, 'A fazenda é obrigatória.'),
  location: z.string().min(1, 'A localização é obrigatória.'),
  observations: z.string().optional(),
  obs1: z.string().optional(),
  jvvo: z.string().optional(),
  animal: z.string().optional(),
});
export type Birth = z.infer<typeof BirthSchema>;

// Esquema para o Controle de IATF
export const IATFSchema = z.object({
  id: z.string().optional(),
  cowId: z.string({ required_error: "Selecione a vaca." }),
  inseminationDate: z.date({ required_error: "A data de inseminação é obrigatória." }),
  bull: z.string().optional(),
  protocol: z.string().optional(),
  diagnosisDate: z.date().optional(),
  result: z.enum(["Prenha", "Vazia", "Não checado"]).optional(),
});
export type IATF = z.infer<typeof IATFSchema>;

// Esquema para Pasto por Fazenda
export const PastureByFarmSchema = z.object({
  farm: z.string(),
  pasture: z.string(),
});
export type PastureByFarm = z.infer<typeof PastureByFarmSchema>;

// Esquema para Motivo do Descarte
export const DisposalReasonSchema = z.object({
  reason: z.string(),
});
export type DisposalReason = z.infer<typeof DisposalReasonSchema>;


export type Item = { id: string; name: string };
export type Category = "lots" | "pastures" | "farms" | "breeds";
```

---
## src/lib/utils.ts
---

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---
## tailwind.config.ts
---

```ts
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['var(--font-body)', 'sans-serif'],
        headline: ['var(--font-body)', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
```

---
## tsconfig.json
---

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```
