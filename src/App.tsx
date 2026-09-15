import { useMemo, useState, useEffect, useLayoutEffect } from 'react';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Facebook,
  Fuel,
  Gauge,
  Grid2X2,
  Instagram,
  List,
  MapPin,
  Maximize2,
  Menu,
  MessageSquare,
  Phone,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
  ZoomIn,
} from 'lucide-react';

/* ─── Filter State Types ────────────────────────── */
type FilterState = {
  makes: string[];
  models: string[];
  years: number[];
  fuels: string[];
  transmissions: string[];
  minYear: number;
  maxYear: number;
  minPrice: number;
  maxPrice: number;
};

const DEFAULT_FILTERS: FilterState = {
  makes: [],
  models: [],
  years: [],
  fuels: [],
  transmissions: [],
  minYear: 2005,
  maxYear: 2026,
  minPrice: 0,
  maxPrice: 600000,
};

const ALL_MAKES = [
  'Audi',
  'MG',
  'Voyah',
  'DongFeng',
  'Mercedes-Benz',
  'Land Rover',
  'Toyota',
  'Nissan',
  'Hyundai',
  'Jetour',
  'Changan',
  'BMW',
  'BYD',
  'Porsche',
  'Ferrari',
  'Lamborghini',
  'Aston Martin',
  'Rolls-Royce',
  'Bentley',
  'Audi Sport',
  'McLaren',
];

const MAKE_MODELS_MAP: Record<string, string[]> = {
  'Audi': ['Q8 Premium Plus', 'Q8 55 TFSI', 'Q8', 'Q7', 'RS6 Avant', 'RSQ8', 'e-tron GT'],
  'MG': ['E-RX5 Plug-in Hybrid', 'E-RX5', 'RX5', 'MG4', 'Cyberster', 'ZS EV'],
  'Voyah': ['Passion EV', 'Free', 'Dreamer', 'Courage'],
  'DongFeng': ['M-Hero M817 Platinum', 'M-Hero 2 817 ULTRA', 'M-Hero 917', 'Mengshi M817', 'M-Hero 1'],
  'Mercedes-Benz': ['G 500', 'A 180 AMG Package', 'A 180', 'Maybach GLS 600', 'GLS 600 Maybach', 'G 63 AMG Night Package', 'G 63 AMG', 'C 300 AMG Package', 'AMG GT 63 S', 'SL 63 AMG', 'C 300'],
  'Land Rover': ['Range Rover Vogue P525 HSE', 'Range Rover Vogue P525 Autobiography', 'Range Rover Velar P250 S', 'Velar P250 S', 'Range Rover Vogue HSE', 'Defender 110 P400', 'Defender 110', 'Range Rover Vogue', 'Range Rover SV Autobiography', 'Range Rover Sport SV'],
  'Toyota': ['Land Cruiser GX-R', 'Land Cruiser GX-R V6', 'bZ3', 'bZ3X Pro', 'bZ3X', 'Land Cruiser Prado R3', 'Prado R3', 'Land Cruiser VX-R Grand Touring S', 'Land Cruiser VX-R', 'Land Cruiser 300', 'Prado'],
  'Nissan': ['Kicks SV', 'Kicks', 'Patrol', 'X-Trail'],
  'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade'],
  'Jetour': ['T2 Travel Plus', 'G700 Flagship', 'T2', 'Dashing', 'X70 Plus', 'X90 Plus'],
  'Changan': ['Deepal G318 4WD', 'Deepal G318', 'Deepal S07 EV', 'Deepal S07', 'UNI-K', 'CS95'],
  'BMW': ['530i xDrive Sport Line', '530i xDrive M-Package', '530i xDrive', 'M4 Competition xDrive', 'M8 Competition Gran Coupé', 'M3 CS'],
  'BYD': ['Song Plus EV', 'Song Plus', 'Leopard 7 ULTRA', 'Leopard 5', 'Yangwang U8', 'Seal'],
  'Porsche': ['911 GT3 RS', 'Taycan Turbo S', 'Cayenne Turbo GT'],
  'Ferrari': ['296 GTB Assetto Fiorano', 'Roma Spider', 'SF90 Stradale'],
  'Lamborghini': ['Urus Performante', 'Huracán Tecnica', 'Revuelto'],
  'Aston Martin': ['DB12 Coupe', 'Vantage V8', 'DBX 707'],
  'Rolls-Royce': ['Ghost Black Badge', 'Cullinan Series II'],
  'Bentley': ['Arnage T-Mulliner Presidential', 'Arnage T', 'Arnage', 'Continental GT V8 Azure', 'Flying Spur Speed'],
  'Audi Sport': ['RS6 Avant Dynamic', 'RS e-tron GT'],
  'McLaren': ['750S Spider', 'Artura'],
};

const ALL_MODELS = [
  'Land Cruiser GX-R',
  'G 500',
  'A 180 AMG Package',
  'A 180',
  'Q8 Premium Plus',
  'Q8',
  'Arnage T-Mulliner Presidential',
  'Arnage T',
  'bZ3',
  'E-RX5 Plug-in Hybrid',
  'E-RX5',
  'Elantra',
  'Range Rover Vogue P525 HSE',
  'bZ3X Pro',
  'bZ3X',
  'C 300 AMG Package',
  'Kicks SV',
  'Kicks',
  'M-Hero M817 Platinum',
  'Range Rover Vogue P525 Autobiography',
  'Range Rover Velar P250 S',
  'Velar P250 S',
  'T2 Travel Plus',
  'Land Cruiser Prado R3',
  'Prado R3',
  'Song Plus EV',
  'Song Plus',
  'Maybach GLS 600',
  'GLS 600 Maybach',
  '530i xDrive Sport Line',
  'Deepal G318 4WD',
  'Deepal G318',
  'Passion EV',
  'M-Hero 2 817 ULTRA',
  'G 63 AMG Night Package',
  'Defender 110 P400',
  'Land Cruiser VX-R Grand Touring S',
  'Jetour G700 Flagship',
  'Deepal S07 EV',
  '530i xDrive M-Package',
  'Leopard 7 ULTRA',
  'Range Rover Vogue HSE',
  'Voyah Passion',
  'M-Hero 917',
  'Mengshi M817',
  'G700 Flagship',
  'T2',
  'Land Cruiser VX-R',
  '530i xDrive',
  'Deepal S07',
  'G 63 AMG',
  'Defender 110',
  'AMG GT 63 S',
  '911 GT3 RS',
  'Taycan Turbo S',
  'Cayenne Turbo GT',
  '296 GTB Assetto Fiorano',
  'Roma Spider',
  'SF90 Stradale',
  'G 63 AMG Edition 55',
  'AMG GT 63 S 4-Door',
  'SL 63 AMG',
  'Urus Performante',
  'Huracán Tecnica',
  'Revuelto',
  'DB12 Coupe',
  'Vantage V8',
  'DBX 707',
  'Ghost Black Badge',
  'Cullinan Series II',
  'Continental GT V8 Azure',
  'Flying Spur Speed',
  'M4 Competition xDrive',
  'M8 Competition Gran Coupé',
  'M3 CS',
  'RS6 Avant Dynamic',
  'RS e-tron GT',
  'Range Rover SV Autobiography',
  'Range Rover Sport SV',
  '750S Spider',
  'Artura',
];

const ALL_YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];
const ALL_FUELS = ['Petrol', 'Petrol (MHEV)', 'Electric', 'Hybrid', 'Hybrid (DMO PHEV)', 'Hybrid (EREV AWD)', 'Diesel'];
const ALL_TRANSMISSIONS = ['Automatic (9G-TRONIC)', 'Automatic (Steptronic Sport)', 'Automatic', 'Automatic (Electric Drive)', 'Automatic (E-CVT)', 'Automatic (Multi-Motor Drive)', 'Automatic (PDK)', 'Dual-Clutch'];

type Page = 'home' | 'inventory' | 'about' | 'journal' | 'car' | 'contact';

type Car = {
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
  images?: string[];
  tag?: string;
  description: string;
};

