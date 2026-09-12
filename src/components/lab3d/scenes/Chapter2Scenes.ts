import * as THREE from "three";
import { Lab3DProps } from "../types";

export function buildChapter2Scene(
  sceneGroup: THREE.Group,
  lessonId: string,
  params: Lab3DProps["params"],
  time: number
) {
  // Clear existing meshes
  while (sceneGroup.children.length > 0) {
    const obj = sceneGroup.children[0];
    sceneGroup.remove(obj);
    if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
  }

  // Helper to create high-resolution 3D sprite label
  const createLabel = (text: string, pos: THREE.Vector3, color: string = "#38bdf8", scale: number = 1.3) => {
    const canvas = document.createElement("canvas");
    canvas.width = 384;
    canvas.height = 80;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "rgba(10, 15, 29, 0.88)";
      ctx.roundRect(6, 6, 372, 68, 16);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3.5;
      ctx.roundRect(6, 6, 372, 68, 16);
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px 'Tajawal', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 192, 40);
    }
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.copy(pos);
    sprite.scale.set(scale * 1.5, scale * 0.35, 1);
    return sprite;
  };

  switch (lessonId) {
    // -------------------------------------------------------------
    // LESSON 7: خواص واختبارات الفلزات (Metals Properties & Bench Testing)
    // -------------------------------------------------------------
    case "metals-intro": {
      const benchGroup = new THREE.Group();

      // Heavy Industrial Workbench with wood/steel top and tool drawer
      const topGeo = new THREE.BoxGeometry(8, 0.4, 4.5);
      const topMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.6 });
      const tableTop = new THREE.Mesh(topGeo, topMat);
      tableTop.position.y = -0.2;
      benchGroup.add(tableTop);

      // Table legs with cross braces
      const legGeo = new THREE.BoxGeometry(0.3, 2.0, 0.3);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
      [
        [-3.6, -1.2, -1.9],
        [3.6, -1.2, -1.9],
        [-3.6, -1.2, 1.9],
        [3.6, -1.2, 1.9],
      ].forEach(([x, y, z]) => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(x, y, z);
        benchGroup.add(leg);
      });

      // Bench Vise (منجلة حدادة متينة على جانب الطاولة)
      const viseGroup = new THREE.Group();
      viseGroup.position.set(2.8, 0.2, 1.4);
      const viseBase = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.3, 16), legMat);
      viseGroup.add(viseBase);
      const viseJaw1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.3), legMat);
      viseJaw1.position.set(0, 0.4, 0);
      viseGroup.add(viseJaw1);
      const viseJaw2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.3), legMat);
      viseJaw2.position.set(0, 0.4, 0.4);
      viseGroup.add(viseJaw2);
      benchGroup.add(viseGroup);

      // Specimen material properties based on selected metal
      const metalType = params.metalType || "steel";
      let specimenColor = 0xcbd5e1;
      let metalness = 0.95;
      let roughness = 0.2;
      let isMagnetic = true;
      let matName = "صلب كربوني (Steel)";

      if (metalType === "steel") {
        specimenColor = 0xcbd5e1;
        metalness = 0.95;
        roughness = 0.2;
        isMagnetic = true;
        matName = "صلب كربوني (Steel)";
      } else if (metalType === "cast-iron") {
        specimenColor = 0x3f3f46;
        metalness = 0.65;
        roughness = 0.75;
        isMagnetic = true;
        matName = "حديد زهر (Cast Iron)";
      } else if (metalType === "copper") {
        specimenColor = 0xb45309;
        metalness = 0.9;
        roughness = 0.3;
        isMagnetic = false;
        matName = "نحاس أحمر (Copper)";
      } else if (metalType === "aluminum") {
        specimenColor = 0xf1f5f9;
        metalness = 0.85;
        roughness = 0.15;
        isMagnetic = false;
        matName = "ألومنيوم (Aluminum)";
      }

      const testType = params.metalTestType || "magnet";

      // 1. REALISTIC TEST SPECIMEN (قطعة الاختبار الميكانيكية ذات الحواف المشطوفة)
      const specGroup = new THREE.Group();
      specGroup.position.set(-1.6, 0.35, 0);

      const specBody = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.7, 1.2),
        new THREE.MeshStandardMaterial({
          color: specimenColor,
          metalness,
          roughness,
        })
      );
      specGroup.add(specBody);
      benchGroup.add(specGroup);
      benchGroup.add(createLabel(matName, new THREE.Vector3(-1.6, 1.1, 0), "#10b981"));

      // 2. APPARATUS BASED ON TEST TYPE
      if (testType === "magnet") {
        // Detailed Horseshoe Magnet with steel keeper and pole marks
        const magnetArm = new THREE.Group();
        const lowerAnim = Math.sin(time * 2.5) * 0.45;
        magnetArm.position.set(-1.6, 2.2 + lowerAnim, 0);

        // Curved red horseshoe arch
        const archGeo = new THREE.TorusGeometry(0.7, 0.18, 16, 32, Math.PI);
        const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.6, roughness: 0.3 });
        const arch = new THREE.Mesh(archGeo, redMat);
        arch.rotation.z = Math.PI;
        magnetArm.add(arch);

        // North pole leg (Red)
        const poleN = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.6, 0.36), redMat);
        poleN.position.set(-0.7, -0.3, 0);
        magnetArm.add(poleN);

        // South pole leg (Blue)
        const blueMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.6, roughness: 0.3 });
        const poleS = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.6, 0.36), blueMat);
        poleS.position.set(0.7, -0.3, 0);
        magnetArm.add(poleS);

        // Silver pole tips
        const tipMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95 });
        const tipN = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.15, 0.38), tipMat);
        tipN.position.set(-0.7, -0.65, 0);
        magnetArm.add(tipN);
        const tipS = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.15, 0.38), tipMat);
        tipS.position.set(0.7, -0.65, 0);
        magnetArm.add(tipS);

        // Magnetic Attraction Action!
        if (isMagnetic && lowerAnim < -0.1) {
          specGroup.position.y = 0.35 + (-0.1 - lowerAnim) * 1.6;
          // Magnetic flux loops
          const fluxPts = [
            new THREE.Vector3(-0.7, magnetArm.position.y - 0.7, 0),
            new THREE.Vector3(-0.4, specGroup.position.y + 0.35, 0),
            new THREE.Vector3(0.4, specGroup.position.y + 0.35, 0),
            new THREE.Vector3(0.7, magnetArm.position.y - 0.7, 0),
          ];
          const fluxGeo = new THREE.BufferGeometry().setFromPoints(fluxPts);
          const fluxMat = new THREE.LineBasicMaterial({ color: 0x38bdf8 });
          benchGroup.add(new THREE.Line(fluxGeo, fluxMat));
        }

        benchGroup.add(magnetArm);
        benchGroup.add(createLabel(isMagnetic ? "قابل للجذب المغناطيسي (فولاذي)" : "غير مغناطيسي (لا يتأثر)", new THREE.Vector3(-1.6, 3.2, 0), isMagnetic ? "#38bdf8" : "#f43f5e"));
      } else if (testType === "spark") {
        // High-Speed Workshop Bench Grinder (حجر جلخ كهربائي مزدوج مع واقي شرر)
        const grinder = new THREE.Group();
        grinder.position.set(1.0, 1.1, 0);

        // Electric Motor housing
        const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 1.6, 24), new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.8 }));
        motor.rotation.z = Math.PI / 2;
        grinder.add(motor);

        // Cast wheel guard
        const guardMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85 });
        const guard = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.35, 24, 1, false, 0, Math.PI * 1.5), guardMat);
        guard.rotation.z = Math.PI / 2;
        guard.position.set(-0.9, 0, 0);
        grinder.add(guard);

        // Spinning abrasive disc
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.95 });
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.28, 32), wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.rotation.x = time * 30; // High speed rotation
        wheel.position.set(-0.9, 0, 0);
        grinder.add(wheel);

        // Move specimen directly in contact with the spinning wheel
        specGroup.position.set(-0.3, 1.1, 0);

        // Dynamic sparks burst
        if (metalType === "steel" || metalType === "cast-iron") {
          const sparkCount = metalType === "steel" ? 50 : 25;
          const sparkPts: THREE.Vector3[] = [];
          for (let s = 0; s < sparkCount; s++) {
            const spread = (Math.random() - 0.5) * 0.5;
            const dist = 0.5 + Math.random() * (metalType === "steel" ? 3.0 : 1.4);
            sparkPts.push(new THREE.Vector3(0.05, 1.1, 0));
            sparkPts.push(new THREE.Vector3(0.05 - dist, 1.1 - dist * 0.4 + spread, (Math.random() - 0.5) * 0.7));
          }
          const sparkGeo = new THREE.BufferGeometry().setFromPoints(sparkPts);
          const sparkMat = new THREE.LineBasicMaterial({ color: metalType === "steel" ? 0xfacc15 : 0xf97316 });
          benchGroup.add(new THREE.LineSegments(sparkGeo, sparkMat));
        }

        benchGroup.add(grinder);
        benchGroup.add(createLabel(metalType === "steel" ? "شرر كثيف متفرع (صلب كربوني)" : metalType === "cast-iron" ? "شرر أحمر باهت كروي (زهر)" : "عدم تطاير الشرر (فلز غير حديدي)", new THREE.Vector3(0, 2.5, 0), "#f59e0b"));
      } else if (testType === "density") {
        // Archimedes Density Flask & Graduated Cylinder
        const flaskGroup = new THREE.Group();
        flaskGroup.position.set(0.5, 1.3, 0);

        // Glass cylinder
        const glassGeo = new THREE.CylinderGeometry(0.85, 0.85, 2.6, 32, 1, true);
        const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.85, transparent: true, roughness: 0.05 });
        const glass = new THREE.Mesh(glassGeo, glassMat);
        flaskGroup.add(glass);

        // Water level inside
        const waterH = metalType === "steel" || metalType === "copper" ? 1.8 : 1.4;
        const water = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, waterH, 32), new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.65 }));
        water.position.y = -1.3 + waterH / 2;
        flaskGroup.add(water);

        // Submerged specimen on wire
        specGroup.scale.set(0.5, 0.5, 0.5);
        specGroup.position.set(0.5, 0.8, 0);

        // Scale housing above
        const scale = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16), new THREE.MeshStandardMaterial({ color: 0x10b981 }));
        scale.position.set(0.5, 3.2, 0);
        benchGroup.add(scale);

        // Hanging suspension wire
        const wireGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.5, 1.0, 0), new THREE.Vector3(0.5, 2.8, 0)]);
        benchGroup.add(new THREE.Line(wireGeo, new THREE.LineBasicMaterial({ color: 0x94a3b8 })));
        benchGroup.add(flaskGroup);
      }

      sceneGroup.add(benchGroup);
      break;
    }

    // -------------------------------------------------------------
    // LESSON 8: إنتاج الحديد والفرن العالي (Blast Furnace Complete Model)
    // -------------------------------------------------------------
    case "iron-production": {
      const furnaceGroup = new THREE.Group();
      furnaceGroup.position.set(0, -1.8, 0);

      const isRunning = params.furnaceRunning !== false;
      const isTapped = params.furnaceTapped === true;
      const temp = params.furnaceTemp || 1400;

      // 1. Massive Blast Furnace Body with 180° Front Cutaway
      const stackOuter = new THREE.Mesh(
        new THREE.CylinderGeometry(1.4, 2.4, 4.6, 32, 1, false, Math.PI / 2, Math.PI),
        new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.35, side: THREE.DoubleSide })
      );
      stackOuter.position.y = 2.8;
      furnaceGroup.add(stackOuter);

      // Refractory brick lining (بطانة الطوب الحراري)
      const brickLining = new THREE.Mesh(
        new THREE.CylinderGeometry(1.3, 2.25, 4.5, 32, 1, false, Math.PI / 2, Math.PI),
        new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.9, side: THREE.BackSide })
      );
      brickLining.position.y = 2.8;
      furnaceGroup.add(brickLining);

      // 2. Inclined Skip Hoist Rail Bridge (كوبري عربات الشحن المائل)
      const railGeo = new THREE.CylinderGeometry(0.08, 0.08, 6.2, 8);
      const railMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
      const rail1 = new THREE.Mesh(railGeo, railMat);
      rail1.position.set(-2.4, 3.2, -0.6);
      rail1.rotation.z = -Math.PI / 4;
      furnaceGroup.add(rail1);

      // Skip Car (عربة الشحن الميكانيكية الصاعدة)
      const skipCar = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.8), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
      const carProgress = (time * 0.5) % 1;
      skipCar.position.set(-4.0 + carProgress * 3.0, 1.2 + carProgress * 3.5, -0.6);
      furnaceGroup.add(skipCar);

      // Top Charging Double-Bell Hopper
      const bellTop = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.8, 24), new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.9 }));
      bellTop.position.set(0, 5.4, 0);
      furnaceGroup.add(bellTop);

      // 3. Alternating Burden Layers (طبقات الشحنة)
      for (let l = 0; l < 6; l++) {
        const lY = 1.2 + l * 0.58;
        const lRad = 2.1 - l * 0.14;
        const layerColor = l % 3 === 0 ? 0x7c2d12 : l % 3 === 1 ? 0x18181b : 0xe7e5e4;
        const layer = new THREE.Mesh(
          new THREE.CylinderGeometry(lRad - 0.08, lRad, 0.52, 24, 1, false, Math.PI / 2, Math.PI),
          new THREE.MeshStandardMaterial({ color: layerColor, roughness: 0.85 })
        );
        layer.position.y = lY;
        furnaceGroup.add(layer);
      }

      // 4. Bustle Pipe (الماسورة الحلقية)
      const bustleGeo = new THREE.TorusGeometry(2.6, 0.28, 16, 32);
      const bustleMat = new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.8 });
      const bustle = new THREE.Mesh(bustleGeo, bustleMat);
      bustle.rotation.x = Math.PI / 2;
      bustle.position.y = 1.1;
      furnaceGroup.add(bustle);

      // Tuyeres & Blowpipes
      [-2.1, 2.1].forEach((tx) => {
        const tuyere = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.8, 16), bustleMat);
        tuyere.rotation.z = Math.PI / 2;
        tuyere.position.set(tx, 0.9, 0);
        furnaceGroup.add(tuyere);

        if (isRunning) {
          const flame = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.7, 16), new THREE.MeshBasicMaterial({ color: 0xfde047 }));
          flame.rotation.z = tx > 0 ? Math.PI / 2 : -Math.PI / 2;
          flame.position.set(tx > 0 ? 1.3 : -1.3, 0.9, 0);
          furnaceGroup.add(flame);
        }
      });

      // 5. Hearth Molten Pig Iron & Slag
      const moltenColor = temp > 1300 ? 0xf59e0b : 0xef4444;
      const molten = new THREE.Mesh(
        new THREE.CylinderGeometry(2.2, 2.2, 0.6, 32),
        new THREE.MeshStandardMaterial({ color: moltenColor, emissive: moltenColor, emissiveIntensity: isRunning ? 0.9 : 0.2 })
      );
      molten.position.y = 0.4;
      furnaceGroup.add(molten);

      // Taphole Runner Chute
      if (isTapped) {
        const runner = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 0.6), new THREE.MeshStandardMaterial({ color: 0x27272a }));
        runner.position.set(2.2, 0.2, 0);
        furnaceGroup.add(runner);

        const moltenStream = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 0.3), new THREE.MeshBasicMaterial({ color: 0xfbbf24 }));
        moltenStream.position.set(2.2, 0.25, 0);
        furnaceGroup.add(moltenStream);

        // Ladle
        const ladle = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.6, 1.0, 24), new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.9 }));
        ladle.position.set(3.8, 0.1, 0);
        furnaceGroup.add(ladle);
      }

      furnaceGroup.add(createLabel("منطقة قمة الفرن (200-400°C)", new THREE.Vector3(0, 4.4, 1.8), "#38bdf8"));
      furnaceGroup.add(createLabel("منطقة الاختزال (800-1000°C)", new THREE.Vector3(0, 2.6, 2.4), "#f59e0b"));
      furnaceGroup.add(createLabel("بئر المصهور وزهر التماسيح (1300°C)", new THREE.Vector3(0, 0.5, 2.5), "#ef4444"));

      sceneGroup.add(furnaceGroup);
      break;
    }

    // -------------------------------------------------------------
    // LESSON 9: درفلة الصلب وتشكيله (Industrial Rolling Mill)
    // -------------------------------------------------------------
    case "steel-rolling": {
      const millGroup = new THREE.Group();

      const temp = params.rollingTemp || 1100;
      const passes = params.rollingPasses || 1;
      const rollSpeed = time * 4;

      // Heavy 2-High Rolling Mill Stand Housings
      const standMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.85, roughness: 0.3 });
      [-1.9, 1.9].forEach((x) => {
        const stand = new THREE.Mesh(new THREE.BoxGeometry(0.9, 4.2, 2.6), standMat);
        stand.position.set(x, 1.0, 0);
        millGroup.add(stand);

        // Motorized screw-down spindle on top of each stand
        const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.0, 16), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9 }));
        screw.position.set(x, 3.4, 0);
        millGroup.add(screw);

        const handwheel = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.08, 12, 24), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 }));
        handwheel.rotation.x = Math.PI / 2;
        handwheel.position.set(x, 3.9, 0);
        millGroup.add(handwheel);
      });

      // Two Counter-Rotating Hardened Steel Rolls
      const rollR = 0.7;
      const rollGap = 0.55 - (passes - 1) * 0.08;
      const rollMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.98, roughness: 0.1 });

      const topRoll = new THREE.Mesh(new THREE.CylinderGeometry(rollR, rollR, 3.4, 32), rollMat);
      topRoll.rotation.z = Math.PI / 2;
      topRoll.rotation.x = rollSpeed;
      topRoll.position.set(0, 1.0 + rollR + rollGap / 2, 0);
      millGroup.add(topRoll);

      const btmRoll = new THREE.Mesh(new THREE.CylinderGeometry(rollR, rollR, 3.4, 32), rollMat);
      btmRoll.rotation.z = Math.PI / 2;
      btmRoll.rotation.x = -rollSpeed;
      btmRoll.position.set(0, 1.0 - rollR - rollGap / 2, 0);
      millGroup.add(btmRoll);

      // Glowing Hot Steel Slab Passing Through
      const slabColor = temp > 1050 ? (temp > 1150 ? 0xfef08a : 0xf59e0b) : 0xef4444;
      const slabMat = new THREE.MeshStandardMaterial({ color: slabColor, emissive: slabColor, emissiveIntensity: 0.8, roughness: 0.3 });

      // Before rollers: Thick slab
      const inSlab = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.75, 2.0), slabMat);
      inSlab.position.set(0, 1.0, -1.8);
      millGroup.add(inSlab);

      // After rollers: Compressed elongated thin slab
      const outThick = Math.max(0.18, rollGap);
      const outSlab = new THREE.Mesh(new THREE.BoxGeometry(2.4, outThick, 3.0), slabMat);
      outSlab.position.set(0, 1.0, 1.8);
      millGroup.add(outSlab);

      // Motorized Roller Conveyor Tables
      const convMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
      [-3.0, -2.2, -1.4, 1.4, 2.2, 3.0].forEach((z) => {
        const cRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 2.8, 16), convMat);
        cRoll.rotation.z = Math.PI / 2;
        cRoll.position.set(0, 1.0 - rollR, z);
        millGroup.add(cRoll);
      });

      millGroup.add(createLabel("درافيل التشكيل العلوية والسفلية", new THREE.Vector3(0, 2.8, 0), "#38bdf8"));
      millGroup.add(createLabel(`درجة الحرارة: ${temp}°C (درفلة على الساخن)`, new THREE.Vector3(0, 1.8, 1.8), "#f59e0b"));

      sceneGroup.add(millGroup);
      break;
    }

    // -------------------------------------------------------------
    // LESSON 10: سبائك النحاس والمعادن غير الحديدية (Non-Ferrous Alloys)
    // -------------------------------------------------------------
    case "non-ferrous-alloys": {
      const alloyGroup = new THREE.Group();

      const cu = params.alloyMixCopper ?? 70;
      const zn = params.alloyMixZinc ?? 30;
      const sn = params.alloyMixTin ?? 0;

      // Foundry Tilt Furnace
      const furnaceBody = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 2.6, 32), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 }));
      furnaceBody.position.set(-1.6, 0.3, 0);
      alloyGroup.add(furnaceBody);

      // Graphite Clay Crucible
      const crucible = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.0, 2.0, 32, 1, true), new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9, side: THREE.DoubleSide }));
      crucible.position.set(-1.6, 0.6, 0);
      alloyGroup.add(crucible);

      // Dynamic Alloy Melt Color
      let meltColor = new THREE.Color(0xb45309); // Base copper
      let alloyTitle = "نحاس نقي (Pure Copper)";
      if (zn > 15) {
        meltColor.lerp(new THREE.Color(0xfacc15), zn / 100);
        alloyTitle = `نحاس أصفر (Brass: ${cu}% Cu + ${zn}% Zn)`;
      } else if (sn > 10) {
        meltColor.lerp(new THREE.Color(0x78350f), sn / 100);
        alloyTitle = `برونز عالي المتانة (Bronze: ${cu}% Cu + ${sn}% Sn)`;
      }

      const melt = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.3, 32), new THREE.MeshStandardMaterial({ color: meltColor, emissive: meltColor, emissiveIntensity: 0.7, roughness: 0.15 }));
      melt.position.set(-1.6, 1.1, 0);
      alloyGroup.add(melt);

      // Finished Solid Alloy Ingot on Cooling Sand Bed
      const ingot = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 0.9, 4), new THREE.MeshStandardMaterial({ color: meltColor, metalness: 0.95, roughness: 0.25 }));
      ingot.rotation.y = Math.PI / 4;
      ingot.position.set(1.8, 0.1, 0);
      alloyGroup.add(ingot);

      // 3D Atomic Solid Solution Lattice Floating Above Ingot
      const lattice = new THREE.Group();
      lattice.position.set(1.8, 2.0, 0);
      const atomGeo = new THREE.SphereGeometry(0.12, 16, 16);
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            const isSolute = (Math.abs(x * 3 + y * 2 + z) % 3 === 0) && (zn > 10 || sn > 5);
            const aMat = new THREE.MeshStandardMaterial({
              color: isSolute ? 0xfacc15 : 0xb45309,
              metalness: 0.85,
              roughness: 0.2,
            });
            const atom = new THREE.Mesh(atomGeo, aMat);
            atom.position.set(x * 0.45, y * 0.45, z * 0.45);
            lattice.add(atom);
          }
        }
      }
      lattice.rotation.y = time * 0.5;
      alloyGroup.add(lattice);

      alloyGroup.add(createLabel(alloyTitle, new THREE.Vector3(-1.6, 2.4, 0), "#f59e0b"));
      alloyGroup.add(createLabel("سبيكة مصبوبة وشبكة بلورية تساهمية", new THREE.Vector3(1.8, 3.2, 0), "#10b981"));

      sceneGroup.add(alloyGroup);
      break;
    }

    // -------------------------------------------------------------------------------------
    // LESSON 11: محاكي الأشواط الأربعة والبستم المقطوع (The True 3D Piston Anatomy Cutaway)
    // المطابق تماماً لصورة المرجع الهندسية المعتمدة (90° Quarter-Cutaway + Hollow Pin + Rings)
    // -------------------------------------------------------------------------------------
    case "engines-cycles": {
      const engineGroup = new THREE.Group();
      engineGroup.position.set(0, -0.6, 0);

      const isPlaying = params.enginePlaying !== false;
      const speed = params.engineSpeed || 1;
      const manualStroke = params.engineStroke || 0;

      // Crank angle: 0 to 4*PI (720 degrees for a full 4-stroke cycle)
      // When paused, manualStroke (0: Intake, 1: Compression, 2: Power, 3: Exhaust) directly locks theta
      let theta = isPlaying ? (time * 4 * speed) % (4 * Math.PI) : (manualStroke * Math.PI);
      const strokeIdx = Math.floor(theta / Math.PI) % 4;

      const crankRadius = 0.85;
      const conRodLength = 2.4;

      // Exact Kinematic Positions
      const crankPinX = crankRadius * Math.sin(theta);
      const crankPinY = -crankRadius * Math.cos(theta);
      const wristPinY = crankPinY + Math.sqrt(conRodLength * conRodLength - crankPinX * crankPinX);
      const rodAngle = Math.atan2(crankPinX, wristPinY - crankPinY);

      const pistonRadius = 1.4;
      const pistonHeight = 1.8;

      // =====================================================================
      // 1. CYLINDER WALL WITH 180° REAR CUTAWAY (جدار الأسطوانة المشقوق)
      // =====================================================================
      // The cylinder wall is cut open in front so the student sees the hone-finish bore and the moving piston!
      const cylSleeveGeo = new THREE.CylinderGeometry(
        pistonRadius + 0.05,
        pistonRadius + 0.05,
        4.4,
        32,
        1,
        false,
        Math.PI / 2,
        Math.PI // Back 180° is drawn, front 180° is wide open cutaway!
      );
      const cylMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.92,
        roughness: 0.25,
        side: THREE.DoubleSide,
      });
      const cylSleeve = new THREE.Mesh(cylSleeveGeo, cylMat);
      cylSleeve.position.y = 2.2;
      engineGroup.add(cylSleeve);

      // Cylinder wall cross-section thickness edge (حافة سماكة جدار الأسطوانة)
      const edgeGeo = new THREE.BoxGeometry(0.18, 4.4, 0.2);
      const edgeMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });
      [-pistonRadius - 0.05, pistonRadius + 0.05].forEach((ex) => {
        const edge = new THREE.Mesh(edgeGeo, edgeMat);
        edge.position.set(ex, 2.2, 0);
        engineGroup.add(edge);
      });

      // =====================================================================
      // 2. THE TRUE PISTON ASSEMBLY WITH 90° QUARTER CUTAWAY (المكبس المقطوع ربعياً)
      // المطابق للصورة: يكشف سماكة الرأس، غرفة الاحتراق، بنز المكبس المجوف، وأخاديد الحلقات!
      // =====================================================================
      const pistonGroup = new THREE.Group();
      pistonGroup.position.set(0, wristPinY, 0);

      // Aluminum Piston Body with 270° angle (90° front-right pie quadrant cut out!)
      const pistonMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0, // Machined aluminum
        metalness: 0.95,
        roughness: 0.2,
        side: THREE.DoubleSide,
      });

      // Main cylindrical skirt & head with 270° sweep (cuts out 0 to PI/2)
      const pistonBodyGeo = new THREE.CylinderGeometry(
        pistonRadius,
        pistonRadius,
        pistonHeight,
        36,
        1,
        false,
        Math.PI / 2,
        Math.PI * 1.5 // 270 degrees!
      );
      const pistonBody = new THREE.Mesh(pistonBodyGeo, pistonMat);
      pistonBody.position.y = 0.2;
      pistonGroup.add(pistonBody);

      // Dished Combustion Bowl in Piston Crown (غرفة الاحتراق المقعرة في رأس المكبس 4)
      const bowlGeo = new THREE.CylinderGeometry(0.85, 0.65, 0.25, 24, 1, false, Math.PI / 2, Math.PI * 1.5);
      const bowlMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.4 });
      const bowl = new THREE.Mesh(bowlGeo, bowlMat);
      bowl.position.y = 1.05;
      pistonGroup.add(bowl);

      // Cut Section Faces (أسطح القطع المتعامدة التي تبرز سماكة المعدن بالألومنيوم المصقول)
      const cutMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.3 });

      // Radial cut wall 1 (along Z-axis)
      const cutWall1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, pistonHeight - 0.2, pistonRadius - 0.4), cutMat);
      cutWall1.position.set(0, 0.2, (pistonRadius - 0.4) / 2);
      pistonGroup.add(cutWall1);

      // Radial cut wall 2 (along X-axis)
      const cutWall2 = new THREE.Mesh(new THREE.BoxGeometry(pistonRadius - 0.4, pistonHeight - 0.2, 0.08), cutMat);
      cutWall2.position.set((pistonRadius - 0.4) / 2, 0.2, 0);
      pistonGroup.add(cutWall2);

      // Graphite Anti-Friction Skirt Coating (الإسكتلميس 50% - طبقة جرافيت رمادية على جدار المكبس)
      const graphiteMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.8, metalness: 0.4 });
      const graphitePad = new THREE.Mesh(
        new THREE.CylinderGeometry(pistonRadius + 0.005, pistonRadius + 0.005, 0.9, 24, 1, true, Math.PI * 0.9, Math.PI * 0.7),
        graphiteMat
      );
      graphitePad.position.y = -0.1;
      pistonGroup.add(graphitePad);

      // =====================================================================
      // 3. THE 3 PISTON RINGS IN THEIR GROOVES (حلقات المكبس الثلاث)
      // 1: Top purple-steel compression ring
      // 2: Second bronze compression ring
      // 3: Oil control ring with golden expander spring underneath
      // =====================================================================
      const ringRadius = pistonRadius + 0.015;

      // 1. حلقة الضغط العلوية (Purple-Steel Top Compression Ring)
      const ring1Mat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.95, roughness: 0.15 });
      const ring1 = new THREE.Mesh(
        new THREE.TorusGeometry(ringRadius, 0.045, 12, 32, Math.PI * 1.5),
        ring1Mat
      );
      ring1.rotation.x = Math.PI / 2;
      ring1.rotation.z = Math.PI / 2;
      ring1.position.y = 0.82;
      pistonGroup.add(ring1);

      // 2. حلقة الضغط الثانية (Bronze/Amber Second Compression Ring)
      const ring2Mat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 });
      const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(ringRadius, 0.045, 12, 32, Math.PI * 1.5),
        ring2Mat
      );
      ring2.rotation.x = Math.PI / 2;
      ring2.rotation.z = Math.PI / 2;
      ring2.position.y = 0.65;
      pistonGroup.add(ring2);

      // 3. حلقة التحكم في الزيت (Oil Control Ring with Wavy Expander Spring)
      const ring3Mat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.1 });
      const ring3 = new THREE.Mesh(
        new THREE.TorusGeometry(ringRadius, 0.035, 12, 32, Math.PI * 1.5),
        ring3Mat
      );
      ring3.rotation.x = Math.PI / 2;
      ring3.rotation.z = Math.PI / 2;
      ring3.position.y = 0.48;
      pistonGroup.add(ring3);

      // Golden Wavy Expander Spring in oil ring groove (النابض التفوسفوري المتعرج)
      const springMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, wireframe: true });
      const expanderSpring = new THREE.Mesh(
        new THREE.TorusGeometry(ringRadius - 0.02, 0.03, 12, 40, Math.PI * 1.5),
        springMat
      );
      expanderSpring.rotation.x = Math.PI / 2;
      expanderSpring.rotation.z = Math.PI / 2;
      expanderSpring.position.y = 0.48;
      pistonGroup.add(expanderSpring);

      // 11. مجاري تصريف الزيت (Oil Drain Holes under oil ring)
      const holeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
      [-0.8, -0.4, 0, 0.4].forEach((hx) => {
        const drainHole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.25, 8), holeMat);
        drainHole.rotation.x = Math.PI / 2;
        drainHole.position.set(hx, 0.35, pistonRadius - 0.05);
        pistonGroup.add(drainHole);
      });

      // =====================================================================
      // 4. HOLLOW WRIST PIN & BOSS (بنز المكبس المجوف وثقب البنز)
      // =====================================================================
      // Piston Pin Boss (ثقب بنز المكبس المعزز بداخل التجويف)
      const bossMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9 });
      const pinBoss = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 1.9, 24), bossMat);
      pinBoss.rotation.x = Math.PI / 2;
      pinBoss.position.set(0, 0, 0);
      pistonGroup.add(pinBoss);

      // Hollow Steel Wrist Pin (بنز المكبس المجوف بفتحة داخلية واضحة كالصورة تماماً!)
      const pinOuterMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.98, roughness: 0.1 });
      const pinInnerMat = new THREE.MeshBasicMaterial({ color: 0x0f172a }); // Dark hollow core

      // Outer cylinder sleeve of pin
      const pinOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 2.0, 24, 1, true), pinOuterMat);
      pinOuter.rotation.x = Math.PI / 2;
      pistonGroup.add(pinOuter);

      // Dark hollow center inside the pin (الثقب الداخلي للبنز)
      const pinHole = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 2.02, 24), pinInnerMat);
      pinHole.rotation.x = Math.PI / 2;
      pistonGroup.add(pinHole);

      engineGroup.add(pistonGroup);

      // =====================================================================
      // 5. FORGED I-BEAM CONNECTING ROD (ذراع التوصيل - البييل المسبوك)
      // المطابق للصورة: ساق مقطع I بلون برونزي مسبوك، سبيكة نحاسية، ومسامير الكاب
      // =====================================================================
      const conRodGroup = new THREE.Group();
      conRodGroup.position.set((crankPinX + 0) / 2, (crankPinY + wristPinY) / 2, 0);
      conRodGroup.rotation.z = -rodAngle;

      // Forged steel/bronze alloy finish
      const rodMat = new THREE.MeshStandardMaterial({
        color: 0x9a7b56, // Warm forged bronze-steel tone
        metalness: 0.88,
        roughness: 0.32,
      });

      // Small End (عين البييل الصغرى حول البنز)
      const smallEnd = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.42, 24), rodMat);
      smallEnd.rotation.x = Math.PI / 2;
      smallEnd.position.y = conRodLength / 2;
      conRodGroup.add(smallEnd);

      // 9. سبيكة ذراع التوصيل (Connecting Rod Bronze Bushing Shell)
      const bushing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.26, 0.26, 0.44, 20),
        new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.95, roughness: 0.2 })
      );
      bushing.rotation.x = Math.PI / 2;
      bushing.position.y = conRodLength / 2;
      conRodGroup.add(bushing);

      // 8. ساق ذراع التوصيل بمقطع I-Beam مع أضلاع التقوية المركزية
      const shankLength = conRodLength - 0.85;
      const shankCenter = new THREE.Mesh(new THREE.BoxGeometry(0.14, shankLength, 0.36), rodMat);
      conRodGroup.add(shankCenter);

      // I-Beam Outer Flanges (شفتا حرف I الجانبيتان لتحمل عزم الانحناء)
      [-0.1, 0.1].forEach((fx) => {
        const flange = new THREE.Mesh(new THREE.BoxGeometry(0.08, shankLength, 0.44), rodMat);
        flange.position.x = fx;
        conRodGroup.add(flange);
      });

      // نهاية ذراع التوصيل الكبيرة ومسامير الربط (Big End Rod Cap with Hex Bolts)
      const bigEnd = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.46, 24), rodMat);
      bigEnd.rotation.x = Math.PI / 2;
      bigEnd.position.y = -conRodLength / 2;
      conRodGroup.add(bigEnd);

      // Rod Cap Split line & Hex Bolts (مسامير ربط كاب البييل الفولاذية)
      const boltMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 1.0, roughness: 0.1 });
      [-0.38, 0.38].forEach((bx) => {
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 6), boltMat);
        bolt.position.set(bx, -conRodLength / 2, 0);
        conRodGroup.add(bolt);
      });

      engineGroup.add(conRodGroup);

      // =====================================================================
      // 6. 10. عمود الكرنك الكامل (Full Crankshaft with Massive Counterweights)
      // =====================================================================
      const crankGroup = new THREE.Group();
      crankGroup.position.set(0, 0, 0);

      // Full Crankshaft with 2 heavy counterweights and crank web
      const crankWebMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.95, roughness: 0.2 });
      const counterWeight = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.2, 0.38, 32, 1, false, 0, Math.PI),
        crankWebMat
      );
      counterWeight.rotation.z = theta + Math.PI / 2;
      crankGroup.add(counterWeight);

      // Crankpin Journal (ركبة الكرنك المصقولة)
      const crankPin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 0.5, 24),
        new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.08 })
      );
      crankPin.rotation.x = Math.PI / 2;
      crankPin.position.set(crankPinX, crankPinY, 0);
      crankGroup.add(crankPin);

      // Crankshaft Main Shaft Journal (عمود المرفق الرئيسي الدائر في كراسي المحرك)
      const mainShaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 2.2, 24),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.15 })
      );
      mainShaft.rotation.x = Math.PI / 2;
      mainShaft.position.set(0, 0, -0.6);
      crankGroup.add(mainShaft);

      engineGroup.add(crankGroup);

      // =====================================================================
      // 7. ANGLED INTAKE & EXHAUST POPPET VALVES (صمامات السحب والعادم المائلة)
      // المطابقة للصورة: صمامان مائلان بزاوية 25° يستقران في قبة غرفة الاحتراق
      // =====================================================================
      const valvesGroup = new THREE.Group();
      valvesGroup.position.set(0, 4.2, 0);

      const intakeOpen = strokeIdx === 0;
      const exhaustOpen = strokeIdx === 3;

      const vStemMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.95, roughness: 0.1 });
      const vHeadMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 });

      // صمام السحب (Intake Valve - Left Angled)
      const inLift = intakeOpen ? 0.35 : 0;
      const intakeValve = new THREE.Group();
      intakeValve.position.set(-0.65, 0 - inLift * 0.9, inLift * 0.4);
      intakeValve.rotation.z = Math.PI / 7; // Angled as in reference image!
      const inVHead = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.18, 24), vHeadMat);
      inVHead.position.y = -0.6;
      intakeValve.add(inVHead);
      const inVStem = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.4, 16), vStemMat);
      intakeValve.add(inVStem);
      valvesGroup.add(intakeValve);

      // صمام العادم (Exhaust Valve - Right Angled)
      const exLift = exhaustOpen ? 0.35 : 0;
      const exhaustValve = new THREE.Group();
      exhaustValve.position.set(0.65, 0 - exLift * 0.9, exLift * 0.4);
      exhaustValve.rotation.z = -Math.PI / 7; // Angled as in reference image!
      const exVHead = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.18, 24), vHeadMat);
      exVHead.position.y = -0.6;
      exhaustValve.add(exVHead);
      const exVStem = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.4, 16), vStemMat);
      exhaustValve.add(exVStem);
      valvesGroup.add(exhaustValve);

      engineGroup.add(valvesGroup);

      // =====================================================================
      // 8. VOLUMETRIC COMBUSTION / INTAKE FLOW / EXHAUST SMOKE DYNAMICS
      // =====================================================================
      if (strokeIdx === 2) {
        // شوط القدرة والاشتعال (Power Stroke): كرة لهب نارية تتوهج وتضيء الأسطوانة
        const fireball = new THREE.Mesh(
          new THREE.SphereGeometry(1.2, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.88 })
        );
        fireball.position.set(0, wristPinY + 1.2, 0);
        fireball.scale.set(1.1, 0.8, 1.1);
        engineGroup.add(fireball);

        const sparkBurst = new THREE.PointLight(0xfef08a, 4.5, 5);
        sparkBurst.position.set(0, 3.8, 0);
        engineGroup.add(sparkBurst);
      } else if (strokeIdx === 0) {
        // شوط السحب (Intake Stroke): تدفق رذاذ خليط الهواء والوقود الأزرق عبر صمام السحب المفتوح
        const intakeMist = new THREE.Mesh(
          new THREE.CylinderGeometry(0.8, 1.2, 1.4, 16),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 })
        );
        intakeMist.position.set(-0.3, wristPinY + 1.3, 0);
        engineGroup.add(intakeMist);
      } else if (strokeIdx === 3) {
        // شوط العادم (Exhaust Stroke): غازات الاحتراق الداكنة تندفع عبر صمام العادم المفتوح
        const exhaustFumes = new THREE.Mesh(
          new THREE.SphereGeometry(0.7, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.65 })
        );
        exhaustFumes.position.set(0.6, 4.2, 0);
        engineGroup.add(exhaustFumes);
      }

      // =====================================================================
      // 9. NUMBERED 3D CALLOUT LABELS (شرح مكونات البستم بالأسهم تماماً كالصورة المرفقة)
      // =====================================================================
      engineGroup.add(createLabel("1. حلقة الضغط العلوية", new THREE.Vector3(2.5, wristPinY + 0.85, 0), "#8b5cf6", 0.95));
      engineGroup.add(createLabel("2. حلقة الضغط الثانية", new THREE.Vector3(2.5, wristPinY + 0.65, 0), "#d97706", 0.95));
      engineGroup.add(createLabel("3. حلقة التحكم في الزيت (النابض)", new THREE.Vector3(2.7, wristPinY + 0.45, 0), "#facc15", 0.95));
      engineGroup.add(createLabel("4. رأس المكبس (غرفة الاحتراق)", new THREE.Vector3(-2.6, wristPinY + 1.0, 0), "#38bdf8", 0.95));
      engineGroup.add(createLabel("5. جدار المكبس (الإسكتلميس)", new THREE.Vector3(2.6, wristPinY - 0.1, 0), "#94a3b8", 0.95));
      engineGroup.add(createLabel("7. بنز المكبس المجوف", new THREE.Vector3(2.4, wristPinY - 0.5, 0), "#ffffff", 0.95));
      engineGroup.add(createLabel("8. ذراع التوصيل (I-Beam)", new THREE.Vector3(2.5, wristPinY - 1.2, 0), "#f59e0b", 0.95));
      engineGroup.add(createLabel("9. سبيكة ذراع التوصيل", new THREE.Vector3(-2.5, wristPinY, 0), "#d97706", 0.95));
      engineGroup.add(createLabel("10. عمود الكرنك الكامل", new THREE.Vector3(2.5, -0.6, 0), "#38bdf8", 0.95));
      engineGroup.add(createLabel("11. مجاري تصريف الزيت", new THREE.Vector3(-2.5, wristPinY + 0.35, 0), "#10b981", 0.95));
      engineGroup.add(createLabel("صمام السحب وصمام العادم", new THREE.Vector3(0, 5.2, 0), "#ec4899", 1.0));

      sceneGroup.add(engineGroup);
      break;
    }

    // -------------------------------------------------------------------------------------
    // LESSON 12: أنظمة محرك السيارة المساعدة (High-Detail Automotive Systems)
    // استجابة فورية وتفاعلية لجميع مدخلات الطالب (الكاربيراتير، الرديتر، التزييت، الإشعال)
    // -------------------------------------------------------------------------------------
    case "car-engine-systems": {
      const carGroup = new THREE.Group();
      carGroup.position.set(0, -0.4, 0);

      const activeSys = params.activeCarSystem || "fuel";

      // =====================================================================
      // 1. DETAILED INLINE-4 CAR ENGINE BLOCK WITH AUXILIARY ACCESSORIES
      // =====================================================================
      const blockMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.4 });

      // Lower Crankcase & Cylinder Bank (كتلة الأسطوانات الأربع مع قنوات التبريد)
      const engineBlock = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.2, 3.8), blockMat);
      engineBlock.position.y = 0.8;
      carGroup.add(engineBlock);

      // Ribbed Cylinder Head Valve Cover (غطاء رأس الأسطوانات والتكيهات الرياضي باللون الأحمر)
      const cover = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.65, 3.6),
        new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.65, roughness: 0.25 })
      );
      cover.position.set(0, 2.2, 0);
      carGroup.add(cover);

      // Chrome Oil Filler Cap on valve cover
      const oilCap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.15, 16), new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 1 }));
      oilCap.position.set(-0.5, 2.6, 0.8);
      carGroup.add(oilCap);

      // Front Accessory Drive (Front Pulleys & Serpentine Belt)
      const pulleyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.95 });
      const crankPulley = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.15, 24), pulleyMat);
      crankPulley.rotation.x = Math.PI / 2;
      crankPulley.position.set(0, 0.1, 1.95);
      carGroup.add(crankPulley);

      const altPulley = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.15, 24), pulleyMat);
      altPulley.rotation.x = Math.PI / 2;
      altPulley.position.set(1.1, 1.2, 1.95);
      carGroup.add(altPulley);

      // Alternator Housing (الدينامو / مولد الكهرباء على جانب المحرك)
      const alternator = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.8, 20), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 }));
      alternator.position.set(1.1, 1.2, 1.4);
      carGroup.add(alternator);

      // 4-into-1 Tubular Exhaust Manifold (مانيفولد العادم المجمع ذو الأنابيب الفولاذية)
      const exhaustMat = new THREE.MeshStandardMaterial({ color: 0x78716c, metalness: 0.85, roughness: 0.3 });
      [-1.2, -0.4, 0.4, 1.2].forEach((pz) => {
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.9, 12), exhaustMat);
        pipe.rotation.z = Math.PI / 3;
        pipe.position.set(1.5, 1.4, pz);
        carGroup.add(pipe);
      });

      // =====================================================================
      // 2. THE 4 EXPANDED AUTOMOTIVE SYSTEMS
      // =====================================================================

      if (activeSys === "cooling") {
        // SYSTEM A: نظام التبريد
        const coolGroup = new THREE.Group();

        // 1. Automotive Radiator (المشعاع / الرديتر)
        const radFrame = new THREE.Mesh(
          new THREE.BoxGeometry(3.0, 2.6, 0.4),
          new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.25 })
        );
        radFrame.position.set(0, 0.9, 3.8);
        coolGroup.add(radFrame);

        // Radiator Core Fins
        const radCore = new THREE.Mesh(
          new THREE.BoxGeometry(2.7, 2.0, 0.25),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.2 })
        );
        radCore.position.set(0, 0.9, 3.8);
        coolGroup.add(radCore);

        // Pressure Radiator Cap
        const radCap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.15, 16), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9 }));
        radCap.position.set(1.0, 2.3, 3.8);
        coolGroup.add(radCap);

        // 2. Multi-Blade Cooling Fan (سرعة دوران المروحة تتناسب طردياً مع حرارة المحرك!)
        const radTemp = params.radiatorTemp || 90;
        const fanSpeedMultiplier = Math.max(5, (radTemp / 90) * 20);

        const fanGroup = new THREE.Group();
        fanGroup.position.set(0, 0.9, 3.45);
        for (let b = 0; b < 6; b++) {
          const blade = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.8, 0.04), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
          blade.rotation.z = (b * Math.PI) / 3;
          fanGroup.add(blade);
        }
        fanGroup.rotation.z = time * fanSpeedMultiplier;
        coolGroup.add(fanGroup);

        // 3. Upper Radiator Hose (لون السائل يتغير فوراً مع حرارة المحرك!)
        let hoseColor = 0x0284c7; // Cold cyan blue
        if (radTemp > 85) hoseColor = 0xf59e0b; // Warm amber
        if (radTemp > 100) hoseColor = 0xef4444; // Boiling red!

        const upperHoseCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.5, 2.1, 1.6),
          new THREE.Vector3(0.6, 2.2, 2.6),
          new THREE.Vector3(0.4, 2.0, 3.6),
        ]);
        const upperHose = new THREE.Mesh(new THREE.TubeGeometry(upperHoseCurve, 24, 0.14, 16, false), new THREE.MeshStandardMaterial({ color: hoseColor, emissive: hoseColor, emissiveIntensity: radTemp > 100 ? 0.6 : 0 }));
        coolGroup.add(upperHose);

        // 4. Lower Radiator Hose (مياه التبريد الباردة العائدة من أسفل الرديتر)
        const lowerHoseCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.6, 0.1, 3.6),
          new THREE.Vector3(-0.7, 0.0, 2.6),
          new THREE.Vector3(-0.5, 0.2, 1.6),
        ]);
        const lowerHose = new THREE.Mesh(new THREE.TubeGeometry(lowerHoseCurve, 24, 0.14, 16, false), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
        coolGroup.add(lowerHose);

        // Boiling Steam Particles if temp > 100°C (تصاعد البخار عند الغليان)
        if (radTemp > 100) {
          const steamGeo = new THREE.SphereGeometry(0.12, 8, 8);
          const steamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
          for (let s = 0; s < 8; s++) {
            const steam = new THREE.Mesh(steamGeo, steamMat);
            steam.position.set(1.0 + (Math.random() - 0.5) * 0.3, 2.5 + ((time * 2 + s * 0.3) % 1.2), 3.8);
            coolGroup.add(steam);
          }
        }

        coolGroup.add(createLabel("المشعاع (الرديتر) ومروحة التبريد", new THREE.Vector3(0, 2.8, 3.8), "#38bdf8"));
        coolGroup.add(createLabel(`حرارة مياه التبريد: ${radTemp}°C ${radTemp > 100 ? '(⚠️ غليان وتمدد صمام الغطاء!)' : '(طبيعي)'}`, new THREE.Vector3(0, 3.4, 2.0), radTemp > 100 ? "#ef4444" : "#10b981"));

        carGroup.add(coolGroup);
      } else if (activeSys === "fuel") {
        // SYSTEM B: نظام الوقود والكاربيراتير
        const fuelGroup = new THREE.Group();

        // 1. Chrome Round Air Cleaner
        const airFilter = new THREE.Mesh(
          new THREE.CylinderGeometry(1.25, 1.25, 0.45, 32),
          new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.98, roughness: 0.1 })
        );
        airFilter.position.set(-1.8, 2.6, 0);
        fuelGroup.add(airFilter);

        // Wing nut
        const wingNut = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.08, 0.1), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
        wingNut.position.set(-1.8, 2.9, 0);
        fuelGroup.add(wingNut);

        // 2. High-Precision Twin-Barrel Carburetor Body
        const carbBody = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, 1.1, 1.0),
          new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.35 })
        );
        carbBody.position.set(-1.8, 1.7, 0);
        fuelGroup.add(carbBody);

        // Twin Venturi Barrels & Rotating Butterfly Throttle Plates
        const ratio = params.carburetorRatio || 15;
        const throttleAngle = ((ratio - 8) / 14) * (Math.PI / 2.2);

        [-0.22, 0.22].forEach((vz) => {
          const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.8, 20), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
          barrel.position.set(-1.8, 1.7, vz);
          fuelGroup.add(barrel);

          const throttle = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.02, 16), new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 1 }));
          throttle.position.set(-1.8, 1.7, vz);
          throttle.rotation.z = throttleAngle;
          fuelGroup.add(throttle);
        });

        // Float Chamber Bowl & Fuel Line
        const floatBowl = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.7), new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.9 }));
        floatBowl.position.set(-2.5, 1.5, 0);
        fuelGroup.add(floatBowl);

        const fuelLineCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-2.5, 1.5, 0),
          new THREE.Vector3(-2.6, 0.6, 0),
          new THREE.Vector3(-1.8, 0.3, 0),
        ]);
        const fuelLine = new THREE.Mesh(new THREE.TubeGeometry(fuelLineCurve, 16, 0.05, 12, false), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95 }));
        fuelGroup.add(fuelLine);

        // 3. Intake Manifold Runners
        const intakeMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85 });
        [-1.2, -0.4, 0.4, 1.2].forEach((pz) => {
          const runner = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.1, 16), intakeMat);
          runner.rotation.z = -Math.PI / 3;
          runner.position.set(-1.1, 1.4, pz);
          fuelGroup.add(runner);
        });

        // Spray Mist Density & Color reflecting Air-Fuel Ratio!
        let mistColor = 0x38bdf8; // Normal blue
        let mistOpacity = 0.4;
        let ratioStatus = "خلط مثالي واقتصادي 1 : 15 (احتراق تام)";
        let statusColor = "#10b981";

        if (ratio < 13) {
          mistColor = 0x1f2937; // Rich mixture (dark unburned carbon smoke)
          mistOpacity = 0.75;
          ratioStatus = `خلط غني Rich (1 : ${ratio}) - استهلاك مفرط ودخان أسود!`;
          statusColor = "#f59e0b";
        } else if (ratio > 16) {
          mistColor = 0xf43f5e; // Lean mixture (pink/red warning)
          mistOpacity = 0.2;
          ratioStatus = `خلط فقير Lean (1 : ${ratio}) - حرارة عالية وضعف عزم!`;
          statusColor = "#ef4444";
        }

        const mistGeo = new THREE.SphereGeometry(0.05, 8, 8);
        const mistMat = new THREE.MeshBasicMaterial({ color: mistColor, transparent: true, opacity: mistOpacity });
        for (let m = 0; m < 16; m++) {
          const drop = new THREE.Mesh(mistGeo, mistMat);
          drop.position.set(-1.8, 1.5 - ((time * 4 + m * 0.15) % 0.8), (Math.random() - 0.5) * 0.4);
          fuelGroup.add(drop);
        }

        fuelGroup.add(createLabel("المغذي (الكاربيراتير) ومنقي الهواء", new THREE.Vector3(-1.8, 3.4, 0), "#f59e0b"));
        fuelGroup.add(createLabel(ratioStatus, new THREE.Vector3(-1.8, 0.7, 0), statusColor));

        carGroup.add(fuelGroup);
      } else if (activeSys === "lube") {
        // SYSTEM C: نظام التزييت
        const lubeGroup = new THREE.Group();

        // 1. Sump Pan
        const sumpOuter = new THREE.Mesh(
          new THREE.BoxGeometry(2.4, 0.9, 3.6),
          new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.3 })
        );
        sumpOuter.position.y = -0.75;
        lubeGroup.add(sumpOuter);

        // Golden Engine Oil Pool
        const oilPool = new THREE.Mesh(
          new THREE.BoxGeometry(2.2, 0.4, 3.4),
          new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.1, metalness: 0.8 })
        );
        oilPool.position.y = -0.7;
        lubeGroup.add(oilPool);

        // Pickup Tube & Strainer Bell
        const pickupBell = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.1, 0.2, 16), new THREE.MeshStandardMaterial({ color: 0x94a3b8, wireframe: true }));
        pickupBell.position.set(0, -0.65, 0);
        lubeGroup.add(pickupBell);

        const pickupTube = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 12), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
        pickupTube.position.set(0, -0.2, 0);
        lubeGroup.add(pickupTube);

        // Spin-on Filter
        const filter = new THREE.Mesh(
          new THREE.CylinderGeometry(0.38, 0.38, 0.9, 24),
          new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.85, roughness: 0.2 })
        );
        filter.rotation.z = Math.PI / 2;
        filter.position.set(1.7, 0.3, 0.6);
        lubeGroup.add(filter);

        // Dipstick
        const dipstickTube = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 12), new THREE.MeshStandardMaterial({ color: 0x64748b }));
        dipstickTube.rotation.z = -Math.PI / 8;
        dipstickTube.position.set(1.4, 1.1, -0.8);
        lubeGroup.add(dipstickTube);

        const dipstickRing = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 12, 20), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
        dipstickRing.position.set(1.8, 2.2, -0.8);
        lubeGroup.add(dipstickRing);

        // Pressurized Oil Spray Droplets
        const oilDropGeo = new THREE.SphereGeometry(0.06, 12, 12);
        const oilDropMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
        for (let o = 0; o < 8; o++) {
          const drop = new THREE.Mesh(oilDropGeo, oilDropMat);
          drop.position.set(0, 0.2 + ((time * 2 + o * 0.3) % 1.2), -1.2 + o * 0.35);
          lubeGroup.add(drop);
        }

        lubeGroup.add(createLabel("حوض ومضخة الزيت (الكارتير)", new THREE.Vector3(0, -1.5, 0), "#eab308"));
        lubeGroup.add(createLabel("فلتر الزيت وسيخ فحص المستوى", new THREE.Vector3(2.2, 1.4, 0), "#38bdf8"));

        carGroup.add(lubeGroup);
      } else if (activeSys === "ignition") {
        // SYSTEM D: نظام الإشعال والكهرباء
        const ignGroup = new THREE.Group();

        // Battery
        const battery = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.9, 1.5), new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 }));
        battery.position.set(2.2, 0.2, 2.2);
        ignGroup.add(battery);

        const termPos = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2, 12), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
        termPos.position.set(2.0, 0.75, 2.6);
        ignGroup.add(termPos);
        const termNeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2, 12), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
        termNeg.position.set(2.4, 0.75, 2.6);
        ignGroup.add(termNeg);

        // Ignition Coil
        const coil = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.85, 20), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95 }));
        coil.position.set(1.9, 1.4, -1.2);
        ignGroup.add(coil);

        // Distributor
        const distBody = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 0.9, 24), new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.85 }));
        distBody.position.set(-1.7, 1.5, -0.6);
        ignGroup.add(distBody);

        const distCap = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.45, 24), new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.3 }));
        distCap.position.set(-1.7, 2.1, -0.6);
        ignGroup.add(distCap);

        // Vacuum Advance Canister
        const vacCan = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95 }));
        vacCan.rotation.x = Math.PI / 2;
        vacCan.position.set(-2.2, 1.8, -0.6);
        ignGroup.add(vacCan);

        // Four Spark Plugs & High Tension Wires with Firing Sequence 1-3-4-2
        const wirePositionsZ = [-1.2, -0.4, 0.4, 1.2];
        const firingSeq = [0, 2, 3, 1];
        const activePlugIdx = firingSeq[Math.floor(time * 6) % 4];

        wirePositionsZ.forEach((pz, idx) => {
          const plug = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 }));
          plug.position.set(0, 2.7, pz);
          ignGroup.add(plug);

          const wireCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-1.7, 2.3, -0.6),
            new THREE.Vector3(-1.0, 2.7, (pz - 0.6) / 2),
            new THREE.Vector3(0, 2.9, pz),
          ]);
          const wire = new THREE.Mesh(new THREE.TubeGeometry(wireCurve, 16, 0.05, 8, false), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
          ignGroup.add(wire);

          // Lightning Flash on Active Spark Plug
          if (idx === activePlugIdx) {
            const spark = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
            spark.position.set(0, 3.1, pz);
            ignGroup.add(spark);

            const sparkLight = new THREE.PointLight(0x38bdf8, 3.0, 3);
            sparkLight.position.set(0, 3.1, pz);
            ignGroup.add(sparkLight);
          }
        });

        ignGroup.add(createLabel("الموزع (الديلكو) وملف الإشعال", new THREE.Vector3(-1.7, 2.9, -0.6), "#ef4444"));
        ignGroup.add(createLabel(`ترتيب الاشتعال: 1 - 3 - 4 - 2 (الأسطوانة ${activePlugIdx + 1} مشتعلة)`, new THREE.Vector3(0, 3.6, 0), "#38bdf8"));

        carGroup.add(ignGroup);
      }

      sceneGroup.add(carGroup);
      break;
    }
  }
}
