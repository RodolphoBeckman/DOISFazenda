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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"

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
                        <Select onValueChange={field.onChange} value={field.value}>
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
                        <Select onValueChange={field.onChange} value={field.value}>
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
