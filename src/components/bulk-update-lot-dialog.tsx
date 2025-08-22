
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

interface BulkUpdateLotDialogProps {
  isOpen: boolean
  onClose: () => void
  cowIds: string[]
  onSuccess: () => void
}

export default function BulkUpdateLotDialog({ isOpen, onClose, cowIds, onSuccess }: BulkUpdateLotDialogProps) {
  const { settings } = useSettings()
  const { updateCowsLot } = useData()
  const { toast } = useToast()
  const [selectedLot, setSelectedLot] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleUpdate = () => {
    if (!selectedLot) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, selecione um lote de destino.",
      })
      return
    }

    setIsLoading(true)
    try {
      updateCowsLot(cowIds, selectedLot)
      toast({
        title: "Sucesso!",
        description: `${cowIds.length} vaca(s) atualizada(s) para o lote "${selectedLot}".`,
      })
      onSuccess()
      onClose()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na Atualização",
        description: "Não foi possível atualizar o lote das vacas selecionadas.",
      })
    } finally {
      setIsLoading(false)
      setSelectedLot("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar Lote em Massa</DialogTitle>
          <DialogDescription>
            Você selecionou {cowIds.length} vaca(s). Escolha o novo lote para
            aplicar a todas.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lot" className="text-right">
              Lote de Destino
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
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleUpdate} disabled={isLoading || !selectedLot}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

    