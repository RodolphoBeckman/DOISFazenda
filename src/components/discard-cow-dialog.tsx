
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

    