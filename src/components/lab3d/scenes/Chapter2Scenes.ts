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

  // Helper to create a 3D sprite label
  const createLabel = (text: string, pos: THREE.Vector3, color: string = "#38bdf8") => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.roundRect(4, 4, 248, 56, 12);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.roundRect(4, 4, 248, 56, 12);
      ctx.stroke();

      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 22px 'Tajawal', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 128, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.copy(pos);
    sprite.scale.set(1.4, 0.35, 1);
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
      // Stack (جسم الفرن العالي المخروطي المشقوق بزاوية 180 درجة لمعاينة الشحنة بالكامل)
      const stackOuter = new THREE.Mesh(
        new THREE.CylinderGeometry(1.4, 2.4, 4.6, 32, 1, false, Math.PI / 2, Math.PI),
        new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.35, side: THREE.DoubleSide })
      );
      stackOuter.position.y = 2.8;
      furnaceGroup.add(stackOuter);

      // Refractory brick lining (بطانة الطوب الحراري القرميدي)
      const brickLining = new THREE.Mesh(
        new THREE.CylinderGeometry(1.3, 2.25, 4.5, 32, 1, false, Math.PI / 2, Math.PI),
        new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.9, side: THREE.BackSide })
      );
      brickLining.position.y = 2.8;
      furnaceGroup.add(brickLining);

      // 2. Inclined Skip Hoist Rail Bridge (كوبري عربات الشحن المائل لنقل الخام وفحم الكوك)
      const railGeo = new THREE.CylinderGeometry(0.08, 0.08, 6.2, 8);
      const railMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
      const rail1 = new THREE.Mesh(railGeo, railMat);
      rail1.position.set(-2.4, 3.2, -0.6);
      rail1.rotation.z = -Math.PI / 4;
      furnaceGroup.add(rail1);

      // Skip Car (عربة الشحن الميكانيكية الصاعدة للقمة)
      const skipCar = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.8), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
      const carProgress = (time * 0.5) % 1;
      skipCar.position.set(-4.0 + carProgress * 3.0, 1.2 + carProgress * 3.5, -0.6);
      furnaceGroup.add(skipCar);

      // Top Charging Double-Bell Hopper (قادوس الأجراس المزدوجة لمنع تسرب الغازات)
      const bellTop = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.8, 24), new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.9 }));
      bellTop.position.set(0, 5.4, 0);
      furnaceGroup.add(bellTop);

      // 3. Alternating Burden Layers (طبقات الشحنة الداخلية: خام الحديد الأحمر، فحم الكوك الأسود، الحجر الجيري الأبيض)
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

      // 4. Bustle Pipe (الماسورة الحلقية الضخمة التي تلف الفرن لتوزيع نفخ الهواء الساخن)
      const bustleGeo = new THREE.TorusGeometry(2.6, 0.28, 16, 32);
      const bustleMat = new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.8 });
      const bustle = new THREE.Mesh(bustleGeo, bustleMat);
      bustle.rotation.x = Math.PI / 2;
      bustle.position.y = 1.1;
      furnaceGroup.add(bustle);

      // Tuyeres & Blowpipes (تيورات حقن الهواء الساخن مع لهب ناري متدفق)
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

      // 5. Hearth Molten Pig Iron & Slag (بئر المصهور وخروج زهر التماسيح والخبث)
      const moltenColor = temp > 1300 ? 0xf59e0b : 0xef4444;
      const molten = new THREE.Mesh(
        new THREE.CylinderGeometry(2.2, 2.2, 0.6, 32),
        new THREE.MeshStandardMaterial({ color: moltenColor, emissive: moltenColor, emissiveIntensity: isRunning ? 0.9 : 0.2 })
      );
      molten.position.y = 0.4;
      furnaceGroup.add(molten);

      // Taphole Runner Chute (مجرى تدفق زهر التماسيح المصبوب)
      if (isTapped) {
        const runner = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 0.6), new THREE.MeshStandardMaterial({ color: 0x27272a }));
        runner.position.set(2.2, 0.2, 0);
        furnaceGroup.add(runner);

        const moltenStream = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 0.3), new THREE.MeshBasicMaterial({ color: 0xfbbf24 }));
        moltenStream.position.set(2.2, 0.25, 0);
        furnaceGroup.add(moltenStream);

        // Ladle (المغرفة الصناعية لتجميع الحديد الزهر)
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

      // Heavy 2-High Rolling Mill Stand Housings (إطارات الدرفلة الثقيلة مع براغي الضبط العلوية)
      const standMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.85, roughness: 0.3 });
      [-1.9, 1.9].forEach((x) => {
        const stand = new THREE.Mesh(new THREE.BoxGeometry(0.9, 4.2, 2.6), standMat);
        stand.position.set(x, 1.0, 0);
        millGroup.add(stand);

        // Motorized screw-down spindle on top of each stand (براغي ضبط خلوص الدرافيل)
        const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.0, 16), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9 }));
        screw.position.set(x, 3.4, 0);
        millGroup.add(screw);

        const handwheel = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.08, 12, 24), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 }));
        handwheel.rotation.x = Math.PI / 2;
        handwheel.position.set(x, 3.9, 0);
        millGroup.add(handwheel);
      });

      // Two Counter-Rotating Hardened Steel Rolls (الدرافيل الفولاذية الصلدة الدوارة)
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

      // Glowing Hot Steel Slab Passing Through (لوح الصلب الساخن المتوهج الذي يتناقص سمكه)
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

      // Motorized Roller Conveyor Tables (طاولة الدرافيل الناقلة)
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

      // Foundry Tilt Furnace (فرن صهر البوتقة القابل للإمالة)
      const furnaceBody = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 2.6, 32), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 }));
      furnaceBody.position.set(-1.6, 0.3, 0);
      alloyGroup.add(furnaceBody);

      // Graphite Clay Crucible (البوتقة الجرافيتية بداخل الفرن)
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

    // -----------------------------------------------------------------------
    // LESSON 11: محاكي الأشواط الأربعة (Ultra-Realistic 4-Stroke Cutaway Engine)
    // -----------------------------------------------------------------------
    case "engines-cycles": {
      const engineGroup = new THREE.Group();
      engineGroup.position.set(0, -0.8, 0);

      const isPlaying = params.enginePlaying !== false;
      const speed = params.engineSpeed || 1;
      const manualStroke = params.engineStroke || 1;

      // Crank angle: 0 to 4*PI (720 degrees for a full 4-stroke cycle)
      const theta = isPlaying ? (time * 5 * speed) % (4 * Math.PI) : ((manualStroke - 1) * Math.PI);
      const strokeIdx = Math.floor(theta / Math.PI) % 4;
      // 0: Intake (سحب), 1: Compression (ضغط), 2: Power (قدرة), 3: Exhaust (عادم)

      const crankRadius = 0.75;
      const conRodLength = 2.2;

      // Exact Kinematic Positions
      const crankPinX = crankRadius * Math.sin(theta);
      const crankPinY = -crankRadius * Math.cos(theta);
      const wristPinY = crankPinY + Math.sqrt(conRodLength * conRodLength - crankPinX * crankPinX);
      const rodAngle = Math.atan2(crankPinX, wristPinY - crankPinY);

      // =====================================================================
      // 1. ENGINE CYLINDER BLOCK WITH 180° REAR CUTAWAY & COOLING FINS
      // =====================================================================
      // The front is 100% open so the piston, rings, pin, and rod are unobstructed!
      const cylBoreRadius = 1.25;
      const cylHeight = 3.6;

      // Open 180° Half Cylinder Sleeve (بطانة الأسطوانة الداخلية المصقولة كالمراة)
      const sleeveGeo = new THREE.CylinderGeometry(
        cylBoreRadius,
        cylBoreRadius,
        cylHeight,
        32,
        1,
        true,
        Math.PI / 2,
        Math.PI // Only back 180° is drawn, front 180° is wide open cutaway!
      );
      const sleeveMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.95,
        roughness: 0.15,
        side: THREE.DoubleSide,
      });
      const sleeve = new THREE.Mesh(sleeveGeo, sleeveMat);
      sleeve.position.y = 2.1;
      engineGroup.add(sleeve);

      // Outer Engine Block Casting with Cooling Fins (الكتلة الخارجية وزعانف التبريد)
      const finCount = 8;
      const finMat = new THREE.MeshStandardMaterial({
        color: 0x334155, // Heavy dark cast iron
        metalness: 0.8,
        roughness: 0.5,
        side: THREE.DoubleSide,
      });
      for (let f = 0; f < finCount; f++) {
        const finY = 1.0 + f * 0.38;
        const finGeo = new THREE.CylinderGeometry(
          cylBoreRadius + 0.35,
          cylBoreRadius + 0.35,
          0.08,
          32,
          1,
          true,
          Math.PI / 2,
          Math.PI
        );
        const fin = new THREE.Mesh(finGeo, finMat);
        fin.position.y = finY;
        engineGroup.add(fin);
      }

      // Cutaway Edge Borders (إبراز حواف القطع باللون البرتقالي الهندسي للدلالة على المقطع)
      const borderMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      [-cylBoreRadius, cylBoreRadius].forEach((bx) => {
        const borderEdge = new THREE.Mesh(new THREE.BoxGeometry(0.08, cylHeight, 0.1), borderMat);
        borderEdge.position.set(bx, 2.1, 0);
        engineGroup.add(borderEdge);
      });

      // Crankcase Lower Frame (حوض عمود الكرنك السفلي المفتوح)
      const crankcaseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85 });
      const crankcaseBack = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.8, 1.4), crankcaseMat);
      crankcaseBack.position.set(0, 0, -0.8);
      engineGroup.add(crankcaseBack);

      // =====================================================================
      // 2. TRUE PISTON ASSEMBLY (المكبس الهندسي الحقيقي مع الحلقات والبنز والجذع)
      // =====================================================================
      const pistonGroup = new THREE.Group();
      pistonGroup.position.set(0, wristPinY, 0);

      // Piston Crown (تاج المكبس المصنوع من سبائك الألومنيوم)
      const crownMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.95,
        roughness: 0.18,
      });
      const crownGeo = new THREE.CylinderGeometry(cylBoreRadius - 0.05, cylBoreRadius - 0.05, 0.5, 32);
      const crown = new THREE.Mesh(crownGeo, crownMat);
      crown.position.y = 0.55;
      pistonGroup.add(crown);

      // 3 Compression & Oil Piston Rings (حلقات المكبس الثلاث الفولاذية)
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a, // Dark polished steel rings
        metalness: 0.9,
        roughness: 0.1,
      });
      [0.68, 0.56, 0.44].forEach((ry) => {
        const ringGeo = new THREE.TorusGeometry(cylBoreRadius - 0.03, 0.035, 12, 32);
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = ry;
        pistonGroup.add(ring);
      });

      // Piston Skirt (قميص / جذع المكبس مع تجاويف تخفيف الوزن)
      const skirtGeo = new THREE.CylinderGeometry(cylBoreRadius - 0.06, cylBoreRadius - 0.06, 0.7, 32, 1, true);
      const skirt = new THREE.Mesh(skirtGeo, crownMat);
      skirt.position.y = 0.05;
      pistonGroup.add(skirt);

      // Wrist Pin / Gudgeon Pin (بنز المكبس الفولاذي المار بمنتصف الرأس)
      const wristPinGeo = new THREE.CylinderGeometry(0.18, 0.18, cylBoreRadius * 1.6, 24);
      const wristPinMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1.0,
        roughness: 0.1,
      });
      const wristPin = new THREE.Mesh(wristPinGeo, wristPinMat);
      wristPin.rotation.x = Math.PI / 2;
      wristPin.position.y = 0;
      pistonGroup.add(wristPin);

      engineGroup.add(pistonGroup);

      // =====================================================================
      // 3. FORGED I-BEAM CONNECTING ROD (ذراع التوصيل - البييل المسبوك)
      // =====================================================================
      const conRodGroup = new THREE.Group();
      conRodGroup.position.set((crankPinX + 0) / 2, (crankPinY + wristPinY) / 2, 0);
      conRodGroup.rotation.z = -rodAngle;

      const rodMat = new THREE.MeshStandardMaterial({
        color: 0x64748b,
        metalness: 0.9,
        roughness: 0.25,
      });

      // Small End (عين البييل الصغرى حول بنز المكبس)
      const smallEnd = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.35, 24), rodMat);
      smallEnd.rotation.x = Math.PI / 2;
      smallEnd.position.y = conRodLength / 2;
      conRodGroup.add(smallEnd);

      // Bronze Bushing inside small end (جلبة نحاسية برونزية)
      const bronzeBushing = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.36, 16), new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 }));
      bronzeBushing.rotation.x = Math.PI / 2;
      bronzeBushing.position.y = conRodLength / 2;
      conRodGroup.add(bronzeBushing);

      // I-Beam Center Shank (ساق البييل المقطع على شكل حرف I لتحمل إجهاد الانحناء والانضغاط)
      const shank = new THREE.Mesh(new THREE.BoxGeometry(0.22, conRodLength - 0.7, 0.28), rodMat);
      conRodGroup.add(shank);

      // Big End with Rod Cap & Bolts (عين البييل الكبرى ذات الغطاء ومسامير التثبيت)
      const bigEnd = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.38, 24), rodMat);
      bigEnd.rotation.x = Math.PI / 2;
      bigEnd.position.y = -conRodLength / 2;
      conRodGroup.add(bigEnd);

      // Rod Bolts (مسامير ربط كاب البييل)
      const boltMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.95 });
      [-0.32, 0.32].forEach((bx) => {
        const bolt = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.1), boltMat);
        bolt.position.set(bx, -conRodLength / 2, 0);
        conRodGroup.add(bolt);
      });

      engineGroup.add(conRodGroup);

      // =====================================================================
      // 4. CRANKSHAFT & FLYWHEEL (عمود الكرنك مع أثقال الموازنة والحذافة)
      // =====================================================================
      const crankGroup = new THREE.Group();
      crankGroup.position.set(0, 0, 0);

      // Counterweight Webs (أثقال الموازنة الهلالية الضخمة لمعادلة قوى القصور الذاتي)
      const counterWeightGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.32, 32, 1, false, 0, Math.PI);
      const crankMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.95, roughness: 0.2 });
      const counterWeight = new THREE.Mesh(counterWeightGeo, crankMat);
      counterWeight.rotation.z = theta + Math.PI / 2;
      crankGroup.add(counterWeight);

      // Crank Pin Journal (ركبة الكرنك المربوطة بالبييل)
      const crankPin = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.42, 24), new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 1.0 }));
      crankPin.rotation.x = Math.PI / 2;
      crankPin.position.set(crankPinX, crankPinY, 0);
      crankGroup.add(crankPin);

      // Heavy Rear Flywheel (حذافة المحرك الخلفية المسننة)
      const flywheelGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.25, 36);
      const flywheelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });
      const flywheel = new THREE.Mesh(flywheelGeo, flywheelMat);
      flywheel.rotation.x = Math.PI / 2;
      flywheel.position.set(0, 0, -1.0);
      crankGroup.add(flywheel);

      engineGroup.add(crankGroup);

      // =====================================================================
      // 5. CYLINDER HEAD, VALVES & SPARK PLUG (رأس الأسطوانة والصمامات وشمعة الاشتعال)
      // =====================================================================
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 4.0, 0);

      // Cutaway Cylinder Head casting (غرفة الاحتراق المقطوعة)
      const headCast = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.8, 2.4), new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 }));
      headGroup.add(headCast);

      // Intake Runner (left blue tube) & Exhaust Runner (right red tube)
      const intakeRunner = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16), new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6 }));
      intakeRunner.rotation.z = Math.PI / 3;
      intakeRunner.position.set(-1.1, 0.4, 0);
      headGroup.add(intakeRunner);

      const exhaustRunner = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16), new THREE.MeshStandardMaterial({ color: 0x9a3412, metalness: 0.8 }));
      exhaustRunner.rotation.z = -Math.PI / 3;
      exhaustRunner.position.set(1.1, 0.4, 0);
      headGroup.add(exhaustRunner);

      // Mushroom Poppet Valves with Springs (صمامات المشروم مع يايات الضغط الحلزونية)
      const intakeOpen = strokeIdx === 0; // Intake stroke -> Intake valve pushes down
      const exhaustOpen = strokeIdx === 3; // Exhaust stroke -> Exhaust valve pushes down

      const valveStemMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95 });
      const valveHeadMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 });

      // Intake Valve (Left)
      const intakeValveY = intakeOpen ? -0.35 : -0.05;
      const inHead = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.15, 24), valveHeadMat);
      inHead.position.set(-0.6, intakeValveY - 0.4, 0);
      headGroup.add(inHead);
      const inStem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2, 12), valveStemMat);
      inStem.position.set(-0.6, intakeValveY + 0.2, 0);
      headGroup.add(inStem);

      // Exhaust Valve (Right)
      const exhaustValveY = exhaustOpen ? -0.35 : -0.05;
      const exHead = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.15, 24), valveHeadMat);
      exHead.position.set(0.6, exhaustValveY - 0.4, 0);
      headGroup.add(exHead);
      const exStem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2, 12), valveStemMat);
      exStem.position.set(0.6, exhaustValveY + 0.2, 0);
      headGroup.add(exStem);

      // Valve Springs (يايات الصمامات الحلزونية)
      [-0.6, 0.6].forEach((vx) => {
        const spring = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.6, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xf59e0b, wireframe: true }));
        spring.position.set(vx, 0.3, 0);
        headGroup.add(spring);
      });

      // Realistic Spark Plug (شمعة الاشتعال - البوجيه ذو العازل الخزفي والقطبين)
      const plugGroup = new THREE.Group();
      plugGroup.position.set(0, 0.1, 0);
      // White ceramic ribbed insulator
      const insulator = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.7, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 }));
      insulator.position.y = 0.5;
      plugGroup.add(insulator);
      // Hexagonal steel nut collar
      const hexNut = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.25, 6), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95 }));
      hexNut.position.y = 0.12;
      plugGroup.add(hexNut);
      // Threaded base
      const threads = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.35, 16), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 }));
      threads.position.y = -0.15;
      plugGroup.add(threads);
      // Spark Electrode gap tip
      const electrode = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.12, 0.03), new THREE.MeshBasicMaterial({ color: 0xf8fafc }));
      electrode.position.set(0, -0.38, 0);
      plugGroup.add(electrode);

      headGroup.add(plugGroup);
      engineGroup.add(headGroup);

      // =====================================================================
      // 6. VOLUMETRIC COMBUSTION / INTAKE MIST / EXHAUST SMOKE EFFECTS
      // =====================================================================
      if (strokeIdx === 2) {
        // Power Stroke (شوط القدرة): Brilliant expanding combustion explosion fireball!
        const flameGeo = new THREE.SphereGeometry(1.0, 16, 16);
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.85 });
        const flame = new THREE.Mesh(flameGeo, flameMat);
        flame.position.set(0, 3.4, 0);
        flame.scale.set(1.1, 0.7, 1.1);
        engineGroup.add(flame);

        // Spark Arc Flash from Spark Plug
        const sparkLight = new THREE.PointLight(0xfef08a, 4.0, 4);
        sparkLight.position.set(0, 3.5, 0);
        engineGroup.add(sparkLight);
      } else if (strokeIdx === 0) {
        // Intake Stroke (شوط السحب): Blue fuel-air atomized mixture rushing into chamber
        const mist = new THREE.Mesh(
          new THREE.CylinderGeometry(0.9, 1.1, 1.2, 16),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 })
        );
        mist.position.set(0, 2.8, 0);
        engineGroup.add(mist);
      } else if (strokeIdx === 3) {
        // Exhaust Stroke (شوط العادم): Dark combustion fumes rushing out through exhaust valve
        const smoke = new THREE.Mesh(
          new THREE.SphereGeometry(0.6, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.6 })
        );
        smoke.position.set(0.7, 4.2, 0);
        engineGroup.add(smoke);
      }

      // 3D FLOATING LABELS FOR ENGINE ANATOMY
      const strokeTitles = [
        "١. شوط السحب (Intake): المكبس يهبط، وصمام السحب مفتوح لدخول الخليط",
        "٢. شوط الضغط (Compression): المكبس يصعد، الصمامان مغلقان، انضغاط الخليط",
        "٣. شوط القدرة (Power): شرارة البوجيه، انفجار الوقود يدفع المكبس لأسفل بقوة",
        "٤. شوط العادم (Exhaust): المكبس يصعد، صمام العادم مفتوح لخروج الغازات المحترقة",
      ];
      const strokeColors = ["#38bdf8", "#a855f7", "#f97316", "#64748b"];

      engineGroup.add(createLabel("المكبس (Piston) وحلقات الضغط", new THREE.Vector3(-2.2, wristPinY + 0.4, 0), "#10b981"));
      engineGroup.add(createLabel("ذراع التوصيل (Connecting Rod)", new THREE.Vector3(-2.0, wristPinY - 1.0, 0), "#38bdf8"));
      engineGroup.add(createLabel("عمود الكرنك والحذافة (Crankshaft)", new THREE.Vector3(-2.2, -0.4, 0), "#f59e0b"));
      engineGroup.add(createLabel("شمعة الاشتعال (Spark Plug)", new THREE.Vector3(0, 5.0, 0), "#facc15"));
      engineGroup.add(createLabel(strokeTitles[strokeIdx], new THREE.Vector3(0, 5.8, 0), strokeColors[strokeIdx]));

      sceneGroup.add(engineGroup);
      break;
    }

    // -----------------------------------------------------------------------
    // LESSON 12: أنظمة محرك السيارة المساعدة (High-Detail Automotive Systems)
    // -----------------------------------------------------------------------
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
      // 2. THE 4 EXPANDED AUTOMOTIVE SYSTEMS (كل نظام بتفاصيل هندسية دقيقة وغير مسبوقة)
      // =====================================================================

      if (activeSys === "cooling") {
        // -------------------------------------------------------------
        // SYSTEM A: نظام التبريد (Cooling System: Radiator, Fan, Hoses, Thermostat)
        // -------------------------------------------------------------
        const coolGroup = new THREE.Group();

        // 1. Automotive Radiator (المشعاع / الرديتر ذو الخلايا وزعانف التبريد)
        const radFrame = new THREE.Mesh(
          new THREE.BoxGeometry(3.0, 2.6, 0.4),
          new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.25 })
        );
        radFrame.position.set(0, 0.9, 3.8);
        coolGroup.add(radFrame);

        // Radiator Core Fins (قلب الرديتر الألومنيوم ذو الزعانف الدقيقة)
        const radCore = new THREE.Mesh(
          new THREE.BoxGeometry(2.7, 2.0, 0.25),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.2 })
        );
        radCore.position.set(0, 0.9, 3.8);
        coolGroup.add(radCore);

        // Pressure Radiator Cap on top tank (غطاء الرديتر المعدني مع صمام الضغط)
        const radCap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.15, 16), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9 }));
        radCap.position.set(1.0, 2.3, 3.8);
        coolGroup.add(radCap);

        // 2. Multi-Blade Cooling Fan with Shroud (مروحة التبريد السريعة مع القميص الحامي)
        const fanGroup = new THREE.Group();
        fanGroup.position.set(0, 0.9, 3.45);
        for (let b = 0; b < 6; b++) {
          const blade = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.8, 0.04), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
          blade.rotation.z = (b * Math.PI) / 3;
          fanGroup.add(blade);
        }
        fanGroup.rotation.z = time * 16; // Fast rotating blades!
        coolGroup.add(fanGroup);

        // 3. Upper Radiator Hose (خرطوم المياه العلوي الساخن الخارج من المحرك)
        const radTemp = params.radiatorTemp || 90;
        const hoseColor = radTemp > 85 ? 0xef4444 : 0x0284c7; // Red if hot, blue if cold

        const upperHoseCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.5, 2.1, 1.6),
          new THREE.Vector3(0.6, 2.2, 2.6),
          new THREE.Vector3(0.4, 2.0, 3.6),
        ]);
        const upperHose = new THREE.Mesh(new THREE.TubeGeometry(upperHoseCurve, 24, 0.14, 16, false), new THREE.MeshStandardMaterial({ color: hoseColor }));
        coolGroup.add(upperHose);

        // 4. Lower Radiator Hose (خرطوم المياه السفلي البارد العائد للمحرك)
        const lowerHoseCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.6, 0.1, 3.6),
          new THREE.Vector3(-0.7, 0.0, 2.6),
          new THREE.Vector3(-0.5, 0.2, 1.6),
        ]);
        const lowerHose = new THREE.Mesh(new THREE.TubeGeometry(lowerHoseCurve, 24, 0.14, 16, false), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
        coolGroup.add(lowerHose);

        coolGroup.add(createLabel("المشعاع (الرديتر) ومروحة التبريد", new THREE.Vector3(0, 2.8, 3.8), "#38bdf8"));
        coolGroup.add(createLabel(`درجة حرارة مياه التبريد: ${radTemp}°C`, new THREE.Vector3(0, 3.4, 2.0), hoseColor === 0xef4444 ? "#ef4444" : "#38bdf8"));

        carGroup.add(coolGroup);
      } else if (activeSys === "fuel") {
        // -------------------------------------------------------------
        // SYSTEM B: نظام الوقود والكاربيراتير (Fuel System: Twin-Barrel Carburetor & Air Filter)
        // -------------------------------------------------------------
        const fuelGroup = new THREE.Group();

        // 1. Classic Chrome Round Air Cleaner (منقي الهواء الأسطواني الكروم)
        const airFilter = new THREE.Mesh(
          new THREE.CylinderGeometry(1.25, 1.25, 0.45, 32),
          new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.98, roughness: 0.1 })
        );
        airFilter.position.set(-1.8, 2.6, 0);
        fuelGroup.add(airFilter);

        // Wing nut on top of air cleaner
        const wingNut = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.08, 0.1), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
        wingNut.position.set(-1.8, 2.9, 0);
        fuelGroup.add(wingNut);

        // 2. High-Precision Twin-Barrel Carburetor Body (جسم الكاربيراتير ثنائي الحجرات والمغذيات)
        const carbBody = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, 1.1, 1.0),
          new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.35 })
        );
        carbBody.position.set(-1.8, 1.7, 0);
        fuelGroup.add(carbBody);

        // Twin Venturi Barrels (حجرتا الفنتوري لخلط الهواء والوقود)
        [-0.22, 0.22].forEach((vz) => {
          const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.8, 20), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
          barrel.position.set(-1.8, 1.7, vz);
          fuelGroup.add(barrel);

          // Rotating Butterfly Throttle Plate (صمام الخانق الدوار الذي يتحكم به السلايدر)
          const ratio = params.carburetorRatio || 15;
          const throttleAngle = ((ratio - 8) / 14) * (Math.PI / 2.2);
          const throttle = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.02, 16), new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 1 }));
          throttle.position.set(-1.8, 1.7, vz);
          throttle.rotation.z = throttleAngle;
          fuelGroup.add(throttle);
        });

        // Float Chamber Bowl (حجرة العوامة الجانبية مع أنبوب الوقود النحاسي)
        const floatBowl = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.7), new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.9 }));
        floatBowl.position.set(-2.5, 1.5, 0);
        fuelGroup.add(floatBowl);

        // Fuel Line from Mechanical Pump (أنبوب توصيل البنزين النحاسي)
        const fuelLineCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-2.5, 1.5, 0),
          new THREE.Vector3(-2.6, 0.6, 0),
          new THREE.Vector3(-1.8, 0.3, 0),
        ]);
        const fuelLine = new THREE.Mesh(new THREE.TubeGeometry(fuelLineCurve, 16, 0.05, 12, false), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95 }));
        fuelGroup.add(fuelLine);

        // 3. Intake Manifold Runners (مجمع السحب الموزع للخليط إلى الأسطوانات الأربع)
        const intakeMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85 });
        [-1.2, -0.4, 0.4, 1.2].forEach((pz) => {
          const runner = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.1, 16), intakeMat);
          runner.rotation.z = -Math.PI / 3;
          runner.position.set(-1.1, 1.4, pz);
          fuelGroup.add(runner);
        });

        // Spray Mist of Atomized Fuel (رذاذ قطرات الوقود المتطايرة)
        const mistGeo = new THREE.SphereGeometry(0.04, 8, 8);
        const mistMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        for (let m = 0; m < 12; m++) {
          const drop = new THREE.Mesh(mistGeo, mistMat);
          drop.position.set(-1.8, 1.5 - ((time * 3 + m * 0.2) % 0.8), (Math.random() - 0.5) * 0.4);
          fuelGroup.add(drop);
        }

        fuelGroup.add(createLabel("المغذي (الكاربيراتير) ومنقي الهواء", new THREE.Vector3(-1.8, 3.4, 0), "#f59e0b"));
        fuelGroup.add(createLabel(`نسبة خلط الهواء للوقود: 1 : ${params.carburetorRatio || 15}`, new THREE.Vector3(-1.8, 0.8, 0), (params.carburetorRatio || 15) === 15 ? "#10b981" : "#f43f5e"));

        carGroup.add(fuelGroup);
      } else if (activeSys === "lube") {
        // -------------------------------------------------------------
        // SYSTEM C: نظام التزييت (Lubrication System: Oil Sump, Strainer, Pump, Filter, Dipstick)
        // -------------------------------------------------------------
        const lubeGroup = new THREE.Group();

        // 1. Cutaway Ribbed Oil Pan / Sump (حوض الزيت السفلي - الكارتير ذو الزعانف)
        const sumpOuter = new THREE.Mesh(
          new THREE.BoxGeometry(2.4, 0.9, 3.6),
          new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.3 })
        );
        sumpOuter.position.y = -0.75;
        lubeGroup.add(sumpOuter);

        // Golden Engine Oil Pool (مخزون زيت المحرك الذهبي الصافي)
        const oilPool = new THREE.Mesh(
          new THREE.BoxGeometry(2.2, 0.4, 3.4),
          new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.1, metalness: 0.8 })
        );
        oilPool.position.y = -0.7;
        lubeGroup.add(oilPool);

        // 2. Oil Pickup Tube with Mesh Strainer Bell (أنبوب سحب الزيت مع مصفاة القاع)
        const pickupBell = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.1, 0.2, 16), new THREE.MeshStandardMaterial({ color: 0x94a3b8, wireframe: true }));
        pickupBell.position.set(0, -0.65, 0);
        lubeGroup.add(pickupBell);

        const pickupTube = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 12), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
        pickupTube.position.set(0, -0.2, 0);
        lubeGroup.add(pickupTube);

        // 3. Spin-on Cylindrical Oil Filter (فلتر الزيت الميكانيكي على جانب المحرك)
        const filter = new THREE.Mesh(
          new THREE.CylinderGeometry(0.38, 0.38, 0.9, 24),
          new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.85, roughness: 0.2 })
        );
        filter.rotation.z = Math.PI / 2;
        filter.position.set(1.7, 0.3, 0.6);
        lubeGroup.add(filter);

        // 4. Engine Oil Dipstick with Yellow Pull Ring (سيخ مقاس فحص مستوى الزيت)
        const dipstickTube = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 12), new THREE.MeshStandardMaterial({ color: 0x64748b }));
        dipstickTube.rotation.z = -Math.PI / 8;
        dipstickTube.position.set(1.4, 1.1, -0.8);
        lubeGroup.add(dipstickTube);

        const dipstickRing = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 12, 20), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
        dipstickRing.position.set(1.8, 2.2, -0.8);
        lubeGroup.add(dipstickRing);

        // Pressurized Oil Spray Droplets (تزييت كراسي التحميل وجدران الأسطوانات)
        const oilDropGeo = new THREE.SphereGeometry(0.06, 12, 12);
        const oilDropMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
        for (let o = 0; o < 8; o++) {
          const drop = new THREE.Mesh(oilDropGeo, oilDropMat);
          drop.position.set(0, 0.2 + ((time * 2 + o * 0.3) % 1.2), -1.2 + o * 0.35);
          lubeGroup.add(drop);
        }

        lubeGroup.add(createLabel("حوض ومضخة الزيت (الكارتير)", new THREE.Vector3(0, -1.5, 0), "#eab308"));
        lubeGroup.add(createLabel("فلتر الزيت وسيخ القياس", new THREE.Vector3(2.2, 1.4, 0), "#38bdf8"));

        carGroup.add(lubeGroup);
      } else if (activeSys === "ignition") {
        // -------------------------------------------------------------
        // SYSTEM D: نظام الإشعال والكهرباء (Ignition: Battery, Coil, Distributor, Plug Wires)
        // -------------------------------------------------------------
        const ignGroup = new THREE.Group();

        // 1. Heavy 12V Automotive Car Battery (بطارية السيارة ذات الأقطاب الرصاصية)
        const battery = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.9, 1.5), new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 }));
        battery.position.set(2.2, 0.2, 2.2);
        ignGroup.add(battery);

        // Battery Terminals (+ Red / - Black)
        const termPos = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2, 12), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
        termPos.position.set(2.0, 0.75, 2.6);
        ignGroup.add(termPos);
        const termNeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2, 12), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
        termNeg.position.set(2.4, 0.75, 2.6);
        ignGroup.add(termNeg);

        // 2. High-Voltage Ignition Coil (ملف الإشعال - البوبينة)
        const coil = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.85, 20), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95 }));
        coil.position.set(1.9, 1.4, -1.2);
        ignGroup.add(coil);

        // 3. Ignition Distributor (موزع الإشعال - الديلكو / الإسبراتير مع العضو الدوار)
        const distBody = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 0.9, 24), new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.85 }));
        distBody.position.set(-1.7, 1.5, -0.6);
        ignGroup.add(distBody);

        // Red Distributor Cap Towers (غطاء الديلكو مع 4 أبراج للكابلات وبرج مركزي)
        const distCap = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.45, 24), new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.3 }));
        distCap.position.set(-1.7, 2.1, -0.6);
        ignGroup.add(distCap);

        // Vacuum Advance Canister on distributor side (مقدّم الإشعال بالخلخلة)
        const vacCan = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95 }));
        vacCan.rotation.x = Math.PI / 2;
        vacCan.position.set(-2.2, 1.8, -0.6);
        ignGroup.add(vacCan);

        // 4. Four High-Tension Spark Plug Wires & Spark Plugs (كابلات البوجيهات الأربعة الملونة)
        const wirePositionsZ = [-1.2, -0.4, 0.4, 1.2];
        const firingSeq = [0, 2, 3, 1]; // 1 - 3 - 4 - 2 Firing order
        const activePlugIdx = firingSeq[Math.floor(time * 6) % 4];

        wirePositionsZ.forEach((pz, idx) => {
          // Spark plug screwed in cylinder head
          const plug = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 }));
          plug.position.set(0, 2.7, pz);
          ignGroup.add(plug);

          // Spark plug silicone high-voltage wire from distributor
          const wireCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-1.7, 2.3, -0.6),
            new THREE.Vector3(-1.0, 2.7, (pz - 0.6) / 2),
            new THREE.Vector3(0, 2.9, pz),
          ]);
          const wire = new THREE.Mesh(new THREE.TubeGeometry(wireCurve, 16, 0.05, 8, false), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
          ignGroup.add(wire);

          // Dynamic Lightning Spark at the active spark plug!
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
