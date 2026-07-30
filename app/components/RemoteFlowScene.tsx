"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type RemoteFlowSceneProps = {
  step: number;
};

export function RemoteFlowScene({ step }: RemoteFlowSceneProps) {
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
    renderer.domElement.className = "remote-flow-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
    camera.position.set(0, 0.15, 8.6);

    const group = new THREE.Group();
    group.rotation.x = -0.1;
    scene.add(group);

    const nodeGeometry = new THREE.IcosahedronGeometry(0.55, 2);
    const connectorGeometry = new THREE.OctahedronGeometry(0.3, 1);
    const packetGeometry = new THREE.SphereGeometry(0.055, 12, 12);
    geometries.push(nodeGeometry, connectorGeometry, packetGeometry);

    const localMaterial = new THREE.MeshStandardMaterial({
      color: 0x8f7cff,
      emissive: 0x34286f,
      emissiveIntensity: 0.75,
      roughness: 0.25,
      metalness: 0.18,
    });
    const originMaterial = new THREE.MeshStandardMaterial({
      color: 0xa4aebc,
      emissive: 0x29313c,
      emissiveIntensity: 0.65,
      roughness: 0.32,
      metalness: 0.28,
    });
    const githubMaterial = new THREE.MeshStandardMaterial({
      color: 0xc8f13a,
      emissive: 0x607400,
      emissiveIntensity: 0.8,
      roughness: 0.24,
      metalness: 0.15,
    });
    const packetMaterial = new THREE.MeshBasicMaterial({ color: 0xc8f13a });
    materials.push(
      localMaterial,
      originMaterial,
      githubMaterial,
      packetMaterial,
    );

    const localNode = new THREE.Mesh(nodeGeometry, localMaterial);
    localNode.position.x = -2.65;
    group.add(localNode);

    const originNode = new THREE.Mesh(connectorGeometry, originMaterial);
    group.add(originNode);

    const githubNode = new THREE.Mesh(nodeGeometry, githubMaterial);
    githubNode.position.x = 2.65;
    group.add(githubNode);

    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-2.1, 0, 0),
      new THREE.Vector3(-0.35, 0, 0),
      new THREE.Vector3(0.35, 0, 0),
      new THREE.Vector3(2.1, 0, 0),
    ]);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x5f6a78,
      transparent: true,
      opacity: 0.48,
    });
    geometries.push(lineGeometry);
    materials.push(lineMaterial);
    group.add(new THREE.Line(lineGeometry, lineMaterial));

    const rings: THREE.Mesh[] = [];
    const ringGeometry = new THREE.TorusGeometry(0.72, 0.018, 8, 64);
    const localRingMaterial = new THREE.MeshBasicMaterial({
      color: 0x8f7cff,
      transparent: true,
      opacity: 0.32,
    });
    const githubRingMaterial = new THREE.MeshBasicMaterial({
      color: 0xc8f13a,
      transparent: true,
      opacity: 0.32,
    });
    geometries.push(ringGeometry);
    materials.push(localRingMaterial, githubRingMaterial);

    [
      [-2.65, localRingMaterial],
      [2.65, githubRingMaterial],
    ].forEach(([x, material]) => {
      const ring = new THREE.Mesh(
        ringGeometry,
        material as THREE.MeshBasicMaterial,
      );
      ring.position.x = x as number;
      group.add(ring);
      rings.push(ring);
    });

    const packets: THREE.Mesh[] = [];
    for (let index = 0; index < 9; index += 1) {
      const packet = new THREE.Mesh(packetGeometry, packetMaterial);
      packet.visible = false;
      group.add(packet);
      packets.push(packet);
    }

    scene.add(new THREE.AmbientLight(0xb6c0ce, 1.15));

    const localLight = new THREE.PointLight(0x8f7cff, 8, 6);
    localLight.position.set(-2.6, 1.5, 2.2);
    scene.add(localLight);

    const remoteLight = new THREE.PointLight(0xc8f13a, 9, 6);
    remoteLight.position.set(2.6, 1.5, 2.2);
    scene.add(remoteLight);

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
      const transferActive =
        activeStep === 2 || activeStep === 4 || activeStep === 5;
      const reverse = activeStep === 2 || activeStep === 4;
      const synced = activeStep >= 6;

      group.rotation.y = Math.sin(time * 0.00025) * 0.09;
      localNode.rotation.y = time * 0.00035;
      localNode.rotation.x = time * 0.00018;
      githubNode.rotation.y = -time * 0.0003;
      githubNode.rotation.x = time * 0.00016;
      originNode.rotation.y = time * 0.00055;
      rings[0].rotation.z = time * 0.00028;
      rings[1].rotation.z = -time * 0.00025;

      originMaterial.emissiveIntensity = activeStep >= 1 ? 1.3 : 0.5;
      lineMaterial.opacity = activeStep >= 1 ? 0.78 : 0.32;
      lineMaterial.color.setHex(synced ? 0xc8f13a : 0x697585);

      packets.forEach((packet, index) => {
        packet.visible = transferActive && !reducedMotion.matches;
        if (!packet.visible) return;
        const rawProgress = (time * 0.00038 + index / packets.length) % 1;
        const progress = reverse ? 1 - rawProgress : rawProgress;
        packet.position.x = -2.05 + progress * 4.1;
        packet.position.y = Math.sin(progress * Math.PI) * 0.18;
        packet.scale.setScalar(0.65 + Math.sin(progress * Math.PI) * 0.65);
        packetMaterial.color.setHex(reverse ? 0x8f7cff : 0xc8f13a);
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
  }, []);

  return (
    <div className="remote-flow-scene" ref={hostRef}>
      <div className="remote-flow-fallback">
        <span>LOCAL</span>
        <i />
        <span>ORIGIN</span>
        <i />
        <span>GITHUB</span>
      </div>
    </div>
  );
}
