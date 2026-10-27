import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { base } from "../__core/app";
import { callLLM, mockAnalysis } from "../services/document-analysis";
import type { DocumentResult } from "../../shared/document";

export const documents = {
  mode: base.handler(() => ({
    mode: process.env.LLM_MODE === "live" ? ("live" as const) : ("mock" as const),
  })),
  analyze: base
    .input(z.object({ text: z.string().trim().min(20).max(40000) }))
    .handler(async ({ input }): Promise<DocumentResult> => {
      // Não armazenamos nem registramos o conteúdo enviado em logs.
      if (process.env.LLM_MODE !== "live") {
        // Pequena latência para testar a transição de carregamento na demonstração.
        await new Promise((resolve) => setTimeout(resolve, 1400));
        return { ...mockAnalysis, mode: "mock" };
      }
      try {
        return { ...(await callLLM(input.text)), mode: "live" };
      } catch {
        // Não vazar detalhes internos ou credenciais na resposta ao navegador.
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message:
            "Não foi possível analisar o documento. Verifique a configuração da IA no servidor e tente novamente.",
        });
      }
    }),
};
