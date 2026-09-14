import { useMemo, useState, useEffect } from 'react';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  Clock,
  Facebook,
  Fuel,
  Gauge,
  Instagram,
  MapPin,
  Menu,
  MessageSquare,
  Phone,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
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
  minYear: 2019,
  maxYear: 2025,
  minPrice: 0,
  maxPrice: 600000,
};

const ALL_MAKES = [
  'Porsche',
  'Ferrari',
  'Mercedes-AMG',
  'Lamborghini',
  'Aston Martin',
  'Rolls-Royce',
  'Bentley',
  'BMW M',
  'Audi Sport',
  'Land Rover',
  'McLaren',
];

const MAKE_MODELS_MAP: Record<string, string[]> = {
  'Porsche': ['911 GT3 RS', 'Taycan Turbo S', 'Cayenne Turbo GT'],
  'Ferrari': ['296 GTB Assetto Fiorano', 'Roma Spider', 'SF90 Stradale'],
  'Mercedes-AMG': ['G 63 AMG Edition 55', 'AMG GT 63 S 4-Door', 'SL 63 AMG'],
  'Lamborghini': ['Urus Performante', 'Huracán Tecnica', 'Revuelto'],
  'Aston Martin': ['DB12 Coupe', 'Vantage V8', 'DBX 707'],
  'Rolls-Royce': ['Ghost Black Badge', 'Cullinan Series II'],
  'Bentley': ['Continental GT V8 Azure', 'Flying Spur Speed'],
  'BMW M': ['M4 Competition xDrive', 'M8 Competition Gran Coupé', 'M3 CS'],
  'Audi Sport': ['RS6 Avant Dynamic', 'RS e-tron GT'],
  'Land Rover': ['Range Rover SV Autobiography', 'Range Rover Sport SV'],
  'McLaren': ['750S Spider', 'Artura'],
};

