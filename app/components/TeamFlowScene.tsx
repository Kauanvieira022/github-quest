"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type TeamFlowSceneProps = {
  step: number;
};

export function TeamFlowScene({ step }: TeamFlowSceneProps) {
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
    renderer.domElement.className = "team-flow-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
    camera.position.set(0, 0.35, 8.8);

    const group = new THREE.Group();
    group.rotation.x = -0.08;
    scene.add(group);

    const contributorGeometry = new THREE.IcosahedronGeometry(0.48, 2);
    const mainGeometry = new THREE.OctahedronGeometry(0.66, 2);
    const packetGeometry = new THREE.SphereGeometry(0.055, 12, 12);
    const ringGeometry = new THREE.TorusGeometry(0.86, 0.025, 8, 64);
    geometries.push(
      contributorGeometry,
      mainGeometry,
      packetGeometry,
      ringGeometry,
    );

    const violetMaterial = new THREE.MeshStandardMaterial({
      color: 0x8f7cff,
      emissive: 0x34286f,
      emissiveIntensity: 0.75,
      roughness: 0.25,
      metalness: 0.18,
    });
    const blueMaterial = new THREE.MeshStandardMaterial({
      color: 0x63b7ff,
      emissive: 0x174367,
      emissiveIntensity: 0.75,
      roughness: 0.25,
      metalness: 0.18,
    });
    const mainMaterial = new THREE.MeshStandardMaterial({
      color: 0xaab4c1,
      emissive: 0x303945,
      emissiveIntensity: 0.7,
      roughness: 0.28,
      metalness: 0.22,
    });
    const packetMaterial = new THREE.MeshBasicMaterial({ color: 0x8f7cff });
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xaab4c1,
      transparent: true,
      opacity: 0.28,
    });
    materials.push(
      violetMaterial,
      blueMaterial,
      mainMaterial,
      packetMaterial,
      ringMaterial,
    );

    const leftNode = new THREE.Mesh(contributorGeometry, violetMaterial);
    leftNode.position.set(-2.75, 0.35, 0);
    group.add(leftNode);

    const rightNode = new THREE.Mesh(contributorGeometry, blueMaterial);
    rightNode.position.set(2.75, 0.35, 0);
    group.add(rightNode);

    const mainNode = new THREE.Mesh(mainGeometry, mainMaterial);
    mainNode.position.set(0, -0.45, 0);
    group.add(mainNode);

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.copy(mainNode.position);
    group.add(ring);

    const leftCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-2.25, 0.27, 0),
      new THREE.Vector3(-1.2, 1.25, 0),
      new THREE.Vector3(-0.4, -0.25, 0),
    );
    const rightCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(2.25, 0.27, 0),
      new THREE.Vector3(1.2, 1.25, 0),
      new THREE.Vector3(0.4, -0.25, 0),
    );

    const lineMaterials = [leftCurve, rightCurve].map((curve) => {
      const geometry = new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(42),
      );
      const material = new THREE.LineBasicMaterial({
        color: 0x647080,
        transparent: true,
        opacity: 0.48,
      });
      geometries.push(geometry);
      materials.push(material);
      group.add(new THREE.Line(geometry, material));
      return material;
    });

    const packets = Array.from({ length: 10 }, (_, index) => {
      const packet = new THREE.Mesh(packetGeometry, packetMaterial);
      packet.visible = false;
      packet.userData.curve = index % 2;
      group.add(packet);
      return packet;
    });

    scene.add(new THREE.AmbientLight(0xb8c2cf, 1.15));

    const violetLight = new THREE.PointLight(0x8f7cff, 8, 6);
    violetLight.position.set(-2.6, 1.5, 2.2);
    scene.add(violetLight);

    const blueLight = new THREE.PointLight(0x63b7ff, 8, 6);
    blueLight.position.set(2.6, 1.5, 2.2);
    scene.add(blueLight);

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
      const conflict = activeStep >= 2 && activeStep < 4;
      const resolved = activeStep >= 4;
      const published = activeStep >= 6;
      const activeColor = conflict ? 0xff6f61 : resolved ? 0xc8f13a : 0x7d8998;

      group.rotation.y = Math.sin(time * 0.00025) * 0.08;
      leftNode.rotation.y = time * 0.00035;
      leftNode.rotation.x = time * 0.0002;
      rightNode.rotation.y = -time * 0.00032;
      rightNode.rotation.x = time * 0.00018;
      mainNode.rotation.y = time * 0.00048;
      ring.rotation.z = time * 0.0003;

      mainMaterial.color.setHex(activeColor);
      mainMaterial.emissive.setHex(
        conflict ? 0x6f201d : resolved ? 0x536600 : 0x303945,
      );
      mainMaterial.emissiveIntensity = conflict ? 1.45 : resolved ? 1.1 : 0.7;
      ringMaterial.color.setHex(activeColor);
      ringMaterial.opacity = conflict ? 0.72 : resolved ? 0.5 : 0.28;
      lineMaterials.forEach((material) => {
        material.color.setHex(activeColor);
        material.opacity = activeStep >= 1 ? 0.76 : 0.38;
      });

      packets.forEach((packet, index) => {
        packet.visible =
          activeStep >= 1 && activeStep < 6 && !reducedMotion.matches;
        if (!packet.visible) return;
        const progress = (time * 0.00034 + index / packets.length) % 1;
        const curve = packet.userData.curve === 0 ? leftCurve : rightCurve;
        packet.position.copy(curve.getPoint(progress));
        packet.scale.setScalar(0.65 + Math.sin(progress * Math.PI) * 0.7);
        packetMaterial.color.setHex(activeColor);
      });

      if (published) {
        mainMaterial.color.setHex(0xc8f13a);
        mainMaterial.emissive.setHex(0x607400);
      }

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
    <div className="team-flow-scene" ref={hostRef}>
      <div className="team-flow-fallback">
        <span>SUA BRANCH</span>
        <i />
        <span>MAIN</span>
        <i />
        <span>COLEGA</span>
      </div>
    </div>
  );
}
