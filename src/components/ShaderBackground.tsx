"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Pattern 1: Phoenix Curves (colorful)
const phoenixCurves = `
  uniform float iTime;
  uniform vec2 iResolution;
  uniform vec2 iMouse;
  varying vec2 vUv;

  void main() {
    vec2 FC = vUv * iResolution;
    vec2 r = iResolution;
    float t = iTime;
    vec2 mouse = iMouse / r;
    vec2 p = (FC * 2.0 - r) / r.y / 0.4;
    
    vec2 mouseOffset = (vUv - mouse) * 2.0;
    float mouseDist = length(mouseOffset);
    float mouseInfluence = smoothstep(1.5, 0.0, mouseDist) * 0.5;
    p += mouseOffset * mouseInfluence * 0.3;
    
    vec2 v;
    vec4 o = vec4(0.0);
    
    for (float i = 0.0; i < 9.0; i += 1.0) {
      v = p;
      for (float f = 0.0; f < 9.0; f += 1.0) {
        float mousePhase = mouseInfluence * sin(mouseDist * 3.14159 + t) * 0.5;
        v += cos(v.yx * f + i * 0.1 + t / 2.0 + mousePhase) / (f + 1.0);
      }
      float l = length(v * v.yx);
      vec4 color = cos(i / 4.0 + v.y + vec4(0.0, 1.0, 2.0, 4.0)) + 1.0;
      color *= 1.0 + mouseInfluence * 0.5;
      o += 0.01 / (l + 0.01) * color;
    }
    
    o = max(tanh(o * 0.8), 0.0);
    o += o * o * 0.3;
    float vignette = 1.0 - length((vUv - 0.5) * 0.8);
    vignette = smoothstep(0.0, 1.0, vignette);
    o *= vignette * 0.5 + 0.5;
    gl_FragColor = vec4(o.rgb, 1.0);
  }
`;

// Pattern 2: Spiral Vortex (colorful)
const spiralVortex = `
  uniform float iTime;
  uniform vec2 iResolution;
  uniform vec2 iMouse;
  varying vec2 vUv;

  void main() {
    vec2 r = iResolution;
    float t = iTime;
    vec2 mouse = iMouse / r;
    vec2 p = (vUv * 2.0 - 1.0) * vec2(r.x / r.y, 1.0);
    
    vec2 mouseOffset = (vUv - mouse) * 2.0;
    float mouseDist = length(mouseOffset);
    float mouseInfluence = smoothstep(1.5, 0.0, mouseDist) * 0.5;
    
    vec4 o = vec4(0.0);
    float angle = atan(p.y, p.x);
    float radius = length(p);
    
    for (float i = 0.0; i < 8.0; i += 1.0) {
      float spiral = angle + radius * 3.0 - t * 0.5 + i * 0.8;
      float wave = sin(spiral * 5.0 + mouseInfluence * 3.0) * 0.5 + 0.5;
      float dist = abs(mod(radius + t * 0.2 + i * 0.1, 0.5) - 0.25);
      float line = 0.01 / (dist + 0.01) * wave;
      
      vec4 color = cos(i / 4.0 + radius * 2.0 + vec4(0.0, 1.0, 2.0, 4.0)) + 1.0;
      color *= 1.0 + mouseInfluence * 0.5;
      o += line * color * 0.15;
    }
    
    o = max(tanh(o * 0.8), 0.0);
    o += o * o * 0.3;
    float vignette = 1.0 - length((vUv - 0.5) * 0.8);
    vignette = smoothstep(0.0, 1.0, vignette);
    o *= vignette * 0.5 + 0.5;
    gl_FragColor = vec4(o.rgb, 1.0);
  }
`;

// Pattern 3: Plasma Waves (colorful)
const plasmaWaves = `
  uniform float iTime;
  uniform vec2 iResolution;
  uniform vec2 iMouse;
  varying vec2 vUv;

  void main() {
    vec2 r = iResolution;
    float t = iTime;
    vec2 mouse = iMouse / r;
    vec2 p = vUv * 4.0 - 2.0;
    p.x *= r.x / r.y;
    
    vec2 mouseOffset = (vUv - mouse) * 2.0;
    float mouseDist = length(mouseOffset);
    float mouseInfluence = smoothstep(1.5, 0.0, mouseDist) * 0.5;
    p += mouseOffset * mouseInfluence * 0.5;
    
    vec4 o = vec4(0.0);
    
    for (float i = 0.0; i < 7.0; i += 1.0) {
      vec2 q = p;
      q += sin(p.yx * (1.0 + i * 0.3) + t * 0.5 + i) * 0.5;
      q += cos(p * (1.5 + i * 0.2) - t * 0.3) * 0.3;
      
      float plasma = sin(q.x * 3.0 + t) + sin(q.y * 2.0 - t * 0.7);
      plasma += sin((q.x + q.y) * 2.0 + t * 0.5);
      plasma += sin(length(q) * 3.0 - t);
      plasma = abs(plasma) * 0.25;
      
      float l = 0.02 / (plasma + 0.02);
      vec4 color = cos(i / 3.0 + plasma * 2.0 + vec4(0.0, 1.0, 2.0, 4.0)) + 1.0;
      color *= 1.0 + mouseInfluence * 0.5;
      o += l * color * 0.08;
    }
    
    o = max(tanh(o * 0.8), 0.0);
    o += o * o * 0.3;
    float vignette = 1.0 - length((vUv - 0.5) * 0.8);
    vignette = smoothstep(0.0, 1.0, vignette);
    o *= vignette * 0.5 + 0.5;
    gl_FragColor = vec4(o.rgb, 1.0);
  }
`;

