import * as THREE from "three";

/* ==========================================================================
   Dragons Solutions mascot — a small 3D dragon built in code with three.js.
   No model file to load: geometry, materials and animation are all here.

   Modes
     idle  breathing, blinking, tail sway, small wing flutter
     walk  walks across the canvas and turns around at the edges
     fire  inhales, then breathes fire, on a loop (use it as a loading state)
     fly   hovers with full wing beats
   ========================================================================== */

export type DragonColor = "blue" | "red" | "green" | "gold" | "purple";
export type DragonMode = "idle" | "walk" | "fire" | "fly";

type Palette = { body: number; belly: number; wing: number; spikes: number; horn: number };

export const palettes: Record<DragonColor, Palette> = {
  blue: { body: 0x2e7bf0, belly: 0xcfe0ff, wing: 0x1b4fb0, spikes: 0x163f8c, horn: 0xf4efe4 },
  red: { body: 0xd7262b, belly: 0xffd9c9, wing: 0x92161a, spikes: 0x7a1114, horn: 0xf4efe4 },
  green: { body: 0x1f9d61, belly: 0xd3f3df, wing: 0x126b40, spikes: 0x0d5634, horn: 0xf4efe4 },
  gold: { body: 0xe3a52a, belly: 0xfff1c8, wing: 0xab700f, spikes: 0x8a5808, horn: 0xfffaf0 },
  purple: { body: 0x7b4fdc, belly: 0xe4d9ff, wing: 0x4e2a9f, spikes: 0x3d2085, horn: 0xf4efe4 },
};

export const colorNames = Object.keys(palettes) as DragonColor[];

export type DragonOptions = {
  color?: DragonColor;
  mode?: DragonMode;
  /** Render one still frame instead of animating */
  still?: boolean;
};

export type DragonHandle = {
  setColor: (c: DragonColor) => void;
  setMode: (m: DragonMode) => void;
  setRunning: (on: boolean) => void;
  resize: () => void;
  dispose: () => void;
};

/* ---------- helpers ---------- */

const TAU = Math.PI * 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

function mesh(geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  return m;
}

function blobShadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 4, 64, 64, 62);
  grd.addColorStop(0, "rgba(10,18,32,0.45)");
  grd.addColorStop(1, "rgba(10,18,32,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function wingShape() {
  // Bat-style wing drawn in the XY plane: x runs back along the body, y up.
  const s = new THREE.Shape();
  s.moveTo(0.15, 0);
  s.lineTo(0.1, 0.35);
  s.quadraticCurveTo(-0.1, 1.25, -0.35, 1.75); // leading edge up to the wing tip
  s.lineTo(-0.55, 1.55);
  s.quadraticCurveTo(-0.7, 1.25, -0.95, 1.3); // scallop 1
  s.quadraticCurveTo(-1.05, 0.95, -1.35, 0.95); // scallop 2
  s.quadraticCurveTo(-1.3, 0.55, -1.55, 0.45); // scallop 3
  s.quadraticCurveTo(-1.0, 0.25, -0.55, 0.02);
  s.lineTo(0.15, 0);
  return s;
}

/* ---------- the model ---------- */

type Rig = {
  root: THREE.Group;
  body: THREE.Group;
  torso: THREE.Mesh;
  head: THREE.Group;
  jaw: THREE.Group;
  eyes: THREE.Group[];
  wings: THREE.Group[];
  legs: THREE.Group[];
  tail: THREE.Group[];
  mouth: THREE.Object3D;
  mats: { body: THREE.MeshStandardMaterial; belly: THREE.MeshStandardMaterial; wing: THREE.MeshStandardMaterial; spikes: THREE.MeshStandardMaterial; horn: THREE.MeshStandardMaterial };
};

