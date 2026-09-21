export type Car = {
  id: number;
  name: string;
  make: string;
  model: string;
  year: number;
  price: string;
  mileage: string;
  fuel: string;
  transmission: string;
  image: string;
  images: string[];
  tag?: string;
  description: string;
};

export const INITIAL_CARS: Car[] = [
  {
    id: 1,
    name: 'Mercedes-Benz CLA 45 AMG 2014',
    make: 'Mercedes-Benz',
    model: 'CLA 45 AMG',
    year: 2014,
    price: 'Price on Request',
    mileage: 'Clean Carfax',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: '/inventory/mercedes-cla-45-amg-2014/cla-1.jpg',
    images: [
      '/inventory/mercedes-cla-45-amg-2014/cla-1.jpg',
      '/inventory/mercedes-cla-45-amg-2014/cla-2.jpg',
      '/inventory/mercedes-cla-45-amg-2014/cla-3.jpg',
      '/inventory/mercedes-cla-45-amg-2014/cla-4.jpg',
      '/inventory/mercedes-cla-45-amg-2014/cla-5.jpg'
    ],
    tag: 'CLEAN CARFAX ✅ • AMG PERFORMANCE PACKAGE • PANORAMIC SUNROOF',
    description: 'Clean Carfax ✅ • AMG Performance Package • Panoramic Sunroof • Blind Spot • Xenon Headlights • Rear Camera • Dynamic Select Driving Mode • White on Black with red accents and AMG sport alloys'
  },
  {
    id: 2,
    name: 'Land Rover Range Rover Evoque 2015',
    make: 'Land Rover',
    model: 'Range Rover Evoque',
    year: 2015,
    price: 'Price on Request',
    mileage: 'Contact Showroom',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: '/inventory/range-rover-evoque-2015/evoque-1.jpg',
    images: [
      '/inventory/range-rover-evoque-2015/evoque-1.jpg',
      '/inventory/range-rover-evoque-2015/evoque-2.jpg',
      '/inventory/range-rover-evoque-2015/evoque-3.jpg',
      '/inventory/range-rover-evoque-2015/evoque-4.jpg',
      '/inventory/range-rover-evoque-2015/evoque-5.jpg'
    ],
    tag: 'BLACK PACK • PANORAMIC ROOF • CERTIFIED PRE-OWNED',
    description: 'Santorini Black • Black Leather Interior • Panoramic Glass Roof • Black Alloy Wheels • Premium Sound System • Certified Pre-Owned'
  },
  {
    id: 3,
    name: 'Mitsubishi Outlander Sport 2019',
    make: 'Mitsubishi',
    model: 'Outlander Sport',
    year: 2019,
    price: 'Price on Request',
    mileage: 'Low Mileage',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: '/inventory/mitsubishi-outlander-sport-2019/outlander-1.jpg',
    images: [
      '/inventory/mitsubishi-outlander-sport-2019/outlander-1.jpg',
      '/inventory/mitsubishi-outlander-sport-2019/outlander-2.jpg',
      '/inventory/mitsubishi-outlander-sport-2019/outlander-3.jpg',
      '/inventory/mitsubishi-outlander-sport-2019/outlander-4.jpg',
      '/inventory/mitsubishi-outlander-sport-2019/outlander-5.jpg'
    ],
    tag: 'LOW MILEAGE • REAR VIEW CAMERA • FOG LIGHTS',
    description: 'Low Mileage • Fog lights • Rear view camera • Electric mirrors • Electric windows • Black finish with black alloy wheels • Clean condition'
  },
  {
    id: 4,
    name: 'Mercedes-Benz C250 AMG 2012',
    make: 'Mercedes-Benz',
    model: 'C250 AMG',
    year: 2012,
    price: 'Price on Request',
    mileage: '140,000 miles',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: '/inventory/mercedes-c250-amg-2012/c250-1.jpg',
    images: [
      '/inventory/mercedes-c250-amg-2012/c250-1.jpg',
      '/inventory/mercedes-c250-amg-2012/c250-2.jpg',
      '/inventory/mercedes-c250-amg-2012/c250-3.jpg',
      '/inventory/mercedes-c250-amg-2012/c250-4.jpg',
      '/inventory/mercedes-c250-amg-2012/c250-5.jpg'
    ],
    tag: 'ONE OWNER ✅ • FULL OPTIONS • PANORAMIC SUNROOF',
    description: 'One Owner ✅ • ODO: 140,000 miles • Black on grey interior • Full options • Panoramic sunroof • Paddle shifters • 360° sensors • Rear view camera • Heating seats • All service done • AMG sport package & styling'
  },
  {
    id: 5,
    name: 'Mercedes-Benz CLA 250 AMG 2014',
    make: 'Mercedes-Benz',
    model: 'CLA 250 AMG',
    year: 2014,
    price: 'Price on Request',
    mileage: 'Clean Carfax',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: '/inventory/mercedes-cla-250-amg-2014/cla250-1.webp',
    images: [
      '/inventory/mercedes-cla-250-amg-2014/cla250-1.webp',
      '/inventory/mercedes-cla-250-amg-2014/cla250-2.webp',
      '/inventory/mercedes-cla-250-amg-2014/cla250-3.webp',
      '/inventory/mercedes-cla-250-amg-2014/cla250-4.webp',
      '/inventory/mercedes-cla-250-amg-2014/cla250-5.webp'
    ],
    tag: 'CLEAN CARFAX ✅ • 2018 FACELIFT • PANORAMIC SUNROOF',
    description: 'Clean Carfax ✅ • Original 2018 Facelift • Red on Black leather interior • Panoramic sunroof • LED headlights & taillights • Rear view camera • New Tires ✅ • All service done • AMG styling & package'
  },
  {
    id: 6,
    name: 'Jeep Grand Cherokee Altitude 2015',
    make: 'Jeep',
    model: 'Grand Cherokee Altitude',
    year: 2015,
    price: 'Price on Request',
    mileage: 'Contact Showroom',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: '/inventory/jeep-grand-cherokee-altitude-2015/jeep-1.jpg',
    images: [
      '/inventory/jeep-grand-cherokee-altitude-2015/jeep-1.jpg',
      '/inventory/jeep-grand-cherokee-altitude-2015/jeep-2.jpg',
      '/inventory/jeep-grand-cherokee-altitude-2015/jeep-3.jpg',
      '/inventory/jeep-grand-cherokee-altitude-2015/jeep-4.jpg',
      '/inventory/jeep-grand-cherokee-altitude-2015/jeep-5.jpg'
    ],
    tag: 'ALTITUDE 4X4 • KEYLESS GO • HEATED SEATS & STEERING',
    description: 'Keyless Entry • Keyless Start/Stop Button • Rear Camera • Parking Sensors • Electric Trunk • Heated Seats • Heated Steering Wheel • Billet Silver Metallic with Gloss Black wheels & Altitude package styling • 4x4'
  }
];

export function getMakes(carList: Car[]): string[] {
  return Array.from(new Set(carList.map(c => c.make).filter(Boolean))).sort();
}

export function getMakeModelsMap(carList: Car[]): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const car of carList) {
    if (!car.make || !car.model) continue;
    if (!map[car.make]) map[car.make] = [];
    if (!map[car.make].includes(car.model)) {
      map[car.make].push(car.model);
    }
  }
  return map;
}

export function getAllModels(carList: Car[]): string[] {
  return Array.from(new Set(carList.map(c => c.model).filter(Boolean))).sort();
}

export function getYears(carList: Car[]): number[] {
  return Array.from(new Set(carList.map(c => c.year).filter(Boolean))).sort((a, b) => b - a);
}

export function getFuels(carList: Car[]): string[] {
  const fuels = Array.from(new Set(carList.map(c => c.fuel).filter(Boolean))).sort();
  return fuels.length > 0 ? fuels : ['Petrol'];
}

export function getTransmissions(carList: Car[]): string[] {
  const trans = Array.from(new Set(carList.map(c => c.transmission).filter(Boolean))).sort();
  return trans.length > 0 ? trans : ['Automatic'];
}
