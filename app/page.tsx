"use client";

import { useEffect, useMemo, useState } from "react";

type Mission = {
  id: string;
  icon: string;
  name: string;
  description: string;
  objective: string;
  difficulty: "Iniciante" | "Colaboração" | "Comunidade";
  tone: string;
};

const missions: Mission[] = [
  {
    id: "pull-shark",
    icon: "🦈",
    name: "Pull Shark",
    description: "Abra Pull Requests úteis e leve suas mudanças até a branch principal.",
    objective: "2 PRs mesclados",
    difficulty: "Iniciante",
    tone: "cyan",
  },
  {
    id: "quickdraw",
    icon: "⚡",
    name: "Quickdraw",
    description: "Pratique o ciclo de uma issue com uma decisão rápida e bem documentada.",
    objective: "Fechar em até 5 min",
    difficulty: "Iniciante",
    tone: "yellow",
  },
  {
    id: "yolo",
    icon: "🎯",
    name: "YOLO",
    description: "Mescle uma alteração pequena e segura sem uma aprovação de review.",
    objective: "1 PR sem review",
    difficulty: "Iniciante",
    tone: "pink",
  },
  {
    id: "pair-extraordinaire",
    icon: "🤝",
    name: "Pair Extraordinaire",
    description: "Construa uma mudança em dupla e registre a coautoria no commit.",
    objective: "1 commit coautorado",
    difficulty: "Colaboração",
    tone: "purple",
  },
  {
    id: "galaxy-brain",
    icon: "🧠",
    name: "Galaxy Brain",
    description: "Ajude pessoas em Discussions com respostas claras que sejam aceitas.",
    objective: "2 respostas aceitas",
    difficulty: "Comunidade",
    tone: "blue",
  },
  {
    id: "starstruck",
    icon: "⭐",
    name: "Starstruck",
    description: "Crie algo que a comunidade considere útil e queira acompanhar.",
    objective: "16 estrelas",
    difficulty: "Comunidade",
    tone: "orange",
  },
  {
    id: "public-sponsor",
    icon: "💖",
    name: "Public Sponsor",
    description: "Apoie publicamente o trabalho de uma pessoa ou projeto open source.",
    objective: "1 patrocínio público",
    difficulty: "Comunidade",
    tone: "rose",
  },
];

const filters = ["Todos", "Iniciante", "Colaboração", "Comunidade"] as const;

