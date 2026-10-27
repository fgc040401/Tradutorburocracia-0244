import { useMutation, useQuery } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function useAnalyzeDocument() {
  return useMutation(orpc.documents.analyze.mutationOptions());
}

export function useDocumentMode() {
  return useQuery(orpc.documents.mode.queryOptions({ staleTime: 60_000 }));
}
