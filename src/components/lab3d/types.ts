export type CameraPreset = "isometric" | "front" | "top" | "side" | "reset";

export interface Lab3DProps {
  lessonId: string;
  params: {
    // Ch 1
    projBeamActive?: boolean;
    orthoAngle?: number;
    projectionAngle?: "first" | "third";
    unfoldProgress?: number;
    isometricStyle?: "iso" | "oblique";
    dimDistance?: number;
    sketchStrokeType?: "horizontal" | "vertical" | "circle";
    sketchAccuracy?: number;

    // Ch 2
    metalType?: "steel" | "cast-iron" | "copper" | "aluminum";
    metalTestType?: "magnet" | "spark" | "density";
    furnaceTemp?: number;
    furnaceCoke?: number;
    furnaceLimestone?: number;
    furnaceRunning?: boolean;
    furnaceTapped?: boolean;
    rollingTemp?: number;
    rollingPasses?: number;
    alloyMixCopper?: number;
    alloyMixZinc?: number;
    alloyMixTin?: number;
    enginePlaying?: boolean;
    engineStroke?: number;
    engineSpeed?: number;
    activeCarSystem?: "fuel" | "cooling" | "lube" | "ignition";
    carburetorRatio?: number;
    radiatorTemp?: number;
    oilPressure?: number;

    // Ch 3
    coulombQ1?: number;
    coulombQ2?: number;
    coulombDist?: number;
    dielectric?: "air" | "paper" | "ceramic" | "mica";
    plateDist?: number;
    voltage?: number;
    plateArea?: number;
    magnetPos?: number;
    magnetOscillating?: boolean;
    coilTurns?: number;
    switchClosed?: boolean;
    inductanceL?: number;
    dopingType?: "intrinsic" | "n-type" | "p-type";
    thermalExcitation?: number;

    // Ch 4
    trussLoad?: number;
    trussType?: "warren" | "pratt";
    foundationType?: "shallow" | "deep";
    buildingWeight?: number;
    elasticForce?: number;
    elasticMaterial?: "steel" | "copper" | "aluminum";
    viscosityFluid?: "water" | "oil" | "honey";
    fluidBallY?: number;
    fluidBallRolling?: boolean;
    pollutionSlider?: number;
    acidRainActive?: boolean;
  };
}
