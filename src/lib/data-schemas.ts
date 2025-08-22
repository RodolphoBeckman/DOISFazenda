import { z } from 'zod';

// Esquema para o Cadastro de Animal (Vacas)
export const CowSchema = z.object({
  id: z.string().min(1, "O Brinco Nº é obrigatório."),
  animal: z.string().min(1, "O nome do animal é obrigatório."),
  origem: z.string({ required_error: "Selecione a origem." }),
  farm: z.string({ required_error: "Selecione a fazenda." }),
  lot: z.string({ required_error: "Selecione o lote." }),
  location: z.string().min(1, "A localização é obrigatória."),
  status: z.enum(["Vazia", "Prenha", "Com cria"], { required_error: "Selecione o status."}),
  registrationStatus: z.enum(["Ativo", "Inativo"], { required_error: "Selecione o status do cadastro."}),
  // Campos opcionais mantidos do esquema original, caso sejam usados no futuro
  loteT: z.string().optional(),
  obs1: z.string().optional(),
  motivoDoDescarte: z.string().optional(),
  mes: z.string().optional(),
  ano: z.string().optional(),
});
export type Cow = z.infer<typeof CowSchema>;


// Esquema para o Registro de Nascimento
export const BirthSchema = z.object({
  cowId: z.string({ required_error: "Selecione a vaca." }),
  date: z.date({ required_error: "A data de nascimento é obrigatória." }),
  sex: z.enum(["Macho", "Fêmea"], { required_error: "Selecione o sexo." }),
  breed: z.string({ required_error: "Selecione a raça." }),
  sire: z.string().optional(),
  lot: z.string({ required_error: "Selecione o lote." }),
  farm: z.string({ required_error: "Selecione a fazenda." }),
  location: z.string().min(1, "A localização é obrigatória."),
  observations: z.string().optional(),
});
export type Birth = z.infer<typeof BirthSchema>;

// Esquema para o Controle de IATF
export const IATFSchema = z.object({
  cowId: z.string(),
  inseminationDate: z.date(),
  bull: z.string().optional(),
  protocol: z.string().optional(),
  diagnosisDate: z.date().optional(),
  result: z.enum(["Prenha", "Vazia", "Não checado"]).optional(),
});
export type IATF = z.infer<typeof IATFSchema>;

// Esquema para Pasto por Fazenda
export const PastureByFarmSchema = z.object({
  farm: z.string(),
  pasture: z.string(),
});
export type PastureByFarm = z.infer<typeof PastureByFarmSchema>;

// Esquema para Motivo do Descarte
export const DisposalReasonSchema = z.object({
  reason: z.string(),
});
export type DisposalReason = z.infer<typeof DisposalReasonSchema>;


export type Item = { id: string; name: string };
export type Category = "lots" | "pastures" | "farms" | "breeds";
