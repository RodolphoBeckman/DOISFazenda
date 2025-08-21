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
import { Badge } from '@/components/ui/badge';
import { PaginationComponent } from '@/components/pagination';

const cows = [
  { id: 'VACA-001', farm: 'São Francisco', lot: 'Lote 1', status: 'Prenha' },
  { id: 'VACA-002', farm: 'Segredo', lot: 'Lote 2', status: 'Vazia' },
  { id: 'VACA-003', farm: 'Dois', lot: 'Lote 1', status: 'Prenha' },
  { id: 'VACA-004', farm: 'São Francisco', lot: 'Lote 3', status: 'Vazia' },
  { id: 'VACA-005', farm: 'Segredo', lot: 'Lote 2', status: 'Com cria' },
  { id: 'VACA-006', farm: 'Dois', lot: 'Lote 1', status: 'Prenha' },
  { id: 'VACA-007', farm: 'São Francisco', lot: 'Lote 3', status: 'Com cria' },
  { id: 'VACA-008', farm: 'Segredo', lot: 'Lote 2', status: 'Vazia' },
  { id: 'VACA-009', farm: 'Dois', lot: 'Lote 1', status: 'Prenha' },
  { id: 'VACA-010', farm: 'São Francisco', lot: 'Lote 3', status: 'Vazia' },
];

export default function CowsPage() {
  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h1 className="text-3xl font-bold tracking-tight font-headline">
        Gerenciar Vacas
      </h1>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pregnant">Prenhas</TabsTrigger>
          <TabsTrigger value="empty">Vazias</TabsTrigger>
          <TabsTrigger value="with-calf">Com Cria</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <CardWithTable title="Todas as Vacas" data={cows} />
        </TabsContent>
        <TabsContent value="pregnant">
          <CardWithTable
            title="Vacas Prenhas"
            data={cows.filter((c) => c.status === 'Prenha')}
          />
        </TabsContent>
        <TabsContent value="empty">
          <CardWithTable
            title="Vacas Vazias"
            data={cows.filter((c) => c.status === 'Vazia')}
          />
        </TabsContent>
        <TabsContent value="with-calf">
          <CardWithTable
            title="Vacas Com Cria"
            data={cows.filter((c) => c.status === 'Com cria')}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}

function CardWithTable({ title, data }: { title: string; data: typeof cows }) {
  return (
    <div className="border bg-card text-card-foreground shadow-sm rounded-lg mt-4">
      <div className="p-6">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      </div>
      <div className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Fazenda</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((cow) => (
              <TableRow key={cow.id}>
                <TableCell className="font-medium">{cow.id}</TableCell>
                <TableCell>{cow.farm}</TableCell>
                <TableCell>{cow.lot}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      cow.status === 'Prenha'
                        ? 'default'
                        : cow.status === 'Com cria'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {cow.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="p-6">
        <PaginationComponent pageCount={10} />
      </div>
    </div>
  );
}
