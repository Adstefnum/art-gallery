const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const optimizeLogo = async () => {
  const inputPath = path.join(__dirname, '../public/assets/icons/logo.png');
  const outputDir = path.join(__dirname, '../public/assets/optimized/icons');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate WebP version - assuming logo should be 40px (adjust size as needed)
  await sharp(inputPath)
    .resize(40, 40) // Fixed size for logo
    .webp({ quality: 90 }) // Higher quality for logo
    .toFile(path.join(outputDir, 'logo.webp'));

  // Generate PNG fallback
  await sharp(inputPath)
    .resize(40, 40)
    .png({ quality: 90 })
    .toFile(path.join(outputDir, 'logo.png'));
};

optimizeLogo().catch(console.error); 