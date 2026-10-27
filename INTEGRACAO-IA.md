# Tradutor de Burocracia — integração da IA

## O que funciona agora

O modo padrão é `mock`: clicar em **Descomplicar Documento** chama o servidor, mostra o carregamento e devolve dados fixos de um contrato de exemplo. Não envia conteúdo a modelos de IA, não consome créditos de IA e não persiste documentos. O texto não influencia o resultado simulado, mesmo que seja outro tipo de documento.

O checklist é interativo, o resumo pode ser copiado e o resultado completo pode ser baixado em `.txt`. Esses dados ficam somente na sessão atual; recarregar a página reinicia a aplicação.

## Arquivos principais

- `packages/web/src/api/services/document-analysis.ts`: mock e função `callLLM`, comentada.
- `packages/web/src/api/routes/documents.ts`: validação da entrada, modo ativo e tratamento de falhas.
- `packages/web/src/shared/document.ts`: schema Zod do resultado e documento de exemplo.
- `packages/web/src/web/queries/documents.ts`: chamadas tipadas oRPC.
- `packages/web/src/web/pages/translator.tsx`: editor, estado de carregamento e navegação.
- `packages/web/src/web/components/analysis-dashboard.tsx`: os quatro painéis.

## Ativar uma IA real posteriormente

A função está implementada usando o AI SDK e um gateway compatível com provedores OpenAI, Google/Gemini e Anthropic. No arquivo `.env` **da raiz**, defina:

```dotenv
LLM_MODE=live
LLM_MODEL=ID_DO_MODELO_DISPONIVEL_NO_SEU_GATEWAY
AI_GATEWAY_BASE_URL=URL_DO_SEU_GATEWAY
AI_GATEWAY_API_KEY=CHAVE_PRIVADA_DO_GATEWAY
```

Os valores acima são nomes explicativos, não credenciais utilizáveis. Use o ID do modelo realmente habilitado no seu gateway; o prefixo indica o provedor (`openai/`, `google/`, `anthropic/`). Se a infraestrutura já tiver o gateway configurado, mantenha os valores existentes e adicione apenas o modo e o modelo.

Uma chave **direta** da OpenAI, Gemini ou Anthropic não é necessariamente uma chave de gateway. Para trabalhar sem gateway, adapte a criação de `model` dentro de `callLLM` para o SDK oficial desse provedor, mantendo a chamada no servidor e o mesmo schema de saída.

Reinicie o serviço depois de alterar as variáveis. Nunca coloque chaves no React ou em variáveis com prefixo `VITE_`. Em configurações compartilhadas ou públicas, proteja o endpoint com autenticação, limitação de uso e controle de orçamento antes de ativar chamadas reais.

## Contrato de saída

A IA deve devolver JSON com `title`, `summary`, `alerts` (title, description, severity high/medium), `dictionary` (term, translation) e `steps` (lista de strings). O servidor valida tudo com Zod, limita a entrada a 40.000 caracteres e aborta a chamada após 45 segundos. Falhas não são disfarçadas como demonstrações.

## Segurança e limites

- Não há armazenamento de documentos nem logs do seu conteúdo no código da aplicação.
- No modo real, o provedor configurado recebe o documento. Remova dados pessoais ou sensíveis antes de enviar e verifique a política de retenção do provedor.
- O prompt trata o documento como entrada não confiável e orienta a não inventar cláusulas. Isso não elimina erros de IA: confira os valores e prazos no original.
- A ferramenta é informativa; não substitui orientação jurídica.
- Esta entrega foi verificada apenas com mock. Não houve chamada paga nem teste de credencial real.

## Desenvolvimento

```bash
bun install
bun run dev
bun run build
```

A porta é gerenciada por `__ports.cjs`. O frontend React e a API Hono são servidos pelo mesmo processo web.