const ALL_MODELS = [
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

const ALL_YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019];
const ALL_FUELS = ['Petrol', 'Hybrid', 'Electric'];
const ALL_TRANSMISSIONS = ['Automatic (PDK)', 'Automatic', 'Dual-Clutch'];

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
    name: 'Porsche 911 GT3 RS (992)',
    make: 'Porsche',
    model: '911 GT3 RS',
    year: 2024,
    price: '$345,000',
    mileage: '1,450 miles',
    fuel: 'Petrol',
    transmission: 'Automatic (PDK)',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80'
    ],
    tag: 'WEISSACH PACKAGE',
    description: '2024 Porsche 911 GT3 RS Weissach Package finished in Arctic Grey with Carbon Aero Wing and Magnesium Forged Wheels. Powered by a naturally aspirated 4.0L flat-six revving to 9,000 RPM (518 hp) paired with a 7-speed PDK transmission. Features Front Axle Lift, Carbon Ceramic Brakes (PCCB), Clubsport roll cage, and full carbon bucket seats.'
  },
  {
    id: 2,
    name: 'Ferrari 296 GTB Assetto Fiorano',
    make: 'Ferrari',
    model: '296 GTB Assetto Fiorano',
    year: 2023,
    price: '$389,000',
    mileage: '2,800 miles',
    fuel: 'Hybrid',
    transmission: 'Dual-Clutch',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
    ],
    tag: 'ASSETTO FIORANO',
    description: '2023 Ferrari 296 GTB in classic Rosso Corsa with Assetto Fiorano Track Package. Featuring an 819 hp twin-turbo 120° V6 plug-in hybrid drivetrain, Multimatic shock absorbers, carbon fiber aero package, titanium exhaust, Lexan rear window, and carbon racing Daytona seats.'
  },
  {
    id: 3,
    name: 'Mercedes-AMG G 63 "Edition 55"',
    make: 'Mercedes-AMG',
    model: 'G 63 AMG Edition 55',
    year: 2023,
    price: '$245,000',
    mileage: '7,100 miles',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: 'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80'
    ],
    tag: 'EDITION 55 V8 BITURBO',
    description: '2023 Mercedes-AMG G 63 Edition 55 in Obsidian Black Metallic with Red Nappa leather interior. Handcrafted 4.0L V8 Biturbo producing 577 hp, AMG Night Package II, 22-inch forged matte grey cross-spoke wheels, AMG Performance Exhaust, Burmester 3D Surround Sound, and carbon fiber trim.'
  },
  {
    id: 4,
    name: 'Lamborghini Urus Performante',
    make: 'Lamborghini',
    model: 'Urus Performante',
    year: 2024,
    price: '$318,000',
    mileage: '3,200 miles',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
    ],
    tag: 'PERFORMANTE 666HP',
    description: '2024 Lamborghini Urus Performante in Giallo Inti with Full Visible Carbon Fiber Bonnet and Aero package. Twin-turbo 4.0L V8 with 657 hp (666 CV), Akrapovič Titanium Sport Exhaust, 23-inch Pelope diamond-cut rims, Bang & Olufsen 3D sound system, and Rally Mode telemetry.'
  },
  {
    id: 5,
    name: 'Aston Martin DB12 Super Tourer',
    make: 'Aston Martin',
    model: 'DB12 Coupe',
    year: 2024,
    price: '$279,000',
    mileage: '1,100 miles',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
    ],
    tag: 'NEXT-GEN SUPER TOURER',
    description: '2024 Aston Martin DB12 Coupe finished in Satin Aston Martin Racing Green over Oxford Tan Semi-Aniline Leather. 4.0L Twin-Turbo V8 producing 671 hp, Bowers & Wilkins 15-speaker audio, brand-new 10.25-inch dual-screen infotainment, electronic rear differential, and carbon ceramic brakes.'
  },
  {
    id: 6,
    name: 'Rolls-Royce Ghost Black Badge',
    make: 'Rolls-Royce',
    model: 'Ghost Black Badge',
    year: 2023,
    price: '$420,000',
    mileage: '4,500 miles',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
    ],
    tag: 'BLACK BADGE V12',
    description: '2023 Rolls-Royce Ghost Black Badge with Diamond Black exterior and Mandarin/Black bespoke leather. Twin-Turbocharged 6.75L V12 (592 hp, 900 Nm torque), Shooting Star Starlight Headliner, Illuminated Grille, Planar Suspension System, Immersive Seating with Champagne Cooler, and Bespoke Audio.'
  },
  {
    id: 7,
    name: 'Bentley Continental GT V8 Azure',
    make: 'Bentley',
    model: 'Continental GT V8 Azure',
    year: 2023,
    price: '$268,000',
    mileage: '5,900 miles',
    fuel: 'Petrol',
    transmission: 'Dual-Clutch',
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
    ],
    tag: 'AZURE WELLBEING SPEC',
    description: '2023 Bentley Continental GT V8 Azure in Portofino Blue with Linen/Imperial Blue diamond-quilted hide. 4.0L Twin-Turbo V8 with 542 hp, Bentley Rotating Display, Touring Specification, Front Seat Comfort Specification with massage and ventilation, Naim for Bentley 2,200W audio system.'
  },
  {
    id: 8,
    name: 'BMW M4 Competition xDrive (G82)',
    make: 'BMW M',
    model: 'M4 Competition xDrive',
    year: 2024,
    price: '$104,500',
    mileage: '2,900 miles',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
    ],
    tag: 'COMPETITION M XDRIVE',
    description: '2024 BMW M4 Competition Coupe with M xDrive All-Wheel Drive in Isle of Man Green. 3.0L BMW M TwinPower Turbo inline 6-cylinder delivering 503 hp, M Carbon Bucket Seats in Kyalami Orange, M Carbon Ceramic Brakes, Carbon Exterior Package, Curved Display with iDrive 8.5, and Head-Up Display.'
  },
  {
    id: 9,
    name: 'Audi RS6 Avant Dynamic Package',
    make: 'Audi Sport',
    model: 'RS6 Avant Dynamic',
    year: 2023,
    price: '$142,000',
    mileage: '8,400 miles',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606220838315-056192d5e927?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80'
    ],
    tag: 'TWIN TURBO V8 WAGON',
    description: '2023 Audi RS6 Avant Quattro finished in Nardo Grey with Black Optic Package and Valcona RS Sport Leather. 4.0L Twin-Turbo V8 with 591 hp and 48V Mild Hybrid system, RS Dynamic Package Plus, Ceramic Brakes with Red Calipers, Sport Exhaust, Bang & Olufsen Advanced 3D Sound, and HD Matrix LED Headlights.'
  },
  {
    id: 10,
    name: 'Range Rover SV Autobiography LWB',
    make: 'Land Rover',
    model: 'Range Rover SV Autobiography',
    year: 2024,
    price: '$235,000',
    mileage: '2,900 miles',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
    ],
    tag: 'SV BESPOKE V8',
    description: '2024 Land Rover Range Rover SV Long Wheelbase with SV Serenity Luxury Theme in Belgravia Green. Twin-Turbo 4.4L V8 generating 606 hp, Executive Class Comfort Plus rear seating with deployable club tables, refrigerated compartment, Meridian Signature 1,600W 3D sound with headrest noise cancellation.'
  },
  {
    id: 11,
    name: 'McLaren 750S Spider',
    make: 'McLaren',
    model: '750S Spider',
    year: 2024,
    price: '$375,000',
    mileage: '650 miles',
    fuel: 'Petrol',
    transmission: 'Dual-Clutch',
    image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80'
    ],
    tag: 'CARBON MONOCAGE III',
    description: '2024 McLaren 750S Spider in Papaya Spark with full Carbon Fiber Exterior Upgrade Packs 1 & 2. 4.0L Twin-Turbo V8 pushing 740 hp (750 PS), 0-60 mph in 2.7 seconds, Proactive Chassis Control III, Electrochromic Retractable Hardtop, Bowers & Wilkins audio, and McLaren track telemetry.'
  },
  {
    id: 12,
    name: 'Mercedes-AMG GT 63 S 4-Door Coupé',
    make: 'Mercedes-AMG',
    model: 'AMG GT 63 S 4-Door',
    year: 2023,
    price: '$182,000',
    mileage: '6,300 miles',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80'
    ],
    tag: 'V8 BITURBO 4MATIC+',
    description: '2023 Mercedes-AMG GT 63 S 4MATIC+ in Designo Graphite Grey Magno. 4.0L AMG V8 Biturbo producing 630 hp with Drift Mode, AMG Aerodynamics Package, Yellow AMG brake calipers, Carbon ceramic composite brakes, AMG Performance Seats in Exclusive Nappa Leather, and Burmester High-End 3D Surround.'
  }
];

