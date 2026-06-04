'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

interface FloatingItem {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: 'cap' | 'spout' | 'jerrycan' | 'bottle';
  angle: number;
  spinSpeed: number;
  baseY: number;
  parallaxFactor: number;
  colorType: 'blue' | 'green';
}

interface BlueprintScene {
  type: 'capping' | 'spout' | 'fliptop';
  x: number;
  y: number;
  vx: number; // add velocities to let the scene drift gently
  vy: number;
  width: number;
  height: number;
  progress: number;
  state: 'fadeIn' | 'action' | 'fadeOut';
  stateProgress: number;
  duration: number;
  label: string;
}

export function ProductBackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true);
  const [currentSceneType, setCurrentSceneType] = useState<'capping' | 'spout' | 'fliptop'>('capping');

  // Interactive configurations
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000, radius: 200 });
  const scrollRef = useRef(0);
  const itemsRef = useRef<FloatingItem[]>([]);
  const activeSceneRef = useRef<BlueprintScene | null>(null);
  const frameIdRef = useRef<number | null>(null);

  // Initialize floating items (reduced opacity for premium look)
  const initItems = (width: number, height: number) => {
    const items: FloatingItem[] = [];
    const count = width < 768 ? 6 : 10;
    const types: ('cap' | 'spout' | 'jerrycan' | 'bottle')[] = ['cap', 'spout', 'jerrycan', 'bottle'];
    
    for (let i = 0; i < count; i++) {
      const size = 35 + Math.random() * 45;
      const x = Math.random() * width;
      const y = Math.random() * height;
      items.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size,
        type: types[i % types.length],
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.004,
        baseY: y,
        parallaxFactor: 0.03 + Math.random() * 0.08,
        colorType: i % 2 === 0 ? 'blue' : 'green',
      });
    }
    itemsRef.current = items;
  };

  // Helper to create specific scene types with drift
  const createScene = (type: 'capping' | 'spout' | 'fliptop', width: number, height: number): BlueprintScene => {
    // Place active scene in right column area or center (away from left side header)
    const x = width > 1024 ? width * 0.70 : width * 0.5 - 75;
    const y = height * 0.25 + Math.random() * (height * 0.3);

    let label = '';
    if (type === 'capping') label = 'SCREW-CAP SEALLING MECHANICS';
    else if (type === 'spout') label = 'RETRACTABLE POUR SPOUT ACTION';
    else label = 'SNAP FLIP-TOP DISPENSER ACTION';

    return {
      type,
      x,
      y,
      vx: (Math.random() - 0.5) * 0.15, // soft drift speed
      vy: (Math.random() - 0.5) * 0.15,
      width: 150,
      height: 180,
      progress: 0,
      state: 'fadeIn',
      stateProgress: 0,
      duration: 350,
      label
    };
  };

  const triggerScene = (type: 'capping' | 'spout' | 'fliptop') => {
    setCurrentSceneType(type);
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    if (activeSceneRef.current) {
      activeSceneRef.current.state = 'fadeOut';
      activeSceneRef.current.stateProgress = 0;
      
      setTimeout(() => {
        activeSceneRef.current = createScene(type, window.innerWidth, window.innerHeight);
      }, 300);
    } else {
      activeSceneRef.current = createScene(type, width, height);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      if (itemsRef.current.length === 0) {
        initItems(width, height);
      }
      
      if (!activeSceneRef.current) {
        activeSceneRef.current = createScene(currentSceneType, width, height);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);

    // Render loop
    const render = () => {
      if (!isAnimationEnabled) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      ctx.clearRect(0, 0, width, height);

      // Mouse follow interpolation
      const m = mouseRef.current;
      if (m.targetX !== -1000) {
        m.x += (m.targetX - m.x) * 0.1;
        m.y += (m.targetY - m.y) * 0.1;
      } else {
        m.x = -1000;
        m.y = -1000;
      }

      const isDark = document.documentElement.classList.contains('dark') || resolvedTheme === 'dark';
      
      // SUPER FAINT STYLING (To blend seamlessly with clean flat white/dark backdrops)
      const colBlue = isDark ? 'rgba(78, 197, 241, 0.08)' : 'rgba(16, 151, 213, 0.06)';
      const colBlueActive = isDark ? 'rgba(78, 197, 241, 0.40)' : 'rgba(16, 151, 213, 0.35)';
      const colGreen = isDark ? 'rgba(165, 222, 56, 0.07)' : 'rgba(130, 185, 26, 0.06)';
      const colGreenActive = isDark ? 'rgba(165, 222, 56, 0.40)' : 'rgba(130, 185, 26, 0.35)';
      const colText = isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(30, 45, 59, 0.20)';
      const colHighlight = 'rgba(245, 166, 35, 0.35)'; // Faint dimension highlights

      // ----------------------------------------------------
      // DRAW ACTIVE SCENE DIAGRAM
      // ----------------------------------------------------
      const scene = activeSceneRef.current;
      if (scene) {
        // Apply drift
        scene.x += scene.vx;
        scene.y += scene.vy;

        // Keep scene inside boundaries
        const padding = 80;
        if (scene.x < padding) { scene.x = padding; scene.vx *= -1; }
        if (scene.x > width - scene.width - padding) { scene.x = width - scene.width - padding; scene.vx *= -1; }
        if (scene.y < padding + 80) { scene.y = padding + 80; scene.vy *= -1; }
        if (scene.y > height - scene.height - padding) { scene.y = height - scene.height - padding; scene.vy *= -1; }

        let opacity = 0;
        const transitionSpeed = 0.03;

        if (scene.state === 'fadeIn') {
          scene.stateProgress += transitionSpeed;
          opacity = scene.stateProgress;
          if (scene.stateProgress >= 1) {
            scene.state = 'action';
            scene.stateProgress = 0;
          }
        } else if (scene.state === 'action') {
          opacity = 1;
          scene.progress += 1 / scene.duration;
          if (scene.progress >= 1) {
            scene.state = 'fadeOut';
            scene.stateProgress = 0;
          }
        } else if (scene.state === 'fadeOut') {
          scene.stateProgress += transitionSpeed;
          opacity = 1 - scene.stateProgress;
          if (scene.stateProgress >= 1) {
            activeSceneRef.current = null;
            // Cycle to the next animation automatically
            const order: ('capping' | 'spout' | 'fliptop')[] = ['capping', 'spout', 'fliptop'];
            const nextIdx = (order.indexOf(currentSceneType) + 1) % order.length;
            setCurrentSceneType(order[nextIdx]);
            activeSceneRef.current = createScene(order[nextIdx], width, height);
          }
        }

        if (opacity > 0) {
          ctx.save();
          ctx.globalAlpha = opacity;

          // Technical title details
          ctx.font = '700 8px monospace';
          ctx.fillStyle = colBlueActive;
          ctx.fillText(scene.label, scene.x - 10, scene.y - 15);

          const centerX = scene.x + scene.width / 2;
          const centerY = scene.y + scene.height / 2;

          // ----------------------------------------------------
          // SPECIFIC SCENE RENDERING PIPELINE WITH DETAILED STEPS
          // ----------------------------------------------------
          if (scene.type === 'capping') {
            const capYStart = centerY - 65;
            const capYEnd = centerY - 5;
            const screwProgress = Math.min(scene.progress * 1.4, 1.0);
            const isScrewed = screwProgress >= 0.98;

            // DRAW BOTTLE NECK
            ctx.strokeStyle = colBlue;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(centerX - 42, centerY + 70);
            ctx.quadraticCurveTo(centerX - 35, centerY + 40, centerX - 22, centerY + 40);
            ctx.lineTo(centerX - 22, centerY - 5);
            ctx.lineTo(centerX + 22, centerY - 5);
            ctx.lineTo(centerX + 22, centerY + 40);
            ctx.quadraticCurveTo(centerX + 35, centerY + 40, centerX + 42, centerY + 70);
            ctx.stroke();

            // Thread profiles
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.arc(centerX - 22, centerY + 10, 2, -Math.PI/2, Math.PI/2);
            ctx.arc(centerX - 22, centerY + 24, 2, -Math.PI/2, Math.PI/2);
            ctx.arc(centerX + 22, centerY + 17, 2, Math.PI/2, -Math.PI/2);
            ctx.stroke();

            // Cap descending
            const capY = capYStart + (capYEnd - capYStart) * screwProgress;
            
            // DRAW CAP
            ctx.save();
            ctx.translate(centerX, capY);
            
            let spinAngle = 0;
            if (screwProgress > 0.3 && !isScrewed) {
              spinAngle = (screwProgress - 0.3) * Math.PI * 8;
            }

            ctx.strokeStyle = isScrewed ? colGreenActive : colBlueActive;
            ctx.lineWidth = 1.8;

            ctx.beginPath();
            ctx.roundRect(-25, -20, 50, 20, [3, 3, 0, 0]);
            ctx.stroke();

            // Rib details
            ctx.lineWidth = 1.0;
            const ribCount = 8;
            ctx.beginPath();
            for (let i = 0; i <= ribCount; i++) {
              const rx = -20 + (i / ribCount) * 40 + Math.sin(spinAngle) * 2;
              if (rx > -23 && rx < 23) {
                ctx.moveTo(rx, -16);
                ctx.lineTo(rx, -3);
              }
            }
            ctx.stroke();

            // Sealing Liner / Wad
            ctx.strokeStyle = colHighlight;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(-24, -2);
            ctx.lineTo(24, -2);
            ctx.stroke();

            // Tamper-evident band
            ctx.strokeStyle = isScrewed ? colGreenActive : colHighlight;
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.roundRect(-24, 3, 48, 4, 1);
            ctx.stroke();

            ctx.restore();

            // Step status label drawing
            ctx.font = '700 8px monospace';
            if (screwProgress < 0.35) {
              ctx.fillStyle = colBlueActive;
              ctx.fillText('[ALIGNING CLOSURE]', centerX - 42, centerY + 85);
            } else if (screwProgress < 0.98) {
              ctx.fillStyle = colHighlight;
              ctx.fillText('[ENGAGING THREADS]', centerX - 42, centerY + 85);
            } else {
              ctx.fillStyle = colGreenActive;
              ctx.fillText('[SEAL COMPLETED]', centerX - 38, centerY + 85);
              
              // Pulsing lock ring
              const flash = Math.sin((scene.progress - 0.7) * 30) * 0.5 + 0.5;
              ctx.strokeStyle = `rgba(130, 185, 26, ${0.3 * (1 - (scene.progress - 0.7) / 0.3)})`;
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.arc(centerX, centerY + 10, 40 + flash * 15, 0, Math.PI * 2);
              ctx.stroke();
            }

          } 
          else if (scene.type === 'spout') {
            const extensionProgress = Math.max(0, Math.min((scene.progress - 0.1) * 2.0, 1.0));
            const pourProgress = Math.max(0, Math.min((scene.progress - 0.5) * 2.0, 1.0));
            
            // JERRYCAN CORNER DRAWING
            ctx.save();
            ctx.translate(centerX - 10, centerY + 30);
            ctx.rotate(-Math.PI / 6);

            ctx.strokeStyle = colBlue;
            ctx.lineWidth = 1.2;
            
            // Can lip opening
            ctx.strokeRect(-18, -5, 36, 10);
            // Can body
            ctx.beginPath();
            ctx.moveTo(-18, 5);
            ctx.lineTo(-38, 5);
            ctx.lineTo(-38, 65);
            ctx.moveTo(18, 5);
            ctx.lineTo(32, 5);
            ctx.stroke();

            // EXTENSIBLE TELESCOPIC SPOUT
            const maxExtend = 42;
            const currentExtend = extensionProgress * maxExtend;

            ctx.strokeStyle = colBlueActive;
            ctx.lineWidth = 1.8;

            ctx.beginPath();
            ctx.rect(-15, -currentExtend - 5, 30, currentExtend);
            ctx.stroke();

            // Pull loop
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, -currentExtend - 10, 5, 0, Math.PI * 2);
            ctx.stroke();

            // Bellow ribs
            if (currentExtend > 10) {
              ctx.strokeStyle = colBlue;
              ctx.lineWidth = 0.8;
              const ribSpacing = 5;
              const ribsCount = Math.floor(currentExtend / ribSpacing);
              ctx.beginPath();
              for (let i = 1; i < ribsCount; i++) {
                const ry = -5 - (i * ribSpacing);
                ctx.moveTo(-14, ry);
                ctx.lineTo(14, ry);
              }
              ctx.stroke();
            }

            // Dripping pour
            if (extensionProgress >= 0.95 && pourProgress > 0) {
              const dripY = -maxExtend - 15;
              
              ctx.strokeStyle = colGreenActive;
              ctx.lineWidth = 1.2;
              ctx.setLineDash([2, 2]);
              ctx.beginPath();
              ctx.moveTo(0, dripY);
              ctx.quadraticCurveTo(20, dripY - 5, 38, dripY + 50 + pourProgress * 45);
              ctx.stroke();
              ctx.setLineDash([]);

              const dropOffset = (pourProgress * 3.5) % 1.0;
              const dropY = dripY + 5 + dropOffset * 70;
              const dropX = (dropY - dripY) * 0.40;

              ctx.fillStyle = colGreenActive;
              ctx.beginPath();
              ctx.arc(dropX, dropY, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }

            ctx.restore();

            // Step text
            ctx.font = '700 8px monospace';
            if (extensionProgress < 0.35) {
              ctx.fillStyle = colBlueActive;
              ctx.fillText('[PULL-SPOUT ACTUATION]', centerX - 50, centerY + 85);
            } else if (extensionProgress < 0.98) {
              ctx.fillStyle = colHighlight;
              ctx.fillText('[TELESCOPIC SLEEVE OUT]', centerX - 55, centerY + 85);
            } else {
              ctx.fillStyle = colGreenActive;
              ctx.fillText('[CONTROLLED DISPENSING]', centerX - 55, centerY + 85);
            }
          } 
          else if (scene.type === 'fliptop') {
            const openProgress = Math.max(0, Math.min((scene.progress - 0.15) * 2.5, 1.0));
            
            // FLIP TOP PROFILE
            ctx.save();
            ctx.translate(centerX, centerY + 20);

            // Container neck shoulders
            ctx.strokeStyle = colBlue;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(-28, 40);
            ctx.lineTo(-22, 16);
            ctx.lineTo(22, 16);
            ctx.lineTo(28, 40);
            ctx.stroke();

            // Flip top main cap body
            ctx.strokeStyle = colBlueActive;
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.roundRect(-22, -4, 44, 20, 2);
            ctx.stroke();

            // Internal Orifice
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.rect(-6, -10, 12, 6);
            ctx.stroke();

            // Hinge joint
            ctx.fillStyle = colHighlight;
            ctx.beginPath();
            ctx.arc(20, -2, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Rotatable lid
            ctx.save();
            ctx.translate(20, -2);
            ctx.rotate(-openProgress * Math.PI * 0.62);
            
            ctx.strokeStyle = colBlueActive;
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.roundRect(-42, -3, 42, 5, 2);
            ctx.stroke();

            ctx.restore();

            // Spray
            if (openProgress >= 0.95) {
              const mistIntensity = Math.sin(scene.progress * 50) * 2;
              ctx.strokeStyle = colGreenActive;
              ctx.lineWidth = 1.0;
              ctx.setLineDash([1, 2]);
              ctx.beginPath();
              ctx.arc(0, -10, 16 + mistIntensity, -Math.PI * 0.72, -Math.PI * 0.28);
              ctx.arc(0, -10, 24 + mistIntensity, -Math.PI * 0.78, -Math.PI * 0.22);
              ctx.stroke();
              ctx.setLineDash([]);
            }

            ctx.restore();

            ctx.font = '700 8px monospace';
            if (openProgress < 0.35) {
              ctx.fillStyle = colBlueActive;
              ctx.fillText('[ACTUATING DUAL HINGE]', centerX - 55, centerY + 85);
            } else if (openProgress < 0.95) {
              ctx.fillStyle = colHighlight;
              ctx.fillText('[ORIFICE SLEEVE RELEASING]', centerX - 60, centerY + 85);
            } else {
              ctx.fillStyle = colGreenActive;
              ctx.fillText('[VALVED FLOW COMPLETED]', centerX - 55, centerY + 85);
            }
          }

          ctx.restore();
        }
      }

      // ----------------------------------------------------
      // DRAW AMBIENT VECTOR MODELS (Floating & Scattering)
      // ----------------------------------------------------
      const items = itemsRef.current;
      items.forEach((item) => {
        item.x += item.vx;
        item.y += item.vy;
        item.angle += item.spinSpeed;

        // Mouse interaction scatter physics
        if (m.x !== -1000) {
          const dx = item.x - m.x;
          const visualY = item.y - scrollRef.current * item.parallaxFactor;
          const dy = visualY - m.y;
          const dist = Math.hypot(dx, dy);
          
          if (dist < m.radius) {
            const force = (m.radius - dist) / m.radius;
            item.vx += (dx / dist) * force * 0.25;
            item.vy += (dy / dist) * force * 0.25;
            item.spinSpeed += (Math.random() - 0.5) * force * 0.005;
          }
        }

        item.vx *= 0.97;
        item.vy *= 0.97;

        if (item.x < -item.size) item.x = width + item.size;
        if (item.x > width + item.size) item.x = -item.size;
        if (item.y < -item.size) item.y = height + item.size;
        if (item.y > height + item.size) item.y = -item.size;

        const drawY = item.y - scrollRef.current * item.parallaxFactor;

        if (drawY < -item.size * 2 || drawY > height + item.size * 2) {
          return;
        }

        ctx.strokeStyle = item.colorType === 'blue' ? colBlue : colGreen;
        ctx.lineWidth = 0.9;

        ctx.save();
        ctx.translate(item.x, drawY);
        ctx.rotate(item.angle);

        // Vector Drawings
        if (item.type === 'cap') {
          const r = item.size / 2.2;
          ctx.beginPath();
          ctx.roundRect(-r, -r * 0.5, r * 2, r, r * 0.1);
          ctx.stroke();

          ctx.beginPath();
          const ribs = 6;
          for (let i = 1; i < ribs; i++) {
            const lx = -r + (i / ribs) * (r * 2);
            ctx.moveTo(lx, -r * 0.35);
            ctx.lineTo(lx, r * 0.35);
          }
          ctx.stroke();
        } 
        else if (item.type === 'spout') {
          const r = item.size / 2.3;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.moveTo(-r, 0); ctx.lineTo(r, 0);
          ctx.moveTo(0, -r); ctx.lineTo(0, r);
          ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2);
          ctx.stroke();
        } 
        else if (item.type === 'jerrycan') {
          const w = item.size * 0.75;
          const h = item.size * 1.0;
          ctx.beginPath();
          ctx.roundRect(-w/2, -h/2, w, h, w * 0.15);
          ctx.stroke();
          ctx.beginPath();
          ctx.roundRect(-w * 0.22, -h * 0.35, w * 0.44, h * 0.20, w * 0.05);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-w * 0.35, -h * 0.5);
          ctx.lineTo(-w * 0.35, -h * 0.58);
          ctx.lineTo(-w * 0.12, -h * 0.58);
          ctx.lineTo(-w * 0.12, -h * 0.5);
          ctx.stroke();
        } 
        else if (item.type === 'bottle') {
          const w = item.size * 0.6;
          const h = item.size * 1.1;
          ctx.beginPath();
          ctx.moveTo(-w / 2, h / 2);
          ctx.lineTo(w / 2, h / 2);
          ctx.lineTo(w / 2, -h * 0.12);
          ctx.quadraticCurveTo(w / 2, -h * 0.3, w * 0.25, -h * 0.32);
          ctx.lineTo(w * 0.25, -h * 0.5);
          ctx.lineTo(-w * 0.25, -h * 0.5);
          ctx.lineTo(-w * 0.25, -h * 0.32);
          ctx.quadraticCurveTo(-w / 2, -h * 0.3, -w / 2, -h * 0.12);
          ctx.closePath();
          ctx.stroke();
          
          ctx.beginPath();
          ctx.roundRect(-w * 0.28, -h * 0.60, w * 0.56, h * 0.10, 1);
          ctx.stroke();
        }

        ctx.restore();
      });

      frameIdRef.current = requestAnimationFrame(render);
    };

    frameIdRef.current = requestAnimationFrame(render);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsAnimationEnabled(false);
        if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      } else {
        setIsAnimationEnabled(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [isAnimationEnabled, resolvedTheme, currentSceneType]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-30 overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full block"
      />
    </div>
  );
}
