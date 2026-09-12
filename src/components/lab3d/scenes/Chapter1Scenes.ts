import * as THREE from "three";
import { Lab3DProps } from "../types";

export function buildChapter1Scene(
  sceneGroup: THREE.Group,
  lessonId: string,
  params: Lab3DProps["params"],
  time: number
) {
  // Clear previous meshes
  while (sceneGroup.children.length > 0) {
    const obj = sceneGroup.children[0];
    sceneGroup.remove(obj);
    if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
  }

  switch (lessonId) {
    case "intro-projection": {
      // 1. 3D L-bracket in space
      const bracketGroup = new THREE.Group();
      bracketGroup.position.set(2.5, 0, 0);

      // Base part
      const baseGeo = new THREE.BoxGeometry(2, 0.6, 2);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        metalness: 0.3,
        roughness: 0.4,
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.set(0, 0.3, 0);
      bracketGroup.add(baseMesh);

      // Upright part
      const uprightGeo = new THREE.BoxGeometry(0.6, 2, 2);
      const uprightMat = new THREE.MeshStandardMaterial({
        color: 0x2563eb,
        metalness: 0.3,
        roughness: 0.4,
      });
      const uprightMesh = new THREE.Mesh(uprightGeo, uprightMat);
      uprightMesh.position.set(-0.7, 1.6, 0);
      bracketGroup.add(uprightMesh);

      // Hole in upright
      const holeGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.7, 16);
      const holeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
      const holeMesh = new THREE.Mesh(holeGeo, holeMat);
      holeMesh.rotation.z = Math.PI / 2;
      holeMesh.position.set(-0.7, 1.8, 0);
      bracketGroup.add(holeMesh);

      sceneGroup.add(bracketGroup);

      // 2. Translucent 3D Projection Screen Plane
      const screenGeo = new THREE.PlaneGeometry(6, 6);
      const screenMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
        roughness: 0.2,
      });
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.set(-3, 1.5, 0);
      screenMesh.rotation.y = Math.PI / 2;
      sceneGroup.add(screenMesh);

      // Frame around screen
      const frameGeo = new THREE.EdgesGeometry(screenGeo);
      const frameMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
      const frameLine = new THREE.LineSegments(frameGeo, frameMat);
      frameLine.position.copy(screenMesh.position);
      frameLine.rotation.copy(screenMesh.rotation);
      sceneGroup.add(frameLine);

      // 3. Projected 2D shape on the screen
      const projShape = new THREE.Shape();
      projShape.moveTo(-1, 0);
      projShape.lineTo(1, 0);
      projShape.lineTo(1, 0.6);
      projShape.lineTo(-0.4, 0.6);
      projShape.lineTo(-0.4, 2.6);
      projShape.lineTo(-1, 2.6);
      projShape.closePath();

      const projGeo = new THREE.ShapeGeometry(projShape);
      const projMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const projMesh = new THREE.Mesh(projGeo, projMat);
      projMesh.position.set(-2.98, 0, 0);
      projMesh.rotation.y = Math.PI / 2;
      sceneGroup.add(projMesh);

      // 4. Projection laser rays if enabled
      if (params.projBeamActive !== false) {
        const rayMat = new THREE.LineDashedMaterial({
          color: 0xf59e0b,
          dashSize: 0.2,
          gapSize: 0.1,
        });

        const keyPoints = [
          [2.5 + 1, 0, 1],
          [2.5 + 1, 0.6, 1],
          [2.5 - 1, 2.6, 1],
          [2.5 - 0.4, 2.6, 1],
          [2.5 - 0.4, 0.6, 1],
          [2.5 - 1, 0, 1],
          [2.5 + 1, 0, -1],
          [2.5 + 1, 0.6, -1],
          [2.5 - 1, 2.6, -1],
          [2.5 - 0.4, 2.6, -1],
        ];

        keyPoints.forEach(([x, y, z]) => {
          const rayGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x, y, z),
            new THREE.Vector3(-3, y, z),
          ]);
          const rayLine = new THREE.Line(rayGeo, rayMat);
          rayLine.computeLineDistances();
          sceneGroup.add(rayLine);
        });
      }
      break;
    }

    case "ortho-principles": {
      // Rotate line and plane to show foreshortening: L = L0 * cos(theta)
      const theta = ((params.orthoAngle || 0) * Math.PI) / 180;

      // Reference horizontal ground plane
      const refPlaneGeo = new THREE.PlaneGeometry(8, 6);
      const refPlaneMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
      });
      const refPlane = new THREE.Mesh(refPlaneGeo, refPlaneMat);
      refPlane.rotation.x = -Math.PI / 2;
      refPlane.position.y = 0;
      sceneGroup.add(refPlane);

      const refGrid = new THREE.GridHelper(8, 8, 0x10b981, 0x334155);
      refGrid.position.y = 0.01;
      sceneGroup.add(refGrid);

      // Rotating Line Object
      const lineLen = 4;
      const linePivot = new THREE.Group();
      linePivot.position.set(-2, 0.1, 0);

      const barGeo = new THREE.CylinderGeometry(0.08, 0.08, lineLen, 16);
      const barMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.8,
        roughness: 0.2,
      });
      const barMesh = new THREE.Mesh(barGeo, barMat);
      barMesh.position.set(0, lineLen / 2, 0);

      linePivot.add(barMesh);
      linePivot.rotation.z = Math.PI / 2 - theta; // Angle with ground
      sceneGroup.add(linePivot);

      // Shadow / Orthographic projection line on ground
      const projLen = Math.max(0.05, lineLen * Math.cos(theta));
      const shadowGeo = new THREE.PlaneGeometry(projLen, 0.25);
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        side: THREE.DoubleSide,
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.set(-2 + projLen / 2, 0.02, 0);
      sceneGroup.add(shadowMesh);

      // Vertical ray droppers
      const dropRayMat = new THREE.LineDashedMaterial({
        color: 0x38bdf8,
        dashSize: 0.15,
        gapSize: 0.1,
      });
      const tipX = -2 + lineLen * Math.cos(theta);
      const tipY = lineLen * Math.sin(theta);
      const dropGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(tipX, tipY, 0),
        new THREE.Vector3(tipX, 0.02, 0),
      ]);
      const dropLine = new THREE.Line(dropGeo, dropRayMat);
      dropLine.computeLineDistances();
      sceneGroup.add(dropLine);

      // Rotating rectangular plate on the right side
      const platePivot = new THREE.Group();
      platePivot.position.set(2, 0.05, 0);

      const plateGeo = new THREE.BoxGeometry(2, 0.08, 2.5);
      const plateMat = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        metalness: 0.4,
        roughness: 0.3,
      });
      const plateMesh = new THREE.Mesh(plateGeo, plateMat);
      plateMesh.position.set(1, 0, 0);
      platePivot.add(plateMesh);
      platePivot.rotation.z = theta;
      sceneGroup.add(platePivot);
      break;
    }

    case "three-planes": {
      // 3D Glass Box (First-Angle vs Third-Angle unfolding)
      const unfold = params.unfoldProgress !== undefined ? params.unfoldProgress : 0.4;
      const boxSize = 4;

      // Center stepped workpiece
      const workPiece = new THREE.Group();
      const step1 = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 1.2, 1.6),
        new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.5, roughness: 0.3 })
      );
      step1.position.set(0, 0.6, 0);
      workPiece.add(step1);

      const step2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 1.0, 1.6),
        new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.5, roughness: 0.3 })
      );
      step2.position.set(-0.4, 1.7, 0);
      workPiece.add(step2);

      sceneGroup.add(workPiece);

      // Vertical Plane (Front View - Fixed reference)
      const vPlaneGeo = new THREE.PlaneGeometry(boxSize, boxSize);
      const vPlaneMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      const vPlane = new THREE.Mesh(vPlaneGeo, vPlaneMat);
      vPlane.position.set(0, boxSize / 2, -boxSize / 2);
      sceneGroup.add(vPlane);

      // Horizontal Plane (Top/Plan View - unfolds down in 1st angle)
      const hPivot = new THREE.Group();
      hPivot.position.set(0, 0, -boxSize / 2);
      const hPlane = new THREE.Mesh(
        vPlaneGeo,
        new THREE.MeshStandardMaterial({
          color: 0x10b981,
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide,
        })
      );
      hPlane.position.set(0, 0, boxSize / 2);
      hPlane.rotation.x = -Math.PI / 2;
      hPivot.add(hPlane);
      // Unfold rotation around x
      hPivot.rotation.x = unfold * (Math.PI / 2);
      sceneGroup.add(hPivot);

      // Profile / Side Plane (Left side view - unfolds to right in 1st angle)
      const sPivot = new THREE.Group();
      sPivot.position.set(boxSize / 2, boxSize / 2, -boxSize / 2);
      const sPlane = new THREE.Mesh(
        vPlaneGeo,
        new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide,
        })
      );
      sPlane.position.set(0, 0, boxSize / 2);
      sPlane.rotation.y = Math.PI / 2;
      sPivot.add(sPlane);
      // Unfold rotation around y
      sPivot.rotation.y = unfold * (Math.PI / 2);
      sceneGroup.add(sPivot);
      break;
    }

    case "isometric-oblique": {
      // 3D Object comparing 30° Isometric vs 45° Oblique
      const isIso = params.isometricStyle !== "oblique";

      const blockGroup = new THREE.Group();

      // Create a stepped block with a cylindrical hole
      const b1 = new THREE.Mesh(
        new THREE.BoxGeometry(3, 1.2, isIso ? 2.5 : 1.25),
        new THREE.MeshStandardMaterial({ color: 0x059669, metalness: 0.3, roughness: 0.4 })
      );
      b1.position.set(0, 0.6, 0);
      blockGroup.add(b1);

      const b2 = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 1.5, isIso ? 2.5 : 1.25),
        new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.3, roughness: 0.4 })
      );
      b2.position.set(-0.75, 1.95, 0);
      blockGroup.add(b2);

      // 3D coordinate axes
      const axesHelper = new THREE.AxesHelper(3.5);
      blockGroup.add(axesHelper);

      // 30 degree angle indicators for Isometric
      if (isIso) {
        const ringGeo = new THREE.RingGeometry(1.2, 1.25, 32, 1, 0, Math.PI / 6);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide });
        const ring1 = new THREE.Mesh(ringGeo, ringMat);
        ring1.position.set(0, 0, 0);
        blockGroup.add(ring1);
      }

      sceneGroup.add(blockGroup);
      break;
    }

    case "dim-1-1": {
      // 3D technical dimensioning standard (8-10 mm rule)
      const offset = (params.dimDistance || 8) * 0.2; // visual scale

      const partGeo = new THREE.BoxGeometry(4, 2.5, 2);
      const partMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        metalness: 0.6,
        roughness: 0.3,
      });
      const partMesh = new THREE.Mesh(partGeo, partMat);
      partMesh.position.set(0, 1.25, 0);
      sceneGroup.add(partMesh);

      // Cylinder through block
      const cylGeo = new THREE.CylinderGeometry(0.6, 0.6, 2.05, 32);
      const cylMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
      const cylMesh = new THREE.Mesh(cylGeo, cylMat);
      cylMesh.position.set(0, 1.25, 0);
      cylMesh.rotation.x = Math.PI / 2;
      sceneGroup.add(cylMesh);

      // 3D Dimension extension lines
      const isCorrectOffset = (params.dimDistance || 8) >= 8 && (params.dimDistance || 8) <= 10;
      const dimColor = isCorrectOffset ? 0x10b981 : 0xef4444;

      const extMat = new THREE.LineBasicMaterial({ color: dimColor, linewidth: 2 });

      // Left & Right extension lines extending up
      const extLGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-2, 2.6, 1.05),
        new THREE.Vector3(-2, 2.6 + offset + 0.3, 1.05),
      ]);
      const extRGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(2, 2.6, 1.05),
        new THREE.Vector3(2, 2.6 + offset + 0.3, 1.05),
      ]);
      sceneGroup.add(new THREE.Line(extLGeo, extMat));
      sceneGroup.add(new THREE.Line(extRGeo, extMat));

      // Main Dimension Line with arrows
      const dimLineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-2, 2.6 + offset, 1.05),
        new THREE.Vector3(2, 2.6 + offset, 1.05),
      ]);
      sceneGroup.add(new THREE.Line(dimLineGeo, extMat));

      // Arrow cones
      const coneGeo = new THREE.ConeGeometry(0.12, 0.35, 16);
      const coneMat = new THREE.MeshBasicMaterial({ color: dimColor });
      const leftArrow = new THREE.Mesh(coneGeo, coneMat);
      leftArrow.position.set(-1.85, 2.6 + offset, 1.05);
      leftArrow.rotation.z = Math.PI / 2;
      sceneGroup.add(leftArrow);

      const rightArrow = new THREE.Mesh(coneGeo, coneMat);
      rightArrow.position.set(1.85, 2.6 + offset, 1.05);
      rightArrow.rotation.z = -Math.PI / 2;
      sceneGroup.add(rightArrow);
      break;
    }

    case "sketch-1-2": {
      // 3D Drafting Table & Freehand Sketching Desk
      const deskGroup = new THREE.Group();

      // Slanted Drafting Board
      const boardGeo = new THREE.BoxGeometry(6, 4.5, 0.2);
      const boardMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.6,
      });
      const boardMesh = new THREE.Mesh(boardGeo, boardMat);
      boardMesh.rotation.x = -Math.PI / 5;
      boardMesh.position.set(0, 1.5, 0);
      deskGroup.add(boardMesh);

      // White Drawing Paper sheet on board
      const paperGeo = new THREE.PlaneGeometry(4.8, 3.4);
      const paperMat = new THREE.MeshBasicMaterial({
        color: 0xf8fafc,
        side: THREE.DoubleSide,
      });
      const paperMesh = new THREE.Mesh(paperGeo, paperMat);
      paperMesh.position.set(0, 0.05, 0.11);
      boardMesh.add(paperMesh);

      // Grid lines on paper
      const paperGrid = new THREE.GridHelper(3.2, 16, 0x94a3b8, 0xe2e8f0);
      paperGrid.rotation.x = -Math.PI / 2;
      paperGrid.position.set(0, 0.06, 0.12);
      boardMesh.add(paperGrid);

      // 3D Pencil
      const pencilGroup = new THREE.Group();
      const pBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.07, 2, 6),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b })
      );
      const pTip = new THREE.Mesh(
        new THREE.ConeGeometry(0.07, 0.35, 6),
        new THREE.MeshStandardMaterial({ color: 0x1e293b })
      );
      pTip.position.y = -1.15;
      pencilGroup.add(pBody);
      pencilGroup.add(pTip);
      pencilGroup.position.set(1.5, 2.5, 1.2);
      pencilGroup.rotation.set(0.4, 0.2, 0.8);
      deskGroup.add(pencilGroup);

      sceneGroup.add(deskGroup);
      break;
    }

    default:
      break;
  }
}
