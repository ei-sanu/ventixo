import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Props {
  className?: string;
  size?: number; // Optional fallback size
}

export function ThreeOrb({ className, size: initialSize }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const mount = ref.current;
    if (!mount) return;

    // Use container size if size prop is not provided
    const width = initialSize || mount.clientWidth || 420;
    const height = initialSize || mount.clientHeight || 420;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 3.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const geo = new THREE.IcosahedronGeometry(1.1, 4);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.3,
      roughness: 0.15,
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const innerGeo = new THREE.SphereGeometry(0.85, 64, 64);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xb5a8ff,
      metalness: 0.6,
      roughness: 0.2,
      transparent: true,
      opacity: 0.55,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    scene.add(inner);

    const light1 = new THREE.PointLight(0xa78bfa, 8, 10);
    light1.position.set(2, 2, 3);
    scene.add(light1);
    const light2 = new THREE.PointLight(0x60a5fa, 6, 10);
    light2.position.set(-2, -1, 2);
    scene.add(light2);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    let id = 0;
    let mx = 0,
      my = 0;
    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 0.6;
      my = (e.clientY / window.innerHeight - 0.5) * 0.6;
    };
    window.addEventListener("mousemove", onMove);

    const animate = () => {
      id = requestAnimationFrame(animate);
      mesh.rotation.y += 0.003;
      mesh.rotation.x += 0.001;
      inner.rotation.y -= 0.004;
      mesh.rotation.x += (my - mesh.rotation.x * 0.1) * 0.02;
      mesh.rotation.y += (mx - mesh.rotation.y * 0.1) * 0.02;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = initialSize || mount.clientWidth;
      const h = initialSize || mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", handleResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
    };
  }, [isClient, initialSize]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        width: initialSize ? `${initialSize}px` : "100%",
        height: initialSize ? `${initialSize}px` : "100%",
      }}
    />
  );
}
