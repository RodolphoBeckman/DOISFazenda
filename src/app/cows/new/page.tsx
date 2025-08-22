
"use client"

import Link from "next/link"
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

const FormSchema = z.object({
  id: z.string().min(1, "O ID da vaca é obrigatório."),
  animal: z.string().min(1, "O tipo de animal é obrigatório."),
  origem: z.string({ required_error: "Selecione a origem." }),
  farm: z.string({ required_error: "Selecione a fazenda." }),
  lot: z.string({ required_error: "Selecione o lote." }),
  location: z.string().min(1, "A localização é obrigatória."),
  status: z.enum(["Prenha", "Vazia", "Com cria"], {
    required_error: "Selecione o status.",
  }),
  registrationStatus: z.enum(["Ativo", "Inativo"], { required_error: "Selecione o status do cadastro."}),
});

type FormValues = z.infer<typeof FormSchema>;

// Data for selectors - in a real app, this would come from a database or API
const farms: string[] = [];
const lots: string[] = [];
const statuses: string[] = ["Vazia", "Prenha", "Com cria"];
const origins: string[] = [];
const registrationStatuses: string[] = ["Ativo", "Inativo"];

export default function NewCowPage() {
  const { toast } = useToast()
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
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
    console.log(data);
    toast({
      title: "Sucesso!",
      description: "Vaca registrada com sucesso.",
    })
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
                        </Trigger>
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
                        </Trigger>
                      </FormControl>
                      <SelectContent>
                        {farms.map((farm) => (
                          <SelectItem key={farm} value={farm}>{farm}</SelectItem>
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
                        </Trigger>
                      </FormControl>
                      <SelectContent>
                        {lots.map((lot) => (
                          <SelectItem key={lot} value={lot}>{lot}</SelectItem>
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
                        </Trigger>
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
                        </Trigger>
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
