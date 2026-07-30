"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type PipelineSceneProps = {
  step: number;
  total: number;
};

export function PipelineScene({ step, total }: PipelineSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef(step);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

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
    renderer.domElement.className = "pipeline-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
    camera.position.set(0, 0.4, 8.8);

    const group = new THREE.Group();
    group.rotation.x = -0.12;
    scene.add(group);

    const nodeGeometry = new THREE.IcosahedronGeometry(0.33, 2);
    const activeGeometry = new THREE.OctahedronGeometry(0.48, 2);
    const packetGeometry = new THREE.SphereGeometry(0.05, 10, 10);
    const ringGeometry = new THREE.TorusGeometry(0.62, 0.018, 8, 54);
    geometries.push(
      nodeGeometry,
      activeGeometry,
      packetGeometry,
      ringGeometry,
    );

    const idleMaterial = new THREE.MeshStandardMaterial({
      color: 0x5d6876,
      emissive: 0x202832,
      emissiveIntensity: 0.55,
      roughness: 0.34,
      metalness: 0.18,
    });
    const passedMaterial = new THREE.MeshStandardMaterial({
      color: 0xc8f13a,
      emissive: 0x586900,
      emissiveIntensity: 0.9,
      roughness: 0.24,
      metalness: 0.14,
    });
    const currentMaterial = new THREE.MeshStandardMaterial({
      color: 0x8f7cff,
      emissive: 0x3d307d,
      emissiveIntensity: 1.15,
      roughness: 0.22,
      metalness: 0.18,
    });
    const packetMaterial = new THREE.MeshBasicMaterial({ color: 0x8f7cff });
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x8f7cff,
      transparent: true,
      opacity: 0.55,
    });
    materials.push(
      idleMaterial,
      passedMaterial,
      currentMaterial,
      packetMaterial,
      ringMaterial,
    );

    const positions = [
      new THREE.Vector3(-3, 0.15, 0),
      new THREE.Vector3(-1.8, 0.75, 0),
      new THREE.Vector3(-0.6, 0.15, 0),
      new THREE.Vector3(0.6, 0.75, 0),
      new THREE.Vector3(1.8, 0.15, 0),
      new THREE.Vector3(3, 0.75, 0),
    ];

    const nodes = positions.map((position, index) => {
      const node = new THREE.Mesh(
        index === 0 ? activeGeometry : nodeGeometry,
        idleMaterial,
      );
      node.position.copy(position);
      group.add(node);
      return node;
    });

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(positions);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x5d6876,
      transparent: true,
      opacity: 0.48,
    });
    geometries.push(lineGeometry);
    materials.push(lineMaterial);
    group.add(new THREE.Line(lineGeometry, lineMaterial));

    const activeRing = new THREE.Mesh(ringGeometry, ringMaterial);
    group.add(activeRing);

    const packets = Array.from({ length: 7 }, () => {
      const packet = new THREE.Mesh(packetGeometry, packetMaterial);
      packet.visible = false;
      group.add(packet);
      return packet;
    });

    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(90);
    for (let index = 0; index < starPositions.length; index += 3) {
      starPositions[index] = (Math.random() - 0.5) * 8;
      starPositions[index + 1] = (Math.random() - 0.5) * 3.5;
      starPositions[index + 2] = (Math.random() - 0.5) * 2 - 1;
    }
    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3),
    );
    const starsMaterial = new THREE.PointsMaterial({
      color: 0x9aa6b3,
      size: 0.025,
      transparent: true,
      opacity: 0.55,
    });
    geometries.push(starsGeometry);
    materials.push(starsMaterial);
    group.add(new THREE.Points(starsGeometry, starsMaterial));

    scene.add(new THREE.AmbientLight(0xb7c0cc, 1.1));

    const violetLight = new THREE.PointLight(0x8f7cff, 9, 7);
    violetLight.position.set(-1.3, 1.8, 2.4);
    scene.add(violetLight);

    const limeLight = new THREE.PointLight(0xc8f13a, 7, 7);
    limeLight.position.set(2.2, 1.3, 2.1);
    scene.add(limeLight);

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

    function render(time = 0) {
      const activeStep = stepRef.current;
      const completed = activeStep >= total;
      const currentIndex = completed
        ? positions.length - 1
        : Math.min(activeStep, positions.length - 1);

      group.rotation.y = Math.sin(time * 0.00023) * 0.07;
      nodes.forEach((node, index) => {
        node.rotation.x = time * (0.0002 + index * 0.000015);
        node.rotation.y = time * (index % 2 === 0 ? 0.00032 : -0.00032);
        node.material =
          index < activeStep || completed
            ? passedMaterial
            : index === currentIndex
              ? currentMaterial
              : idleMaterial;
        node.scale.setScalar(index === currentIndex && !completed ? 1.18 : 1);
      });

      activeRing.visible = !completed;
      activeRing.position.copy(positions[currentIndex]);
      activeRing.rotation.z = time * 0.00035;
      lineMaterial.color.setHex(completed ? 0xc8f13a : 0x657181);
      lineMaterial.opacity = activeStep > 0 ? 0.78 : 0.38;

      const segment = Math.max(0, Math.min(activeStep, positions.length - 1));
      packets.forEach((packet, index) => {
        packet.visible =
          activeStep > 0 && !completed && !reducedMotion.matches;
        if (!packet.visible) return;
        const progress = (time * 0.00042 + index / packets.length) % 1;
        packet.position.lerpVectors(
          positions[Math.max(0, segment - 1)],
          positions[segment],
          progress,
        );
        packet.position.y += Math.sin(progress * Math.PI) * 0.12;
        packet.scale.setScalar(0.6 + Math.sin(progress * Math.PI) * 0.65);
      });

      starsMaterial.opacity = 0.4 + Math.sin(time * 0.0005) * 0.15;
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

    reducedMotion.addEventListener("change", syncAnimation);
    resize();
    syncAnimation();

    return () => {
      renderer.setAnimationLoop(null);
      reducedMotion.removeEventListener("change", syncAnimation);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [total]);

  return (
    <div className="pipeline-scene" ref={hostRef}>
      <div className="pipeline-fallback">
        <span>EVENTO</span>
        <i />
        <span>JOB</span>
        <i />
        <span>RESULTADO</span>
      </div>
    </div>
  );
}
