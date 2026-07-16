import fs from 'fs';
import path from 'path';
import { writeAzp } from '../../../azphalt/packages/azp/dist/index.js';

const manifest = JSON.parse(fs.readFileSync("manifest.json", "utf8"));
const payload = {};

const assetsDir = "assets";
if (fs.existsSync(assetsDir)) {
    const assets = fs.readdirSync(assetsDir);
    for (const asset of assets) {
        const assetPath = path.join(assetsDir, asset);
        const assetBuffer = fs.readFileSync(assetPath);
        payload[`assets/${asset}`] = new Uint8Array(assetBuffer);
    }
}

const { azp } = writeAzp({
    manifest: manifest,
    payload: payload,
    license: manifest.license === "MIT" ? "MIT License" : (manifest.license || "Proprietary")
});

const distDir = "dist";
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}
fs.writeFileSync(path.join(distDir, `${manifest.id}.azp`), azp);
console.log(`Built ${manifest.id}.azp`);
