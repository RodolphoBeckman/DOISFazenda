
"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useSettings } from "@/contexts/settings-context"
import { useData } from "@/contexts/data-context"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface BulkUpdateBirthDialogProps {
  isOpen: boolean
  onClose: () => void
  birthsToUpdate: string[]
  onSuccess: () => void
}

export default function BulkUpdateBirthDialog({ isOpen, onClose, birthsToUpdate, onSuccess }: BulkUpdateBirthDialogProps) {
  const { settings } = useSettings()
  const { updateBirthsLotAndSex } = useData()
  const { toast } = useToast()
  const [selectedLot, setSelectedLot] = React.useState<string | undefined>(undefined)
  const [selectedSex, setSelectedSex] = React.useState<'Macho' | 'Fêmea' | 'Aborto' | 'Não Definido' | undefined>(undefined)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleUpdate = () => {
    if (!selectedLot && !selectedSex) {
      toast({
        variant: "destructive",
        title: "Nenhuma alteração selecionada",
        description: "Por favor, selecione um lote ou um sexo para atualizar.",
      })
      return
    }

    setIsLoading(true)
    try {
      updateBirthsLotAndSex(birthsToUpdate, selectedLot, selectedSex)
      toast({
        title: "Sucesso!",
        description: `${birthsToUpdate.length} registro(s) de nascimento atualizado(s).`,
      })
      onSuccess()
      onClose()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na Atualização",
        description: "Não foi possível atualizar os registros selecionados.",
      })
    } finally {
      setIsLoading(false)
      setSelectedLot(undefined)
      setSelectedSex(undefined)
    }
  }

  React.useEffect(() => {
    if (!isOpen) {
        setSelectedLot(undefined);
        setSelectedSex(undefined);
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar Nascimentos em Massa</DialogTitle>
          <DialogDescription>
            Você selecionou {birthsToUpdate.length} nascimento(s). Escolha os novos valores para aplicar a todos.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lot" className="text-right">
              Lote
            </Label>
            <div className="col-span-3">
              <Select value={selectedLot} onValueChange={setSelectedLot}>
                <SelectTrigger id="lot">
                  <SelectValue placeholder="Selecione o lote..." />
                </SelectTrigger>
                <SelectContent>
                  {settings.lots.map((lot) => (
                    <SelectItem
                      key={`${lot.id}-${lot.name}`}
                      value={lot.name}
                    >
                      {lot.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sex" className="text-right">
              Sexo do Bezerro
            </Label>
            <div className="col-span-3">
              <Select value={selectedSex} onValueChange={setSelectedSex as (value: string) => void}>
                <SelectTrigger id="sex">
                  <SelectValue placeholder="Selecione o sexo..." />
                </SelectTrigger>
                 <SelectContent>
                    <SelectItem value="Macho">Macho</SelectItem>
                    <SelectItem value="Fêmea">Fêmea</SelectItem>
                    <SelectItem value="Aborto">Aborto</SelectItem>
                    <SelectItem value="Não Definido">Não Definido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleUpdate} disabled={isLoading || (!selectedLot && !selectedSex)}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