const cars: Car[] = [
  {
    id: 1,
    name: 'Mercedes-Benz G 63 AMG Night Package 2020',
    make: 'Mercedes-Benz',
    model: 'G 63 AMG Night Package',
    year: 2020,
    price: '$189,000',
    mileage: '44,000 km',
    fuel: 'Petrol',
    transmission: 'Automatic (9G-TRONIC)',
    image: '/inventory/mercedes-g63-2020/g63-1.jpg',
    images: [
      '/inventory/mercedes-g63-2020/g63-1.jpg',
      '/inventory/mercedes-g63-2020/g63-2.jpg',
      '/inventory/mercedes-g63-2020/g63-3.jpg',
      '/inventory/mercedes-g63-2020/g63-4.jpg',
      '/inventory/mercedes-g63-2020/g63-5.jpg'
    ],
    tag: 'NIGHT PACKAGE • FULL PPF',
    description: 'Mercedes-Benz G 63 2020 Night Package. Finished in Black on Black with Obsidian Black exterior and Black Exclusive Nappa Leather interior. German Source with 44,000 Km. Full Body PPF Installed (Paint Protection Film). Powered by a 4.0L Handcrafted AMG V8 Biturbo engine with 577 hp and 627 lb-ft of torque. Features AMG Night Package, 22" Matte Black Forged Cross-Spoke AMG Wheels, Red AMG Calipers, AMG Side-Exit Sport Exhaust, Burmester Surround Audio, Multi-beam LED, 360-degree Cameras, Glass Sunroof, and full carbon accents.'
  },
  {
    id: 2,
    name: 'Land Rover Defender 110 P400',
    make: 'Land Rover',
    model: 'Defender 110 P400',
    year: 2020,
    price: 'Price on Request',
    mileage: '42,000 miles',
    fuel: 'Petrol (MHEV)',
    transmission: 'Automatic',
    image: '/inventory/defender-110-p400-2020/defender-1.jpg',
    images: [
      '/inventory/defender-110-p400-2020/defender-1.jpg',
      '/inventory/defender-110-p400-2020/defender-2.jpg',
      '/inventory/defender-110-p400-2020/defender-3.jpg',
      '/inventory/defender-110-p400-2020/defender-4.jpg',
      '/inventory/defender-110-p400-2020/defender-5.jpg'
    ],
    tag: 'CLEAN CARFAX • EXPEDITION PACK',
    description: 'Land Rover Defender P400 110 2020. Finished in Fuji White on Ebony Black Leather interior. Clean Carfax with only 42,000 miles. Equipped with the powerful 3.0L Turbocharged i6 engine producing 395 hp with Mild Hybrid (MHEV) technology and permanent All-Wheel Drive. Features Expedition Roof Rack with Deployable Side Ladder, Raised Air Intake Snorkel, Exterior Side-Mounted Gear Carrier, Full Size Spare Wheel with Defender Cover, Panoramic Glass Sunroof, Premium LED Headlights with Signature DRLs, 3D Surround Camera System, Meridian Sound System, and Terrain Response 2.'
  },
  {
    id: 3,
    name: 'Changan Deepal S07 2025',
    make: 'Changan',
    model: 'Deepal S07',
    year: 2025,
    price: '$33,000',
    mileage: '0 km (Brand New)',
    fuel: 'Electric',
    transmission: 'Automatic (Electric Drive)',
    image: '/inventory/changan-deepal-s07-2025/deepal-1.jpg',
    images: [
      '/inventory/changan-deepal-s07-2025/deepal-1.jpg',
      '/inventory/changan-deepal-s07-2025/deepal-2.jpg',
      '/inventory/changan-deepal-s07-2025/deepal-3.jpg',
      '/inventory/changan-deepal-s07-2025/deepal-4.jpg',
      '/inventory/changan-deepal-s07-2025/deepal-5.jpg'
    ],
    tag: 'BRAND NEW • 500KM RANGE',
    description: 'Changan Deepal S07 2025. Brand New Car (0 Km Delivery Mileage). Finished in Metallic Black on Black / Basket luxury interior. Pure Electric SUV delivering up to 500 KM Electric Range on a single charge. Features futuristic aerodynamic styling with frameless doors, interactive intelligent LED matrix headlights, full-width illuminated rear lightbar with illuminated Deepal emblem, aero turbine alloy wheels, panoramic glass canopy, AR-HUD augmented reality display, rotating central infotainment touchscreen, 360-degree HD panoramic parking system, and Level 2+ intelligent driver assistance.'
  },
  {
    id: 4,
    name: 'BMW 530i xDrive M-Package 2022',
    make: 'BMW',
    model: '530i xDrive M-Package',
    year: 2022,
    price: '$45,000',
    mileage: '13,000 miles',
    fuel: 'Petrol',
    transmission: 'Automatic (Steptronic Sport)',
    image: '/inventory/bmw-530i-xdrive-2022/bmw-1.jpg',
    images: [
      '/inventory/bmw-530i-xdrive-2022/bmw-1.jpg',
      '/inventory/bmw-530i-xdrive-2022/bmw-2.jpg',
      '/inventory/bmw-530i-xdrive-2022/bmw-3.jpg',
      '/inventory/bmw-530i-xdrive-2022/bmw-4.jpg',
      '/inventory/bmw-530i-xdrive-2022/bmw-5.jpg'
    ],
    tag: 'M-PACKAGE • CLEAN CARFAX',
    description: 'BMW 530i xDrive 2022 M-Package. Finished in Alvite Grey Metallic over Ivory White & Black Two-Tone Extended Leather interior. Clean Carfax with only 13,000 miles. 2.0L BMW TwinPower Turbo engine producing 248 hp paired with xDrive Intelligent All-Wheel Drive and 8-Speed Steptronic Sport Transmission. Equipped with Full M Sport Aerodynamics Package, Shadowline High-Gloss Black Kidney Grille and Trim, 19" M Multi-Spoke Two-Tone Diamond Cut Alloy Wheels, Adaptive LED Headlights, M Sport Leather Steering Wheel with Paddle Shifters, Live Cockpit Professional with 12.3" Navigation Screen, Ambient Interior Lighting, Sunroof, and Harman Kardon Surround Sound.'
  },
  {
    id: 5,
    name: 'BYD Leopard 7 ULTRA 2025',
    make: 'BYD',
    model: 'Leopard 7 ULTRA',
    year: 2025,
    price: '$52,000',
    mileage: '0 km (Brand New)',
    fuel: 'Hybrid (DMO PHEV)',
    transmission: 'Automatic (E-CVT)',
    image: '/inventory/byd-leopard-7-ultra-2025/leopard-1.jpg',
    images: [
      '/inventory/byd-leopard-7-ultra-2025/leopard-1.jpg',
      '/inventory/byd-leopard-7-ultra-2025/leopard-2.jpg',
      '/inventory/byd-leopard-7-ultra-2025/leopard-3.jpg',
      '/inventory/byd-leopard-7-ultra-2025/leopard-4.jpg',
      '/inventory/byd-leopard-7-ultra-2025/leopard-5.jpg'
    ],
    tag: 'BRAND NEW • 1,300KM RANGE',
    description: 'BYD Leopard 7 ULTRA 2025 (Fangchengbao). Brand New Car (0 Km Delivery Mileage). Finished in Obsidian Black Metallic over Dark Blue Luxury Nappa Leather interior. Built on the revolutionary DMO Super Hybrid Off-Road platform offering an incredible 1,300 KM Combined Range with Dual-Motor Intelligent Electric 4WD. Equipped with Roof-Mounted LiDAR Smart Driving Sensor, Illuminated Diamond Grille & LED Matrix Lighting, 20" Matte Black Heavy-Duty Off-Road Wheels, Tailgate-Mounted Spare Wheel with Glowing Emblem, Multi-Screen Cockpit with Rotating Central Display, DiSus-P Hydraulic Suspension System, Wireless Fast Charging, and 360° Transparent Chassis Camera.'
  },
  {
    id: 6,
    name: 'Range Rover Vogue HSE 2018',
    make: 'Land Rover',
    model: 'Range Rover Vogue HSE',
    year: 2018,
    price: 'Price on Request',
    mileage: '80,000 km',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: '/inventory/range-rover-vogue-hse-2018/vogue-1.jpg',
    images: [
      '/inventory/range-rover-vogue-hse-2018/vogue-1.jpg',
      '/inventory/range-rover-vogue-hse-2018/vogue-2.jpg',
      '/inventory/range-rover-vogue-hse-2018/vogue-3.jpg',
      '/inventory/range-rover-vogue-hse-2018/vogue-4.jpg',
      '/inventory/range-rover-vogue-hse-2018/vogue-5.jpg'
    ],
    tag: 'TEWTEL SOURCE • BLACK PACK',
    description: 'Range Rover Vogue HSE 2018. Finished in Santorini Black Metallic over Ebony Black Windsor Leather interior. Official Lebanese Dealer Source (Tewtel) with 80,000 KM. Equipped with 3.0L Supercharged V6 engine paired with 8-Speed Automatic Transmission and Intelligent Electronic Air Suspension. Features Full Black Exterior Design Package (Gloss Black Grille, Side Vents, Badging, and Accents), 21" Gloss Black Turbine Alloy Wheels, Matrix LED Headlights with Signature DRLs, InControl Touch Pro Duo dual-screen infotainment, Soft-Close Doors, Sliding Panoramic Glass Roof, Meridian Premium Sound System, and 360-degree Parking Camera.'
  },
  {
    id: 7,
    name: 'Toyota Land Cruiser VX-R Grand Touring S 5.7L 2021',
    make: 'Toyota',
    model: 'Land Cruiser VX-R Grand Touring S',
    year: 2021,
    price: '$79,500',
    mileage: '70,000 km',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: '/inventory/toyota-land-cruiser-vxr-57-2021/lc-1.jpg',
    images: [
      '/inventory/toyota-land-cruiser-vxr-57-2021/lc-1.jpg',
      '/inventory/toyota-land-cruiser-vxr-57-2021/lc-2.jpg',
      '/inventory/toyota-land-cruiser-vxr-57-2021/lc-3.jpg',
      '/inventory/toyota-land-cruiser-vxr-57-2021/lc-4.jpg',
      '/inventory/toyota-land-cruiser-vxr-57-2021/lc-5.jpg'
    ],
    tag: 'BUMC SERVICE • 1 OWNER',
    description: 'Toyota Land Cruiser VX-R Grand Touring S 5.7L 2021. 1 Single Owner from new. Full Official Lebanese Dealership Service History (BUMC) with 70,000 KM. Finished in Attitude Black Metallic over Saddle Brown Premium Leather interior. Powered by the legendary 5.7L 3UR-FE V8 naturally aspirated engine producing 381 hp with 8-Speed Automatic Transmission and Full-Time 4WD. Features Grand Touring S Aero Body Kit & Spoilers, 20" Diamond Cut Multi-Spoke Alloy Wheels, LED Headlamps with Sequential Turn Indicators, Heated & Ventilated Front Seats, Wood/Leather Steering Wheel, Large Central Touchscreen Navigation, JBL Synthesis Premium Surround Audio, Cool Box, Crawl Control, and Multi-Terrain Select.'
  },
  {
    id: 8,
    name: 'Jetour G700 Flagship 2026',
    make: 'Jetour',
    model: 'G700 Flagship',
    year: 2026,
    price: 'Price on Request',
    mileage: '0 km (Brand New)',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: '/inventory/jetour-g700-flagship-2026/jetour-1.jpg',
    images: [
      '/inventory/jetour-g700-flagship-2026/jetour-1.jpg',
      '/inventory/jetour-g700-flagship-2026/jetour-2.jpg',
      '/inventory/jetour-g700-flagship-2026/jetour-3.jpg',
      '/inventory/jetour-g700-flagship-2026/jetour-4.jpg',
      '/inventory/jetour-g700-flagship-2026/jetour-5.jpg'
    ],
    tag: 'BRAND NEW • 2026 FLAGSHIP',
    description: 'Jetour G700 Flagship 2026. Brand New Car (0 Km Delivery Mileage). Finished in Gloss Black exterior over White & Light Oyster Luxury Leather interior. Rugged boxy luxury off-road architecture with BorgWarner Intelligent 4WD (XWD) system and electronically controlled rear differential lock. Equipped with illuminated JETOUR front grille, matrix LED cube headlights, 20" two-tone off-road wheels, rear door-mounted spare wheel with illuminated JT emblem, ultra-luxury cabin with aviation-style flat-top/bottom steering wheel, 15.6" central console touchscreen, full digital cockpit, crystal gear selector, panoramic roof, and 540-degree panoramic transparent chassis camera.'
  },
  {
    id: 9,
    name: 'DongFeng M-Hero M817 Platinum 2025 PHEV',
    make: 'DongFeng',
    model: 'M-Hero M817 Platinum',
    year: 2025,
    price: '$69,000',
    mileage: '0 km (Brand New)',
    fuel: 'Hybrid (PHEV AWD)',
    transmission: 'Automatic (Multi-Motor Drive)',
    image: '/inventory/dongfeng-m-hero-m817-platinum-2025/mhero-1.jpg',
    images: [
      '/inventory/dongfeng-m-hero-m817-platinum-2025/mhero-1.jpg',
      '/inventory/dongfeng-m-hero-m817-platinum-2025/mhero-2.jpg',
      '/inventory/dongfeng-m-hero-m817-platinum-2025/mhero-3.jpg',
      '/inventory/dongfeng-m-hero-m817-platinum-2025/mhero-4.jpg',
      '/inventory/dongfeng-m-hero-m817-platinum-2025/mhero-5.jpg'
    ],
    tag: 'BRAND NEW • PLATINUM PHEV',
    description: 'DongFeng M-Hero M817 Platinum 2025 PHEV (Mengshi M817). Brand New Car (0 Km Delivery Mileage). Finished in commanding Santorini Black Metallic exterior over Caraway Tan Luxury Leather interior with full Alcantara accents. Built on the ultra-heavy-duty M-Tech platform with multi-motor electric drive, intelligent 4WD with crab-walk steering mode, deployable side ladder, roof rack, and adaptive air suspension. Equipped with roof-mounted LiDAR intelligent driving sensor array, illuminated M front emblem and cross-blade LED matrix lights, rugged military-style rear tailgate cargo box with illuminated M-HERO badge and M817 insignia, 20" dual-tone heavy-duty alloy wheels on Continental tires, multi-screen intelligent cockpit with ambient lighting, heated & cooled massage seating, panoramic glass roof, and 540° transparent chassis HD surround camera system.'
  },
  {
    id: 10,
    name: 'Voyah Passion EV 2023',
    make: 'Voyah',
    model: 'Passion EV',
    year: 2023,
    price: 'Price on Request',
    mileage: '18,000 km',
    fuel: 'Electric',
    transmission: 'Automatic (Electric Drive)',
    image: '/inventory/voyah-passion-ev-2023/voyah-1.jpg',
    images: [
      '/inventory/voyah-passion-ev-2023/voyah-1.jpg',
      '/inventory/voyah-passion-ev-2023/voyah-2.jpg',
      '/inventory/voyah-passion-ev-2023/voyah-3.jpg',
      '/inventory/voyah-passion-ev-2023/voyah-4.jpg',
      '/inventory/voyah-passion-ev-2023/voyah-5.jpg'
    ],
    tag: 'COMPANY SOURCE • 18,000 KM • 7-YR WARRANTY',
    description: 'Voyah Passion 2023 EV (Voyah Zhuiguang Luxury Electric Flagship). Finished in Fuji White exterior over Slate Grey Luxury Leather interior. Official Lebanese Company Source with only 18,000 KM. Covered by official 6-Year Vehicle Warranty & 7-Year Battery Warranty. Dual-motor Intelligent Electric AWD delivering instant supercar acceleration with quiet luxury refinement. Equipped with full-width illuminated front wing badge and animated LED light bar, dynamic deployable active rear spoiler wing, continuous illuminated rear tailbar with VOYAH script, 1.4-meter triple wide panoramic cockpit display with dedicated lower comfort touchscreen, luxury executive seating with massage and ventilation, panoramic glass canopy, and Level 2.5 intelligent driver assistance.'
  },
  {
    id: 11,
    name: 'Deepal G318 (EREV) 4WD 2024',
    make: 'Changan',
    model: 'Deepal G318 4WD',
    year: 2024,
    price: 'Price on Request',
    mileage: '0 km (Brand New)',
    fuel: 'Hybrid (EREV AWD)',
    transmission: 'Automatic (Intelligent 4WD)',
    image: '/inventory/deepal-g318-erev-4wd-2024/g318-1.jpg',
    images: [
      '/inventory/deepal-g318-erev-4wd-2024/g318-1.jpg',
      '/inventory/deepal-g318-erev-4wd-2024/g318-2.jpg',
      '/inventory/deepal-g318-erev-4wd-2024/g318-3.jpg',
      '/inventory/deepal-g318-erev-4wd-2024/g318-4.jpg',
      '/inventory/deepal-g318-erev-4wd-2024/g318-5.jpg'
    ],
    tag: 'BRAND NEW • 1,448 KM RANGE • 424 HP',
    description: 'Deepal G318 (EREV) 4WD 2024. Brand New Car (0 Km Delivery Mileage). Available in Midnight Blue, Gloss Black & Forest Green. High-performance dual electric motors paired with 1.5L Turbo Generator delivering a massive 424 HP (316 kW). 35.07 kWh battery pack providing 190 KM Pure Electric Range and an incredible 1,448 KM Combined Total Range. Equipped with Intelligent 4WD, Multiple Driving & Off-Road Modes, Roof-Mounted Quad Spotlight Pods, Tailgate Full-Size Spare Wheel, 360° Cameras with Transparent Chassis, Adaptive Cruise Control, Lane Keep Assist, Blind Spot Assist, Panoramic Sunroof, Digital Dashboard + Large Center Touchscreen, Wireless Phone Charger, Keyless Go, Ventilated & Heated Premium Seats, Ambient LED Interior Lighting, High-Quality Sound System, Auto-Park Assist, and EV/HEV Mode Selector.'
  },
  {
    id: 12,
    name: 'BMW 530i xDrive Sport Line 2018',
    make: 'BMW',
    model: '530i xDrive Sport Line',
    year: 2018,
    price: 'Price on Request',
    mileage: '85,000 miles',
    fuel: 'Petrol',
    transmission: 'Automatic (Steptronic)',
    image: '/inventory/bmw-530i-xdrive-sport-line-2018/bmw2018-1.jpg',
    images: [
      '/inventory/bmw-530i-xdrive-sport-line-2018/bmw2018-1.jpg',
      '/inventory/bmw-530i-xdrive-sport-line-2018/bmw2018-2.jpg',
      '/inventory/bmw-530i-xdrive-sport-line-2018/bmw2018-3.jpg',
      '/inventory/bmw-530i-xdrive-sport-line-2018/bmw2018-4.jpg',
      '/inventory/bmw-530i-xdrive-sport-line-2018/bmw2018-5.jpg'
    ],
    tag: 'CLEAN CARFAX • SPORT LINE',
    description: 'BMW 530i xDrive 2018 Sport Line. Finished in Black Sapphire Metallic exterior over Black Dakota Luxury Leather interior. Clean Carfax verified history with 85,000 miles. Powered by BMW 2.0L TwinPower Turbo inline 4-cylinder engine producing 248 hp paired with xDrive Intelligent All-Wheel Drive and smooth 8-Speed Steptronic Automatic Transmission. Equipped with Sport Line design package featuring high-gloss black exterior accents, 18" multi-spoke alloy wheels, Adaptive LED headlights with signature Corona daytime running rings, dual chrome exhaust outlets, Sport multi-function leather steering wheel, iDrive navigation infotainment system, ambient interior LED illumination, power glass sunroof, comfort access keyless entry, and rear backup camera.'
  },
  {
    id: 13,
    name: 'Mercedes-Maybach GLS 600 4MATIC 2023',
    make: 'Mercedes-Benz',
    model: 'Maybach GLS 600',
    year: 2023,
    price: 'Price on Request',
    mileage: '7,000 km only',
    fuel: 'Petrol (MHEV)',
    transmission: 'Automatic (9G-TRONIC)',
    image: '/inventory/mercedes-maybach-gls-600-2023/maybach-1.jpg',
    images: [
      '/inventory/mercedes-maybach-gls-600-2023/maybach-1.jpg',
      '/inventory/mercedes-maybach-gls-600-2023/maybach-2.jpg',
      '/inventory/mercedes-maybach-gls-600-2023/maybach-3.jpg',
      '/inventory/mercedes-maybach-gls-600-2023/maybach-4.jpg',
      '/inventory/mercedes-maybach-gls-600-2023/maybach-5.jpg'
    ],
    tag: 'TWO-TONE • 7,000 KM • FULLY LOADED',
    description: 'Mercedes-Benz GLS 600 Maybach 2023 4MATIC. Fully Loaded with only 7,000 KM. Finished in iconic Two-Tone Polar White over Obsidian Black Metallic with bespoke pinstriping, over Mahogany Brown & Macchiato Beige / Silk White Exclusive Designo Nappa Leather. Powered by a 4.0L Handcrafted Biturbo V8 with EQ Boost producing 550 hp + 21 hp electric assist paired with 9G-TRONIC and Maybach-tuned E-ACTIVE BODY CONTROL air suspension. Features Signature Maybach vertical chrome grille and mesh bumper, 23" Maybach Multi-Spoke Polished Forged Wheels, Power-deployable illuminated running boards with Maybach crest, First-Class Rear Lounge with dual executive reclining massage seats, folding tables, refrigerated compartment, rear MBUX tablets & dual 11.6" rear entertainment displays, Burmester High-End 3D Surround Sound, and panoramic glass roof.'
  },
  {
    id: 14,
    name: 'BYD Song Plus EV 2025',
    make: 'BYD',
    model: 'Song Plus EV',
    year: 2025,
    price: '$31,500',
    mileage: '0 km (Brand New)',
    fuel: 'Electric',
    transmission: 'Automatic (Electric Drive)',
    image: '/inventory/byd-song-plus-ev-2025/song-1.jpg',
    images: [
      '/inventory/byd-song-plus-ev-2025/song-1.jpg',
      '/inventory/byd-song-plus-ev-2025/song-2.jpg',
      '/inventory/byd-song-plus-ev-2025/song-3.jpg',
      '/inventory/byd-song-plus-ev-2025/song-4.jpg',
      '/inventory/byd-song-plus-ev-2025/song-5.jpg'
    ],
    tag: 'BRAND NEW • 87KWH • 520KM RANGE',
    description: 'BYD Song Plus EV 2025 (Ocean Series Champion Edition). Brand New Car (0 Km Delivery Mileage). Finished in sleek Nardo Grey Metallic over Two-Tone Silk White and Saddle Brown Luxury Leather interior. Powered by an 87 kWh Blade Battery pack delivering up to 520 KM Pure Electric Range on a single charge. Features aerodynamic marine-inspired styling with crystal LED headlights, full-width illuminated rear lightbar with illuminated BYD script, 19" two-tone aero-blade alloy wheels, rotating central infotainment touchscreen, panoramic glass roof, wireless smartphone charging, 360-degree HD panoramic parking camera, and DiPilot intelligent driver assistance suite.'
  },
  {
    id: 15,
    name: 'Toyota Land Cruiser Prado R3 2024',
    make: 'Toyota',
    model: 'Land Cruiser Prado R3',
    year: 2024,
    price: 'Price on Request',
    mileage: '26,000 km',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: '/inventory/toyota-prado-r3-2024/prado-1.jpg',
    images: [
      '/inventory/toyota-prado-r3-2024/prado-1.jpg',
      '/inventory/toyota-prado-r3-2024/prado-2.jpg',
      '/inventory/toyota-prado-r3-2024/prado-3.jpg',
      '/inventory/toyota-prado-r3-2024/prado-4.jpg',
      '/inventory/toyota-prado-r3-2024/prado-5.jpg'
    ],
    tag: 'BUMC SOURCE • 26,000 KM • UNDER WARRANTY',
    description: 'All-New Toyota Land Cruiser Prado R3 2024 (250 Series). Official Lebanese Dealership Source (BUMC) with only 26,000 KM, fully maintained and under factory warranty. Finished in Attitude Black Metallic over Warm Beige Premium Leather interior. Built on the TNGA-F global platform with full-time 4WD and center locking differential. Equipped with heritage-inspired TOYOTA front grille, rectangular LED headlights, 20" gloss black multi-spoke alloy wheels, 12.3" central touchscreen with wireless Apple CarPlay & Android Auto, digital cockpit, heated & ventilated power seating, sunroof, Multi-Terrain Select with Crawl Control, and Toyota Safety Sense 3.0.'
  },
  {
    id: 16,
    name: 'Jetour T2 Travel Plus 2025',
    make: 'Jetour',
    model: 'T2 Travel Plus',
    year: 2025,
    price: 'Price on Request',
    mileage: '0 km (Brand New)',
    fuel: 'Petrol',
    transmission: 'Automatic (XWD 4WD)',
    image: '/inventory/jetour-t2-travel-plus-2025/t2-1.jpg',
    images: [
      '/inventory/jetour-t2-travel-plus-2025/t2-1.jpg',
      '/inventory/jetour-t2-travel-plus-2025/t2-2.jpg',
      '/inventory/jetour-t2-travel-plus-2025/t2-3.jpg',
      '/inventory/jetour-t2-travel-plus-2025/t2-4.jpg',
      '/inventory/jetour-t2-travel-plus-2025/t2-5.jpg'
    ],
    tag: 'BRAND NEW • TRAVEL PLUS • BLACK ON BLACK',
    description: 'Jetour T2 Travel Plus 2025 (Traveller 2.0T AWD). Brand New Car (0 Km Delivery Mileage). Finished in Gloss Black exterior over Black Suede & Leather interior with contrast sports stitching and diamond-pattern floor mats. Powered by a 2.0L Kunpeng Turbo engine producing 254 hp with 390 Nm torque paired with BorgWarner Sixth-Generation Intelligent XWD All-Wheel Drive and rear electronic differential lock. Equipped with illuminated JETOUR front grille lettering, matrix LED cube headlamps, signature yellow off-road recovery tow hooks, 20" bronze alloy wheels with yellow center caps, tailgate-mounted full-size spare wheel, aviation-style flat-top/bottom multi-function steering wheel, 15.6" central touchscreen display, 540-degree panoramic transparent chassis camera, panoramic glass sunroof, and 12-speaker Sony premium audio.'
  },
  {
    id: 17,
    name: 'Range Rover Velar P250 S 2023',
    make: 'Land Rover',
    model: 'Range Rover Velar P250 S',
    year: 2023,
    price: 'Price on Request',
    mileage: '49,000 miles',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: '/inventory/range-rover-velar-p250-s-2023/velar-1.jpg',
    images: [
      '/inventory/range-rover-velar-p250-s-2023/velar-1.jpg',
      '/inventory/range-rover-velar-p250-s-2023/velar-2.jpg',
      '/inventory/range-rover-velar-p250-s-2023/velar-3.jpg',
      '/inventory/range-rover-velar-p250-s-2023/velar-4.jpg',
      '/inventory/range-rover-velar-p250-s-2023/velar-5.jpg'
    ],
    tag: 'CLEAN CARFAX • BLACK PACK • SANTORINI BLACK',
    description: 'Range Rover Velar P250 S 2023. Finished in striking Santorini Black Metallic over Ebony Black Perforated Grained Leather interior. Clean Carfax certified history with 49,000 miles. Powered by a 2.0L Turbocharged Ingenium 4-cylinder engine producing 247 hp paired with 8-Speed Automatic Transmission and Intelligent All-Wheel Drive with Terrain Response. Equipped with Black Exterior Styling Package (Gloss Black grille, bonnet lettering, side fender vents, and mirror caps), 20" Gloss Black multi-spoke alloy wheels, Premium LED Headlights with Signature DRLs, flush deployable door handles, curved Pivi Pro infotainment touchscreen with navigation, panoramic sliding glass sunroof, Meridian Sound System, and 360-degree parking surround sensors.'
  },
  {
    id: 18,
    name: 'Range Rover Vogue P525 Autobiography 2022',
    make: 'Land Rover',
    model: 'Range Rover Vogue P525 Autobiography',
    year: 2022,
    price: '$175,000',
    mileage: '11,000 km',
    fuel: 'Petrol',
    transmission: 'Automatic (8-Speed)',
    image: '/inventory/range-rover-vogue-p525-autobiography-2022/rrvogue-1.jpg',
    images: [
      '/inventory/range-rover-vogue-p525-autobiography-2022/rrvogue-1.jpg',
      '/inventory/range-rover-vogue-p525-autobiography-2022/rrvogue-2.jpg',
      '/inventory/range-rover-vogue-p525-autobiography-2022/rrvogue-3.jpg',
      '/inventory/range-rover-vogue-p525-autobiography-2022/rrvogue-4.jpg',
      '/inventory/range-rover-vogue-p525-autobiography-2022/rrvogue-5.jpg'
    ],
    tag: 'TEWTEL SERVICE • 11,000 KM • AUTOBIOGRAPHY',
    description: 'Range Rover Vogue P525 Autobiography 2022. Finished in immaculate Fuji White exterior over Deep Garnet & Ebony Luxury Semi-Aniline Leather interior. Official Lebanese Dealership Source with Full Service History at Tewtel and only 11,000 KM. Powered by the commanding 5.0L Supercharged V8 engine producing 525 hp paired with 8-Speed Automatic Transmission, Intelligent All-Wheel Drive, and Electronic Air Suspension with Dynamic Response Pro. Features Autobiography luxury specification, 22" Diamond Turned Multi-Spoke Alloy Wheels, Digital LED Headlights with Signature DRL, Illuminated Autobiography Metal Treadplates, Soft-Close Doors, Sliding Panoramic Glass Sunroof, Executive Class Comfort Plus Rear Seating with Massage, Heating & Ventilation, Meridian Signature 3D Sound System, Curved Pivi Pro Infotainment, and 3D Surround Camera System.'
  },
  {
    id: 19,
    name: 'Nissan Kicks SV 2025',
    make: 'Nissan',
    model: 'Kicks SV',
    year: 2025,
    price: 'Price on Request',
    mileage: '0 km (Brand New)',
    fuel: 'Petrol',
    transmission: 'Automatic (Xtronic CVT)',
    image: '/inventory/nissan-kicks-sv-2025/kicks-1.jpg',
    images: [
      '/inventory/nissan-kicks-sv-2025/kicks-1.jpg',
      '/inventory/nissan-kicks-sv-2025/kicks-2.jpg',
      '/inventory/nissan-kicks-sv-2025/kicks-3.jpg',
      '/inventory/nissan-kicks-sv-2025/kicks-4.jpg',
      '/inventory/nissan-kicks-sv-2025/kicks-5.jpg'
    ],
    tag: 'BRAND NEW • SV TRIM • ZERO KM',
    description: 'Nissan Kicks SV 2025. Brand New Car (0 Km Delivery Mileage). Finished in crisp Fuji White exterior over Ebony Black Sport Fabric/Leather-trimmed interior. Efficient 1.6L 4-cylinder engine paired with smooth Xtronic CVT Automatic Transmission delivering outstanding fuel economy and agile urban performance. Equipped with SV Grade styling package, Signature V-Motion black & chrome front grille, LED headlights with LED signature DRLs, 17" two-tone machined-finish alloy wheels, sport rear roof spoiler, 8" NissanConnect touchscreen infotainment with Apple CarPlay & Android Auto, digital driver display, Push Button Ignition with Intelligent Keyless Entry, Rear Parking Sensors & Rearview Camera, and Nissan Safety Shield 360.'
  },
  {
    id: 20,
    name: 'Mercedes-Benz C 300 4MATIC AMG Package 2016',
    make: 'Mercedes-Benz',
    model: 'C 300 AMG Package',
    year: 2016,
    price: 'Price on Request',
    mileage: '68,000 miles',
    fuel: 'Petrol',
    transmission: 'Automatic (7G-TRONIC)',
    image: '/inventory/mercedes-c300-amg-package-2016/c300-1.jpg',
    images: [
      '/inventory/mercedes-c300-amg-package-2016/c300-1.jpg',
      '/inventory/mercedes-c300-amg-package-2016/c300-2.jpg',
      '/inventory/mercedes-c300-amg-package-2016/c300-3.jpg',
      '/inventory/mercedes-c300-amg-package-2016/c300-4.jpg',
      '/inventory/mercedes-c300-amg-package-2016/c300-5.jpg'
    ],
    tag: 'AMG PACKAGE • 4MATIC • VERY CLEAN',
    description: 'Mercedes-Benz C 300 4MATIC AMG Package 2016. Very Clean Car. Finished in timeless Iridium Silver Metallic exterior over Black Artico / Leather interior with Brushed Aluminum & Piano Black trim accents. Powered by a responsive 2.0L Turbocharged 4-cylinder engine producing 241 hp paired with 7G-TRONIC PLUS Automatic Transmission and 4MATIC Permanent All-Wheel Drive. Equipped with AMG Sport Styling Package (Diamond Grille with Chrome Pins, Aggressive Front & Rear AMG Bumpers, Side Skirts, and Rear Diffuser with Dual Chrome Exhausts), 18" AMG 5-Spoke Star Alloy Wheels, High-Performance LED Headlights with Signature LED Daytime Running Lights, Panoramic Sliding Glass Sunroof, Flat-Bottom AMG Leather Sport Steering Wheel with Paddle Shifters, COMAND Infotainment with Center Controller Dial, DYNAMIC SELECT Driving Modes (Eco, Comfort, Sport, Sport+), Heated Front Seats, and Rearview Backup Camera.'
  },
  {
    id: 21,
    name: 'Toyota BZ3 X Pro 2025',
    make: 'Toyota',
    model: 'bZ3X Pro',
    year: 2025,
    price: 'Price on Request',
    mileage: '0 km (Brand New)',
    fuel: 'Electric',
    transmission: 'Automatic (Electric Drive)',
    image: '/inventory/toyota-bz3x-pro-2025/bz3x-1.jpg',
    images: [
      '/inventory/toyota-bz3x-pro-2025/bz3x-1.jpg',
      '/inventory/toyota-bz3x-pro-2025/bz3x-2.jpg',
      '/inventory/toyota-bz3x-pro-2025/bz3x-3.jpg',
      '/inventory/toyota-bz3x-pro-2025/bz3x-4.jpg',
      '/inventory/toyota-bz3x-pro-2025/bz3x-5.jpg'
    ],
    tag: 'BRAND NEW • 58.37 KWH • 520KM RANGE',
    description: 'Toyota BZ3 X Pro 2025 (bZ3X Pro Intelligent EV). Brand New Car (0 Km Delivery Mileage). Finished in sophisticated Eiger Gray Metallic over Premium Black interior. Equipped with high-efficiency 58.37 kWh battery pack delivering up to 520 KM Pure Electric Range on a single charge and 204 HP electric motor. Features cutting-edge Roof-Mounted LiDAR Smart Sensor, Intelligent Driving Assistance Package, 19" Two-Tone Diamond Cut Aerodynamic Alloy Wheels, Full-Width Animated LED Front & Rear Lightbars, Premium Yamaha High-Fidelity Audio System, Fast Wireless Phone Charging Pad with Active Cooling Fan, Ultra-Wide Touchscreen Infotainment, 360-Degree Panoramic Parking Camera, and Panoramic Glass Canopy.'
  },
  {
    id: 22,
    name: 'Range Rover Vogue P525 HSE V8 2020',
    make: 'Land Rover',
    model: 'Range Rover Vogue P525 HSE',
    year: 2020,
    price: 'Price on Request',
    mileage: '90,000 miles',
    fuel: 'Petrol',
    transmission: 'Automatic (8-Speed)',
    image: '/inventory/range-rover-vogue-2020-p525-hse-v8/rrvogue2020-1.jpg',
    images: [
      '/inventory/range-rover-vogue-2020-p525-hse-v8/rrvogue2020-1.jpg',
      '/inventory/range-rover-vogue-2020-p525-hse-v8/rrvogue2020-2.jpg',
      '/inventory/range-rover-vogue-2020-p525-hse-v8/rrvogue2020-3.jpg',
      '/inventory/range-rover-vogue-2020-p525-hse-v8/rrvogue2020-4.jpg',
      '/inventory/range-rover-vogue-2020-p525-hse-v8/rrvogue2020-5.jpg'
    ],
    tag: 'CLEAN CARFAX • 5.0L V8 525HP • BLACK ON BLACK',
    description: 'Range Rover Vogue P525 HSE V8 2020. Finished in stunning Santorini Black Metallic over Ebony Black Windsor Leather interior. Clean Carfax verified history with 90,000 miles. Powered by the legendary 5.0L Supercharged V8 engine producing a thrilling 525 hp and 461 lb-ft of torque paired with 8-Speed Automatic Transmission and Intelligent All-Wheel Drive with Electronic Air Suspension. Equipped with Full Black Exterior Styling Package (Gloss Black Grille, Black Lettering, Side Gills, and Window Trim), 22" Gloss Black Turbine Style Multi-Spoke Alloy Wheels, Matrix LED Headlights with Signature DRLs, Touch Pro Duo dual 10" touchscreens, Soft-Close Doors, Sliding Panoramic Sunroof, Meridian Surround Sound System, Heated & Cooled Front Seats, and 360-degree Surround Camera.'
  },
  {
    id: 23,
    name: 'Hyundai Elantra 2025',
    make: 'Hyundai',
    model: 'Elantra',
    year: 2025,
    price: 'Price on Request',
    mileage: '0 km (Brand New)',
    fuel: 'Petrol',
    transmission: 'Automatic (IVT)',
    image: '/inventory/hyundai-elantra-2025/elantra-1.jpg',
    images: [
      '/inventory/hyundai-elantra-2025/elantra-1.jpg',
      '/inventory/hyundai-elantra-2025/elantra-2.jpg',
      '/inventory/hyundai-elantra-2025/elantra-3.jpg',
      '/inventory/hyundai-elantra-2025/elantra-4.jpg',
      '/inventory/hyundai-elantra-2025/elantra-5.jpg'
    ],
    tag: 'BRAND NEW • FULLY LOADED • BLACK ON BLACK',
    description: 'Hyundai Elantra 2025. Brand New Car (0 Km Delivery Mileage). Fully Loaded Specification. Finished in stunning Abyss Black Metallic exterior over Black Leather-appointed interior. Powered by an ultra-refined Smartstream 2.0L 4-cylinder engine paired with Intelligent Variable Transmission (IVT) offering incredible fuel efficiency and smooth driving dynamics. Equipped with redesigned Parametric Jewel front grille, slim full-width LED horizon DRL lightbar with LED projector headlamps, 17" Turbine Two-Tone Machined Alloy Wheels, Rear H-Light connected LED tailbar with integrated sports diffuser, Dual 10.25" Panoramic Digital Cockpit & Navigation Touchscreens with Apple CarPlay & Android Auto, Wireless Smartphone Charger, Power Sunroof, Push Button Start with Smart Key, Drive Mode Select, and Hyundai SmartSense Safety Suite.'
  },
  {
    id: 24,
    name: 'MG E-RX5 2023 Plug in Hybrid',
    make: 'MG',
    model: 'E-RX5 Plug-in Hybrid',
    year: 2023,
    price: 'Price on Request',
    mileage: '0 km (Brand New)',
    fuel: 'Plug-in Hybrid (PHEV)',
    transmission: '10-Speed EDU G2 Hybrid Automatic',
    image: '/inventory/mg-e-rx5-2023/erx5-1.jpg',
    images: [
      '/inventory/mg-e-rx5-2023/erx5-1.jpg',
      '/inventory/mg-e-rx5-2023/erx5-2.jpg',
      '/inventory/mg-e-rx5-2023/erx5-3.jpg',
      '/inventory/mg-e-rx5-2023/erx5-4.jpg',
      '/inventory/mg-e-rx5-2023/erx5-5.jpg'
    ],
    tag: 'BRAND NEW • FULLY LOADED • 1050 KM RANGE • 3YR/8YR WARRANTY',
    description: 'MG E-RX5 2023 Plug in Hybrid. Brand New Car (0 km Delivery Mileage). Fully Loaded Luxury Specification. Features an impressive 1,050 KM Combined Range with 3 Years Warranty on Car and 8 Years Warranty on Battery. Powered by an advanced Plug-in Hybrid powertrain delivering exceptional power, rapid response, and ultra-low fuel consumption. Finished in refined Titanium Grey Metallic with parametric sport front grille matrix, dynamic full-LED headlights, 19" multi-spoke turbine alloy wheels, flush pop-out smart aerodynamic door handles, and full-width rear LED lightbar. Interior highlights include a futuristic cockpit with 27-inch sliding 4K ultra-wide interactive touchscreen display, crystal gear shift lever, wireless phone charging pad, panoramic sunroof, premium sports leather seating, 360-degree HD surround camera system, and comprehensive intelligent driver assistance suite.'
  },
  {
    id: 25,
    name: 'Toyota bZ3 2025',
    make: 'Toyota',
    model: 'bZ3',
    year: 2025,
    price: 'Price on Request',
    mileage: '0 km (Brand New)',
    fuel: 'Full Electric (BEV)',
    transmission: 'Single-Speed Automatic',
    image: '/inventory/toyota-bz3-2025/bz3-1.jpg',
    images: [
      '/inventory/toyota-bz3-2025/bz3-1.jpg',
      '/inventory/toyota-bz3-2025/bz3-2.jpg',
      '/inventory/toyota-bz3-2025/bz3-3.jpg',
      '/inventory/toyota-bz3-2025/bz3-4.jpg',
      '/inventory/toyota-bz3-2025/bz3-5.jpg'
    ],
    tag: 'BRAND NEW • FULL ELECTRIC • 540 KM RANGE • STONE GREY',
    description: 'Toyota bZ3 2025 Full Electric Sedan. Brand New Car (0 km Delivery Mileage). Finished in elegant Stone Grey Metallic exterior over Black Luxury Leather interior. Powered by an ultra-efficient 100% Electric powertrain with high-safety Blade Battery technology delivering an exceptional 540 KM range per full charge. Features Toyota\'s signature hammerhead aerodynamic front profile with continuous LED lightbar, flush pop-out smart aerodynamic door handles, 18" aerodynamically optimized multi-spoke wheels, and distinctive geometric full-width rear LED taillight bar. The interior is highlighted by the "Digital Island" center console equipped with a large 12.8-inch vertical multimedia portrait touchscreen with Apple CarPlay infotainment entertainment system, wireless phone charging tray, rotary gear selector dial, digital driver cockpit display, power sunroof, and Toyota Safety Sense active driver assistance suite.'
  },
  {
    id: 26,
    name: 'Toyota BZ3X Pro 2025',
    make: 'Toyota',
    model: 'bZ3X Pro',
    year: 2025,
    price: 'Price on Request',
    mileage: '0 km (Brand New)',
    fuel: 'Full Electric (BEV)',
    transmission: 'Single-Speed Automatic',
    image: '/inventory/toyota-bz3x-pro-black-2025/bz3x-blk-1.jpg',
    images: [
      '/inventory/toyota-bz3x-pro-black-2025/bz3x-blk-1.jpg',
      '/inventory/toyota-bz3x-pro-black-2025/bz3x-blk-2.jpg',
      '/inventory/toyota-bz3x-pro-black-2025/bz3x-blk-3.jpg',
      '/inventory/toyota-bz3x-pro-black-2025/bz3x-blk-4.jpg',
      '/inventory/toyota-bz3x-pro-black-2025/bz3x-blk-5.jpg'
    ],
    tag: 'BRAND NEW • 520 KM RANGE • 204 HP • BLACK ON BLACK',
    description: 'Toyota BZ3X Pro 2025. Brand New Car (Zero Km Delivery Mileage). Black on Black Luxury Specification. Powered by a 150 kW (204 HP) electric motor paired with a 58.37 kWh high-capacity battery pack delivering an electric range up to 520 KM on a single charge. Features full LED headlights & animated lightbar, 18-inch alloy wheels, 3 selectable driving modes, and 360-degree panoramic view monitor cameras. Interior highlights include a massive 14.6-inch multimedia touchscreen entertainment system with integrated Apple CarPlay & Android Auto, Arabic language system menu, 8.8-inch LCD driver dashboard, premium Yamaha audio speaker system, customizable ambient interior lighting, wireless smartphone charger, heated & ventilated seats with memory function, electronic parking brake with auto-hold, pre-collision safety system with intersection detection, and comprehensive day & night pedestrian, cyclist & motorbike protection.'
  },
  {
    id: 27,
    name: 'Bentley Arnage T-Mulliner Presidential 2006',
    make: 'Bentley',
    model: 'Arnage T-Mulliner Presidential',
    year: 2006,
    price: '$65,000',
    mileage: '31,000 miles',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: '/inventory/bentley-arnage-t-2006/arnage-1.jpg',
    images: [
      '/inventory/bentley-arnage-t-2006/arnage-1.jpg',
      '/inventory/bentley-arnage-t-2006/arnage-2.jpg',
      '/inventory/bentley-arnage-t-2006/arnage-3.jpg',
      '/inventory/bentley-arnage-t-2006/arnage-4.jpg',
      '/inventory/bentley-arnage-t-2006/arnage-5.jpg'
    ],
    tag: '1/4 IN LEBANON 🇱🇧 • FULL SERVICE HISTORY @SAAD&TRAD • 31,000 MILES',
    description: 'Bentley Arnage T-Mulliner Presidential 2006. Extremely rare collector masterpiece — 1 of only 4 units delivered to Lebanon 🇱🇧. Finished in deep Beluga Black Metallic over bespoke Mulliner Diamond-Quilted Beluga Black Leather interior. Complete Full Service History documented at Saad & Trad (Official Bentley Lebanon). Genuine collector low mileage of only 31,000 miles. Hand-built at Crewe, powered by Bentley\'s legendary 6.75-litre Twin-Turbocharged V8 engine delivering 450+ hp and an immense 875 Nm of torque. Exquisite bespoke craftsmanship throughout featuring dark burr walnut wood veneers with inlaid winged "B" emblems, traditional chrome organ-stop ventilation controls, Breitling center timepiece, embossed Mulliner winged headrests, rear passenger privacy curtains, and classic multi-piece modular alloy wheels.'
  },
  {
    id: 28,
    name: 'Audi Q8 Premium Plus 2019',
    make: 'Audi',
    model: 'Q8 Premium Plus',
    year: 2019,
    price: 'Price on Request',
    mileage: '58,000 km',
    fuel: 'Petrol Mild-Hybrid (MHEV)',
    transmission: '8-Speed Tiptronic Automatic',
    image: '/inventory/audi-q8-2019/q8-1.jpg',
    images: [
      '/inventory/audi-q8-2019/q8-1.jpg',
      '/inventory/audi-q8-2019/q8-2.jpg',
      '/inventory/audi-q8-2019/q8-3.jpg',
      '/inventory/audi-q8-2019/q8-4.jpg',
      '/inventory/audi-q8-2019/q8-5.jpg'
    ],
    tag: 'KETTANEH SOURCE • 58,000 KM • 3 YEARS FREE SERVICE @ KETTANEH',
    description: 'Audi Q8 Premium Plus 2019 (55 TFSI quattro). Official Lebanese Dealer Source (Kettaneh) with only 58,000 KM. Includes 3 Years Free Service at Kettaneh. Finished in sleek Mythos Black Metallic exterior over Black Luxury Leather interior. Powered by a 3.0L Turbocharged TFSI V6 with 48V Mild Hybrid system delivering 335 HP and 369 lb-ft of torque paired with an 8-Speed Tiptronic Automatic Transmission and legendary quattro Permanent All-Wheel Drive. Equipped with HD Matrix-design LED headlights with dynamic front & rear animated turn signals, iconic Singleframe Octagonal mask grille, 21-inch 5-segment-spoke alloy wheels, continuous full-width rear LED lightbar, Dual MMI Touch Response screens with haptic feedback, Audi Virtual Cockpit digital instrument cluster, Bang & Olufsen 3D Premium Sound System, Panoramic Sunroof, 360-degree Top View Camera System, and Audi Pre-Sense Safety Suite.'
  },
  {
    id: 29,
    name: 'DongFeng M-Hero 2 817 2025 ULTRA',
    make: 'DongFeng',
    model: 'M-Hero 2 817 ULTRA',
    year: 2025,
    price: 'Price on Request',
    mileage: '0 km (Brand New)',
    fuel: 'PHEV (Extended Range EV)',
    transmission: 'Automatic (Quad-Motor 4WD)',
    image: '/inventory/dongfeng-m-hero-2-817-2025/mhero-1.jpg',
    images: [
      '/inventory/dongfeng-m-hero-2-817-2025/mhero-1.jpg',
      '/inventory/dongfeng-m-hero-2-817-2025/mhero-2.jpg',
      '/inventory/dongfeng-m-hero-2-817-2025/mhero-3.jpg',
      '/inventory/dongfeng-m-hero-2-817-2025/mhero-4.jpg',
      '/inventory/dongfeng-m-hero-2-817-2025/mhero-5.jpg'
    ],
    tag: 'BRAND NEW • ULTRA EDITION • OLIVE GREEN ON CARAWAY',
    description: 'DongFeng M-Hero 2 817 2025 ULTRA. Brand New Car (0 Km Delivery Mileage). Finished in exclusive Matte Olive Green exterior over luxury Caraway Nappa Leather interior. Military-inspired design with aggressive angular body panels, massive tactical all-terrain wheel package, and rear exterior gear box. Powered by an advanced Quad-Motor Extended Range Electric (EREV) powertrain producing over 816 hp and 1,050 Nm of torque with Crab Walk mode, adaptive air suspension, and comprehensive intelligent off-road assistance suite.'
  },
  {
    id: 30,
    name: 'Mercedes-Benz A 180 2020 AMG Package',
    make: 'Mercedes-Benz',
    model: 'A 180 AMG Package',
    year: 2020,
    price: 'Price on Request',
    mileage: '28,000 km',
    fuel: 'Petrol',
    transmission: 'Automatic (7G-DCT)',
    image: '/inventory/mercedes-a180-amg-2020/a180-1.jpg',
    images: [
      '/inventory/mercedes-a180-amg-2020/a180-1.jpg',
      '/inventory/mercedes-a180-amg-2020/a180-2.jpg',
      '/inventory/mercedes-a180-amg-2020/a180-3.jpg',
      '/inventory/mercedes-a180-amg-2020/a180-4.jpg',
      '/inventory/mercedes-a180-amg-2020/a180-5.jpg'
    ],
    tag: 'TGF SOURCE • 28,000 KM • AMG PACKAGE',
    description: 'Mercedes-Benz A 180 2020 AMG Package (W177). Official Lebanese Dealership Source (T. Gargour & Fils - TGF) with low genuine mileage of only 28,000 KM. Finished in crisp Fuji White exterior over two-tone Ivory & Black Sport Leather interior. Powered by a responsive and fuel-efficient 1.33L Turbocharged 4-cylinder engine paired with 7G-DCT Dual-Clutch Automatic Transmission. Equipped with full AMG Aerodynamics Package featuring high-gloss black rear roof spoiler wing, AMG diamond front grille with chrome pins, aggressive front & rear AMG aprons with lower air flics, dual chrome exhaust outlets with rear sports diffuser, 18-inch AMG 5-twin-spoke alloy wheels, High-Performance LED Headlights with torch-design LED DRLs, MBUX dual widescreen digital cockpit displays, ambient interior lighting, and DYNAMIC SELECT driving modes.'
  },
  {
    id: 31,
    name: 'Jetour T2 2025 Travel Plus Top Version',
    make: 'Jetour',
    model: 'T2 Travel Plus',
    year: 2025,
    price: 'Price on Request',
    mileage: '0 km (Brand New)',
    fuel: 'Petrol',
    transmission: 'Automatic (XWD 4WD)',
    image: '/inventory/jetour-t2-travel-plus-black-brown-2025/t2b-1.jpg',
    images: [
      '/inventory/jetour-t2-travel-plus-black-brown-2025/t2b-1.jpg',
      '/inventory/jetour-t2-travel-plus-black-brown-2025/t2b-2.jpg',
      '/inventory/jetour-t2-travel-plus-black-brown-2025/t2b-3.jpg',
      '/inventory/jetour-t2-travel-plus-black-brown-2025/t2b-4.jpg',
      '/inventory/jetour-t2-travel-plus-black-brown-2025/t2b-5.jpg'
    ],
    tag: 'BRAND NEW • TOP VERSION • BLACK ON BROWN',
    description: 'Jetour T2 2025 Travel Plus (Traveller 2.0T AWD - Top Version). Brand New Car (0 Km Delivery Mileage). Finished in Midnight Gloss Black exterior over Saddle Brown / Cognac Luxury Leather interior. Powered by a 2.0L Kunpeng Turbo engine producing 254 hp with 390 Nm torque paired with BorgWarner Sixth-Generation Intelligent XWD All-Wheel Drive and electronic rear differential lock. Top version equipped with illuminated JETOUR front grille lettering, matrix cube LED headlights, bronze off-road recovery tow hooks, 20" bronze multi-spoke alloy wheels, rear-mounted full-size spare wheel, 15.6" central floating touchscreen display, aviation-inspired multi-function steering wheel, full digital cockpit, 540° panoramic transparent chassis camera, panoramic sunroof, ambient interior lighting, and premium Sony audio system.'
  },
  {
    id: 32,
    name: 'Mercedes-Benz G 500 2022',
    make: 'Mercedes-Benz',
    model: 'G 500',
    year: 2022,
    price: '$169,000',
    mileage: '70,000 km',
    fuel: 'Petrol',
    transmission: 'Automatic (9G-TRONIC)',
    image: '/inventory/mercedes-g500-2022/g500-1.jpg',
    images: [
      '/inventory/mercedes-g500-2022/g500-1.jpg',
      '/inventory/mercedes-g500-2022/g500-2.jpg',
      '/inventory/mercedes-g500-2022/g500-3.jpg',
      '/inventory/mercedes-g500-2022/g500-4.jpg',
      '/inventory/mercedes-g500-2022/g500-5.jpg'
    ],
    tag: 'GERMAN SOURCE • 70,000 KM • BLACK ON RED',
    description: 'Mercedes-Benz G 500 2022. Official German Dealer Source with 70,000 KM. Finished in commanding Obsidian Black Metallic exterior over Classic Red & Black Two-Tone Designo Nappa Leather interior with contrast red seatbelts. Powered by a potent 4.0L Biturbo V8 engine producing 416 hp and 450 lb-ft of torque paired with 9G-TRONIC Automatic Transmission, permanent all-wheel drive, and 3 independent 100% differential locks. Equipped with Stainless Steel Exterior Package, 20" Multi-Spoke Alloy Wheels, MULTIBEAM LED Headlights, Widescreen Digital Cockpit displays with COMAND Navigation, Burmester Surround Sound System, Heated & Ventilated Multi-Contour Front Seats with Memory, Glass Sunroof, 360-degree Surround View Cameras, and Driver Assistance Package.'
  },
  {
    id: 33,
    name: 'Toyota Land Cruiser GX-R 2017 V6',
    make: 'Toyota',
    model: 'Land Cruiser GX-R',
    year: 2017,
    price: 'Price on Request',
    mileage: '80,000 km',
    fuel: 'Petrol',
    transmission: 'Automatic (6-Speed Super ECT)',
    image: '/inventory/toyota-landcruiser-gxr-2017/lc-gxr-1.jpg',
    images: [
      '/inventory/toyota-landcruiser-gxr-2017/lc-gxr-1.jpg',
      '/inventory/toyota-landcruiser-gxr-2017/lc-gxr-2.jpg',
      '/inventory/toyota-landcruiser-gxr-2017/lc-gxr-3.jpg',
      '/inventory/toyota-landcruiser-gxr-2017/lc-gxr-4.jpg',
      '/inventory/toyota-landcruiser-gxr-2017/lc-gxr-5.jpg'
    ],
    tag: 'BUMC SOURCE & SERVICES • 80,000 KM • 1 OWNER',
    description: 'Toyota Land Cruiser GX-R 2017 V6. 1 Single Owner from new. Official Lebanese Dealership Source (BUMC) with full comprehensive BUMC service history and genuine low mileage of only 80,000 KM. Finished in Attitude Black Metallic exterior over Black Leather interior with dark wood trim accents. Powered by the renowned 4.0L 1GR-FE V6 engine with Dual VVT-i paired with 6-Speed Super ECT Automatic Transmission and Full-Time 4WD with Torsen limited-slip center differential. Equipped with GX-R aero styling package, multi-reflector LED headlamps with integrated LED DRLs, 18-inch multi-spoke alloy wheels, rear roof spoiler, heavy-duty rear tow hitch, electric glass sunroof, 8-way power adjustable driver seat, upgraded touchscreen infotainment display with navigation and Bluetooth, multi-zone automatic climate control, push-button start with smart entry, and Crawl Control / Multi-Terrain select.'
  }
];

