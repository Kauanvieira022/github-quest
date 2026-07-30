"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

const TeamFlowScene = dynamic(
  () => import("./TeamFlowScene").then((module) => module.TeamFlowScene),
  { ssr: false },
);

const steps = [
  {
    title: "Busque o trabalho mais recente",
    command: "git fetch origin",
    explanation:
      "Antes de integrar, atualize as referências remotas. Isso permite comparar sua branch com a main compartilhada sem alterar seus arquivos.",
    output: [
      "From github.com:voce/projeto",
      "   d4e5f6a..g7h8i9j  main -> origin/main",
    ],
    state: "Contexto atualizado",
  },
  {
    title: "Integre a main na sua branch",
    command: "git merge origin/main",
    explanation:
      "As duas branches alteraram a mesma região de perfil.tsx. O Git interrompe o merge para que uma pessoa decida qual deve ser o resultado.",
    output: [
      "Auto-merging app/perfil.tsx",
      "CONFLICT (content): Merge conflict in app/perfil.tsx",
      "Automatic merge failed; fix conflicts and then commit the result.",
    ],
    state: "Conflito encontrado",
  },
  {
    title: "Construa a versão correta",
    action: "Remover os marcadores e combinar as duas ideias",
    explanation:
      "Leia HEAD e origin/main, converse com quem conhece a mudança e edite o arquivo. Resolver não é escolher um lado às cegas.",
    output: [
      "app/perfil.tsx",
      "marcadores removidos; nome e avatar preservados",
    ],
    state: "Arquivo resolvido",
  },
  {
    title: "Prepare somente o arquivo resolvido",
    command: "git add app/perfil.tsx",
    explanation:
      "Adicionar o arquivo à staging area informa ao Git que a resolução foi concluída e define exatamente o que entrará no commit.",
    output: ["All conflicts fixed but you are still merging.", "Changes to be committed:"],
    state: "Resolução preparada",
  },
  {
    title: "Registre a colaboração",
    command:
      'git commit -m "fix: resolve conflito no perfil" -m "Co-authored-by: Ana Silva <ana@exemplo.com>"',
    explanation:
      "O trailer Co-authored-by credita uma contribuição real. Troque nome e e-mail pelos dados verificados da pessoa que trabalhou na solução.",
    output: [
      "[feat/perfil k1l2m3n] fix: resolve conflito no perfil",
      "Co-authored-by: Ana Silva <ana@exemplo.com>",
    ],
    state: "Coautoria registrada",
  },
  {
    title: "Compartilhe a resolução para revisão",
    command: "git push origin feat/perfil",
    explanation:
      "Publique a branch atualizada. A equipe poderá revisar o resultado do conflito na mesma Pull Request antes do merge.",
    output: ["d4e5f6a..k1l2m3n  feat/perfil -> feat/perfil"],
    state: "Pronta para revisão",
  },
] as const;

