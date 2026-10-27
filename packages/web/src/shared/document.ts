import { z } from "zod";

// O mesmo contrato de saída serve ao mock, à IA e ao dashboard.
export const analysisSchema = z.object({
  title: z.string().min(1).max(180),
  summary: z.string().min(1).max(2500),
  alerts: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        severity: z.enum(["high", "medium"]),
      }),
    )
    .max(10),
  dictionary: z
    .array(z.object({ term: z.string().min(1), translation: z.string().min(1) }))
    .max(20),
  steps: z.array(z.string().min(1)).max(15),
});
export type Analysis = z.infer<typeof analysisSchema>;
export type DocumentResult = Analysis & { mode: "mock" | "live" };

export const exampleDocument = `CONTRATO DE PRESTAÇÃO DE SERVIÇOS

Pelo presente instrumento particular, o CONTRATANTE adere ao plano de serviços pelo prazo de 12 (doze) meses, mediante contraprestação mensal de R$ 149,90.

CLÁUSULA PRIMEIRA — DA VIGÊNCIA
O contrato será renovado automaticamente por igual período, salvo manifestação expressa de qualquer das partes, por e-mail, com antecedência mínima de 30 (trinta) dias do término de sua vigência.

CLÁUSULA SEGUNDA — DA RESCISÃO
A rescisão antecipada, sem justa causa, implicará multa de 20% sobre o saldo das mensalidades vincendas. Em caso de inadimplemento, incidirá multa de 2% sobre a parcela vencida, acrescida de juros de mora de 1% ao mês.

CLÁUSULA TERCEIRA — DO REAJUSTE
O valor será reajustado anualmente pelo IPCA. As partes elegem o foro da comarca de São Paulo para dirimir eventuais controvérsias.

CLÁUSULA QUARTA — DA FORMALIZAÇÃO
O CONTRATANTE deverá conferir seus dados cadastrais, assinar digitalmente o instrumento e enviar uma via assinada ao e-mail da CONTRATADA.`;