const inveltaClubPosts = [
  { category: 'News', title: 'The arrival of the 2024 collection', date: 'August 18, 2024', image: 'https://images.pexels.com/photos/14217531/pexels-photo-14217531.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { category: 'Editorial', title: 'Why the V8 engine still matters', date: 'July 02, 2024', image: 'https://images.pexels.com/photos/18108314/pexels-photo-18108314.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { category: 'Culture', title: 'Inside Our Standard of Care', date: 'June 11, 2024', image: 'https://images.pexels.com/photos/29566879/pexels-photo-29566879.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
];

function Logo({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="logo" onClick={() => onNavigate('home')}>
      <span>AUTO HIJAZI<br /><small>HIJAZI MOTORS</small></span>
    </div>
  );
}

function Header({ page, onNavigate }: { page: Page; onNavigate: (page: Page) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navigate = (nextPage: Page) => {
    onNavigate(nextPage);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };
  const isHero = page === 'home';
  return (
    <header className={`site-header${isHero ? ' header-transparent' : ''}`}>
      <div className="header-inner">
        <button className="mobile-menu-btn" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <nav className="nav-links desktop-nav nav-left">
          <button className={page === 'inventory' ? 'nav-active' : ''} onClick={() => navigate('inventory')}>INVENTORY</button>
          <button className={page === 'about' ? 'nav-active' : ''} onClick={() => navigate('about')}>ABOUT</button>
          <button className={page === 'journal' ? 'nav-active' : ''} onClick={() => navigate('journal')}>JOURNAL</button>
        </nav>
        <Logo onNavigate={navigate} />
        <nav className="nav-links desktop-nav nav-right">
          <button className={page === 'contact' ? 'nav-active' : ''} onClick={() => navigate('contact')}>CONTACT US</button>
          <button className="book-test-drive" onClick={() => navigate('contact')}>TEST DRIVE</button>
        </nav>
      </div>

      {menuOpen && (
        <div className="mobile-nav-overlay">
          <div className="mobile-nav-header">
            <button className="mobile-menu-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <X size={28} />
            </button>
            <Logo onNavigate={navigate} />
          </div>
          <nav className="mobile-nav-body">
            <button className={page === 'inventory' ? 'nav-active' : ''} onClick={() => navigate('inventory')}>
              INVENTORY
            </button>
            <button className={page === 'about' ? 'nav-active' : ''} onClick={() => navigate('about')}>
              ABOUT
            </button>
            <button className={page === 'journal' ? 'nav-active' : ''} onClick={() => navigate('journal')}>
              JOURNAL
            </button>
            <div className="mobile-nav-divider" />
            <button className={page === 'contact' ? 'nav-active' : ''} onClick={() => navigate('contact')}>
              CONTACT US
            </button>
            <button className="mobile-book-test-drive" onClick={() => navigate('contact')}>
              BOOK TEST DRIVE
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

/* ─── Fullscreen Gallery Modal ───────────────────────── */
function FullscreenGalleryModal({
  images,
  initialIndex = 0,
  carTitle,
  onClose,
}: {
  images: string[];
  initialIndex?: number;
  carTitle: string;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [images.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 40;
    if (distance > minSwipeDistance) {
      nextImage(); // Swiped left -> next
    } else if (distance < -minSwipeDistance) {
      prevImage(); // Swiped right -> prev
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div className="fullscreen-gallery-overlay" onClick={onClose}>
      <div className="fullscreen-gallery-modal" onClick={(e) => e.stopPropagation()}>
        {/* Top bar */}
        <div className="fullscreen-gallery-header">
          <div className="gallery-header-info">
            <span className="gallery-car-title">{carTitle}</span>
            <span className="gallery-counter">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
          <button className="gallery-close-btn" onClick={onClose} aria-label="Close Fullscreen Gallery">
            <X size={24} />
          </button>
        </div>

        {/* Main Stage */}
        <div
          className="fullscreen-stage"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {images.length > 1 && (
            <button className="gallery-nav-btn prev-btn" onClick={prevImage} aria-label="Previous Image">
              <ChevronLeft size={30} />
            </button>
          )}

          <div className="fullscreen-img-container">
            <img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`${carTitle} photo ${currentIndex + 1}`}
              className="fullscreen-main-img"
              decoding="async"
            />
          </div>

          {images.length > 1 && (
            <button className="gallery-nav-btn next-btn" onClick={nextImage} aria-label="Next Image">
              <ChevronRight size={30} />
            </button>
          )}
        </div>

        {/* Bottom thumbnail strip */}
        {images.length > 1 && (
          <div className="fullscreen-thumbnails-strip">
            {images.map((imgUrl, idx) => (
              <button
                key={idx}
                className={`fullscreen-thumb-item ${currentIndex === idx ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`View photo ${idx + 1}`}
              >
                <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Car Card ──────────────────────────────────────── */
function CarCard({
  car,
  onClick,
  viewMode = 'grid',
}: {
  car: Car;
  onClick: () => void;
  viewMode?: 'grid' | 'list';
}) {
  const isBrandNew = car.mileage.toLowerCase().includes('brand new') || car.mileage.startsWith('0');

  if (viewMode === 'list') {
    return (
      <article className="car-card car-card-list" onClick={onClick}>
        <div className="car-image-wrap">
          <img src={car.image} alt={car.name} loading="lazy" decoding="async" />
          <span className="car-badge">{car.make}</span>
        </div>
        <div className="car-info">
          <div className="car-list-top">
            <div className="car-list-title-row">
              <h3 className="car-name">{car.name}</h3>
              <span className="car-price car-desktop-price">{car.price}</span>
            </div>
            {car.tag && <div className="car-tag-pill">{car.tag}</div>}
            <p className="car-specs-line">{car.mileage} • {car.fuel} • {car.transmission}</p>
            <p className="car-list-description">{car.description}</p>
          </div>
          <div className="car-price-row">
            <span className="car-price car-mobile-price">{car.price}</span>
            <button className="car-more-details-btn" aria-label={`View details for ${car.name}`}>
              <span className="btn-full-text">DETAILS</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="car-card car-card-grid" onClick={onClick}>
      <div className="car-image-wrap">
        <img src={car.image} alt={car.name} loading="lazy" decoding="async" />
        <span className="car-badge">{car.make}</span>
      </div>
      <div className="car-info">
        <h3 className="car-name">{car.name}</h3>
        <p className="car-specs-line">{car.mileage} • {car.fuel} • {car.transmission}</p>
        <div className="car-price-row">
          <span className="car-price">{car.price}</span>
          <button className="car-more-details-btn" aria-label={`View details for ${car.name}`}>
            <span className="btn-full-text">MORE DETAILS</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─── Home Page ─────────────────────────────────────── */
function HomePage({
  onNavigate,
  onSelectCar,
  onSearch,
}: {
  onNavigate: (page: Page) => void;
  onSelectCar: (id: number) => void;
  onSearch: (query: string) => void;
}) {
  const [q, setQ] = useState('');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      onSearch(q.trim());
    } else {
      onNavigate('inventory');
    }
  };

  // Select 4 featured cars for the 4-in-a-row grid
  const featuredCars = cars.slice(0, 4);

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <section className="hero-section dark-emblem-hero">
        <div className="hero-content">
          <p className="hero-eyebrow">AUTO HIJAZI FOR CARS • BEIRUT</p>
          <h1 className="hero-headline">AUTO HIJAZI <em>MOTORS</em></h1>
          <p className="hero-subtext-clean">
            CERTIFIED PRE-OWNED LUXURY & PREMIUM VEHICLES • UNESCO, BEIRUT, LEBANON
          </p>
          <form className="hero-search" onSubmit={handleSearch}>
            <Search size={20} className="hero-search-icon" />
            <input
              type="text"
              placeholder="Search make, model, or year..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button type="submit" className="hero-search-btn">SEARCH</button>
          </form>
          <div className="hero-cta-row">
            <button className="hero-cta-primary" onClick={() => onNavigate('inventory')}>EXPLORE INVENTORY</button>
            <a
              href="https://wa.me/96171630003?text=Hello%20Auto%20Hijazi,%20I%20would%20like%20to%20inquire%20about%20your%20available%20cars."
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta-ghost"
              style={{ textDecoration: 'none' }}
            >
              WHATSAPP CONCIERGE <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="home-stats-bar">
        <div className="home-stats-inner">
          <div className="stat-item">
            <span className="stat-number">150+</span>
            <span className="stat-label">CERTIFIED VEHICLES</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">150-POINT</span>
            <span className="stat-label">INSPECTION STANDARD</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">TRANSPARENT PRICING</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">VIP CONCIERGE CARE</span>
          </div>
        </div>
      </section>

      {/* Featured Cars Section (4 in a row) */}
      <section className="home-featured-section">
        <div className="home-section-header">
          <p className="home-section-eyebrow">HANDPICKED SELECTION</p>
          <h2 className="home-section-title">Featured Inventory</h2>
          <p className="home-section-subtitle">
            Discover our newest arrivals, meticulously inspected and prepared for delivery.
          </p>
        </div>

        {/* 4 Cars Grid */}
        <div className="featured-4-grid">
          {featuredCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onClick={() => onSelectCar(car.id)}
            />
          ))}
        </div>

        {/* CTAs */}
        <div className="home-featured-ctas">
          <button className="primary-button" onClick={() => onNavigate('inventory')}>
            VIEW FULL COLLECTION ({cars.length} CARS) <ArrowRight size={14} />
          </button>
          <button className="outline-button" onClick={() => onNavigate('about')}>
            THE SHOWROOM STANDARD
          </button>
        </div>
      </section>

      {/* Category Spotlight Grid */}
      <section className="home-categories-section">
        <div className="home-section-header">
          <p className="home-section-eyebrow">EXPLORE BY CATEGORY</p>
          <h2 className="home-section-title">Browse Collections</h2>
        </div>
        <div className="category-grid">
          <div className="category-card" onClick={() => onNavigate('inventory')}>
            <img src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=900&q=80" alt="Exotics & Supercars" loading="lazy" decoding="async" />
            <div className="category-overlay">
              <h3>EXOTICS & SUPERCARS</h3>
              <p>Ferrari, Porsche GT3 RS, McLaren</p>
              <span className="category-cta">BROWSE SUPERCARS <ArrowRight size={13} /></span>
            </div>
          </div>
          <div className="category-card" onClick={() => onNavigate('inventory')}>
            <img src="https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=900&q=80" alt="Luxury SUVs & 4x4" loading="lazy" decoding="async" />
            <div className="category-overlay">
              <h3>LUXURY SUVS & 4X4</h3>
              <p>AMG G 63, Urus Performante, Range Rover SV</p>
              <span className="category-cta">BROWSE SUVS <ArrowRight size={13} /></span>
            </div>
          </div>
          <div className="category-card" onClick={() => onNavigate('inventory')}>
            <img src="https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=900&q=80" alt="Grand Tourers & Bespoke" loading="lazy" decoding="async" />
            <div className="category-overlay">
              <h3>GRAND TOURERS & BESPOKE</h3>
              <p>Rolls-Royce Ghost, Bentley Azure, DB12</p>
              <span className="category-cta">BROWSE GRAND TOURERS <ArrowRight size={13} /></span>
            </div>
          </div>
          <div className="category-card" onClick={() => onNavigate('inventory')}>
            <img src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=900&q=80" alt="Performance & Sport" loading="lazy" decoding="async" />
            <div className="category-overlay">
              <h3>PERFORMANCE & SPORT</h3>
              <p>BMW M4 Comp, Audi RS6 Avant, AMG GT 63 S</p>
              <span className="category-cta">BROWSE PERFORMANCE <ArrowRight size={13} /></span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="home-why-section">
        <div className="home-why-inner">
          <div className="home-section-header">
            <p className="home-section-eyebrow">WHY CHOOSE US</p>
            <h2 className="home-section-title">A Quieter Kind of Confidence</h2>
            <p className="home-section-subtitle">
              We believe purchasing a remarkable pre-owned vehicle should feel as seamless as driving one.
            </p>
          </div>
          <div className="home-why-grid">
            <div className="why-card">
              <ShieldCheck size={36} strokeWidth={1.2} />
              <h3>150-Point Inspection</h3>
              <p>Every vehicle is rigorously evaluated across mechanical, electrical, and cosmetic standards by master technicians.</p>
            </div>
            <div className="why-card">
              <Sparkles size={36} strokeWidth={1.2} />
              <h3>Bespoke Concierge</h3>
              <p>Personalized consultation, nationwide enclosed vehicle transport, and custom financing solutions tailored to you.</p>
            </div>
            <div className="why-card">
              <CalendarDays size={36} strokeWidth={1.2} />
              <h3>Enduring Standard</h3>
              <p>Comprehensive protection options and dedicated ownership support long after you take delivery.</p>
            </div>
          </div>
          <div className="home-why-cta">
            <button className="outline-button" onClick={() => onNavigate('about')}>LEARN ABOUT OUR HERITAGE</button>
          </div>
        </div>
      </section>

      {/* Journal Preview */}
      <section className="home-journal-section">
        <div className="home-section-header">
          <p className="home-section-eyebrow">SHOWROOM JOURNAL</p>
          <h2 className="home-section-title">Latest Journal Stories</h2>
        </div>
        <div className="journal-preview-grid">
          {inveltaClubPosts.map((post) => (
            <article key={post.title} className="home-journal-card" onClick={() => onNavigate('journal')}>
              <div className="hj-image-wrap">
                <img src={post.image} alt={post.title} loading="lazy" decoding="async" />
              </div>
              <div className="hj-content">
                <span className="hj-category">{post.category}</span>
                <h3>{post.title}</h3>
                <div className="hj-meta">
                  <span>{post.date}</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Dark Call-To-Action Banner */}
      <section className="home-bottom-cta">
        <div className="bottom-cta-inner">
          <p className="hero-eyebrow">READY TO DRIVE SOMETHING REMARKABLE?</p>
          <h2>Visit Our Showroom or Request a Personal Tour.</h2>
          <p>Our specialists are available for private appointments, test drives, and custom vehicle sourcing.</p>
          <div className="bottom-cta-buttons">
            <button className="primary-button-white" onClick={() => onNavigate('inventory')}>
              EXPLORE FULL INVENTORY
            </button>
            <button className="outline-button-white" onClick={() => onNavigate('contact')}>
              CONTACT CONCIERGE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Sidebar Filter Content ────────────────────────── */
function SidebarFilterContent({
  filters,
  onChange,
  onClear,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onClear: () => void;
}) {
  const activeCount =
    filters.makes.length +
    filters.models.length +
    filters.years.length +
    filters.fuels.length +
    filters.transmissions.length +
    (filters.minYear !== DEFAULT_FILTERS.minYear || filters.maxYear !== DEFAULT_FILTERS.maxYear ? 1 : 0) +
    (filters.minPrice !== DEFAULT_FILTERS.minPrice || filters.maxPrice !== DEFAULT_FILTERS.maxPrice ? 1 : 0);

  const toggleItem = (key: 'makes' | 'models' | 'years' | 'fuels' | 'transmissions', val: any) => {
    const list = filters[key] as any[];
    onChange({
      ...filters,
      [key]: list.includes(val) ? list.filter(v => v !== val) : [...list, val],
    });
  };

  const availableModels = useMemo(() => {
    if (filters.makes.length === 0) return ALL_MODELS;
    const modelsSet = new Set<string>();
    filters.makes.forEach(m => {
      if (MAKE_MODELS_MAP[m]) {
        MAKE_MODELS_MAP[m].forEach(model => modelsSet.add(model));
      }
    });
    return Array.from(modelsSet);
  }, [filters.makes]);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    makes: false,
    models: false,
    years: false,
    price: false,
    fuels: false,
    transmissions: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <>
      {/* Header */}
      <div className="sf-header">
        <span className="sf-title">FILTERS {activeCount > 0 && <span className="sf-badge">{activeCount}</span>}</span>
        {activeCount > 0 && (
          <button className="sf-clear" onClick={onClear}>Clear all</button>
        )}
      </div>

      {/* Brand / Make Dropdown */}
      <div className="sf-section sf-accordion">
        <button
          className="sf-accordion-header"
          onClick={() => toggleSection('makes')}
          type="button"
          aria-expanded={openSections.makes}
        >
          <div className="sf-accordion-title-wrap">
            <span className="sf-accordion-title">BRAND / MAKE</span>
            {filters.makes.length > 0 && (
              <span className="sf-section-count">{filters.makes.length}</span>
            )}
          </div>
          <ChevronDown size={14} className={`sf-chevron${openSections.makes ? ' open' : ''}`} />
        </button>
        {openSections.makes && (
          <div className="sf-accordion-body">
            <div className="sf-chips">
              {ALL_MAKES.map(make => (
                <button
                  key={make}
                  className={`sf-chip${filters.makes.includes(make) ? ' active' : ''}`}
                  onClick={() => toggleItem('makes', make)}
                >
                  {make}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Model Dropdown */}
      <div className="sf-section sf-accordion">
        <button
          className="sf-accordion-header"
          onClick={() => toggleSection('models')}
          type="button"
          aria-expanded={openSections.models}
        >
          <div className="sf-accordion-title-wrap">
            <span className="sf-accordion-title">MODEL</span>
            {filters.models.length > 0 && (
              <span className="sf-section-count">{filters.models.length}</span>
            )}
          </div>
          <ChevronDown size={14} className={`sf-chevron${openSections.models ? ' open' : ''}`} />
        </button>
        {openSections.models && (
          <div className="sf-accordion-body">
            <div className="sf-chips">
              {availableModels.map(model => (
                <button
                  key={model}
                  className={`sf-chip${filters.models.includes(model) ? ' active' : ''}`}
                  onClick={() => toggleItem('models', model)}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Year Dropdown */}
      <div className="sf-section sf-accordion">
        <button
          className="sf-accordion-header"
          onClick={() => toggleSection('years')}
          type="button"
          aria-expanded={openSections.years}
        >
          <div className="sf-accordion-title-wrap">
            <span className="sf-accordion-title">YEAR</span>
            {(filters.years.length > 0 || filters.minYear !== DEFAULT_FILTERS.minYear || filters.maxYear !== DEFAULT_FILTERS.maxYear) && (
              <span className="sf-section-count">
                {filters.years.length > 0 ? `${filters.years.length}` : `${filters.minYear}–${filters.maxYear}`}
              </span>
            )}
          </div>
          <ChevronDown size={14} className={`sf-chevron${openSections.years ? ' open' : ''}`} />
        </button>
        {openSections.years && (
          <div className="sf-accordion-body">
            <p className="sf-sub-label">SELECT SPECIFIC YEAR</p>
            <div className="sf-chips" style={{ marginBottom: '16px' }}>
              {ALL_YEARS.map(yr => (
                <button
                  key={yr}
                  className={`sf-chip${filters.years.includes(yr) ? ' active' : ''}`}
                  onClick={() => toggleItem('years', yr)}
                >
                  {yr}
                </button>
              ))}
            </div>
            <p className="sf-sub-label">YEAR RANGE <span className="sf-range-val">{filters.minYear} – {filters.maxYear}</span></p>
            <div className="sf-range-group">
              <input
                type="range" min={2005} max={2026}
                value={filters.minYear}
                onChange={e => onChange({ ...filters, minYear: Math.min(Number(e.target.value), filters.maxYear) })}
              />
              <input
                type="range" min={2005} max={2026}
                value={filters.maxYear}
                onChange={e => onChange({ ...filters, maxYear: Math.max(Number(e.target.value), filters.minYear) })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Price Range Dropdown */}
      <div className="sf-section sf-accordion">
        <button
          className="sf-accordion-header"
          onClick={() => toggleSection('price')}
          type="button"
          aria-expanded={openSections.price}
        >
          <div className="sf-accordion-title-wrap">
            <span className="sf-accordion-title">PRICE RANGE</span>
            {(filters.minPrice !== DEFAULT_FILTERS.minPrice || filters.maxPrice !== DEFAULT_FILTERS.maxPrice) && (
              <span className="sf-section-count">${(filters.minPrice/1000).toFixed(0)}k–${(filters.maxPrice/1000).toFixed(0)}k</span>
            )}
          </div>
          <ChevronDown size={14} className={`sf-chevron${openSections.price ? ' open' : ''}`} />
        </button>
        {openSections.price && (
          <div className="sf-accordion-body">
            <p className="sf-sub-label">PRICE RANGE <span className="sf-range-val">${(filters.minPrice/1000).toFixed(0)}k – ${(filters.maxPrice/1000).toFixed(0)}k</span></p>
            <div className="sf-range-group">
              <input
                type="range" min={0} max={600000} step={5000}
                value={filters.minPrice}
                onChange={e => onChange({ ...filters, minPrice: Math.min(Number(e.target.value), filters.maxPrice) })}
              />
              <input
                type="range" min={0} max={600000} step={5000}
                value={filters.maxPrice}
                onChange={e => onChange({ ...filters, maxPrice: Math.max(Number(e.target.value), filters.minPrice) })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Fuel Type Dropdown */}
      <div className="sf-section sf-accordion">
        <button
          className="sf-accordion-header"
          onClick={() => toggleSection('fuels')}
          type="button"
          aria-expanded={openSections.fuels}
        >
          <div className="sf-accordion-title-wrap">
            <span className="sf-accordion-title">FUEL TYPE</span>
            {filters.fuels.length > 0 && (
              <span className="sf-section-count">{filters.fuels.length}</span>
            )}
          </div>
          <ChevronDown size={14} className={`sf-chevron${openSections.fuels ? ' open' : ''}`} />
        </button>
        {openSections.fuels && (
          <div className="sf-accordion-body">
            <div className="sf-chips">
              {ALL_FUELS.map(f => (
                <button
                  key={f}
                  className={`sf-chip${filters.fuels.includes(f) ? ' active' : ''}`}
                  onClick={() => toggleItem('fuels', f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Transmission Dropdown */}
      <div className="sf-section sf-accordion">
        <button
          className="sf-accordion-header"
          onClick={() => toggleSection('transmissions')}
          type="button"
          aria-expanded={openSections.transmissions}
        >
          <div className="sf-accordion-title-wrap">
            <span className="sf-accordion-title">TRANSMISSION</span>
            {filters.transmissions.length > 0 && (
              <span className="sf-section-count">{filters.transmissions.length}</span>
            )}
          </div>
          <ChevronDown size={14} className={`sf-chevron${openSections.transmissions ? ' open' : ''}`} />
        </button>
        {openSections.transmissions && (
          <div className="sf-accordion-body">
            <div className="sf-chips">
              {ALL_TRANSMISSIONS.map(t => (
                <button
                  key={t}
                  className={`sf-chip${filters.transmissions.includes(t) ? ' active' : ''}`}
                  onClick={() => toggleItem('transmissions', t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function SidebarFilter({
  filters,
  onChange,
  onClear,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onClear: () => void;
}) {
  return (
    <aside className="sidebar-filter">
      <SidebarFilterContent filters={filters} onChange={onChange} onClear={onClear} />
    </aside>
  );
}

function InventoryPage({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  onSelectCar,
}: {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filters: FilterState;
  onFilterChange: React.Dispatch<React.SetStateAction<FilterState>>;
  sort: string;
  onSortChange: (s: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (v: 'grid' | 'list') => void;
  onSelectCar: (id: number) => void;
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const sortOptions = ['Newest first', 'Price: low to high', 'Price: high to low'];

  const activeCount =
    filters.makes.length +
    filters.models.length +
    filters.years.length +
    filters.fuels.length +
    filters.transmissions.length +
    (filters.minYear !== DEFAULT_FILTERS.minYear || filters.maxYear !== DEFAULT_FILTERS.maxYear ? 1 : 0) +
    (filters.minPrice !== DEFAULT_FILTERS.minPrice || filters.maxPrice !== DEFAULT_FILTERS.maxPrice ? 1 : 0);

  const displayCars = useMemo(() => {
    let result = cars;

    // Enhanced Multi-keyword Search
    if (searchQuery.trim() !== '') {
      const terms = searchQuery.toLowerCase().trim().split(/\s+/);
      result = result.filter(car => {
        const searchableText = `${car.name} ${car.make} ${car.model} ${car.tag || ''} ${car.year} ${car.fuel} ${car.transmission} ${car.description}`.toLowerCase();
        return terms.every(term => searchableText.includes(term));
      });
    }

    // Make / Brand
    if (filters.makes.length > 0) {
      result = result.filter(car => filters.makes.includes(car.make) || filters.makes.some(m => car.name.toLowerCase().includes(m.toLowerCase())));
    }

    // Model
    if (filters.models.length > 0) {
      result = result.filter(car => filters.models.includes(car.model) || filters.models.some(mod => car.name.toLowerCase().includes(mod.toLowerCase())));
    }

    // Exact Specific Years
    if (filters.years.length > 0) {
      result = result.filter(car => filters.years.includes(car.year));
    }

    // Fuel
    if (filters.fuels.length > 0) {
      result = result.filter(car => filters.fuels.includes(car.fuel));
    }

    // Transmission
    if (filters.transmissions.length > 0) {
      result = result.filter(car => filters.transmissions.includes(car.transmission));
    }

    // Year Range
    result = result.filter(car => car.year >= filters.minYear && car.year <= filters.maxYear);

    // Price — strip non-digits then compare (allow 'Price on Request' cars to always pass unless price filtered)
    result = result.filter(car => {
      if (
        car.price.toLowerCase().includes('call') ||
        car.price.toLowerCase().includes('inquire') ||
        car.price.toLowerCase().includes('poa') ||
        car.price.toLowerCase().includes('request')
      ) {
        return true;
      }
      const p = parseInt(car.price.replace(/\D/g, ''), 10);
      if (isNaN(p) || p === 0) return true;
      return p >= filters.minPrice && p <= filters.maxPrice;
    });

    // Sort
    if (sort === 'Price: low to high') {
      result = [...result].sort((a, b) => {
        const pA = parseInt(a.price.replace(/\D/g, ''), 10) || 0;
        const pB = parseInt(b.price.replace(/\D/g, ''), 10) || 0;
        if (!pA && pB) return 1;
        if (pA && !pB) return -1;
        return pA - pB;
      });
    } else if (sort === 'Price: high to low') {
      result = [...result].sort((a, b) => {
        const pA = parseInt(a.price.replace(/\D/g, ''), 10) || 0;
        const pB = parseInt(b.price.replace(/\D/g, ''), 10) || 0;
        return pB - pA;
      });
    } else {
      result = [...result].sort((a, b) => b.year - a.year);
    }

    return result;
  }, [searchQuery, filters, sort]);

  return (
    <div className="inventory-page-wrapper">
      <h1 className="inventory-title">I N V E N T O R Y</h1>
      <div className="main-search-bar">
        <Search size={24} />
        <input
          type="text"
          placeholder="Search make, model, or keyword..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
            title="Clear search"
            aria-label="Clear search"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted, #888)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>
      <div className="inventory-layout">
        <SidebarFilter filters={filters} onChange={onFilterChange} onClear={() => onFilterChange(DEFAULT_FILTERS)} />
        <main className="inventory-main">
          <div className="inventory-toolbar">
            <span className="results-count">{displayCars.length} vehicle{displayCars.length !== 1 ? 's' : ''}</span>
            
            <div className="toolbar-actions">
              {/* Multiple Grid Layouts Switcher: 2x2 Grid & List */}
              <div className="view-mode-toggle" role="group" aria-label="Layout Grid Mode">
                <button
                  type="button"
                  className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => onViewModeChange('grid')}
                  title="2x2 Grid View"
                  aria-label="2x2 Grid View"
                >
                  <Grid2X2 size={15} />
                  <span className="view-toggle-text">2x2 Grid</span>
                </button>
                <button
                  type="button"
                  className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => onViewModeChange('list')}
                  title="List Grid View"
                  aria-label="List Grid View"
                >
                  <List size={15} />
                  <span className="view-toggle-text">List</span>
                </button>
              </div>

              <button className="mobile-filter-toggle-btn" onClick={() => setMobileFilterOpen(true)}>
                <SlidersHorizontal size={14} /> FILTERS {activeCount > 0 && <span className="sf-badge">{activeCount}</span>}
              </button>

              <div className="sort-wrapper">
                <button className="sort-btn" onClick={() => setSortOpen(o => !o)}>
                  <SlidersHorizontal size={14} /> {sort} <ChevronDown size={13} />
                </button>
                {sortOpen && (
                  <div className="sort-menu">
                    {sortOptions.map(opt => (
                      <button key={opt} className={`sort-option${sort === opt ? ' active' : ''}`}
                        onClick={() => { onSortChange(opt); setSortOpen(false); }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={`car-grid car-grid-${viewMode}`}>
            {displayCars.length > 0 ? (
              displayCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  viewMode={viewMode}
                  onClick={() => onSelectCar(car.id)}
                />
              ))
            ) : (
              <div className="no-results">No vehicles match your search. Try a different keyword or clear filters.</div>
            )}
          </div>
        </main>
      </div>

      {mobileFilterOpen && (
        <div className="mobile-filter-modal-overlay">
          <div className="mobile-filter-modal">
            <div className="mobile-filter-modal-header">
              <span>FILTERS {activeCount > 0 && `(${activeCount})`}</span>
              <button className="mobile-filter-close" onClick={() => setMobileFilterOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="mobile-filter-modal-body">
              <SidebarFilterContent filters={filters} onChange={onFilterChange} onClear={() => onFilterChange(DEFAULT_FILTERS)} />
            </div>
            <div className="mobile-filter-modal-footer">
              <button className="sf-clear-btn" onClick={() => onFilterChange(DEFAULT_FILTERS)}>Clear All</button>
              <button className="sf-apply-btn" onClick={() => setMobileFilterOpen(false)}>
                SHOW {displayCars.length} VEHICLE{displayCars.length !== 1 ? 'S' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CarDetailsPage({
  carId,
  onNavigate,
  onOpenGallery,
}: {
  carId: number;
  onNavigate: (page: Page) => void;
  onOpenGallery?: (car: Car, index?: number) => void;
}) {
  const car = cars.find(c => c.id === carId);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!car) return <div style={{ padding: '100px 40px', textAlign: 'center' }}>Car not found.</div>;

  const gallery = car.images && car.images.length > 0 ? car.images : [car.image];
  const activeImage = gallery[activeImgIndex] || car.image;
  const whatsappMessage = encodeURIComponent(`Hello Auto Hijazi, I am interested in the ${car.year} ${car.name}.`);

  const handleMainPhotoClick = () => {
    if (onOpenGallery) {
      onOpenGallery(car, activeImgIndex);
    }
  };

  return (
    <main className="car-details-page">
      <div className="car-details-wrapper">
        <div className="car-details-top-bar">
          <button className="back-btn" onClick={() => onNavigate('inventory')}>
            <ChevronLeft size={16} /> <span>BACK TO INVENTORY</span>
          </button>
        </div>

        <div className="car-details-showcase">
          {/* Left Column: Photo Frame & Thumbnails */}
          <div className="car-gallery-column">
            <div
              className="car-main-photo-frame clickable-photo-frame"
              onClick={handleMainPhotoClick}
              title="Click to view full screen gallery"
            >
              <img src={activeImage} alt={car.name} decoding="async" />
              {car.tag && <span className="photo-tag-badge">{car.tag}</span>}
              <div className="photo-fullscreen-hint">
                <Maximize2 size={13} />
                <span>FULLSCREEN ({activeImgIndex + 1}/{gallery.length})</span>
              </div>
            </div>

            {gallery.length > 1 && (
              <div className="car-details-thumbnails-bar">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    className={`thumb-btn ${activeImgIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImgIndex(idx)}
                  >
                    <img src={imgUrl} alt={`${car.name} view ${idx + 1}`} loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information, Specs & Actions */}
          <div className="car-info-column">
            <div className="car-title-block">
              <span className="car-eyebrow">AUTO HIJAZI • {car.make.toUpperCase()}</span>
              <h1>{car.name.includes(String(car.year)) ? car.name : `${car.name} ${car.year}`}</h1>
              <div className="car-badges">
                {car.tag && <span className="badge tag-badge">{car.tag}</span>}
                <span className="badge make-badge">{car.make}</span>
                <span className="badge year-badge">{car.year}</span>
              </div>
            </div>

            {/* Price Card */}
            <div className="car-price-card">
              <div className="price-label">OFFERED AT</div>
              <div className="price-val">{car.price}</div>
              <div className="contact-subtext">
                {car.mileage.toLowerCase().includes('brand new') || car.mileage.startsWith('0')
                  ? 'Brand New Vehicle • Official Dealer Warranty Included'
                  : 'Certified Pre-Owned • Comprehensive Warranty & Inspection Included'}
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="specs-grid-luxury">
              <div className="spec-card">
                <Gauge size={18} strokeWidth={1.5} className="spec-icon" />
                <div className="spec-meta">
                  <span className="spec-label">MILEAGE</span>
                  <span className="spec-val">{car.mileage}</span>
                </div>
              </div>
              <div className="spec-card">
                <Fuel size={18} strokeWidth={1.5} className="spec-icon" />
                <div className="spec-meta">
                  <span className="spec-label">FUEL TYPE</span>
                  <span className="spec-val">{car.fuel}</span>
                </div>
              </div>
              <div className="spec-card">
                <CalendarDays size={18} strokeWidth={1.5} className="spec-icon" />
                <div className="spec-meta">
                  <span className="spec-label">MODEL YEAR</span>
                  <span className="spec-val">{car.year}</span>
                </div>
              </div>
              <div className="spec-card">
                <CheckCircle size={18} strokeWidth={1.5} className="spec-icon" />
                <div className="spec-meta">
                  <span className="spec-label">TRANSMISSION</span>
                  <span className="spec-val">{car.transmission}</span>
                </div>
              </div>
              <div className="spec-card">
                <ShieldCheck size={18} strokeWidth={1.5} className="spec-icon" />
                <div className="spec-meta">
                  <span className="spec-label">WARRANTY</span>
                  <span className="spec-val">Included</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="car-action-buttons">
              <a
                href={`https://wa.me/96171630003?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-concierge-btn"
              >
                <MessageSquare size={16} /> WHATSAPP CONCIERGE
              </a>
              <button className="book-testdrive-btn" onClick={() => onNavigate('contact')}>
                BOOK A TEST DRIVE
              </button>
            </div>

            {/* Vehicle Features Checklist */}
            <div className="car-full-description">
              <h2>VEHICLE FEATURES & HIGHLIGHTS</h2>
              <div className="car-features-checklist">
                {car.description
                  .split(/(?:✅|•|\n|, |; )/)
                  .map(p => p.trim())
                  .filter(p => p.length > 0 && !p.toLowerCase().startsWith('for more info') && !p.toLowerCase().startsWith('call us'))
                  .map(p => p.replace(/^(?:featuring|includes|equipped with)\s+/i, ''))
                  .map((feature, idx) => (
                    <div key={idx} className="feature-check-item">
                      <CheckCircle size={16} className="check-icon" />
                      <span>{feature}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function About({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <main className="page-main about-page">
      <section className="standard-hero">
        <p className="eyebrow">ABOUT AUTO HIJAZI</p>
        <h1>PASSION FOR CARS. DRIVEN BY TRUST.</h1>
        <p>Auto Hijazi for cars — providing premium certified pre-owned motorcars in Beirut, Lebanon.</p>
      </section>
      <section className="about-story">
        <div className="about-image"><img src="https://images.pexels.com/photos/15513826/pexels-photo-15513826.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Auto Hijazi Showroom" loading="lazy" decoding="async" /></div>
        <div className="about-copy">
          <h2>CURATED SELECTION. UNCOMPROMISED QUALITY.</h2>
          <p>Located in the heart of Beirut (Unesco, facing the Ministry of Education), Auto Hijazi (Hijazi Motors) delivers a premier automotive showroom experience tailored to car enthusiasts and discerning drivers.</p>
          <p>Every vehicle in our collection undergoes stringent multi-point verification for condition, provenance, and performance so you can drive away with complete peace of mind.</p>
          <button className="outline-button" onClick={() => onNavigate('inventory')}>VIEW OUR INVENTORY</button>
        </div>
      </section>
      <section className="values">
        <div><ShieldCheck size={28} strokeWidth={1.5} /><h3>THOROUGHLY INSPECTED</h3><p>Every car is checked, verified, and detailed to pristine showroom condition.</p></div>
        <div><Sparkles size={28} strokeWidth={1.5} /><h3>VIP SERVICE</h3><p>Personalized WhatsApp concierge assistance, transparent pricing, and seamless trade-ins.</p></div>
        <div><CalendarDays size={28} strokeWidth={1.5} /><h3>BEIRUT HERITAGE</h3><p>Proudly serving clients in Beirut, Lebanon with trusted automotive expertise.</p></div>
      </section>
    </main>
  );
}

function InveltaClub() {
  return (
    <main className="page-main club-page">
      <section className="standard-hero dark-hero">
        <p className="eyebrow">SHOWROOM JOURNAL</p>
        <h1>NOTES ON THE ROAD LESS TRAVELLED.</h1>
        <p>Stories, ideas, and considered advice for a life in motion.</p>
      </section>
      <section className="club-grid">
        {inveltaClubPosts.map((post) => (
          <article className="club-card" key={post.title}>
            <div className="club-image"><img src={post.image} alt={post.title} loading="lazy" decoding="async" /></div>
            <div className="club-copy">
              <p className="club-category">{post.category}</p>
              <h2>{post.title}</h2>
              <div className="club-meta"><span>{post.date}</span><ArrowRight size={17} /></div>
            </div>
          </article>
        ))}
      </section>
      <section className="newsletter">
        <h2>STAY IN THE KNOW</h2>
        <p>Good things, delivered occasionally.</p>
        <div className="email-form">
          <input placeholder="Enter your email address" type="email" />
          <button className="primary-button">SUBSCRIBE</button>
        </div>
      </section>
    </main>
  );
}

function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Vehicle Purchase',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <main className="page-main contact-page">
      {/* Hero Header */}
      <section className="standard-hero contact-hero">
        <p className="eyebrow">SHOWROOM & CONCIERGE</p>
        <h1>AUTO HIJAZI / HIJAZI MOTORS</h1>
        <p>Located in Unesco, Beirut, facing the Ministry of Education. Whether you're looking for your next vehicle, scheduling a viewing, or inquiring about our collection, our showroom team is at your service.</p>
      </section>

      {/* Main Channels Grid */}
      <section className="contact-channels-section">
        <div className="contact-grid">
          {/* Phone */}
          <div className="contact-card">
            <div className="contact-card-icon">
              <Phone size={24} />
            </div>
            <h3>PHONE & CALLS</h3>
            <p className="contact-card-desc">Call our showroom directly for immediate assistance.</p>
            <div className="contact-card-details">
              <a href="tel:+96171630003" className="contact-link-bold">+961 71 630 003</a>
              <span className="contact-link-sub">Auto Hijazi Hotline</span>
            </div>
            <a href="tel:+96171630003" className="contact-card-action">CALL US NOW <ArrowRight size={14} /></a>
          </div>

          {/* WhatsApp */}
          <div className="contact-card highlight-card">
            <div className="contact-card-icon whatsapp-icon">
              <MessageSquare size={24} />
            </div>
            <h3>WHATSAPP CHAT</h3>
            <p className="contact-card-desc">Direct 1-on-1 concierge assistance for quick inquiries, specs, and vehicle photos.</p>
            <div className="contact-card-details">
              <span className="contact-link-bold">71 630003 (+961)</span>
              <span className="contact-status-badge">• Online & Ready</span>
            </div>
            <a
              href="https://wa.me/96171630003?text=Hello%20Auto%20Hijazi,%20I%20would%20like%20to%20inquire%20about%20a%20vehicle."
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card-action whatsapp-action"
            >
              CHAT ON WHATSAPP <ArrowRight size={14} />
            </a>
          </div>

          {/* Social Media & Instagram */}
          <div className="contact-card">
            <div className="contact-card-icon">
              <Instagram size={24} />
            </div>
            <h3>INSTAGRAM & SOCIAL</h3>
            <p className="contact-card-desc">Follow our official Instagram for new car arrivals, reels, and showroom stories.</p>
            <div className="social-links-grid">
              <a href="https://www.instagram.com/auto_hijazi_/" target="_blank" rel="noreferrer" className="social-chip">
                <Instagram size={14} /> @auto_hijazi_
              </a>
            </div>
            <a href="https://www.instagram.com/auto_hijazi_/" target="_blank" rel="noreferrer" className="contact-card-action">
              FOLLOW ON INSTAGRAM <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Map & Form Section */}
      <section className="contact-map-form-section">
        <div className="contact-map-form-container">
          {/* Left: Contact Form */}
          <div className="contact-form-wrap">
            <h2>SEND US A MESSAGE</h2>
            <p className="form-subtext">Fill out the form below and our vehicle specialist will get back to you promptly.</p>

            {formSubmitted ? (
              <div className="form-success-box">
                <CheckCircle size={32} color="#10b981" />
                <h3>THANK YOU FOR YOUR MESSAGE</h3>
                <p>Your inquiry has been received. One of our concierges will reach out to you shortly via phone or WhatsApp.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="c-name">YOUR NAME *</label>
                    <input
                      id="c-name"
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="c-email">EMAIL ADDRESS</label>
                    <input
                      id="c-email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="c-phone">PHONE / WHATSAPP NUMBER *</label>
                    <input
                      id="c-phone"
                      type="tel"
                      required
                      placeholder="+961 71 630 003"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="c-subject">INQUIRY TYPE</label>
                    <select
                      id="c-subject"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="Vehicle Purchase">Vehicle Purchase</option>
                      <option value="Book Test Drive">Book Test Drive</option>
                      <option value="Sell / Trade-in">Sell / Trade-in Vehicle</option>
                      <option value="Car Financing">Car Financing / Loan</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="c-message">YOUR MESSAGE *</label>
                  <textarea
                    id="c-message"
                    rows={4}
                    required
                    placeholder="Tell us about the vehicle you're interested in or how we can assist you..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="primary-button submit-btn">
                  SEND MESSAGE <Send size={14} />
                </button>
              </form>
            )}
          </div>

          {/* Right: Integrated Google Map & Location Details */}
          <div className="contact-location-wrap">
            <h2>OUR SHOWROOM</h2>
            <div className="location-info-card">
              <div className="info-item">
                <MapPin size={20} className="info-icon" />
                <div>
                  <span className="info-label">SHOWROOM ADDRESS</span>
                  <span className="info-val">Facing Ministry of Education<br />Unesco, Beirut, Lebanon</span>
                </div>
              </div>
              <div className="info-item">
                <Clock size={20} className="info-icon" />
                <div>
                  <span className="info-label">OPERATING HOURS</span>
                  <span className="info-val">Monday – Saturday: 9:00 AM – 7:00 PM<br />Sunday: By Appointment</span>
                </div>
              </div>
            </div>

            {/* Google Map iFrame */}
            <div className="google-map-wrapper">
              <iframe
                title="Auto Hijazi Showroom Location"
                src="https://maps.google.com/maps?q=Ministry%20of%20Education%20and%20Higher%20Education,%20Unesco,%20Beirut,%20Lebanon&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function App() {
  const [page, setPage] = useState<Page>('home');
  const [activeCarId, setActiveCarId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<string>('Newest first');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [galleryState, setGalleryState] = useState<{ car: Car; initialIndex: number } | null>(null);

  const handleOpenGallery = (car: Car, initialIndex: number = 0) => {
    setGalleryState({ car, initialIndex });
  };

  const handleCloseGallery = () => {
    setGalleryState(null);
  };

  // Always reset scroll position to the very top whenever navigating between pages or selecting a vehicle
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [page, activeCarId]);

  const navigate = (nextPage: Page) => {
    setPage(nextPage);
    window.scrollTo(0, 0);
  };

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    setFilters(DEFAULT_FILTERS);
    setPage('inventory');
    window.scrollTo(0, 0);
  };

  const handleSelectCar = (id: number) => {
    setActiveCarId(id);
    setPage('car');
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-shell">
      <Header page={page} onNavigate={navigate} />
      {page === 'home'      && <HomePage onNavigate={navigate} onSelectCar={handleSelectCar} onSearch={handleHeroSearch} />}
      {page === 'inventory' && (
        <InventoryPage
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFilterChange={setFilters}
          sort={sort}
          onSortChange={setSort}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onSelectCar={handleSelectCar}
        />
      )}
      {page === 'about'     && <About onNavigate={navigate} />}
      {page === 'journal'   && <InveltaClub />}
      {page === 'contact'   && <ContactPage />}
      {page === 'car' && activeCarId && <CarDetailsPage carId={activeCarId} onNavigate={navigate} onOpenGallery={handleOpenGallery} />}

      {/* Fullscreen High-Resolution Gallery Lightbox */}
      {galleryState && (
        <FullscreenGalleryModal
          images={galleryState.car.images && galleryState.car.images.length > 0 ? galleryState.car.images : [galleryState.car.image]}
          initialIndex={galleryState.initialIndex}
          carTitle={`${galleryState.car.year} ${galleryState.car.name}`}
          onClose={handleCloseGallery}
        />
      )}

      <footer className="site-footer">
        <Logo onNavigate={navigate} />
        <div>
          <button onClick={() => navigate('inventory')}>INVENTORY</button>
          <button onClick={() => navigate('about')}>ABOUT</button>
          <button onClick={() => navigate('journal')}>JOURNAL</button>
          <button onClick={() => navigate('contact')}>CONTACT US</button>
          <a href="https://www.instagram.com/auto_hijazi_/" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600 }}>
            <Instagram size={14} /> @auto_hijazi_
          </a>
        </div>
        <span>© 2025 Auto Hijazi (Hijazi Motors). All rights reserved. Unesco, Beirut, Lebanon.</span>
      </footer>
    </div>
  );
}

export default App;
