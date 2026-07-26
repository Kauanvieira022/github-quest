"use client";

import { useMemo, useState } from "react";

const steps = [
  {
    title: "Crie e acesse a branch",
    command: "git switch -c feat/menu",
    explanation:
      "O parâmetro -c cria a branch e move o HEAD para ela em um único comando.",
  },
  {
    title: "Registre a funcionalidade",
    command: 'git commit -m "feat: adiciona menu"',
    explanation:
      "O novo commit pertence à feat/menu. A main continua apontando para o estado anterior.",
  },
  {
    title: "Volte para a principal",
    command: "git switch main",
    explanation:
      "Trocar de branch muda os arquivos visíveis para o estado registrado pela main.",
  },
  {
    title: "Mescle a funcionalidade",
    command: "git merge feat/menu",
    explanation:
      "O merge incorpora à main os commits que foram produzidos na branch.",
  },
  {
    title: "Remova a branch concluída",
    command: "git branch -d feat/menu",
    explanation:
      "Depois do merge, o ponteiro temporário pode ser removido sem apagar os commits.",
  },
] as const;

export function BranchLesson() {
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const current = steps[Math.min(step, steps.length - 1)];
  const completed = step === steps.length;
  const activeBranch = step >= 1 && step < 3 ? "feat/menu" : "main";
  const progress = Math.round((step / steps.length) * 100);

  const terminalOutput = useMemo(() => {
    if (step === 0) {
      return ["On branch main", "nothing to commit, working tree clean"];
    }
    if (step === 1) {
      return ["Switched to a new branch 'feat/menu'"];
    }
    if (step === 2) {
      return [
        "[feat/menu b7c8d9e] feat: adiciona menu",
        "2 files changed, 38 insertions(+)",
      ];
    }
    if (step === 3) {
      return ["Switched to branch 'main'"];
    }
    if (step === 4) {
      return [
        "Updating a1b2c3d..b7c8d9e",
        "Fast-forward",
        "2 files changed, 38 insertions(+)",
      ];
    }
    return ["Deleted branch feat/menu (was b7c8d9e)."];
  }, [step]);

  async function copyCurrentCommand() {
    if (completed) return;
    await navigator.clipboard.writeText(current.command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1300);
  }

  return (
    <article className="current-lesson branch-lesson">
      <div className="lesson-topline">
        <span>BRANCHES · AULA 1 DE 5</span>
        <span className="available-pill">LABORATÓRIO VISUAL</span>
      </div>

      <h3>Branches são caminhos, não cópias do projeto</h3>
      <p className="lesson-lede">
        Uma branch é um ponteiro móvel para um commit. Ela permite desenvolver
        uma ideia em separado e só aproximá-la da versão principal quando o
        trabalho estiver pronto.
      </p>

      <div className="branch-concepts">
        <div>
          <span>01</span>
          <strong>Isolar</strong>
          <p>Novas mudanças não interrompem a versão principal.</p>
        </div>
        <div>
          <span>02</span>
          <strong>Experimentar</strong>
          <p>O caminho pode avançar, mudar ou ser descartado.</p>
        </div>
        <div>
          <span>03</span>
          <strong>Integrar</strong>
          <p>O merge reúne o trabalho quando ele está validado.</p>
        </div>
      </div>

      <div className="branch-lab">
        <div className="branch-lab-head">
          <div>
            <span>MISSÃO 03</span>
            <strong>Desenvolva sem mexer na main</strong>
          </div>
          <div className="branch-progress">
            <span>{progress}%</span>
            <i>
              <b style={{ width: `${progress}%` }} />
            </i>
          </div>
        </div>

        <div className="branch-visual" aria-label="Representação visual das branches">
          <div className="graph-head">
            <span className="head-badge">HEAD → {activeBranch}</span>
            <span>{completed ? "fluxo concluído" : `etapa ${step + 1} de ${steps.length}`}</span>
          </div>

          <div className="graph-row main-row">
            <span className="lane-name">main</span>
            <div className="lane-track">
              <span className="commit-dot completed">a1</span>
              <i />
              <span className="commit-dot completed">b2</span>
              <i className={step >= 4 ? "filled" : ""} />
              <span className={`commit-dot merge-dot ${step >= 4 ? "visible" : ""}`}>
                m4
              </span>
              <span className={`branch-label main-label ${activeBranch === "main" ? "active" : ""}`}>
                main
              </span>
            </div>
          </div>

          <div className={`graph-row feature-row ${step >= 1 ? "visible" : ""}`}>
            <span className="lane-name">feat/menu</span>
            <div className="lane-track">
              <span className="branch-origin" />
              <i className="feature-line" />
              <span className={`commit-dot feature-dot ${step >= 2 ? "completed" : ""}`}>
                c3
              </span>
              <span className={`branch-label feature-label ${activeBranch === "feat/menu" ? "active" : ""} ${step >= 5 ? "deleted" : ""}`}>
                {step >= 5 ? "removida" : "feat/menu"}
              </span>
            </div>
          </div>
        </div>

        <div className="branch-command-panel">
          {completed ? (
            <div className="branch-finished">
              <span>✓</span>
              <div>
                <strong>Fluxo concluído</strong>
                <p>A funcionalidade agora faz parte da main e o histórico foi preservado.</p>
              </div>
              <button onClick={() => setStep(0)}>reiniciar</button>
            </div>
          ) : (
            <>
              <div className="branch-step-copy">
                <span>PRÓXIMA AÇÃO</span>
                <strong>{current.title}</strong>
                <p>{current.explanation}</p>
              </div>
              <div className="branch-command">
                <div>
                  <span>$</span>
                  <code>{current.command}</code>
                </div>
                <button onClick={copyCurrentCommand}>
                  {copied ? "copiado" : "copiar"}
                </button>
              </div>
              <button className="branch-run-button" onClick={() => setStep((value) => value + 1)}>
                Executar etapa <span>→</span>
              </button>
            </>
          )}
        </div>

        <div className="branch-output">
          <div className="branch-output-bar">
            <span>resultado do terminal</span>
            <span>{activeBranch}</span>
          </div>
          {terminalOutput.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>

      <div className="branch-note">
        <span>!</span>
        <p>
          <strong>Uma branch não duplica todos os arquivos.</strong> Ela guarda
          uma referência para um ponto do histórico e avança conforme novos
          commits são criados.
        </p>
      </div>
    </article>
  );
}
