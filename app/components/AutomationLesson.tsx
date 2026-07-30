"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

const PipelineScene = dynamic(
  () => import("./PipelineScene").then((module) => module.PipelineScene),
  { ssr: false },
);

const steps = [
  {
    title: "Dispare o workflow",
    code: "on: pull_request",
    explanation:
      "Um evento inicia a execução. Neste projeto, cada Pull Request para a main cria uma verificação nova.",
    output: ["Workflow run queued", "event: pull_request"],
    state: "Execução criada",
  },
  {
    title: "Obtenha uma cópia do repositório",
    code: "uses: actions/checkout@v7",
    explanation:
      "O runner começa vazio. Checkout coloca o código do commit que está sendo verificado dentro desse ambiente temporário.",
    output: ["Syncing repository: voce/projeto", "HEAD is now at a1b2c3d"],
    state: "Código disponível",
  },
  {
    title: "Prepare o ambiente",
    code: "uses: actions/setup-node@v7",
    explanation:
      "Setup Node instala a versão definida pelo projeto e pode reutilizar o cache do npm para acelerar próximas execuções.",
    output: ["Found in cache @ /opt/hostedtoolcache/node/22.x", "npm cache restored"],
    state: "Node 22 preparado",
  },
  {
    title: "Instale de forma reproduzível",
    code: "run: npm ci",
    explanation:
      "npm ci respeita exatamente o package-lock.json e falha se ele estiver incompatível, evitando instalações diferentes entre máquinas.",
    output: ["added 412 packages", "dependencies installed from lockfile"],
    state: "Dependências instaladas",
  },
  {
    title: "Verifique código e comportamento",
    code: "run: npm run lint && npm run test",
    explanation:
      "Lint encontra problemas de código; testes confirmam comportamentos esperados. Uma falha interrompe o job e bloqueia a aprovação.",
    output: ["eslint .", "tests 9", "pass 9", "fail 0"],
    state: "Qualidade aprovada",
  },
  {
    title: "Prove que a aplicação compila",
    code: "run: npm run build",
    explanation:
      "O build de produção valida TypeScript, renderização e empacotamento. Só depois dele o check fica verde.",
    output: ["Compiled successfully", "Generating static pages (3/3)", "Process completed with exit code 0"],
    state: "Pipeline aprovado",
  },
] as const;

const jobRows = [
  "Evento recebido",
  "Obter o código",
  "Preparar Node.js",
  "Instalar dependências",
  "Lint e testes",
  "Gerar o build",
] as const;

