
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
import { PlusCircle } from "lucide-react";

// Mock data - replace with your actual data fetching
const lots = [
  { id: "LOTE-01", name: "Lote 1" },
  { id: "LOTE-02", name: "Lote 2" },
  { id: "LOTE-03", name: "Lote 3" },
  { id: "LOTE-04", name: "Lote 4" },
  { id: "LOTE-N", name: "N" },
  { id: "LOTE-DB", name: "D-B" },
];

const pastures = [
    { id: "PASTO-01", name: "Pasto da Represa" },
    { id: "PASTO-02", name: "Pasto do Meio" },
    { id: "PASTO-03", name: "Pasto Novo" },
    { id: "PASTO-04", name: "Pasto da Sede" },
    { id: "PASTO-05", name: "Pasto Palhada" },
];

const farms = [
    { id: "FARM-01", name: "São Francisco" },
    { id: "FARM-02", name: "Segredo" },
    { id: "FARM-03", name: "Dois" },
];

const breeds = [
    { id: "BREED-01", name: "Nelore" },
    { id: "BREED-02", name: "Angus" },
];


export default function SettingsPage() {
  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h1 className="text-3xl font-bold tracking-tight font-headline">
        Configurações
      </h1>
      <p className="text-muted-foreground">
        Gerencie as configurações e cadastros básicos do sistema.
      </p>

      <Tabs defaultValue="lots">
        <TabsList>
          <TabsTrigger value="lots">Lotes</TabsTrigger>
          <TabsTrigger value="pastures">Pastos</TabsTrigger>
          <TabsTrigger value="farms">Fazendas</TabsTrigger>
          <TabsTrigger value="breeds">Raças</TabsTrigger>
        </TabsList>
        
        <TabsContent value="lots">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Lotes Cadastrados</CardTitle>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Lote
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Lote</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lots.map((lot) => (
                    <TableRow key={lot.id}>
                      <TableCell className="font-medium">{lot.name}</TableCell>
                      <TableCell>
                        {/* Ações como Editar/Excluir podem ser adicionadas aqui */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pastures">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pastos Cadastrados</CardTitle>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Pasto
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Pasto</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastures.map((pasture) => (
                    <TableRow key={pasture.id}>
                      <TableCell className="font-medium">{pasture.name}</TableCell>
                       <TableCell>
                        {/* Ações como Editar/Excluir podem ser adicionadas aqui */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="farms">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Fazendas Cadastradas</CardTitle>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Fazenda
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome da Fazenda</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {farms.map((farm) => (
                    <TableRow key={farm.id}>
                      <TableCell className="font-medium">{farm.name}</TableCell>
                       <TableCell>
                        {/* Ações como Editar/Excluir podem ser adicionadas aqui */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

         <TabsContent value="breeds">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Raças Cadastradas</CardTitle>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Raça
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome da Raça</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {breeds.map((breed) => (
                    <TableRow key={breed.id}>
                      <TableCell className="font-medium">{breed.name}</TableCell>
                       <TableCell>
                        {/* Ações como Editar/Excluir podem ser adicionadas aqui */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