const inveltaClubPosts = [
  { category: 'News', title: 'The arrival of the 2024 collection', date: 'August 18, 2024', image: 'https://images.pexels.com/photos/14217531/pexels-photo-14217531.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { category: 'Editorial', title: 'Why the V8 engine still matters', date: 'July 02, 2024', image: 'https://images.pexels.com/photos/18108314/pexels-photo-18108314.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { category: 'Culture', title: 'Inside the Premier Standard of Care', date: 'June 11, 2024', image: 'https://images.pexels.com/photos/29566879/pexels-photo-29566879.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
];

function Logo({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="logo" onClick={() => onNavigate('home')}>
      <span>PREMIER<br /><small>AUTOMOTIVE</small></span>
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <button className={page === 'journal' ? 'nav-active' : ''} onClick={() => navigate('journal')}>PREMIER CLUB +</button>
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
              PREMIER CLUB +
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

/* ─── Car Card ──────────────────────────────────────── */
function CarCard({ car, onClick }: { car: Car; onClick: () => void }) {
  return (
    <article className="car-card" onClick={onClick}>
      <div className="car-image-wrap">
        <img src={car.image} alt={`${car.year} ${car.name}`} loading="lazy" decoding="async" />
        <span className="car-badge">{car.year} • PRE-OWNED</span>
      </div>
      <div className="car-info">
        <h3 className="car-name">{car.name}</h3>
        <p className="car-specs-line">{car.mileage} • {car.fuel} • {car.transmission}</p>
        <div className="car-price-row">
          <span className="car-price">{car.price}</span>
          <button className="car-more-details-btn">
            <span>MORE DETAILS</span> <ArrowRight size={13} />
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
          <p className="hero-eyebrow">EST. 2014 • LUXURY MOTORCARS & CONCIERGE</p>
          <h1 className="hero-headline">PREMIER <em>AUTOMOTIVE</em></h1>
          <p className="hero-subtext-clean">
            CERTIFIED PRE-OWNED LUXURY VEHICLES • PREMIUM SHOWROOM SELECTION
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
              href="https://wa.me/18005550199"
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
            <CarCard key={car.id} car={car} onClick={() => onSelectCar(car.id)} />
          ))}
        </div>

        {/* CTAs */}
        <div className="home-featured-ctas">
          <button className="primary-button" onClick={() => onNavigate('inventory')}>
            VIEW FULL COLLECTION ({cars.length} CARS) <ArrowRight size={14} />
          </button>
          <button className="outline-button" onClick={() => onNavigate('about')}>
            THE PREMIER STANDARD
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

      {/* Invelta Club Journal Preview */}
      <section className="home-journal-section">
        <div className="home-section-header">
          <p className="home-section-eyebrow">PREMIER CLUB +</p>
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

  return (
    <>
      {/* Header */}
      <div className="sf-header">
        <span className="sf-title">FILTERS {activeCount > 0 && <span className="sf-badge">{activeCount}</span>}</span>
        {activeCount > 0 && (
          <button className="sf-clear" onClick={onClear}>Clear all</button>
        )}
      </div>

      {/* Brand / Make */}
      <div className="sf-section">
        <p className="sf-label">BRAND / MAKE</p>
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

      {/* Model */}
      <div className="sf-section">
        <p className="sf-label">MODEL</p>
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

      {/* Specific Year */}
      <div className="sf-section">
        <p className="sf-label">SELECT YEAR</p>
        <div className="sf-chips">
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
      </div>

      {/* Year Range */}
      <div className="sf-section">
        <p className="sf-label">YEAR RANGE <span className="sf-range-val">{filters.minYear} – {filters.maxYear}</span></p>
        <div className="sf-range-group">
          <input
            type="range" min={2013} max={2024}
            value={filters.minYear}
            onChange={e => onChange({ ...filters, minYear: Math.min(Number(e.target.value), filters.maxYear) })}
          />
          <input
            type="range" min={2013} max={2024}
            value={filters.maxYear}
            onChange={e => onChange({ ...filters, maxYear: Math.max(Number(e.target.value), filters.minYear) })}
          />
        </div>
      </div>

      {/* Fuel Type */}
      <div className="sf-section">
        <p className="sf-label">FUEL TYPE</p>
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

      {/* Transmission */}
      <div className="sf-section">
        <p className="sf-label">TRANSMISSION</p>
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

      {/* Price Range */}
      <div className="sf-section">
        <p className="sf-label">PRICE <span className="sf-range-val">${(filters.minPrice/1000).toFixed(0)}k – ${(filters.maxPrice/1000).toFixed(0)}k</span></p>
        <div className="sf-range-group">
          <input
            type="range" min={0} max={700000} step={5000}
            value={filters.minPrice}
            onChange={e => onChange({ ...filters, minPrice: Math.min(Number(e.target.value), filters.maxPrice) })}
          />
          <input
            type="range" min={0} max={700000} step={5000}
            value={filters.maxPrice}
            onChange={e => onChange({ ...filters, maxPrice: Math.max(Number(e.target.value), filters.minPrice) })}
          />
        </div>
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
  initialQuery = '',
  onSelectCar,
}: {
  initialQuery?: string;
  onSelectCar: (id: number) => void;
}) {
  const [sort, setSort] = useState('Newest first');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortOpen, setSortOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const sortOptions = ['Newest first', 'Price: low to high', 'Price: high to low'];

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

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

    // Price — strip non-digits then compare (allow 'Call for Price' cars to always pass)
    result = result.filter(car => {
      if (car.price.toLowerCase().includes('call') || car.price.toLowerCase().includes('inquire') || car.price.toLowerCase().includes('poa')) {
        return true;
      }
      const p = parseInt(car.price.replace(/\D/g, ''), 10);
      if (isNaN(p)) return true;
      return p >= filters.minPrice && p <= filters.maxPrice;
    });

    // Sort
    if (sort === 'Price: low to high') {
      result = [...result].sort((a, b) => {
        const pA = parseInt(a.price.replace(/\D/g, ''), 10) || 0;
        const pB = parseInt(b.price.replace(/\D/g, ''), 10) || 0;
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
        <input type="text" placeholder="Search make, model, or keyword..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>
      <div className="inventory-layout">
        <SidebarFilter filters={filters} onChange={setFilters} onClear={() => setFilters(DEFAULT_FILTERS)} />
        <main className="inventory-main">
          <div className="inventory-toolbar">
            <span className="results-count">{displayCars.length} vehicle{displayCars.length !== 1 ? 's' : ''}</span>
            
            <div className="toolbar-actions">
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
                        onClick={() => { setSort(opt); setSortOpen(false); }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="car-grid">
            {displayCars.length > 0 ? (
              displayCars.map((car) => <CarCard key={car.id} car={car} onClick={() => onSelectCar(car.id)} />)
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
              <SidebarFilterContent filters={filters} onChange={setFilters} onClear={() => setFilters(DEFAULT_FILTERS)} />
            </div>
            <div className="mobile-filter-modal-footer">
              <button className="sf-clear-btn" onClick={() => setFilters(DEFAULT_FILTERS)}>Clear All</button>
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

function CarDetailsPage({ carId, onNavigate }: { carId: number; onNavigate: (page: Page) => void }) {
  const car = cars.find(c => c.id === carId);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!car) return <div style={{ padding: '100px 40px', textAlign: 'center' }}>Car not found.</div>;

  const gallery = car.images && car.images.length > 0 ? car.images : [car.image];
  const activeImage = gallery[activeImgIndex] || car.image;
  const whatsappMessage = encodeURIComponent(`Hello Premier Automotive, I am interested in the ${car.year} ${car.name}.`);

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
            <div className="car-main-photo-frame">
              <img src={activeImage} alt={car.name} decoding="async" />
              {car.tag && <span className="photo-tag-badge">{car.tag}</span>}
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
              <span className="car-eyebrow">PREMIER AUTOMOTIVE • {car.make.toUpperCase()}</span>
              <h1>{car.year} {car.name}</h1>
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
              <div className="contact-subtext">Certified Pre-Owned • Comprehensive Warranty Included</div>
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
                <SlidersHorizontal size={18} strokeWidth={1.5} className="spec-icon" />
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
                href={`https://wa.me/18005550199?text=${whatsappMessage}`}
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
        <p className="eyebrow">ABOUT US</p>
        <h1>A QUIETER KIND OF CONFIDENCE.</h1>
        <p>We believe the right car does more than take you somewhere. It changes the way you arrive.</p>
      </section>
      <section className="about-story">
        <div className="about-image"><img src="https://images.pexels.com/photos/15513826/pexels-photo-15513826.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Showroom" loading="lazy" decoding="async" /></div>
        <div className="about-copy">
          <h2>CHOSEN WITH CARE. KEPT WITHOUT COMPROMISE.</h2>
          <p>Premier Automotive began with a simple idea: buying a remarkable pre-owned vehicle should feel as remarkable as owning one.</p>
          <p>Our team looks beyond the badge. We look at provenance, condition, character, and the small things that tell you a car has been truly loved.</p>
          <button className="outline-button" onClick={() => onNavigate('inventory')}>VIEW THE COLLECTION</button>
        </div>
      </section>
      <section className="values">
        <div><ShieldCheck size={28} strokeWidth={1.5} /><h3>THOROUGHLY CONSIDERED</h3><p>Every car is inspected, verified, and prepared by people who know what to look for.</p></div>
        <div><Sparkles size={28} strokeWidth={1.5} /><h3>REMARKABLY PERSONAL</h3><p>No pressure, no performance. Just thoughtful guidance tailored to your next chapter.</p></div>
        <div><CalendarDays size={28} strokeWidth={1.5} /><h3>MADE TO LAST</h3><p>Our standard of care continues long after you leave our showroom.</p></div>
      </section>
    </main>
  );
}

function InveltaClub() {
  return (
    <main className="page-main club-page">
      <section className="standard-hero dark-hero">
        <p className="eyebrow">PREMIER CLUB +</p>
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
        <h1>PREMIER AUTOMOTIVE</h1>
        <p>Whether you're looking for your next vehicle, scheduling a test drive, or inquiring about financing, our dedicated showroom team is at your service.</p>
      </section>

      {/* Main Channels Grid */}
      <section className="contact-channels-section">
        <div className="contact-grid">
          {/* Phone */}
          <div className="contact-card">
            <div className="contact-card-icon">
              <Phone size={24} />
            </div>
            <h3>PHONE & HOTLINE</h3>
            <p className="contact-card-desc">Call our sales specialists or showroom hotline directly.</p>
            <div className="contact-card-details">
              <a href="tel:+18005550199" className="contact-link-bold">+1 (800) 555-0199</a>
              <a href="tel:+18005550120" className="contact-link-sub">+1 (800) 555-0120 (Line 2)</a>
            </div>
            <a href="tel:+18005550199" className="contact-card-action">CALL US NOW <ArrowRight size={14} /></a>
          </div>

          {/* WhatsApp */}
          <div className="contact-card highlight-card">
            <div className="contact-card-icon whatsapp-icon">
              <MessageSquare size={24} />
            </div>
            <h3>WHATSAPP CHAT</h3>
            <p className="contact-card-desc">Instant 1-on-1 concierge assistance for quick inquiries and vehicle photos.</p>
            <div className="contact-card-details">
              <span className="contact-link-bold">+1 (800) 555-0199</span>
              <span className="contact-status-badge">• Online & Ready</span>
            </div>
            <a
              href="https://wa.me/18005550199?text=Hello%20Premier%20Automotive,%20I%20would%20like%20to%20inquire%20about%20a%20vehicle."
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
            <p className="contact-card-desc">Follow our official channels for new inventory arrivals, vehicle walkarounds, and private events.</p>
            <div className="social-links-grid">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-chip">
                <Instagram size={14} /> @premierautomotive
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-chip">
                <Facebook size={14} /> Premier Automotive
              </a>
            </div>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="contact-card-action">
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
                      placeholder="+1 (555) 000-0000"
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
                  <span className="info-val">Showroom Boulevard, Suite 100<br />Metropolitan Auto District</span>
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
                title="Showroom Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100000!2d-74.006!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40w!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
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

  const navigate = (nextPage: Page) => {
    if (nextPage !== 'inventory') {
      setSearchQuery('');
    }
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    setPage('inventory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCar = (id: number) => {
    setActiveCarId(id);
    navigate('car');
  };

  return (
    <div className="app-shell">
      <Header page={page} onNavigate={(p) => { if (p === 'inventory') setSearchQuery(''); navigate(p); }} />
      {page === 'home'      && <HomePage onNavigate={navigate} onSelectCar={handleSelectCar} onSearch={handleHeroSearch} />}
      {page === 'inventory' && <InventoryPage initialQuery={searchQuery} onSelectCar={handleSelectCar} />}
      {page === 'about'     && <About onNavigate={navigate} />}
      {page === 'journal'   && <InveltaClub />}
      {page === 'contact'   && <ContactPage />}
      {page === 'car' && activeCarId && <CarDetailsPage carId={activeCarId} onNavigate={navigate} />}
      <footer className="site-footer">
        <Logo onNavigate={navigate} />
        <div>
          <button onClick={() => { setSearchQuery(''); navigate('inventory'); }}>INVENTORY</button>
          <button onClick={() => navigate('about')}>ABOUT</button>
          <button onClick={() => navigate('journal')}>PREMIER CLUB +</button>
          <button onClick={() => navigate('contact')}>CONTACT US</button>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600 }}>
            <Instagram size={14} /> @premierautomotive
          </a>
        </div>
        <span>© 2024 Premier Automotive. All rights reserved.</span>
      </footer>
    </div>
  );
}

export default App;