/** Builds the dragon model (no lights, no shadow). Exported so scripts/export-glb can save it as .glb */
export function buildDragon(p: Palette): Rig {
  const std = (color: number, rough = 0.55) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0.05 });
  const mats = {
    body: std(p.body, 0.5),
    belly: std(p.belly, 0.7),
    wing: new THREE.MeshStandardMaterial({ color: p.wing, roughness: 0.6, side: THREE.DoubleSide }),
    spikes: std(p.spikes, 0.5),
    horn: std(p.horn, 0.4),
  };
  const white = std(0xffffff, 0.2);
  const black = std(0x0b1220, 0.3);

  const sphere = new THREE.SphereGeometry(1, 32, 24);
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  // Torso and belly
  const torso = mesh(sphere, mats.body, 0, 1.25, 0);
  torso.scale.set(1.3, 1, 0.95);
  body.add(torso);
  const belly = mesh(sphere, mats.belly, 0.35, 1.08, 0);
  belly.scale.set(0.95, 0.78, 0.8);
  body.add(belly);

  // Neck
  const neck = mesh(sphere, mats.body, 0.95, 1.8, 0);
  neck.scale.set(0.5, 0.6, 0.5);
  body.add(neck);

  // Head
  const head = new THREE.Group();
  head.position.set(1.15, 2.15, 0);
  body.add(head);
  const skull = mesh(sphere, mats.body, 0.15, 0.25, 0);
  skull.scale.set(0.78, 0.72, 0.72);
  head.add(skull);
  const snout = mesh(sphere, mats.body, 0.72, 0.1, 0);
  snout.scale.set(0.58, 0.4, 0.5);
  head.add(snout);

  // Lower jaw, hinged so the mouth can open
  const jaw = new THREE.Group();
  jaw.position.set(0.35, -0.08, 0);
  head.add(jaw);
  const jawMesh = mesh(sphere, mats.belly, 0.38, -0.08, 0);
  jawMesh.scale.set(0.52, 0.17, 0.42);
  jaw.add(jawMesh);
  const mouth = new THREE.Object3D();
  mouth.position.set(1.32, 0.0, 0);
  head.add(mouth);

  // Nostrils
  for (const z of [-0.13, 0.13]) head.add(mesh(new THREE.SphereGeometry(0.045, 10, 8), black, 1.26, 0.24, z));

  // Eyes (a group per eye so blinking can squash it)
  const eyes: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const eye = new THREE.Group();
    eye.position.set(0.5, 0.52, side * 0.4);
    eye.add(mesh(new THREE.SphereGeometry(0.21, 20, 16), white));
    eye.add(mesh(new THREE.SphereGeometry(0.12, 16, 12), black, 0.12, 0.02, side * 0.07));
    eye.add(mesh(new THREE.SphereGeometry(0.04, 8, 6), white, 0.2, 0.08, side * 0.1));
    head.add(eye);
    eyes.push(eye);
  }

  // Horns
  const hornGeo = new THREE.ConeGeometry(0.11, 0.62, 14);
  for (const side of [-1, 1]) {
    const horn = mesh(hornGeo, mats.horn, -0.2, 0.9, side * 0.3);
    horn.rotation.set(side * -0.35, 0, 0.75);
    head.add(horn);
  }
  // Small ear frills
  for (const side of [-1, 1]) {
    const frill = mesh(new THREE.ConeGeometry(0.12, 0.35, 4), mats.wing, -0.42, 0.45, side * 0.55);
    frill.rotation.set(side * -1.1, 0, 1.2);
    frill.scale.set(1, 1, 0.4);
    head.add(frill);
  }

  // Back spikes
  const spikeGeo = new THREE.ConeGeometry(0.13, 0.36, 4);
  const spikePath: [number, number, number][] = [
    [0.7, 2.25, 0.35], [0.25, 2.25, 0.2], [-0.25, 2.2, 0.0], [-0.7, 2.02, -0.25], [-1.1, 1.7, -0.5],
  ];
  for (const [x, y, rz] of spikePath) {
    const s = mesh(spikeGeo, mats.spikes, x, y, 0);
    s.rotation.z = rz;
    s.scale.set(1, 1, 0.45);
    body.add(s);
  }

  // Tail: a chain of segments, each parented to the last so sway ripples down
  const tail: THREE.Group[] = [];
  let parent: THREE.Object3D = body;
  const segs = 7;
  for (let i = 0; i < segs; i++) {
    const g = new THREE.Group();
    if (i === 0) g.position.set(-1.1, 1.0, 0);
    else g.position.set(-0.3, 0, 0);
    const r = lerp(0.45, 0.13, i / (segs - 1));
    const seg = mesh(sphere, mats.body, -0.18, 0, 0);
    seg.scale.set(r * 1.45, r, r);
    g.add(seg);
    if (i % 2 === 1) {
      const sp = mesh(spikeGeo, mats.spikes, -0.2, r * 0.9, 0);
      sp.scale.set(0.7, 0.7, 0.35);
      sp.rotation.z = 0.5;
      g.add(sp);
    }
    parent.add(g);
    tail.push(g);
    parent = g;
  }
  const tip = mesh(new THREE.ConeGeometry(0.26, 0.55, 4), mats.spikes, -0.55, 0, 0);
  tip.rotation.z = Math.PI / 2;
  tip.scale.set(1, 1, 0.3);
  parent.add(tip);

  // Wings
  const wingGeo = new THREE.ExtrudeGeometry(wingShape(), { depth: 0.03, bevelEnabled: false, curveSegments: 12 });
  const armGeo = new THREE.CylinderGeometry(0.045, 0.06, 1.0, 8);
  const wings: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const hinge = new THREE.Group();
    hinge.position.set(0.1, 1.95, side * 0.45);
    const w = mesh(wingGeo, mats.wing, 0, 0, -0.015);
    hinge.add(w);
    const arm = mesh(armGeo, mats.body, -0.1, 0.85, 0);
    arm.rotation.z = 0.25;
    hinge.add(arm);
    body.add(hinge);
    wings.push(hinge);
  }

  // Legs
  const legGeo = new THREE.CapsuleGeometry(0.2, 0.32, 6, 12);
  const clawGeo = new THREE.ConeGeometry(0.05, 0.14, 8);
  const legs: THREE.Group[] = [];
  const hips: [number, number, number][] = [
    [0.62, 0.8, 0.5], [0.62, 0.8, -0.5], [-0.6, 0.8, 0.55], [-0.6, 0.8, -0.55],
  ];
  for (const [x, y, z] of hips) {
    const hip = new THREE.Group();
    hip.position.set(x, y, z);
    const leg = mesh(legGeo, mats.body, 0, -0.32, 0);
    hip.add(leg);
    const foot = mesh(sphere, mats.body, 0.1, -0.66, 0);
    foot.scale.set(0.27, 0.14, 0.22);
    hip.add(foot);
    for (const dz of [-0.1, 0, 0.1]) {
      const claw = mesh(clawGeo, mats.horn, 0.36, -0.7, dz);
      claw.rotation.z = -Math.PI / 2;
      hip.add(claw);
    }
    body.add(hip);
    legs.push(hip);
  }

  return { root, body, torso, head, jaw, eyes, wings, legs, tail, mouth, mats };
}

