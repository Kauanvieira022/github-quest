# GitHub Quest

Uma plataforma web para aprender Git e GitHub por meio de explicações curtas,
laboratórios seguros e pequenas missões práticas.

O próprio desenvolvimento do GitHub Quest segue o fluxo ensinado no curso:
issues, branches, commits, Pull Requests, revisão e merge. Assim, a evolução do
projeto também serve como experiência real de colaboração no GitHub.

## Primeira versão

- trilha com oito módulos, dos fundamentos ao open source;
- primeira aula sobre o ciclo de estados do Git;
- terminal interativo simulado;
- missão guiada para criar o primeiro repositório e commit;
- módulo de commits com análise interativa de mensagens;
- gerador de comandos para mensagens que atendem aos critérios;
- módulo de branches com árvore visual do histórico;
- missão interativa de criação, troca, merge e remoção de branch;
- módulo de Pull Requests com proposta, revisão, correção e aprovação;
- missão visual que acompanha os estados de uma PR até o merge;
- cena 3D progressiva inspirada no grafo de commits com Three.js;
- módulo de repositórios remotos com fluxo entre local, origin e GitHub;
- missão 3D de inspeção, fetch, comparação, pull e push;
- progresso salvo no navegador;
- roteiro transparente de como o projeto usa GitHub;
- acompanhamento dos Achievements como consequência do trabalho real.

## Desenvolvimento

Requer Node.js 22.13 ou superior.

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Verificações

```bash
npm run lint
npm run test
npm run build
```

## Deploy

O projeto usa Next.js e está preparado para deploy na Vercel. Configure
`NEXT_PUBLIC_SITE_URL` com o endereço final do projeto antes da publicação.

## Experiência visual

A camada 3D usa Three.js em um componente isolado e carregado apenas no
navegador. A cena limita a resolução, pausa fora da tela, respeita a preferência
de movimento reduzido e mantém um fallback visual para ambientes sem WebGL.

## Fluxo de contribuição

1. Abra uma issue pequena e objetiva.
2. Crie uma branch a partir da `main`.
3. Faça commits focados e compreensíveis.
4. Abra um Pull Request explicando a mudança.
5. Valide, revise e faça o merge.

## Aviso sobre Achievements

O GitHub Quest não concede medalhas. Os Achievements são liberados pelo próprio
GitHub quando ações qualificadas acontecem na plataforma. O projeto organiza
seu desenvolvimento para praticar essas ações de maneira legítima.
