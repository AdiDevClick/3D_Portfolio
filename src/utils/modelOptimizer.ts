// optimize-models.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const SOURCE_DIR = './src/3DModels/original';
const OUTPUT_DIR = './src/3DModels/optimized';
const MOBILE_DIR = './src/3DModels/mobile';

// Création des dossiers de sortie s'ils n'existent pas
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(MOBILE_DIR)) fs.mkdirSync(MOBILE_DIR, { recursive: true });

// Récupération de tous les modèles .glb
const modelsFiles = fs
    .readdirSync(SOURCE_DIR)
    .filter((file) => file.endsWith('.glb'));

// Traitement de chaque modèle
modelsFiles.forEach((file) => {
    const sourcePath = path.join(SOURCE_DIR, file);
    const outputPath = path.join(OUTPUT_DIR, file);
    const mobilePath = path.join(MOBILE_DIR, file);

    // Version standard optimisée
    console.log(`Optimisation de ${file} (standard)...`);
    execSync(
        `gltf-pipeline -i "${sourcePath}" -o "${outputPath}" --draco.compressionLevel=7`
    );

    // Version mobile très compressée
    console.log(`Optimisation de ${file} (mobile)...`);
    execSync(
        `gltf-pipeline -i "${sourcePath}" -o "${mobilePath}" --draco.compressionLevel=10 --draco.quantizePositionBits=14 --draco.quantizeNormalBits=10 --draco.quantizeTexcoordBits=12`
    );
});

console.log('Tous les modèles ont été optimisés!');
