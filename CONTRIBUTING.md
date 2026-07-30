# Como contribuir

Obrigado por considerar uma contribuição para o GitHub Quest. O projeto ensina
Git e GitHub em português por meio de explicações curtas, missões seguras e
exemplos visuais.

## Antes de começar

1. Pesquise as Issues abertas para evitar trabalho duplicado.
2. Comente na Issue escolhida quando a mudança for maior do que uma correção
   pequena.
3. Leia o [Código de Conduta](CODE_OF_CONDUCT.md).
4. Não publique vulnerabilidades em Issues; siga a
   [Política de Segurança](SECURITY.md).

## Preparar o ambiente

O projeto requer Node.js 22.13 ou superior.

```bash
npm install
npm run dev
```

Abra `http://localhost:3000` no navegador.

## Fluxo de trabalho

1. Crie um fork do repositório.
2. Crie uma branch curta e descritiva a partir da `main`.
3. Faça mudanças focadas e mantenha os commits compreensíveis.
4. Execute as verificações locais.
5. Envie a branch para o seu fork.
6. Abra uma Pull Request relacionando a Issue correspondente.

Exemplos de branches:

- `feat/modulo-rebase`
- `fix/layout-mobile`
- `docs/melhora-guia`

As mensagens de commit devem ser claras e, preferencialmente, escritas em
português.

## Verificações obrigatórias

```bash
npm run lint
npm run test
npm run build
```

O GitHub Actions executará as mesmas verificações na Pull Request.

## Pull Requests

Mantenha cada Pull Request pequena o suficiente para ser compreendida e
revisada. Explique:

- o problema ou oportunidade;
- o que mudou;
- como a mudança foi validada;
- impactos visuais ou de comportamento;
- a Issue relacionada.

Inclua imagens quando a interface mudar. Feedback de revisão faz parte da
colaboração; novos commits podem ser enviados para a mesma branch.

## Coautoria

Use `Co-authored-by` apenas quando outra pessoa tiver contribuído de verdade
para o conteúdo do commit e concordar com o crédito. O e-mail informado deve
estar associado à conta dela no GitHub.
