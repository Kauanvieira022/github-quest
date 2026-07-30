"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

const CommunityScene = dynamic(
  () => import("./CommunityScene").then((module) => module.CommunityScene),
  { ssr: false },
);

const steps = [
  {
    title: "Conheça o projeto e seus acordos",
    action: "Ler README, CONTRIBUTING e Código de Conduta",
    explanation:
      "Antes de alterar código, entenda o objetivo, o processo de contribuição e como a comunidade espera que as pessoas colaborem.",
    output: ["CONTRIBUTING.md encontrado", "CODE_OF_CONDUCT.md encontrado"],
    state: "Contexto compreendido",
    actor: "Contribuidor",
  },
  {
    title: "Encontre uma necessidade real",
    command: "gh issue list --state open",
    explanation:
      "Pesquise antes de propor. Uma Issue pequena e confirmada evita duplicação e permite alinhar a solução com os mantenedores.",
    output: ["#24  docs: explicar git restore", "#21  fix: contraste no celular"],
    state: "Issue escolhida",
    actor: "Contribuidor",
  },
  {
    title: "Crie sua cópia para colaborar",
    command: "gh repo fork Kauanvieira022/github-quest --clone",
    explanation:
      "O fork cria uma cópia no seu perfil. Você trabalha com liberdade nela e depois propõe que o projeto original receba a mudança.",
    output: ["✓ Created fork voce/github-quest", "Cloning into 'github-quest'..."],
    state: "Fork preparado",
    actor: "Contribuidor",
  },
  {
    title: "Isole uma contribuição pequena",
    command: "git switch -c docs/explica-restore",
    explanation:
      "Uma branch focada facilita entender, testar e revisar. Faça commits que contem a história da solução sem misturar outros assuntos.",
    output: ["Switched to a new branch 'docs/explica-restore'"],
    state: "Mudança construída",
    actor: "Contribuidor",
  },
  {
    title: "Abra a proposta para a comunidade",
    command: "gh pr create --fill",
    explanation:
      "A Pull Request apresenta contexto, relaciona a Issue e permite que CI, revisão e conversa melhorem a contribuição.",
    output: ["✓ Pull request created", "checks: Qualidade — queued"],
    state: "Contribuição proposta",
    actor: "Contribuidor",
  },
  {
    title: "Revise, integre e reconheça",
    action: "CI passa, mantenedor revisa e a contribuição é integrada",
    explanation:
      "O mantenedor avalia intenção e qualidade. Depois do merge, releases e notas de versão comunicam o que mudou para quem usa o projeto.",
    output: ["✓ Qualidade", "✓ revisão aprovada", "✓ contribuição integrada"],
    state: "Ciclo concluído",
    actor: "Comunidade",
  },
] as const;

const healthFiles = [
  "README",
  "CONTRIBUTING",
  "Código de Conduta",
  "Política de Segurança",
  "Templates",
] as const;

