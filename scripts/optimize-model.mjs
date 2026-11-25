import { NodeIO } from '@gltf-transform/core';
import { KHRTextureTransform, EXTMeshoptCompression, EXTTextureWebP } from '@gltf-transform/extensions';
import { dedup, prune, weld, quantize, meshopt, textureCompress } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const input = path.resolve('3D_Models/Astro_Library.glb');
const outDir = path.resolve('public/models');
const output = path.join(outDir, 'Astro_Library.glb');

await mkdir(outDir, { recursive: true });
await MeshoptEncoder.ready;

const io = new NodeIO()
  .registerExtensions([KHRTextureTransform, EXTMeshoptCompression, EXTTextureWebP])
  .registerDependencies({
    'meshopt.decoder': MeshoptDecoder,
    'meshopt.encoder': MeshoptEncoder,
  });

console.log('Reading', input);
const document = await io.read(input);
const root = document.getRoot();

console.log('Original textures:', root.listTextures().length);
await document.transform(
  dedup(),
  prune(),
  weld(),
  textureCompress({
    encoder: sharp,
    targetFormat: 'webp',
    quality: 88,
    resize: [2048, 2048],
  }),
  quantize({
    quantizePosition: 14,
    quantizeNormal: 10,
    quantizeTexcoord: 12,
    quantizeColor: 8,
    quantizeWeight: 8,
  }),
  meshopt({ encoder: MeshoptEncoder, level: 'high' })
);

document.getRoot().getAsset().generator = 'astro-library optimize (gltf-transform)';
await io.write(output, document);
console.log('Wrote', output);
