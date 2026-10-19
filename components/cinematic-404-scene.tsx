'use client';

import * as React from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export type CameraPreset = 'cinema' | 'monument' | 'street';

export interface Cinematic404SceneProps {
  cameraPreset?: CameraPreset;
  isPaused?: boolean;
  replayTrigger?: number;
  onIntroPhaseChange?: (phase: 'street' | 'align' | 'leak' | 'live') => void;
}

/**
 * Generates a procedural wet asphalt roughness + puddle normal/specular canvas texture
 * with zero external image dependencies.
 */
function createWetAsphaltTextures(maxAnisotropy: number) {
  const size = 512;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const ctx = colorCanvas.getContext('2d')!;

  // Deep wet asphalt base
  ctx.fillStyle = '#0b101b';
  ctx.fillRect(0, 0, size, size);

  // Subtle asphalt aggregate grain and wet streaks
  for (let i = 0; i < 6500; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const v = 10 + Math.floor(Math.random() * 24);
    ctx.fillStyle = `rgb(${v}, ${v + 4}, ${v + 12})`;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Subtle road lane dashes along horizontal axis
  ctx.fillStyle = 'rgba(203, 213, 225, 0.18)';
  for (let x = 16; x < size; x += 64) {
    ctx.fillRect(x, size * 0.68, 34, 4);
  }

  // Roughness map canvas (dark = mirror-wet puddle, lighter = damp asphalt)
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d')!;
  rCtx.fillStyle = '#4a5568';
  rCtx.fillRect(0, 0, size, size);

  // Create organic wet puddle patches
  for (let i = 0; i < 28; i++) {
    const px = Math.random() * size;
    const py = Math.random() * size;
    const rad = 28 + Math.random() * 75;
    const grad = rCtx.createRadialGradient(px, py, rad * 0.1, px, py, rad);
    grad.addColorStop(0, '#0a0e17');
    grad.addColorStop(0.65, '#1a202c');
    grad.addColorStop(1, 'rgba(74, 85, 104, 0)');
    rCtx.fillStyle = grad;
    rCtx.beginPath();
    rCtx.arc(px, py, rad, 0, Math.PI * 2);
    rCtx.fill();
  }

  const colorTex = new THREE.CanvasTexture(colorCanvas);
  colorTex.colorSpace = THREE.SRGBColorSpace;
  colorTex.wrapS = THREE.RepeatWrapping;
  colorTex.wrapT = THREE.RepeatWrapping;
  colorTex.repeat.set(8, 4);
  colorTex.anisotropy = maxAnisotropy;

  const roughTex = new THREE.CanvasTexture(roughCanvas);
  roughTex.wrapS = THREE.RepeatWrapping;
  roughTex.wrapT = THREE.RepeatWrapping;
  roughTex.repeat.set(8, 4);
  roughTex.anisotropy = maxAnisotropy;

  return { colorTex, roughTex };
}

/**
 * Generates a procedural illuminated building window grid texture for the rainy night city backdrop.
 */
function createBuildingWindowTexture(maxAnisotropy: number) {
  const width = 256;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#070b14';
  ctx.fillRect(0, 0, width, height);

  const cols = 8;
  const rows = 18;
  const padX = 8;
  const padY = 10;
  const winW = (width - padX * (cols + 1)) / cols;
  const winH = (height - padY * (rows + 1)) / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const rand = Math.random();
      if (rand > 0.58) {
        // Warm architectural interior or cool industrial bay light
        if (rand > 0.82) {
          ctx.fillStyle = 'rgba(245, 158, 11, 0.85)'; // Warm amber
        } else if (rand > 0.7) {
          ctx.fillStyle = 'rgba(254, 215, 170, 0.75)'; // Soft warm white
        } else {
          ctx.fillStyle = 'rgba(56, 189, 248, 0.65)'; // Cool cyan industrial bay
        }
      } else {
        ctx.fillStyle = '#0d1526';
      }
      const x = padX + c * (winW + padX);
      const y = padY + r * (winH + padY);
      ctx.fillRect(x, y, winW, winH);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

interface MechanicalSegment {
  group: THREE.Group;
  targetPos: THREE.Vector3;
  startPos: THREE.Vector3;
  targetRot: THREE.Euler;
  startRot: THREE.Euler;
  delay: number;
}

interface FlowingWaterCore {
  mesh: THREE.Mesh;
  material: THREE.MeshPhysicalMaterial;
  baseEmissive: number;
  phaseOffset: number;
}

interface FallingDroplet {
  mesh: THREE.Mesh;
  xOffset: number;
  zOffset: number;
  progress: number;
  speed: number;
}

interface PuddleRipple {
  mesh: THREE.Mesh;
  material: THREE.MeshBasicMaterial;
  phase: number;
  speed: number;
  maxScale: number;
}

interface PedestrianActor {
  root: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  umbrellaGroup: THREE.Group | null;
  speed: number;
  direction: 1 | -1;
  laneZ: number;
  phase: number;
  boundX: number;
}

interface MotorcycleActor {
  root: THREE.Group;
  frontWheel: THREE.Object3D;
  rearWheel: THREE.Object3D;
  chassisGroup: THREE.Group;
  speed: number;
  direction: 1 | -1;
  laneZ: number;
  boundX: number;
  phase: number;
}

interface CyclistActor {
  root: THREE.Group;
  frontWheel: THREE.Object3D;
  rearWheel: THREE.Object3D;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  crank: THREE.Object3D;
  speed: number;
  direction: 1 | -1;
  laneZ: number;
  boundX: number;
  phase: number;
}

interface CarActor {
  root: THREE.Group;
  wheels: THREE.Object3D[];
  speed: number;
  direction: 1 | -1;
  laneZ: number;
  boundX: number;
}

export function Cinematic404Scene({
  cameraPreset = 'cinema',
  isPaused = false,
  replayTrigger = 0,
  onIntroPhaseChange,
}: Cinematic404SceneProps) {
  const mountRef = React.useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = React.useState(false);

  const cameraPresetRef = React.useRef<CameraPreset>(cameraPreset);
  const isPausedRef = React.useRef<boolean>(isPaused);
  const onIntroPhaseChangeRef = React.useRef(onIntroPhaseChange);

  const introElapsedRef = React.useRef<number>(0);
  const lastPhaseRef = React.useRef<'street' | 'align' | 'leak' | 'live'>('street');

  React.useEffect(() => {
    cameraPresetRef.current = cameraPreset;
    isPausedRef.current = isPaused;
    onIntroPhaseChangeRef.current = onIntroPhaseChange;
  }, [cameraPreset, isPaused, onIntroPhaseChange]);

  // Reset intro timeline when replayTrigger increments
  React.useEffect(() => {
    if (replayTrigger > 0) {
      introElapsedRef.current = 0;
      lastPhaseRef.current = 'street';
      onIntroPhaseChangeRef.current?.('street');
    }
  }, [replayTrigger]);

  React.useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isHeadless =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile && !isHeadless,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch {
      queueMicrotask(() => setWebglFailed(true));
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    renderer.setSize(width, height);
    renderer.setPixelRatio(
      isHeadless ? 1 : Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = !isHeadless && !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const fogColor = new THREE.Color(0x050913);
    scene.background = fogColor;
    scene.fog = new THREE.FogExp2(0x050913, isMobile ? 0.024 : 0.021);

    // Studio & industrial environment reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const { colorTex: asphaltColorTex, roughTex: asphaltRoughTex } =
      createWetAsphaltTextures(maxAnisotropy);
    const windowTex = createBuildingWindowTexture(maxAnisotropy);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 54 : 42,
      width / height,
      0.1,
      140
    );
    camera.position.set(-3.2, 1.85, isMobile ? 16.5 : 13.5);

    // Track disposable resources
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [envTexture, asphaltColorTex, asphaltRoughTex, windowTex];

    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      geometries.push(g);
      return g;
    };
    const trackMat = <T extends THREE.Material>(m: T): T => {
      materials.push(m);
      return m;
    };

    // =========================================================================
    // 1. VOLUMETRIC & ATMOSPHERIC LIGHTING RIG
    // =========================================================================
    const hemiLight = new THREE.HemisphereLight(0x284b7a, 0x090d16, 1.05);
    hemiLight.position.set(0, 30, 0);
    scene.add(hemiLight);

    // Cool moonlight / industrial key light
    const keyLight = new THREE.DirectionalLight(0x93c5fd, 1.65);
    keyLight.position.set(8, 16, 10);
    if (!isHeadless && !isMobile) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 40;
      keyLight.shadow.camera.left = -12;
      keyLight.shadow.camera.right = 12;
      keyLight.shadow.camera.top = 10;
      keyLight.shadow.camera.bottom = -4;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    // Electric-blue pipeline core illumination
    const pipelineBlueLight = new THREE.PointLight(0x0ea5e9, 5.5, 16, 1.6);
    pipelineBlueLight.position.set(0, 2.9, 1.4);
    scene.add(pipelineBlueLight);

    // Disconnected puddle glow light
    const puddleGlowLight = new THREE.PointLight(0x38bdf8, 4.2, 8, 1.8);
    puddleGlowLight.position.set(0.62, 0.35, 0.65);
    scene.add(puddleGlowLight);

    // Warm architectural sodium/amber streetlamps flanking the facility
    const warmLightLeft = new THREE.PointLight(0xf59e0b, 4.8, 20, 1.6);
    warmLightLeft.position.set(-7.5, 5.6, 2.2);
    scene.add(warmLightLeft);

    const warmLightRight = new THREE.PointLight(0xfb923c, 4.8, 20, 1.6);
    warmLightRight.position.set(7.5, 5.6, 2.2);
    scene.add(warmLightRight);

    // =========================================================================
    // 2. SHARED PBR INDUSTRIAL MATERIALS
    // =========================================================================
    const brushedSteelMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xdbe4f0,
        metalness: 0.92,
        roughness: 0.19,
        clearcoat: 0.35,
        clearcoatRoughness: 0.2,
        envMapIntensity: 1.45,
      })
    );

    const darkCastFlangeMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.86,
        roughness: 0.36,
        envMapIntensity: 1.2,
      })
    );

    const chromeBoltMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        metalness: 0.96,
        roughness: 0.12,
        envMapIntensity: 1.6,
      })
    );

    const brassValveMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xeab308,
        metalness: 0.88,
        roughness: 0.24,
        envMapIntensity: 1.35,
      })
    );

    const redValveWheelMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        metalness: 0.45,
        roughness: 0.35,
      })
    );

    const glassPipeMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xe0f2fe,
        metalness: 0.05,
        roughness: 0.06,
        transmission: 0.86,
        transparent: true,
        opacity: 0.92,
        ior: 1.52,
        thickness: 0.35,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        depthWrite: false,
      })
    );

    // =========================================================================
    // 3. WET ASPHALT STREET, SIDEWALKS & SHIMMERING PUDDLE
    // =========================================================================
    const groundMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: asphaltColorTex,
        roughnessMap: asphaltRoughTex,
        roughness: 0.22,
        metalness: 0.38,
        envMapIntensity: 1.5,
      })
    );

    const groundPlane = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(90, 50)),
      groundMat
    );
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.position.y = 0;
    groundPlane.receiveShadow = true;
    scene.add(groundPlane);

    // Raised concrete promenade deck where the 404 Pipeline Monument & pedestrians stand
    const sidewalkMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x161f30,
        roughness: 0.32,
        metalness: 0.25,
        envMapIntensity: 1.1,
      })
    );

    const mainPlaza = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(48, 0.14, 5.2)),
      sidewalkMat
    );
    mainPlaza.position.set(0, 0.07, -0.4);
    mainPlaza.receiveShadow = true;
    scene.add(mainPlaza);

    // Background sidewalk across the street
    const farSidewalk = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(64, 0.16, 4.0)),
      sidewalkMat
    );
    farSidewalk.position.set(0, 0.08, -7.2);
    scene.add(farSidewalk);

    // Central puddle directly beneath the disconnected '0' pipe joint (x = 0.62, z = 0.35)
    const puddleCenter = new THREE.Vector3(0.62, 0.145, 0.35);
    const puddleSurfaceMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x0c4a6e,
        emissive: 0x0284c7,
        emissiveIntensity: 0.42,
        metalness: 0.85,
        roughness: 0.04,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.85,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      })
    );
    const puddleDisc = new THREE.Mesh(
      trackGeo(new THREE.CircleGeometry(1.45, 40)),
      puddleSurfaceMat
    );
    puddleDisc.rotation.x = -Math.PI / 2;
    puddleDisc.position.copy(puddleCenter);
    scene.add(puddleDisc);

    // Concentric expanding puddle ripples
    const ripples: PuddleRipple[] = [];
    const ringGeo = trackGeo(new THREE.RingGeometry(0.08, 0.13, 36));
    for (let i = 0; i < 5; i++) {
      const rMat = trackMat(
        new THREE.MeshBasicMaterial({
          color: 0x7dd3fc,
          transparent: true,
          opacity: 0.7,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      );
      const rMesh = new THREE.Mesh(ringGeo, rMat);
      rMesh.rotation.x = -Math.PI / 2;
      rMesh.position.set(puddleCenter.x, puddleCenter.y + 0.005, puddleCenter.z);
      scene.add(rMesh);
      ripples.push({
        mesh: rMesh,
        material: rMat,
        phase: i * 0.2,
        speed: 0.48,
        maxScale: 9.5,
      });
    }

    // Additional subtle rain ripples distributed across the wet street
    const streetRipples: PuddleRipple[] = [];
    const streetRippleCount = isMobile ? 6 : 14;
    for (let i = 0; i < streetRippleCount; i++) {
      const srMat = trackMat(
        new THREE.MeshBasicMaterial({
          color: 0x93c5fd,
          transparent: true,
          opacity: 0.35,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      );
      const srMesh = new THREE.Mesh(ringGeo, srMat);
      srMesh.rotation.x = -Math.PI / 2;
      srMesh.position.set(
        (Math.random() - 0.5) * 20,
        0.02,
        1.8 + Math.random() * 6.5
      );
      scene.add(srMesh);
      streetRipples.push({
        mesh: srMesh,
        material: srMat,
        phase: Math.random(),
        speed: 0.7 + Math.random() * 0.4,
        maxScale: 3.2,
      });
    }

    // =========================================================================
    // 4. INDUSTRIAL PLUMBING FACILITY & METROPOLITAN NIGHT SKYLINE
    // =========================================================================
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    const buildingMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0b1322,
        roughness: 0.5,
        metalness: 0.4,
        map: windowTex,
      })
    );
    const darkStructureMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.45,
        metalness: 0.65,
      })
    );

    // Central Sohan Pipelines Industrial Facility Hall (behind the 404 monument)
    const facilityMain = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(16, 9.5, 6)),
      darkStructureMat
    );
    facilityMain.position.set(0, 4.75, -12.5);
    cityGroup.add(facilityMain);

    // Illuminated industrial glass curtain bays on the facility
    const bayGlowMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfef3c7,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.65,
        roughness: 0.2,
      })
    );
    for (let bx = -5.4; bx <= 5.4; bx += 3.6) {
      const bayWindow = new THREE.Mesh(
        trackGeo(new THREE.PlaneGeometry(2.2, 3.4)),
        bayGlowMat
      );
      bayWindow.position.set(bx, 3.2, -9.45);
      cityGroup.add(bayWindow);
    }

    // Industrial rooftop water storage silos & overhead manifold pipes on the facility
    const siloGeo = trackGeo(new THREE.CylinderGeometry(1.1, 1.1, 3.8, 24));
    for (const sx of [-4.5, -1.8, 4.2]) {
      const silo = new THREE.Mesh(siloGeo, brushedSteelMat);
      silo.position.set(sx, 11.2, -12.2);
      cityGroup.add(silo);
    }

    // Flanking metropolitan high-rise buildings
    const skylineSpecs = [
      { x: -16, z: -15, w: 6.5, h: 19, d: 6 },
      { x: -10.5, z: -17, w: 5.5, h: 14.5, d: 5 },
      { x: 10.8, z: -16, w: 6.0, h: 16, d: 5.5 },
      { x: 16.5, z: -14, w: 7.0, h: 21, d: 6.5 },
      { x: -22, z: -18, w: 7.5, h: 15, d: 6 },
      { x: 23, z: -18, w: 7.5, h: 17, d: 6 },
    ];
    for (const b of skylineSpecs) {
      const mesh = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(b.w, b.h, b.d)),
        buildingMat
      );
      mesh.position.set(b.x, b.h / 2, b.z);
      cityGroup.add(mesh);
    }

    // Streetlamp poles with warm volumetric light cones
    const poleGeo = trackGeo(new THREE.CylinderGeometry(0.06, 0.08, 5.6, 12));
    const armGeo = trackGeo(new THREE.BoxGeometry(0.9, 0.06, 0.06));
    const coneGeo = trackGeo(new THREE.ConeGeometry(2.4, 5.5, 24, 1, true));
    const volumetricConeMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0.075,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    const bulbMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xfef08a,
      })
    );

    for (const lx of [-13.5, -7.2, 7.2, 13.5]) {
      const lampGroup = new THREE.Group();
      lampGroup.position.set(lx, 0, 1.85);

      const pole = new THREE.Mesh(poleGeo, darkCastFlangeMat);
      pole.position.y = 2.8;
      lampGroup.add(pole);

      const arm = new THREE.Mesh(armGeo, darkCastFlangeMat);
      arm.position.set(lx < 0 ? 0.4 : -0.4, 5.55, 0);
      lampGroup.add(arm);

      const bulb = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.12, 12, 12)),
        bulbMat
      );
      bulb.position.set(lx < 0 ? 0.75 : -0.75, 5.48, 0);
      lampGroup.add(bulb);

      const lightCone = new THREE.Mesh(coneGeo, volumetricConeMat);
      lightCone.position.set(lx < 0 ? 0.75 : -0.75, 2.75, 0);
      lampGroup.add(lightCone);

      scene.add(lampGroup);
    }

    // =========================================================================
    // 5. MONUMENTAL 3D '404' PIPELINE INSTALLATION (HERO CENTREPIECE)
    // =========================================================================
    const monumentRoot = new THREE.Group();
    monumentRoot.position.set(0, 0.14, -0.35);
    scene.add(monumentRoot);

    const mechanicalSegments: MechanicalSegment[] = [];
    const flowingWaterCores: FlowingWaterCore[] = [];

    const pipeRadius = 0.21;
    const flangeRadius = 0.31;
    const flangeThickness = 0.08;
    const flangeGeo = trackGeo(
      new THREE.CylinderGeometry(flangeRadius, flangeRadius, flangeThickness, 20)
    );
    const boltGeo = trackGeo(new THREE.CylinderGeometry(0.025, 0.025, 0.11, 6));

    // Helper: creates a bolted industrial flange ring
    const createBoltedFlange = () => {
      const fGroup = new THREE.Group();
      const ring = new THREE.Mesh(flangeGeo, darkCastFlangeMat);
      fGroup.add(ring);
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const bolt = new THREE.Mesh(boltGeo, chromeBoltMat);
        bolt.position.set(
          Math.cos(angle) * (flangeRadius * 0.78),
          0,
          Math.sin(angle) * (flangeRadius * 0.78)
        );
        fGroup.add(bolt);
      }
      return fGroup;
    };

    // Helper: creates a straight pipe segment (either brushed steel or transparent glass with water core)
    const addPipeSegment = (
      parent: THREE.Group,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      options: {
        transparentWater?: boolean;
        hasValve?: boolean;
        delay?: number;
        rotOffset?: THREE.Euler;
        posOffset?: THREE.Vector3;
      } = {}
    ) => {
      const segGroup = new THREE.Group();
      const startVec = new THREE.Vector3(x1, y1, 0);
      const endVec = new THREE.Vector3(x2, y2, 0);
      const midVec = startVec.clone().add(endVec).multiplyScalar(0.5);
      const length = startVec.distanceTo(endVec);

      const dir = endVec.clone().sub(startVec).normalize();
      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir
      );
      const targetRot = new THREE.Euler().setFromQuaternion(quat);

      if (options.transparentWater) {
        // Outer high-clarity glass tube
        const outerGeo = trackGeo(
          new THREE.CylinderGeometry(pipeRadius, pipeRadius, length, 24, 1, true)
        );
        const outerMesh = new THREE.Mesh(outerGeo, glassPipeMat);
        outerMesh.renderOrder = 2;
        segGroup.add(outerMesh);

        // Inner glowing electric-blue water column
        const waterMat = trackMat(
          new THREE.MeshPhysicalMaterial({
            color: 0x0284c7,
            emissive: 0x0ea5e9,
            emissiveIntensity: 1.35,
            roughness: 0.1,
            metalness: 0.1,
            transparent: true,
            opacity: 0.9,
          })
        );
        const waterGeo = trackGeo(
          new THREE.CylinderGeometry(
            pipeRadius * 0.76,
            pipeRadius * 0.76,
            length * 0.96,
            20
          )
        );
        const waterMesh = new THREE.Mesh(waterGeo, waterMat);
        waterMesh.renderOrder = 1;
        segGroup.add(waterMesh);
        flowingWaterCores.push({
          mesh: waterMesh,
          material: waterMat,
          baseEmissive: 1.35,
          phaseOffset: Math.random() * Math.PI * 2,
        });
      } else {
        const cylGeo = trackGeo(
          new THREE.CylinderGeometry(pipeRadius, pipeRadius, length, 24)
        );
        const cylMesh = new THREE.Mesh(cylGeo, brushedSteelMat);
        cylMesh.castShadow = true;
        cylMesh.receiveShadow = true;
        segGroup.add(cylMesh);
      }

      // End flanges
      const topFlange = createBoltedFlange();
      topFlange.position.y = length / 2;
      segGroup.add(topFlange);

      const botFlange = createBoltedFlange();
      botFlange.position.y = -length / 2;
      segGroup.add(botFlange);

      // Optional brass gate valve + red wheel
      if (options.hasValve) {
        const valveBody = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.28, 0.28, 0.34, 16)),
          brassValveMat
        );
        segGroup.add(valveBody);

        const stem = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.05, 0.05, 0.38, 12)),
          chromeBoltMat
        );
        stem.rotation.x = Math.PI / 2;
        stem.position.z = 0.24;
        segGroup.add(stem);

        const wheel = new THREE.Mesh(
          trackGeo(new THREE.TorusGeometry(0.22, 0.035, 10, 24)),
          redValveWheelMat
        );
        wheel.position.z = 0.42;
        segGroup.add(wheel);
      }

      const startPos = midVec
        .clone()
        .add(options.posOffset ?? new THREE.Vector3(0, 0.35, 0.45));
      const startRot = new THREE.Euler(
        targetRot.x + (options.rotOffset?.x ?? 0.45),
        targetRot.y + (options.rotOffset?.y ?? -0.55),
        targetRot.z + (options.rotOffset?.z ?? 0.35)
      );

      segGroup.position.copy(prefersReducedMotion ? midVec : startPos);
      segGroup.rotation.copy(prefersReducedMotion ? targetRot : startRot);

      parent.add(segGroup);
      mechanicalSegments.push({
        group: segGroup,
        targetPos: midVec,
        startPos,
        targetRot,
        startRot,
        delay: options.delay ?? 0.4,
      });
    };

    // Helper: creates a 90-degree industrial elbow joint
    const addElbowJoint = (
      parent: THREE.Group,
      cx: number,
      cy: number,
      rotZ: number,
      delay = 0.6
    ) => {
      const elbowGroup = new THREE.Group();
      const torusGeo = trackGeo(
        new THREE.TorusGeometry(0.32, pipeRadius, 18, 24, Math.PI / 2)
      );
      const torusMesh = new THREE.Mesh(torusGeo, brushedSteelMat);
      elbowGroup.add(torusMesh);

      const targetPos = new THREE.Vector3(cx, cy, 0);
      const targetRot = new THREE.Euler(0, 0, rotZ);
      const startPos = targetPos.clone().add(new THREE.Vector3(0, 0.25, 0.5));
      const startRot = new THREE.Euler(0.5, -0.4, rotZ + 0.6);

      elbowGroup.position.copy(prefersReducedMotion ? targetPos : startPos);
      elbowGroup.rotation.copy(prefersReducedMotion ? targetRot : startRot);
      parent.add(elbowGroup);

      mechanicalSegments.push({
        group: elbowGroup,
        targetPos,
        startPos,
        targetRot,
        startRot,
        delay,
      });
    };

    // Heavy structural mounting plinths anchoring the 404 monument to the plaza deck
    const plinthGeo = trackGeo(new THREE.BoxGeometry(0.85, 0.7, 0.85));
    for (const px of [-2.4, -0.85, 0.85, 4.1]) {
      const plinth = new THREE.Mesh(plinthGeo, darkCastFlangeMat);
      plinth.position.set(px, 0.35, 0);
      monumentRoot.add(plinth);
    }

    // --- LEFT '4' NUMERAL (x = -4.3 to -2.2, y = 0.7 to 4.3) ---
    // Upper left vertical stem (transparent water section)
    addPipeSegment(monumentRoot, -4.3, 2.3, -4.3, 4.2, {
      transparentWater: true,
      delay: 0.3,
    });
    // Horizontal crossbar of left '4'
    addPipeSegment(monumentRoot, -4.3, 2.3, -2.1, 2.3, {
      transparentWater: true,
      delay: 0.55,
    });
    // Full vertical right stem of left '4'
    addPipeSegment(monumentRoot, -2.4, 0.7, -2.4, 2.3, {
      hasValve: true,
      delay: 0.45,
    });
    addPipeSegment(monumentRoot, -2.4, 2.3, -2.4, 4.3, {
      transparentWater: true,
      delay: 0.7,
    });
    addElbowJoint(monumentRoot, -3.98, 2.62, Math.PI, 0.5);

    // --- CENTRAL '0' NUMERAL WITH INTENTIONAL DISCONNECTED JOINT (x = -0.85 to +0.85) ---
    // Left vertical column of '0' (intact, glowing blue water flowing up)
    addPipeSegment(monumentRoot, -0.85, 0.9, -0.85, 4.0, {
      transparentWater: true,
      delay: 0.6,
    });
    // Top horizontal bridge of '0' (intact, glowing blue water flowing right)
    addPipeSegment(monumentRoot, -0.85, 4.15, 0.85, 4.15, {
      transparentWater: true,
      hasValve: true,
      delay: 0.85,
    });
    // Bottom horizontal base of '0'
    addPipeSegment(monumentRoot, -0.85, 0.8, 0.85, 0.8, {
      delay: 0.5,
    });
    // Upper-right vertical section of '0' — ENDS AT y = 2.48 (OPEN DISCONNECTED FLANGE!)
    addPipeSegment(monumentRoot, 0.85, 2.48, 0.85, 4.0, {
      transparentWater: true,
      delay: 0.95,
    });
    // Lower-right vertical section of '0' — OFFSET & CANTED OUTWARD (y = 0.8 to 1.72), leaving a 0.76m visible breach!
    addPipeSegment(monumentRoot, 1.08, 0.8, 1.26, 1.72, {
      delay: 1.1,
      rotOffset: new THREE.Euler(0, 0, -0.45),
    });

    // Overhead supply feeder pipes connecting the industrial facility to the 404 monument
    addPipeSegment(monumentRoot, -4.3, 4.2, -4.3, 5.2, { delay: 0.2 });
    addPipeSegment(monumentRoot, 4.1, 4.3, 4.1, 5.2, { delay: 0.25 });

    // --- RIGHT '4' NUMERAL (x = 2.2 to 4.4, y = 0.7 to 4.3) ---
    addPipeSegment(monumentRoot, 2.2, 2.3, 2.2, 4.2, {
      transparentWater: true,
      delay: 0.5,
    });
    addPipeSegment(monumentRoot, 2.2, 2.3, 4.4, 2.3, {
      transparentWater: true,
      delay: 0.75,
    });
    addPipeSegment(monumentRoot, 4.1, 0.7, 4.1, 2.3, {
      hasValve: true,
      delay: 0.65,
    });
    addPipeSegment(monumentRoot, 4.1, 2.3, 4.1, 4.3, {
      transparentWater: true,
      delay: 0.9,
    });
    addElbowJoint(monumentRoot, 2.52, 2.62, Math.PI, 0.7);

    // =========================================================================
    // 6. FALLING WATER STREAM & DROPLETS FROM THE DISCONNECTED '0' JOINT
    // =========================================================================
    const dropletGeo = trackGeo(new THREE.SphereGeometry(0.055, 10, 10));
    dropletGeo.scale(0.72, 1.65, 0.72); // Teardrop elongation
    const dropletMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        emissive: 0x0ea5e9,
        emissiveIntensity: 1.5,
        roughness: 0.05,
        transmission: 0.8,
        transparent: true,
        opacity: 0.92,
      })
    );

    const fallingDroplets: FallingDroplet[] = [];
    const dropletCount = isMobile ? 24 : 44;
    for (let i = 0; i < dropletCount; i++) {
      const dMesh = new THREE.Mesh(dropletGeo, dropletMat);
      scene.add(dMesh);
      fallingDroplets.push({
        mesh: dMesh,
        xOffset: (Math.random() - 0.5) * 0.16,
        zOffset: (Math.random() - 0.5) * 0.16,
        progress: Math.random(),
        speed: 0.75 + Math.random() * 0.55,
      });
    }

    // =========================================================================
    // 7. REALISTIC ARTICULATED PEDESTRIANS WITH UMBRELLAS, MOTORCYCLES, CYCLISTS & CARS
    // =========================================================================
    const coatColors = [0x1e293b, 0x0f172a, 0x27272a, 0x334155, 0x1f2937];
    const umbrellaColors = [0x0f172a, 0x1e293b, 0x334155, 0x3f1d2b, 0x1e3a5f];
    const skinMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd6a37c,
        roughness: 0.65,
        metalness: 0.05,
      })
    );
    const darkPantsMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.75,
        metalness: 0.08,
      })
    );

    const pedestrians: PedestrianActor[] = [];
    const headGeo = trackGeo(new THREE.SphereGeometry(0.095, 14, 14));
    const torsoGeo = trackGeo(new THREE.CylinderGeometry(0.14, 0.17, 0.58, 14));
    const limbGeo = trackGeo(new THREE.CylinderGeometry(0.05, 0.042, 0.56, 10));
    const armGeoHuman = trackGeo(new THREE.CylinderGeometry(0.04, 0.035, 0.46, 10));
    const umbrellaCanopyGeo = trackGeo(
      new THREE.SphereGeometry(0.56, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.42)
    );
    const umbrellaShaftGeo = trackGeo(
      new THREE.CylinderGeometry(0.012, 0.012, 0.68, 8)
    );

    const createPedestrian = (
      startX: number,
      laneZ: number,
      direction: 1 | -1,
      hasUmbrella: boolean,
      coatColor: number,
      umbColor: number,
      scale = 0.88
    ) => {
      const root = new THREE.Group();
      root.position.set(startX, 0.14, laneZ);
      root.scale.setScalar(scale);
      root.rotation.y = direction === 1 ? Math.PI / 2 : -Math.PI / 2;

      const coatMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: coatColor,
          roughness: 0.55,
          metalness: 0.12,
        })
      );

      // Torso (raincoat/trenchcoat)
      const torso = new THREE.Mesh(torsoGeo, coatMat);
      torso.position.y = 0.88;
      torso.castShadow = true;
      root.add(torso);

      // Head
      const head = new THREE.Mesh(headGeo, skinMat);
      head.position.y = 1.28;
      root.add(head);

      // Left & Right Articulated Legs (pivoted at hip y = 0.58)
      const leftLeg = new THREE.Group();
      leftLeg.position.set(0, 0.58, 0.07);
      const lLegMesh = new THREE.Mesh(limbGeo, darkPantsMat);
      lLegMesh.position.y = -0.28;
      leftLeg.add(lLegMesh);
      root.add(leftLeg);

      const rightLeg = new THREE.Group();
      rightLeg.position.set(0, 0.58, -0.07);
      const rLegMesh = new THREE.Mesh(limbGeo, darkPantsMat);
      rLegMesh.position.y = -0.28;
      rightLeg.add(rLegMesh);
      root.add(rightLeg);

      // Left & Right Articulated Arms (pivoted at shoulder y = 1.12)
      const leftArm = new THREE.Group();
      leftArm.position.set(0, 1.12, 0.18);
      const lArmMesh = new THREE.Mesh(armGeoHuman, coatMat);
      lArmMesh.position.y = -0.22;
      leftArm.add(lArmMesh);
      root.add(leftArm);

      const rightArm = new THREE.Group();
      rightArm.position.set(0, 1.12, -0.18);
      const rArmMesh = new THREE.Mesh(armGeoHuman, coatMat);
      rArmMesh.position.y = -0.22;
      rightArm.add(rArmMesh);
      root.add(rightArm);

      let umbrellaGroup: THREE.Group | null = null;
      if (hasUmbrella) {
        rightArm.rotation.z = 0.65;
        umbrellaGroup = new THREE.Group();
        umbrellaGroup.position.set(0.18, 1.56, -0.08);
        umbrellaGroup.rotation.z = -0.12; // Tilted slightly forward into rain

        const umbMat = trackMat(
          new THREE.MeshStandardMaterial({
            color: umbColor,
            roughness: 0.42,
            metalness: 0.15,
            side: THREE.DoubleSide,
          })
        );
        const canopy = new THREE.Mesh(umbrellaCanopyGeo, umbMat);
        umbrellaGroup.add(canopy);

        const shaft = new THREE.Mesh(umbrellaShaftGeo, chromeBoltMat);
        shaft.position.y = -0.25;
        umbrellaGroup.add(shaft);

        root.add(umbrellaGroup);
      }

      scene.add(root);
      pedestrians.push({
        root,
        leftLeg,
        rightLeg,
        leftArm,
        rightArm,
        umbrellaGroup,
        speed: 0.95 + Math.random() * 0.45,
        direction,
        laneZ,
        phase: Math.random() * Math.PI * 2,
        boundX: 18,
      });
    };

    const pedSpecs = isMobile
      ? [
          { x: -6, z: 1.25, dir: 1 as const, umb: true },
          { x: 4, z: 1.55, dir: -1 as const, umb: true },
          { x: -2, z: -2.1, dir: 1 as const, umb: true },
          { x: 7, z: -6.5, dir: -1 as const, umb: true },
        ]
      : [
          { x: -9.5, z: 1.25, dir: 1 as const, umb: true },
          { x: -2.8, z: 1.55, dir: -1 as const, umb: true },
          { x: 3.6, z: 1.18, dir: 1 as const, umb: true },
          { x: 9.2, z: 1.62, dir: -1 as const, umb: false },
          { x: -6.4, z: -2.05, dir: 1 as const, umb: true },
          { x: 1.5, z: -2.35, dir: -1 as const, umb: true },
          { x: 8.1, z: -1.95, dir: 1 as const, umb: true },
          { x: -5.0, z: -6.6, dir: 1 as const, umb: true },
          { x: 4.5, z: -6.9, dir: -1 as const, umb: true },
        ];

    pedSpecs.forEach((p, idx) => {
      createPedestrian(
        p.x,
        p.z,
        p.dir,
        p.umb,
        coatColors[idx % coatColors.length],
        umbrellaColors[idx % umbrellaColors.length],
        p.z < -4 ? 0.78 : 0.88
      );
    });

    // --- REALISTIC ARTICULATED MOTORCYCLES WITH RIDERS, HEADLIGHTS & TAILLIGHTS ---
    const motorcycles: MotorcycleActor[] = [];
    const tireMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x090d16,
        roughness: 0.7,
        metalness: 0.2,
      })
    );
    const motoBodyMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x1e293b,
        metalness: 0.8,
        roughness: 0.22,
        clearcoat: 0.9,
      })
    );
    const headlightMat = trackMat(
      new THREE.MeshBasicMaterial({ color: 0xfef9c3 })
    );
    const taillightMat = trackMat(
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    const headlightBeamMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.11,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );

    const motoWheelGeo = trackGeo(new THREE.TorusGeometry(0.28, 0.085, 12, 24));
    const motoRimGeo = trackGeo(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 12));

    const createMotorcycle = (startX: number, laneZ: number, direction: 1 | -1) => {
      const root = new THREE.Group();
      root.position.set(startX, 0, laneZ);
      if (direction === -1) {
        root.rotation.y = Math.PI;
      }

      const chassisGroup = new THREE.Group();
      root.add(chassisGroup);

      // Front & Rear rotating wheels
      const frontWheel = new THREE.Group();
      frontWheel.position.set(0.62, 0.36, 0);
      frontWheel.add(new THREE.Mesh(motoWheelGeo, tireMat));
      const fRim = new THREE.Mesh(motoRimGeo, brushedSteelMat);
      fRim.rotation.x = Math.PI / 2;
      frontWheel.add(fRim);
      root.add(frontWheel);

      const rearWheel = new THREE.Group();
      rearWheel.position.set(-0.58, 0.36, 0);
      rearWheel.add(new THREE.Mesh(motoWheelGeo, tireMat));
      const rRim = new THREE.Mesh(motoRimGeo, brushedSteelMat);
      rRim.rotation.x = Math.PI / 2;
      rearWheel.add(rRim);
      root.add(rearWheel);

      // Sculpted tank, engine block & rear cowling
      const tank = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.95, 0.32, 0.32)),
        motoBodyMat
      );
      tank.position.set(0.02, 0.72, 0);
      chassisGroup.add(tank);

      const engine = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.48, 0.34, 0.28)),
        darkCastFlangeMat
      );
      engine.position.set(0.0, 0.46, 0);
      chassisGroup.add(engine);

      // Front fork tubes
      const fork = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.035, 0.035, 0.65, 10)),
        chromeBoltMat
      );
      fork.position.set(0.5, 0.62, 0);
      fork.rotation.z = 0.35;
      chassisGroup.add(fork);

      // Helmeted rider leaning slightly forward
      const riderTorso = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.14, 0.16, 0.56, 12)),
        darkPantsMat
      );
      riderTorso.position.set(-0.12, 1.08, 0);
      riderTorso.rotation.z = -0.42;
      chassisGroup.add(riderTorso);

      const helmet = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.135, 16, 16)),
        motoBodyMat
      );
      helmet.position.set(0.06, 1.38, 0);
      chassisGroup.add(helmet);

      // Headlight & volumetric beam cone
      const headlight = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.08, 12, 12)),
        headlightMat
      );
      headlight.position.set(0.56, 0.84, 0);
      chassisGroup.add(headlight);

      const beam = new THREE.Mesh(
        trackGeo(new THREE.ConeGeometry(0.95, 4.2, 18, 1, true)),
        headlightBeamMat
      );
      beam.rotation.z = Math.PI / 2 + 0.12;
      beam.position.set(2.55, 0.42, 0);
      chassisGroup.add(beam);

      // Red taillight
      const taillight = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.06, 0.08, 0.18)),
        taillightMat
      );
      taillight.position.set(-0.56, 0.78, 0);
      chassisGroup.add(taillight);

      scene.add(root);
      motorcycles.push({
        root,
        frontWheel,
        rearWheel,
        chassisGroup,
        speed: 4.8 + Math.random() * 1.4,
        direction,
        laneZ,
        boundX: 24,
        phase: Math.random() * Math.PI * 2,
      });
    };

    createMotorcycle(-12, 3.35, 1);
    createMotorcycle(10, 5.15, -1);
    if (!isMobile) {
      createMotorcycle(4, 3.65, 1);
    }

    // --- REALISTIC CYCLISTS WITH PEDALLING MOTION & ROTATING WHEELS ---
    const cyclists: CyclistActor[] = [];
    const bikeWheelGeo = trackGeo(new THREE.TorusGeometry(0.27, 0.032, 10, 24));

    const createCyclist = (startX: number, laneZ: number, direction: 1 | -1) => {
      const root = new THREE.Group();
      root.position.set(startX, 0, laneZ);
      if (direction === -1) {
        root.rotation.y = Math.PI;
      }

      const frontWheel = new THREE.Mesh(bikeWheelGeo, tireMat);
      frontWheel.position.set(0.48, 0.3, 0);
      root.add(frontWheel);

      const rearWheel = new THREE.Mesh(bikeWheelGeo, tireMat);
      rearWheel.position.set(-0.48, 0.3, 0);
      root.add(rearWheel);

      // Diamond tubular bicycle frame
      const topTube = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.02, 0.02, 0.75, 8)),
        brushedSteelMat
      );
      topTube.rotation.z = Math.PI / 2;
      topTube.position.set(0, 0.58, 0);
      root.add(topTube);

      const crank = new THREE.Group();
      crank.position.set(-0.05, 0.3, 0);
      root.add(crank);

      // Rider torso & helmet
      const riderBody = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.12, 0.14, 0.52, 12)),
        darkPantsMat
      );
      riderBody.position.set(-0.05, 0.98, 0);
      riderBody.rotation.z = -0.38;
      root.add(riderBody);

      const riderHelmet = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.11, 12, 12)),
        darkCastFlangeMat
      );
      riderHelmet.position.set(0.1, 1.28, 0);
      root.add(riderHelmet);

      // Articulated pedalling legs
      const leftLeg = new THREE.Group();
      leftLeg.position.set(-0.12, 0.72, 0.08);
      const lMesh = new THREE.Mesh(limbGeo, darkPantsMat);
      lMesh.position.y = -0.22;
      leftLeg.add(lMesh);
      root.add(leftLeg);

      const rightLeg = new THREE.Group();
      rightLeg.position.set(-0.12, 0.72, -0.08);
      const rMesh = new THREE.Mesh(limbGeo, darkPantsMat);
      rMesh.position.y = -0.22;
      rightLeg.add(rMesh);
      root.add(rightLeg);

      scene.add(root);
      cyclists.push({
        root,
        frontWheel,
        rearWheel,
        leftLeg,
        rightLeg,
        crank,
        speed: 2.55 + Math.random() * 0.5,
        direction,
        laneZ,
        boundX: 22,
        phase: Math.random() * Math.PI * 2,
      });
    };

    createCyclist(-5, 2.45, 1);
    if (!isMobile) {
      createCyclist(8, -5.6, -1);
    }

    // --- ENVIRONMENTAL TRAFFIC (BACKGROUND SEDANS WITH HEADLIGHTS & TAILLIGHTS) ---
    const cars: CarActor[] = [];
    const carBodyMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x111827,
        metalness: 0.75,
        roughness: 0.2,
        clearcoat: 1.0,
      })
    );
    const carWheelGeo = trackGeo(new THREE.CylinderGeometry(0.28, 0.28, 0.18, 16));

    const createCar = (startX: number, laneZ: number, direction: 1 | -1) => {
      const root = new THREE.Group();
      root.position.set(startX, 0, laneZ);
      if (direction === -1) {
        root.rotation.y = Math.PI;
      }

      const lowerBody = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(3.2, 0.52, 1.42)),
        carBodyMat
      );
      lowerBody.position.y = 0.48;
      root.add(lowerBody);

      const cabin = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(1.75, 0.46, 1.24)),
        darkCastFlangeMat
      );
      cabin.position.set(-0.15, 0.92, 0);
      root.add(cabin);

      // Headlights & Taillights
      const hlLeft = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.08, 0.12, 0.28)),
        headlightMat
      );
      hlLeft.position.set(1.6, 0.52, 0.48);
      root.add(hlLeft);

      const hlRight = hlLeft.clone();
      hlRight.position.z = -0.48;
      root.add(hlRight);

      const tailBar = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.08, 0.12, 1.28)),
        taillightMat
      );
      tailBar.position.set(-1.6, 0.56, 0);
      root.add(tailBar);

      const wheels: THREE.Object3D[] = [];
      for (const [wx, wz] of [
        [0.98, 0.72],
        [0.98, -0.72],
        [-0.98, 0.72],
        [-0.98, -0.72],
      ]) {
        const w = new THREE.Mesh(carWheelGeo, tireMat);
        w.rotation.x = Math.PI / 2;
        w.position.set(wx, 0.28, wz);
        root.add(w);
        wheels.push(w);
      }

      scene.add(root);
      cars.push({
        root,
        wheels,
        speed: 6.2 + Math.random() * 1.5,
        direction,
        laneZ,
        boundX: 30,
      });
    };

    createCar(-18, -4.2, 1);
    if (!isMobile) {
      createCar(15, 6.8, -1);
    }

    // =========================================================================
    // 8. MULTI-DEPTH ATMOSPHERIC RAIN PARTICLE SYSTEM
    // =========================================================================
    const rainCount = isMobile ? 750 : 1850;
    const rainPositions = new Float32Array(rainCount * 6);
    const rainVelocities = new Float32Array(rainCount);

    for (let i = 0; i < rainCount; i++) {
      const rx = (Math.random() - 0.5) * 34;
      const ry = Math.random() * 16;
      const rz = (Math.random() - 0.5) * 24;
      const streakLen = 0.38 + Math.random() * 0.28;

      const idx = i * 6;
      rainPositions[idx] = rx;
      rainPositions[idx + 1] = ry;
      rainPositions[idx + 2] = rz;
      rainPositions[idx + 3] = rx - 0.05;
      rainPositions[idx + 4] = ry - streakLen;
      rainPositions[idx + 5] = rz;

      rainVelocities[i] = 13 + Math.random() * 6;
    }

    const rainGeo = trackGeo(new THREE.BufferGeometry());
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
    const rainMat = trackMat(
      new THREE.LineBasicMaterial({
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.34,
        depthWrite: false,
      })
    );
    const rainLines = new THREE.LineSegments(rainGeo, rainMat);
    scene.add(rainLines);

    // Pre-warm shaders
    renderer.compile(scene, camera);

    // Pointer parallax tracking
    const pointerTarget = { x: 0, y: 0 };
    const pointerCurrent = { x: 0, y: 0 };

    const handlePointerMove = (e: PointerEvent) => {
      if (prefersReducedMotion) return;
      pointerTarget.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerTarget.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.fov = w < 768 ? 54 : 42;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // =========================================================================
    // 9. REAL-TIME KINEMATIC & ENVIRONMENTAL ANIMATION LOOP
    // =========================================================================
    const clock = new THREE.Clock();
    const lookAtTarget = new THREE.Vector3(0, 2.35, 0);
    const currentLookAt = new THREE.Vector3(-1.2, 1.8, 0);
    let animationFrameId = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const rawDelta = clock.getDelta();
      const delta = Math.min(rawDelta, 0.05);
      const motionScale = isPausedRef.current
        ? 0
        : prefersReducedMotion
        ? 0.15
        : 1.0;
      const dt = delta * motionScale;

      introElapsedRef.current += isPausedRef.current ? 0 : delta;
      const elapsed = introElapsedRef.current;

      // Update timeline phase notifications (0-2s street, 2-4s align, 4-6s leak, 6s+ live)
      const currentPhase =
        elapsed < 2.0
          ? 'street'
          : elapsed < 4.0
          ? 'align'
          : elapsed < 6.0
          ? 'leak'
          : 'live';
      if (currentPhase !== lastPhaseRef.current) {
        lastPhaseRef.current = currentPhase;
        onIntroPhaseChangeRef.current?.(currentPhase);
      }

      // 1. Controlled Cinematic Camera Choreography
      pointerCurrent.x = THREE.MathUtils.damp(
        pointerCurrent.x,
        pointerTarget.x,
        3.5,
        delta
      );
      pointerCurrent.y = THREE.MathUtils.damp(
        pointerCurrent.y,
        pointerTarget.y,
        3.5,
        delta
      );

      let desiredCamX = 0;
      let desiredCamY = isMobile ? 2.55 : 2.35;
      let desiredCamZ = isMobile ? 14.2 : 10.6;

      if (cameraPresetRef.current === 'monument') {
        desiredCamX = 0.25;
        desiredCamY = 2.55;
        desiredCamZ = isMobile ? 10.8 : 7.8;
        lookAtTarget.set(0.35, 2.4, 0);
      } else if (cameraPresetRef.current === 'street') {
        desiredCamX = -3.6;
        desiredCamY = 1.65;
        desiredCamZ = isMobile ? 14.8 : 11.8;
        lookAtTarget.set(0.4, 2.0, 0.5);
      } else {
        // Default 'cinema' preset with 0-6s smooth intro glide
        if (!prefersReducedMotion && elapsed < 2.2) {
          desiredCamX = -2.4;
          desiredCamY = 1.75;
          desiredCamZ = isMobile ? 15.6 : 12.6;
          lookAtTarget.set(-0.6, 2.0, 0.5);
        } else {
          desiredCamX = Math.sin(elapsed * 0.18) * 0.35;
          desiredCamY = (isMobile ? 2.6 : 2.35) + Math.cos(elapsed * 0.22) * 0.08;
          desiredCamZ = isMobile ? 13.8 : 10.4;
          lookAtTarget.set(0, 2.35, 0);
        }
      }

      camera.position.x = THREE.MathUtils.damp(
        camera.position.x,
        desiredCamX + pointerCurrent.x * 0.45,
        1.8,
        delta
      );
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        desiredCamY - pointerCurrent.y * 0.22,
        1.8,
        delta
      );
      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        desiredCamZ,
        1.6,
        delta
      );

      currentLookAt.x = THREE.MathUtils.damp(
        currentLookAt.x,
        lookAtTarget.x + pointerCurrent.x * 0.2,
        2.4,
        delta
      );
      currentLookAt.y = THREE.MathUtils.damp(
        currentLookAt.y,
        lookAtTarget.y - pointerCurrent.y * 0.12,
        2.4,
        delta
      );
      currentLookAt.z = THREE.MathUtils.damp(
        currentLookAt.z,
        lookAtTarget.z,
        2.4,
        delta
      );
      camera.lookAt(currentLookAt);

      // 2. Mechanical 404 Pipeline Assembly Alignment
      for (const seg of mechanicalSegments) {
        const activeTime = Math.max(0, elapsed - seg.delay);
        if (activeTime > 0 || prefersReducedMotion) {
          const lambda = prefersReducedMotion ? 20 : 2.8;
          seg.group.position.x = THREE.MathUtils.damp(
            seg.group.position.x,
            seg.targetPos.x,
            lambda,
            delta
          );
          seg.group.position.y = THREE.MathUtils.damp(
            seg.group.position.y,
            seg.targetPos.y,
            lambda,
            delta
          );
          seg.group.position.z = THREE.MathUtils.damp(
            seg.group.position.z,
            seg.targetPos.z,
            lambda,
            delta
          );

          seg.group.rotation.x = THREE.MathUtils.damp(
            seg.group.rotation.x,
            seg.targetRot.x,
            lambda,
            delta
          );
          seg.group.rotation.y = THREE.MathUtils.damp(
            seg.group.rotation.y,
            seg.targetRot.y,
            lambda,
            delta
          );
          seg.group.rotation.z = THREE.MathUtils.damp(
            seg.group.rotation.z,
            seg.targetRot.z,
            lambda,
            delta
          );
        }
      }

      // 3. Flowing Water Illumination Through Transparent Pipe Sections
      const flowRamp = prefersReducedMotion
        ? 1
        : THREE.MathUtils.clamp((elapsed - 1.2) / 2.2, 0.2, 1);
      for (const wc of flowingWaterCores) {
        const pulse =
          0.85 + 0.35 * Math.sin(elapsed * 3.8 + wc.phaseOffset);
        wc.material.emissiveIntensity = wc.baseEmissive * flowRamp * pulse;
      }
      pipelineBlueLight.intensity =
        (4.2 + Math.sin(elapsed * 3.2) * 0.9) * flowRamp;

      // 4. Falling Water Droplets from the Disconnected Central '0' Joint
      const leakOriginX = 0.85;
      const leakOriginY = 2.42;
      const leakOriginZ = -0.35;

      for (const drop of fallingDroplets) {
        drop.progress += dt * drop.speed;
        if (drop.progress >= 1) {
          drop.progress %= 1;
        }
        const t = drop.progress;
        // Parabolic gravity fall from open flange (y = 2.42) into puddle (y = 0.15)
        const y = leakOriginY - t * t * (leakOriginY - 0.15);
        const x = leakOriginX + drop.xOffset * (0.4 + t * 0.9);
        const z = leakOriginZ + drop.zOffset + t * 0.65;
        drop.mesh.position.set(x, y, z);
        const scale = 0.65 + Math.sin(t * Math.PI) * 0.45;
        drop.mesh.scale.setScalar(scale);
      }

      // 5. Concentric Puddle & Street Ripples
      for (const rip of ripples) {
        rip.phase += dt * rip.speed;
        if (rip.phase >= 1) {
          rip.phase %= 1;
        }
        const s = 0.4 + rip.phase * rip.maxScale;
        rip.mesh.scale.set(s, s, 1);
        rip.material.opacity = (1 - rip.phase) * 0.62;
      }

      for (const sRip of streetRipples) {
        sRip.phase += dt * sRip.speed;
        if (sRip.phase >= 1) {
          sRip.phase %= 1;
        }
        const s = 0.3 + sRip.phase * sRip.maxScale;
        sRip.mesh.scale.set(s, s, 1);
        sRip.material.opacity = (1 - sRip.phase) * 0.32;
      }

      // 6. Articulated Pedestrians Walking Cycle
      for (const ped of pedestrians) {
        ped.root.position.x += ped.direction * ped.speed * dt;
        if (ped.direction === 1 && ped.root.position.x > ped.boundX) {
          ped.root.position.x = -ped.boundX;
        } else if (ped.direction === -1 && ped.root.position.x < -ped.boundX) {
          ped.root.position.x = ped.boundX;
        }

        ped.phase += dt * ped.speed * 4.4;
        const stride = Math.sin(ped.phase) * 0.48;
        ped.leftLeg.rotation.z = stride;
        ped.rightLeg.rotation.z = -stride;
        ped.leftArm.rotation.z = -stride * 0.65;
        if (!ped.umbrellaGroup) {
          ped.rightArm.rotation.z = stride * 0.65;
        } else {
          ped.umbrellaGroup.position.y =
            1.56 + Math.abs(Math.sin(ped.phase)) * 0.025;
          ped.umbrellaGroup.rotation.x = Math.sin(ped.phase * 0.5) * 0.04;
        }
        // Subtle natural vertical hip bounce
        ped.root.position.y =
          0.14 + Math.abs(Math.cos(ped.phase)) * 0.025;
      }

      // 7. Motorcycles Movement, Wheel Rotation & Suspension
      for (const moto of motorcycles) {
        const dist = moto.speed * dt;
        moto.root.position.x += moto.direction * dist;
        if (moto.direction === 1 && moto.root.position.x > moto.boundX) {
          moto.root.position.x = -moto.boundX;
        } else if (
          moto.direction === -1 &&
          moto.root.position.x < -moto.boundX
        ) {
          moto.root.position.x = moto.boundX;
        }

        const wheelAngle = dist / 0.28;
        moto.frontWheel.rotation.z -= wheelAngle;
        moto.rearWheel.rotation.z -= wheelAngle;
        moto.phase += dt * 9;
        moto.chassisGroup.position.y = Math.sin(moto.phase) * 0.012;
      }

      // 8. Cyclists Movement, Pedalling & Wheel Rotation
      for (const cyc of cyclists) {
        const dist = cyc.speed * dt;
        cyc.root.position.x += cyc.direction * dist;
        if (cyc.direction === 1 && cyc.root.position.x > cyc.boundX) {
          cyc.root.position.x = -cyc.boundX;
        } else if (
          cyc.direction === -1 &&
          cyc.root.position.x < -cyc.boundX
        ) {
          cyc.root.position.x = cyc.boundX;
        }

        const wheelAngle = dist / 0.27;
        cyc.frontWheel.rotation.z -= wheelAngle;
        cyc.rearWheel.rotation.z -= wheelAngle;

        cyc.phase += dt * cyc.speed * 3.6;
        cyc.crank.rotation.z -= dt * 5;
        cyc.leftLeg.rotation.z = Math.sin(cyc.phase) * 0.52;
        cyc.rightLeg.rotation.z = Math.sin(cyc.phase + Math.PI) * 0.52;
      }

      // 9. Background Cars Movement & Wheel Spin
      for (const car of cars) {
        const dist = car.speed * dt;
        car.root.position.x += car.direction * dist;
        if (car.direction === 1 && car.root.position.x > car.boundX) {
          car.root.position.x = -car.boundX;
        } else if (car.direction === -1 && car.root.position.x < -car.boundX) {
          car.root.position.x = car.boundX;
        }
        const wRot = dist / 0.28;
        for (const w of car.wheels) {
          w.rotation.y += wRot;
        }
      }

      // 10. Multi-Depth Rain Particle Update
      if (dt > 0) {
        const posAttr = rainGeo.getAttribute('position') as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;
        for (let i = 0; i < rainCount; i++) {
          const idx = i * 6;
          const fall = rainVelocities[i] * dt;
          arr[idx + 1] -= fall;
          arr[idx + 4] -= fall;
          arr[idx] -= fall * 0.08;
          arr[idx + 3] -= fall * 0.08;

          if (arr[idx + 4] < 0) {
            const resetY = 14 + Math.random() * 3;
            const streakLen = arr[idx + 1] - arr[idx + 4];
            const resetX = (Math.random() - 0.5) * 34;
            arr[idx] = resetX;
            arr[idx + 1] = resetY;
            arr[idx + 3] = resetX - 0.05;
            arr[idx + 4] = resetY - streakLen;
          }
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      for (const g of geometries) g.dispose();
      for (const m of materials) m.dispose();
      for (const t of textures) t.dispose();

      renderer.dispose();
    };
  }, []);

  if (webglFailed) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#050913] overflow-hidden flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(14,165,233,0.22),rgba(245,158,11,0.08)_48%,transparent_75%)]" />
        <svg
          viewBox="0 0 800 360"
          className="w-full max-w-4xl opacity-45"
          fill="none"
        >
          <path
            d="M190 90 V200 H300 M270 90 V270 M370 90 H450 V175 M450 225 V270 H370 V90 M530 90 V200 H640 M610 90 V270"
            stroke="#38bdf8"
            strokeWidth="22"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="450" cy="200" r="8" fill="#7dd3fc" />
          <ellipse cx="450" cy="300" rx="65" ry="14" stroke="#38bdf8" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none"
    />
  );
}
