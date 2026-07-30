"use client";

import { useMemo, useState } from "react";

const steps = [
  {
    title: "Abra a proposta como rascunho",
    actor: "Você",
    command:
      'gh pr create --draft --title "feat: adiciona busca" --body "Closes #12"',
    explanation:
      "A branch já está no GitHub. A Pull Request cria um espaço para explicar, comparar e revisar o trabalho antes do merge.",
    event: "abriu esta Pull Request como rascunho",
    status: "Rascunho",
  },
  {
    title: "Marque a proposta como pronta",
    actor: "Você",
    command: "gh pr ready",
    explanation:
      "Sair do rascunho sinaliza que a implementação está pronta para receber uma revisão de verdade.",
    event: "marcou esta Pull Request como pronta para revisão",
    status: "Aberta",
  },
  {
    title: "Receba uma solicitação de mudança",
    actor: "Revisor",
    action: "Solicitar alterações",
    explanation:
      "Uma revisão pode aprovar, comentar ou bloquear o merge até que um problema seja corrigido.",
    event: "solicitou alterações: adicione um estado vazio à busca",
    status: "Alterações solicitadas",
  },
  {
    title: "Envie a correção para a mesma branch",
    actor: "Você",
    command: "git push origin feat/busca",
    explanation:
      "Novos commits enviados para a branch aparecem automaticamente na mesma Pull Request.",
    event: "adicionou 1 commit para tratar resultados vazios",
    status: "Em revisão",
  },
  {
    title: "Conquiste a aprovação",
    actor: "Revisor",
    action: "Aprovar alterações",
    explanation:
      "A aprovação registra que outra pessoa avaliou a proposta e considera a mudança pronta para integrar.",
    event: "aprovou estas alterações",
    status: "Aprovada",
  },
  {
    title: "Faça o merge e encerre o ciclo",
    actor: "Você",
    command: "gh pr merge --squash --delete-branch",
    explanation:
      "O merge integra a proposta à main. A issue relacionada pode ser fechada e a branch concluída, removida.",
    event: "fez squash e merge da Pull Request",
    status: "Integrada",
  },
] as const;

const statusTone = [
  "draft",
  "open",
  "changes",
  "review",
  "approved",
  "merged",
] as const;

