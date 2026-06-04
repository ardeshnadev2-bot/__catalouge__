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
  width: number;
  height: number;
  progress: number;
  state: 'fadeIn' | 'action' | 'fadeOut';
  stateProgress: number;
  duration: number;
  label: string;
  specs: string[];
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
  
  // Track button dimensions for background click interactivity
  const dashboardButtonsRef = useRef<{ id: string; x: number; y: number; w: number; h: number }[]>([]);

  // Initialize floating items
  const initItems = (width: number, height: number) => {
    const items: FloatingItem[] = [];
    const count = width < 768 ? 8 : 12; // More items for fuller background representation
    const types: ('cap' | 'spout' | 'jerrycan' | 'bottle')[] = ['cap', 'spout', 'jerrycan', 'bottle'];
    
    for (let i = 0; i < count; i++) {
      const size = 40 + Math.random() * 50;
      const x = Math.random() * width;
      const y = Math.random() * height;
      items.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size,
        type: types[i % types.length],
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.006,
        baseY: y,
        parallaxFactor: 0.04 + Math.random() * 0.1,
        colorType: i % 2 === 0 ? 'blue' : 'green',
      });
    }
    itemsRef.current = items;
  };

  // Helper to create specific scene types
  const createScene = (type: 'capping' | 'spout' | 'fliptop', width: number, height: number): BlueprintScene => {
    // Position it slightly off-center to ensure it doesn't get covered by center content on desktop
    const x = width > 1024 ? width * 0.68 : width * 0.5 - 90;
    const y = height * 0.35;

    let label = '';
    let specs: string[] = [];

    if (type === 'capping') {
      label = 'ENGINEERING DIAGRAM: SCREW-CAP SEALLING';
      specs = [
        'MODEL: SC-38B CONTINUOUS THREAD',
        'THREAD: SINGLE START (3mm PITCH)',
        'SEAL TYPE: COMPRESSION WAD',
        'BAND: TAMPER-EVIDENT PULL-LOCK',
        'TARGET TORQUE: 1.8 - 2.2 Nm'
      ];
    } else if (type === 'spout') {
      label = 'ENGINEERING DIAGRAM: PULL-OUT SPOUT';
      specs = [
        'MODEL: TS-45 TELESCOPIC INSERT',
        'EXTENSION HEIGHT: 45.0 mm',
        'VALVE: ANTI-GLUG VENTILATED',
        'APPLICATION: EDIBLE OIL & CHEMICALS',
        'MATERIAL: FOOD-GRADE LLDPE'
      ];
    } else {
      label = 'ENGINEERING DIAGRAM: FLIP-TOP DISPENSER';
      specs = [
        'MODEL: FT-24 DISPENSING LID',
        'HINGE SYSTEM: ACTIVE SNAP DUAL-AXIS',
        'ORIFICE: ø 6.3 mm LEAK-PROOF',
        'CLOSE METHOD: PRESS-TO-CLICK LOCK',
        'MATERIAL: STIFF-FLOW PP COPOLYMER'
      ];
    }

    return {
      type,
      x,
      y,
      width: 180,
      height: 200,
      progress: 0,
      state: 'fadeIn',
      stateProgress: 0,
      duration: 400, // Long active display to allow reading
      label,
      specs
    };
  };

  // Scene switcher trigger
  const triggerScene = (type: 'capping' | 'spout' | 'fliptop') => {
    setCurrentSceneType(type);
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    if (activeSceneRef.current) {
      activeSceneRef.current.state = 'fadeOut';
      activeSceneRef.current.stateProgress = 0;
      
      // Spawn new one shortly after fadeout
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
      
      // Auto-trigger initial scene if none active
      if (!activeSceneRef.current) {
        activeSceneRef.current = createScene(currentSceneType, width, height);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      
      // Check if mouse is hovering over interactive HUD buttons
      const canvasRect = canvas.getBoundingClientRect();
      const clickX = e.clientX - canvasRect.left;
      const clickY = e.clientY - canvasRect.top;
      
      let cursorStyle = 'default';
      dashboardButtonsRef.current.forEach((btn) => {
        if (clickX >= btn.x && clickX <= btn.x + btn.w && clickY >= btn.y && clickY <= btn.y + btn.h) {
          cursorStyle = 'pointer';
        }
      });
      canvas.style.cursor = cursorStyle;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    const handleMouseClick = (e: MouseEvent) => {
      const canvasRect = canvas.getBoundingClientRect();
      const clickX = e.clientX - canvasRect.left;
      const clickY = e.clientY - canvasRect.top;

      dashboardButtonsRef.current.forEach((btn) => {
        if (clickX >= btn.x && clickX <= btn.x + btn.w && clickY >= btn.y && clickY <= btn.y + btn.h) {
          triggerScene(btn.id as 'capping' | 'spout' | 'fliptop');
        }
      });
    };

    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleMouseClick);
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
      
      // STYLING SPECIFICATIONS FOR FLAT WHITE BACKGROUND (Higher visibility values)
      const colBlue = isDark ? 'rgba(78, 197, 241, 0.16)' : 'rgba(16, 151, 213, 0.12)';
      const colBlueActive = isDark ? 'rgba(78, 197, 241, 0.70)' : 'rgba(16, 151, 213, 0.65)';
      const colGreen = isDark ? 'rgba(165, 222, 56, 0.14)' : 'rgba(130, 185, 26, 0.12)';
      const colGreenActive = isDark ? 'rgba(165, 222, 56, 0.70)' : 'rgba(130, 185, 26, 0.65)';
      const colGrid = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(16, 151, 213, 0.025)';
      const colText = isDark ? 'rgba(255, 255, 255, 0.40)' : 'rgba(30, 45, 59, 0.40)';
      const colTextSub = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(30, 45, 59, 0.25)';
      const colHighlight = 'rgba(245, 166, 35, 0.60)'; // Rich Amber for dimensions/arrows

      // Technical Grid
      const drawGrid = () => {
        ctx.strokeStyle = colGrid;
        ctx.lineWidth = 1;
        const gridGap = 50;
        
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
      // DRAW PERSISTENT TECHNICAL DIRECTORY (SIDEBAR TAB)
      // ----------------------------------------------------
      const drawTechnicalHUD = () => {
        const xPos = width > 1024 ? 30 : 15;
        const yPos = 120;
        const panelWidth = 200;

        ctx.save();
        // Technical title header
        ctx.font = '700 9px monospace';
        ctx.fillStyle = colText;
        ctx.fillText('PRODUCT SPECIFICATIONS DIRECTORY', xPos, yPos);
        ctx.strokeStyle = colBlue;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(xPos, yPos + 6);
        ctx.lineTo(xPos + panelWidth, yPos + 6);
        ctx.stroke();

        // Register interactive regions for button tabs
        const btnH = 26;
        const buttons = [
          { id: 'capping', label: '1. THREADED CLOSURES (CAPPING)', desc: 'Continuous threads & seals' },
          { id: 'spout', label: '2. RETRACTABLE POUR SPOUTS', desc: 'Jerrycan dispensing sleeves' },
          { id: 'fliptop', label: '3. SNAP FLIP-TOP DISPENSERS', desc: 'Active hinge lid structures' }
        ];

        dashboardButtonsRef.current = []; // clear old coordinates

        buttons.forEach((btn, index) => {
          const btnY = yPos + 18 + index * (btnH + 12);
          const isCurrent = currentSceneType === btn.id;

          // Border outlines
          ctx.strokeStyle = isCurrent ? colBlueActive : colBlue;
          ctx.lineWidth = isCurrent ? 1.5 : 1;
          ctx.strokeRect(xPos, btnY, panelWidth, btnH);

          // If active theme highlight
          if (isCurrent) {
            ctx.fillStyle = isDark ? 'rgba(78, 197, 241, 0.05)' : 'rgba(16, 151, 213, 0.03)';
            ctx.fillRect(xPos, btnY, panelWidth, btnH);
            
            // Neon vertical status line
            ctx.fillStyle = colBlueActive;
            ctx.fillRect(xPos, btnY, 4, btnH);
          }

          // Labels
          ctx.font = '700 9px monospace';
          ctx.fillStyle = isCurrent ? colBlueActive : colText;
          ctx.fillText(btn.label, xPos + 10, btnY + 11);

          ctx.font = '400 8px monospace';
          ctx.fillStyle = colTextSub;
          ctx.fillText(btn.desc, xPos + 10, btnY + 20);

          // Store button coordinates for click listener
          dashboardButtonsRef.current.push({
            id: btn.id,
            x: xPos,
            y: btnY,
            w: panelWidth,
            h: btnH
          });
        });

        // Instructions
        ctx.font = '400 8px monospace';
        ctx.fillStyle = colTextSub;
        ctx.fillText('* CLICK TABS ABOVE TO INPSECT MECHANICAL DIAGRAMS *', xPos, yPos + 140);
        
        ctx.restore();
      };
      
      drawTechnicalHUD();

      // ----------------------------------------------------
      // DRAW ACTIVE SCENE DIAGRAM
      // ----------------------------------------------------
      const scene = activeSceneRef.current;
      if (scene) {
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
            // Loop scenes continuously
            const order: ('capping' | 'spout' | 'fliptop')[] = ['capping', 'spout', 'fliptop'];
            const nextIdx = (order.indexOf(currentSceneType) + 1) % order.length;
            triggerScene(order[nextIdx]);
          }
        }

        if (opacity > 0) {
          ctx.save();
          ctx.globalAlpha = opacity;
          
          // Technical grid blueprint wrapper box
          ctx.strokeStyle = isDark ? `rgba(78, 197, 241, ${opacity * 0.18})` : `rgba(16, 151, 213, ${opacity * 0.15})`;
          ctx.lineWidth = 1.2;
          ctx.setLineDash([3, 5]);
          ctx.strokeRect(scene.x - 30, scene.y - 30, scene.width + 60, scene.height + 60);
          ctx.setLineDash([]);

          // Dimension lines / grid details (looks like drafting paper)
          ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(scene.x - 30, scene.y + scene.height/2);
          ctx.lineTo(scene.x + scene.width + 30, scene.y + scene.height/2);
          ctx.moveTo(scene.x + scene.width/2, scene.y - 30);
          ctx.lineTo(scene.x + scene.width/2, scene.y + scene.height + 30);
          ctx.stroke();

          // Title & Meta info labels
          ctx.font = '700 10px monospace';
          ctx.fillStyle = colBlueActive;
          ctx.fillText(scene.label, scene.x - 20, scene.y - 45);
          
          ctx.font = '700 8px monospace';
          ctx.fillStyle = colHighlight;
          ctx.fillText('DIAGRAM ACTIVE [RUNNING MODE]', scene.x - 20, scene.y - 57);

          // Render specifications sidebar text
          ctx.font = '400 9px monospace';
          ctx.fillStyle = colText;
          scene.specs.forEach((spec, idx) => {
            ctx.fillText(`▪ ${spec}`, scene.x + scene.width + 50, scene.y + 10 + (idx * 16));
          });

          // Draw a mini coordinate list
          ctx.font = '400 7px monospace';
          ctx.fillStyle = colTextSub;
          ctx.fillText(`X-REF: ${(scene.x).toFixed(1)}px`, scene.x - 20, scene.y + scene.height + 42);
          ctx.fillText(`Y-REF: ${(scene.y).toFixed(1)}px`, scene.x + 60, scene.y + scene.height + 42);
          ctx.fillText('SYS STABILITY: LEAK-TEST CERTIFIED', scene.x - 20, scene.y + scene.height + 54);

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

            // DRAW BOTTLE NECK CROSS-SECTION
            ctx.strokeStyle = colBlue;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(centerX - 50, centerY + 80);
            ctx.quadraticCurveTo(centerX - 40, centerY + 45, centerX - 25, centerY + 45);
            ctx.lineTo(centerX - 25, centerY - 5);
            ctx.lineTo(centerX + 25, centerY - 5);
            ctx.lineTo(centerX + 25, centerY + 45);
            ctx.quadraticCurveTo(centerX + 40, centerY + 45, centerX + 50, centerY + 80);
            ctx.stroke();

            // Thread profiles detail on bottle neck (outer bumps)
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(centerX - 25, centerY + 10, 2, -Math.PI/2, Math.PI/2);
            ctx.arc(centerX - 25, centerY + 24, 2, -Math.PI/2, Math.PI/2);
            ctx.arc(centerX + 25, centerY + 17, 2, Math.PI/2, -Math.PI/2);
            ctx.stroke();

            // Capping stages
            const capY = capYStart + (capYEnd - capYStart) * screwProgress;
            
            // DRAW CAP DETAILS
            ctx.save();
            ctx.translate(centerX, capY);
            
            let spinAngle = 0;
            if (screwProgress > 0.3 && !isScrewed) {
              spinAngle = (screwProgress - 0.3) * Math.PI * 10;
            }

            ctx.strokeStyle = isScrewed ? colGreenActive : colBlueActive;
            ctx.lineWidth = 2.0;

            // Cap cylinder outline
            ctx.beginPath();
            ctx.roundRect(-28, -22, 56, 22, [4, 4, 0, 0]);
            ctx.stroke();

            // Internal thread sketches (hidden blueprint style)
            ctx.strokeStyle = isDark ? 'rgba(78, 197, 241, 0.25)' : 'rgba(16, 151, 213, 0.25)';
            ctx.lineWidth = 1.0;
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.moveTo(-25, -15); ctx.lineTo(-21, -12);
            ctx.moveTo(-25, -7); ctx.lineTo(-21, -4);
            ctx.moveTo(25, -11); ctx.lineTo(21, -8);
            ctx.stroke();
            ctx.setLineDash([]);

            // Rib details (cap grip ridges)
            ctx.strokeStyle = isScrewed ? colGreenActive : colBlueActive;
            ctx.lineWidth = 1.2;
            const ribCount = 10;
            ctx.beginPath();
            for (let i = 0; i <= ribCount; i++) {
              const rx = -23 + (i / ribCount) * 46 + Math.sin(spinAngle) * 2;
              if (rx > -26 && rx < 26) {
                ctx.moveTo(rx, -18);
                ctx.lineTo(rx, -3);
              }
            }
            ctx.stroke();

            // Sealing Liner / Wad Inside the cap (crucial business concept)
            ctx.strokeStyle = colHighlight;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-27, -2);
            ctx.lineTo(27, -2);
            ctx.stroke();

            // Tamper-evident band
            ctx.strokeStyle = isScrewed ? colGreenActive : colHighlight;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.roundRect(-27, 3, 54, 5, 1);
            ctx.stroke();

            // Small bridge connectors
            ctx.beginPath();
            ctx.moveTo(-20, 0); ctx.lineTo(-20, 3);
            ctx.moveTo(-10, 0); ctx.lineTo(-10, 3);
            ctx.moveTo(10, 0); ctx.lineTo(10, 3);
            ctx.moveTo(20, 0); ctx.lineTo(20, 3);
            ctx.stroke();

            ctx.restore();

            // DIMENSION ARROWS & LABELS FOR BUSINESS COMPREHENSION
            ctx.strokeStyle = colHighlight;
            ctx.lineWidth = 1.0;
            
            // Width Dimension line
            ctx.beginPath();
            ctx.moveTo(centerX - 28, centerY - 72);
            ctx.lineTo(centerX + 28, centerY - 72);
            ctx.moveTo(centerX - 28, centerY - 69); ctx.lineTo(centerX - 28, centerY - 75);
            ctx.moveTo(centerX + 28, centerY - 69); ctx.lineTo(centerX + 28, centerY - 75);
            ctx.stroke();
            
            ctx.font = '500 7px monospace';
            ctx.fillStyle = colHighlight;
            ctx.fillText('WIDTH: ø 38.0mm', centerX - 25, centerY - 77);

            // Step status label drawing
            ctx.font = '700 8px monospace';
            if (screwProgress < 0.35) {
              ctx.fillStyle = colBlueActive;
              ctx.fillText('[STEP 1/3] POSITIONING: ALIGN CLOSURE', centerX - 60, centerY + 98);
            } else if (screwProgress < 0.98) {
              ctx.fillStyle = colHighlight;
              ctx.fillText('[STEP 2/3] TORQUING: ENGAGING COLLAR THREADS', centerX - 70, centerY + 98);
            } else {
              ctx.fillStyle = colGreenActive;
              ctx.fillText('[STEP 3/3] LOCKING: WAD COMPRESSION & LEAK-PROOF SEALED', centerX - 95, centerY + 98);
              
              // Pulsing lock ring
              const flash = Math.sin((scene.progress - 0.7) * 30) * 0.5 + 0.5;
              ctx.strokeStyle = `rgba(130, 185, 26, ${0.5 * (1 - (scene.progress - 0.7) / 0.3)})`;
              ctx.lineWidth = 2.0;
              ctx.beginPath();
              ctx.arc(centerX, centerY + 10, 45 + flash * 20, 0, Math.PI * 2);
              ctx.stroke();
              
              // Business highlight text
              ctx.font = '700 9px monospace';
              ctx.fillStyle = colGreenActive;
              ctx.fillText('✓ TAMPER-EVIDENT BAND SECURED', centerX - 55, centerY - 88);
            }

          } 
          else if (scene.type === 'spout') {
            const extensionProgress = Math.max(0, Math.min((scene.progress - 0.1) * 2.0, 1.0));
            const pourProgress = Math.max(0, Math.min((scene.progress - 0.5) * 2.0, 1.0));
            
            // JERRYCAN CORNER DRAWING
            ctx.save();
            ctx.translate(centerX - 15, centerY + 40);
            ctx.rotate(-Math.PI / 6); // 30 deg tilted pour profile

            ctx.strokeStyle = colBlue;
            ctx.lineWidth = 1.5;
            
            // Can lip opening
            ctx.strokeRect(-22, -6, 44, 12);
            // Can top body shoulders
            ctx.beginPath();
            ctx.moveTo(-22, 6);
            ctx.lineTo(-45, 6);
            ctx.lineTo(-45, 75);
            ctx.moveTo(22, 6);
            ctx.lineTo(40, 6);
            ctx.stroke();

            // EXTENSIBLE TELESCOPIC SPOUT (Range A Product representation)
            const maxExtend = 50;
            const currentExtend = extensionProgress * maxExtend;

            ctx.strokeStyle = colBlueActive;
            ctx.lineWidth = 2.0;

            // Sleeves of the telescopic spout sliding out
            ctx.beginPath();
            ctx.rect(-18, -currentExtend - 6, 36, currentExtend);
            ctx.stroke();

            // Pull loop
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, -currentExtend - 12, 6, 0, Math.PI * 2);
            ctx.stroke();

            // Inner spout flexible ribs (Bellows)
            if (currentExtend > 10) {
              ctx.strokeStyle = colBlue;
              ctx.lineWidth = 1.0;
              const ribSpacing = 6;
              const ribsCount = Math.floor(currentExtend / ribSpacing);
              ctx.beginPath();
              for (let i = 1; i < ribsCount; i++) {
                const ry = -6 - (i * ribSpacing);
                ctx.moveTo(-17, ry);
                ctx.lineTo(17, ry);
              }
              ctx.stroke();
            }

            // Dripping / pouring fluid stream
            if (extensionProgress >= 0.95 && pourProgress > 0) {
              const dripY = -maxExtend - 18;
              
              // Fluid outline path
              ctx.strokeStyle = colGreenActive;
              ctx.lineWidth = 1.5;
              ctx.setLineDash([3, 3]);
              ctx.beginPath();
              ctx.moveTo(0, dripY);
              ctx.quadraticCurveTo(25, dripY - 5, 45, dripY + 60 + pourProgress * 55);
              ctx.stroke();
              ctx.setLineDash([]);

              // Forming/falling droplets
              const dropOffset = (pourProgress * 3.5) % 1.0;
              const dropY = dripY + 5 + dropOffset * 80;
              const dropX = (dropY - dripY) * 0.40;

              ctx.fillStyle = colGreenActive;
              ctx.beginPath();
              ctx.arc(dropX, dropY, 3, 0, Math.PI * 2);
              ctx.fill();
            }

            ctx.restore();

            // Dimensions and step labels
            ctx.strokeStyle = colHighlight;
            ctx.lineWidth = 1.0;

            // Height dimension arrow
            ctx.beginPath();
            ctx.moveTo(centerX + 35, centerY + 30);
            ctx.lineTo(centerX + 35, centerY - 20);
            ctx.moveTo(centerX + 32, centerY + 30); ctx.lineTo(centerX + 38, centerY + 30);
            ctx.moveTo(centerX + 32, centerY - 20); ctx.lineTo(centerX + 38, centerY - 20);
            ctx.stroke();

            ctx.font = '500 7px monospace';
            ctx.fillStyle = colHighlight;
            ctx.fillText('EXT: 45.0mm', centerX + 42, centerY + 8);

            // Step text
            ctx.font = '700 8px monospace';
            if (extensionProgress < 0.35) {
              ctx.fillStyle = colBlueActive;
              ctx.fillText('[STEP 1/3] TELESCOPIC ACTION: PULLING LOOP', centerX - 80, centerY + 98);
            } else if (extensionProgress < 0.98) {
              ctx.fillStyle = colHighlight;
              ctx.fillText('[STEP 2/3] EXTENDING: SLEEVE COLLAPSE UNLOCK', centerX - 80, centerY + 98);
            } else {
              ctx.fillStyle = colGreenActive;
              ctx.fillText('[STEP 3/3] DISPENSING: CLEAN POUR, DRIP-FREE', centerX - 80, centerY + 98);

              ctx.font = '700 9px monospace';
              ctx.fillStyle = colGreenActive;
              ctx.fillText('✓ INTEGRATED AIR-VENT ACTION', centerX - 60, centerY - 88);
            }
          } 
          else if (scene.type === 'fliptop') {
            const openProgress = Math.max(0, Math.min((scene.progress - 0.15) * 2.5, 1.0));
            
            // FLIP TOP PROFILE
            ctx.save();
            ctx.translate(centerX, centerY + 25);

            // Container neck shoulders
            ctx.strokeStyle = colBlue;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-32, 50);
            ctx.lineTo(-25, 20);
            ctx.lineTo(25, 20);
            ctx.lineTo(32, 50);
            ctx.stroke();

            // Flip top main cap body
            ctx.strokeStyle = colBlueActive;
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.roundRect(-26, -5, 52, 25, 3);
            ctx.stroke();

            // Internal Orifice structure
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.rect(-7, -12, 14, 7);
            ctx.stroke();
            // Hole details
            ctx.beginPath();
            ctx.moveTo(-3, -12); ctx.lineTo(-3, -5);
            ctx.moveTo(3, -12); ctx.lineTo(3, -5);
            ctx.stroke();

            // Hinge joint
            ctx.fillStyle = colHighlight;
            ctx.beginPath();
            ctx.arc(23, -2, 3, 0, Math.PI * 2);
            ctx.fill();

            // Rotatable lid hinging from [23, -2]
            ctx.save();
            ctx.translate(23, -2);
            ctx.rotate(-openProgress * Math.PI * 0.62); // Rotates up to 110 deg
            
            ctx.strokeStyle = colBlueActive;
            ctx.lineWidth = 2.0;
            // Lid drawing
            ctx.beginPath();
            ctx.roundRect(-50, -4, 50, 7, 2);
            ctx.stroke();

            // Spigot lock insertion
            ctx.beginPath();
            ctx.rect(-30, 3, 5, 4);
            ctx.stroke();

            ctx.restore();

            // Spray fluid path representation
            if (openProgress >= 0.95) {
              const mistIntensity = Math.sin(scene.progress * 50) * 3;
              ctx.strokeStyle = colGreenActive;
              ctx.lineWidth = 1.2;
              ctx.setLineDash([2, 3]);
              
              ctx.beginPath();
              ctx.arc(0, -12, 20 + mistIntensity, -Math.PI * 0.72, -Math.PI * 0.28);
              ctx.arc(0, -12, 30 + mistIntensity, -Math.PI * 0.78, -Math.PI * 0.22);
              ctx.stroke();
              ctx.setLineDash([]);
            }

            ctx.restore();

            // Dimensions / annotations
            ctx.strokeStyle = colHighlight;
            ctx.lineWidth = 1.0;
            
            // Hinge arc guide
            ctx.beginPath();
            ctx.arc(centerX + 23, centerY + 23, 20, 0, -Math.PI * 0.6, true);
            ctx.stroke();

            ctx.font = '500 7px monospace';
            ctx.fillStyle = colHighlight;
            ctx.fillText('ROTATION: 110°', centerX + 18, centerY - 5);

            ctx.font = '700 8px monospace';
            if (openProgress < 0.35) {
              ctx.fillStyle = colBlueActive;
              ctx.fillText('[STEP 1/3] SNAP ACTUATOR: OPENING LID HINGE', centerX - 85, centerY + 98);
            } else if (openProgress < 0.95) {
              ctx.fillStyle = colHighlight;
              ctx.fillText('[STEP 2/3] RETRACTION: PIN COLLAR RELEASES LOCK', centerX - 85, centerY + 98);
            } else {
              ctx.fillStyle = colGreenActive;
              ctx.fillText('[STEP 3/3] ACTIVE POUR: CONTROLLED DISPENSING ORIFICE', centerX - 95, centerY + 98);

              ctx.font = '700 9px monospace';
              ctx.fillStyle = colGreenActive;
              ctx.fillText('✓ SNAP-CLICK SECURITY SYSTEM', centerX - 60, centerY - 88);
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
            // Push item away
            item.vx += (dx / dist) * force * 0.3;
            item.vy += (dy / dist) * force * 0.3;
            item.spinSpeed += (Math.random() - 0.5) * force * 0.008;
          }
        }

        item.vx *= 0.97;
        item.vy *= 0.97;

        // Screen boundary wrap
        if (item.x < -item.size) item.x = width + item.size;
        if (item.x > width + item.size) item.x = -item.size;
        if (item.y < -item.size) item.y = height + item.size;
        if (item.y > height + item.size) item.y = -item.size;

        const drawY = item.y - scrollRef.current * item.parallaxFactor;

        // Render clip check
        if (drawY < -item.size * 2 || drawY > height + item.size * 2) {
          return;
        }

        ctx.strokeStyle = item.colorType === 'blue' ? colBlue : colGreen;
        ctx.lineWidth = 1.0;

        ctx.save();
        ctx.translate(item.x, drawY);
        ctx.rotate(item.angle);

        // Vector Drawings
        if (item.type === 'cap') {
          // CAP
          const r = item.size / 2.2;
          ctx.beginPath();
          ctx.roundRect(-r, -r * 0.5, r * 2, r, r * 0.1);
          ctx.stroke();

          ctx.beginPath();
          const ribs = 6;
          for (let i = 1; i < ribs; i++) {
            const lx = -r + (i / ribs) * (r * 2);
            ctx.moveTo(lx, -r * 0.38);
            ctx.lineTo(lx, r * 0.38);
          }
          ctx.stroke();
        } 
        else if (item.type === 'spout') {
          // SPOUT RING
          const r = item.size / 2.3;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.moveTo(-r, 0); ctx.lineTo(r, 0);
          ctx.moveTo(0, -r); ctx.lineTo(0, r);
          ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2);
          ctx.stroke();
        } 
        else if (item.type === 'jerrycan') {
          // JERRY CAN
          const w = item.size * 0.75;
          const h = item.size * 1.0;
          ctx.beginPath();
          ctx.roundRect(-w/2, -h/2, w, h, w * 0.15);
          ctx.stroke();
          // Handle
          ctx.beginPath();
          ctx.roundRect(-w * 0.22, -h * 0.35, w * 0.44, h * 0.20, w * 0.05);
          ctx.stroke();
          // Angled spout neck
          ctx.beginPath();
          ctx.moveTo(-w * 0.35, -h * 0.5);
          ctx.lineTo(-w * 0.35, -h * 0.58);
          ctx.lineTo(-w * 0.12, -h * 0.58);
          ctx.lineTo(-w * 0.12, -h * 0.5);
          ctx.stroke();
        } 
        else if (item.type === 'bottle') {
          // ROUND CONTAINER
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
      window.removeEventListener('click', handleMouseClick);
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
        className="absolute top-0 left-0 w-full h-full block pointer-events-auto"
      />
    </div>
  );
}
