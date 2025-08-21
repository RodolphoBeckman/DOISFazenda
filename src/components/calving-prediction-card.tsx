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
