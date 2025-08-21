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

const births = [
    { id: 'NASC-001', cowId: 'VACA-001', date: '2024-03-15', sex: 'Macho', farm: 'São Francisco', breed: 'Nelore', sire: 'Touro A', lot: 'Lote 1', location: 'Pasto da Represa', observations: 'Parto normal' },
    { id: 'NASC-002', cowId: 'VACA-003', date: '2024-03-18', sex: 'Fêmea', farm: 'Dois', breed: 'Angus', sire: 'Touro B', lot: 'D-B', location: 'Pasto do Meio', observations: '' },
    { id: 'NASC-003', cowId: 'VACA-006', date: '2024-03-20', sex: 'Macho', farm: 'Dois', breed: 'Nelore', sire: 'Comprou Prenha', lot: 'D-B', location: 'Pasto da Represa', observations: 'Parto assistido' },
    { id: 'NASC-004', cowId: 'VACA-009', date: '2024-04-01', sex: 'Fêmea', farm: 'Dois', breed: 'Nelore', sire: 'Touro C', lot: 'Lote 2', location: 'Pasto Novo', observations: '' },
    { id: 'NASC-005', cowId: 'VACA-011', date: '2024-04-05', sex: 'Macho', farm: 'Segredo', breed: 'Angus', sire: 'Comprou Prenha', lot: 'Lote 3', location: 'Pasto da Sede', observations: '' },
    { id: 'NASC-006', cowId: 'VACA-012', date: '2024-04-10', sex: 'Macho', farm: 'São Francisco', breed: 'Nelore', sire: 'Touro A', lot: 'Lote 1', location: 'Pasto da Represa', observations: '' },
    { id: 'NASC-007', cowId: 'VACA-015', date: '2024-04-12', sex: 'Fêmea', farm: 'Segredo', breed: 'Angus', sire: 'Touro D', lot: 'Lote 3', location: 'Pasto da Sede', observations: 'Gêmeos' },
    { id: 'NASC-008', cowId: 'VACA-018', date: '2024-04-22', sex: 'Fêmea', farm: 'Dois', breed: 'Nelore', sire: 'Comprou Prenha', lot: 'D-B', location: 'Pasto do Meio', observations: '' },
    { id: 'NASC-009', cowId: 'VACA-021', date: '2024-05-01', sex: 'Macho', farm: 'São Francisco', breed: 'Nelore', sire: 'Touro A', lot: 'Lote 1', location: 'Pasto da Represa', observations: '' },
    { id: 'NASC-010', cowId: 'VACA-025', date: '2024-05-03', sex: 'Fêmea', farm: 'Segredo', breed: 'Angus', sire: 'Touro D', lot: 'Lote 3', location: 'Pasto da Sede', observations: '' },
];

export default function BirthsPage() {
  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h1 className="text-3xl font-bold tracking-tight font-headline">
        Registro de Nascimentos
      </h1>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="sf">São Francisco</TabsTrigger>
          <TabsTrigger value="segredo">Segredo</TabsTrigger>
          <TabsTrigger value="dois">Dois</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
            <CardWithTable title="Todos os Nascimentos" data={births} />
        </TabsContent>
        <TabsContent value="sf">
            <CardWithTable title="Nascimentos em São Francisco" data={births.filter(b => b.farm === 'São Francisco')} />
        </TabsContent>
        <TabsContent value="segredo">
             <CardWithTable title="Nascimentos em Segredo" data={births.filter(b => b.farm === 'Segredo')} />
        </TabsContent>
        <TabsContent value="dois">
             <CardWithTable title="Nascimentos em Dois" data={births.filter(b => b.farm === 'Dois')} />
        </TabsContent>
      </Tabs>
    </main>
  );
}


function CardWithTable({ title, data }: { title: string; data: typeof births }) {
  return (
    <div className="border bg-card text-card-foreground shadow-sm rounded-lg mt-4">
      <div className="p-6">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      </div>
      <div className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brinco Mãe</TableHead>
              <TableHead>Sexo Bezerro</TableHead>
              <TableHead>Raça Bezerro</TableHead>
              <TableHead>Nome do Pai</TableHead>
              <TableHead>Data Nasc.</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead>Fazenda</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Observações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((birth) => (
              <TableRow key={birth.id}>
                <TableCell className="font-medium">{birth.cowId}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      birth.sex === 'Macho'
                        ? 'secondary'
                        : 'default'
                    }
                  >
                    {birth.sex}
                  </Badge>
                </TableCell>
                <TableCell>{birth.breed}</TableCell>
                <TableCell>{birth.sire}</TableCell>
                <TableCell>{new Date(birth.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                <TableCell>{birth.lot}</TableCell>
                <TableCell>{birth.farm}</TableCell>
                <TableCell>{birth.location}</TableCell>
                <TableCell className="max-w-[200px] truncate">{birth.observations}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="p-6">
        <PaginationComponent pageCount={5} />
      </div>
    </div>
  );
}