// Pattern 4: Electric Arcs (colorful)
const electricArcs = `
  uniform float iTime;
  uniform vec2 iResolution;
  uniform vec2 iMouse;
  varying vec2 vUv;

  void main() {
    vec2 r = iResolution;
    float t = iTime;
    vec2 mouse = iMouse / r;
    vec2 p = (vUv - 0.5) * 2.0;
    p.x *= r.x / r.y;
    
    vec2 mouseOffset = (vUv - mouse) * 2.0;
    float mouseDist = length(mouseOffset);
    float mouseInfluence = smoothstep(1.5, 0.0, mouseDist) * 0.5;
    
    vec4 o = vec4(0.0);
    
    for (float i = 0.0; i < 10.0; i += 1.0) {
      vec2 origin = vec2(sin(t * 0.3 + i * 1.5), cos(t * 0.4 + i * 1.2)) * 0.8;
      vec2 dir = p - origin;
      float angle = atan(dir.y, dir.x);
      float dist = length(dir);
      
      float arc = sin(angle * 8.0 + dist * 10.0 - t * 2.0 + i);
      arc += sin(angle * 5.0 - dist * 8.0 + t * 1.5) * 0.5;
      arc = abs(arc);
      
      float intensity = 0.015 / (arc * dist + 0.015);
      intensity *= smoothstep(2.0, 0.0, dist);
      intensity *= 1.0 + mouseInfluence * sin(t * 3.0 + i) * 0.5;
      
      vec4 color = cos(i / 4.0 + dist + vec4(0.0, 1.0, 2.0, 4.0)) + 1.0;
      o += intensity * color * 0.12;
    }
    
    o = max(tanh(o * 0.8), 0.0);
    o += o * o * 0.3;
    float vignette = 1.0 - length((vUv - 0.5) * 0.8);
    vignette = smoothstep(0.0, 1.0, vignette);
    o *= vignette * 0.5 + 0.5;
    gl_FragColor = vec4(o.rgb, 1.0);
  }
`;

// Pattern 5: Fluid Ribbons (colorful)
const fluidRibbons = `
  uniform float iTime;
  uniform vec2 iResolution;
  uniform vec2 iMouse;
  varying vec2 vUv;

  void main() {
    vec2 r = iResolution;
    float t = iTime;
    vec2 mouse = iMouse / r;
    vec2 p = (vUv - 0.5) * 3.0;
    p.x *= r.x / r.y;
    
    vec2 mouseOffset = (vUv - mouse) * 2.0;
    float mouseDist = length(mouseOffset);
    float mouseInfluence = smoothstep(1.5, 0.0, mouseDist) * 0.5;
    p += mouseOffset * mouseInfluence * 0.4;
    
    vec4 o = vec4(0.0);
    
    for (float i = 0.0; i < 8.0; i += 1.0) {
      vec2 q = p;
      float phase = i * 0.7 + t * 0.3;
      
      for (float j = 0.0; j < 5.0; j += 1.0) {
        q = vec2(
          q.x * cos(phase) - q.y * sin(phase),
          q.x * sin(phase) + q.y * cos(phase)
        );
        q += sin(q.yx * (1.5 + j * 0.2) + t * 0.5) * 0.3;
      }
      
      float ribbon = abs(sin(q.x * 2.0 + q.y * 1.5 + t));
      ribbon = 0.02 / (ribbon + 0.02);
      
      vec4 color = cos(i / 4.0 + length(q) + vec4(0.0, 1.0, 2.0, 4.0)) + 1.0;
      color *= 1.0 + mouseInfluence * 0.5;
      o += ribbon * color * 0.06;
    }
    
    o = max(tanh(o * 0.8), 0.0);
    o += o * o * 0.3;
    float vignette = 1.0 - length((vUv - 0.5) * 0.8);
    vignette = smoothstep(0.0, 1.0, vignette);
    o *= vignette * 0.5 + 0.5;
    gl_FragColor = vec4(o.rgb, 1.0);
  }
`;

