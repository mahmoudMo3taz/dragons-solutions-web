/**
 * Saves the dragon as .glb 3D model files, one per colour, into public/models/.
 *   npm run export:models
 * Open them in Blender, Windows 3D Viewer, https://gltf-viewer.donmccurdy.com,
 * or use them with any 3D tool. The website itself draws the dragon live in code
 * (src/components/dragon/engine.ts), so these files are optional extras.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { buildDragon, palettes, colorNames } from "../src/components/dragon/engine";

// GLTFExporter uses the browser FileReader for binary output; give Node a small stand-in.
class NodeFileReader {
  result: ArrayBuffer | string | null = null;
  onloadend: (() => void) | null = null;
  readAsArrayBuffer(blob: Blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      this.onloadend?.();
    });
  }
  readAsDataURL(blob: Blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = `data:${blob.type};base64,${Buffer.from(buf).toString("base64")}`;
      this.onloadend?.();
    });
  }
}
(globalThis as unknown as { FileReader: unknown }).FileReader = NodeFileReader;

const out = join(process.cwd(), "public", "models");
mkdirSync(out, { recursive: true });

function restPose(rig: ReturnType<typeof buildDragon>) {
  rig.wings[0].rotation.set(-0.4, 0, 0.15);
  rig.wings[1].rotation.set(0.4, 0, 0.15);
  rig.tail.forEach((g, i) => (g.rotation.z = i === 0 ? 0.3 : -0.16));
  rig.root.updateMatrixWorld(true);
}

async function main() {
  for (const color of colorNames) {
    const rig = buildDragon(palettes[color]);
    restPose(rig);
    rig.root.name = `dragon-${color}`;
    const scene = new THREE.Scene();
    scene.add(rig.root);
    const glb = (await new GLTFExporter().parseAsync(scene, { binary: true })) as ArrayBuffer;
    const file = join(out, `dragon-${color}.glb`);
    writeFileSync(file, Buffer.from(glb));
    console.log(`saved ${file} (${Math.round(glb.byteLength / 1024)} KB)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
