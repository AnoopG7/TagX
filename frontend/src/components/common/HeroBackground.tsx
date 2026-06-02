import { useEffect, useRef } from "react";
import { useUIStore } from "@/stores/uiStore";

const PRIMARY_LIGHT = { r: 0.3, g: 0.7, b: 0.55 };
const PRIMARY_DARK = { r: 0.35, g: 0.75, b: 0.6 };

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; alpha: number;
}

interface Ripple {
  radius: number;
  maxRadius: number;
  alpha: number;
}

export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let w = 0;
    let h = 0;

    const particles: Particle[] = [];
    const ripples: Ripple[] = [];
    let time = 0;
    let rippleTimer = 0;

    function resize() {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = window.innerHeight;
    }

    function createParticles() {
      particles.length = 0;
      for (let i = 0; i < 400; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 2.5 + 1,
          alpha: Math.random() * 0.5 + 0.3,
        });
      }
    }

    function spawnRipple() {
      ripples.push({
        radius: 0,
        maxRadius: Math.max(w, h) * 0.9,
        alpha: 0.4 + Math.random() * 0.1,
      });
    }



    function draw() {
      ctx!.clearRect(0, 0, w, h);
      time += 0.005;
      rippleTimer += 1;

      const color = theme === "dark" ? PRIMARY_DARK : PRIMARY_LIGHT;
      const cx = w / 2;
      const cy = h / 2;

      // Spawn ripples from center — every ~30 frames
      if (rippleTimer % 30 === 0) spawnRipple();

      // Draw ripples (water-like concentric rings from center)
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += Math.max(w, h) * 0.005;
        r.alpha *= 0.988;

        if (r.alpha < 0.01 || r.radius > r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        const fadeIn = Math.min(1, r.radius / (Math.max(w, h) * 0.05));

        ctx!.beginPath();
        ctx!.arc(cx, cy, r.radius, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, ${r.alpha * fadeIn})`;
        ctx!.lineWidth = 2;
        ctx!.stroke();
      }

      // Draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nearAlpha = Math.min(1, Math.max(0, 1 - dist / (Math.min(w, h) * 0.5)));
        const particleAlpha = p.alpha * (0.6 + nearAlpha * 0.4);

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, ${particleAlpha})`;
        ctx!.fill();
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    spawnRipple();
    spawnRipple();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("resize", createParticles);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", createParticles);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
