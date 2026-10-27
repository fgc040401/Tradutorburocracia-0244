 # Tradutor de Burocracia — Design

Aplicação web editorial, calma e utilitária em português brasileiro. A experiência é centrada em texto e clareza, sem fotografias.

## Sistema visual
- Azul royal #3265e9 como ação e destaque; azul-marinho #192740 para títulos; cinza-azulado #748096 para apoio.
- Fundo #f7f9fc, superfícies brancas, bordas #e7ebf2. Amarelo e vermelho exclusivamente em alertas.
- Poppins nos títulos e marca; DM Sans no corpo, com fallback sans-serif.
- Sidebar branca de 240px; workspace com cabeçalho discreto e conteúdo de largura máxima 1000px.
- Hero centralizado: eyebrow, título em duas linhas, descrição curta. Editor amplo com borda suave e sombra azulada.
- Cards com raio de 14px, botões de 10px, ícones Lucide. Espaços 4/8/12/16/24/32/48/64px.
- Corpo 14–16px, títulos de cards 17px, hero 48px. Ilustração funcional com ícones, sem decoração aleatória.

## Estados e responsividade
- Desktop: navegação lateral, editor central e quatro prévias das funcionalidades abaixo.
- Resultados: grid assimétrico de duas colunas, resumo azul, radar âmbar, dicionário branco e checklist interativo.
- Mobile: cabeçalho compacto, uma coluna e ações com alvos de 44px.
- Foco visível, labels, loading aria-live. Animação de entrada sutil, respeitando prefers-reduced-motion.
- Modo simulado explícito. Dados não salvos e sem envio a LLM no modo mock.

## Escopo técnico aprovado
- Web apenas, packages/web; sem login ou tabelas de documentos.
- Procedimento documents.analyze via oRPC e hook useAnalyzeDocument.
- Mock e serviço LLM separados; chave apenas no servidor e saída validada por Zod.
- Página inicial e dashboard na mesma tela; exemplo, ajuda, copiar resumo, exportar texto e reiniciar.
