// KOA 3D Scene using Three.js + Fallback to 2D SVG
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { KoaAnimState } from '../ui/AppState';
import { KoaAvatar } from '../ui/components/KoaAvatar';

interface Koa3DCanvasProps {
  state?: KoaAnimState;
  size?: number;
  mini?: boolean;
}

export function Koa3DCanvas({ state = 'idle', size = 180, mini = false }: Koa3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    if (mini || typeof window === 'undefined') {
      setUseFallback(true);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setUseFallback(true);
      return;
    }

    const actualSize = size;
    renderer.setSize(actualSize, actualSize);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xf5a623, 1.2);
    dirLight.position.set(3, 5, 4);
    scene.add(dirLight);

    const blueLight = new THREE.PointLight(0x37c8f0, 1, 10);
    blueLight.position.set(-2, -1, 3);
    scene.add(blueLight);

    // Robot Group
    const robotGroup = new THREE.Group();

    // Body
    const bodyGeo = new THREE.BoxGeometry(1.2, 1.0, 1.0);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1a2035, roughness: 0.3 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = -0.6;
    robotGroup.add(body);

    // Head
    const headGeo = new THREE.BoxGeometry(1.4, 1.1, 1.1);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x202840, roughness: 0.2 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 0.5;
    robotGroup.add(head);

    // Core / Brain glowing sphere
    const coreGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xf5a623,
      emissive: 0xf5a623,
      emissiveIntensity: 0.8,
      roughness: 0.1,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(0, 0.5, 0.56);
    robotGroup.add(core);

    // Gear on top
    const gearGeo = new THREE.TorusGeometry(0.3, 0.08, 8, 16);
    const gearMat = new THREE.MeshStandardMaterial({ color: 0x2a3555, metalness: 0.8 });
    const gear = new THREE.Mesh(gearGeo, gearMat);
    gear.position.set(0, 1.15, 0);
    gear.rotation.x = Math.PI / 2;
    robotGroup.add(gear);

    // Eyes
    const eyeGeo = new THREE.BoxGeometry(0.3, 0.15, 0.1);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x37c8f0, emissive: 0x37c8f0, emissiveIntensity: 0.6 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.35, 0.65, 0.56);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.35, 0.65, 0.56);
    robotGroup.add(leftEye);
    robotGroup.add(rightEye);

    scene.add(robotGroup);

    // Anim Loop
    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Bobbing
      robotGroup.position.y = Math.sin(elapsed * 2) * 0.08;

      // Gear rotation
      gear.rotation.z = elapsed * (state === 'focus' ? 3 : 1);

      // State transformations
      if (state === 'oops') {
        robotGroup.rotation.z = Math.sin(elapsed * 10) * 0.1;
      } else if (state === 'happy') {
        robotGroup.position.y += Math.abs(Math.sin(elapsed * 6)) * 0.1;
        robotGroup.rotation.y = Math.sin(elapsed * 2) * 0.2;
      } else if (state === 'celebrate') {
        robotGroup.rotation.y = elapsed * 3;
      } else {
        robotGroup.rotation.y = Math.sin(elapsed * 0.8) * 0.15;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [mini, size, state]);

  if (useFallback) {
    return <KoaAvatar state={state} size={size} mini={mini} />;
  }

  return <div ref={mountRef} style={{ width: size, height: size, display: 'inline-block' }} />;
}
