"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const commitPositions = [
  [-3.2, 0, 0],
  [-2.1, 0, 0],
  [-1, 0, 0],
  [0.1, 0, 0],
  [1.2, 0, 0],
  [2.3, 0, 0],
  [3.4, 0, 0],
] as const;

function createPath(
  points: THREE.Vector3[],
  color: number,
  geometries: THREE.BufferGeometry[],
  materials: THREE.Material[],
) {
  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, 64, 0.027, 5, false);
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.72,
  });
  geometries.push(geometry);
  materials.push(material);
  return new THREE.Mesh(geometry, material);
}

export function GitGraphScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: window.devicePixelRatio <= 1.5,
        powerPreference: "high-performance",
      });
    } catch {
      host.classList.add("fallback");
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.domElement.className = "git-graph-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.35, 9.8);

    const graph = new THREE.Group();
    graph.rotation.set(-0.12, -0.24, -0.04);
    scene.add(graph);

    const mainPath = createPath(
      commitPositions.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
      0xc8f13a,
      geometries,
      materials,
    );
    graph.add(mainPath);

    const upperPath = createPath(
      [
        new THREE.Vector3(-2.1, 0, 0),
        new THREE.Vector3(-1.45, 0.75, -0.12),
        new THREE.Vector3(-0.35, 1.12, -0.18),
        new THREE.Vector3(0.55, 0.68, -0.08),
        new THREE.Vector3(1.2, 0, 0),
      ],
      0x8f7cff,
      geometries,
      materials,
    );
    graph.add(upperPath);

    const lowerPath = createPath(
      [
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(-0.25, -0.72, 0.08),
        new THREE.Vector3(0.8, -1.02, 0.18),
        new THREE.Vector3(1.68, -0.62, 0.1),
        new THREE.Vector3(2.3, 0, 0),
      ],
      0xff7548,
      geometries,
      materials,
    );
    graph.add(lowerPath);

    const sphereGeometry = new THREE.IcosahedronGeometry(0.14, 2);
    const coreGeometry = new THREE.IcosahedronGeometry(0.062, 1);
    geometries.push(sphereGeometry, coreGeometry);

    const limeMaterial = new THREE.MeshStandardMaterial({
      color: 0xc8f13a,
      emissive: 0x607400,
      emissiveIntensity: 0.75,
      roughness: 0.28,
      metalness: 0.14,
    });
    const violetMaterial = new THREE.MeshStandardMaterial({
      color: 0x8f7cff,
      emissive: 0x34286f,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.12,
    });
    const orangeMaterial = new THREE.MeshStandardMaterial({
      color: 0xff7548,
      emissive: 0x7d2512,
      emissiveIntensity: 0.7,
      roughness: 0.32,
      metalness: 0.1,
    });
    const coreMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    materials.push(
      limeMaterial,
      violetMaterial,
      orangeMaterial,
      coreMaterial,
    );

    const nodes: THREE.Mesh[] = [];

    function addNode(
      position: THREE.Vector3,
      material: THREE.MeshStandardMaterial,
      scale = 1,
    ) {
      const node = new THREE.Mesh(sphereGeometry, material);
      node.position.copy(position);
      node.scale.setScalar(scale);
      graph.add(node);
      nodes.push(node);

      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      core.position.copy(position);
      core.scale.setScalar(scale);
      graph.add(core);
    }

    commitPositions.forEach(([x, y, z], index) => {
      addNode(new THREE.Vector3(x, y, z), limeMaterial, index === 4 ? 1.35 : 1);
    });

    [
      new THREE.Vector3(-1.45, 0.75, -0.12),
      new THREE.Vector3(-0.35, 1.12, -0.18),
      new THREE.Vector3(0.55, 0.68, -0.08),
    ].forEach((position) => addNode(position, violetMaterial));

    [
      new THREE.Vector3(-0.25, -0.72, 0.08),
      new THREE.Vector3(0.8, -1.02, 0.18),
      new THREE.Vector3(1.68, -0.62, 0.1),
    ].forEach((position) => addNode(position, orangeMaterial));

    const ringGeometry = new THREE.TorusGeometry(0.32, 0.018, 8, 48);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xc8f13a,
      transparent: true,
      opacity: 0.38,
    });
    geometries.push(ringGeometry);
    materials.push(ringMaterial);

    const headRing = new THREE.Mesh(ringGeometry, ringMaterial);
    headRing.position.set(1.2, 0, 0);
    graph.add(headRing);

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 110;
    const particlePositions = new Float32Array(particleCount * 3);

    for (let index = 0; index < particleCount; index += 1) {
      const offset = index * 3;
      particlePositions[offset] = (Math.random() - 0.5) * 11;
      particlePositions[offset + 1] = (Math.random() - 0.5) * 6.5;
      particlePositions[offset + 2] = (Math.random() - 0.5) * 5 - 1.2;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3),
    );
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xaeb8c7,
      size: 0.025,
      transparent: true,
      opacity: 0.48,
      sizeAttenuation: true,
    });
    geometries.push(particleGeometry);
    materials.push(particleMaterial);

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    scene.add(new THREE.AmbientLight(0xaab3c2, 1.2));

    const keyLight = new THREE.PointLight(0xc8f13a, 12, 7);
    keyLight.position.set(1.3, 1.8, 3);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x8f7cff, 8, 8);
    fillLight.position.set(-2.5, -1, 2.5);
    scene.add(fillLight);

    const pointer = new THREE.Vector2();
    const targetRotation = new THREE.Vector2(-0.12, -0.24);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let visible = true;

    function resize() {
      const currentHost = hostRef.current;
      if (!currentHost) return;
      const { width, height } = currentHost.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    }

    function handlePointer(event: PointerEvent) {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
      targetRotation.y = -0.24 + pointer.x * 0.13;
      targetRotation.x = -0.12 + pointer.y * 0.08;
    }

    function render(time = 0) {
      graph.rotation.x += (targetRotation.x - graph.rotation.x) * 0.035;
      graph.rotation.y += (targetRotation.y - graph.rotation.y) * 0.035;
      graph.position.y = Math.sin(time * 0.00045) * 0.08;
      particles.rotation.y = time * 0.000018;
      headRing.rotation.z = time * 0.00035;

      nodes.forEach((node, index) => {
        const pulse = 1 + Math.sin(time * 0.0018 + index * 0.7) * 0.045;
        const baseScale = index === 4 ? 1.35 : 1;
        node.scale.setScalar(baseScale * pulse);
      });

      renderer.render(scene, camera);
    }

    function syncAnimation() {
      const shouldAnimate = visible && !reducedMotion.matches;
      renderer.setAnimationLoop(shouldAnimate ? render : null);
      if (!shouldAnimate) render();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncAnimation();
    });
    intersectionObserver.observe(host);

    window.addEventListener("pointermove", handlePointer, { passive: true });
    reducedMotion.addEventListener("change", syncAnimation);
    resize();
    syncAnimation();

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("pointermove", handlePointer);
      reducedMotion.removeEventListener("change", syncAnimation);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="git-graph-scene" ref={hostRef}>
      <div className="git-graph-fallback">
        <span />
        <span />
        <span />
        <i />
        <i />
      </div>
    </div>
  );
}
