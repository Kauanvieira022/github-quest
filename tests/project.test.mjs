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

test("uses the standard Next.js toolchain", async () => {
  const packageJson = JSON.parse(
    await readFile(new URL("package.json", root), "utf8"),
  );

  assert.equal(packageJson.scripts.dev, "next dev");
  assert.equal(packageJson.scripts.build, "next build");
  assert.equal(packageJson.scripts.start, "next start");
  assert.equal(packageJson.dependencies.next, "16.2.12");
});