export function OpenSourceLesson() {
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const completed = step === steps.length;
  const current = steps[Math.min(step, steps.length - 1)];
  const progress = Math.round((step / steps.length) * 100);
  const visibleOutput =
    step === 0 ? ["Aguardando a primeira leitura..."] : steps[step - 1].output;
  const currentState =
    step === 0 ? "Projeto descoberto" : steps[step - 1].state;

  const communityStatus = useMemo(
    () => [
      { label: "contexto", done: step >= 1 },
      { label: "necessidade", done: step >= 2 },
      { label: "fork", done: step >= 3 },
      { label: "branch", done: step >= 4 },
      { label: "proposta", done: step >= 5 },
      { label: "integração", done: step >= 6 },
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
    <article className="current-lesson open-source-lesson">
      <div className="lesson-topline">
        <span>OPEN SOURCE · AULA 1 DE 6</span>
        <span className="available-pill">TRILHA COMPLETA</span>
      </div>

      <h3>Open source é colaboração com contexto, acordos e cuidado</h3>
      <p className="lesson-lede">
        Código visível não basta. Um projeto aberto precisa explicar como
        participar, organizar decisões, proteger a comunidade e comunicar
        mudanças com clareza.
      </p>

      <div className="open-source-concepts">
        <div>
          <span>01</span>
          <strong>Descobrir</strong>
          <p>Entenda o projeto e encontre uma necessidade real.</p>
        </div>
        <div>
          <span>02</span>
          <strong>Contribuir</strong>
          <p>Faça uma mudança pequena, testada e explicada.</p>
        </div>
        <div>
          <span>03</span>
          <strong>Sustentar</strong>
          <p>Revise, proteja, publique e cuide da comunidade.</p>
        </div>
      </div>

      <div className="community-health">
        <div>
          <span>PERFIL DA COMUNIDADE</span>
          <strong>O caminho precisa estar documentado</strong>
        </div>
        <div>
          {healthFiles.map((file) => (
            <span key={file}>
              <i>✓</i> {file}
            </span>
          ))}
          <span className="decision">
            <i>?</i> Licença: decisão do mantenedor
          </span>
        </div>
      </div>

      <div className="open-source-lab">
        <div className="open-source-lab-head">
          <div>
            <span>MISSÃO 08</span>
            <strong>Leve uma contribuição até o projeto</strong>
          </div>
          <div className="branch-progress">
            <span>{progress}%</span>
            <i>
              <b style={{ width: `${progress}%` }} />
            </i>
          </div>
        </div>

        <div className="community-visual">
          <CommunityScene step={step} total={steps.length} />
          <div className={`community-state ${completed ? "complete" : ""}`}>
            <span>{completed ? "✓" : "✦"}</span>
            <div>
              <small>ESTADO DA CONTRIBUIÇÃO</small>
              <strong>{currentState}</strong>
            </div>
          </div>
          <div className="community-label people">
            <small>REDE</small>
            <strong>comunidade</strong>
          </div>
          <div className="community-label project">
            <small>DESTINO</small>
            <strong>projeto original</strong>
          </div>
          <div className="community-label value">
            <small>RESULTADO</small>
            <strong>{completed ? "valor compartilhado" : "proposta em evolução"}</strong>
          </div>
        </div>

        <div className="open-source-workspace">
          <aside className="community-journey">
            <span>JORNADA DA CONTRIBUIÇÃO</span>
            {communityStatus.map((item, index) => (
              <div
                className={`${item.done ? "done" : ""} ${index === step && !completed ? "active" : ""}`}
                key={item.label}
              >
                <i>{item.done ? "✓" : index + 1}</i>
                <p>{item.label}</p>
              </div>
            ))}
          </aside>

          <section className="open-source-action">
            <div className="contribution-card">
              <div>
                <span>CONTRIBUIÇÃO #42</span>
                <small>{completed ? "INTEGRADA" : currentState.toUpperCase()}</small>
              </div>
              <strong>docs: explica quando usar git restore</strong>
              <p>
                Ajuda iniciantes a desfazer mudanças locais sem confundir
                working directory, staging area e histórico.
              </p>
              <div className="contribution-meta">
                <span>Issue #24</span>
                <span>1 commit</span>
                <span>+32 −4</span>
              </div>
            </div>

            {completed ? (
              <div className="branch-finished">
                <span>✓</span>
                <div>
                  <strong>Trilha inicial concluída</strong>
                  <p>
                    Você percorreu do primeiro commit à colaboração open source
                    com verificações e acordos reais.
                  </p>
                </div>
                <button onClick={() => setStep(0)}>reiniciar</button>
              </div>
            ) : (
              <>
                <div className="open-source-next">
                  <span>ETAPA {step + 1} DE {steps.length} · {current.actor}</span>
                  <strong>{current.title}</strong>
                  <p>{current.explanation}</p>
                </div>

                {"command" in current ? (
                  <div className="branch-command open-source-command">
                    <div>
                      <span>$</span>
                      <code>{current.command}</code>
                    </div>
                    <button onClick={copyCommand}>
                      {copied ? "copiado" : "copiar"}
                    </button>
                  </div>
                ) : (
                  <div className="community-action-card">
                    <span>↳</span>
                    <div>
                      <small>AÇÃO COLABORATIVA</small>
                      <strong>{current.action}</strong>
                    </div>
                  </div>
                )}

                <button
                  className="branch-run-button"
                  onClick={() => setStep((value) => value + 1)}
                >
                  Avançar contribuição <span>→</span>
                </button>
              </>
            )}

            <div className="community-output" aria-live="polite">
              <div>
                <span>atividade</span>
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
          <strong>Achievements são consequência de participação legítima.</strong>{" "}
          Issues, Pull Requests, revisões e Discussions devem existir para
          melhorar projetos e ajudar pessoas — nunca apenas para fabricar
          atividade.
        </p>
      </div>
    </article>
  );
}
