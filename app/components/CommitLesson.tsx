"use client";

import { useMemo, useState } from "react";

const types = [
  ["feat", "nova funcionalidade"],
  ["fix", "correção de comportamento"],
  ["docs", "documentação"],
  ["test", "testes"],
  ["refactor", "mudança interna"],
] as const;

const examples = [
  {
    message: "feat: add lesson progress",
    good: true,
    reason: "Explica o tipo e a mudança de forma objetiva.",
  },
  {
    message: "update files",
    good: false,
    reason: "Não diz quais arquivos nem qual foi a intenção.",
  },
  {
    message: "fix: prevent empty commits",
    good: true,
    reason: "Descreve o problema evitado.",
  },
] as const;

export function CommitLesson() {
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const checks = useMemo(() => {
    const trimmed = message.trim();
    const subject = trimmed.split(": ").slice(1).join(": ");

    return [
      {
        label: "Começa com um tipo conhecido",
        passed:
          /^(feat|fix|docs|test|refactor|chore|style|perf|build|ci)(\([a-z0-9-]+\))?: /.test(
            trimmed,
          ),
      },
      {
        label: "Descreve uma ação específica",
        passed: subject.split(/\s+/).filter(Boolean).length >= 3,
      },
      {
        label: "Tem no máximo 72 caracteres",
        passed: trimmed.length >= 10 && trimmed.length <= 72,
      },
      {
        label: "Não termina com ponto final",
        passed: trimmed.length > 0 && !trimmed.endsWith("."),
      },
    ];
  }, [message]);

  const passedChecks = checks.filter((check) => check.passed).length;
  const ready = passedChecks === checks.length;
  const safeMessage = message.trim().replaceAll('"', '\\"');
  const command = safeMessage
    ? `git commit -m "${safeMessage}"`
    : 'git commit -m "feat: describe your change"';

  async function copyCommand() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1300);
  }

  return (
    <article className="current-lesson commit-lesson">
      <div className="lesson-topline">
        <span>COMMITS · AULA 1 DE 5</span>
        <span className="available-pill">INTERATIVA</span>
      </div>

      <h3>Um commit deve contar uma pequena história</h3>
      <p className="lesson-lede">
        Uma boa mensagem permite entender a intenção da mudança sem abrir o
        código. Ela deve ser específica, curta e coerente com o conteúdo
        registrado.
      </p>

      <div className="commit-anatomy" aria-label="Anatomia de uma mensagem de commit">
        <span className="commit-type">feat</span>
        <span className="commit-punctuation">:</span>
        <span className="commit-subject">add lesson progress</span>
        <div className="anatomy-label type-label">
          <strong>tipo</strong>
          <span>qual categoria mudou?</span>
        </div>
        <div className="anatomy-label subject-label">
          <strong>descrição</strong>
          <span>o que foi entregue?</span>
        </div>
      </div>

      <div className="commit-types">
        {types.map(([type, description]) => (
          <span key={type}>
            <code>{type}</code>
            {description}
          </span>
        ))}
      </div>

      <div className="commit-coach">
        <div className="coach-heading">
          <div>
            <span>PRÁTICA GUIADA</span>
            <strong>Commit Coach</strong>
          </div>
          <span className={`coach-score ${ready ? "ready" : ""}`}>
            {passedChecks}/{checks.length}
          </span>
        </div>

        <label htmlFor="commit-message">Escreva uma mensagem de commit</label>
        <input
          id="commit-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="feat: add lesson progress"
          maxLength={90}
          autoComplete="off"
          spellCheck={false}
        />

        <div className="coach-checks">
          {checks.map((check) => (
            <span className={check.passed ? "passed" : ""} key={check.label}>
              <i>{check.passed ? "✓" : "·"}</i>
              {check.label}
            </span>
          ))}
        </div>

        <div className={`generated-command ${ready ? "ready" : ""}`}>
          <div>
            <span>$</span>
            <code>{command}</code>
          </div>
          <button onClick={copyCommand} disabled={!message.trim()}>
            {copied ? "copiado" : "copiar comando"}
          </button>
        </div>

        <p className="coach-feedback" aria-live="polite">
          {ready
            ? "Mensagem pronta: curta, específica e fácil de encontrar no histórico."
            : "Atenda aos quatro critérios para concluir esta prática."}
        </p>
      </div>

      <div className="commit-examples">
        {examples.map((example) => (
          <div className={example.good ? "good" : "bad"} key={example.message}>
            <span>{example.good ? "BOM" : "EVITE"}</span>
            <code>{example.message}</code>
            <p>{example.reason}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
