import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Lab3DProps, CameraPreset } from "./types";
import { buildChapter1Scene } from "./scenes/Chapter1Scenes";
import { buildChapter2Scene } from "./scenes/Chapter2Scenes";
import { buildChapter3Scene } from "./scenes/Chapter3Scenes";
import { buildChapter4Scene } from "./scenes/Chapter4Scenes";
import {
  RotateCcw,
  Compass,
  Maximize2,
  Eye,
  Layers,
  Sparkles,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

export const LabCanvas3D: React.FC<Lab3DProps> = ({ lessonId, params }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [currentPreset, setCurrentPreset] = useState<CameraPreset>("isometric");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // References to keep Three.js instances stable across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneGroupRef = useRef<THREE.Group | null>(null);
  const reqIdRef = useRef<number | null>(null);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  // Set camera view preset
  const applyPreset = (preset: CameraPreset) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;

    switch (preset) {
      case "isometric":
        cam.position.set(6, 5, 7);
        ctrl.target.set(0, 1.2, 0);
        break;
      case "front":
        cam.position.set(0, 1.5, 9);
        ctrl.target.set(0, 1.5, 0);
        break;
      case "top":
        cam.position.set(0, 9, 0.001);
        ctrl.target.set(0, 0, 0);
        break;
      case "side":
        cam.position.set(9, 1.5, 0);
        ctrl.target.set(0, 1.5, 0);
        break;
      case "reset":
        cam.position.set(6, 5, 7);
        ctrl.target.set(0, 1.2, 0);
        setAutoRotate(false);
        break;
    }
    ctrl.update();
    setCurrentPreset(preset);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d); // Deep blueprint dark space
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.03);
    sceneRef.current = scene;

    // 2. Camera
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(6, 5, 7);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.2, 0);
    controls.maxPolarAngle = Math.PI / 2 + 0.15; // Don't flip below floor
    controls.minDistance = 2;
    controls.maxDistance = 22;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.5;
    controlsRef.current = controls;

    // 5. Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(8, 14, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.8);
    dirLight2.position.set(-8, -4, -8);
    scene.add(dirLight2);

    // 6. Engineering Grid Floor
    const gridHelper = new THREE.GridHelper(16, 32, 0x0284c7, 0x1e293b);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // 7. Interactive Experiment Scene Group
    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);
    sceneGroupRef.current = sceneGroup;

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Dispatch scene builders based on active lessonId
      if (sceneGroupRef.current) {
        const id = lessonId;
        if (
          [
            "intro-projection",
            "ortho-principles",
            "three-planes",
            "isometric-oblique",
            "dim-1-1",
            "sketch-1-2",
          ].includes(id)
        ) {
          buildChapter1Scene(sceneGroupRef.current, id, paramsRef.current, elapsedTime);
        } else if (
          [
            "metals-intro",
            "iron-production",
            "steel-rolling",
            "non-ferrous-alloys",
            "engines-cycles",
            "car-engine-systems",
          ].includes(id)
        ) {
          buildChapter2Scene(sceneGroupRef.current, id, paramsRef.current, elapsedTime);
        } else if (
          [
            "electrical-units",
            "capacitors",
            "electromagnetism-induction",
            "self-inductance",
            "semiconductors-doping",
          ].includes(id)
        ) {
          buildChapter3Scene(sceneGroupRef.current, id, paramsRef.current, elapsedTime);
        } else if (
          [
            "structures-trusses",
            "arches-foundations",
            "stress-strain-hooke",
            "fluid-mechanics-viscosity",
            "environmental-pollution",
          ].includes(id)
        ) {
          buildChapter4Scene(sceneGroupRef.current, id, paramsRef.current, elapsedTime);
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [lessonId]);

  // Sync autoRotate state
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-950 shadow-2xl transition-all duration-300 ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none h-screen" : "h-[500px]"
      }`}
    >
      {/* 3D WebGL Canvas mount container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD bar: 3D Badge & Status */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/40 text-xs text-cyan-300 font-semibold shadow-lg pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>معمل نقلة 3D التفاعلي (WebGL)</span>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
            دوران 360°
          </span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title="تدوير تلقائي 360°"
            className={`p-2 rounded-xl border backdrop-blur-md text-xs transition-all ${
              autoRotate
                ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold"
                : "bg-slate-900/80 text-slate-300 border-slate-700 hover:border-cyan-500"
            }`}
          >
            <Compass className={`w-4 h-4 ${autoRotate ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="تكبير الشاشة"
            className="p-2 rounded-xl border border-slate-700 bg-slate-900/80 hover:border-cyan-500 text-slate-300 backdrop-blur-md transition-all"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Floating Toolbar: Camera Presets */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md px-3 py-2 rounded-2xl border border-cyan-500/30 shadow-2xl">
        <span className="text-[11px] text-slate-400 font-medium pl-1 ml-1 border-l border-slate-700 flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          زوايا النظر:
        </span>
        <button
          onClick={() => applyPreset("isometric")}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            currentPreset === "isometric"
              ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
              : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          أيزومتري
        </button>
        <button
          onClick={() => applyPreset("front")}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            currentPreset === "front"
              ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
              : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          أمامي
        </button>
        <button
          onClick={() => applyPreset("top")}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            currentPreset === "top"
              ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
              : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          علوي
        </button>
        <button
          onClick={() => applyPreset("side")}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            currentPreset === "side"
              ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
              : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          جانبي
        </button>
        <button
          onClick={() => applyPreset("reset")}
          title="إعادة ضبط الكاميرا"
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all mr-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Touch / Mouse Interaction Hint (fades out or subtle) */}
      <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800/80 pointer-events-none">
        <span>اسحب للتدوير 360° • عجلة الفأرة للتقريب</span>
      </div>
    </div>
  );
};
