"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

const RemoteFlowScene = dynamic(
  () =>
    import("./RemoteFlowScene").then((module) => module.RemoteFlowScene),
  { ssr: false },
);

const steps = [
  {
    title: "Inspecione a conexão",
    command: "git remote -v",
    explanation:
      "Um remote é um apelido para a URL de outro repositório. Por convenção, o primeiro costuma se chamar origin.",
    output: [
      "origin  https://github.com/voce/projeto.git (fetch)",
      "origin  https://github.com/voce/projeto.git (push)",
    ],
    state: "Conexão identificada",
  },
  {
    title: "Atualize as referências remotas",
    command: "git fetch origin",
    explanation:
      "Fetch baixa commits e atualiza origin/main sem alterar os arquivos da sua branch atual.",
    output: [
      "From github.com:voce/projeto",
      "   a1b2c3d..d4e5f6a  main -> origin/main",
    ],
    state: "Referências atualizadas",
  },
  {
    title: "Compare local e remoto",
    command: "git status -sb",
    explanation:
      "Agora o Git consegue mostrar que a main local está dois commits atrás de origin/main.",
    output: ["## main...origin/main [behind 2]"],
    state: "Diferença detectada",
  },
  {
    title: "Integre sem criar merge desnecessário",
    command: "git pull --ff-only origin main",
    explanation:
      "Pull executa fetch e integração. --ff-only interrompe a operação se não for possível avançar em linha reta.",
    output: [
      "Updating a1b2c3d..d4e5f6a",
      "Fast-forward",
      "2 files changed, 24 insertions(+)",
    ],
    state: "Main sincronizada",
  },
  {
    title: "Publique sua branch",
    command: "git push -u origin feat/perfil",
    explanation:
      "Push envia os commits locais. -u associa a branch local à remota para simplificar os próximos comandos.",
    output: [
      "new branch  feat/perfil -> feat/perfil",
      "branch 'feat/perfil' set up to track 'origin/feat/perfil'",
    ],
    state: "Branch publicada",
  },
  {
    title: "Confirme o rastreamento",
    command: "git branch -vv",
    explanation:
      "A listagem mostra qual branch remota acompanha cada branch local e se os históricos estão alinhados.",
    output: [
      "  main        d4e5f6a [origin/main] atualiza documentação",
      "* feat/perfil f7g8h9i [origin/feat/perfil] adiciona perfil",
    ],
    state: "Tudo sincronizado",
  },
] as const;

export function RemoteLesson() {
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const completed = step === steps.length;
  const current = steps[Math.min(step, steps.length - 1)];
  const progress = Math.round((step / steps.length) * 100);
  const visibleOutput = step === 0 ? ["Aguardando o primeiro comando..."] : steps[step - 1].output;
  const currentState =
    step === 0 ? "Conexão não inspecionada" : steps[step - 1].state;

  const indicators = useMemo(
    () => [
      { label: "origin configurado", done: step >= 1 },
      { label: "referências baixadas", done: step >= 2 },
      { label: "main atualizada", done: step >= 4 },
      { label: "branch publicada", done: step >= 5 },
    ],
    [step],
  );

  async function copyCommand() {
    if (completed) return;
    await navigator.clipboard.writeText(current.command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1300);
  }

  return (
    <article className="current-lesson remote-lesson">
      <div className="lesson-topline">
        <span>REPOSITÓRIOS REMOTOS · AULA 1 DE 6</span>
        <span className="available-pill">LABORATÓRIO 3D</span>
      </div>

      <h3>Local e GitHub são históricos que precisam conversar</h3>
      <p className="lesson-lede">
        Seu repositório local funciona sem internet. Um remote conecta esse
        histórico a outro endereço para buscar mudanças, comparar estados e
        publicar commits.
      </p>

      <div className="remote-concepts">
        <div>
          <span>01</span>
          <strong>Local</strong>
          <p>Branches, commits e arquivos no seu computador.</p>
        </div>
        <div>
          <span>02</span>
          <strong>origin</strong>
          <p>O apelido da conexão, não uma terceira cópia do projeto.</p>
        </div>
        <div>
          <span>03</span>
          <strong>GitHub</strong>
          <p>O repositório remoto compartilhado com a equipe.</p>
        </div>
      </div>

      <div className="remote-lab">
        <div className="remote-lab-head">
          <div>
            <span>MISSÃO 05</span>
            <strong>Sincronize local e GitHub</strong>
          </div>
          <div className="branch-progress">
            <span>{progress}%</span>
            <i>
              <b style={{ width: `${progress}%` }} />
            </i>
          </div>
        </div>

        <div className="remote-visual">
          <RemoteFlowScene step={step} />
          <div className="remote-node-label local">
            <small>SEU COMPUTADOR</small>
            <strong>local</strong>
          </div>
          <div className="remote-node-label origin">
            <small>APELIDO</small>
            <strong>origin</strong>
          </div>
          <div className="remote-node-label github">
            <small>NA NUVEM</small>
            <strong>GitHub</strong>
          </div>
          <div className={`remote-sync-state ${completed ? "complete" : ""}`}>
            <span>{completed ? "✓" : "↕"}</span>
            <div>
              <small>ESTADO DA REDE</small>
              <strong>{currentState}</strong>
            </div>
          </div>
        </div>

        <div className="remote-workspace">
          <aside className="remote-indicators">
            <span>MAPA DE SINCRONIZAÇÃO</span>
            {indicators.map((indicator) => (
              <div className={indicator.done ? "done" : ""} key={indicator.label}>
                <i>{indicator.done ? "✓" : ""}</i>
                <p>{indicator.label}</p>
              </div>
            ))}
          </aside>

          <section className="remote-action">
            {completed ? (
              <div className="branch-finished">
                <span>✓</span>
                <div>
                  <strong>Sincronização concluída</strong>
                  <p>Local, origin e GitHub agora apontam para os estados esperados.</p>
                </div>
                <button onClick={() => setStep(0)}>reiniciar</button>
              </div>
            ) : (
              <>
                <div className="remote-next-action">
                  <span>ETAPA {step + 1} DE {steps.length}</span>
                  <strong>{current.title}</strong>
                  <p>{current.explanation}</p>
                </div>
                <div className="branch-command">
                  <div>
                    <span>$</span>
                    <code>{current.command}</code>
                  </div>
                  <button onClick={copyCommand}>
                    {copied ? "copiado" : "copiar"}
                  </button>
                </div>
                <button
                  className="branch-run-button"
                  onClick={() => setStep((value) => value + 1)}
                >
                  Simular comando <span>→</span>
                </button>
              </>
            )}

            <div className="remote-output" aria-live="polite">
              <div>
                <span>resultado do terminal</span>
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
          <strong>Fetch não altera sua branch atual.</strong> Ele atualiza as
          referências remotas para você comparar antes de decidir como integrar
          as mudanças.
        </p>
      </div>
    </article>
  );
}
