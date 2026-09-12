import * as THREE from "three";
import { Lab3DProps } from "../types";

export function buildChapter4Scene(
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

  switch (lessonId) {
    // -------------------------------------------------------------
    // LESSON 18: الهياكل الجملونية والجسور (Truss Bridge Structural Analysis)
    // -------------------------------------------------------------
    case "structures-trusses": {
      const trussGroup = new THREE.Group();

      const load = params.trussLoad ?? 50;
      const trussType = params.trussType || "warren";

      // Bridge Abutments (الدعامات الخرسانية للكوبري)
      const pierGeo = new THREE.BoxGeometry(1.2, 2.0, 3.0);
      const pierMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });
      [-3.6, 3.6].forEach((x) => {
        const pier = new THREE.Mesh(pierGeo, pierMat);
        pier.position.set(x, -0.6, 0);
        trussGroup.add(pier);
      });

      // Warren / Pratt Truss geometry nodes
      const span = 6.4;
      const height = 1.8;
      const bays = 4;
      const bayWidth = span / bays;

      // Bottom chord nodes
      const bottomNodes: THREE.Vector3[] = [];
      for (let i = 0; i <= bays; i++) {
        bottomNodes.push(new THREE.Vector3(-span / 2 + i * bayWidth, 0.4, 0));
      }

      // Top chord nodes
      const topNodes: THREE.Vector3[] = [];
      for (let i = 0; i < bays; i++) {
        topNodes.push(new THREE.Vector3(-span / 2 + (i + 0.5) * bayWidth, 0.4 + height, 0));
      }

      // Function to add a 3D structural member with stress-based color
      // Tension = Blue (0x3b82f6), Compression = Red (0xef4444)
      const addMember = (
        p1: THREE.Vector3,
        p2: THREE.Vector3,
        isCompression: boolean,
        stressIntensity: number
      ) => {
        const dir = new THREE.Vector3().subVectors(p2, p1);
        const len = dir.length();
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

        const color = isCompression
          ? new THREE.Color(0xef4444).lerp(new THREE.Color(0xfca5a5), 1 - stressIntensity)
          : new THREE.Color(0x3b82f6).lerp(new THREE.Color(0x93c5fd), 1 - stressIntensity);

        const cylGeo = new THREE.CylinderGeometry(0.08, 0.08, len, 12);
        const cylMat = new THREE.MeshStandardMaterial({
          color,
          metalness: 0.8,
          roughness: 0.3,
        });
        const cyl = new THREE.Mesh(cylGeo, cylMat);
        cyl.position.copy(mid);
        cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        trussGroup.add(cyl);

        // Truss Joints (Gusset plate nodes)
        const jointGeo = new THREE.SphereGeometry(0.12, 12, 12);
        const jointMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 });
        const j1 = new THREE.Mesh(jointGeo, jointMat);
        j1.position.copy(p1);
        trussGroup.add(j1);
      };

      const normLoad = load / 100;

      // Bottom Chords (Under Tension -> Blue)
      for (let i = 0; i < bays; i++) {
        addMember(bottomNodes[i], bottomNodes[i + 1], false, normLoad);
      }

      // Top Chords (Under Compression -> Red)
      for (let i = 0; i < topNodes.length - 1; i++) {
        addMember(topNodes[i], topNodes[i + 1], true, normLoad);
      }

      // Diagonal Web Members
      for (let i = 0; i < bays; i++) {
        addMember(bottomNodes[i], topNodes[i], true, normLoad * 0.8);
        addMember(topNodes[i], bottomNodes[i + 1], false, normLoad * 0.8);
      }

      // Moving Vehicle Load Arrow (حمل متحرك على الكوبري)
      const loadX = Math.sin(time * 1.5) * 2.5;
      const loadArrow = new THREE.ArrowHelper(
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(loadX, 1.6, 0),
        1.0 + normLoad * 0.6,
        0xfacc15,
        0.3,
        0.2
      );
      trussGroup.add(loadArrow);

      // Deflected deck indicator
      const deckGeo = new THREE.BoxGeometry(span, 0.1, 1.2);
      const deckMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
      const deck = new THREE.Mesh(deckGeo, deckMat);
      deck.position.set(0, 0.35 - normLoad * 0.08, 0);
      trussGroup.add(deck);

      sceneGroup.add(trussGroup);
      break;
    }

    // -------------------------------------------------------------
    // LESSON 19: العقود والأساسات (Masonry Arch & Soil Foundation Mechanics)
    // -------------------------------------------------------------
    case "arches-foundations": {
      const archFoundGroup = new THREE.Group();

      const fType = params.foundationType || "shallow";

      // 1. Semicircular Masonry Arch (العقد الحجري النصف دائري)
      const archRadius = 1.8;
      const stonesCount = 13;
      const dTheta = Math.PI / stonesCount;

      for (let i = 0; i < stonesCount; i++) {
        const theta = i * dTheta + dTheta / 2;
        const isKeystone = i === Math.floor(stonesCount / 2); // Central Crown Keystone (حجر التاج)

        const stoneGeo = new THREE.BoxGeometry(0.36, 0.5, 0.8);
        const stoneMat = new THREE.MeshStandardMaterial({
          color: isKeystone ? 0xf59e0b : 0xe2e8f0,
          roughness: 0.7,
        });
        const stone = new THREE.Mesh(stoneGeo, stoneMat);
        stone.position.set(
          Math.cos(theta) * archRadius,
          1.8 + Math.sin(theta) * archRadius,
          0
        );
        stone.rotation.z = theta - Math.PI / 2;
        archFoundGroup.add(stone);
      }

      // Arch Thrust Line (خط الدفع المنحني عبر أحجار العقد)
      const thrustPoints: THREE.Vector3[] = [];
      for (let t = 0; t <= Math.PI; t += 0.05) {
        thrustPoints.push(
          new THREE.Vector3(
            Math.cos(t) * archRadius,
            1.8 + Math.sin(t) * archRadius,
            0.42
          )
        );
      }
      const thrustGeo = new THREE.BufferGeometry().setFromPoints(thrustPoints);
      const thrustMat = new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 2 });
      archFoundGroup.add(new THREE.Line(thrustGeo, thrustMat));

      // 2. Soil Profile & Foundations (الأساسات السطحية والعميقة وطبقات التربة)
      // Ground level plane
      const groundGeo = new THREE.BoxGeometry(6.5, 0.15, 3.5);
      const groundMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.9 });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.position.set(0, 0, 0);
      archFoundGroup.add(ground);

      if (fType === "shallow") {
        // Shallow Pad Footing (قاعدة خرسانية مسلحة سطحية)
        const footingGeo = new THREE.BoxGeometry(1.8, 0.4, 1.8);
        const footingMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.5 });
        const footing = new THREE.Mesh(footingGeo, footingMat);
        footing.position.set(0, -0.2, 0);
        archFoundGroup.add(footing);

        // Concrete Column (عمود الخرسانة الحامل)
        const colGeo = new THREE.BoxGeometry(0.6, 1.8, 0.6);
        const col = new THREE.Mesh(colGeo, footingMat);
        col.position.set(0, 0.9, 0);
        archFoundGroup.add(col);

        // Pressure Bulb Isobars in Soil (بصلة توزيع الإجهادات في التربة)
        for (let b = 1; b <= 3; b++) {
          const bulbGeo = new THREE.SphereGeometry(b * 0.4, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
          const bulbMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            wireframe: true,
            transparent: true,
            opacity: 0.4 / b,
          });
          const bulb = new THREE.Mesh(bulbGeo, bulbMat);
          bulb.rotation.x = Math.PI;
          bulb.position.set(0, -0.4, 0);
          archFoundGroup.add(bulb);
        }
      } else {
        // Deep Pile Foundation (أساسات عميقة - خوازيق خرسانية تصل لطبقة الصخر)
        const pileCapGeo = new THREE.BoxGeometry(1.6, 0.4, 1.6);
        const pileCapMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
        const pileCap = new THREE.Mesh(pileCapGeo, pileCapMat);
        pileCap.position.set(0, -0.2, 0);
        archFoundGroup.add(pileCap);

        // 4 Concrete Piles penetrating deep
        const pileGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.8, 16);
        const pileMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.6 });
        [
          [-0.5, -0.5],
          [0.5, -0.5],
          [-0.5, 0.5],
          [0.5, 0.5],
        ].forEach(([px, pz]) => {
          const pile = new THREE.Mesh(pileGeo, pileMat);
          pile.position.set(px, -1.8, pz);
          archFoundGroup.add(pile);
        });

        // Hard Bedrock Layer at bottom (طبقة الصخر الصلبة)
        const rockGeo = new THREE.BoxGeometry(6.5, 0.6, 3.5);
        const rockMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.95 });
        const rock = new THREE.Mesh(rockGeo, rockMat);
        rock.position.set(0, -3.2, 0);
        archFoundGroup.add(rock);
      }

      sceneGroup.add(archFoundGroup);
      break;
    }

    // -------------------------------------------------------------
    // LESSON 20: قانون هوك واختبار الشد (Hooke's Law & Tensile Testing)
    // -------------------------------------------------------------
    case "stress-strain-hooke": {
      const tensileGroup = new THREE.Group();

      const force = params.elasticForce ?? 40;
      const matType = params.elasticMaterial || "steel";

      // Specimen properties based on material
      let modulus = 200; // Steel E = 200 GPa
      let specColor = 0xcbd5e1;
      if (matType === "copper") {
        modulus = 110;
        specColor = 0xb45309;
      } else if (matType === "aluminum") {
        modulus = 70;
        specColor = 0xe2e8f0;
      }

      // Specimen Elongation delta L
      const elongation = (force / modulus) * 1.5;
      const specLength = 2.4 + elongation;
      const neckingRadius = Math.max(0.1, 0.22 - elongation * 0.12);

      // 1. Universal Tensile Test Machine Frame (ماكينة اختبار الشد الهيدروليكية)
      const baseGeo = new THREE.BoxGeometry(3.6, 0.5, 2.0);
      const machineMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
      const base = new THREE.Mesh(baseGeo, machineMat);
      base.position.y = -0.25;
      tensileGroup.add(base);

      // Two Heavy Vertical Columns (أعمدة التوجيه الفولاذية الصلبة)
      const colGeo = new THREE.CylinderGeometry(0.18, 0.18, 4.4, 24);
      const colMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.95,
        roughness: 0.2,
      });
      [-1.4, 1.4].forEach((cx) => {
        const col = new THREE.Mesh(colGeo, colMat);
        col.position.set(cx, 2.0, 0);
        tensileGroup.add(col);
      });

      // Fixed Upper Crosshead (العارضة العلوية الثابتة)
      const upperHeadGeo = new THREE.BoxGeometry(3.4, 0.5, 1.4);
      const upperHead = new THREE.Mesh(upperHeadGeo, machineMat);
      upperHead.position.set(0, 4.2, 0);
      tensileGroup.add(upperHead);

      // Moving Crosshead (العارضة الهيدروليكية المتحركة)
      const movingHead = new THREE.Mesh(upperHeadGeo, machineMat);
      movingHead.position.set(0, 0.5 + specLength + 0.6, 0);
      tensileGroup.add(movingHead);

      // Upper & Lower Wedge Grips (فكو التثبيت)
      const gripGeo = new THREE.BoxGeometry(0.6, 0.5, 0.6);
      const gripMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });

      const lowerGrip = new THREE.Mesh(gripGeo, gripMat);
      lowerGrip.position.set(0, 0.5, 0);
      tensileGroup.add(lowerGrip);

      const upperGrip = new THREE.Mesh(gripGeo, gripMat);
      upperGrip.position.set(0, 0.5 + specLength + 0.3, 0);
      tensileGroup.add(upperGrip);

      // 2. Dogbone Tensile Specimen (عينة الاختبار ذات التخصر التدريجي)
      const specGeo = new THREE.CylinderGeometry(neckingRadius, neckingRadius, specLength, 24);
      const specMat = new THREE.MeshStandardMaterial({
        color: specColor,
        metalness: 0.9,
        roughness: 0.2,
      });
      const specimen = new THREE.Mesh(specGeo, specMat);
      specimen.position.set(0, 0.5 + specLength / 2, 0);
      tensileGroup.add(specimen);

      // Tensile Force Arrows (قوى الشد المحورية F)
      const forceArrowUp = new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0.5 + specLength + 0.6, 0),
        0.8,
        0xef4444,
        0.25,
        0.15
      );
      tensileGroup.add(forceArrowUp);

      sceneGroup.add(tensileGroup);
      break;
    }

    // -------------------------------------------------------------
    // LESSON 21: ميكانيكا الموائع واللزوجة (Fluid Viscosity & Stokes' Drag)
    // -------------------------------------------------------------
    case "fluid-mechanics-viscosity": {
      const fluidGroup = new THREE.Group();

      const fluid = params.viscosityFluid || "oil";
      const isRolling = params.fluidBallRolling !== false;

      // 3 Glass Graduated Cylinders side by side
      const fluids = [
        { name: "water", color: 0x38bdf8, opacity: 0.45, visc: 1.0, x: -1.8 },
        { name: "oil", color: 0xf59e0b, opacity: 0.7, visc: 0.3, x: 0 },
        { name: "honey", color: 0x78350f, opacity: 0.88, visc: 0.08, x: 1.8 },
      ];

      fluids.forEach((f) => {
        // Transparent Glass Cylinder
        const glassGeo = new THREE.CylinderGeometry(0.65, 0.65, 3.4, 32, 1, true);
        const glassMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          transmission: 0.9,
          transparent: true,
          roughness: 0.05,
        });
        const glass = new THREE.Mesh(glassGeo, glassMat);
        glass.position.set(f.x, 1.7, 0);
        fluidGroup.add(glass);

        // Fluid Column inside
        const colGeo = new THREE.CylinderGeometry(0.6, 0.6, 3.2, 32);
        const colMat = new THREE.MeshStandardMaterial({
          color: f.color,
          transparent: true,
          opacity: f.opacity,
          roughness: 0.1,
        });
        const liquid = new THREE.Mesh(colGeo, colMat);
        liquid.position.set(f.x, 1.6, 0);
        fluidGroup.add(liquid);

        // Active Falling Sphere in the selected fluid
        if (f.name === fluid) {
          // Dynamic settling position based on fluid viscosity
          const dropCycle = 4.0 / f.visc;
          const cycleProgress = isRolling ? (time % dropCycle) / dropCycle : 0.5;
          const ballY = 3.0 - cycleProgress * 2.6;

          const sphereGeo = new THREE.SphereGeometry(0.2, 24, 24);
          const sphereMat = new THREE.MeshStandardMaterial({
            color: 0xc084fc,
            metalness: 0.95,
            roughness: 0.1,
          });
          const ball = new THREE.Mesh(sphereGeo, sphereMat);
          ball.position.set(f.x, ballY, 0);
          fluidGroup.add(ball);

          // Stokes Drag & Gravity Force Vectors
          const gravArrow = new THREE.ArrowHelper(
            new THREE.Vector3(0, -1, 0),
            new THREE.Vector3(f.x, ballY, 0),
            0.6,
            0x22c55e,
            0.15,
            0.1
          );
          fluidGroup.add(gravArrow);

          const dragArrow = new THREE.ArrowHelper(
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(f.x, ballY, 0),
            0.6 * f.visc,
            0xef4444,
            0.15,
            0.1
          );
          fluidGroup.add(dragArrow);
        }
      });

      sceneGroup.add(fluidGroup);
      break;
    }

    // -------------------------------------------------------------
    // LESSON 22: التلوث البيئي ومعالجة المخلفات (Environmental Engineering & Clarifier)
    // -------------------------------------------------------------
    case "environmental-pollution": {
      const envGroup = new THREE.Group();

      const pollution = params.pollutionSlider ?? 60;
      const acidRain = params.acidRainActive ?? true;

      // 1. Industrial Factory Building
      const factoryGeo = new THREE.BoxGeometry(2.4, 1.8, 2.0);
      const factoryMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
      const factory = new THREE.Mesh(factoryGeo, factoryMat);
      factory.position.set(-1.8, 0.9, 0);
      envGroup.add(factory);

      // Industrial Smokestacks (مداخن المصنع الشاهقة)
      const stackGeo = new THREE.CylinderGeometry(0.25, 0.35, 2.4, 24);
      const stackMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
      [-2.4, -1.4].forEach((sx) => {
        const stack = new THREE.Mesh(stackGeo, stackMat);
        stack.position.set(sx, 2.6, -0.4);
        envGroup.add(stack);

        // Smoke Plume particle puffs (انبعاثات الدخان والغازات الضارة)
        const smokePuffs = Math.floor(pollution / 15);
        for (let p = 0; p < smokePuffs; p++) {
          const pY = 3.8 + p * 0.4 + Math.sin(time * 3 + p) * 0.1;
          const pSize = 0.25 + p * 0.1;
          const puffGeo = new THREE.SphereGeometry(pSize, 12, 12);
          const puffMat = new THREE.MeshBasicMaterial({
            color: 0x1f2937,
            transparent: true,
            opacity: 0.5 - p * 0.08,
          });
          const puff = new THREE.Mesh(puffGeo, puffMat);
          puff.position.set(sx + (p * 0.2), pY, -0.4);
          envGroup.add(puff);
        }
      });

      // 2. Wastewater Clarifier / Sedimentation Tank (حوض الترسيب والمعالجة البيئية)
      const tankGeo = new THREE.CylinderGeometry(1.6, 1.6, 1.0, 32);
      const tankMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7 });
      const tank = new THREE.Mesh(tankGeo, tankMat);
      tank.position.set(1.8, 0.5, 0);
      envGroup.add(tank);

      // Clarified water layer
      const cleanWaterGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.8, 32);
      const cleanWaterMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.75,
      });
      const cleanWater = new THREE.Mesh(cleanWaterGeo, cleanWaterMat);
      cleanWater.position.set(1.8, 0.55, 0);
      envGroup.add(cleanWater);

      // Rotating Scraper Bridge (كوبري القشط الميكانيكي الدوار)
      const bridgeGeo = new THREE.BoxGeometry(3.0, 0.15, 0.3);
      const bridgeMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 });
      const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
      bridge.position.set(1.8, 1.15, 0);
      bridge.rotation.y = time * 0.8;
      envGroup.add(bridge);

      // 3. Acid Rain Simulation (الأمطار الحمضية والجسيمات العالقة)
      if (acidRain) {
        const rainCount = 30;
        const rainPoints: THREE.Vector3[] = [];
        for (let r = 0; r < rainCount; r++) {
          const rx = (Math.random() - 0.5) * 6;
          const ry = 1.0 + Math.random() * 3.5;
          const rz = (Math.random() - 0.5) * 4;
          rainPoints.push(new THREE.Vector3(rx, ry, rz));
          rainPoints.push(new THREE.Vector3(rx, ry - 0.3, rz));
        }
        const rainGeo = new THREE.BufferGeometry().setFromPoints(rainPoints);
        const rainMat = new THREE.LineBasicMaterial({
          color: 0xa855f7, // Acidic violet/magenta rain drops
          transparent: true,
          opacity: 0.6,
        });
        envGroup.add(new THREE.LineSegments(rainGeo, rainMat));
      }

      sceneGroup.add(envGroup);
      break;
    }
  }
}
