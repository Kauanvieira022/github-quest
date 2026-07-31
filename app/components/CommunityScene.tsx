"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type CommunitySceneProps = {
  step: number;
  total: number;
};

export function CommunityScene({ step, total }: CommunitySceneProps) {
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
    renderer.domElement.className = "community-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
    camera.position.set(0, 0.25, 8.6);

    const group = new THREE.Group();
    group.rotation.x = -0.08;
    scene.add(group);

    const projectGeometry = new THREE.DodecahedronGeometry(0.7, 1);
    const personGeometry = new THREE.IcosahedronGeometry(0.22, 1);
    const packetGeometry = new THREE.SphereGeometry(0.045, 10, 10);
    const ringGeometry = new THREE.TorusGeometry(0.92, 0.02, 8, 64);
    geometries.push(
      projectGeometry,
      personGeometry,
      packetGeometry,
      ringGeometry,
    );

    const projectMaterial = new THREE.MeshStandardMaterial({
      color: 0x8f7cff,
      emissive: 0x3a2c78,
      emissiveIntensity: 1,
      roughness: 0.24,
      metalness: 0.18,
    });
    const contributorMaterial = new THREE.MeshStandardMaterial({
      color: 0x6b7787,
      emissive: 0x242d38,
      emissiveIntensity: 0.55,
      roughness: 0.32,
      metalness: 0.16,
    });
    const activeContributorMaterial = new THREE.MeshStandardMaterial({
      color: 0x63b7ff,
      emissive: 0x16466d,
      emissiveIntensity: 0.9,
      roughness: 0.26,
      metalness: 0.14,
    });
    const packetMaterial = new THREE.MeshBasicMaterial({ color: 0xc8f13a });
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x8f7cff,
      transparent: true,
      opacity: 0.42,
    });
    materials.push(
      projectMaterial,
      contributorMaterial,
      activeContributorMaterial,
      packetMaterial,
      ringMaterial,
    );

    const project = new THREE.Mesh(projectGeometry, projectMaterial);
    group.add(project);

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    group.add(ring);

    const contributorPositions = [
      new THREE.Vector3(-3, 0.7, 0),
      new THREE.Vector3(-2.15, -1.15, 0),
      new THREE.Vector3(0, -1.75, 0),
      new THREE.Vector3(2.15, -1.15, 0),
      new THREE.Vector3(3, 0.7, 0),
      new THREE.Vector3(0, 1.85, 0),
    ];

    const contributors = contributorPositions.map((position) => {
      const contributor = new THREE.Mesh(
        personGeometry,
        contributorMaterial,
      );
      contributor.position.copy(position);
      group.add(contributor);
      return contributor;
    });

    const lineMaterials = contributorPositions.map((position) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        position.clone().multiplyScalar(0.88),
        new THREE.Vector3(),
      ]);
      const material = new THREE.LineBasicMaterial({
        color: 0x52606f,
        transparent: true,
        opacity: 0.3,
      });
      geometries.push(geometry);
      materials.push(material);
      group.add(new THREE.Line(geometry, material));
      return material;
    });

    const packets = contributorPositions.map(() => {
      const packet = new THREE.Mesh(packetGeometry, packetMaterial);
      packet.visible = false;
      group.add(packet);
      return packet;
    });

    scene.add(new THREE.AmbientLight(0xb8c2cf, 1.15));

    const violetLight = new THREE.PointLight(0x8f7cff, 9, 7);
    violetLight.position.set(-1.5, 1.7, 2.4);
    scene.add(violetLight);

    const limeLight = new THREE.PointLight(0xc8f13a, 8, 7);
    limeLight.position.set(2, 1.2, 2.2);
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
      const activeIndex = completed
        ? contributors.length - 1
        : Math.min(activeStep, contributors.length - 1);

      group.rotation.y = Math.sin(time * 0.00022) * 0.08;
      project.rotation.x = time * 0.00018;
      project.rotation.y = time * 0.00034;
      ring.rotation.z = -time * 0.00028;

      projectMaterial.color.setHex(completed ? 0xc8f13a : 0x8f7cff);
      projectMaterial.emissive.setHex(completed ? 0x5a6b00 : 0x3a2c78);
      ringMaterial.color.setHex(completed ? 0xc8f13a : 0x8f7cff);
      ringMaterial.opacity = completed ? 0.65 : 0.42;

      contributors.forEach((contributor, index) => {
        contributor.rotation.x = time * (0.0002 + index * 0.00001);
        contributor.rotation.y =
          time * (index % 2 === 0 ? 0.00035 : -0.00035);
        contributor.material =
          index <= activeIndex || completed
            ? activeContributorMaterial
            : contributorMaterial;
        contributor.scale.setScalar(index === activeIndex && !completed ? 1.3 : 1);
        lineMaterials[index].color.setHex(
          index < activeStep || completed ? 0xc8f13a : 0x52606f,
        );
        lineMaterials[index].opacity =
          index < activeStep || completed ? 0.62 : 0.3;
      });

      packets.forEach((packet, index) => {
        packet.visible =
          index === activeIndex &&
          activeStep > 0 &&
          !completed &&
          !reducedMotion.matches;
        if (!packet.visible) return;
        const progress = (time * 0.00038) % 1;
        packet.position.lerpVectors(
          contributorPositions[index],
          new THREE.Vector3(),
          progress,
        );
        packet.position.z = Math.sin(progress * Math.PI) * 0.25;
        packet.scale.setScalar(0.7 + Math.sin(progress * Math.PI) * 0.7);
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
    <div className="community-scene" ref={hostRef}>
      <div className="community-fallback">
        <span>COMUNIDADE</span>
        <i />
        <span>PROJETO</span>
        <i />
        <span>CONTRIBUIÇÃO</span>
      </div>
    </div>
  );
}
