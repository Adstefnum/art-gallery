const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../public/assets/images/products-images');
const outputDir = path.join(__dirname, '../public/assets/optimized/images/products-images');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const optimizeImage = async (inputPath, filename) => {
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  // Generate regular WebP
  await image
    .resize(280) // Match your card width
    .webp({ quality: 80 })
    .toFile(path.join(outputDir, filename.replace(/\.(jpg|png|jpeg)$/, '.webp')));

  // Generate 2x WebP for retina displays
  await image
    .resize(560) // 2x size
    .webp({ quality: 80 })
    .toFile(path.join(outputDir, filename.replace(/\.(jpg|png|jpeg)$/, '@2x.webp')));

  // Generate regular JPEG fallback
  await image
    .resize(280)
    .jpeg({ quality: 80, progressive: true })
    .toFile(path.join(outputDir, filename));

  // Generate 2x JPEG fallback for retina displays
  await image
    .resize(560)
    .jpeg({ quality: 80, progressive: true })
    .toFile(path.join(outputDir, filename.replace(/\.(jpg|png|jpeg)$/, '@2x$1')));
};

const processImages = async () => {
  const files = fs.readdirSync(inputDir);

  for (const file of files) {
    if (file.match(/\.(jpg|jpeg|png)$/i)) {
      console.log(`Optimizing ${file}...`);
      await optimizeImage(path.join(inputDir, file), file);
    }
  }
};

processImages().catch(console.error); 