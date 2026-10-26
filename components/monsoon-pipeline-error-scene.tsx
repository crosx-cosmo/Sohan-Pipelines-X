'use client';

import * as React from 'react';

export type WeatherMood =
  | 'clear-daylight'
  | 'storm-daylight'
  | 'dusk-drizzle'
  | 'monsoon-night';

interface MonsoonPipelineErrorSceneProps {
  mood?: WeatherMood;
  isPaused?: boolean;
  errorCode?: string;
}

interface RainDrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  wind: number;
  alpha: number;
  layer: 0 | 1 | 2;
}

interface RoadRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

interface WeldSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface SteamPlume {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  life: number;
  maxLife: number;
}

interface Pedestrian {
  id: number;
  x: number;
  y: number;
  speed: number;
  direction: 1 | -1;
  scale: number;
  phaseOffset: number;
  umbrellaColor: string;
  umbrellaRim: string;
  coatColor: string;
  coatType: 'trench' | 'jacket' | 'longcoat';
}

const MOOD_PALETTES: Record<
  WeatherMood,
  {
    skyTop: string;
    skyMid: string;
    skyHorizon: string;
    roadTop: string;
    roadBottom: string;
    buildingDark: string;
    buildingMid: string;
    windowWarm: string;
    lampGlow: string;
    rainRgb: string;
    rainIntensity: number;
    windX: number;
    isDaylight?: boolean;
  }
> = {
  'clear-daylight': {
    skyTop: '#bae6fd',
    skyMid: '#e0f2fe',
    skyHorizon: '#f8fafc',
    roadTop: '#475569',
    roadBottom: '#334155',
    buildingDark: '#94a3b8',
    buildingMid: '#cbd5e1',
    windowWarm: 'rgba(255, 255, 255, 0.78)',
    lampGlow: 'rgba(250, 204, 21, 0.22)',
    rainRgb: '2, 132, 199',
    rainIntensity: 0.45,
    windX: -0.9,
    isDaylight: true,
  },
  'storm-daylight': {
    skyTop: '#7dd3fc',
    skyMid: '#bae6fd',
    skyHorizon: '#e2e8f0',
    roadTop: '#334155',
    roadBottom: '#1e293b',
    buildingDark: '#64748b',
    buildingMid: '#94a3b8',
    windowWarm: 'rgba(254, 249, 195, 0.75)',
    lampGlow: 'rgba(56, 189, 248, 0.25)',
    rainRgb: '14, 116, 144',
    rainIntensity: 0.75,
    windX: -1.6,
    isDaylight: true,
  },
  'dusk-drizzle': {
    skyTop: '#0d1326',
    skyMid: '#1e2640',
    skyHorizon: '#3b2d44',
    roadTop: '#161b2e',
    roadBottom: '#080b14',
    buildingDark: '#0d1221',
    buildingMid: '#151c30',
    windowWarm: 'rgba(253, 186, 116, 0.65)',
    lampGlow: 'rgba(251, 146, 60, 0.24)',
    rainRgb: '224, 242, 254',
    rainIntensity: 0.65,
    windX: -1.4,
    isDaylight: false,
  },
  'monsoon-night': {
    skyTop: '#040814',
    skyMid: '#0b1528',
    skyHorizon: '#162642',
    roadTop: '#0b1322',
    roadBottom: '#04070f',
    buildingDark: '#070d19',
    buildingMid: '#0c1629',
    windowWarm: 'rgba(251, 191, 36, 0.55)',
    lampGlow: 'rgba(56, 189, 248, 0.24)',
    rainRgb: '186, 230, 253',
    rainIntensity: 1,
    windX: -2.4,
    isDaylight: false,
  },
};

