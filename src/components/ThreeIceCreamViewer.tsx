import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Flavor, Topping, VesselType } from '../types/creamery';
import { RotateCw, Sparkles, Eye, Layers, ZoomIn } from 'lucide-react';

interface ThreeIceCreamViewerProps {
  primaryFlavor: Flavor;
  secondaryFlavor?: Flavor | null;
  tertiaryFlavor?: Flavor | null;
  scoopCount: 1 | 2 | 3;
  vessel: VesselType;
  sauces: Topping[];
  toppings: Topping[];
  interactive?: boolean;
  className?: string;
  autoRotateSpeed?: number;
  onTakeBite?: () => void;
}

// Helper to generate procedural surface texture for flavor
function createFlavorTexture(flavor: Flavor): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base gradient
  const grad = ctx.createRadialGradient(256, 256, 50, 256, 256, 350);
  grad.addColorStop(0, flavor.colorHex);
  grad.addColorStop(1, flavor.secondaryColorHex);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Add churned cream ripples
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 14;
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    const y = 60 * i + (Math.sin(i) * 30);
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(150, y + 40, 350, y - 40, 512, y + 20);
    ctx.stroke();
  }

  // Draw flavor particles
  if (flavor.particlesType === 'vanilla-specks') {
    ctx.fillStyle = 'rgba(28, 18, 12, 0.85)';
    for (let i = 0; i < 280; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      const r = Math.random() * 2 + 0.8;
      ctx.beginPath();
      ctx.arc(rx, ry, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (flavor.particlesType === 'pistachio-nuts') {
    for (let i = 0; i < 90; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      ctx.fillStyle = Math.random() > 0.4 ? '#4E6836' : '#C4A05A';
      ctx.beginPath();
      ctx.ellipse(rx, ry, Math.random() * 4 + 2, Math.random() * 3 + 1, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (flavor.particlesType === 'cocoa-nibs') {
    ctx.fillStyle = '#180B06';
    for (let i = 0; i < 120; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      const size = Math.random() * 5 + 2;
      ctx.fillRect(rx, ry, size, size);
    }
  } else if (flavor.particlesType === 'fruit-seeds') {
    ctx.fillStyle = '#FFDFC0';
    for (let i = 0; i < 110; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      ctx.beginPath();
      ctx.ellipse(rx, ry, 2, 4, Math.random() * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (flavor.particlesType === 'caramel-swirl') {
    ctx.strokeStyle = '#B36B22';
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(50, 100);
    ctx.bezierCurveTo(200, 20, 300, 480, 450, 350);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Helper to create waffle pattern texture
function createWaffleTexture(isCharcoal = false): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const baseColor = isCharcoal ? '#1F2024' : '#E8A758';
  const grooveColor = isCharcoal ? '#141416' : '#BA7A32';
  const highlightColor = isCharcoal ? '#2C2D33' : '#F7CA82';

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 256, 256);

  // Diagonal diamond grid
  ctx.strokeStyle = grooveColor;
  ctx.lineWidth = 4;
  const step = 24;
  for (let x = -256; x < 512; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 256, 256);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + 256, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }

  // Soft baked highlights inside diamonds
  ctx.fillStyle = highlightColor;
  for (let x = 0; x < 256; x += step) {
    for (let y = 0; y < 256; y += step) {
      ctx.fillRect(x + 8, y + 8, 4, 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 8);
  return texture;
}

// Generate organic scoop geometry with realistic churn folds and ruffled skirt
function createScoopGeometry(radius = 1.05): THREE.BufferGeometry {
  const geom = new THREE.SphereGeometry(radius, 48, 40);
  const pos = geom.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const origY = v.y;
    const len = v.length();

    // Churned noise displacement
    const noise =
      Math.sin(v.x * 3.5) * Math.cos(v.y * 3.5) * 0.08 +
      Math.sin(v.z * 5.2 + v.y * 2.0) * 0.04 +
      Math.sin(v.x * 9.0 + v.z * 9.0) * 0.02;

    v.normalize().multiplyScalar(len + noise);

    // Ruffled scoop skirt at the bottom base
    if (origY < -0.25) {
      const depth = -origY - 0.25;
      const angle = Math.atan2(v.z, v.x);
      const skirtFlute = Math.sin(angle * 12.0) * 0.08 + Math.cos(angle * 6.0) * 0.04;
      v.x *= 1.0 + depth * 0.65 + skirtFlute;
      v.z *= 1.0 + depth * 0.65 + skirtFlute;
      v.y += Math.sin(angle * 8.0) * 0.04;
    }

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geom.computeVertexNormals();
  return geom;
}

export const ThreeIceCreamViewer: React.FC<ThreeIceCreamViewerProps> = ({
  primaryFlavor,
  secondaryFlavor,
  tertiaryFlavor,
  scoopCount = 1,
  vessel = 'waffle-cone',
  sauces = [],
  toppings = [],
  interactive = true,
  className = '',
  autoRotateSpeed = 0.005,
  onTakeBite,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const iceCreamGroupRef = useRef<THREE.Group | null>(null);
  const toppingsGroupRef = useRef<THREE.Group | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);

  const [isRotating, setIsRotating] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isWobbling, setIsWobbling] = useState(false);
  const [cameraView, setCameraView] = useState<'front' | 'angled' | 'top'>('angled');

  // Drag interaction states
  const isDraggingRef = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const rotVelocity = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0.15, y: 0 });
  const wobbleSpring = useRef({ offset: 0, velocity: 0 });

  // Handle wobble trigger (Take a Bite / Bounce)
  const triggerWobble = useCallback(() => {
    wobbleSpring.current.velocity = 0.28;
    setIsWobbling(true);
    setTimeout(() => setIsWobbling(false), 900);
    if (onTakeBite) onTakeBite();
  }, [onTakeBite]);

  // Set camera angle preset
  const setPresetAngle = (view: 'front' | 'angled' | 'top') => {
    setCameraView(view);
    if (view === 'front') {
      targetRotation.current = { x: 0.05, y: 0 };
    } else if (view === 'angled') {
      targetRotation.current = { x: 0.25, y: 0.7 };
    } else if (view === 'top') {
      targetRotation.current = { x: 0.85, y: 0 };
    }
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const width = mount.clientWidth || 360;
    const height = mount.clientHeight || 420;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 5.4);
    cameraRef.current = camera;

    // 3. Renderer with high visual fidelity
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mount.replaceChildren(renderer.domElement);

    // 4. Lighting setup (Studio 3-point lighting for food)
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.1);
    fillLight.position.set(-4, 2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffe8d6, 1.8);
    rimLight.position.set(0, -3, -4);
    scene.add(rimLight);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    iceCreamGroupRef.current = rootGroup;

    // Toppings Group
    const toppingsGroup = new THREE.Group();
    rootGroup.add(toppingsGroup);
    toppingsGroupRef.current = toppingsGroup;

    // Soft floor shadow disc
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 64);
      grad.addColorStop(0, 'rgba(30, 20, 15, 0.28)');
      grad.addColorStop(0.5, 'rgba(30, 20, 15, 0.08)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.15;
    scene.add(shadowMesh);

    // Ambient floating sparkle dust
    const dustCount = 40;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 6;
      dustPositions[i + 1] = (Math.random() - 0.5) * 6;
      dustPositions[i + 2] = (Math.random() - 0.5) * 4;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffd9a0,
      size: 0.04,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);
    particleSystemRef.current = dustPoints;

    // Animation loop
    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Idle float & rotation
      if (isRotating && !isDraggingRef.current) {
        targetRotation.current.y += autoRotateSpeed;
      }

      // Smooth damping interpolation
      if (rootGroup) {
        rootGroup.rotation.x += (targetRotation.current.x - rootGroup.rotation.x) * 0.1;
        rootGroup.rotation.y += (targetRotation.current.y - rootGroup.rotation.y) * 0.1;

        // Apply bounce / wobble spring physics
        wobbleSpring.current.velocity -= wobbleSpring.current.offset * 25.0 * delta;
        wobbleSpring.current.velocity *= Math.max(0, 1.0 - 4.5 * delta);
        wobbleSpring.current.offset += wobbleSpring.current.velocity * delta;

        rootGroup.scale.set(
          1.0 - wobbleSpring.current.offset * 0.4,
          1.0 + wobbleSpring.current.offset * 0.8,
          1.0 - wobbleSpring.current.offset * 0.4
        );
        rootGroup.position.y = Math.sin(elapsed * 1.5) * 0.04 + wobbleSpring.current.offset * 0.3;
      }

      // Dust float
      if (dustPoints) {
        dustPoints.rotation.y = elapsed * 0.03;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!mount || !renderer || !camera) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      mount.replaceChildren();
    };
  }, []);

  // Update 3D Model elements (Vessel, Scoops, Toppings)
  useEffect(() => {
    const root = iceCreamGroupRef.current;
    if (!root) return;

    // Clean existing children
    while (root.children.length > 0) {
      const child = root.children[0];
      root.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry?.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material?.dispose();
        }
      }
    }

    // 1. BUILD VESSEL
    let vesselHeightOffset = 0;

    if (vessel === 'waffle-cone' || vessel === 'charcoal-cone') {
      const isCharcoal = vessel === 'charcoal-cone';
      const waffleTex = createWaffleTexture(isCharcoal);
      const coneGeo = new THREE.ConeGeometry(0.9, 2.3, 32, 1, true);
      const coneMat = new THREE.MeshStandardMaterial({
        map: waffleTex,
        roughness: isCharcoal ? 0.7 : 0.6,
        metalness: 0.05,
        bumpMap: waffleTex,
        bumpScale: 0.04,
        side: THREE.DoubleSide,
      });
      const coneMesh = new THREE.Mesh(coneGeo, coneMat);
      coneMesh.rotation.x = Math.PI; // Point down
      coneMesh.position.y = -1.0;
      coneMesh.castShadow = true;
      coneMesh.receiveShadow = true;
      root.add(coneMesh);

      // Baked cone rim collar
      const rimGeo = new THREE.TorusGeometry(0.88, 0.07, 16, 32);
      const rimMat = new THREE.MeshStandardMaterial({
        color: isCharcoal ? 0x222226 : 0xcc883b,
        roughness: 0.7,
      });
      const rimMesh = new THREE.Mesh(rimGeo, rimMat);
      rimMesh.rotation.x = Math.PI / 2;
      rimMesh.position.y = 0.15;
      root.add(rimMesh);

      vesselHeightOffset = 0.55;
    } else if (vessel === 'waffle-bowl') {
      const bowlTex = createWaffleTexture(false);
      const bowlGeo = new THREE.CylinderGeometry(1.4, 0.9, 0.9, 32, 1, true);
      const bowlMat = new THREE.MeshStandardMaterial({
        map: bowlTex,
        roughness: 0.6,
        side: THREE.DoubleSide,
      });
      const bowlMesh = new THREE.Mesh(bowlGeo, bowlMat);
      bowlMesh.position.y = -0.7;
      root.add(bowlMesh);

      // Fluted scalloped rim
      const rimGeo = new THREE.TorusGeometry(1.42, 0.08, 16, 40);
      const rimMat = new THREE.MeshStandardMaterial({ color: 0xd49348, roughness: 0.65 });
      const rimMesh = new THREE.Mesh(rimGeo, rimMat);
      rimMesh.rotation.x = Math.PI / 2;
      rimMesh.position.y = -0.25;
      root.add(rimMesh);

      vesselHeightOffset = 0.35;
    } else {
      // Artisan Cup / Chilled Coupe
      const cupGeo = new THREE.CylinderGeometry(1.2, 0.95, 1.1, 32);
      const cupMat = new THREE.MeshPhysicalMaterial({
        color: 0xfaf5ec,
        roughness: 0.3,
        transmission: 0.15,
        clearcoat: 0.3,
      });
      const cupMesh = new THREE.Mesh(cupGeo, cupMat);
      cupMesh.position.y = -0.7;
      root.add(cupMesh);

      // Brand ring line on cup
      const ringGeo = new THREE.CylinderGeometry(1.21, 1.2, 0.08, 32);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0x9e652e });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.y = -0.5;
      root.add(ringMesh);

      vesselHeightOffset = 0.35;
    }

    // 2. BUILD SCOOPS
    const scoopsData = [
      { flavor: primaryFlavor, y: vesselHeightOffset, scale: 1.05, rx: 0.05, rz: -0.05 },
    ];

    if (scoopCount >= 2 && secondaryFlavor) {
      scoopsData.push({
        flavor: secondaryFlavor,
        y: vesselHeightOffset + 0.95,
        scale: 0.95,
        rx: -0.1,
        rz: 0.12,
      });
    }

    if (scoopCount === 3 && tertiaryFlavor) {
      scoopsData.push({
        flavor: tertiaryFlavor,
        y: vesselHeightOffset + 1.8,
        scale: 0.88,
        rx: 0.08,
        rz: -0.08,
      });
    }

    // Adjust camera slightly if 3 scoops to fit perfectly in viewport
    if (cameraRef.current) {
      const targetY = scoopCount === 3 ? 0.8 : scoopCount === 2 ? 0.5 : 0.3;
      cameraRef.current.position.y = targetY;
      cameraRef.current.position.z = scoopCount === 3 ? 5.8 : 5.4;
    }

    scoopsData.forEach((item) => {
      const tex = createFlavorTexture(item.flavor);
      const scoopGeo = createScoopGeometry(item.scale);
      const scoopMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(item.flavor.colorHex),
        map: tex,
        bumpMap: tex,
        bumpScale: 0.035,
        roughness: item.flavor.roughness,
        metalness: 0.02,
        clearcoat: item.flavor.sheen,
        clearcoatRoughness: 0.35,
        sheen: 0.35,
        sheenColor: new THREE.Color(item.flavor.secondaryColorHex),
      });

      const scoopMesh = new THREE.Mesh(scoopGeo, scoopMat);
      scoopMesh.position.y = item.y;
      scoopMesh.rotation.x = item.rx;
      scoopMesh.rotation.z = item.rz;
      scoopMesh.castShadow = true;
      scoopMesh.receiveShadow = true;
      root.add(scoopMesh);
    });

    // 3. BUILD SAUCE DRIZZLE (Spline Ribbons down the top scoop)
    if (sauces.length > 0) {
      const topScoopY = scoopsData[scoopsData.length - 1].y;
      sauces.forEach((sauce, idx) => {
        const sauceColor = new THREE.Color(sauce.color);
        const dripCount = 4;
        for (let d = 0; d < dripCount; d++) {
          const angle = (d * (Math.PI * 2)) / dripCount + idx * 0.4;
          const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, topScoopY + 1.05, 0),
            new THREE.Vector3(Math.cos(angle) * 0.65, topScoopY + 0.8, Math.sin(angle) * 0.65),
            new THREE.Vector3(Math.cos(angle) * 1.05, topScoopY + 0.3, Math.sin(angle) * 1.05),
            new THREE.Vector3(Math.cos(angle) * 1.08, topScoopY - 0.2, Math.sin(angle) * 1.08),
            new THREE.Vector3(Math.cos(angle) * 0.98, topScoopY - 0.45, Math.sin(angle) * 0.98),
          ]);

          const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.055, 8, false);
          const tubeMat = new THREE.MeshPhysicalMaterial({
            color: sauceColor,
            roughness: 0.15,
            clearcoat: 0.9,
            clearcoatRoughness: 0.1,
            metalness: 0.1,
          });
          const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
          root.add(tubeMesh);
        }
      });
    }

    // 4. BUILD TOPPINGS (Sprinkles, crushed nuts, raspberries)
    if (toppings.length > 0) {
      const topScoopY = scoopsData[scoopsData.length - 1].y;

      toppings.forEach((t) => {
        if (t.id.includes('sprinkle') || t.id.includes('confetti')) {
          // Colorful sprinkles
          const sprinkleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.12, 6);
          const colors = [0xff4b6e, 0x48bb78, 0x4299e1, 0xf6ad55, 0xed64a6, 0xffd700];

          for (let s = 0; s < 45; s++) {
            const phi = Math.random() * Math.PI * 0.4;
            const theta = Math.random() * Math.PI * 2;
            const rad = 1.06;
            const px = rad * Math.sin(phi) * Math.cos(theta);
            const py = topScoopY + rad * Math.cos(phi);
            const pz = rad * Math.sin(phi) * Math.sin(theta);

            const mat = new THREE.MeshStandardMaterial({
              color: colors[s % colors.length],
              roughness: 0.4,
            });
            const mesh = new THREE.Mesh(sprinkleGeo, mat);
            mesh.position.set(px, py, pz);
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            root.add(mesh);
          }
        } else if (t.id.includes('pistachio') || t.id.includes('waffle') || t.id.includes('nibs')) {
          // Crumb nuggets
          const crumbGeo = new THREE.DodecahedronGeometry(0.045, 0);
          const crumbColor = new THREE.Color(t.color);

          for (let c = 0; c < 35; c++) {
            const phi = Math.random() * Math.PI * 0.45;
            const theta = Math.random() * Math.PI * 2;
            const rad = 1.07;
            const px = rad * Math.sin(phi) * Math.cos(theta);
            const py = topScoopY + rad * Math.cos(phi);
            const pz = rad * Math.sin(phi) * Math.sin(theta);

            const mat = new THREE.MeshStandardMaterial({
              color: crumbColor,
              roughness: 0.7,
            });
            const mesh = new THREE.Mesh(crumbGeo, mat);
            mesh.position.set(px, py, pz);
            mesh.scale.set(
              Math.random() * 0.8 + 0.6,
              Math.random() * 0.8 + 0.6,
              Math.random() * 0.8 + 0.6
            );
            root.add(mesh);
          }
        } else if (t.id.includes('raspberries')) {
          // Fresh mountain raspberries on crown
          const berryGeo = new THREE.SphereGeometry(0.18, 12, 12);
          const berryMat = new THREE.MeshPhysicalMaterial({
            color: 0x9e122b,
            roughness: 0.35,
            clearcoat: 0.5,
          });
          const berryMesh1 = new THREE.Mesh(berryGeo, berryMat);
          berryMesh1.position.set(0.15, topScoopY + 1.1, 0.1);
          root.add(berryMesh1);

          const berryMesh2 = new THREE.Mesh(berryGeo, berryMat);
          berryMesh2.position.set(-0.25, topScoopY + 1.05, -0.05);
          berryMesh2.scale.setScalar(0.85);
          root.add(berryMesh2);
        }
      });
    }
  }, [primaryFlavor, secondaryFlavor, tertiaryFlavor, scoopCount, vessel, sauces, toppings]);

  // Pointer Drag interactions
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    isDraggingRef.current = true;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!interactive || !isDraggingRef.current) return;
    const deltaX = e.clientX - prevMousePos.current.x;
    const deltaY = e.clientY - prevMousePos.current.y;
    prevMousePos.current = { x: e.clientX, y: e.clientY };

    targetRotation.current.y += deltaX * 0.009;
    targetRotation.current.x = Math.max(-0.4, Math.min(0.9, targetRotation.current.x + deltaY * 0.009));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!interactive) return;
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={`relative select-none overflow-hidden rounded-2xl bg-gradient-to-b from-[#F9F5EC] to-[#F1EADF] border border-[#E8DEC8] ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Canvas Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={triggerWobble}
      />

      {/* Interactive HUD Controls (Frosted Glass Overlay) */}
      {interactive && (
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Flavor Name & Italian Designation */}
          <div className="bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-stone-200/80 shadow-xs pointer-events-auto">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: primaryFlavor.colorHex }}
              />
              <span className="text-xs font-semibold text-stone-900 tracking-tight">
                {primaryFlavor.name}
              </span>
            </div>
            <p className="text-[10px] text-stone-500 font-serif italic">
              {primaryFlavor.italianName}
            </p>
          </div>

          {/* Quick Camera & Spin Tools */}
          <div className="flex items-center gap-1.5 bg-white/85 backdrop-blur-md p-1 rounded-xl border border-stone-200/80 shadow-xs pointer-events-auto">
            <button
              onClick={() => setIsRotating((prev) => !prev)}
              title={isRotating ? 'Pause rotation' : 'Auto rotate'}
              className={`p-1.5 rounded-lg transition-colors ${
                isRotating ? 'text-amber-800 bg-amber-50' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            </button>
            <button
              onClick={() => setPresetAngle('angled')}
              title="Angled Perspective"
              className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-colors ${
                cameraView === 'angled' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              3D
            </button>
            <button
              onClick={() => setPresetAngle('top')}
              title="Top Crown View"
              className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-colors ${
                cameraView === 'top' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Top
            </button>
          </div>
        </div>
      )}

      {/* Bottom Interactive Prompt */}
      {interactive && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
          <button
            onClick={triggerWobble}
            className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-800 bg-white/90 backdrop-blur-md rounded-full border border-stone-200 shadow-xs hover:bg-amber-50 hover:text-amber-900 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Click to Bounce Scoop</span>
          </button>
        </div>
      )}

      {/* Flavor Color Swatch Pill Indicator */}
      <div className="absolute bottom-3 left-3 text-[11px] text-stone-500 pointer-events-none hidden sm:flex items-center gap-1.5">
        <span>360° Realtime Churn View</span>
      </div>
    </div>
  );
};