export function AutomationLesson() {
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const completed = step === steps.length;
  const current = steps[Math.min(step, steps.length - 1)];
  const progress = Math.round((step / steps.length) * 100);
  const visibleOutput =
    step === 0 ? ["Aguardando um evento do GitHub..."] : steps[step - 1].output;
  const currentState =
    step === 0 ? "Workflow aguardando" : steps[step - 1].state;

  const summary = useMemo(
    () => ({
      passed: step,
      running: completed ? 0 : 1,
      waiting: Math.max(0, steps.length - step - (completed ? 0 : 1)),
    }),
    [completed, step],
  );

  async function copyCode() {
    await navigator.clipboard.writeText(current.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1300);
  }

  return (
    <article className="current-lesson automation-lesson">
      <div className="lesson-topline">
        <span>AUTOMAÇÃO · AULA 1 DE 5</span>
        <span className="available-pill">PIPELINE REAL</span>
      </div>

      <h3>Automação transforma acordos em verificações repetíveis</h3>
      <p className="lesson-lede">
        GitHub Actions executa workflows quando eventos acontecem no
        repositório. Cada job roda em um ambiente novo e reúne etapas que
        instalam, testam e validam o projeto.
      </p>

      <div className="automation-concepts">
        <div>
          <span>01</span>
          <strong>Evento</strong>
          <p>Push ou Pull Request dispara o workflow.</p>
        </div>
        <div>
          <span>02</span>
          <strong>Job + runner</strong>
          <p>Uma máquina temporária executa o trabalho.</p>
        </div>
        <div>
          <span>03</span>
          <strong>Steps</strong>
          <p>Ações e comandos produzem um resultado verificável.</p>
        </div>
      </div>

      <div className="automation-lab">
        <div className="automation-lab-head">
          <div>
            <span>MISSÃO 07</span>
            <strong>Leve um commit até o check verde</strong>
          </div>
          <div className="branch-progress">
            <span>{progress}%</span>
            <i>
              <b style={{ width: `${progress}%` }} />
            </i>
          </div>
        </div>

        <div className="pipeline-visual">
          <PipelineScene step={step} total={steps.length} />
          <div className={`pipeline-state ${completed ? "complete" : ""}`}>
            <span>{completed ? "✓" : "⚙"}</span>
            <div>
              <small>STATUS DO WORKFLOW</small>
              <strong>{currentState}</strong>
            </div>
          </div>
          <div className="pipeline-label trigger">
            <small>GATILHO</small>
            <strong>pull_request</strong>
          </div>
          <div className="pipeline-label runner">
            <small>AMBIENTE</small>
            <strong>ubuntu-latest</strong>
          </div>
          <div className="pipeline-label result">
            <small>CHECK</small>
            <strong>{completed ? "aprovado" : "em andamento"}</strong>
          </div>
        </div>

        <div className="automation-workspace">
          <aside className="workflow-map">
            <div className="workflow-map-head">
              <span>QUALIDADE.YML</span>
              <small>{summary.passed}/{steps.length}</small>
            </div>
            {jobRows.map((row, index) => {
              const status =
                index < step ? "passed" : index === step && !completed ? "running" : "waiting";
              return (
                <div className={`workflow-row ${status}`} key={row}>
                  <i>{status === "passed" ? "✓" : status === "running" ? "●" : ""}</i>
                  <p>{row}</p>
                </div>
              );
            })}
            <div className="workflow-summary">
              <span><b>{summary.passed}</b> aprovadas</span>
              <span><b>{summary.running}</b> executando</span>
              <span><b>{summary.waiting}</b> aguardando</span>
            </div>
          </aside>

          <section className="automation-action">
            <div className="workflow-code">
              <div>
                <span>.github/workflows/qualidade.yml</span>
                <small>YAML</small>
              </div>
              <pre>
                <code>
                  <b>name:</b> Qualidade{"\n"}
                  <b>on:</b> [pull_request, push]{"\n"}
                  <b>jobs:</b>{"\n"}
                  {"  qualidade:\n"}
                  {"    runs-on: ubuntu-latest\n"}
                  {"    steps: checkout → node → ci → checks"}
                </code>
              </pre>
            </div>

            {completed ? (
              <div className="branch-finished">
                <span>✓</span>
                <div>
                  <strong>Pipeline aprovado</strong>
                  <p>
                    O mesmo processo será executado pelo GitHub Actions neste
                    Pull Request.
                  </p>
                </div>
                <button onClick={() => setStep(0)}>reiniciar</button>
              </div>
            ) : (
              <>
                <div className="automation-next-action">
                  <span>ETAPA {step + 1} DE {steps.length}</span>
                  <strong>{current.title}</strong>
                  <p>{current.explanation}</p>
                </div>
                <div className="branch-command automation-command">
                  <div>
                    <span>›</span>
                    <code>{current.code}</code>
                  </div>
                  <button onClick={copyCode}>
                    {copied ? "copiado" : "copiar"}
                  </button>
                </div>
                <button
                  className="branch-run-button"
                  onClick={() => setStep((value) => value + 1)}
                >
                  Executar etapa <span>→</span>
                </button>
              </>
            )}

            <div className="automation-output" aria-live="polite">
              <div>
                <span>log do runner</span>
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
          <strong>Um check verde reduz risco, mas não substitui revisão.</strong>{" "}
          Automação confirma regras conhecidas; pessoas ainda avaliam intenção,
          segurança e impacto da mudança.
        </p>
      </div>
    </article>
  );
}
