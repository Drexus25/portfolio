'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

const vertex = `#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uPointerActive;
uniform float uTime;

in vec2 vUv;
out vec4 fragColor;

// Core palette requested: bottom pivot is #CCEBFF (0.8, 0.92, 1.0), radiating to #0099FF (0.0, 0.6, 1.0)
const vec3 COLOR_CORE = vec3(0.80, 0.92, 1.0);
const vec3 COLOR_OUTER = vec3(0.00, 0.60, 1.0);
const vec3 SUN_GLINT = vec3(1.0, 1.0, 1.0);

void main() {
  vec2 st = gl_FragCoord.xy / uResolution.xy;
  float aspect = uResolution.x / max(uResolution.y, 1.0);

  // Circular gradient anchored at the bottom center (0.5, 0.0 in WebGL coords)
  vec2 pivot = vec2(0.5, 0.0);
  vec2 pivotDelta = vec2((st.x - pivot.x) * aspect, st.y - pivot.y);
  float distPivot = length(pivotDelta);

  // Smooth circular gradient from core (#CCEBFF) to outer (#0099FF)
  vec3 baseGradient = mix(COLOR_CORE, COLOR_OUTER, smoothstep(0.08, 1.15, distPivot));

  // Dynamic interactive pointer wave & ripple
  vec2 pDelta = vec2((st.x - uPointer.x) * aspect, st.y - uPointer.y);
  float pDist = length(pDelta);
  float wave = sin(clamp(pDist * 28.0 - uTime * 4.0, -3.1415, 25.0)) * exp(-pDist * 4.2) * uPointerActive;

  // Wave coordinate displacement
  vec2 waveDisp = pDist > 0.001 ? (pDelta / pDist) * wave * 0.14 : vec2(0.0);
  vec2 uv = vec2(st.x * aspect, st.y) * 3.8 + waveDisp;

  // Water caustics simulation: overlapping sinusoidal wave interference
  float t = uTime * 0.38;
  vec2 p1 = uv + vec2(sin(t * 0.7 + uv.y * 0.6), cos(t * 0.6 + uv.x * 0.6));
  vec2 p2 = uv * 1.5 - vec2(cos(t * 0.5 + uv.y * 0.8), sin(t * 0.8 + uv.x * 0.7));

  float c1 = sin(p1.x + sin(p1.y + t * 0.9)) * sin(p1.y + sin(p1.x + t * 0.9));
  float c2 = sin(p2.x + sin(p2.y - t * 0.8)) * sin(p2.y + sin(p2.x - t * 0.8));

  // Sharp caustic filaments
  float caustics = pow(abs(c1 * 0.65 + c2 * 0.35), 2.2);

  // High-frequency glistening ripples
  float c3 = sin(p1.x * 2.4 - t * 1.4) * cos(p1.y * 2.4 + t * 1.1);
  caustics += pow(abs(c3), 3.2) * 0.4;

  // Apply caustics with ambient depth glow radiating from bottom pivot
  float depthAttenuation = mix(0.45, 0.95, smoothstep(1.0, 0.1, st.y));
  float causticIntensity = caustics * depthAttenuation;

  // Composite: brighten crests with sparkling sunlight, deepen troughs
  vec3 finalColor = baseGradient;
  finalColor += (causticIntensity - 0.22) * 0.35 * SUN_GLINT;
  finalColor += wave * 0.25 * SUN_GLINT;

  fragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
}
`;

export default function WaterCaustics({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;

    let renderer: Renderer | null = null;
    let gl: any = null;
    let program: Program | null = null;
    let mesh: Mesh | null = null;
    let raf = 0;
    let disposed = false;

    try {
      renderer = new Renderer({
        alpha: false,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio || 1, 2)
      });
      gl = renderer.gl;
      gl.canvas.style.position = 'absolute';
      gl.canvas.style.inset = '0';
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';
      gl.canvas.style.display = 'block';
      container.appendChild(gl.canvas);
    } catch {
      return;
    }

    const geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uResolution: { value: [100, 100] },
        uPointer: { value: [0.5, 0.5] },
        uPointerActive: { value: 0 },
        uTime: { value: 0 }
      }
    });

    mesh = new Mesh(gl, { geometry, program });

    const pointer = {
      x: 0.5,
      y: 0.3,
      targetX: 0.5,
      targetY: 0.3,
      active: 0.4, // Subtle gentle ripples even initially
      targetActive: 0.4
    };

    const resize = () => {
      if (disposed || !container || !renderer || !program) return;
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width * dpr, height * dpr];
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.targetX = (e.clientX - rect.left) / rect.width;
      pointer.targetY = 1.0 - (e.clientY - rect.top) / rect.height; // Invert for WebGL (Y=0 at bottom)
      pointer.targetActive = 1.0;
    };

    const handlePointerLeave = () => {
      pointer.targetActive = 0.3; // Return to gentle ambient mode
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseleave', handlePointerLeave);
    resize();

    const startTime = performance.now();
    const render = (now: number) => {
      if (disposed) return;

      const elapsed = (now - startTime) * 0.001;

      // Smooth pointer lerp
      pointer.x += (pointer.targetX - pointer.x) * 0.08;
      pointer.y += (pointer.targetY - pointer.y) * 0.08;
      pointer.active += (pointer.targetActive - pointer.active) * 0.06;

      program!.uniforms.uTime.value = elapsed;
      program!.uniforms.uPointer.value = [pointer.x, pointer.y];
      program!.uniforms.uPointerActive.value = pointer.active;

      renderer!.render({ scene: mesh! });
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);

      if (gl && gl.canvas && gl.canvas.parentNode === container) {
        container.removeChild(gl.canvas);
      }
      try {
        gl?.getExtension('WEBGL_lose_context')?.loseContext();
      } catch {
        // no-op
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  );
}
