import { Baby, Beaker, CalendarClock, PlusCircle, Users } from "lucide-react";
import Link from "next/link";
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

export default function Dashboard() {
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
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Nenhum nascimento registrado ainda
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Prenhez</CardTitle>
            <Beaker className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
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
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Nenhuma vaca registrada</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Parto</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Nenhuma previsão disponível
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
            <BirthsByFarmChart />
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
              <BirthsBySexChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

    