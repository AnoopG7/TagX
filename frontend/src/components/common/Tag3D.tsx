import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Tag3DProps {
  autoRotate?: boolean;
  color?: "indigo" | "pink" | "cyan";
  scale?: number;
}

/**
 * Interactive 3D TagX product visualization using Three.js.
 * Can be rotated with mouse, auto-rotates by default.
 */
export function Tag3D({
  autoRotate = true,
  color = "cyan",
  scale = 1,
}: Tag3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // ---- Scene Setup ----
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // ---- Lighting ----
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Color mapping
    const glowColors: Record<string, number> = {
      cyan: 0x00d9ff,
      indigo: 0x6366f1,
      pink: 0xec4899,
    };

    const selectedColor = glowColors[color] || glowColors.cyan;

    // Add glow light
    const glowLight = new THREE.PointLight(selectedColor, 0.8);
    glowLight.position.set(-5, 5, 5);
    scene.add(glowLight);

    // ---- Create TagX 3D Model ----
    const tag = new THREE.Group();

    // Main body
    const bodyGeometry = new THREE.BoxGeometry(2, 3, 0.4);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: selectedColor,
      emissive: selectedColor,
      emissiveIntensity: 0.2,
      shininess: 100,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    tag.add(body);

    // Corner cylinders
    const cornerRadius = 0.15;
    const cornerGeometry = new THREE.CylinderGeometry(
      cornerRadius,
      cornerRadius,
      3,
      8
    );
    const cornerMaterial = new THREE.MeshPhongMaterial({
      color: selectedColor,
      emissive: selectedColor,
      emissiveIntensity: 0.2,
    });

    const cornerPositions = [
      [1, 0, 0.2],
      [-1, 0, 0.2],
      [1, 0, -0.2],
      [-1, 0, -0.2],
    ];

    cornerPositions.forEach(([x, y, z]) => {
      const corner = new THREE.Mesh(cornerGeometry, cornerMaterial);
      corner.position.set(x as number, y as number, z as number);
      corner.rotation.z = Math.PI / 2;
      tag.add(corner);
    });

    // Ring
    const ringGeometry = new THREE.TorusGeometry(1.2, 0.08, 16, 32);
    const ringMaterial = new THREE.MeshPhongMaterial({
      color: selectedColor,
      emissive: selectedColor,
      emissiveIntensity: 0.4,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.z = 0.3;
    tag.add(ring);

    tag.scale.set(scale, scale, scale);
    scene.add(tag);

    // ---- Mouse Interaction ----
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = () => {
      isDragging = true;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        tag.rotation.y += deltaX * 0.01;
        tag.rotation.x += deltaY * 0.01;
      }

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("mouseup", onMouseUp);

    // ---- Animation Loop ----
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (!isDragging && autoRotate) {
        tag.rotation.y += 0.003;
        tag.rotation.x += 0.001;
      }

      renderer.render(scene, camera);
    };
    animate();

    // ---- Handle Resize ----
    const handleResize = () => {
      if (!containerRef.current) return;

      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // ---- Cleanup ----
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("mouseup", onMouseUp);

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      bodyGeometry.dispose();
      bodyMaterial.dispose();
      cornerGeometry.dispose();
      cornerMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      renderer.dispose();

      if (containerRef.current && renderer.domElement.parentNode) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [autoRotate, color, scale]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    />
  );
}
