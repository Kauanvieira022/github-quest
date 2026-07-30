import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("presents GitHub Quest as an interactive Git course", async () => {
  const page = await readFile(new URL("app/page.tsx", root), "utf8");

  assert.match(page, /Git não precisa/);
  assert.match(page, /Seu primeiro repositório/);
  assert.match(page, /git init/);
  assert.match(page, /git commit -m/);
  assert.match(page, /O curso também pratica o que ensina/);
});

test("includes the interactive commit message laboratory", async () => {
  const page = await readFile(new URL("app/page.tsx", root), "utf8");
  const lesson = await readFile(
    new URL("app/components/CommitLesson.tsx", root),
    "utf8",
  );

  assert.match(page, /CommitLesson/);
  assert.match(lesson, /Commit Coach/);
  assert.match(lesson, /git commit -m/);
  assert.match(lesson, /72 caracteres/);
});

test("includes the visual branches laboratory", async () => {
  const page = await readFile(new URL("app/page.tsx", root), "utf8");
  const lesson = await readFile(
    new URL("app/components/BranchLesson.tsx", root),
    "utf8",
  );

  assert.match(page, /BranchLesson/);
  assert.match(lesson, /Branches são caminhos/);
  assert.match(lesson, /git switch -c feat\/menu/);
  assert.match(lesson, /git merge feat\/menu/);
  assert.match(lesson, /Fluxo concluído/);
});

test("includes the interactive Pull Request laboratory", async () => {
  const page = await readFile(new URL("app/page.tsx", root), "utf8");
  const lesson = await readFile(
    new URL("app/components/PullRequestLesson.tsx", root),
    "utf8",
  );

  assert.match(page, /PullRequestLesson/);
  assert.match(lesson, /Uma Pull Request é uma conversa/);
  assert.match(lesson, /gh pr create --draft/);
  assert.match(lesson, /Solicitar alterações/);
  assert.match(lesson, /gh pr merge --squash --delete-branch/);
  assert.match(lesson, /Pull Request integrada/);
});

test("includes the progressive Three.js visual experience", async () => {
  const page = await readFile(new URL("app/page.tsx", root), "utf8");
  const scene = await readFile(
    new URL("app/components/GitGraphScene.tsx", root),
    "utf8",
  );
  const packageJson = JSON.parse(
    await readFile(new URL("package.json", root), "utf8"),
  );

  assert.match(page, /GitGraphScene/);
  assert.match(page, /ssr: false/);
  assert.match(scene, /WebGLRenderer/);
  assert.match(scene, /prefers-reduced-motion/);
  assert.match(scene, /renderer\.dispose/);
  assert.equal(packageJson.dependencies.three, "0.185.1");
});

test("includes the remote repositories laboratory", async () => {
  const page = await readFile(new URL("app/page.tsx", root), "utf8");
  const lesson = await readFile(
    new URL("app/components/RemoteLesson.tsx", root),
    "utf8",
  );
  const scene = await readFile(
    new URL("app/components/RemoteFlowScene.tsx", root),
    "utf8",
  );

  assert.match(page, /RemoteLesson/);
  assert.match(lesson, /Local e GitHub são históricos/);
  assert.match(lesson, /git fetch origin/);
  assert.match(lesson, /git pull --ff-only origin main/);
  assert.match(lesson, /git push -u origin feat\/perfil/);
  assert.match(lesson, /Sincronização concluída/);
  assert.match(scene, /WebGLRenderer/);
  assert.match(scene, /prefers-reduced-motion/);
});

test("includes the collaborative conflict resolution laboratory", async () => {
  const page = await readFile(new URL("app/page.tsx", root), "utf8");
  const lesson = await readFile(
    new URL("app/components/TeamLesson.tsx", root),
    "utf8",
  );
  const scene = await readFile(
    new URL("app/components/TeamFlowScene.tsx", root),
    "utf8",
  );

  assert.match(page, /TeamLesson/);
  assert.match(lesson, /Conflitos são decisões compartilhadas/);
  assert.match(lesson, /git merge origin\/main/);
  assert.match(lesson, /Co-authored-by:/);
  assert.match(lesson, /Colaboração pronta para revisão/);
  assert.match(scene, /WebGLRenderer/);
  assert.match(scene, /prefers-reduced-motion/);
  assert.match(scene, /renderer\.dispose/);
});

test("includes the GitHub Actions automation laboratory", async () => {
  const page = await readFile(new URL("app/page.tsx", root), "utf8");
  const lesson = await readFile(
    new URL("app/components/AutomationLesson.tsx", root),
    "utf8",
  );
  const scene = await readFile(
    new URL("app/components/PipelineScene.tsx", root),
    "utf8",
  );
  const workflow = await readFile(
    new URL(".github/workflows/qualidade.yml", root),
    "utf8",
  );

  assert.match(page, /AutomationLesson/);
  assert.match(lesson, /Automação transforma acordos/);
  assert.match(lesson, /actions\/checkout@v7/);
  assert.match(lesson, /Pipeline aprovado/);
  assert.match(scene, /WebGLRenderer/);
  assert.match(scene, /prefers-reduced-motion/);
  assert.match(scene, /renderer\.dispose/);
  assert.match(workflow, /actions\/checkout@v7/);
  assert.match(workflow, /actions\/setup-node@v7/);
  assert.match(workflow, /npm run lint/);
  assert.match(workflow, /npm run test/);
  assert.match(workflow, /npm run build/);
});

test("includes the open source contribution laboratory", async () => {
  const page = await readFile(new URL("app/page.tsx", root), "utf8");
  const lesson = await readFile(
    new URL("app/components/OpenSourceLesson.tsx", root),
    "utf8",
  );
  const scene = await readFile(
    new URL("app/components/CommunityScene.tsx", root),
    "utf8",
  );

  assert.match(page, /OpenSourceLesson/);
  assert.match(lesson, /Open source é colaboração/);
  assert.match(lesson, /gh repo fork/);
  assert.match(lesson, /Achievements são consequência/);
  assert.match(lesson, /Trilha inicial concluída/);
  assert.match(scene, /WebGLRenderer/);
  assert.match(scene, /prefers-reduced-motion/);
  assert.match(scene, /renderer\.dispose/);
});

test("includes community health and contribution templates", async () => {
  const paths = [
    "CONTRIBUTING.md",
    "CODE_OF_CONDUCT.md",
    "SECURITY.md",
    ".github/pull_request_template.md",
    ".github/ISSUE_TEMPLATE/bug.yml",
    ".github/ISSUE_TEMPLATE/melhoria.yml",
    ".github/ISSUE_TEMPLATE/config.yml",
  ];

  const files = await Promise.all(
    paths.map((path) => readFile(new URL(path, root), "utf8")),
  );

  assert.match(files[0], /npm run lint/);
  assert.match(files[1], /Comportamentos esperados/);
  assert.match(files[2], /Report a vulnerability/);
  assert.match(files[3], /## Checklist/);
  assert.match(files[4], /name: Relatar um problema/);
  assert.match(files[5], /name: Propor uma melhoria/);
  assert.match(files[6], /blank_issues_enabled: false/);
});

test("uses the standard Next.js toolchain", async () => {
  const packageJson = JSON.parse(
    await readFile(new URL("package.json", root), "utf8"),
  );

  assert.equal(packageJson.scripts.dev, "next dev");
  assert.equal(packageJson.scripts.build, "next build");
  assert.equal(packageJson.scripts.start, "next start");
  assert.equal(packageJson.dependencies.next, "16.2.12");
});
