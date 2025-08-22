
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