export default function Home() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]>("Todos");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("github-quest-progress");
    if (saved) {
      try {
        setCompleted(JSON.parse(saved));
      } catch {
        setCompleted([]);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(
        "github-quest-progress",
        JSON.stringify(completed),
      );
    }
  }, [completed, hydrated]);

  const visibleMissions = useMemo(
    () =>
      activeFilter === "Todos"
        ? missions
        : missions.filter((mission) => mission.difficulty === activeFilter),
    [activeFilter],
  );

  const progress = Math.round((completed.length / missions.length) * 100);

  function toggleMission(id: string) {
    setCompleted((current) =>
      current.includes(id)
        ? current.filter((missionId) => missionId !== id)
        : [...current, id],
    );
  }

  function scrollToMissions() {
    document.querySelector("#missoes")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <nav className="nav shell" aria-label="Navegação principal">
        <a className="brand" href="#inicio" aria-label="GitHub Quest — início">
          <span className="brand-mark" aria-hidden="true">
            GQ
          </span>
          <span>GitHub Quest</span>
          <span className="beta">beta</span>
        </a>
        <div className="nav-links">
          <a href="#missoes">Missões</a>
          <a href="#roteiro">Roteiro</a>
          <a
            href="https://docs.github.com/pt/account-and-profile/reference/profile-reference#earning-achievements"
            target="_blank"
            rel="noreferrer"
          >
            Guia oficial ↗
          </a>
        </div>
        <div className="progress-chip" aria-label={`${completed.length} de 7 missões concluídas`}>
          <span>{completed.length}/7</span>
          <span className="progress-chip-label">concluídas</span>
        </div>
      </nav>

      <section className="hero shell" id="inicio">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            Seu mapa para dominar o GitHub
          </div>
          <h1>
            Aprenda Git.
            <br />
            <span>Desbloqueie o caminho.</span>
          </h1>
          <p className="hero-lede">
            Sete missões práticas para transformar ações reais no GitHub em
            colaboração, repertório open source e achievements no seu perfil.
          </p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={scrollToMissions}>
              Começar pela Pull Shark
              <span aria-hidden="true">→</span>
            </button>
            <a className="button button-secondary" href="#roteiro">
              Ver o roteiro
            </a>
          </div>
          <div className="hero-note">
            <span aria-hidden="true">✓</span>
            Gratuito, open source e feito para aprender fazendo.
          </div>
        </div>

        <div className="quest-card-wrap" aria-label="Painel de progresso">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="quest-card">
            <div className="quest-card-top">
              <div>
                <span className="micro-label">NÍVEL ATUAL</span>
                <strong>Explorer 01</strong>
              </div>
              <span className="online-pill">
                <span />
                EM JORNADA
              </span>
            </div>

            <div className="big-progress">
              <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}>
                <div>
                  <strong>{progress}%</strong>
                  <span>completo</span>
                </div>
              </div>
              <div className="progress-copy">
                <span className="micro-label">PRÓXIMA CONQUISTA</span>
                <strong>Pull Shark</strong>
                <span>Abra sua primeira branch e envie uma mudança.</span>
              </div>
            </div>

            <div className="route-box">
              <div className="route-head">
                <span>ROTA RECOMENDADA</span>
                <strong>01 / 03</strong>
              </div>
              <div className="route-steps">
                <span className="route-step active">Branch</span>
                <span className="route-line" />
                <span className="route-step">Commit</span>
                <span className="route-line" />
                <span className="route-step">Pull Request</span>
              </div>
            </div>

            <div className="card-footer">
              <div className="avatar-stack" aria-hidden="true">
                <span>G</span>
                <span>Q</span>
                <span>+</span>
              </div>
              <span>Uma missão fica melhor quando é compartilhada.</span>
            </div>
          </div>
          <div className="float-badge float-star">
            <span>⭐</span>
            <div>
              <small>RARIDADE</small>
              <strong>Starstruck</strong>
            </div>
          </div>
          <div className="float-badge float-streak">
            <span>↗</span>
            <div>
              <small>SEQUÊNCIA</small>
              <strong>+1 missão</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="shell trust-inner">
          <span>PROGRESSO REAL, NÃO ATALHOS</span>
          <div>
            <strong>7</strong>
            <span>missões guiadas</span>
          </div>
          <div>
            <strong>3</strong>
            <span>níveis de jornada</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>prática no GitHub</span>
          </div>
          <p>Projeto independente, sem afiliação oficial com o GitHub.</p>
        </div>
      </section>

      <section className="missions-section shell" id="missoes">
        <div className="section-heading">
          <div>
            <span className="section-kicker">SELECIONE SUA PRÓXIMA MISSÃO</span>
            <h2>Seu quadro de conquistas</h2>
          </div>
          <p>
            Marque cada missão quando concluir. Seu progresso fica salvo neste
            dispositivo.
          </p>
        </div>

        <div className="filters" role="group" aria-label="Filtrar missões">
          {filters.map((filter) => (
            <button
              key={filter}
              className={activeFilter === filter ? "active" : ""}
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mission-grid">
          {visibleMissions.map((mission, index) => {
            const isComplete = completed.includes(mission.id);
            return (
              <article
                className={`mission-card ${mission.tone} ${isComplete ? "complete" : ""}`}
                key={mission.id}
              >
                <div className="mission-top">
                  <span className="mission-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <button
                    className="check-button"
                    onClick={() => toggleMission(mission.id)}
                    aria-label={
                      isComplete
                        ? `Marcar ${mission.name} como pendente`
                        : `Marcar ${mission.name} como concluída`
                    }
                    aria-pressed={isComplete}
                  >
                    {isComplete ? "✓" : ""}
                  </button>
                </div>
                <div className="mission-icon" aria-hidden="true">
                  {mission.icon}
                </div>
                <span className="difficulty">{mission.difficulty}</span>
                <h3>{mission.name}</h3>
                <p>{mission.description}</p>
                <div className="mission-objective">
                  <span>OBJETIVO</span>
                  <strong>{mission.objective}</strong>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="roadmap-section" id="roteiro">
        <div className="shell">
          <div className="section-heading roadmap-heading">
            <div>
              <span className="section-kicker">COMECE PEQUENO. EVOLUA SEM PRESSA.</span>
              <h2>Uma jornada em três atos</h2>
            </div>
            <p>
              O objetivo não é colecionar ícones: é aprender um fluxo de
              colaboração que você vai usar em projetos reais.
            </p>
          </div>

          <div className="roadmap">
            <article>
              <span className="roadmap-index">01</span>
              <div className="roadmap-icon">⌁</div>
              <span className="roadmap-label">EXPLORAR</span>
              <h3>Domine o fluxo</h3>
              <p>Branches, commits claros, issues e os seus primeiros Pull Requests.</p>
              <span className="roadmap-meta">Pull Shark · Quickdraw · YOLO</span>
            </article>
            <article>
              <span className="roadmap-index">02</span>
              <div className="roadmap-icon">∞</div>
              <span className="roadmap-label">COLABORAR</span>
              <h3>Construa em conjunto</h3>
              <p>Coautoria, revisão de código e decisões compartilhadas com contexto.</p>
              <span className="roadmap-meta">Pair Extraordinaire</span>
            </article>
            <article>
              <span className="roadmap-index">03</span>
              <div className="roadmap-icon">✦</div>
              <span className="roadmap-label">CONTRIBUIR</span>
              <h3>Gere valor público</h3>
              <p>Ajude a comunidade, publique algo útil e apoie quem mantém o open source.</p>
              <span className="roadmap-meta">Galaxy Brain · Starstruck · Sponsor</span>
            </article>
          </div>

          <div className="closing-card">
            <div>
              <span className="section-kicker">PRIMEIRO CHECKPOINT</span>
              <h2>Pronto para abrir sua primeira branch?</h2>
              <p>
                Comece pela Pull Shark: uma mudança pequena, um Pull Request bem
                explicado e um aprendizado que fica.
              </p>
            </div>
            <button className="button button-primary" onClick={scrollToMissions}>
              Escolher primeira missão <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>

      <footer className="footer shell">
        <a className="brand" href="#inicio">
          <span className="brand-mark">GQ</span>
          <span>GitHub Quest</span>
        </a>
        <p>Aprenda o processo. Construa algo útil. As conquistas vêm depois.</p>
        <span>Feito no Brasil · 2026</span>
      </footer>
    </main>
  );
}
