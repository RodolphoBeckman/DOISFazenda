
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
