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
  Minimize2,
  Eye,
  Activity,
  Zap,
  Gauge,
  Info,
  Flame,
  Droplet
} from "lucide-react";

export const LabCanvas3D: React.FC<Lab3DProps> = ({ lessonId, params }) => {
  const containerWrapperRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [currentPreset, setCurrentPreset] = useState<CameraPreset>("isometric");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTelemetry, setShowTelemetry] = useState(true);

  // References to keep Three.js instances stable across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneGroupRef = useRef<THREE.Group | null>(null);
  const reqIdRef = useRef<number | null>(null);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  // Camera preset handler
  const applyPreset = (preset: CameraPreset) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    const isEngine = lessonId === "engines-cycles";
    const isCar = lessonId === "car-engine-systems";
    const targetY = isEngine ? 2.0 : 1.2;

    switch (preset) {
      case "isometric":
        if (isEngine) cam.position.set(4.2, 2.8, 5.2);
        else if (isCar) cam.position.set(5.2, 3.6, 5.8);
        else cam.position.set(6, 5, 7);
        ctrl.target.set(0, targetY, 0);
        break;
      case "front":
        cam.position.set(0, targetY, isEngine ? 6.5 : 8);
        ctrl.target.set(0, targetY, 0);
        break;
      case "top":
        cam.position.set(0, 8.5, 0.001);
        ctrl.target.set(0, 0, 0);
        break;
      case "side":
        cam.position.set(isEngine ? 6.5 : 8, targetY, 0);
        ctrl.target.set(0, targetY, 0);
        break;
      case "reset":
        if (isEngine) cam.position.set(4.2, 2.8, 5.2);
        else if (isCar) cam.position.set(5.2, 3.6, 5.8);
        else cam.position.set(6, 5, 7);
        ctrl.target.set(0, targetY, 0);
        setAutoRotate(false);
        break;
    }
    ctrl.update();
    setCurrentPreset(preset);
  };

  // TRUE NATIVE FULLSCREEN TOGGLE
  const toggleFullscreen = () => {
    const el = containerWrapperRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {
          setIsFullscreen(true);
        });
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
      } else {
        setIsFullscreen(!isFullscreen);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {
          setIsFullscreen(false);
        });
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else {
        setIsFullscreen(false);
      }
    }
  };

  // Listen to native fullscreen changes and re-size Three.js
  useEffect(() => {
    const handleFsChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
      setTimeout(() => {
        if (mountRef.current && cameraRef.current && rendererRef.current) {
          const w = mountRef.current.clientWidth;
          const h = mountRef.current.clientHeight;
          if (w > 0 && h > 0) {
            cameraRef.current.aspect = w / h;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(w, h);
          }
        }
      }, 80);
    };

    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.025);
    sceneRef.current = scene;

    // 2. Camera Framing
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);

    const isEngineLesson = lessonId === "engines-cycles";
    const isCarLesson = lessonId === "car-engine-systems";

    if (isEngineLesson) {
      camera.position.set(4.2, 2.8, 5.2);
    } else if (isCarLesson) {
      camera.position.set(5.2, 3.6, 5.8);
    } else {
      camera.position.set(6, 5, 7);
    }
    cameraRef.current = camera;

    // 3. Renderer with high color fidelity
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, isEngineLesson ? 2.0 : 1.2, 0);
    controls.maxPolarAngle = Math.PI / 2 + 0.15;
    controls.minDistance = 1.5;
    controls.maxDistance = 22;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.5;
    controlsRef.current = controls;

    // 5. Rich Multi-Source Studio Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambient);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 1.3);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.4);
    dirLight1.position.set(8, 14, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.1);
    dirLight2.position.set(-8, 6, -8);
    scene.add(dirLight2);

    const frontLight = new THREE.PointLight(0xffffff, 1.6, 22);
    frontLight.position.set(0, 4, 8);
    scene.add(frontLight);

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

  // =========================================================================
  // LIVE STUDENT TELEMETRY & PHYSICAL REACTION COMPUTATION
  // انعكاس تأثير التجربة على المتغيرات التي يقوم بها الطالب فورياً بالمعادلات
  // =========================================================================
  const renderLiveTelemetry = () => {
    if (lessonId === "engines-cycles") {
      const isPlaying = params.enginePlaying !== false;
      const stroke = params.engineStroke || 0;
      const speed = params.engineSpeed || 1;

      const strokeData = [
        { name: "شوط السحب (Intake)", p: "-0.1 bar (سحب)", v: "800 سم³", t: "25°C", inVal: "مفتوح ✓", exVal: "مغلق ✗", desc: "دخول خليط الهواء والوقود", color: "text-cyan-400" },
        { name: "شوط الضغط (Compression)", p: "9.5 kg/cm²", v: "100 سم³", t: "380°C", inVal: "مغلق ✗", exVal: "مغلق ✗", desc: "انضغاط الخليط بنسبة 1 : 8", color: "text-purple-400" },
        { name: "شوط القدرة (Power)", p: "42.0 kg/cm² (ذروة)", v: "متمدد", t: "1950°C", inVal: "مغلق ✗", exVal: "مغلق ✗", desc: "شرارة البوجيه وتوليد القدرة W > 0", color: "text-amber-400" },
        { name: "شوط العادم (Exhaust)", p: "1.2 bar", v: "طرد", t: "550°C", inVal: "مغلق ✗", exVal: "مفتوح ✓", desc: "خروج غازات الاحتراق العادمة", color: "text-rose-400" },
      ];
      const cur = strokeData[stroke % 4];

      return (
        <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-cyan-500/30 text-xs text-slate-200 shadow-2xl space-y-2 max-w-xs">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5">
            <span className="font-bold flex items-center gap-1.5 text-cyan-300 text-[11px]">
              <Gauge className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>لوحة القياس الفيزيائية الحية للمحرك</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40">
              {isPlaying ? `${Math.round(speed * 1200)} RPM` : "وضع الفحص اليدوي"}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-[10px]">الشوط النشط:</span>
              <span className={`font-bold font-mono text-[11px] ${cur.color}`}>{cur.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-[10px]">الضغط الداخلي (P):</span>
              <span className="font-mono font-bold text-amber-300 text-[11px]">{cur.p}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-[10px]">درجة الحرارة (T):</span>
              <span className="font-mono font-bold text-rose-300 text-[11px]">{cur.t}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-[10px]">حجم الأسطوانة (V):</span>
              <span className="font-mono font-bold text-emerald-300 text-[11px]">{cur.v}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-800 text-[10px]">
              <span className="text-slate-400">صمام السحب: <span className="font-bold text-cyan-300">{cur.inVal}</span></span>
              <span className="text-slate-400">صمام العادم: <span className="font-bold text-rose-300">{cur.exVal}</span></span>
            </div>
          </div>

          <div className="text-[10px] bg-slate-950/80 p-1.5 rounded-lg text-slate-300 leading-relaxed border border-slate-800">
            💡 {cur.desc}
          </div>
        </div>
      );
    }

    if (lessonId === "car-engine-systems") {
      const activeSys = params.activeCarSystem || "fuel";
      const ratio = params.carburetorRatio || 15;
      const radTemp = params.radiatorTemp || 90;

      return (
        <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-cyan-500/30 text-xs text-slate-200 shadow-2xl space-y-2 max-w-xs">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5">
            <span className="font-bold flex items-center gap-1.5 text-cyan-300 text-[11px]">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>مراقبة حالة النظام النشط</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40">
              {activeSys === "fuel" ? "دورة الوقود" : activeSys === "cooling" ? "دورة التبريد" : activeSys === "lube" ? "دورة التزييت" : "دورة الإشعال"}
            </span>
          </div>

          {activeSys === "fuel" && (
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-400">نسبة الهواء إلى الوقود:</span>
                <span className="font-mono font-bold text-amber-300 text-[11px]">1 : {ratio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">كفاءة الاحتراق:</span>
                <span className="font-bold text-emerald-400">{ratio === 15 ? "100% (احتراق تام واقتصادي)" : ratio < 13 ? "غير تام (دخان أسود)" : "تسخين زائد للمحرك"}</span>
              </div>
              <div className="text-[10px] bg-slate-950/80 p-1.5 rounded-lg text-slate-300 border border-slate-800">
                {ratio === 15 ? "✅ النسبة المثالية لكتاب بخت الرضا: 1 كجم بنزين لكل 15 كجم هواء." : ratio < 13 ? "⚠️ خلط غني: إهدار للبنزين وتكربن شمعات الاشتعال." : "⚠️ خلط فقير: حرارة مرتفعة قد تؤدي لتلف الصمامات."}
              </div>
            </div>
          )}

          {activeSys === "cooling" && (
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-400">حرارة سائل الرديتر:</span>
                <span className={`font-mono font-bold text-[11px] ${radTemp > 95 ? "text-rose-400" : "text-cyan-300"}`}>{radTemp}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">حالة مروحة التبريد:</span>
                <span className="font-bold text-emerald-400">دوران سريع {radTemp > 95 ? "(طاقة قصوى)" : "(طبيعي)"}</span>
              </div>
              <div className="text-[10px] bg-slate-950/80 p-1.5 rounded-lg text-slate-300 border border-slate-800">
                {radTemp > 95 ? "⚠️ تحذير: غليان الماء وصمام غطاء الرديتر ينفس البخار لتفادي انفجار الخراطيم!" : "✅ درجة حرارة التشغيل القياسية للمحرك (190°F - 230°F)."}
              </div>
            </div>
          )}

          {activeSys === "lube" && (
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-400">ضغط الزيت بالكارتير:</span>
                <span className="font-mono font-bold text-emerald-300 text-[11px]">4.2 bar (طبيعي)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">حالة الفلتر والسيخ:</span>
                <span className="font-bold text-amber-300">مستوى الزيت مثالي (Full)</span>
              </div>
              <div className="text-[10px] bg-slate-950/80 p-1.5 rounded-lg text-slate-300 border border-slate-800">
                💡 التزييت يمنع الاحتكاك المباشر بين المكبس والأسطوانة ويبرد كراسي التحميل.
              </div>
            </div>
          )}

          {activeSys === "ignition" && (
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-400">ترتيب الإشعال المعتمد:</span>
                <span className="font-mono font-bold text-cyan-300 text-[11px]">1 - 3 - 4 - 2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">جهد البوبينة المرتفع:</span>
                <span className="font-mono font-bold text-amber-300 text-[11px]">15,000 - 25,000 V</span>
              </div>
              <div className="text-[10px] bg-slate-950/80 p-1.5 rounded-lg text-slate-300 border border-slate-800">
                ⚡ الديلكو يوزع الشرارة في توقيتها الدقيق بنهاية شوط الضغط لإشعال الخليط.
              </div>
            </div>
          )}
        </div>
      );
    }

    if (lessonId === "ortho-principles") {
      const angle = params.orthoAngle ?? 0;
      const factor = Math.cos((angle * Math.PI) / 180);
      return (
        <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-cyan-500/30 text-xs text-slate-200 shadow-2xl space-y-1.5 max-w-xs">
          <span className="font-bold text-cyan-300 text-[11px] block border-b border-slate-700/60 pb-1">الحساب الهندسي المباشر للمسقط</span>
          <div className="flex justify-between text-[10px]">
            <span className="text-slate-400">زاوية الميل (θ):</span>
            <span className="font-mono font-bold text-amber-300">{angle}°</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-slate-400">نسبة الطول الظاهر (جتا θ):</span>
            <span className="font-mono font-bold text-emerald-300">{(factor * 100).toFixed(1)}%</span>
          </div>
          <div className="text-[9px] bg-slate-950/80 p-1.5 rounded-lg text-slate-300">
            {angle === 0 ? "يوازي المستوى: يظهر بطوله الحقيقي الكامل (جتا 0 = 1)." : angle === 90 ? "عمودي على المستوى: يظهر كنقطة مسقطية (جتا 90 = 0)." : `مائل: ينكمش الطول إلى ${(factor).toFixed(2)} من الطول الحقيقي.`}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      ref={containerWrapperRef}
      className={`relative w-full rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-950 shadow-2xl transition-all duration-300 ${
        isFullscreen ? "fixed inset-0 z-[99999] w-screen h-screen rounded-none" : "h-[540px]"
      }`}
    >
      {/* 3D WebGL Canvas mount container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD bar: 3D Badge & Action Buttons */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/40 text-xs text-cyan-300 font-semibold shadow-lg pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>معمل نقلة 3D التفاعلي الحقيقي</span>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
            دوران 360°
          </span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setShowTelemetry(!showTelemetry)}
            title="إظهار / إخفاء لوحة القياسات الحية"
            className={`p-2 rounded-xl border backdrop-blur-md text-xs transition-all ${
              showTelemetry
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-400 font-bold"
                : "bg-slate-900/80 text-slate-400 border-slate-700"
            }`}
          >
            <Gauge className="w-4 h-4" />
          </button>
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
            onClick={toggleFullscreen}
            title={isFullscreen ? "تصغير الشاشة" : "تكبير ملء الشاشة"}
            className={`p-2 rounded-xl border backdrop-blur-md text-xs transition-all ${
              isFullscreen
                ? "bg-cyan-500 text-slate-950 border-cyan-400"
                : "bg-slate-900/80 text-slate-300 border-slate-700 hover:border-cyan-500"
            }`}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Floating Live Telemetry Panel (انعكاس تأثير التجربة على المتغيرات) */}
      {showTelemetry && (
        <div className="absolute top-14 right-3 pointer-events-auto z-20 transition-all">
          {renderLiveTelemetry()}
        </div>
      )}

      {/* Bottom Floating Toolbar: Camera Presets */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-cyan-500/30 shadow-2xl z-20">
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

      {/* Touch / Mouse Interaction Hint */}
      <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800/80 pointer-events-none z-10">
        <span>اسحب للتدوير 360° • عجلة الفأرة للتقريب</span>
      </div>
    </div>
  );
};