export function PullRequestLesson() {
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const completed = step === steps.length;
  const current = steps[Math.min(step, steps.length - 1)];
  const visibleEvents = steps.slice(0, step);
  const progress = Math.round((step / steps.length) * 100);
  const currentStatus = completed
    ? "Integrada"
    : step === 0
      ? "Branch enviada"
      : steps[step - 1].status;
  const currentTone = completed
    ? "merged"
    : step === 0
      ? "branch"
      : statusTone[step - 1];

  const checklist = useMemo(
    () => [
      { label: "Objetivo e contexto descritos", done: step >= 1 },
      { label: "Mudanças revisadas", done: step >= 3 },
      { label: "Feedback resolvido", done: step >= 4 },
      { label: "Aprovação recebida", done: step >= 5 },
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
    <article className="current-lesson pull-request-lesson">
      <div className="lesson-topline">
        <span>PULL REQUESTS · AULA 1 DE 6</span>
        <span className="available-pill">MISSÃO INTERATIVA</span>
      </div>

      <h3>Uma Pull Request é uma conversa sobre uma mudança</h3>
      <p className="lesson-lede">
        A branch guarda os commits. A Pull Request compara essa branch com a
        principal e organiza contexto, revisão, ajustes e aprovação antes do
        merge.
      </p>

      <div className="pr-concept-flow">
        <div>
          <span>01</span>
          <strong>Propor</strong>
          <p>Explique o problema e a solução.</p>
        </div>
        <i>→</i>
        <div>
          <span>02</span>
          <strong>Revisar</strong>
          <p>Converse sobre o código e corrija o necessário.</p>
        </div>
        <i>→</i>
        <div>
          <span>03</span>
          <strong>Integrar</strong>
          <p>Faça o merge quando a mudança estiver segura.</p>
        </div>
      </div>

      <div className="pr-lab">
        <div className="pr-lab-head">
          <div>
            <span>MISSÃO 04</span>
            <strong>Leve uma proposta até a main</strong>
          </div>
          <div className="branch-progress">
            <span>{progress}%</span>
            <i>
              <b style={{ width: `${progress}%` }} />
            </i>
          </div>
        </div>

        <div className="pr-workspace">
          <section className="pr-card" aria-label="Pull Request simulada">
            <div className="pr-card-top">
              <div>
                <small>PULL REQUEST #12</small>
                <strong>feat: adiciona busca aos módulos</strong>
              </div>
              <span className={`pr-status ${currentTone}`}>
                {currentStatus}
              </span>
            </div>

            <p className="pr-summary">
              Facilita encontrar uma aula pelo nome sem percorrer toda a
              trilha. Fecha a issue #12.
            </p>

            <div className="pr-branches">
              <code>feat/busca</code>
              <span>→</span>
              <code>main</code>
            </div>

            <div className="pr-tabs">
              <span className="active">Conversa</span>
              <span>Commits <b>{step >= 4 ? 3 : 2}</b></span>
              <span>Arquivos <b>3</b></span>
              <span className="diff-add">+84</span>
              <span className="diff-remove">−12</span>
            </div>

            <div className="pr-timeline" aria-live="polite">
              {visibleEvents.length === 0 ? (
                <div className="pr-empty-event">
                  <span>◇</span>
                  <p>A proposta começará quando você abrir a Pull Request.</p>
                </div>
              ) : (
                visibleEvents.map((event, index) => (
                  <div className={`pr-event event-${statusTone[index]}`} key={event.event}>
                    <span>{index === 4 ? "✓" : index === 2 ? "!" : "●"}</span>
                    <p>
                      <strong>{event.actor}</strong> {event.event}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          <aside className="pr-checklist">
            <span>CHECKLIST DE MERGE</span>
            {checklist.map((item) => (
              <div className={item.done ? "done" : ""} key={item.label}>
                <i>{item.done ? "✓" : ""}</i>
                <p>{item.label}</p>
              </div>
            ))}
            <div className={`pr-merge-state ${completed ? "ready" : ""}`}>
              <span>{completed ? "✓" : "◇"}</span>
              <p>{completed ? "Merge concluído" : "Merge ainda bloqueado"}</p>
            </div>
          </aside>
        </div>

        <div className="pr-action-panel">
          {completed ? (
            <div className="branch-finished">
              <span>✓</span>
              <div>
                <strong>Pull Request integrada</strong>
                <p>
                  A proposta passou por revisão, foi aprovada e agora faz parte
                  da main.
                </p>
              </div>
              <button onClick={() => setStep(0)}>reiniciar</button>
            </div>
          ) : (
            <>
              <div className="pr-next-action">
                <span>ETAPA {step + 1} DE {steps.length} · {current.actor}</span>
                <strong>{current.title}</strong>
                <p>{current.explanation}</p>
              </div>

              {"command" in current ? (
                <div className="branch-command">
                  <div>
                    <span>$</span>
                    <code>{current.command}</code>
                  </div>
                  <button onClick={copyCommand}>
                    {copied ? "copiado" : "copiar"}
                  </button>
                </div>
              ) : (
                <div className="pr-review-action">
                  <span>↳</span>
                  <div>
                    <small>AÇÃO NA REVISÃO</small>
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
        </div>
      </div>

      <div className="branch-note">
        <span>!</span>
        <p>
          <strong>Pull Request não é sinônimo de merge.</strong> Ela é a
          proposta e o espaço de revisão. O merge é apenas uma possível
          conclusão depois que a mudança estiver pronta.
        </p>
      </div>
    </article>
  );
}
