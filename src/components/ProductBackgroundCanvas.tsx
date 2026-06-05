'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

// Interface for floating ambient items
interface FloatingItem {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: 'cap' | 'spout' | 'jerrycan' | 'bottle';
  angle: number;
  spinSpeed: number;
  baseY: number; // for scroll parallax calculation
  parallaxFactor: number;
  colorType: 'blue' | 'green';
}

// Interface for technical CAD blueprint scene animations
interface BlueprintScene {
  type: 'capping' | 'spout' | 'fliptop';
  x: number;
  y: number;
  width: number;
  height: number;
  progress: number; // 0 to 1
  state: 'fadeIn' | 'action' | 'fadeOut';
  stateProgress: number; // local progress of current state
  duration: number; // total frames for 'action'
  label: string;
  specs: string[];
}

export function ProductBackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true);

  // Keep track of interaction states using refs to avoid re-renders
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000, radius: 180 });
  const scrollRef = useRef(0);
  const itemsRef = useRef<FloatingItem[]>([]);
  const activeSceneRef = useRef<BlueprintScene | null>(null);
  const lastTimeRef = useRef(0);
  const frameIdRef = useRef<number | null>(null);

  // Initialize background items
  const initItems = (width: number, height: number) => {
    const items: FloatingItem[] = [];
    // 8-12 floating items depending on screen size
    const count = width < 768 ? 6 : 10;
    const types: ('cap' | 'spout' | 'jerrycan' | 'bottle')[] = ['cap', 'spout', 'jerrycan', 'bottle'];
    
    for (let i = 0; i < count; i++) {
      const size = 35 + Math.random() * 45; // size of the item
      const x = Math.random() * width;
      const y = Math.random() * height;
      items.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size,
        type: types[i % types.length],
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.008,
        baseY: y,
        parallaxFactor: 0.05 + Math.random() * 0.12,
        colorType: i % 2 === 0 ? 'blue' : 'green',
      });
    }
    itemsRef.current = items;
  };

  // Generate a random blueprint scene
  const createRandomScene = (width: number, height: number): BlueprintScene => {
    const margin = 100;
    const x = margin + Math.random() * (width - margin * 2 - 180);
    const y = margin + 100 + Math.random() * (height - margin * 2 - 200);
    const sceneTypes: ('capping' | 'spout' | 'fliptop')[] = ['capping', 'spout', 'fliptop'];
    const selectedType = sceneTypes[Math.floor(Math.random() * sceneTypes.length)];

    let label = '';
    let specs: string[] = [];

    if (selectedType === 'capping') {
      label = 'CRPP CAPPING & TAMPER-EVIDENT COLLAR';
      specs = ['SIZE: 38mm', 'TORQUE: 1.8 Nm', 'LEAK-RATE: 0.00%'];
    } else if (selectedType === 'spout') {
      label = 'RETRACTABLE POURING SPOUT INS-45';
      specs = ['EXT: 42mm', 'VENT: INTEGRATED', 'FLOW-RATE: 2.2L/min'];
    } else {
      label = 'FLIP-TOP DISPENSING LID';
      specs = ['ANGLE: 110°', 'ORIFICE: 6mm', 'LOCK: PRESSURE SNAP'];
    }

    return {
      type: selectedType,
      x,
      y,
      width: 140,
      height: 160,
      progress: 0,
      state: 'fadeIn',
      stateProgress: 0,
      duration: 350, // frames for action phase
      label,
      specs
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle resizing with retina/high-DPI display adjustments
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // Re-initialize items for new screen boundaries
      if (itemsRef.current.length === 0) {
        initItems(width, height);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Mouse events tracker
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    // Scroll events tracker
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);

    // Animation Render Loop
    const render = (time: number) => {
      if (!isAnimationEnabled) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Clear canvas with transparent clear rect
      ctx.clearRect(0, 0, width, height);

      // Interpolate mouse position for smooth physics
      const m = mouseRef.current;
      if (m.targetX !== -1000) {
        m.x += (m.targetX - m.x) * 0.1;
        m.y += (m.targetY - m.y) * 0.1;
      } else {
        m.x = -1000;
        m.y = -1000;
      }

      // Check current theme colors
      const isDark = document.documentElement.classList.contains('dark') || resolvedTheme === 'dark';
      
      // SVG Colors according to current theme
      const colBlue = isDark ? 'rgba(78, 197, 241, 0.12)' : 'rgba(16, 151, 213, 0.08)';
      const colBlueActive = isDark ? 'rgba(78, 197, 241, 0.55)' : 'rgba(16, 151, 213, 0.45)';
      const colGreen = isDark ? 'rgba(165, 222, 56, 0.10)' : 'rgba(130, 185, 26, 0.08)';
      const colGreenActive = isDark ? 'rgba(165, 222, 56, 0.55)' : 'rgba(130, 185, 26, 0.45)';
      const colGrid = isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.015)';
      const colText = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(30, 45, 59, 0.20)';
      const colTextSub = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(30, 45, 59, 0.12)';
      const colHighlight = isDark ? 'rgba(245, 166, 35, 0.35)' : 'rgba(245, 166, 35, 0.30)'; // Orange Accent for warning/seal

      // Draw subtle technical graph grid lines matching CAD styling
      const drawGrid = () => {
        ctx.strokeStyle = colGrid;
        ctx.lineWidth = 1;
        const gridGap = 40;
        
        ctx.beginPath();
        for (let x = 0; x < width; x += gridGap) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
        for (let y = 0; y < height; y += gridGap) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();
      };
      
      drawGrid();

      // ----------------------------------------------------
      // Render Scene Animations
      // ----------------------------------------------------
      if (!activeSceneRef.current && Math.random() < 0.005) {
        activeSceneRef.current = createRandomScene(width, height);
      }

      const scene = activeSceneRef.current;
      if (scene) {
        // Handle fading and progression state machine
        let opacity = 0;
        const transitionSpeed = 0.02; // Fade speed

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
          }
        }

        if (opacity > 0) {
          ctx.save();
          ctx.globalAlpha = opacity;
          
          // Technical box wrapper for HUD styling
          ctx.strokeStyle = isDark ? `rgba(78, 197, 241, ${opacity * 0.12})` : `rgba(16, 151, 213, ${opacity * 0.08})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 4]);
          ctx.strokeRect(scene.x - 20, scene.y - 20, scene.width + 40, scene.height + 40);
          ctx.setLineDash([]);

          // Corner ticks for Blueprint aesthetic
          const tickSize = 10;
          const offset = 20;
          const drawCornerTicks = (x1: number, y1: number, w: number, h: number) => {
            ctx.strokeStyle = isDark ? `rgba(78, 197, 241, ${opacity * 0.35})` : `rgba(16, 151, 213, ${opacity * 0.25})`;
            ctx.lineWidth = 1;
            
            // Top-Left
            ctx.beginPath();
            ctx.moveTo(x1 - offset + tickSize, y1 - offset);
            ctx.lineTo(x1 - offset, y1 - offset);
            ctx.lineTo(x1 - offset, y1 - offset + tickSize);
            // Top-Right
            ctx.moveTo(x1 + w + offset - tickSize, y1 - offset);
            ctx.lineTo(x1 + w + offset, y1 - offset);
            ctx.lineTo(x1 + w + offset, y1 - offset + tickSize);
            // Bottom-Left
            ctx.moveTo(x1 - offset + tickSize, y1 + h + offset);
            ctx.lineTo(x1 - offset, y1 + h + offset);
            ctx.lineTo(x1 - offset, y1 + h + offset - tickSize);
            // Bottom-Right
            ctx.moveTo(x1 + w + offset - tickSize, y1 + h + offset);
            ctx.lineTo(x1 + w + offset, y1 + h + offset);
            ctx.lineTo(x1 + w + offset, y1 + h + offset - tickSize);
            
            ctx.stroke();
          };
          drawCornerTicks(scene.x, scene.y, scene.width, scene.height);

          // Technical text labels
          ctx.font = '700 9px monospace';
          ctx.fillStyle = colText;
          ctx.fillText('DIAGNOSTIC BLOCK: RUNNING', scene.x - 15, scene.y - 30);
          ctx.fillText(scene.label, scene.x - 15, scene.y + scene.height + 32);

          ctx.font = '400 8px monospace';
          ctx.fillStyle = colTextSub;
          scene.specs.forEach((spec, idx) => {
            ctx.fillText(spec, scene.x - 15, scene.y + scene.height + 45 + (idx * 10));
          });

          // Animation rendering switch
          const centerX = scene.x + scene.width / 2;
          const centerY = scene.y + scene.height / 2;

          if (scene.type === 'capping') {
            // Capping Scene (Screw Cap Locking Demonstration)
            const capYStart = centerY - 50;
            const capYEnd = centerY - 5;
            const screwProgress = Math.min(scene.progress * 1.5, 1.0); // complete capping in first 66%
            
            // Draw Bottle shoulders & Neck opening
            ctx.strokeStyle = colBlue;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            // Bottle shoulders
            ctx.moveTo(centerX - 45, centerY + 65);
            ctx.quadraticCurveTo(centerX - 35, centerY + 30, centerX - 22, centerY + 30);
            ctx.lineTo(centerX - 22, centerY - 5);
            // Opening neck lip
            ctx.lineTo(centerX + 22, centerY - 5);
            ctx.lineTo(centerX + 22, centerY + 30);
            ctx.quadraticCurveTo(centerX + 35, centerY + 30, centerX + 45, centerY + 65);
            ctx.stroke();

            // Thread lines on neck
            ctx.strokeStyle = colBlue;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(centerX - 22, centerY + 10);
            ctx.lineTo(centerX + 22, centerY + 5);
            ctx.moveTo(centerX - 22, centerY + 20);
            ctx.lineTo(centerX + 22, centerY + 15);
            ctx.stroke();

            // Render descending and spinning Cap
            const capY = capYStart + (capYEnd - capYStart) * screwProgress;
            const isScrewed = screwProgress >= 0.98;
            
            ctx.save();
            ctx.translate(centerX, capY);
            
            // Spin cap if approaching/screwing
            let spinAngle = 0;
            if (screwProgress > 0.4 && !isScrewed) {
              spinAngle = (screwProgress - 0.4) * Math.PI * 8;
            }
            
            ctx.strokeStyle = isScrewed ? colGreenActive : colBlueActive;
            ctx.lineWidth = 2;
            
            // Draw cap body (profile view)
            ctx.beginPath();
            ctx.roundRect(-24, -18, 48, 18, [3, 3, 0, 0]);
            ctx.stroke();

            // Outer grips (ribs)
            ctx.lineWidth = 1;
            const ribCount = 8;
            ctx.beginPath();
            for (let i = 0; i <= ribCount; i++) {
              const xPos = -20 + (i / ribCount) * 40 + Math.sin(spinAngle) * 2;
              if (xPos > -23 && xPos < 23) {
                ctx.moveTo(xPos, -15);
                ctx.lineTo(xPos, -2);
              }
            }
            ctx.stroke();

            // Tamper-Evident Ring below cap
            ctx.lineWidth = 1;
            ctx.strokeStyle = isScrewed ? colGreenActive : colHighlight;
            ctx.beginPath();
            ctx.roundRect(-23, 2, 46, 4, 1);
            ctx.stroke();
            
            // Connectors (bridges) linking cap to ring
            ctx.beginPath();
            ctx.moveTo(-16, 0); ctx.lineTo(-16, 2);
            ctx.moveTo(-8, 0); ctx.lineTo(-8, 2);
            ctx.moveTo(8, 0); ctx.lineTo(8, 2);
            ctx.moveTo(16, 0); ctx.lineTo(16, 2);
            ctx.stroke();

            ctx.restore();

            // Sealed visual confirmation ring
            if (isScrewed) {
              const pulse = Math.sin((scene.progress - 0.66) * Math.PI * 4) * 0.5 + 0.5;
              ctx.strokeStyle = `rgba(130, 185, 26, ${0.4 * (1 - (scene.progress - 0.66) / 0.34)})`;
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.arc(centerX, centerY - 8, 32 + pulse * 18, 0, Math.PI * 2);
              ctx.stroke();

              // Lock confirmation graphic
              ctx.strokeStyle = colGreenActive;
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.arc(centerX + 35, centerY - 15, 6, 0, Math.PI * 2);
              ctx.stroke();
              // Checkmark in lock circle
              ctx.beginPath();
              ctx.moveTo(centerX + 33, centerY - 15);
              ctx.lineTo(centerX + 35, centerY - 13);
              ctx.lineTo(centerX + 38, centerY - 17);
              ctx.stroke();

              ctx.font = '700 7px monospace';
              ctx.fillStyle = colGreenActive;
              ctx.fillText('100% SEALED', centerX + 45, centerY - 13);
            }
          } 
          else if (scene.type === 'spout') {
            // Retractable Spout Extension and Dispensing Demonstration
            const extensionProgress = Math.max(0, Math.min((scene.progress - 0.1) * 2.0, 1.0)); // extends between 10% and 60% duration
            const pourProgress = Math.max(0, Math.min((scene.progress - 0.5) * 2.0, 1.0)); // pours between 50% and 100%
            
            // Jerry Can Corner Neck Opening (45 deg angle)
            ctx.save();
            ctx.translate(centerX - 10, centerY + 30);
            
            ctx.strokeStyle = colBlue;
            ctx.lineWidth = 1.5;
            
            // Jerry Can Outline
            ctx.beginPath();
            ctx.moveTo(-45, 30);
            ctx.lineTo(-45, -15);
            ctx.quadraticCurveTo(-45, -30, -30, -30);
            ctx.lineTo(-10, -30); // neck landing
            ctx.lineTo(-4, -18); // neck base
            ctx.stroke();

            // Drawing the Neck
            ctx.save();
            ctx.translate(0, -10);
            ctx.rotate(-Math.PI / 6); // 30 deg rotation representing angled jerrycan spout

            // Neck rim
            ctx.strokeStyle = colBlue;
            ctx.strokeRect(-18, -4, 36, 8);

            // Spout sliding out
            const spoutHeight = 35;
            const currentSpoutExtend = extensionProgress * spoutHeight;
            
            ctx.strokeStyle = colBlueActive;
            ctx.lineWidth = 1.5;
            
            // Draw retractable sleeve body
            ctx.beginPath();
            ctx.rect(-14, -currentSpoutExtend - 4, 28, currentSpoutExtend);
            ctx.stroke();

            // Pull tab loop on top of spout
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, -currentSpoutExtend - 8, 4, 0, Math.PI * 2);
            ctx.stroke();

            // Bellow ridges (ribs of the extensible spout)
            if (currentSpoutExtend > 10) {
              ctx.strokeStyle = colBlue;
              ctx.lineWidth = 1;
              const ridges = Math.floor(currentSpoutExtend / 5);
              ctx.beginPath();
              for (let i = 1; i < ridges; i++) {
                const yRidge = -4 - (i * 5);
                ctx.moveTo(-14, yRidge);
                ctx.lineTo(14, yRidge);
              }
              ctx.stroke();
            }

            // Dripping nozzle logic (when fully extended, start pouring)
            if (extensionProgress >= 0.95 && pourProgress > 0) {
              const dripY = -spoutHeight - 12;
              
              // Liquid path
              ctx.strokeStyle = colGreenActive;
              ctx.lineWidth = 1;
              ctx.setLineDash([2, 2]);
              ctx.beginPath();
              ctx.moveTo(0, dripY);
              ctx.quadraticCurveTo(20, dripY - 5, 35, dripY + 40 + pourProgress * 40);
              ctx.stroke();
              ctx.setLineDash([]);

              // Falling Drop
              const dropProgress = (pourProgress * 4) % 1.0;
              const dropY = dripY + 5 + dropProgress * 65;
              const dropX = (dropY - dripY) * 0.45; // slight curve drift
              
              ctx.fillStyle = colGreenActive;
              ctx.beginPath();
              ctx.arc(dropX, dropY, 2.5, 0, Math.PI * 2);
              ctx.fill();
              
              // Spreading seal confirmation text
              ctx.font = '700 7px monospace';
              ctx.fillStyle = colGreenActive;
              ctx.fillText('DISPENSING FLOW', 15, dripY + 15);
            }
            
            ctx.restore();
            ctx.restore();
          } 
          else if (scene.type === 'fliptop') {
            // Flip-Top Cap Swings Open
            const openProgress = Math.max(0, Math.min((scene.progress - 0.15) * 2.2, 1.0)); // flip open between 15% and 60%
            
            ctx.save();
            ctx.translate(centerX, centerY + 15);

            // Container neck
            ctx.strokeStyle = colBlue;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-30, 45);
            ctx.lineTo(-24, 15);
            ctx.lineTo(24, 15);
            ctx.lineTo(30, 45);
            ctx.stroke();

            // Flip-top base cap body
            ctx.strokeStyle = colBlueActive;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(-25, -5, 50, 20, 2);
            ctx.stroke();

            // Dispensing orifice (middle nozzle)
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.rect(-6, -10, 12, 5);
            ctx.stroke();
            
            // Hinge point (right side)
            ctx.fillStyle = colHighlight;
            ctx.beginPath();
            ctx.arc(24, -2, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Opening Lid (rotates around hinge point [24, -2])
            ctx.save();
            ctx.translate(24, -2);
            ctx.rotate(-openProgress * Math.PI * 0.65); // Rotates up to ~117 degrees
            
            ctx.strokeStyle = colBlueActive;
            ctx.lineWidth = 2;
            // Draw flip cover lid
            ctx.beginPath();
            ctx.roundRect(-48, -4, 48, 6, 1);
            ctx.stroke();

            // Plug insert that fits in orifice
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.rect(-30, 2, 4, 3);
            ctx.stroke();

            ctx.restore();

            // Dispensing mist particles if open
            if (openProgress >= 0.9) {
              const pulse = Math.sin(scene.progress * 45) * 2;
              ctx.strokeStyle = colGreenActive;
              ctx.lineWidth = 1;
              ctx.setLineDash([1, 3]);
              
              // Spray arcs
              ctx.beginPath();
              ctx.arc(0, -10, 18 + pulse, -Math.PI * 0.7, -Math.PI * 0.3);
              ctx.arc(0, -10, 28 + pulse, -Math.PI * 0.75, -Math.PI * 0.25);
              ctx.stroke();
              ctx.setLineDash([]);

              ctx.font = '700 7px monospace';
              ctx.fillStyle = colGreenActive;
              ctx.fillText('SNAP-LOCK VENT', -50, -25);
            }
            
            ctx.restore();
          }

          ctx.restore();
        }
      }

      // ----------------------------------------------------
      // Render and Update Ambient Floating Items
      // ----------------------------------------------------
      const items = itemsRef.current;
      items.forEach((item) => {
        // Drift Physics
        item.x += item.vx;
        item.y += item.vy;
        item.angle += item.spinSpeed;

        // Mouse avoidance (attraction/scatter effect)
        if (m.x !== -1000) {
          const dx = item.x - m.x;
          // Calculate visual y position accounting for scroll parallax
          const visualY = item.y - scrollRef.current * item.parallaxFactor;
          const dy = visualY - m.y;
          const dist = Math.hypot(dx, dy);
          
          if (dist < m.radius) {
            const force = (m.radius - dist) / m.radius;
            // Push away
            item.vx += (dx / dist) * force * 0.22;
            item.vy += (dy / dist) * force * 0.22;
            // Add a little spin
            item.spinSpeed += (Math.random() - 0.5) * force * 0.005;
          }
        }

        // Apply friction/drag to velocities to keep motion soft
        item.vx *= 0.98;
        item.vy *= 0.98;

        // Speed limit
        const speed = Math.hypot(item.vx, item.vy);
        const maxSpeed = 1.8;
        if (speed > maxSpeed) {
          item.vx = (item.vx / speed) * maxSpeed;
          item.vy = (item.vy / speed) * maxSpeed;
        }

        // Handle screen wrap boundaries
        if (item.x < -item.size) item.x = width + item.size;
        if (item.x > width + item.size) item.x = -item.size;
        if (item.y < -item.size) item.y = height + item.size;
        if (item.y > height + item.size) item.y = -item.size;

        // Visual coordinates accounting for page scroll parallax factor
        const drawY = item.y - scrollRef.current * item.parallaxFactor;

        // Skip rendering if item is scrolled off-screen
        if (drawY < -item.size * 2 || drawY > height + item.size * 2) {
          return;
        }

        // Choose drawing theme color
        ctx.strokeStyle = item.colorType === 'blue' ? colBlue : colGreen;
        ctx.lineWidth = 1.0;

        ctx.save();
        ctx.translate(item.x, drawY);
        ctx.rotate(item.angle);

        // Draw the specific vector shape
        if (item.type === 'cap') {
          // Ambient Screw Cap Shape
          const radius = item.size / 2;
          ctx.beginPath();
          ctx.roundRect(-radius, -radius * 0.5, radius * 2, radius * 1.0, radius * 0.1);
          ctx.stroke();

          // Gripping rib details
          ctx.beginPath();
          const rLines = 5;
          for (let i = 1; i < rLines; i++) {
            const lx = -radius + (i / rLines) * (radius * 2);
            ctx.moveTo(lx, -radius * 0.35);
            ctx.lineTo(lx, radius * 0.35);
          }
          ctx.stroke();
        } 
        else if (item.type === 'spout') {
          // Ambient Pull-Spout Outline
          const r = item.size / 2.2;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.moveTo(-r * 0.7, 0);
          ctx.lineTo(r * 0.7, 0);
          ctx.moveTo(0, -r * 0.7);
          ctx.lineTo(0, r * 0.7);
          ctx.stroke();
          // Inner concentric sleeve rings
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
          ctx.stroke();
        } 
        else if (item.type === 'jerrycan') {
          // Ambient Jerry Can Profile
          const w = item.size * 0.8;
          const h = item.size * 1.1;
          ctx.beginPath();
          ctx.roundRect(-w / 2, -h / 2, w, h, w * 0.15);
          ctx.stroke();
          // Embossed handle shape inner cutout
          ctx.beginPath();
          ctx.roundRect(-w * 0.22, -h * 0.35, w * 0.44, h * 0.22, w * 0.05);
          ctx.stroke();
          // Top neck
          ctx.beginPath();
          ctx.moveTo(-w * 0.35, -h * 0.5);
          ctx.lineTo(-w * 0.35, -h * 0.58);
          ctx.lineTo(-w * 0.12, -h * 0.58);
          ctx.lineTo(-w * 0.12, -h * 0.5);
          ctx.stroke();
        } 
        else if (item.type === 'bottle') {
          // Ambient Round Bottle Outline
          const w = item.size * 0.65;
          const h = item.size * 1.2;
          ctx.beginPath();
          // Draw bottom body
          ctx.moveTo(-w / 2, h / 2);
          ctx.lineTo(w / 2, h / 2);
          ctx.lineTo(w / 2, -h * 0.15);
          // Shoulder taper
          ctx.quadraticCurveTo(w / 2, -h * 0.3, w * 0.28, -h * 0.32);
          ctx.lineTo(w * 0.28, -h * 0.5); // neck
          ctx.lineTo(-w * 0.28, -h * 0.5);
          ctx.lineTo(-w * 0.28, -h * 0.32);
          ctx.quadraticCurveTo(-w / 2, -h * 0.3, -w / 2, -h * 0.15);
          ctx.closePath();
          ctx.stroke();

          // Cap on bottle
          ctx.strokeStyle = item.colorType === 'blue' ? colBlue : colGreen;
          ctx.beginPath();
          ctx.roundRect(-w * 0.31, -h * 0.62, w * 0.62, h * 0.12, 1);
          ctx.stroke();
        }

        ctx.restore();
      });

      // Request next frame
      frameIdRef.current = requestAnimationFrame(render);
    };

    // Begin looping
    frameIdRef.current = requestAnimationFrame(render);

    // Page Visibility API handler to pause when tab is inactive
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
  }, [isAnimationEnabled, resolvedTheme]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-30 overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full block"
      />
    </div>
  );
}