export function TeamLesson() {
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const completed = step === steps.length;
  const current = steps[Math.min(step, steps.length - 1)];
  const progress = Math.round((step / steps.length) * 100);
  const visibleOutput =
    step === 0 ? ["Aguardando a equipe sincronizar o contexto..."] : steps[step - 1].output;
  const currentState =
    step === 0 ? "Branches ainda não comparadas" : steps[step - 1].state;

  const checklist = useMemo(
    () => [
      { label: "referências atualizadas", done: step >= 1 },
      { label: "conflito compreendido", done: step >= 2 },
      { label: "marcadores removidos", done: step >= 3 },
      { label: "resolução preparada", done: step >= 4 },
      { label: "crédito registrado", done: step >= 5 },
      { label: "branch publicada", done: step >= 6 },
    ],
    [step],
  );

  async function copyCommand() {
    if (!("command" in current)) return;
    await navigator.clipboard.writeText(current.command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1300);
  }

  return (
    <article className="current-lesson team-lesson">
      <div className="lesson-topline">
        <span>TRABALHO EM EQUIPE · AULA 1 DE 5</span>
        <span className="available-pill">MISSÃO COLABORATIVA</span>
      </div>

      <h3>Conflitos são decisões compartilhadas, não erros do Git</h3>
      <p className="lesson-lede">
        Um conflito aparece quando o Git não consegue combinar duas mudanças
        automaticamente. A equipe entende as intenções, constrói uma versão
        correta e registra quem participou.
      </p>

      <div className="team-concepts">
        <div>
          <span>01</span>
          <strong>Sincronizar</strong>
          <p>Conheça o estado mais recente antes de integrar.</p>
        </div>
        <div>
          <span>02</span>
          <strong>Conversar</strong>
          <p>Resolva a intenção do código, não apenas os marcadores.</p>
        </div>
        <div>
          <span>03</span>
          <strong>Creditar</strong>
          <p>Reconheça contribuições reais com autoria transparente.</p>
        </div>
      </div>

      <div className="team-lab">
        <div className="team-lab-head">
          <div>
            <span>MISSÃO 06</span>
            <strong>Conduza uma resolução em equipe</strong>
          </div>
          <div className="branch-progress">
            <span>{progress}%</span>
            <i>
              <b style={{ width: `${progress}%` }} />
            </i>
          </div>
        </div>

        <div className="team-visual">
          <TeamFlowScene step={step} />
          <div className="team-node-label yours">
            <small>SUA LINHA</small>
            <strong>feat/perfil</strong>
          </div>
          <div className="team-node-label main">
            <small>PONTO DE ENCONTRO</small>
            <strong>integração</strong>
          </div>
          <div className="team-node-label teammate">
            <small>OUTRA LINHA</small>
            <strong>origin/main</strong>
          </div>
          <div
            className={`team-sync-state ${step >= 2 && step < 4 ? "conflict" : ""} ${completed ? "complete" : ""}`}
          >
            <span>{completed ? "✓" : step >= 2 && step < 4 ? "!" : "⑂"}</span>
            <div>
              <small>ESTADO DA COLABORAÇÃO</small>
              <strong>{currentState}</strong>
            </div>
          </div>
        </div>

        <div className="team-workspace">
          <aside className="team-checklist">
            <span>CHECKLIST DA EQUIPE</span>
            {checklist.map((item) => (
              <div className={item.done ? "done" : ""} key={item.label}>
                <i>{item.done ? "✓" : ""}</i>
                <p>{item.label}</p>
              </div>
            ))}
          </aside>

          <section className="team-action">
            <div className={`conflict-editor ${step >= 3 ? "resolved" : ""}`}>
              <div>
                <span>app/perfil.tsx</span>
                <small>{step >= 3 ? "RESOLVIDO" : step >= 2 ? "CONFLITO" : "COMPARAÇÃO"}</small>
              </div>
              {step >= 2 && step < 3 ? (
                <pre>
                  <code>
                    <b>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</b>{"\n"}
                    {"  <Nome usuario={perfil.nome} />\n"}
                    <b>=======</b>{"\n"}
                    {"  <Avatar src={perfil.avatar} />\n"}
                    <b>&gt;&gt;&gt;&gt;&gt;&gt;&gt; origin/main</b>
                  </code>
                </pre>
              ) : (
                <pre>
                  <code>
                    {"  <Nome usuario={perfil.nome} />\n"}
                    {"  <Avatar src={perfil.avatar} />"}
                  </code>
                </pre>
              )}
            </div>

            {completed ? (
              <div className="branch-finished">
                <span>✓</span>
                <div>
                  <strong>Colaboração pronta para revisão</strong>
                  <p>
                    A branch preserva as duas intenções, registra a coautoria e
                    está publicada para a equipe revisar.
                  </p>
                </div>
                <button onClick={() => setStep(0)}>reiniciar</button>
              </div>
            ) : (
              <>
                <div className="team-next-action">
                  <span>ETAPA {step + 1} DE {steps.length}</span>
                  <strong>{current.title}</strong>
                  <p>{current.explanation}</p>
                </div>

                {"command" in current ? (
                  <div className="branch-command team-command">
                    <div>
                      <span>$</span>
                      <code>{current.command}</code>
                    </div>
                    <button onClick={copyCommand}>
                      {copied ? "copiado" : "copiar"}
                    </button>
                  </div>
                ) : (
                  <div className="team-review-action">
                    <span>↳</span>
                    <div>
                      <small>DECISÃO DA EQUIPE</small>
                      <strong>{current.action}</strong>
                    </div>
                  </div>
                )}

                <button
                  className="branch-run-button"
                  onClick={() => setStep((value) => value + 1)}
                >
                  Simular ação <span>→</span>
                </button>
              </>
            )}

            <div className="team-output" aria-live="polite">
              <div>
                <span>resultado</span>
                <span>{currentState}</span>
              </div>
              {visibleOutput.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="branch-note">
        <span>!</span>
        <p>
          <strong>Coautoria é crédito, não atalho para medalhas.</strong> Use o
          trailer somente quando outra pessoa realmente contribuiu e informe um
          e-mail associado à conta dela no GitHub.
        </p>
      </div>
    </article>
  );
}
