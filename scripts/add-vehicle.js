#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

/**
 * Fast Vehicle Adder for Chahrour Motors
 * Usage:
 *   node scripts/add-vehicle.js --json '{"name": "...", "make": "...", ...}'
 *   node scripts/add-vehicle.js <name> <year> <make> <model> <mileage> <tag> <description> [imagePaths...]
 */

const projectRoot = process.cwd();
const dataFilePath = path.join(projectRoot, 'src', 'data', 'cars.ts');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export function addVehicle(carData, imageSources = []) {
  if (!fs.existsSync(dataFilePath)) {
    console.error('Data file not found:', dataFilePath);
    process.exit(1);
  }

  const slug = slugify(`${carData.make}-${carData.model}-${carData.year}`);
  const destDir = path.join(projectRoot, 'public', 'inventory', slug);
  fs.mkdirSync(destDir, { recursive: true });

  const copiedImages = [];
  if (imageSources && imageSources.length > 0) {
    imageSources.forEach((srcPath, idx) => {
      if (fs.existsSync(srcPath)) {
        const ext = path.extname(srcPath) || '.jpg';
        const destName = `img-${idx + 1}${ext}`;
        const destPath = path.join(destDir, destName);
        fs.copyFileSync(srcPath, destPath);
        copiedImages.push(`/inventory/${slug}/${destName}`);
      }
    });
  }

  const images = copiedImages.length > 0 ? copiedImages : (carData.images || ['/chahrour-motors-hero.jpg']);
  const primaryImage = images[0];

  const content = fs.readFileSync(dataFilePath, 'utf8');

  // Parse existing IDs to get next ID
  const idMatches = [...content.matchAll(/id:\s*(\d+)/g)].map(m => parseInt(m[1], 10));
  const nextId = idMatches.length > 0 ? Math.max(...idMatches) + 1 : 1;

  const newCar = {
    id: nextId,
    name: carData.name || `${carData.make} ${carData.model} ${carData.year}`,
    make: carData.make,
    model: carData.model,
    year: parseInt(carData.year, 10),
    price: carData.price || 'Price on Request',
    mileage: carData.mileage || 'Contact Showroom',
    fuel: carData.fuel || 'Petrol',
    transmission: carData.transmission || 'Automatic',
    image: primaryImage,
    images: images,
    tag: carData.tag || `${carData.make.toUpperCase()} • ${carData.year}`,
    description: carData.description || `${carData.make} ${carData.model} ${carData.year}`
  };

  const formattedCar = `  {
    id: ${newCar.id},
    name: ${JSON.stringify(newCar.name)},
    make: ${JSON.stringify(newCar.make)},
    model: ${JSON.stringify(newCar.model)},
    year: ${newCar.year},
    price: ${JSON.stringify(newCar.price)},
    mileage: ${JSON.stringify(newCar.mileage)},
    fuel: ${JSON.stringify(newCar.fuel)},
    transmission: ${JSON.stringify(newCar.transmission)},
    image: ${JSON.stringify(newCar.image)},
    images: ${JSON.stringify(newCar.images, null, 6).replace(/\n\s*/g, ' ')},
    tag: ${JSON.stringify(newCar.tag)},
    description: ${JSON.stringify(newCar.description)}
  }`;

  // Insert before the end of INITIAL_CARS array
  const updatedContent = content.replace(
    /(export const INITIAL_CARS: Car\[\] = \[\n)([\s\S]*?)(\n\];)/,
    (match, p1, p2, p3) => `${p1}${p2},\n${formattedCar}${p3}`
  );

  fs.writeFileSync(dataFilePath, updatedContent, 'utf8');
  console.log(`✅ Successfully added ${newCar.name} (ID: ${newCar.id}) to inventory!`);
  return newCar;
}

// CLI handler
const args = process.argv.slice(2);
if (args.length > 0 && args[0] === '--json') {
  const json = JSON.parse(args[1]);
  addVehicle(json, json.imageSources || []);
}