export function MonsoonPipelineErrorScene({
  mood = 'clear-daylight',
  isPaused = false,
  errorCode = '404',
}: MonsoonPipelineErrorSceneProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const pointerRef = React.useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let width = 1280;
    let height = 720;
    let dpr = 1;

    const raindrops: RainDrop[] = [];
    const ripples: RoadRipple[] = [];
    const sparks: WeldSpark[] = [];
    const steamPlumes: SteamPlume[] = [];

    // Realistic-proportion pedestrians crossing the rain-slicked street holding umbrellas
    const pedestrians: Pedestrian[] = [
      {
        id: 1,
        x: 0.58,
        y: 0.75,
        speed: 0.00042,
        direction: 1,
        scale: 0.92,
        phaseOffset: 0.4,
        umbrellaColor: '#0f172a',
        umbrellaRim: '#38bdf8',
        coatColor: '#090f1d',
        coatType: 'trench',
      },
      {
        id: 2,
        x: 0.82,
        y: 0.79,
        speed: 0.00036,
        direction: -1,
        scale: 1.04,
        phaseOffset: 2.1,
        umbrellaColor: '#1e1b4b',
        umbrellaRim: '#f59e0b',
        coatColor: '#0f172a',
        coatType: 'longcoat',
      },
      {
        id: 3,
        x: 0.44,
        y: 0.72,
        speed: 0.00048,
        direction: -1,
        scale: 0.82,
        phaseOffset: 4.0,
        umbrellaColor: '#111827',
        umbrellaRim: '#7dd3fc',
        coatColor: '#111827',
        coatType: 'jacket',
      },
      {
        id: 4,
        x: 0.93,
        y: 0.83,
        speed: 0.00039,
        direction: 1,
        scale: 1.12,
        phaseOffset: 1.3,
        umbrellaColor: '#0c192c',
        umbrellaRim: '#38bdf8',
        coatColor: '#070b14',
        coatType: 'trench',
      },
    ];

    const initParticles = () => {
      raindrops.length = 0;
      ripples.length = 0;
      const totalDrops = 230;
      for (let i = 0; i < totalDrops; i++) {
        const layer = (i % 3) as 0 | 1 | 2;
        raindrops.push({
          x: Math.random() * width * 1.2 - width * 0.1,
          y: Math.random() * height,
          length: layer === 2 ? 26 + Math.random() * 14 : layer === 1 ? 18 + Math.random() * 10 : 11 + Math.random() * 6,
          speed: layer === 2 ? 15 + Math.random() * 5 : layer === 1 ? 11 + Math.random() * 4 : 7 + Math.random() * 3,
          wind: -2.2,
          alpha: layer === 2 ? 0.42 : layer === 1 ? 0.26 : 0.14,
          layer,
        });
      }

      for (let i = 0; i < 42; i++) {
        ripples.push({
          x: Math.random() * width,
          y: height * (0.66 + Math.random() * 0.32),
          radius: Math.random() * 14,
          maxRadius: 10 + Math.random() * 22,
          alpha: 0.35 + Math.random() * 0.3,
          speed: 0.25 + Math.random() * 0.3,
        });
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, 320);
      height = Math.max(rect.height, 480);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let time = 0;

    // Helper: Draw realistic human figure in raincoat holding an arched umbrella (non-cartoon architectural silhouette with rim lighting)
    const drawRealisticUmbrellaPedestrian = (
      p: Pedestrian,
      px: number,
      py: number,
      scale: number,
      t: number,
      isReflection: boolean
    ) => {
      ctx.save();
      ctx.translate(px, py);
      if (isReflection) {
        ctx.scale(p.direction * scale, -scale * 0.55);
        ctx.globalAlpha = 0.22;
      } else {
        ctx.scale(p.direction * scale, scale);
      }

      const stridePhase = t * 4.6 + p.phaseOffset;
      const bobY = Math.abs(Math.sin(stridePhase)) * 2.2;
      ctx.translate(0, -bobY);

      // Leg kinematics (realistic thigh + calf + boot articulation)
      const leg1Hip = Math.sin(stridePhase) * 0.36;
      const leg1Knee = Math.max(0, Math.sin(stridePhase - 0.7) * 0.52);
      const leg2Hip = Math.sin(stridePhase + Math.PI) * 0.36;
      const leg2Knee = Math.max(0, Math.sin(stridePhase + Math.PI - 0.7) * 0.52);

      const drawArticulatedLeg = (hipAngle: number, kneeAngle: number, isBack: boolean) => {
        ctx.save();
        ctx.translate(0, -40);
        ctx.rotate(hipAngle);
        ctx.strokeStyle = isBack ? '#060a14' : '#0f172a';
        ctx.lineWidth = 6.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 20);
        ctx.stroke();

        ctx.translate(0, 20);
        ctx.rotate(-kneeAngle);
        ctx.lineWidth = 5.2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 19);
        ctx.stroke();

        // Boot silhouette
        ctx.fillStyle = isBack ? '#050811' : '#0b1324';
        ctx.beginPath();
        ctx.ellipse(2.5, 20, 5.5, 2.6, 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      // Back leg
      drawArticulatedLeg(leg2Hip, leg2Knee, true);
      // Front leg
      drawArticulatedLeg(leg1Hip, leg1Knee, false);

      // Tailored Rain Trench Coat / Overcoat Silhouette
      ctx.fillStyle = p.coatColor;
      ctx.beginPath();
      const coathemSway = Math.sin(stridePhase) * 3.5;
      if (p.coatType === 'trench' || p.coatType === 'longcoat') {
        ctx.moveTo(-7, -76);
        ctx.quadraticCurveTo(8, -77, 9, -62);
        ctx.lineTo(12 + coathemSway * 0.5, -26);
        ctx.quadraticCurveTo(0, -23, -12 + coathemSway * 0.3, -27);
        ctx.closePath();
      } else {
        ctx.moveTo(-7, -75);
        ctx.quadraticCurveTo(8, -76, 9, -60);
        ctx.lineTo(9 + coathemSway * 0.3, -38);
        ctx.lineTo(-9, -39);
        ctx.closePath();
      }
      ctx.fill();

      // Subtle Rim Highlight along coat shoulder & front edge
      if (!isReflection) {
        ctx.strokeStyle = p.umbrellaRim;
        ctx.globalAlpha = 0.45;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(6, -75);
        ctx.quadraticCurveTo(10, -56, 11 + coathemSway * 0.4, -28);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Head & Collar Silhouette
      ctx.fillStyle = '#0b1322';
      ctx.beginPath();
      ctx.ellipse(1.5, -84, 5.6, 6.8, 0.08, 0, Math.PI * 2);
      ctx.fill();

      // Raised Arm holding Umbrella Shaft
      ctx.strokeStyle = '#111c30';
      ctx.lineWidth = 4.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(2, -68);
      ctx.quadraticCurveTo(9, -62, 13, -72);
      ctx.stroke();

      // Umbrella Shaft & Arched Architectural Canopy tilted into the wind
      const umbrellaTilt = 0.16 + Math.sin(t * 2.2 + p.phaseOffset) * 0.03;
      ctx.save();
      ctx.translate(13, -72);
      ctx.rotate(umbrellaTilt);

      // Steel shaft
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 4);
      ctx.lineTo(0, -34);
      ctx.stroke();

      // Umbrella Canopy Dome (Multi-ribbed architectural silhouette)
      const canopyGrad = ctx.createLinearGradient(-32, -36, 32, -16);
      canopyGrad.addColorStop(0, p.umbrellaColor);
      canopyGrad.addColorStop(0.7, '#1e293b');
      canopyGrad.addColorStop(1, p.umbrellaColor);

      ctx.fillStyle = canopyGrad;
      ctx.beginPath();
      ctx.moveTo(-31, -17);
      ctx.quadraticCurveTo(-16, -38, 0, -36);
      ctx.quadraticCurveTo(16, -38, 31, -17);
      // Scalloped tensioned fabric edge
      ctx.quadraticCurveTo(20, -21, 10, -17);
      ctx.quadraticCurveTo(0, -21, -10, -17);
      ctx.quadraticCurveTo(-20, -21, -31, -17);
      ctx.closePath();
      ctx.fill();

      // Glowing specular wet rim on top of the umbrella canopy
      if (!isReflection) {
        ctx.strokeStyle = p.umbrellaRim;
        ctx.lineWidth = 1.6;
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.moveTo(-30, -17.5);
        ctx.quadraticCurveTo(-15, -37.5, 0, -35.5);
        ctx.quadraticCurveTo(15, -37.5, 30, -17.5);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      ctx.restore();
      ctx.restore();
    };

    // Helper: Draw realistic Pipeline Engineering Crew fixing the main pipeline in the rain
    const drawPipelineWorksiteAndCrew = (
      worksiteX: number,
      groundY: number,
      scale: number,
      t: number
    ) => {
      ctx.save();
      ctx.translate(worksiteX, groundY);
      ctx.scale(scale, scale);

      // 1. Wet Asphalt Reflection Glow beneath the worksite
      const groundGlow = ctx.createRadialGradient(20, 18, 8, 20, 24, 195);
      const isWeldingPulse = Math.sin(t * 9) > -0.25 && Math.sin(t * 2.3) > -0.4;
      groundGlow.addColorStop(
        0,
        isWeldingPulse ? 'rgba(251, 191, 36, 0.36)' : 'rgba(56, 189, 248, 0.22)'
      );
      groundGlow.addColorStop(0.5, 'rgba(14, 165, 233, 0.12)');
      groundGlow.addColorStop(1, 'rgba(4, 8, 20, 0)');
      ctx.fillStyle = groundGlow;
      ctx.beginPath();
      ctx.ellipse(20, 22, 195, 36, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Portable Industrial Tripod Work-Light (Left of trench)
      ctx.save();
      ctx.translate(-135, 4);
      // Tripod legs
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-16, 8);
      ctx.lineTo(0, -38);
      ctx.lineTo(16, 8);
      ctx.moveTo(0, 10);
      ctx.lineTo(0, -96);
      ctx.stroke();

      // Floodlight housing
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-10, -108, 22, 14, 3);
      ctx.fill();
      ctx.stroke();

      // Volumetric Work-Light Cone aimed at pipeline & engineers
      const beamGrad = ctx.createLinearGradient(10, -101, 210, -10);
      beamGrad.addColorStop(0, 'rgba(253, 224, 71, 0.34)');
      beamGrad.addColorStop(0.45, 'rgba(251, 191, 36, 0.12)');
      beamGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(11, -106);
      ctx.lineTo(235, -75);
      ctx.lineTo(215, 22);
      ctx.lineTo(11, -95);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 3. Exposed Municipal Main Steel Pipeline & Flange Valve Assembly
      // Excavated road trench rim
      ctx.fillStyle = '#050914';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(15, 8, 122, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Heavy Steel Pipeline Riser & Horizontal Main Line
      const pipeGrad = ctx.createLinearGradient(0, -52, 0, -14);
      pipeGrad.addColorStop(0, '#64748b');
      pipeGrad.addColorStop(0.35, '#94a3b8');
      pipeGrad.addColorStop(0.7, '#334155');
      pipeGrad.addColorStop(1, '#0f172a');

      // Left riser bend
      ctx.strokeStyle = pipeGrad;
      ctx.lineWidth = 24;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(-78, 6);
      ctx.lineTo(-78, -32);
      ctx.lineTo(95, -32);
      ctx.lineTo(95, 6);
      ctx.stroke();

      // Heavy bolted flange rings along the pipeline
      ctx.fillStyle = '#475569';
      for (const fx of [-42, 8, 56]) {
        ctx.fillRect(fx - 4, -48, 8, 32);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.strokeRect(fx - 4, -48, 8, 32);
      }

      // Illuminated Pressure Gauge Manifold on the right section of the pipe
      ctx.save();
      ctx.translate(56, -64);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 16);
      ctx.lineTo(0, 4);
      ctx.stroke();

      ctx.fillStyle = '#09101d';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -6, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Animated pressure needle
      const needleAngle = -0.6 + Math.sin(t * 3.2) * 0.45;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(Math.cos(needleAngle) * 8, -6 + Math.sin(needleAngle) * 8);
      ctx.stroke();
      ctx.restore();

      // Rotating Isolation Wheel Valve
      ctx.save();
      ctx.translate(-42, -56);
      ctx.rotate(Math.sin(t * 1.4) * 0.65);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.moveTo(-12, 0);
      ctx.lineTo(12, 0);
      ctx.moveTo(0, -12);
      ctx.lineTo(0, 12);
      ctx.stroke();
      ctx.restore();

      // 4. Engineer #1 (Left): Operating Valve & Inspecting Joint (Realistic Human Proportions)
      ctx.save();
      ctx.translate(-58, 4);
      const eng1Lean = Math.sin(t * 1.8) * 0.05;
      // Boots & Waterproof Work Trousers
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 7.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(-6, -34);
      ctx.moveTo(8, 0);
      ctx.lineTo(4, -34);
      ctx.stroke();

      // Torso in High-Vis Storm Jacket
      ctx.save();
      ctx.translate(-1, -34);
      ctx.rotate(0.18 + eng1Lean);
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(-11, -38, 22, 38, 6);
      ctx.fill();

      // Reflective High-Vis Safety Stripes on Storm Jacket
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-9, -24);
      ctx.lineTo(10, -24);
      ctx.moveTo(-9, -14);
      ctx.lineTo(10, -14);
      ctx.stroke();

      // Engineer #1 Head & Safety Hardhat with Headlamp
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(3, -47, 7.5, Math.PI, 0);
      ctx.lineTo(12, -45);
      ctx.lineTo(-6, -45);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(2, -43, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // Headlamp beam
      const headBeam = ctx.createLinearGradient(8, -46, 58, -32);
      headBeam.addColorStop(0, 'rgba(186, 230, 253, 0.55)');
      headBeam.addColorStop(1, 'rgba(186, 230, 253, 0)');
      ctx.fillStyle = headBeam;
      ctx.beginPath();
      ctx.moveTo(8, -47);
      ctx.lineTo(64, -44);
      ctx.lineTo(58, -20);
      ctx.closePath();
      ctx.fill();

      // Reaching Arm turning the valve wheel
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 5.5;
      ctx.beginPath();
      ctx.moveTo(4, -30);
      ctx.lineTo(18, -22 + Math.sin(t * 2.8) * 3);
      ctx.stroke();
      ctx.restore();
      ctx.restore();

      // 5. Engineer #2 (Center-Right): Kneeling/Crouching at Flange Joint with Active Torque & Arc Sealer
      ctx.save();
      ctx.translate(22, 5);
      const crouchBob = Math.sin(t * 3.6) * 1.5;
      // Kneeling legs
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 7.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(18, 0);
      ctx.lineTo(6, -24);
      ctx.lineTo(14, -4);
      ctx.moveTo(-2, 0);
      ctx.lineTo(4, -26);
      ctx.stroke();

      // Crouched torso in waterproof engineering parka
      ctx.save();
      ctx.translate(4, -26 + crouchBob);
      ctx.rotate(-0.28);
      ctx.fillStyle = '#0c1526';
      ctx.beginPath();
      ctx.roundRect(-11, -35, 22, 35, 6);
      ctx.fill();

      // High-visibility cyan/amber reflective bands
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-9, -22);
      ctx.lineTo(9, -22);
      ctx.stroke();
      ctx.strokeStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(-9, -13);
      ctx.lineTo(9, -13);
      ctx.stroke();

      // Safety Hardhat
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(-2, -43, 7.5, Math.PI, 0);
      ctx.lineTo(6, -41);
      ctx.lineTo(-11, -41);
      ctx.closePath();
      ctx.fill();

      // Arms holding heavy pipeline torque/sealing tool onto flange joint at (8, -32)
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 5.5;
      ctx.beginPath();
      ctx.moveTo(-4, -26);
      ctx.lineTo(-18, -14);
      ctx.stroke();
      ctx.restore();
      ctx.restore();

      // 6. Active Flange Arc-Sealing Flash & Realistic Micro-Sparks
      if (isWeldingPulse) {
        const flashRadius = 18 + Math.random() * 14;
        const weldFlash = ctx.createRadialGradient(8, -32, 1, 8, -32, flashRadius);
        weldFlash.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        weldFlash.addColorStop(0.35, 'rgba(251, 191, 36, 0.75)');
        weldFlash.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = weldFlash;
        ctx.beginPath();
        ctx.arc(8, -32, flashRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 7. Reflective Road Safety Barricade & Pulsing Amber Beacon (Foreground edge of trench)
      ctx.save();
      ctx.translate(-95, 14);
      // A-frame legs
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 6);
      ctx.lineTo(6, -22);
      ctx.lineTo(12, 6);
      ctx.moveTo(58, 6);
      ctx.lineTo(64, -22);
      ctx.lineTo(70, 6);
      ctx.stroke();

      // Striped reflective barrier rail
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(2, -18, 66, 9, 2);
      ctx.fill();
      ctx.stroke();

      // Stenciled Error Code Badge on Worksite Barricade
      ctx.fillStyle = '#fbbf24';
      ctx.font = '700 9px monospace';
      ctx.fillText(`LINE ${errorCode}`, 13, -10.5);

      // Pulsing amber beacon on top of barricade
      const beaconAlpha = 0.45 + Math.abs(Math.sin(t * 5)) * 0.55;
      const beaconGlow = ctx.createRadialGradient(6, -24, 1, 6, -24, 16);
      beaconGlow.addColorStop(0, `rgba(245, 158, 11, ${beaconAlpha})`);
      beaconGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = beaconGlow;
      ctx.beginPath();
      ctx.arc(6, -24, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(6, -24, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore();
    };

    const renderFrame = () => {
      if (!isPaused) {
        time += 0.016;
      }

      const palette = MOOD_PALETTES[mood];
      const horizonY = height * 0.64;
      const pxOffset = (pointerRef.current.x - 0.5) * 18;

      // 1. Atmospheric Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, palette.skyTop);
      skyGrad.addColorStop(0.55, palette.skyMid);
      skyGrad.addColorStop(1, palette.skyHorizon);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, horizonY + 2);

      // Daylight Sun Halo in Day Mode vs Distant Storm Lightning in Night Mode
      if (palette.isDaylight) {
        const sunX = width * 0.24 + pxOffset * 0.25;
        const sunY = height * 0.18;
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, 180);
        sunGlow.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
        sunGlow.addColorStop(0.25, 'rgba(254, 240, 138, 0.55)');
        sunGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 180, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const lightningCycle = Math.sin(time * 0.7) * Math.sin(time * 4.3);
        if (lightningCycle > 0.92) {
          ctx.fillStyle = 'rgba(186, 230, 253, 0.06)';
          ctx.fillRect(0, 0, width, horizonY);
        }
      }

      // 2. Architectural Urban Skyline Silhouette & Distant Water Towers
      const buildings = [
        { x: 0.02, w: 0.08, h: 0.24 },
        { x: 0.11, w: 0.09, h: 0.34 },
        { x: 0.21, w: 0.07, h: 0.21 },
        { x: 0.29, w: 0.11, h: 0.38 },
        { x: 0.41, w: 0.08, h: 0.26 },
        { x: 0.51, w: 0.12, h: 0.42 },
        { x: 0.64, w: 0.09, h: 0.29 },
        { x: 0.74, w: 0.11, h: 0.36 },
        { x: 0.86, w: 0.12, h: 0.27 },
      ];

      buildings.forEach((b, idx) => {
        const bx = b.x * width + pxOffset * 0.35;
        const bw = b.w * width;
        const bh = b.h * height;
        const by = horizonY - bh;

        ctx.fillStyle = idx % 2 === 0 ? palette.buildingDark : palette.buildingMid;
        ctx.fillRect(bx, by, bw, bh);

        // Subtle warm architectural window grid
        ctx.fillStyle = palette.windowWarm;
        const cols = 3;
        const rows = Math.floor(bh / 22);
        for (let r = 1; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if ((idx + r * 3 + c) % 4 === 0) {
              ctx.fillRect(
                bx + 10 + c * ((bw - 24) / cols),
                by + r * 18,
                Math.max(4, (bw - 36) / (cols * 2)),
                6
              );
            }
          }
        }
      });

      // 3. Rain-Slicked Asphalt Roadway & Wet Reflections
      const roadGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      roadGrad.addColorStop(0, palette.roadTop);
      roadGrad.addColorStop(1, palette.roadBottom);
      ctx.fillStyle = roadGrad;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      // Perspective Crosswalk Stripes on the wet road
      ctx.save();
      const crosswalkY = height * 0.76;
      for (let i = 0; i < 7; i++) {
        const stripeX = width * (0.42 + i * 0.075) + pxOffset * 0.6;
        ctx.fillStyle = 'rgba(226, 232, 240, 0.09)';
        ctx.beginPath();
        ctx.moveTo(stripeX, crosswalkY - 12);
        ctx.lineTo(stripeX + 26, crosswalkY - 12);
        ctx.lineTo(stripeX + 38, crosswalkY + 26);
        ctx.lineTo(stripeX - 8, crosswalkY + 26);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 4. Tall Architectural Streetlamps with Volumetric Cones
      const lampPositions = [0.16, 0.52, 0.86];
      lampPositions.forEach((lxRatio) => {
        const lx = lxRatio * width + pxOffset * 0.5;
        const lampTopY = horizonY - height * 0.26;

        // Pole
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(lx, horizonY + 8);
        ctx.lineTo(lx, lampTopY);
        ctx.lineTo(lx + 22, lampTopY - 6);
        ctx.stroke();

        // Volumetric cone
        const coneGrad = ctx.createLinearGradient(lx + 22, lampTopY - 6, lx + 22, horizonY + 60);
        coneGrad.addColorStop(0, palette.lampGlow);
        coneGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = coneGrad;
        ctx.beginPath();
        ctx.moveTo(lx + 18, lampTopY - 4);
        ctx.lineTo(lx - 75, horizonY + 65);
        ctx.lineTo(lx + 125, horizonY + 65);
        ctx.lineTo(lx + 26, lampTopY - 4);
        ctx.closePath();
        ctx.fill();

        // Street reflection column on wet asphalt
        const reflGrad = ctx.createLinearGradient(lx + 20, horizonY, lx + 20, height);
        reflGrad.addColorStop(0, palette.lampGlow);
        reflGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = reflGrad;
        ctx.fillRect(lx + 6, horizonY, 28, height - horizonY);
      });

      // 5. Expanding Raindrop Puddle Ripples on the Wet Road
      ctx.save();
      for (const r of ripples) {
        if (!isPaused) {
          r.radius += r.speed * palette.rainIntensity;
          if (r.radius > r.maxRadius) {
            r.radius = 0.5;
            r.x = Math.random() * width;
            r.y = horizonY + Math.random() * (height - horizonY);
          }
        }
        const progress = r.radius / r.maxRadius;
        const curAlpha = (1 - progress) * r.alpha * palette.rainIntensity;
        ctx.strokeStyle = `rgba(${palette.rainRgb}, ${curAlpha.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.radius * 1.8, r.radius * 0.42, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // 6. Pipeline Worksite & Master Plumbing Crew (Left-Center of Roadway)
      const worksiteX = Math.max(210, width * 0.27) + pxOffset * 0.75;
      const worksiteY = height * 0.74;
      const sceneScale = Math.min(1.1, Math.max(0.72, width / 1150));

      drawPipelineWorksiteAndCrew(worksiteX, worksiteY, sceneScale, time);

      // Spawn & Update Realistic Welding Sparks + Pressurized Steam Plumes from the Pipeline Joint
      const jointWorldX = worksiteX + 8 * sceneScale;
      const jointWorldY = worksiteY - 32 * sceneScale;

      if (!isPaused) {
        if (Math.random() < 0.45) {
          sparks.push({
            x: jointWorldX,
            y: jointWorldY,
            vx: (Math.random() - 0.35) * 3.8,
            vy: -Math.random() * 3.6 - 0.8,
            life: 0,
            maxLife: 18 + Math.random() * 18,
            size: 1.2 + Math.random() * 1.6,
            color: Math.random() > 0.3 ? '#fde047' : '#fb923c',
          });
        }

        if (Math.random() < 0.16) {
          steamPlumes.push({
            x: jointWorldX - 42 * sceneScale,
            y: worksiteY - 46 * sceneScale,
            vx: palette.windX * 0.25 + (Math.random() - 0.5) * 0.4,
            vy: -0.6 - Math.random() * 0.5,
            radius: 6 + Math.random() * 6,
            alpha: 0.22,
            life: 0,
            maxLife: 65 + Math.random() * 30,
          });
        }
      }

      // Draw rising steam plumes
      for (let i = steamPlumes.length - 1; i >= 0; i--) {
        const s = steamPlumes[i];
        if (!isPaused) {
          s.x += s.vx;
          s.y += s.vy;
          s.radius += 0.22;
          s.life += 1;
        }
        const lifeRatio = 1 - s.life / s.maxLife;
        if (lifeRatio <= 0) {
          steamPlumes.splice(i, 1);
          continue;
        }
        const steamGrad = ctx.createRadialGradient(s.x, s.y, 1, s.x, s.y, s.radius);
        steamGrad.addColorStop(0, `rgba(226, 232, 240, ${(s.alpha * lifeRatio).toFixed(3)})`);
        steamGrad.addColorStop(1, 'rgba(226, 232, 240, 0)');
        ctx.fillStyle = steamGrad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw welding micro-sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        if (!isPaused) {
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.vy += 0.18; // gravity
          sp.life += 1;
        }
        if (sp.life >= sp.maxLife) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = 1 - sp.life / sp.maxLife;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // 7. Pedestrians Crossing the Road Holding Umbrellas (Sorted by depth Y)
      const sortedPedestrians = [...pedestrians].sort((a, b) => a.y - b.y);
      for (const ped of sortedPedestrians) {
        if (!isPaused) {
          ped.x += ped.speed * ped.direction;
          if (ped.direction === 1 && ped.x > 1.08) {
            ped.x = 0.38;
          } else if (ped.direction === -1 && ped.x < 0.36) {
            ped.x = 1.08;
          }
        }
        const pedScreenX = ped.x * width + pxOffset * 0.85;
        const pedScreenY = ped.y * height;
        const pedScale = ped.scale * sceneScale;

        // Wet road reflection first
        drawRealisticUmbrellaPedestrian(
          ped,
          pedScreenX,
          pedScreenY + 2,
          pedScale,
          time,
          true
        );

        // Actual pedestrian with umbrella
        drawRealisticUmbrellaPedestrian(
          ped,
          pedScreenX,
          pedScreenY,
          pedScale,
          time,
          false
        );
      }

      // 8. Multi-Layer Wind-Swept Monsoon Rain Streaks
      ctx.save();
      ctx.lineCap = 'round';
      for (const drop of raindrops) {
        if (!isPaused) {
          drop.x += palette.windX * (drop.layer * 0.35 + 0.65);
          drop.y += drop.speed * palette.rainIntensity;

          if (drop.y > height) {
            drop.y = -20;
            drop.x = Math.random() * width * 1.2 - width * 0.05;
          }
          if (drop.x < -40) {
            drop.x = width + 20;
          }
        }

        ctx.strokeStyle = `rgba(${palette.rainRgb}, ${(
          drop.alpha * palette.rainIntensity
        ).toFixed(3)})`;
        ctx.lineWidth = drop.layer === 2 ? 1.35 : drop.layer === 1 ? 1.0 : 0.7;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(
          drop.x + palette.windX * 1.4,
          drop.y + drop.length * palette.rainIntensity
        );
        ctx.stroke();
      }
      ctx.restore();

      // 9. Rolling Ground Mist & Atmospheric Vignette
      const mistGrad = ctx.createLinearGradient(0, horizonY - 35, 0, horizonY + 55);
      mistGrad.addColorStop(0, 'rgba(15, 23, 42, 0)');
      mistGrad.addColorStop(0.5, 'rgba(148, 163, 184, 0.07)');
      mistGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = mistGrad;
      ctx.fillRect(0, horizonY - 35, width, 90);

      animationFrameId = window.requestAnimationFrame(renderFrame);
    };

    animationFrameId = window.requestAnimationFrame(renderFrame);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mood, isPaused, errorCode]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointerRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className="absolute inset-0 w-full h-full overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        aria-label="Atmospheric rainy street scene with pipeline engineers repairing a main water line while pedestrians cross the wet road holding umbrellas"
      />
    </div>
  );
}
