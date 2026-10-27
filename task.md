# Progresso

- [x] Plano aprovado: web, visual próprio, sem login, demo e preparação LLM.
- [x] Template criado e design.md definido.
- [x] API tipada, schema e mock; integração comentada com gateway IA.
- [x] UI: entrada, ajuda, exemplos, loading e quatro painéis.
- [x] Build e lint passaram. Playwright: validação, exemplo, loading, quatro cards, ajuda/Escape, checkbox, clipboard, download, reset e mobile sem overflow. Sem erros JS.
- [ ] Entrega do preview.

Decisões: textos não persistidos; demo nunca afirma analisar conteúdo; análise real somente com LLM_MODE=live configurado explicitamente. Nenhuma chamada paga durante implementação.

Servidor web em tmux `tradutor-web`, porta 4200. Guia INTEGRACAO-IA.md pronto. Revisadas capturas desktop e mobile; modo real não testado, pois nenhuma credencial real foi solicitada ou utilizada.