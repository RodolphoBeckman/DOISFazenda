
"use client";

import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/settings-context";
import { type Item, type Category } from "@/lib/data-schemas";

const categoryLabels: Record<Category, { singular: string; plural: string }> = {
  lots: { singular: "Lote", plural: "Lotes" },
  pastures: { singular: "Pasto", plural: "Pastos" },
  farms: { singular: "Fazenda", plural: "Fazendas" },
  breeds: { singular: "Raça", plural: "Raças" },
};

export default function SettingsPage() {
  const { toast } = useToast();
  const { settings, addSettingItem } = useSettings();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogCategory, setDialogCategory] = useState<Category | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleOpenDialog = (category: Category) => {
    setDialogCategory(category);
    setIsDialogOpen(true);
    setNewItemName("");
  };

  const handleAddItem = () => {
    if (!newItemName.trim() || !dialogCategory) return;
    
    addSettingItem(dialogCategory, { id: crypto.randomUUID(), name: newItemName.trim() });
    
    toast({
      title: "Sucesso!",
      description: `${categoryLabels[dialogCategory].singular} "${newItemName.trim()}" adicionado(a).`,
    });

    setIsDialogOpen(false);
  };

  const renderTable = (category: Category) => {
    const items = settings[category];
    const labels = categoryLabels[category];

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{labels.plural} Cadastrados</CardTitle>
          <Button onClick={() => handleOpenDialog(category)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo(a) {labels.singular}
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do {labels.singular}</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      {/* Ações como Editar/Excluir podem ser adicionadas aqui */}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center">
                    Nenhum(a) {labels.singular.toLowerCase()} cadastrado(a).
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Configurações
        </h1>
        <p className="text-muted-foreground">
          Gerencie as configurações e cadastros básicos do sistema.
        </p>

        {isClient && (
          <Tabs defaultValue="lots">
            <TabsList>
              <TabsTrigger value="lots">Lotes</TabsTrigger>
              <TabsTrigger value="pastures">Pastos</TabsTrigger>
              <TabsTrigger value="farms">Fazendas</TabsTrigger>
              <TabsTrigger value="breeds">Raças</TabsTrigger>
            </TabsList>

            <TabsContent value="lots">{renderTable("lots")}</TabsContent>
            <TabsContent value="pastures">{renderTable("pastures")}</TabsContent>
            <TabsContent value="farms">{renderTable("farms")}</TabsContent>
            <TabsContent value="breeds">{renderTable("breeds")}</TabsContent>
          </Tabs>
        )}
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo(a) {dialogCategory ? categoryLabels[dialogCategory].singular : ''}</DialogTitle>
            <DialogDescription>
              Insira o nome para o novo item e clique em salvar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleAddItem}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
