import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeHeroCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 50);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.replaceChildren(renderer.domElement);

    // Floating delicate particles (cream specks, caramel drops, vanilla pods)
    const count = 35;
    const group = new THREE.Group();
    scene.add(group);

    const geometries = [
      new THREE.SphereGeometry(0.12, 12, 12),
      new THREE.CylinderGeometry(0.04, 0.04, 0.25, 8),
      new THREE.DodecahedronGeometry(0.1, 0),
    ];

    const colors = [0xe88b69, 0xf6ebd7, 0x8ea66e, 0xd89e62, 0x382218];
    const materials = colors.map(
      (c) =>
        new THREE.MeshStandardMaterial({
          color: c,
          roughness: 0.4,
          metalness: 0.1,
          transparent: true,
          opacity: 0.7,
        })
    );

    const particles: { mesh: THREE.Mesh; rotSpeed: { x: number; y: number; z: number }; floatSpeed: number }[] = [];

    for (let i = 0; i < count; i++) {
      const geo = geometries[Math.floor(Math.random() * geometries.length)];
      const mat = materials[Math.floor(Math.random() * materials.length)];
      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.set(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5
      );
      mesh.scale.setScalar(Math.random() * 0.8 + 0.6);

      group.add(mesh);
      particles.push({
        mesh,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02,
        },
        floatSpeed: Math.random() * 0.005 + 0.002,
      });
    }

    const light = new THREE.DirectionalLight(0xfffaec, 2.0);
    light.position.set(3, 4, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xfff7ee, 1.2));

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Soft group tilt with mouse
      group.rotation.x += (mouseY * 0.15 - group.rotation.x) * 0.05;
      group.rotation.y += (mouseX * 0.25 - group.rotation.y) * 0.05;

      particles.forEach((p, idx) => {
        p.mesh.rotation.x += p.rotSpeed.x;
        p.mesh.rotation.y += p.rotSpeed.y;
        p.mesh.position.y += Math.sin(elapsed + idx) * p.floatSpeed;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      container.replaceChildren();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none opacity-40 z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
