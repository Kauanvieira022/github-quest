"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { BranchLesson } from "./components/BranchLesson";
import { CommitLesson } from "./components/CommitLesson";
import { PullRequestLesson } from "./components/PullRequestLesson";
import { RemoteLesson } from "./components/RemoteLesson";
import { TeamLesson } from "./components/TeamLesson";

const GitGraphScene = dynamic(
  () =>
    import("./components/GitGraphScene").then((module) => module.GitGraphScene),
  { ssr: false },
);

type TerminalState = {
  initialized: boolean;
  fileCreated: boolean;
  staged: boolean;
  committed: boolean;
};

type TerminalEntry = {
  command?: string;
  output: string[];
  tone?: "default" | "success" | "warning";
};

type Module = {
  number: string;
  title: string;
  description: string;
  lessons: number;
  icon: string;
  available: boolean;
};

const modules: Module[] = [
  {
    number: "01",
    title: "Fundamentos",
    description: "Entenda repositórios, arquivos e o ciclo básico do Git.",
    lessons: 4,
    icon: "⌁",
    available: true,
  },
  {
    number: "02",
    title: "Commits",
    description: "Registre mudanças pequenas, claras e fáceis de revisar.",
    lessons: 5,
    icon: "●",
    available: true,
  },
  {
    number: "03",
    title: "Branches",
    description: "Trabalhe em novas ideias sem interromper a versão principal.",
    lessons: 5,
    icon: "⑂",
    available: true,
  },
  {
    number: "04",
    title: "Pull Requests",
    description: "Proponha mudanças, receba feedback e faça merges seguros.",
    lessons: 6,
    icon: "⇄",
    available: true,
  },
  {
    number: "05",
    title: "Repositórios remotos",
    description: "Conecte o trabalho local ao GitHub com push, pull e fetch.",
    lessons: 6,
    icon: "↥",
    available: true,
  },
  {
    number: "06",
    title: "Trabalho em equipe",
    description: "Resolva conflitos, revise código e registre coautoria.",
    lessons: 5,
    icon: "∞",
    available: true,
  },
  {
    number: "07",
    title: "Automação",
    description: "Use Actions para testar, revisar e publicar com confiança.",
    lessons: 5,
    icon: "⚙",
    available: false,
  },
  {
    number: "08",
    title: "Open source",
    description: "Organize releases, comunidade, segurança e contribuições.",
    lessons: 6,
    icon: "✦",
    available: false,
  },
];

const missionSteps = [
  {
    key: "initialized",
    label: "Inicialize o repositório",
    command: "git init",
  },
  {
    key: "fileCreated",
    label: "Crie o primeiro arquivo",
    command: "touch README.md",
  },
  {
    key: "status",
    label: "Inspecione as mudanças",
    command: "git status",
  },
  {
    key: "staged",
    label: "Prepare o arquivo",
    command: "git add README.md",
  },
  {
    key: "committed",
    label: "Registre o primeiro commit",
    command: 'git commit -m "start project"',
  },
] as const;

const achievements = [
  {
    icon: "🦈",
    title: "Pull Shark",
    description: "Dois Pull Requests aceitos.",
    projectAction: "Construir os próximos módulos por PR.",
  },
  {
    icon: "🤝",
    title: "Pair Extraordinaire",
    description: "Um commit coautorado mesclado.",
    projectAction: "Criar uma aula em pair programming.",
  },
  {
    icon: "🧠",
    title: "Galaxy Brain",
    description: "Respostas aceitas em Discussions.",
    projectAction: "Responder dúvidas da comunidade.",
  },
  {
    icon: "⭐",
    title: "Starstruck",
    description: "Um projeto reconhecido pela comunidade.",
    projectAction: "Ensinar bem o bastante para merecer estrelas.",
  },
];

const initialTerminalState: TerminalState = {
  initialized: false,
  fileCreated: false,
  staged: false,
  committed: false,
};

const initialEntries: TerminalEntry[] = [
  {
    output: [
      "Git Quest Terminal v1.0",
      'Digite "help" para ver os comandos disponíveis.',
    ],
  },
];