/* ---------- fire particles ---------- */

const FIRE_COUNT = 600;

function buildFire() {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(FIRE_COUNT * 3);
  const col = new Float32Array(FIRE_COUNT * 3);
  const alpha = new Float32Array(FIRE_COUNT);
  const size = new Float32Array(FIRE_COUNT);
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  geo.setAttribute("alpha", new THREE.BufferAttribute(alpha, 1));
  geo.setAttribute("size", new THREE.BufferAttribute(size, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { scale: { value: 300 } },
    vertexShader: `
      attribute vec3 color; attribute float alpha; attribute float size;
      varying vec3 vColor; varying float vAlpha;
      uniform float scale;
      void main() {
        vColor = color; vAlpha = alpha;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * scale / -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying vec3 vColor; varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float soft = smoothstep(0.5, 0.15, d);
        gl_FragColor = vec4(vColor, vAlpha * soft);
      }`,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  const state = Array.from({ length: FIRE_COUNT }, () => ({
    life: 0, max: 1, p: new THREE.Vector3(), v: new THREE.Vector3(), s: 0,
  }));
  return { points, geo, mat, state, cursor: 0 };
}

const fireRamp = [
  new THREE.Color(0xfff6c2), // white-yellow core
  new THREE.Color(0xffd84a),
  new THREE.Color(0xffa22a),
  new THREE.Color(0xff6a1a),
  new THREE.Color(0xd92a14),
  new THREE.Color(0x6b6f78), // smoke
];
function rampColor(t: number, out: THREE.Color) {
  const x = clamp01(t) * (fireRamp.length - 1);
  const i = Math.min(fireRamp.length - 2, Math.floor(x));
  return out.copy(fireRamp[i]).lerp(fireRamp[i + 1], x - i);
}

/* ---------- engine ---------- */

export function createDragon(canvas: HTMLCanvasElement, opts: DragonOptions = {}): DragonHandle {
  let color: DragonColor = opts.color ?? "blue";
  let mode: DragonMode = opts.mode ?? "idle";
  const still = !!opts.still;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x9aa6bb, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(4, 8, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xbfd6ff, 1.2);
  rim.position.set(-6, 4, -4);
  scene.add(rim);

  const rig = buildDragon(palettes[color]);
  scene.add(rig.root);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(4.2, 2.4),
    new THREE.MeshBasicMaterial({ map: blobShadowTexture(), transparent: true, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.01;
  rig.root.add(shadow);
  const fire = buildFire();
  scene.add(fire.points);

  /* walk state */
  let walkX = 0;
  let dir = 1;
  let turning = 0; // 0..1 while turning around
  let walkRange = 3;

  /* blink state */
  let nextBlink = 1.5;
  let blinkT = -1;

  const clock = new THREE.Clock();
  let raf = 0;
  let running = false;
  let elapsed = 0;
  const tmpV = new THREE.Vector3();
  const tmpDir = new THREE.Vector3();
  const tmpQ = new THREE.Quaternion();
  const tmpC = new THREE.Color();

  function frameCamera() {
    const w = canvas.clientWidth || 300;
    const h = canvas.clientHeight || 300;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const wide = camera.aspect > 1.8;
    if (mode === "walk" && wide) {
      camera.fov = 26;
      camera.position.set(0, 2.0, 15);
      camera.lookAt(0, 1.45, 0);
      const halfW = Math.tan((camera.fov * Math.PI) / 360) * 15 * camera.aspect;
      walkRange = Math.max(0.5, halfW - 2.6);
    } else {
      camera.fov = 30;
      // Pull back on narrow canvases so the fire and tail stay in frame
      const base = mode === "fire" ? 15.5 : 13;
      const dist = camera.aspect < 1 ? base / camera.aspect ** 0.5 : base;
      camera.position.set(mode === "fire" ? 0.7 : 0, 2.6, dist);
      camera.lookAt(mode === "fire" ? 0.7 : 0, 1.6, 0);
      walkRange = 1.2;
    }
    camera.updateProjectionMatrix();
    fire.mat.uniforms.scale.value = h * 0.9;
  }

  function spawnFire(strength: number) {
    rig.mouth.getWorldPosition(tmpV);
    rig.head.getWorldQuaternion(tmpQ);
    tmpDir.set(1, -0.08, 0).applyQuaternion(tmpQ).normalize();
    const n = Math.round(10 * strength);
    for (let k = 0; k < n; k++) {
      const pt = fire.state[fire.cursor];
      fire.cursor = (fire.cursor + 1) % FIRE_COUNT;
      pt.life = 0;
      pt.max = 0.5 + Math.random() * 0.45;
      pt.p.copy(tmpV);
      const speed = 5 + Math.random() * 2.5;
      pt.v.copy(tmpDir).multiplyScalar(speed);
      pt.v.x += (Math.random() - 0.5) * 1.8;
      pt.v.y += (Math.random() - 0.5) * 1.8 + 0.2;
      pt.v.z += (Math.random() - 0.5) * 1.8;
      pt.s = 0.3 + Math.random() * 0.25;
    }
  }

  function updateFire(dt: number) {
    const pos = fire.geo.attributes.position as THREE.BufferAttribute;
    const col = fire.geo.attributes.color as THREE.BufferAttribute;
    const al = fire.geo.attributes.alpha as THREE.BufferAttribute;
    const sz = fire.geo.attributes.size as THREE.BufferAttribute;
    for (let i = 0; i < FIRE_COUNT; i++) {
      const pt = fire.state[i];
      if (pt.life >= pt.max) {
        al.setX(i, 0);
        continue;
      }
      pt.life += dt;
      const t = pt.life / pt.max;
      pt.v.multiplyScalar(1 - 1.6 * dt);
      pt.v.y += 2.2 * dt; // heat rises
      pt.p.addScaledVector(pt.v, dt);
      pos.setXYZ(i, pt.p.x, pt.p.y, pt.p.z);
      rampColor(t, tmpC);
      col.setXYZ(i, tmpC.r, tmpC.g, tmpC.b);
      al.setX(i, t < 0.75 ? 0.95 : lerp(0.95, 0, (t - 0.75) / 0.25) * 0.6);
      sz.setX(i, pt.s * (0.7 + t * 2.6));
    }
    pos.needsUpdate = col.needsUpdate = al.needsUpdate = sz.needsUpdate = true;
  }

  function pose(t: number, dt: number) {
    const { root, body, torso, head, jaw, eyes, wings, legs, tail } = rig;

    // reset per-frame pose
    body.position.set(0, 0, 0);
    body.rotation.set(0, 0, 0);
    head.rotation.set(0, 0, 0);
    jaw.rotation.set(0, 0, 0);
    let breath = Math.sin(t * 2.2) * 0.025;
    let wingOpen = 0.35 + Math.sin(t * 2.2) * 0.05;
    let wingBeat = 0;
    let tailSpeed = 1.6;
    let tailAmp = 0.12;
    let fireStrength = 0;
    legs.forEach((l) => l.rotation.set(0, 0, 0));

    if (mode === "idle") {
      root.position.set(0, 0, 0);
      root.rotation.y = -0.75;
      head.rotation.z = Math.sin(t * 1.1) * 0.05;
      head.rotation.y = Math.sin(t * 0.6) * 0.12;
    }

    if (mode === "walk") {
      const speed = 1.3;
      if (turning > 0) {
        turning += dt / 0.7;
        if (turning >= 1) {
          turning = 0;
          dir *= -1;
        }
      } else {
        walkX += dir * speed * dt;
        if (walkX > walkRange || walkX < -walkRange) {
          walkX = Math.max(-walkRange, Math.min(walkRange, walkX));
          turning = 0.0001;
        }
      }
      const baseYaw = (d: number) => (d > 0 ? -0.22 : Math.PI + 0.22);
      root.rotation.y = turning > 0 ? lerp(baseYaw(dir), baseYaw(-dir), smooth(turning)) : baseYaw(dir);
      root.position.set(walkX, 0, 0);
      const moving = turning === 0;
      const phase = t * 7.5;
      const amp = moving ? 0.55 : 0.15;
      legs[0].rotation.z = Math.sin(phase) * amp;
      legs[3].rotation.z = Math.sin(phase) * amp;
      legs[1].rotation.z = Math.sin(phase + Math.PI) * amp;
      legs[2].rotation.z = Math.sin(phase + Math.PI) * amp;
      body.position.y = Math.abs(Math.sin(phase)) * 0.09;
      body.rotation.z = Math.sin(phase) * 0.03;
      head.rotation.z = Math.sin(phase + 0.6) * 0.06;
      tailSpeed = 3.8;
      tailAmp = 0.18;
      wingOpen = 0.3;
    }

    if (mode === "fire") {
      root.position.set(-1.0, 0, 0);
      root.rotation.y = -0.3;
      const cycle = 3.0;
      const c = t % cycle;
      if (c < 0.7) {
        // inhale: lean back, chest fills
        const k = smooth(c / 0.7);
        head.rotation.z = 0.35 * k;
        body.rotation.z = 0.08 * k;
        breath = 0.07 * k;
        wingOpen = 0.35 + 0.4 * k;
      } else if (c < 2.2) {
        // breathe fire
        const k = smooth(clamp01((c - 0.7) / 0.15));
        head.rotation.z = lerp(0.35, -0.12, k) + Math.sin(t * 30) * 0.015;
        body.rotation.z = lerp(0.08, -0.04, k);
        jaw.rotation.z = -0.55 * k;
        breath = lerp(0.07, -0.03, clamp01((c - 0.7) / 1.5));
        wingOpen = 0.75;
        fireStrength = k * (c > 2.0 ? 1 - (c - 2.0) / 0.2 : 1);
      } else {
        // recover
        const k = smooth((c - 2.2) / 0.8);
        head.rotation.z = lerp(-0.12, 0, k);
        body.rotation.z = lerp(-0.04, 0, k);
        jaw.rotation.z = lerp(-0.55, 0, k * 1.4 > 1 ? 1 : k * 1.4);
        wingOpen = lerp(0.75, 0.35, k);
      }
    }

    if (mode === "fly") {
      root.rotation.y = -0.45;
      root.position.set(0, 0, 0);
      wingBeat = Math.sin(t * 9);
      wingOpen = 0.9 + wingBeat * 0.75;
      body.position.y = 0.9 + Math.sin(t * 9 - 0.8) * 0.12;
      body.rotation.z = 0.12;
      legs.forEach((l, i) => (l.rotation.z = -0.6 - (i > 1 ? 0.2 : 0)));
      tailSpeed = 2.4;
      head.rotation.z = -0.1;
    }

    // shared secondary motion
    torso.scale.set(1.3 + breath, 1 + breath, 0.95 + breath * 0.6);
    wings[0].rotation.set(-wingOpen, 0, 0.15);
    wings[1].rotation.set(wingOpen, 0, 0.15);
    tail.forEach((g, i) => {
      g.rotation.y = Math.sin(t * tailSpeed - i * 0.55) * tailAmp;
      g.rotation.z = (i === 0 ? 0.3 : -0.16) + Math.sin(t * tailSpeed * 0.7 - i * 0.5) * 0.04;
    });
    shadow.scale.setScalar(mode === "fly" ? 0.8 - Math.sin(t * 9 - 0.8) * 0.04 : 1);
    (shadow.material as THREE.MeshBasicMaterial).opacity = mode === "fly" ? 0.6 : 1;

    // blinking
    nextBlink -= dt;
    if (nextBlink <= 0 && blinkT < 0) blinkT = 0;
    let eyeY = 1;
    if (blinkT >= 0) {
      blinkT += dt;
      const b = blinkT / 0.16;
      eyeY = b < 0.5 ? 1 - b * 1.8 : 0.1 + (b - 0.5) * 1.8;
      if (b >= 1) {
        blinkT = -1;
        eyeY = 1;
        nextBlink = 2 + Math.random() * 3.5;
      }
    }
    eyes.forEach((e) => (e.scale.y = Math.max(0.1, eyeY)));

    rig.root.updateMatrixWorld(true);
    if (fireStrength > 0) spawnFire(fireStrength);
  }

  function render() {
    renderer.render(scene, camera);
  }

  function tick() {
    const dt = Math.min(clock.getDelta(), 1 / 20);
    elapsed += dt;
    pose(elapsed, dt);
    updateFire(dt);
    render();
    raf = requestAnimationFrame(tick);
  }

  function setRunning(on: boolean) {
    if (still) return;
    if (on && !running) {
      running = true;
      clock.getDelta();
      raf = requestAnimationFrame(tick);
    } else if (!on && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  }

  function applyColor(c: DragonColor) {
    color = c;
    const p = palettes[c];
    rig.mats.body.color.setHex(p.body);
    rig.mats.belly.color.setHex(p.belly);
    rig.mats.wing.color.setHex(p.wing);
    rig.mats.spikes.color.setHex(p.spikes);
    rig.mats.horn.color.setHex(p.horn);
    if (still) render();
  }

  frameCamera();
  if (still) {
    pose(1.2, 0);
    render();
  } else {
    setRunning(true);
  }

  return {
    setColor: applyColor,
    setMode(m) {
      if (m === mode) return;
      mode = m;
      walkX = 0;
      turning = 0;
      elapsed = 0;
      frameCamera();
      if (still) {
        pose(1.2, 0);
        render();
      }
    },
    setRunning,
    resize() {
      frameCamera();
      if (still || !running) render();
    },
    dispose() {
      setRunning(false);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else if (mat) mat.dispose();
      });
      renderer.dispose();
    },
  };
}
