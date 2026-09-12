import * as THREE from "three";
import { Lab3DProps } from "../types";

export function buildChapter3Scene(
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
    // LESSON 13: الشحنات الكهربائية وقانون كولوم (Coulomb's Law & Field)
    // -------------------------------------------------------------
    case "electrical-units": {
      const elecGroup = new THREE.Group();

      const q1 = params.coulombQ1 ?? 5;
      const q2 = params.coulombQ2 ?? -5;
      const dist = params.coulombDist ?? 4.0;

      const pos1 = new THREE.Vector3(-dist / 2, 1.2, 0);
      const pos2 = new THREE.Vector3(dist / 2, 1.2, 0);

      // Insulated Mounting Stands & Base
      const baseGeo = new THREE.BoxGeometry(7, 0.3, 3);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = -0.15;
      elecGroup.add(base);

      // Sphere 1 (Charge Q1)
      const isQ1Pos = q1 >= 0;
      const q1Color = isQ1Pos ? 0xef4444 : 0x3b82f6;
      const sphereGeo = new THREE.SphereGeometry(0.55, 32, 32);
      const sphereMat1 = new THREE.MeshStandardMaterial({
        color: q1Color,
        emissive: q1Color,
        emissiveIntensity: 0.4,
        metalness: 0.8,
        roughness: 0.2,
      });
      const s1 = new THREE.Mesh(sphereGeo, sphereMat1);
      s1.position.copy(pos1);
      elecGroup.add(s1);

      // Insulating glass stand 1
      const standGeo1 = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 16);
      const standMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.9,
      });
      const stand1 = new THREE.Mesh(standGeo1, standMat);
      stand1.position.set(pos1.x, 0.6, 0);
      elecGroup.add(stand1);

      // Sphere 2 (Charge Q2)
      const isQ2Pos = q2 >= 0;
      const q2Color = isQ2Pos ? 0xef4444 : 0x3b82f6;
      const sphereMat2 = new THREE.MeshStandardMaterial({
        color: q2Color,
        emissive: q2Color,
        emissiveIntensity: 0.4,
        metalness: 0.8,
        roughness: 0.2,
      });
      const s2 = new THREE.Mesh(sphereGeo, sphereMat2);
      s2.position.copy(pos2);
      elecGroup.add(s2);

      // Stand 2
      const stand2 = new THREE.Mesh(standGeo1, standMat);
      stand2.position.set(pos2.x, 0.6, 0);
      elecGroup.add(stand2);

      // Coulomb Force Arrows (F = k * |q1 * q2| / r^2)
      const isAttractive = (q1 > 0 && q2 < 0) || (q1 < 0 && q2 > 0);
      const forceMag = Math.min(2.5, Math.abs(q1 * q2) / (dist * 0.8));

      // Force Arrow 1 on Sphere 1
      const dir1 = isAttractive ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(-1, 0, 0);
      const arrow1 = new THREE.ArrowHelper(dir1, pos1, forceMag, 0xfacc15, 0.3, 0.2);
      elecGroup.add(arrow1);

      // Force Arrow 2 on Sphere 2
      const dir2 = isAttractive ? new THREE.Vector3(-1, 0, 0) : new THREE.Vector3(1, 0, 0);
      const arrow2 = new THREE.ArrowHelper(dir2, pos2, forceMag, 0xfacc15, 0.3, 0.2);
      elecGroup.add(arrow2);

      // 3D Electric Field Lines (خيوط المجال الكهربائي المنحنية ثلاثية الأبعاد)
      const fieldLineCount = 12;
      for (let i = 0; i < fieldLineCount; i++) {
        const phi = (i / fieldLineCount) * Math.PI * 2;
        const curvePoints: THREE.Vector3[] = [];

        if (isAttractive) {
          // Field lines connect Q1(+) to Q2(-)
          for (let t = 0; t <= 1; t += 0.05) {
            const x = pos1.x + t * (pos2.x - pos1.x);
            const bow = Math.sin(t * Math.PI) * 1.2;
            const y = pos1.y + Math.sin(phi) * bow;
            const z = Math.cos(phi) * bow;
            curvePoints.push(new THREE.Vector3(x, y, z));
          }
        } else {
          // Repulsive field lines bending away
          for (let t = 0; t <= 1; t += 0.05) {
            const x = pos1.x + t * (dist * 0.45);
            const flare = Math.pow(t, 2) * 2.0;
            const y = pos1.y + Math.sin(phi) * (0.3 + flare);
            const z = Math.cos(phi) * (0.3 + flare);
            curvePoints.push(new THREE.Vector3(x, y, z));
          }
        }

        const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.6,
        });
        const line = new THREE.Line(lineGeo, lineMat);
        elecGroup.add(line);
      }

      sceneGroup.add(elecGroup);
      break;
    }

    // -------------------------------------------------------------
    // LESSON 14: المكثفات الكهربائية والمجال (Capacitor & Dielectric Slab)
    // -------------------------------------------------------------
    case "capacitors": {
      const capGroup = new THREE.Group();

      const d = params.plateDist ?? 2.0;
      const v = params.voltage ?? 12;
      const dielectric = params.dielectric || "air";

      // Two Parallel Conductor Plates (لوحا المكثف المتوازيان)
      const plateGeo = new THREE.BoxGeometry(0.12, 3.2, 3.2);
      const plateMatPos = new THREE.MeshStandardMaterial({
        color: 0xef4444, // Anode (+)
        metalness: 0.9,
        roughness: 0.2,
      });
      const plateMatNeg = new THREE.MeshStandardMaterial({
        color: 0x3b82f6, // Cathode (-)
        metalness: 0.9,
        roughness: 0.2,
      });

      // Left Plate (+)
      const leftPlate = new THREE.Mesh(plateGeo, plateMatPos);
      leftPlate.position.set(-d / 2, 1.6, 0);
      capGroup.add(leftPlate);

      // Right Plate (-)
      const rightPlate = new THREE.Mesh(plateGeo, plateMatNeg);
      rightPlate.position.set(d / 2, 1.6, 0);
      capGroup.add(rightPlate);

      // Dielectric Material Slab (العازل الكهربائي بين اللوحين)
      if (dielectric !== "air") {
        let slabColor = 0xffffff;
        let slabOpacity = 0.8;
        if (dielectric === "paper") {
          slabColor = 0xfef08a; // Paper yellow/cream
          slabOpacity = 0.85;
        } else if (dielectric === "mica") {
          slabColor = 0xd97706; // Mica translucent amber
          slabOpacity = 0.7;
        } else if (dielectric === "ceramic") {
          slabColor = 0x0d9488; // Ceramic teal porcelain
          slabOpacity = 0.9;
        }

        const slabWidth = Math.max(0.2, d - 0.25);
        const slabGeo = new THREE.BoxGeometry(slabWidth, 3.0, 3.0);
        const slabMat = new THREE.MeshStandardMaterial({
          color: slabColor,
          transparent: true,
          opacity: slabOpacity,
          roughness: 0.3,
        });
        const slab = new THREE.Mesh(slabGeo, slabMat);
        slab.position.set(0, 1.6, 0);
        capGroup.add(slab);
      }

      // Electric Field Lines (خيوط المجال الكهربائي المنتظم بين اللوحين E = V/d)
      const linesGrid = 4;
      const arrowLen = d - 0.2;
      for (let y = 0; y < linesGrid; y++) {
        for (let z = 0; z < linesGrid; z++) {
          const py = 0.6 + y * 0.7;
          const pz = -1.0 + z * 0.7;
          const arrow = new THREE.ArrowHelper(
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(-d / 2 + 0.1, py, pz),
            arrowLen,
            0xfacc15,
            0.2,
            0.15
          );
          capGroup.add(arrow);
        }
      }

      // Connecting DC Wires & Power Supply Stand
      const wirePoints = [
        new THREE.Vector3(-d / 2, 0.4, 0),
        new THREE.Vector3(-d / 2, -0.2, 0),
        new THREE.Vector3(-1.8, -0.2, 0),
        new THREE.Vector3(-1.8, -0.8, 0),
      ];
      const wireGeo = new THREE.BufferGeometry().setFromPoints(wirePoints);
      const wireMat = new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 2 });
      capGroup.add(new THREE.Line(wireGeo, wireMat));

      // Digital Capacitance Meter Display Box (شاشة قياس السعة والجهد)
      const meterGeo = new THREE.BoxGeometry(1.6, 1.0, 0.8);
      const meterMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
      const meter = new THREE.Mesh(meterGeo, meterMat);
      meter.position.set(0, -0.6, 0);
      capGroup.add(meter);

      // Meter glowing LED screen
      const screenGeo = new THREE.PlaneGeometry(1.3, 0.6);
      const screenMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.set(0, -0.6, 0.41);
      capGroup.add(screen);

      sceneGroup.add(capGroup);
      break;
    }

    // -------------------------------------------------------------
    // LESSON 15: الحث الكهرومغناطيسي وفاراداي (Faraday's Induction & Coil)
    // -------------------------------------------------------------
    case "electromagnetism-induction": {
      const faradayGroup = new THREE.Group();

      const turns = params.coilTurns ?? 20;
      const isOscillating = params.magnetOscillating !== false;
      const manualPos = params.magnetPos ?? 0;

      // Magnet Position along X-axis
      const magnetX = isOscillating ? Math.sin(time * 3) * 2.2 : (manualPos - 50) * 0.05;
      const magnetSpeed = isOscillating ? Math.cos(time * 3) * 3 : 0;

      // 1. Helical Copper Coil (الملف الحلزوني النحاسي)
      const coilRadius = 1.0;
      const coilLength = 3.0;
      const coilPoints: THREE.Vector3[] = [];
      const totalSteps = turns * 24;
      for (let s = 0; s <= totalSteps; s++) {
        const theta = (s / 24) * Math.PI * 2;
        const x = (s / totalSteps) * coilLength - coilLength / 2;
        const y = Math.sin(theta) * coilRadius;
        const z = Math.cos(theta) * coilRadius;
        coilPoints.push(new THREE.Vector3(x, y + 1.5, z));
      }
      const coilGeo = new THREE.BufferGeometry().setFromPoints(coilPoints);
      const coilMat = new THREE.LineBasicMaterial({ color: 0xb45309, linewidth: 3 });
      const coilMesh = new THREE.Line(coilGeo, coilMat);
      faradayGroup.add(coilMesh);

      // Coil Hollow Tube Form (إطار الملف الأسطواني البلاستيكي الشفاف)
      const tubeGeo = new THREE.CylinderGeometry(0.95, 0.95, coilLength + 0.4, 32, 1, true);
      const tubeMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.85,
        transparent: true,
        roughness: 0.1,
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      tube.rotation.z = Math.PI / 2;
      tube.position.set(0, 1.5, 0);
      faradayGroup.add(tube);

      // 2. Bar Magnet with N & S Poles (المغناطيس الدائم)
      const magnetGroup = new THREE.Group();
      magnetGroup.position.set(magnetX, 1.5, 0);

      // North Pole (Red)
      const northGeo = new THREE.BoxGeometry(1.2, 0.5, 0.5);
      const northMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.8 });
      const north = new THREE.Mesh(northGeo, northMat);
      north.position.x = 0.6;
      magnetGroup.add(north);

      // South Pole (Blue)
      const southGeo = new THREE.BoxGeometry(1.2, 0.5, 0.5);
      const southMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.8 });
      const south = new THREE.Mesh(southGeo, southMat);
      south.position.x = -0.6;
      magnetGroup.add(south);

      // Magnetic field lines loops
      for (let m = 0; m < 6; m++) {
        const angle = (m / 6) * Math.PI * 2;
        const mLoopPoints: THREE.Vector3[] = [];
        for (let t = 0; t <= 1; t += 0.05) {
          const mx = Math.cos(t * Math.PI * 2) * 1.5;
          const my = Math.sin(t * Math.PI * 2) * 0.9 * Math.sin(angle);
          const mz = Math.sin(t * Math.PI * 2) * 0.9 * Math.cos(angle);
          mLoopPoints.push(new THREE.Vector3(mx, my, mz));
        }
        const mLoopGeo = new THREE.BufferGeometry().setFromPoints(mLoopPoints);
        const mLoopMat = new THREE.LineBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.4,
        });
        magnetGroup.add(new THREE.Line(mLoopGeo, mLoopMat));
      }
      faradayGroup.add(magnetGroup);

      // 3. Galvanometer with Live Deflecting Needle (الجلفانومتر الحساس ذو الصفر في المنتصف)
      const galvoGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.3, 32);
      const galvoMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
      const galvo = new THREE.Mesh(galvoGeo, galvoMat);
      galvo.rotation.x = Math.PI / 2;
      galvo.position.set(0, -0.5, 1.2);
      faradayGroup.add(galvo);

      // Meter Face Plate (White dial with scale markings)
      const dialGeo = new THREE.CircleGeometry(0.85, 32);
      const dialMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
      const dial = new THREE.Mesh(dialGeo, dialMat);
      dial.position.set(0, -0.5, 1.36);
      faradayGroup.add(dial);

      // Deflecting Needle: Deflection angle directly proportional to magnet speed (Lenz/Faraday)
      const needleAngle = Math.max(-1.2, Math.min(1.2, -magnetSpeed * 0.5));
      const needleGeo = new THREE.BoxGeometry(0.04, 0.75, 0.02);
      const needleMat = new THREE.MeshBasicMaterial({ color: 0xb91c1c });
      const needle = new THREE.Mesh(needleGeo, needleMat);
      needle.position.set(0, -0.25, 1.38);
      needle.rotation.z = needleAngle;
      faradayGroup.add(needle);

      sceneGroup.add(faradayGroup);
      break;
    }

    // -------------------------------------------------------------
    // LESSON 16: ظاهرة الحث الذاتي (Self-Inductance & Back-EMF Spark)
    // -------------------------------------------------------------
    case "self-inductance": {
      const indGroup = new THREE.Group();

      const isClosed = params.switchClosed ?? false;
      const L = params.inductanceL ?? 5;

      // Wooden Test Base Board
      const boardGeo = new THREE.BoxGeometry(6.5, 0.3, 4.0);
      const boardMat = new THREE.MeshStandardMaterial({
        color: 0x78350f, // Wood grain
        roughness: 0.8,
      });
      const board = new THREE.Mesh(boardGeo, boardMat);
      board.position.y = -0.15;
      indGroup.add(board);

      // 1. Massive Laminated Iron Core with Inductor Coil (ملف حث ذو قلب حديدي ضخم)
      const coreGeo = new THREE.TorusGeometry(1.2, 0.35, 16, 32, Math.PI * 1.5);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.9,
        roughness: 0.3,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.set(-1.6, 1.4, 0);
      indGroup.add(core);

      // Heavy Copper Coil Windings
      const windingGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.6, 24);
      const windingMat = new THREE.MeshStandardMaterial({
        color: 0xb45309,
        metalness: 0.95,
        roughness: 0.2,
      });
      const winding = new THREE.Mesh(windingGeo, windingMat);
      winding.position.set(-1.6, 1.4, 0);
      indGroup.add(winding);

      // 2. Brass Knife Switch (مفتاح سكين نحاسي يدوي)
      const switchBaseGeo = new THREE.BoxGeometry(0.8, 0.2, 1.6);
      const switchBaseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
      const switchBase = new THREE.Mesh(switchBaseGeo, switchBaseMat);
      switchBase.position.set(1.5, 0.1, 0.8);
      indGroup.add(switchBase);

      // Switch Knife Blade (opens / closes)
      const bladeAngle = isClosed ? 0 : Math.PI / 4;
      const bladeGeo = new THREE.BoxGeometry(0.1, 0.9, 0.15);
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.95 });
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.set(1.5, 0.5, 0.8);
      blade.rotation.x = bladeAngle;
      indGroup.add(blade);

      // High-voltage Neon Indicator Lamp (مصباح نيون وامض)
      const lampGeo = new THREE.SphereGeometry(0.35, 16, 16);
      const lampGlow = !isClosed && (Math.sin(time * 15) > 0.5); // Rapid flash on break
      const lampMat = new THREE.MeshStandardMaterial({
        color: lampGlow ? 0xf97316 : 0x475569,
        emissive: lampGlow ? 0xf97316 : 0x000000,
        emissiveIntensity: lampGlow ? 1.5 : 0,
        roughness: 0.2,
      });
      const lamp = new THREE.Mesh(lampGeo, lampMat);
      lamp.position.set(1.5, 1.2, -1.0);
      indGroup.add(lamp);

      // 3. High Voltage Arc Spark on Opening (شرارة التفريغ الذاتي الحثي e = -L di/dt)
      if (!isClosed && (Math.sin(time * 10) > 0.2)) {
        const sparkPoints = [
          new THREE.Vector3(1.5, 0.7, 0.6),
          new THREE.Vector3(1.52, 0.8, 0.65),
          new THREE.Vector3(1.48, 0.9, 0.7),
          new THREE.Vector3(1.5, 1.0, 0.8),
        ];
        const sparkGeo = new THREE.BufferGeometry().setFromPoints(sparkPoints);
        const sparkMat = new THREE.LineBasicMaterial({ color: 0x67e8f9, linewidth: 3 });
        const spark = new THREE.Line(sparkGeo, sparkMat);
        indGroup.add(spark);
      }

      sceneGroup.add(indGroup);
      break;
    }

    // -------------------------------------------------------------
    // LESSON 17: أشباه الموصلات والتطعيم (Semiconductors & Crystal Doping)
    // -------------------------------------------------------------
    case "semiconductors-doping": {
      const semiGroup = new THREE.Group();

      const doping = params.dopingType || "n-type";
      const thermal = params.thermalExcitation ?? 25;

      // 3D Diamond Covalent Lattice of Silicon Atoms (الشبكة البلورية للسيليكون)
      const gridSize = 2;
      const spacing = 1.2;

      for (let x = -gridSize; x <= gridSize; x++) {
        for (let y = -gridSize; y <= gridSize; y++) {
          for (let z = -gridSize; z <= gridSize; z++) {
            // Central dopant impurity site
            const isCenter = x === 0 && y === 0 && z === 0;

            let atomColor = 0x38bdf8; // Pure Silicon (Blue-cyan)
            let atomRadius = 0.22;

            if (isCenter) {
              if (doping === "n-type") {
                atomColor = 0x22c55e; // Arsenic / Phosphorus dopant (Pentavalent: Emerald Green)
                atomRadius = 0.28;
              } else if (doping === "p-type") {
                atomColor = 0xa855f7; // Boron / Indium dopant (Trivalent: Magenta/Purple)
                atomRadius = 0.26;
              }
            }

            const atomGeo = new THREE.SphereGeometry(atomRadius, 16, 16);
            const atomMat = new THREE.MeshStandardMaterial({
              color: atomColor,
              metalness: 0.8,
              roughness: 0.3,
            });
            const atom = new THREE.Mesh(atomGeo, atomMat);
            atom.position.set(x * spacing, y * spacing + 1.5, z * spacing);
            semiGroup.add(atom);

            // Covalent Bond cylinders between adjacent neighbors
            if (x < gridSize) {
              const bondGeo = new THREE.CylinderGeometry(0.04, 0.04, spacing, 8);
              const bondMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
              const bondX = new THREE.Mesh(bondGeo, bondMat);
              bondX.rotation.z = Math.PI / 2;
              bondX.position.set((x + 0.5) * spacing, y * spacing + 1.5, z * spacing);
              semiGroup.add(bondX);
            }
          }
        }
      }

      // Free Mobile Carrier Representation (حاملات الشحنة المتحركة)
      if (doping === "n-type") {
        // Free electron wandering in crystal conduction band (إلكترون حر سريع)
        const freeElectronGeo = new THREE.SphereGeometry(0.1, 16, 16);
        const freeElectronMat = new THREE.MeshBasicMaterial({ color: 0xfde047 }); // Golden glowing electron
        const freeElectron = new THREE.Mesh(freeElectronGeo, freeElectronMat);
        const orbitR = 0.9 + Math.sin(time * 4) * 0.3;
        freeElectron.position.set(
          Math.cos(time * 5) * orbitR,
          1.5 + Math.sin(time * 3) * 0.6,
          Math.sin(time * 5) * orbitR
        );
        semiGroup.add(freeElectron);
      } else if (doping === "p-type") {
        // Positive Hole (فجوة موجبة كروية مجوفة خالية من الإلكترون)
        const holeGeo = new THREE.TorusGeometry(0.18, 0.04, 12, 24);
        const holeMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e }); // Glowing red-pink hole ring
        const hole = new THREE.Mesh(holeGeo, holeMat);
        hole.position.set(0.6 * Math.sin(time * 2), 1.5 + 0.4 * Math.cos(time * 2), 0.5);
        semiGroup.add(hole);
      }

      // Slow crystal rotation for 3D depth perception
      semiGroup.rotation.y = time * 0.2;

      sceneGroup.add(semiGroup);
      break;
    }
  }
}