export default function Home() {
  const [activeModule, setActiveModule] = useState("01");
  const [terminalState, setTerminalState] =
    useState<TerminalState>(initialTerminalState);
  const [entries, setEntries] = useState<TerminalEntry[]>(initialEntries);
  const [command, setCommand] = useState("");
  const [statusChecked, setStatusChecked] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const terminalEnd = useRef<HTMLDivElement>(null);
  const terminalInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("github-quest-lab");
    let savedState = initialTerminalState;
    let savedStatusChecked = false;

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as {
          state: TerminalState;
          statusChecked: boolean;
        };
        savedState = parsed.state;
        savedStatusChecked = parsed.statusChecked;
      } catch {
        // Invalid saved progress falls back to a fresh laboratory.
      }
    }

    queueMicrotask(() => {
      setTerminalState(savedState);
      setStatusChecked(savedStatusChecked);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      "github-quest-lab",
      JSON.stringify({ state: terminalState, statusChecked }),
    );
  }, [hydrated, statusChecked, terminalState]);

  useEffect(() => {
    terminalEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  const completedSteps = useMemo(
    () =>
      [
        terminalState.initialized,
        terminalState.fileCreated,
        statusChecked,
        terminalState.staged,
        terminalState.committed,
      ].filter(Boolean).length,
    [statusChecked, terminalState],
  );

  const lessonProgress = Math.round(
    (completedSteps / missionSteps.length) * 100,
  );

  function addEntry(entry: TerminalEntry) {
    setEntries((current) => [...current, entry]);
  }

  function runCommand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = command.trim();
    const normalized = raw.replace(/\s+/g, " ");
    setCommand("");

    if (!raw) return;

    if (normalized === "clear") {
      setEntries([]);
      return;
    }

    if (normalized === "help") {
      addEntry({
        command: raw,
        output: [
          "git init",
          "touch README.md",
          "git status",
          "git add README.md",
          'git commit -m "sua mensagem"',
          "git log --oneline",
          "reset",
          "clear",
        ],
      });
      return;
    }

    if (normalized === "reset") {
      setTerminalState(initialTerminalState);
      setStatusChecked(false);
      addEntry({
        command: raw,
        output: ["Laboratório reiniciado. A pasta voltou ao estado inicial."],
        tone: "warning",
      });
      return;
    }

    if (normalized === "git init") {
      setTerminalState((current) => ({ ...current, initialized: true }));
      addEntry({
        command: raw,
        output: terminalState.initialized
          ? ["Reinitialized existing Git repository in /home/quest/.git/"]
          : ["Initialized empty Git repository in /home/quest/.git/"],
        tone: "success",
      });
      return;
    }

    if (normalized === "touch README.md") {
      if (!terminalState.initialized) {
        addEntry({
          command: raw,
          output: ['Primeiro transforme a pasta em um repositório com "git init".'],
          tone: "warning",
        });
        return;
      }
      setTerminalState((current) => ({ ...current, fileCreated: true }));
      addEntry({
        command: raw,
        output: ["Arquivo README.md criado."],
        tone: "success",
      });
      return;
    }

    if (normalized === "git status") {
      if (!terminalState.initialized) {
        addEntry({
          command: raw,
          output: ["fatal: not a git repository"],
          tone: "warning",
        });
        return;
      }

      setStatusChecked(true);
      const statusOutput = terminalState.committed
        ? ["On branch main", "nothing to commit, working tree clean"]
        : terminalState.staged
          ? [
              "On branch main",
              "Changes to be committed:",
              "  new file:   README.md",
            ]
          : terminalState.fileCreated
            ? [
                "On branch main",
                "Untracked files:",
                "  README.md",
                'use "git add" to track',
              ]
            : ["On branch main", "No commits yet", "nothing to commit"];

      addEntry({ command: raw, output: statusOutput });
      return;
    }

    if (normalized === "git add README.md" || normalized === "git add .") {
      if (!terminalState.fileCreated) {
        addEntry({
          command: raw,
          output: ["fatal: pathspec 'README.md' did not match any files"],
          tone: "warning",
        });
        return;
      }
      setTerminalState((current) => ({ ...current, staged: true }));
      addEntry({
        command: raw,
        output: ["README.md foi adicionado à staging area."],
        tone: "success",
      });
      return;
    }

    if (/^git commit -m (["']).+\1$/.test(normalized)) {
      if (!terminalState.staged) {
        addEntry({
          command: raw,
          output: [
            "nothing added to commit",
            'use "git add README.md" before committing',
          ],
          tone: "warning",
        });
        return;
      }
      const message = normalized.match(/^git commit -m ["'](.+)["']$/)?.[1];
      setTerminalState((current) => ({ ...current, committed: true }));
      addEntry({
        command: raw,
        output: [
          `[main (root-commit) a1b2c3d] ${message}`,
          "1 file changed, 0 insertions(+), 0 deletions(-)",
          "create mode 100644 README.md",
        ],
        tone: "success",
      });
      return;
    }

    if (normalized === "git log --oneline") {
      addEntry({
        command: raw,
        output: terminalState.committed
          ? ["a1b2c3d start project"]
          : ["fatal: your current branch 'main' does not have any commits yet"],
        tone: terminalState.committed ? "success" : "warning",
      });
      return;
    }

    addEntry({
      command: raw,
      output: [`quest: comando não reconhecido: ${raw}`, 'Digite "help".'],
      tone: "warning",
    });
  }

  async function copyCommand(value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedCommand(value);
    window.setTimeout(() => setCopiedCommand(null), 1300);
  }

  function scrollToCourse() {
    document.querySelector("#curso")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <header className="site-header">
        <a className="logo" href="#inicio" aria-label="GitHub Quest — início">
          <span className="logo-mark">GQ</span>
          <span>GitHub Quest</span>
        </a>
        <nav aria-label="Navegação principal">
          <a href="#curso">Curso</a>
          <a href="#laboratorio">Laboratório</a>
          <a href="#projeto">Projeto real</a>
        </nav>
        <button className="header-progress" onClick={scrollToCourse}>
          <span>{lessonProgress}%</span>
          <span>continuar jornada</span>
        </button>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-scene" aria-hidden="true">
          <GitGraphScene />
        </div>
        <div className="hero-content page-shell">
          <div className="hero-copy">
            <span className="overline">
              <span />
              APRENDA FAZENDO
            </span>
            <h1>
              Git não precisa
              <br />
              parecer <em>difícil.</em>
            </h1>
            <p>
              Aprenda Git e GitHub em pequenas missões. Teste comandos com
              segurança, entenda o que acontece e leve cada conceito para um
              projeto de verdade.
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={scrollToCourse}>
                Começar o curso <span>→</span>
              </button>
              <a className="text-link" href="#projeto">
                Como o projeto evolui
              </a>
            </div>
            <div className="hero-proof">
              <span>
                <strong>8</strong> módulos
              </span>
              <span>
                <strong>42</strong> pequenas aulas
              </span>
              <span>
                <strong>1</strong> projeto real
              </span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-visual-label">
              <span>GRAFO AO VIVO</span>
              <strong>main + 2 branches</strong>
            </div>
            <div className="hero-terminal" aria-label="Exemplo de terminal Git">
              <div className="window-bar">
                <div>
                  <span />
                  <span />
                  <span />
                </div>
                <p>quest — ~/primeiro-repo</p>
                <span>⌘</span>
              </div>
              <div className="terminal-preview">
                <p className="comment"># transforme uma pasta em repositório</p>
                <p>
                  <span className="prompt">$</span> git init
                </p>
                <p className="terminal-success">
                  Initialized empty Git repository
                </p>
                <p>
                  <span className="prompt">$</span> git add README.md
                </p>
                <p>
                  <span className="prompt">$</span> git commit -m{" "}
                  <span className="string">&quot;start project&quot;</span>
                </p>
                <p className="terminal-success">
                  [main a1b2c3d] start project
                </p>
                <p className="cursor-line">
                  <span className="prompt">$</span> <span className="cursor" />
                </p>
              </div>
              <div className="preview-card">
                <span className="preview-icon">✓</span>
                <div>
                  <strong>Primeiro checkpoint</strong>
                  <span>Você acabou de criar um histórico.</span>
                </div>
                <small>+120 XP</small>
              </div>
            </div>
            <div className="hero-branch-chip">
              <span>⑂</span>
              <div>
                <small>HEAD</small>
                <strong>feat/primeira-missão</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="principles-strip">
        <div className="page-shell">
          <p>NÃO DECORE COMANDOS. ENTENDA O FLUXO.</p>
          <span>Conceito</span>
          <i>→</i>
          <span>Comando</span>
          <i>→</i>
          <span>Missão segura</span>
          <i>→</i>
          <span>Projeto real</span>
        </div>
      </section>

      <section className="course-section page-shell" id="curso">
        <div className="section-intro">
          <div>
            <span className="section-number">01 / A JORNADA</span>
            <h2>Do primeiro commit ao open source</h2>
          </div>
          <p>
            Cada módulo explica uma parte do fluxo e termina com uma missão
            curta. Você aprende o motivo antes de usar o comando.
          </p>
        </div>

        <div className="course-layout">
          <aside className="module-list" aria-label="Módulos do curso">
            <div className="module-list-head">
              <span>TRILHA COMPLETA</span>
              <strong>{modules.length} módulos</strong>
            </div>
            {modules.map((module) => (
              <button
                className={`module-row ${activeModule === module.number ? "active" : ""}`}
                key={module.number}
                disabled={!module.available}
                onClick={() => setActiveModule(module.number)}
              >
                <span className="module-icon">{module.icon}</span>
                <span className="module-copy">
                  <small>MÓDULO {module.number}</small>
                  <strong>{module.title}</strong>
                </span>
                <span className="module-meta">
                  {activeModule === module.number
                    ? "ABERTO"
                    : module.available
                      ? "DISPONÍVEL"
                      : `${module.lessons} AULAS`}
                </span>
              </button>
            ))}
          </aside>

          {activeModule === "01" ? (
          <article className="current-lesson">
            <div className="lesson-topline">
              <span>FUNDAMENTOS · AULA 1 DE 4</span>
              <span className="available-pill">DISPONÍVEL</span>
            </div>
            <h3>O que o Git realmente observa?</h3>
            <p className="lesson-lede">
              Git é um sistema de controle de versão. Ele compara estados dos
              seus arquivos e permite registrar checkpoints que você pode
              consultar, compartilhar ou recuperar depois.
            </p>

            <div className="concept-flow">
              <div>
                <span>01</span>
                <strong>Working directory</strong>
                <p>Onde você cria e altera arquivos.</p>
              </div>
              <i>→</i>
              <div>
                <span>02</span>
                <strong>Staging area</strong>
                <p>O que entrará no próximo registro.</p>
              </div>
              <i>→</i>
              <div>
                <span>03</span>
                <strong>Repository</strong>
                <p>O histórico de checkpoints salvos.</p>
              </div>
            </div>

            <div className="lesson-callout">
              <span>!</span>
              <p>
                <strong>Git e GitHub não são a mesma coisa.</strong> Git
                controla versões no seu computador. GitHub hospeda
                repositórios e adiciona colaboração, Pull Requests, Issues e
                automações.
              </p>
            </div>

            <a className="lesson-cta" href="#laboratorio">
              Praticar no laboratório <span>↓</span>
            </a>
          </article>
          ) : activeModule === "02" ? (
            <CommitLesson />
          ) : activeModule === "03" ? (
            <BranchLesson />
          ) : activeModule === "04" ? (
            <PullRequestLesson />
          ) : activeModule === "05" ? (
            <RemoteLesson />
          ) : (
            <TeamLesson />
          )}
        </div>
      </section>

      <section className="lab-section" id="laboratorio">
        <div className="page-shell">
          <div className="section-intro lab-heading">
            <div>
              <span className="section-number">02 / LABORATÓRIO</span>
              <h2>Seu primeiro repositório</h2>
            </div>
            <p>
              Este terminal é uma simulação segura. Siga a missão e observe
              como cada comando altera o estado do repositório.
            </p>
          </div>

          <div className="lab-layout">
            <aside className="mission-panel">
              <div className="mission-progress-head">
                <div>
                  <span>MISSÃO 01</span>
                  <strong>Criar um histórico</strong>
                </div>
                <span>{lessonProgress}%</span>
              </div>
              <div className="progress-track">
                <span style={{ width: `${lessonProgress}%` }} />
              </div>

              <div className="step-list">
                {missionSteps.map((step, index) => {
                  const done = [
                    terminalState.initialized,
                    terminalState.fileCreated,
                    statusChecked,
                    terminalState.staged,
                    terminalState.committed,
                  ][index];
                  return (
                    <div className={`mission-step ${done ? "done" : ""}`} key={step.key}>
                      <span className="step-check">{done ? "✓" : index + 1}</span>
                      <div>
                        <strong>{step.label}</strong>
                        <code>{step.command}</code>
                      </div>
                      <button
                        onClick={() => copyCommand(step.command)}
                        aria-label={`Copiar comando ${step.command}`}
                      >
                        {copiedCommand === step.command ? "copiado" : "copiar"}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className={`mission-result ${terminalState.committed ? "unlocked" : ""}`}>
                <span>{terminalState.committed ? "✓" : "◇"}</span>
                <div>
                  <strong>
                    {terminalState.committed
                      ? "Missão concluída"
                      : "Checkpoint bloqueado"}
                  </strong>
                  <p>
                    {terminalState.committed
                      ? "Você criou um repositório e registrou seu primeiro estado."
                      : "Complete os cinco passos no terminal."}
                  </p>
                </div>
              </div>
            </aside>

            <div
              className="interactive-terminal"
              onClick={() => terminalInput.current?.focus()}
            >
              <div className="window-bar">
                <div>
                  <span />
                  <span />
                  <span />
                </div>
                <p>quest@lab:~/meu-projeto</p>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    setEntries([]);
                  }}
                >
                  limpar
                </button>
              </div>
              <div className="terminal-body" aria-live="polite">
                {entries.map((entry, index) => (
                  <div className={`terminal-entry ${entry.tone ?? ""}`} key={`${index}-${entry.command}`}>
                    {entry.command && (
                      <p>
                        <span className="prompt">$</span> {entry.command}
                      </p>
                    )}
                    {entry.output.map((line, lineIndex) => (
                      <p className="output" key={`${lineIndex}-${line}`}>
                        {line || " "}
                      </p>
                    ))}
                  </div>
                ))}
                <form className="terminal-form" onSubmit={runCommand}>
                  <label htmlFor="terminal-command">$</label>
                  <input
                    ref={terminalInput}
                    id="terminal-command"
                    value={command}
                    onChange={(event) => setCommand(event.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                    aria-label="Digite um comando Git"
                  />
                </form>
                <div ref={terminalEnd} />
              </div>
              <div className="terminal-footer">
                <span>Simulação local — nenhum arquivo do seu computador será alterado.</span>
                <span>ENTER para executar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="real-project-section page-shell" id="projeto">
        <div className="section-intro">
          <div>
            <span className="section-number">03 / PROJETO REAL</span>
            <h2>O curso também pratica o que ensina</h2>
          </div>
          <p>
            Cada evolução do GitHub Quest passa pelo mesmo fluxo apresentado nas
            aulas. O repositório é o laboratório real do projeto.
          </p>
        </div>

        <div className="project-flow">
          {[
            ["01", "Issue", "Definir uma melhoria pequena"],
            ["02", "Branch", "Isolar o novo trabalho"],
            ["03", "Commits", "Registrar passos compreensíveis"],
            ["04", "Pull Request", "Explicar e revisar a mudança"],
            ["05", "Merge", "Entregar uma nova versão"],
          ].map(([number, title, description], index) => (
            <div className="project-step" key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{description}</p>
              {index < 4 && <i>→</i>}
            </div>
          ))}
        </div>

        <div className="achievements-block">
          <div className="achievements-copy">
            <span className="section-number">TRILHA PARALELA</span>
            <h3>Achievements como consequência</h3>
            <p>
              As medalhas não são liberadas pelo curso. Elas aparecem no seu
              perfil quando o GitHub reconhece ações reais. Vamos realizar
              essas ações enquanto construímos esta plataforma.
            </p>
          </div>
          <div className="achievement-grid">
            {achievements.map((achievement) => (
              <article key={achievement.title}>
                <span>{achievement.icon}</span>
                <div>
                  <strong>{achievement.title}</strong>
                  <p>{achievement.description}</p>
                  <small>{achievement.projectAction}</small>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="next-step">
        <div className="page-shell">
          <span className="overline">
            <span />
            SUA VEZ
          </span>
          <h2>Todo projeto começa com um primeiro estado.</h2>
          <p>Complete a missão do terminal. O próximo módulo começa no commit.</p>
          <button className="primary-button" onClick={() => {
            document.querySelector("#laboratorio")?.scrollIntoView({ behavior: "smooth" });
            window.setTimeout(() => terminalInput.current?.focus(), 600);
          }}>
            Abrir laboratório <span>→</span>
          </button>
        </div>
      </section>

      <footer className="site-footer page-shell">
        <a className="logo" href="#inicio">
          <span className="logo-mark">GQ</span>
          <span>GitHub Quest</span>
        </a>
        <p>Aprenda o processo. Construa algo útil. Compartilhe o caminho.</p>
        <span>Open source · Brasil</span>
      </footer>
    </main>
  );
}
