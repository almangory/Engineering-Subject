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

  switch (lessonId) {
    // -------------------------------------------------------------
    // LESSON 7: خواص المعادن واختباراتها (Metals Properties & Testing Bench)
    // -------------------------------------------------------------
    case "metals-intro": {
      const benchGroup = new THREE.Group();

      // Heavy industrial test bench table
      const benchGeo = new THREE.BoxGeometry(7, 0.4, 4);
      const benchMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.6,
        roughness: 0.5,
      });
      const benchMesh = new THREE.Mesh(benchGeo, benchMat);
      benchMesh.position.y = -0.2;
      benchGroup.add(benchMesh);

      // Bench legs
      const legGeo = new THREE.CylinderGeometry(0.15, 0.15, 2, 16);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
      [
        [-3.2, -1.2, -1.7],
        [3.2, -1.2, -1.7],
        [-3.2, -1.2, 1.7],
        [3.2, -1.2, 1.7],
      ].forEach(([x, y, z]) => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(x, y, z);
        benchGroup.add(leg);
      });

      // Specimen material properties based on selected metal
      const metalType = params.metalType || "steel";
      let specimenColor = 0x94a3b8;
      let metalness = 0.9;
      let roughness = 0.2;
      let isMagnetic = true;

      if (metalType === "steel") {
        specimenColor = 0xcbd5e1;
        metalness = 0.95;
        roughness = 0.25;
        isMagnetic = true;
      } else if (metalType === "cast-iron") {
        specimenColor = 0x475569;
        metalness = 0.7;
        roughness = 0.7;
        isMagnetic = true;
      } else if (metalType === "copper") {
        specimenColor = 0xb45309;
        metalness = 0.9;
        roughness = 0.3;
        isMagnetic = false;
      } else if (metalType === "aluminum") {
        specimenColor = 0xe2e8f0;
        metalness = 0.85;
        roughness = 0.15;
        isMagnetic = false;
      }

      const testType = params.metalTestType || "magnet";

      // 1. SPECIMEN
      const specimenGeo = new THREE.BoxGeometry(1.2, 0.8, 1.2);
      const specimenMat = new THREE.MeshStandardMaterial({
        color: specimenColor,
        metalness,
        roughness,
      });
      const specimen = new THREE.Mesh(specimenGeo, specimenMat);
      specimen.position.set(-1.5, 0.4, 0);

      // 2. TESTING APPARATUS BASED ON TEST TYPE
      if (testType === "magnet") {
        // Horseshoe magnet apparatus
        const magnetArm = new THREE.Group();
        magnetArm.position.set(-1.5, 2.5, 0);

        // U-shaped magnet body
        const magnetCurve = new THREE.TorusGeometry(0.8, 0.2, 16, 32, Math.PI);
        const magnetRedMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.5 });
        const magnetBlueMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.5 });
        const northPole = new THREE.Mesh(magnetCurve, magnetRedMat);
        northPole.rotation.z = Math.PI;
        magnetArm.add(northPole);

        // Pole extensions
        const poleGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16);
        const poleN = new THREE.Mesh(poleGeo, magnetRedMat);
        poleN.position.set(-0.8, -0.3, 0);
        magnetArm.add(poleN);

        const poleS = new THREE.Mesh(poleGeo, magnetBlueMat);
        poleS.position.set(0.8, -0.3, 0);
        magnetArm.add(poleS);

        // Dynamic lowering of magnet
        const lowerOffset = Math.sin(time * 2) * 0.5;
        magnetArm.position.y = 2.0 + lowerOffset;

        // If magnetic, specimen gets lifted when magnet is close!
        if (isMagnetic && lowerOffset < -0.2) {
          specimen.position.y = 0.4 + (-0.2 - lowerOffset) * 1.5;

          // Magnetic field lines (cyan sparks)
          const fieldPoints = [
            new THREE.Vector3(-0.8, magnetArm.position.y - 0.6, 0),
            new THREE.Vector3(-0.4, specimen.position.y + 0.4, 0),
            new THREE.Vector3(0.4, specimen.position.y + 0.4, 0),
            new THREE.Vector3(0.8, magnetArm.position.y - 0.6, 0),
          ];
          const fieldGeo = new THREE.BufferGeometry().setFromPoints(fieldPoints);
          const fieldMat = new THREE.LineBasicMaterial({ color: 0x38bdf8 });
          const fieldLine = new THREE.Line(fieldGeo, fieldMat);
          benchGroup.add(fieldLine);
        }

        benchGroup.add(magnetArm);
        benchGroup.add(specimen);
      } else if (testType === "spark") {
        // Grinding wheel with electric motor
        const motorGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 24);
        const motorMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
        const motor = new THREE.Mesh(motorGeo, motorMat);
        motor.rotation.z = Math.PI / 2;
        motor.position.set(0.8, 1.2, 0);
        benchGroup.add(motor);

        // Grinding abrasive disc
        const wheelGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.25, 32);
        const wheelMat = new THREE.MeshStandardMaterial({
          color: 0x57534e,
          roughness: 0.9,
          metalness: 0.1,
        });
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.rotation.x = time * 20; // High speed rotation
        wheel.position.set(-0.1, 1.2, 0);
        benchGroup.add(wheel);

        // Specimen pushed against wheel
        specimen.position.set(-0.8, 1.2, 0);
        benchGroup.add(specimen);

        // Sparks generation
        if (metalType === "steel" || metalType === "cast-iron") {
          const sparkCount = metalType === "steel" ? 40 : 25;
          const sparkPoints: THREE.Vector3[] = [];
          for (let i = 0; i < sparkCount; i++) {
            const spread = (Math.random() - 0.5) * 0.4;
            const dist = Math.random() * (metalType === "steel" ? 2.5 : 1.2);
            sparkPoints.push(new THREE.Vector3(-0.2, 1.2, 0));
            sparkPoints.push(
              new THREE.Vector3(
                -0.2 - dist,
                1.2 - dist * 0.5 + spread,
                (Math.random() - 0.5) * 0.6
              )
            );
          }
          const sparkGeo = new THREE.BufferGeometry().setFromPoints(sparkPoints);
          const sparkMat = new THREE.LineBasicMaterial({
            color: metalType === "steel" ? 0xfde047 : 0xf97316,
          });
          const sparkLines = new THREE.LineSegments(sparkGeo, sparkMat);
          benchGroup.add(sparkLines);
        }
      } else if (testType === "density") {
        // Archimedes density tank with graduated water cylinder
        const cylGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.5, 32);
        const cylMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          transmission: 0.85,
          opacity: 1,
          transparent: true,
          roughness: 0.1,
          ior: 1.5,
        });
        const cyl = new THREE.Mesh(cylGeo, cylMat);
        cyl.position.set(0, 1.3, 0);
        benchGroup.add(cyl);

        // Water level inside
        const waterHeight = metalType === "steel" || metalType === "copper" ? 1.6 : 1.3;
        const waterGeo = new THREE.CylinderGeometry(0.76, 0.76, waterHeight, 32);
        const waterMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.6,
          roughness: 0.1,
        });
        const water = new THREE.Mesh(waterGeo, waterMat);
        water.position.set(0, 0.1 + waterHeight / 2, 0);
        benchGroup.add(water);

        // Submerged specimen suspended by thin wire
        specimen.scale.set(0.6, 0.6, 0.6);
        specimen.position.set(0, 0.8, 0);
        benchGroup.add(specimen);

        // Hanging wire & scale
        const wireGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 1.0, 0),
          new THREE.Vector3(0, 2.8, 0),
        ]);
        const wireMat = new THREE.LineBasicMaterial({ color: 0x94a3b8 });
        benchGroup.add(new THREE.Line(wireGeo, wireMat));

        // Spring scale housing
        const scaleGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16);
        const scaleMat = new THREE.MeshStandardMaterial({ color: 0x10b981 });
        const scale = new THREE.Mesh(scaleGeo, scaleMat);
        scale.position.set(0, 3.1, 0);
        benchGroup.add(scale);
      }

      sceneGroup.add(benchGroup);
      break;
    }

    // -------------------------------------------------------------
    // LESSON 8: إنتاج الحديد والفرن العالي (Blast Furnace Iron Production)
    // -------------------------------------------------------------
    case "iron-production": {
      const furnaceGroup = new THREE.Group();
      furnaceGroup.position.set(0, -1.8, 0);

      const isRunning = params.furnaceRunning !== false;
      const isTapped = params.furnaceTapped === true;
      const temp = params.furnaceTemp || 1400;

      // 1. Blast Furnace Outer Shell (Tapered stack cutaway)
      const stackGeo = new THREE.CylinderGeometry(1.2, 2.2, 4.5, 32, 1, true, 0, Math.PI * 1.5);
      const stackMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        metalness: 0.85,
        roughness: 0.4,
        side: THREE.DoubleSide,
      });
      const stack = new THREE.Mesh(stackGeo, stackMat);
      stack.position.y = 2.8;
      furnaceGroup.add(stack);

      // Refractory brick lining (interior glowing ring)
      const liningGeo = new THREE.CylinderGeometry(1.15, 2.1, 4.4, 32, 1, true, 0, Math.PI * 1.5);
      const liningMat = new THREE.MeshStandardMaterial({
        color: 0x9a3412,
        roughness: 0.9,
        side: THREE.BackSide,
      });
      const lining = new THREE.Mesh(liningGeo, liningMat);
      lining.position.y = 2.8;
      furnaceGroup.add(lining);

      // 2. Alternating Burden Layers (Iron Ore, Coke, Limestone)
      const layersCount = 6;
      for (let i = 0; i < layersCount; i++) {
        const layerY = 1.2 + i * 0.55;
        const radius = 1.9 - i * 0.12;
        const layerGeo = new THREE.CylinderGeometry(radius - 0.05, radius, 0.45, 24, 1, false, 0, Math.PI * 1.5);
        // Alternate colors: reddish-brown (ore), black (coke), off-white (limestone)
        const layerColor = i % 3 === 0 ? 0x7c2d12 : i % 3 === 1 ? 0x18181b : 0xd6d3d1;
        const layerMat = new THREE.MeshStandardMaterial({
          color: layerColor,
          roughness: 0.8,
        });
        const layerMesh = new THREE.Mesh(layerGeo, layerMat);
        layerMesh.position.y = layerY;
        furnaceGroup.add(layerMesh);
      }

      // 3. High Temperature Hearth (بئر المصهور)
      const hearthGeo = new THREE.CylinderGeometry(2.2, 2.2, 1.2, 32);
      const hearthMat = new THREE.MeshStandardMaterial({
        color: 0x27272a,
        metalness: 0.8,
      });
      const hearth = new THREE.Mesh(hearthGeo, hearthMat);
      hearth.position.y = 0.6;
      furnaceGroup.add(hearth);

      // Molten pig iron pool (glowing orange/yellow)
      const moltenColor = temp > 1300 ? 0xf59e0b : 0xe11d48;
      const moltenGeo = new THREE.CylinderGeometry(2.0, 2.0, 0.5, 32);
      const moltenMat = new THREE.MeshStandardMaterial({
        color: moltenColor,
        emissive: moltenColor,
        emissiveIntensity: isRunning ? 0.8 : 0.2,
        roughness: 0.2,
      });
      const moltenPool = new THREE.Mesh(moltenGeo, moltenMat);
      moltenPool.position.y = 0.4;
      furnaceGroup.add(moltenPool);

      // 4. Tuyeres (Hot blast air nozzles)
      const tuyereGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.0, 16);
      const tuyereMat = new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.9 });
      [-1.8, 1.8].forEach((x) => {
        const tuyere = new THREE.Mesh(tuyereGeo, tuyereMat);
        tuyere.rotation.z = Math.PI / 2;
        tuyere.position.set(x, 0.9, 0);
        furnaceGroup.add(tuyere);

        // Blasting flame effect
        if (isRunning) {
          const flameGeo = new THREE.ConeGeometry(0.2, 0.8, 16);
          const flameMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
          const flame = new THREE.Mesh(flameGeo, flameMat);
          flame.rotation.z = x > 0 ? Math.PI / 2 : -Math.PI / 2;
          flame.position.set(x > 0 ? 1.0 : -1.0, 0.9, 0);
          furnaceGroup.add(flame);
        }
      });

      // 5. Molten Iron Taphole & Runner Chute
      if (isTapped) {
        const runnerGeo = new THREE.BoxGeometry(2.2, 0.2, 0.5);
        const runnerMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46 });
        const runner = new THREE.Mesh(runnerGeo, runnerMat);
        runner.position.set(2.0, 0.2, 0);
        furnaceGroup.add(runner);

        // Flowing liquid iron stream
        const streamGeo = new THREE.BoxGeometry(2.2, 0.1, 0.2);
        const streamMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          emissive: 0xf59e0b,
          emissiveIntensity: 1.0,
        });
        const stream = new THREE.Mesh(streamGeo, streamMat);
        stream.position.set(2.0, 0.25, 0);
        furnaceGroup.add(stream);

        // Receiving Ladle (مغرفة تجميع الحديد الغفل)
        const ladleGeo = new THREE.CylinderGeometry(0.7, 0.5, 0.9, 24);
        const ladleMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.9 });
        const ladle = new THREE.Mesh(ladleGeo, ladleMat);
        ladle.position.set(3.4, 0.1, 0);
        furnaceGroup.add(ladle);
      }

      sceneGroup.add(furnaceGroup);
      break;
    }

    // -------------------------------------------------------------
    // LESSON 9: درفلة الصلب وتشكيله (Steel Rolling Mill Simulation)
    // -------------------------------------------------------------
    case "steel-rolling": {
      const millGroup = new THREE.Group();

      const temp = params.rollingTemp || 1100;
      const passes = params.rollingPasses || 1;
      const rollSpeed = time * 4;

      // Heavy Rolling Mill Stands (إطارات الدرفيل الثقيلة)
      const standGeo = new THREE.BoxGeometry(0.8, 4.0, 2.5);
      const standMat = new THREE.MeshStandardMaterial({
        color: 0x1e3a8a, // Industrial dark blue
        metalness: 0.8,
        roughness: 0.4,
      });
      [-1.8, 1.8].forEach((x) => {
        const stand = new THREE.Mesh(standGeo, standMat);
        stand.position.set(x, 0.8, 0);
        millGroup.add(stand);
      });

      // Upper & Lower Cylindrical Rolls (درافيل التشكيل الفولاذية)
      const rollRadius = 0.65;
      const rollGap = 0.6 - (passes - 1) * 0.08; // Gap narrows with passes
      const rollGeo = new THREE.CylinderGeometry(rollRadius, rollRadius, 3.2, 32);
      const rollMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.95,
        roughness: 0.15,
      });

      // Top roll
      const topRoll = new THREE.Mesh(rollGeo, rollMat);
      topRoll.rotation.z = Math.PI / 2;
      topRoll.rotation.x = rollSpeed;
      topRoll.position.set(0, 0.8 + rollRadius + rollGap / 2, 0);
      millGroup.add(topRoll);

      // Bottom roll
      const btmRoll = new THREE.Mesh(rollGeo, rollMat);
      btmRoll.rotation.z = Math.PI / 2;
      btmRoll.rotation.x = -rollSpeed; // Opposite rotation
      btmRoll.position.set(0, 0.8 - rollRadius - rollGap / 2, 0);
      millGroup.add(btmRoll);

      // Glowing Hot Steel Slab (كتلة الصلب الساخنة المتشكلة)
      // Heat glow color based on temperature: 700°C (dull red) to 1200°C (bright yellow)
      let slabColor = 0xef4444;
      if (temp > 1050) slabColor = 0xf59e0b;
      if (temp > 1150) slabColor = 0xfef08a;

      const slabMat = new THREE.MeshStandardMaterial({
        color: slabColor,
        emissive: slabColor,
        emissiveIntensity: 0.75,
        roughness: 0.4,
      });

      // Ingoing thick slab (before rollers)
      const inSlabGeo = new THREE.BoxGeometry(2.2, 0.7, 1.4);
      const inSlab = new THREE.Mesh(inSlabGeo, slabMat);
      inSlab.position.set(0, 0.8, -1.8);
      millGroup.add(inSlab);

      // Outgoing thin compressed slab (after rollers)
      const outThickness = Math.max(0.18, rollGap);
      const outSlabGeo = new THREE.BoxGeometry(2.2, outThickness, 2.6);
      const outSlab = new THREE.Mesh(outSlabGeo, slabMat);
      outSlab.position.set(0, 0.8, 1.6);
      millGroup.add(outSlab);

      // Roller conveyor tables (درافيل طاولة النقل)
      const bedRollGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.6, 16);
      const bedRollMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
      [-2.8, -2.2, -1.6, -1.0, 1.0, 1.6, 2.2, 2.8].forEach((z) => {
        const bedRoll = new THREE.Mesh(bedRollGeo, bedRollMat);
        bedRoll.rotation.z = Math.PI / 2;
        bedRoll.position.set(0, 0.8 - rollRadius, z);
        millGroup.add(bedRoll);
      });

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

      // Foundry Furnace Body (فرن الصهر للبوتقة)
      const furnaceGeo = new THREE.CylinderGeometry(1.8, 1.8, 2.4, 32);
      const furnaceMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.7,
        roughness: 0.5,
      });
      const furnace = new THREE.Mesh(furnaceGeo, furnaceMat);
      furnace.position.set(-1.4, 0.2, 0);
      alloyGroup.add(furnace);

      // Molten Metal Crucible (البوتقة الجرافيتية بداخل الفرن)
      const crucibleGeo = new THREE.CylinderGeometry(1.2, 0.9, 1.8, 32, 1, true);
      const crucibleMat = new THREE.MeshStandardMaterial({
        color: 0x18181b,
        roughness: 0.9,
        side: THREE.DoubleSide,
      });
      const crucible = new THREE.Mesh(crucibleGeo, crucibleMat);
      crucible.position.set(-1.4, 0.5, 0);
      alloyGroup.add(crucible);

      // Melt Color: dynamic blend between Copper (Red-Gold), Zinc (Brass Yellow), Tin (Bronze)
      let meltColor = new THREE.Color(0xb45309); // Base pure copper
      if (zn > 15) {
        // Brass shift -> bright yellow gold
        meltColor.lerp(new THREE.Color(0xeab308), zn / 100);
      }
      if (sn > 10) {
        // Bronze shift -> warm deep antique bronze
        meltColor.lerp(new THREE.Color(0x78350f), sn / 100);
      }

      const meltGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.2, 32);
      const meltMat = new THREE.MeshStandardMaterial({
        color: meltColor,
        emissive: meltColor,
        emissiveIntensity: 0.65,
        roughness: 0.2,
      });
      const melt = new THREE.Mesh(meltGeo, meltMat);
      melt.position.set(-1.4, 0.9, 0);
      alloyGroup.add(melt);

      // Finished Alloy Ingot on Cooling Plate (سبيكة مصبوبة على لوح التبريد)
      const plateGeo = new THREE.BoxGeometry(2.5, 0.2, 2.5);
      const plateMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
      const plate = new THREE.Mesh(plateGeo, plateMat);
      plate.position.set(1.8, -0.6, 0);
      alloyGroup.add(plate);

      // Ingot mold & cast trapezoid block
      const ingotGeo = new THREE.CylinderGeometry(0.7, 0.9, 0.8, 4); // Ingot bar
      const ingotMat = new THREE.MeshStandardMaterial({
        color: meltColor,
        metalness: 0.9,
        roughness: 0.25,
      });
      const ingot = new THREE.Mesh(ingotGeo, ingotMat);
      ingot.rotation.y = Math.PI / 4;
      ingot.position.set(1.8, -0.1, 0);
      alloyGroup.add(ingot);

      // 3D Atomic Solid Solution Lattice Diagram (نموذج الذرات الشبكي في السبيكة)
      const latticeGroup = new THREE.Group();
      latticeGroup.position.set(1.8, 1.8, 0);

      // Base copper atoms (large red-orange spheres) + alloy solute atoms (yellow/silver spheres)
      const atomCount = 27;
      const sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            const isSolute = (Math.abs(x + y + z) % 3 === 0) && (zn > 10 || sn > 5);
            const atomMat = new THREE.MeshStandardMaterial({
              color: isSolute ? (zn > sn ? 0xfacc15 : 0x94a3b8) : 0xe11d48,
              metalness: 0.8,
              roughness: 0.3,
            });
            const atom = new THREE.Mesh(sphereGeo, atomMat);
            atom.position.set(x * 0.45, y * 0.45, z * 0.45);
            latticeGroup.add(atom);
          }
        }
      }
      latticeGroup.rotation.y = time * 0.5;
      alloyGroup.add(latticeGroup);

      sceneGroup.add(alloyGroup);
      break;
    }

    // -------------------------------------------------------------
    // LESSON 11: محركات الاحتراق الداخلي والأشواط الأربعة (4-Stroke Engine)
    // -------------------------------------------------------------
    case "engines-cycles": {
      const engineGroup = new THREE.Group();

      const isPlaying = params.enginePlaying !== false;
      const speed = params.engineSpeed || 1;
      const manualStroke = params.engineStroke || 1;

      // Crankshaft angle theta
      let theta = isPlaying ? (time * 6 * speed) % (4 * Math.PI) : ((manualStroke - 1) * Math.PI);
      const strokeIdx = Math.floor(theta / Math.PI) % 4; // 0: Intake, 1: Compression, 2: Power, 3: Exhaust

      const crankRadius = 0.7;
      const conRodLength = 2.0;

      // Piston Kinematics: y = r * cos(theta) + sqrt(l^2 - r^2 * sin^2(theta))
      const crankPinX = crankRadius * Math.sin(theta);
      const crankPinY = -crankRadius * Math.cos(theta);
      const pistonY = crankPinY + Math.sqrt(conRodLength * conRodLength - crankPinX * crankPinX);

      // 1. Transparent Engine Cylinder Bore
      const cylGeo = new THREE.CylinderGeometry(1.2, 1.2, 3.2, 32, 1, true);
      const cylMat = new THREE.MeshPhysicalMaterial({
        color: 0x94a3b8,
        transmission: 0.8,
        opacity: 1,
        transparent: true,
        roughness: 0.1,
      });
      const cylinder = new THREE.Mesh(cylGeo, cylMat);
      cylinder.position.y = 1.6;
      engineGroup.add(cylinder);

      // Cylinder Head (غرفة الاحتراق العلوية)
      const headGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.6, 32);
      const headMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 3.4;
      engineGroup.add(head);

      // 2. Reciprocating Piston (المكبس)
      const pistonGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.9, 32);
      const pistonMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.95,
        roughness: 0.2,
      });
      const piston = new THREE.Mesh(pistonGeo, pistonMat);
      piston.position.set(0, pistonY + 0.3, 0);
      engineGroup.add(piston);

      // 3. Connecting Rod (ذراع التوصيل - البييل)
      const rodGeo = new THREE.BoxGeometry(0.2, conRodLength, 0.25);
      const rodMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9 });
      const rod = new THREE.Mesh(rodGeo, rodMat);
      // Position midpoint between crankPin and piston wristpin
      const midX = crankPinX / 2;
      const midY = (crankPinY + pistonY) / 2;
      rod.position.set(midX, midY, 0);
      rod.rotation.z = Math.atan2(crankPinX, pistonY - crankPinY);
      engineGroup.add(rod);

      // 4. Rotating Crankshaft Counterweight & Web (عمود الكرنك)
      const crankGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.3, 32, 1, false, 0, Math.PI);
      const crankMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.95 });
      const crank = new THREE.Mesh(crankGeo, crankMat);
      crank.position.set(0, 0, 0);
      crank.rotation.z = theta + Math.PI / 2;
      engineGroup.add(crank);

      // Crank Pin
      const pinGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 16);
      const pinMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 1 });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.set(crankPinX, crankPinY, 0);
      engineGroup.add(pin);

      // 5. Valves (صمام السحب وصمام العادم)
      // Stroke 0: Intake valve open (moves down)
      // Stroke 3: Exhaust valve open (moves down)
      const intakeValveOpen = strokeIdx === 0;
      const exhaustValveOpen = strokeIdx === 3;

      const valveGeo = new THREE.CylinderGeometry(0.25, 0.08, 0.8, 16);
      const valveMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });

      // Intake valve (Left)
      const intakeValve = new THREE.Mesh(valveGeo, valveMat);
      intakeValve.position.set(-0.5, 3.2 - (intakeValveOpen ? 0.25 : 0), 0);
      engineGroup.add(intakeValve);

      // Exhaust valve (Right)
      const exhaustValve = new THREE.Mesh(valveGeo, valveMat);
      exhaustValve.position.set(0.5, 3.2 - (exhaustValveOpen ? 0.25 : 0), 0);
      engineGroup.add(exhaustValve);

      // 6. Combustion Chamber Flash & Gas Particles
      if (strokeIdx === 2) {
        // Power Stroke: Glowing combustion fire!
        const flameGeo = new THREE.SphereGeometry(0.8, 16, 16);
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
        const flame = new THREE.Mesh(flameGeo, flameMat);
        flame.position.set(0, 2.9, 0);
        flame.scale.set(1.2, 0.6, 1.2);
        engineGroup.add(flame);

        // Spark plug tip flash
        const sparkLight = new THREE.PointLight(0xffedd5, 2.5, 3);
        sparkLight.position.set(0, 3.1, 0);
        engineGroup.add(sparkLight);
      } else if (strokeIdx === 0) {
        // Intake stroke: cool blue air-fuel mist
        const mistGeo = new THREE.CylinderGeometry(0.7, 0.9, 1.0, 16);
        const mistMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.35,
        });
        const mist = new THREE.Mesh(mistGeo, mistMat);
        mist.position.set(0, 2.4, 0);
        engineGroup.add(mist);
      } else if (strokeIdx === 3) {
        // Exhaust stroke: dark exhaust smoke
        const smokeGeo = new THREE.SphereGeometry(0.4, 12, 12);
        const smokeMat = new THREE.MeshBasicMaterial({
          color: 0x475569,
          transparent: true,
          opacity: 0.5,
        });
        const smoke = new THREE.Mesh(smokeGeo, smokeMat);
        smoke.position.set(0.6, 3.4, 0);
        engineGroup.add(smoke);
      }

      sceneGroup.add(engineGroup);
      break;
    }

    // -------------------------------------------------------------
    // LESSON 12: أنظمة محرك السيارة المساعدة (Car Engine Auxiliary Systems)
    // -------------------------------------------------------------
    case "car-engine-systems": {
      const carGroup = new THREE.Group();

      const activeSys = params.activeCarSystem || "fuel";

      // 1. Central Engine Block (محرك السيارة المركزي المكتمل)
      const blockGeo = new THREE.BoxGeometry(2.4, 2.2, 3.4);
      const blockMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.7,
        roughness: 0.4,
      });
      const engineBlock = new THREE.Mesh(blockGeo, blockMat);
      engineBlock.position.y = 0.6;
      carGroup.add(engineBlock);

      // Cylinder Head Valve Cover (غطاء التكيهات)
      const coverGeo = new THREE.BoxGeometry(2.0, 0.6, 3.2);
      const coverMat = new THREE.MeshStandardMaterial({
        color: 0xb91c1c, // Racing red valve cover
        metalness: 0.6,
        roughness: 0.3,
      });
      const cover = new THREE.Mesh(coverGeo, coverMat);
      cover.position.set(0, 2.0, 0);
      carGroup.add(cover);

      // 2. ACTIVE SYSTEM HIGHLIGHTING & 3D HARDWARE
      if (activeSys === "cooling") {
        // Radiator (المشعاع / الرادياتير)
        const radGeo = new THREE.BoxGeometry(2.6, 2.2, 0.3);
        const radMat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          metalness: 0.9,
          roughness: 0.3,
        });
        const radiator = new THREE.Mesh(radGeo, radMat);
        radiator.position.set(0, 0.6, 3.2);
        carGroup.add(radiator);

        // Radiator Fan (مروحة التبريد)
        const fanGroup = new THREE.Group();
        fanGroup.position.set(0, 0.6, 2.9);
        const bladeGeo = new THREE.BoxGeometry(0.3, 1.8, 0.05);
        const bladeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
        for (let b = 0; b < 4; b++) {
          const blade = new THREE.Mesh(bladeGeo, bladeMat);
          blade.rotation.z = (b * Math.PI) / 4;
          fanGroup.add(blade);
        }
        fanGroup.rotation.z = time * 12; // Fast rotating fan
        carGroup.add(fanGroup);

        // Radiator Hoses (خراطيم مياه التبريد العلوية والسفلية)
        const hoseMatUpper = new THREE.MeshStandardMaterial({
          color: (params.radiatorTemp || 90) > 85 ? 0xef4444 : 0x38bdf8,
        });
        const hoseCurve = new THREE.CubicBezierCurve3(
          new THREE.Vector3(0.6, 1.8, 1.6),
          new THREE.Vector3(0.6, 2.0, 2.5),
          new THREE.Vector3(0.6, 1.6, 3.0),
          new THREE.Vector3(0.6, 1.4, 3.1)
        );
        const hoseGeo = new THREE.TubeGeometry(hoseCurve, 20, 0.12, 12, false);
        const hoseMesh = new THREE.Mesh(hoseGeo, hoseMatUpper);
        carGroup.add(hoseMesh);
      } else if (activeSys === "fuel") {
        // Carburetor / Fuel Injector Body (الكاربيراتير والمغذي)
        const carbGeo = new THREE.CylinderGeometry(0.4, 0.5, 1.0, 24);
        const carbMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 });
        const carb = new THREE.Mesh(carbGeo, carbMat);
        carb.position.set(-1.6, 1.4, 0);
        carGroup.add(carb);

        // Air filter cleaner housing (منقي الهواء الأسطواني)
        const filterGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.4, 32);
        const filterMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5 });
        const filter = new THREE.Mesh(filterGeo, filterMat);
        filter.position.set(-1.6, 2.1, 0);
        carGroup.add(filter);

        // Fuel line pipe
        const lineGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.2, 12);
        const lineMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9 });
        const fuelLine = new THREE.Mesh(lineGeo, lineMat);
        fuelLine.rotation.z = Math.PI / 4;
        fuelLine.position.set(-1.8, 0.6, 0);
        carGroup.add(fuelLine);
      } else if (activeSys === "lube") {
        // Oil Sump (كارتير الزيت السفلي)
        const sumpGeo = new THREE.BoxGeometry(2.2, 0.7, 3.0);
        const sumpMat = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          metalness: 0.8,
          roughness: 0.3,
        });
        const sump = new THREE.Mesh(sumpGeo, sumpMat);
        sump.position.y = -0.7;
        carGroup.add(sump);

        // Oil Filter (فلتر الزيت الأسطواني)
        const filterGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.7, 24);
        const filterMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
        const filter = new THREE.Mesh(filterGeo, filterMat);
        filter.rotation.z = Math.PI / 2;
        filter.position.set(1.5, -0.2, 0.5);
        carGroup.add(filter);

        // Oil flow stream (animated golden drops)
        const oilGeo = new THREE.SphereGeometry(0.08, 12, 12);
        const oilMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.8 });
        for (let o = 0; o < 8; o++) {
          const drop = new THREE.Mesh(oilGeo, oilMat);
          drop.position.set(0, 0.2 + ((time * 2 + o * 0.4) % 1.5), -1.2 + o * 0.3);
          carGroup.add(drop);
        }
      } else if (activeSys === "ignition") {
        // Distributor (الديلكو)
        const distGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.8, 24);
        const distMat = new THREE.MeshStandardMaterial({ color: 0x18181b });
        const dist = new THREE.Mesh(distGeo, distMat);
        dist.position.set(1.5, 1.4, -0.8);
        carGroup.add(dist);

        // Spark Plugs & High Voltage Cables (كابلات البوجيهات الأربعة)
        [-1.0, -0.3, 0.4, 1.1].forEach((z, idx) => {
          const plugGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 12);
          const plugMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0 });
          const plug = new THREE.Mesh(plugGeo, plugMat);
          plug.position.set(0, 2.5, z);
          carGroup.add(plug);

          // Spark flash in firing sequence
          if (Math.floor(time * 8) % 4 === idx) {
            const sparkGeo = new THREE.SphereGeometry(0.15, 12, 12);
            const sparkMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
            const spark = new THREE.Mesh(sparkGeo, sparkMat);
            spark.position.set(0, 2.8, z);
            carGroup.add(spark);
          }
        });
      }

      sceneGroup.add(carGroup);
      break;
    }
  }
}