// Pattern 6: Aurora Borealis (colorful)
const auroraBorealis = `
  uniform float iTime;
  uniform vec2 iResolution;
  uniform vec2 iMouse;
  varying vec2 vUv;

  void main() {
    vec2 r = iResolution;
    float t = iTime;
    vec2 mouse = iMouse / r;
    vec2 p = vUv;
    p.x *= r.x / r.y;
    
    vec2 mouseOffset = (vUv - mouse) * 2.0;
    float mouseDist = length(mouseOffset);
    float mouseInfluence = smoothstep(1.5, 0.0, mouseDist) * 0.5;
    
    vec4 o = vec4(0.0);
    
    for (float i = 0.0; i < 6.0; i += 1.0) {
      float y = p.y + sin(p.x * 3.0 + t * 0.5 + i * 1.5) * 0.2;
      y += sin(p.x * 5.0 - t * 0.3 + i) * 0.1;
      y += mouseInfluence * sin(p.x * 2.0 + t) * 0.15;
      
      float band = smoothstep(0.3 + i * 0.1, 0.5 + i * 0.1, y);
      band *= smoothstep(0.7 + i * 0.05, 0.5 + i * 0.1, y);
      
      float shimmer = sin(p.x * 20.0 + t * 3.0 + i * 2.0) * 0.5 + 0.5;
      band *= 0.5 + shimmer * 0.5;
      
      vec4 color = cos(i / 3.0 + y * 3.0 + vec4(0.0, 1.0, 2.0, 4.0)) + 1.0;
      color *= 1.0 + mouseInfluence * 0.5;
      o += band * color * 0.25;
    }
    
    o = max(tanh(o * 0.8), 0.0);
    o += o * o * 0.3;
    float vignette = 1.0 - length((vUv - 0.5) * 0.8);
    vignette = smoothstep(0.0, 1.0, vignette);
    o *= vignette * 0.5 + 0.5;
    gl_FragColor = vec4(o.rgb, 1.0);
  }
`;

// Array of all shader patterns
const shaderPatterns = [
  phoenixCurves,
  spiralVortex,
  plasmaWaves,
  electricArcs,
  fluidRibbons,
  auroraBorealis,
];

export default function ShaderBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);
  const startTimeRef = useRef(Date.now());
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  
  // Select random shader pattern on mount
  const [fragmentShader] = useState(() => {
    const randomIndex = Math.floor(Math.random() * shaderPatterns.length);
    return shaderPatterns[randomIndex];
  });

  const animate = useCallback(() => {
    if (!isVisibleRef.current) {
      animationIdRef.current = requestAnimationFrame(animate);
      return;
    }

    if (materialRef.current && rendererRef.current && sceneRef.current && cameraRef.current) {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      materialRef.current.uniforms.iTime.value = elapsed;
      
      // Smooth mouse interpolation
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;
      
      const resolution = materialRef.current.uniforms.iResolution.value;
      materialRef.current.uniforms.iMouse.value.set(
        mouseRef.current.x * resolution.x,
        mouseRef.current.y * resolution.y
      );
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }

    animationIdRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Create renderer with full resolution
    const pixelRatio = window.devicePixelRatio || 1;
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      precision: "highp"
    });
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create orthographic camera
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    cameraRef.current = camera;

    // Create shader material with actual render resolution
    const renderWidth = container.clientWidth * pixelRatio;
    const renderHeight = container.clientHeight * pixelRatio;
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(renderWidth, renderHeight) },
        iMouse: { value: new THREE.Vector2(renderWidth * 0.5, renderHeight * 0.5) },
      },
    });
    materialRef.current = material;

    // Create fullscreen quad
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouseRef.current.x = (e.clientX - rect.left) / rect.width;
      targetMouseRef.current.y = 1.0 - (e.clientY - rect.top) / rect.height; // Flip Y
    };

    // Handle resize with full resolution
    const handleResize = () => {
      if (!container || !renderer || !material) return;
      
      const dpr = window.devicePixelRatio || 1;
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height);
      material.uniforms.iResolution.value.set(width * dpr, height * dpr);
    };

    // Intersection Observer for performance optimization
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    // Start animation
    startTimeRef.current = Date.now();
    animate();

    // Add event listeners
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (renderer) {
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      
      geometry.dispose();
      material.dispose();
    };
  }, [animate]);

  return (
    <>
      <div
        ref={containerRef}
        className="absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      />
      {/* Dark overlay for better text readability */}
      <div 
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/30 to-black/50 pointer-events-none"
        aria-hidden="true"
      />
    </>
  );
}
