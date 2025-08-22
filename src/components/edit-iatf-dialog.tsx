
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
