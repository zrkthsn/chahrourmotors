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
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Phone,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Twitter,
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
  minYear: 2013,
  maxYear: 2024,
  minPrice: 0,
  maxPrice: 700000,
};

const ALL_MAKES = ['Mercedes-Benz', 'Porsche', 'BMW', 'Land Rover', 'Jeep', 'Toyota', 'Honda', 'Lexus'];

const MAKE_MODELS_MAP: Record<string, string[]> = {
  'Mercedes-Benz': ['C-Class', 'GLC Series', 'S550', 'ML400', 'GLK350', 'E300', 'CLA250'],
  'Porsche': ['Macan'],
  'BMW': ['3 Series', '4 Series', 'X6'],
  'Land Rover': ['Range Rover Sport', 'Range Rover Velar', 'Range Rover Evoque'],
  'Jeep': ['Grand Cherokee'],
  'Toyota': ['Land Cruiser', 'Camry', 'Highlander'],
  'Lexus': ['IS250'],
  'Honda': ['Accord'],
};

const ALL_MODELS = ['C-Class', 'GLC Series', 'Macan', '3 Series', '4 Series', 'X6', 'Range Rover Sport', 'Range Rover Velar', 'Range Rover Evoque', 'Grand Cherokee', 'Land Cruiser', 'IS250', 'S550', 'ML400', 'Camry', 'GLK350', 'E300', 'Accord', 'CLA250', 'Highlander'];

const ALL_YEARS = [2024, 2022, 2021, 2020, 2019, 2018, 2017, 2015, 2014, 2013];

const ALL_FUELS = ['Petrol', 'Diesel'];
const ALL_TRANSMISSIONS = ['Automatic', 'Manual'];

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
    name: 'Mercedes-Benz C300 AMG Shadow Edition', 
    make: 'Mercedes-Benz', 
    model: 'C-Class', 
    year: 2022, 
    price: 'Call 03 / 82 05 82', 
    mileage: '60,000 miles', 
    fuel: 'Petrol', 
    transmission: 'Automatic', 
    image: '/c300-amg/front-angle.jpg', 
    images: [
      '/c300-amg/front-angle.jpg',
      '/c300-amg/front.jpg',
      '/c300-amg/rear.jpg',
      '/c300-amg/interior.jpg'
    ],
    tag: 'AMG SHADOW EDITION',
    description: '2022 Mercedes Benz C300 AMG SHADOW EDITION featuring AMG Line, LED Headlights + Adaptive Highbeam, 11.9" MBUX Touchscreen, 360° Camera / Parking Assistance, Panoramic Sunroof, Power-folding mirrors, AMG sport seats, Blind Spot Assist, and Attention Assist. For more info call us or WhatsApp on: 03 / 82 05 82.' 
  },
  { 
    id: 2, 
    name: 'BMW 316i Sport Line', 
    make: 'BMW', 
    model: '3 Series', 
    year: 2015, 
    price: 'Call 03 / 82 05 82', 
    mileage: '75,000 km', 
    fuel: 'Petrol', 
    transmission: 'Automatic', 
    image: '/bmw-316i/front-angle.jpg', 
    images: [
      '/bmw-316i/front-angle.jpg',
      '/bmw-316i/front.jpg',
      '/bmw-316i/rear-angle.jpg',
      '/bmw-316i/interior.jpg',
      '/bmw-316i/wheel.jpg'
    ],
    tag: 'SPORT LINE',
    description: '2015 BMW 316i Sport Line featuring a 2.0L 4-Cylinder engine, black leather interior (Like NEW), Company source, Premium Package, Dynamic headlights, Auto park system, and 75,000 km. For more info call us or WhatsApp on: 03 / 82 05 82.' 
  },
  { 
    id: 3, 
    name: 'BMW 430i Gran Coupé', 
    make: 'BMW', 
    model: '4 Series', 
    year: 2017, 
    price: 'Call 03 / 82 05 82', 
    mileage: 'Excellent Condition', 
    fuel: 'Petrol', 
    transmission: 'Automatic', 
    image: '/bmw-430i/front-angle.jpg', 
    images: [
      '/bmw-430i/front-angle.jpg',
      '/bmw-430i/front.jpg',
      '/bmw-430i/badge.jpg',
      '/bmw-430i/rear.jpg',
      '/bmw-430i/rear-angle.jpg'
    ],
    tag: 'GRAN COUPÉ',
    description: '2017 BMW 430i Gran Coupé featuring a 2.0L Turbo engine with 8-speed automatic transmission and paddle shifters, Head-Up Display (HUD), Rear view camera, Black-on-Black spec, Sunroof, Power folding mirrors, and Electric trunk. For more info call us or WhatsApp on: 03 / 82 05 82.' 
  },
  { 
    id: 4, 
    name: 'Range Rover Sport HSE V6', 
    make: 'Land Rover', 
    model: 'Range Rover Sport', 
    year: 2019, 
    price: 'Call 03 / 82 05 82', 
    mileage: '63,000 miles', 
    fuel: 'Petrol', 
    transmission: 'Automatic', 
    image: '/range-rover-sport/front-angle.jpg', 
    images: [
      '/range-rover-sport/front-angle.jpg',
      '/range-rover-sport/front.jpg',
      '/range-rover-sport/rear-angle.jpg',
      '/range-rover-sport/interior-console.jpg',
      '/range-rover-sport/interior-cockpit.jpg'
    ],
    tag: 'HSE V6 TURBO',
    description: '2019 Land Rover Range Rover Sport HSE V6 featuring a 3.0L Turbo V6 engine, Clean Carfax, Black on Black specification, Panoramic roof, Heated seats, 360° Surround Camera system, Fully loaded package, 63,000 miles, Car loan available with 2 months warranty. For more info call us or WhatsApp on: 03 / 82 05 82.' 
  },
  { 
    id: 5, 
    name: 'Mercedes-Benz GLC 300 4MATIC', 
    make: 'Mercedes-Benz', 
    model: 'GLC Series', 
    year: 2019, 
    price: 'Call 03 / 82 05 82', 
    mileage: '31,000 miles', 
    fuel: 'Petrol', 
    transmission: 'Automatic', 
    image: '/mercedes-glc/front-angle.jpg', 
    images: [
      '/mercedes-glc/front-angle.jpg',
      '/mercedes-glc/front.jpg',
      '/mercedes-glc/rear-angle.jpg',
      '/mercedes-glc/dashboard.jpg',
      '/mercedes-glc/interior.jpg'
    ],
    tag: 'GLC 300 4MATIC',
    description: '2019 Mercedes-Benz GLC 300 4MATIC featuring a Black-on-Black color combination, Panoramic Sunroof, LED lighting system, Full Oxford Perforated Leather Seating, Navigation System, Remote keyless entry, Seat Memory, Blind Spot Monitor Closing Vehicle Sensing, Rear Parking Aid, 360° Surround Camera, Back-Up Camera, and Heated door mirrors. 31,000 miles, Car loan available with 2 months warranty. For more info call us or WhatsApp on: 03 / 82 05 82.' 
  },
  { 
    id: 6, 
    name: 'Mercedes-Benz C300 Coupé', 
    make: 'Mercedes-Benz', 
    model: 'C-Class', 
    year: 2018, 
    price: 'Call 03 / 82 05 82', 
    mileage: '91,000 miles', 
    fuel: 'Petrol', 
    transmission: 'Automatic', 
    image: '/c300-coupe/front-angle.jpg', 
    images: [
      '/c300-coupe/front-angle.jpg',
      '/c300-coupe/front.jpg',
      '/c300-coupe/rear-angle.jpg',
      '/c300-coupe/interior.jpg',
      '/c300-coupe/cockpit.jpg'
    ],
    tag: 'C300 COUPÉ',
    description: '2018 Mercedes-Benz C300 Coupé featuring a Black-on-Black color specification, zero accident history, 91,000 miles, Panoramic roof, LED lighting, Full Oxford Perforated Leather Seating, Navigation System, Remote keyless entry, Seat Memory, Blind Spot Monitor, Rear Parking Aid, 360° Surround Camera, Heated door mirrors, and 4 brand new tires. Car loan available with 2 months warranty. For more info call us or WhatsApp on: 03 / 82 05 82.' 
  },
  { 
    id: 7, 
    name: 'Porsche Macan S', 
    make: 'Porsche', 
    model: 'Macan', 
    year: 2018, 
    price: 'Call 03 / 82 05 82', 
    mileage: '77,000 miles', 
    fuel: 'Petrol', 
    transmission: 'Automatic', 
    image: '/porsche-macan/front-angle.jpg', 
    images: [
      '/porsche-macan/front-angle.jpg',
      '/porsche-macan/front.jpg',
      '/porsche-macan/rear-angle.jpg',
      '/porsche-macan/cockpit.jpg',
      '/porsche-macan/dashboard.jpg'
    ],
    tag: 'SPORT CHRONO 340HP',
    description: '2018 Porsche Macan S featuring a 3.0L Twin-Turbocharged V6 Engine (340 HP) with 7-Speed PDK AWD, Sport Chrono Package with Dash Stopwatch & Sport Plus Mode, Porsche Torque Vectoring Plus (PTV+), Aggressive Sport Exhaust, 14-Way Power Sport Black Leather Seats with 3 Memory positions, Heated & Cooled seats, Heated Steering Wheel, Adaptive Cruise Control (ACC) with PAS Self-Braking, Lane Change Assist, 360-degree cameras, 4 original new disc brakes and pads, and fresh oil service. 77,000 miles. For more info call us or WhatsApp on: 03 / 82 05 82.' 
  },
  { 
    id: 8, 
    name: 'Range Rover Velar P380 R-Dynamic', 
    make: 'Land Rover', 
    model: 'Range Rover Velar', 
    year: 2018, 
    price: 'Call 03 / 82 05 82', 
    mileage: '98,000 miles', 
    fuel: 'Petrol', 
    transmission: 'Automatic', 
    image: '/range-rover-velar/front-angle.jpg', 
    images: [
      '/range-rover-velar/front-angle.jpg',
      '/range-rover-velar/front.jpg',
      '/range-rover-velar/rear-angle.jpg',
      '/range-rover-velar/rear.jpg',
      '/range-rover-velar/interior.jpg'
    ],
    tag: 'R-DYNAMIC P380 380HP',
    description: '2018 Land Rover Range Rover Velar P380 R-Dynamic featuring a 3.0L Supercharged V6 engine producing 380 HP with AWD, Panoramic Roof, Digital Dashboard, Meridian Sound System, Memory Seats, Ambient Lighting, Lane Assist, and Adaptive Cruise Control. 98,000 miles. For more info call us or WhatsApp on: 03 / 82 05 82.' 
  },
  { 
    id: 9, 
    name: 'Range Rover Sport HSE V6 (7 Seats)', 
    make: 'Land Rover', 
    model: 'Range Rover Sport', 
    year: 2018, 
    price: 'Call 03 / 82 05 82', 
    mileage: 'Clean Carfax', 
    fuel: 'Petrol', 
    transmission: 'Automatic', 
    image: '/range-rover-sport-2018/front-angle.jpg', 
    images: [
      '/range-rover-sport-2018/front-angle.jpg',
      '/range-rover-sport-2018/front.jpg',
      '/range-rover-sport-2018/rear-angle.jpg',
      '/range-rover-sport-2018/interior-console.jpg',
      '/range-rover-sport-2018/cockpit.jpg'
    ],
    tag: '7 SEATER HSE V6',
    description: '2018 Land Rover Range Rover Sport HSE V6 featuring 7-passenger seating, 3.0L Turbo V6 engine, Clean Carfax, Black-on-Black specification, Panoramic roof, Heated seats, 360° Surround Camera system, Fully loaded option package, Car loan available with 2 months warranty. For more info call us or WhatsApp on: 03 / 82 05 82.' 
  },
  { 
    id: 10, 
    name: 'BMW X6 Individual Edition Twin Turbo', 
    make: 'BMW', 
    model: 'X6', 
    year: 2015, 
    price: 'Call 03 / 82 05 82', 
    mileage: '92,000 km', 
    fuel: 'Petrol', 
    transmission: 'Automatic', 
    image: '/bmw-x6/front-angle.jpg', 
    images: [
      '/bmw-x6/front-angle.jpg',
      '/bmw-x6/front.jpg',
      '/bmw-x6/rear-angle.jpg',
      '/bmw-x6/dashboard.jpg',
      '/bmw-x6/rear-seats.jpg'
    ],
    tag: 'INDIVIDUAL TWIN TURBO',
    description: '2015 BMW X6 Individual Edition Twin Turbo featuring a 6-Cylinder Twin Turbo engine, Clean Carfax, Company source, Black exterior on Cognac Extra-vaganza leather interior (Like NEW), Premium Package, Sunroof, Adaptive LED headlights, New Bridgestone tires, Auto park system, Heated & Ventilated (Cooled) seats, and 360º View Camera. 92,000 km. For more info call us or WhatsApp on: 03 / 82 05 82.' 
  },
  { 
    id: 11, 
    name: 'Mercedes-Benz C300 AMG Package', 
    make: 'Mercedes-Benz', 
    model: 'C-Class', 
    year: 2019, 
    price: 'Call 03 / 82 05 82', 
    mileage: '82,000 miles', 
    fuel: 'Petrol', 
    transmission: 'Automatic', 
    image: '/c300-white/front-angle.jpg', 
    images: [
      '/c300-white/front-angle.jpg',
      '/c300-white/front.jpg',
      '/c300-white/rear-angle.jpg',
      '/c300-white/dashboard.jpg',
      '/c300-white/interior-rear.jpg'
    ],
    tag: 'WHITE AMG PACKAGE',
    description: '2019 Mercedes-Benz C300 AMG Package featuring a Polar White exterior on Cognac/Basket interior, Clean Carfax, AMG Line styling, Big Widescreen Infotainment with Apple CarPlay & Android Auto, Radar Distronic Function, Panoramic Roof, Blind Spot Assist, and Paddle Shifters. 82,000 miles. For more info call us or WhatsApp on: 03 / 82 05 82.' 
  },
  { 
    id: 12, 
    name: 'Jeep Grand Cherokee Limited 4x4', 
    make: 'Jeep', 
    model: 'Grand Cherokee', 
    year: 2018, 
    price: 'Call 03 / 82 05 82', 
    mileage: 'Excellent Condition', 
    fuel: 'Petrol', 
    transmission: 'Automatic', 
    image: '/jeep-grand-cherokee/front-angle.jpg', 
    images: [
      '/jeep-grand-cherokee/front-angle.jpg',
      '/jeep-grand-cherokee/front.jpg',
      '/jeep-grand-cherokee/rear.jpg',
      '/jeep-grand-cherokee/cockpit.jpg',
      '/jeep-grand-cherokee/dashboard.jpg'
    ],
    tag: 'LIMITED 4X4',
    description: '2018 Jeep Grand Cherokee Limited featuring 4x4 Drive system, Grey exterior on Black leather interior, Sunroof, Touchscreen Infotainment System with Bluetooth & USB connectivity, Rear Camera + Parking Sensors, Lane Assist, Cruise Control, Keyless Entry & Push Button Start, Electric Power Seats, 2 months warranty. For more info call us or WhatsApp on: 03 / 82 05 82.' 
  },
  { 
    id: 13, 
    name: 'Range Rover Evoque HSE Dynamic V4', 
    make: 'Land Rover', 
    model: 'Range Rover Evoque', 
    year: 2018, 
    price: 'Call 03 / 82 05 82', 
    mileage: '74,000 miles', 
    fuel: 'Petrol', 
    transmission: 'Automatic', 
    image: '/range-rover-evoque/front-angle.jpg', 
    images: [
      '/range-rover-evoque/front-angle.jpg',
      '/range-rover-evoque/front.jpg',
      '/range-rover-evoque/rear.jpg',
      '/range-rover-evoque/cockpit.jpg',
      '/range-rover-evoque/dashboard.jpg'
    ],
    tag: 'HSE DYNAMIC V4',
    description: '2018 Land Rover Range Rover Evoque HSE Dynamic V4 featuring 4-cylinder engine, Clean CarFax, Black-on-Black specification, Front & Rear parking sensors, Multifunction steering wheel with Paddle shifters, Electric Trunk, Front and Rear heated seats + Front cooled seats, Meridian Surround Sound System, Memory Seats, Panoramic Sunroof, Terrain Selector, Park Assist, LED headlights, Car loan available with 2 months warranty. For more info call us or WhatsApp on: 03 / 82 05 82.' 
  },
];

const inveltaClubPosts = [
  { category: 'News', title: 'The arrival of the 2024 collection', date: 'August 18, 2024', image: 'https://images.pexels.com/photos/14217531/pexels-photo-14217531.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { category: 'Editorial', title: 'Why the V8 engine still matters', date: 'July 02, 2024', image: 'https://images.pexels.com/photos/18108314/pexels-photo-18108314.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { category: 'Culture', title: 'Inside the Invelta Standard of Care', date: 'June 11, 2024', image: 'https://images.pexels.com/photos/29566879/pexels-photo-29566879.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
];

function Logo({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="logo" onClick={() => onNavigate('home')}>
      <span>MOUAWAD<br /><small>AUTOMOTIVE</small></span>
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
          <button className={page === 'journal' ? 'nav-active' : ''} onClick={() => navigate('journal')}>MOUAWAD CLUB +</button>
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
              MOUAWAD CLUB +
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
        <img src={car.image} alt={`${car.year} ${car.name}`} />
        <span className="car-badge">{car.year} • PRE-OWNED</span>
      </div>
      <div className="car-info">
        <h3 className="car-name">{car.name}</h3>
        <p className="car-specs-line">{car.mileage} • {car.fuel} • {car.transmission}</p>
        <div className="car-price-row">
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
          <p className="hero-eyebrow-minimal">MOUAWAD AUTOMOTIVE</p>
          <h1 className="hero-title-clean">ROLAND MOUAWAD EXPO</h1>
          <p className="hero-subtext-clean">
            SHOWROOM & PRE-OWNED LUXURY VEHICLES • SIN EL FIL, BEIRUT
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
              href="https://wa.me/96103820582"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta-ghost"
              style={{ textDecoration: 'none' }}
            >
              WHATSAPP CONCIERGE (03 82 05 82) <ArrowRight size={15} />
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
            <span className="stat-number">0%</span>
            <span className="stat-label">LUXURY TAX EXEMPT</span>
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
            THE MOUAWAD STANDARD
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
            <img src="https://images.pexels.com/photos/27497571/pexels-photo-27497571.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Luxury SUVs" />
            <div className="category-overlay">
              <h3>LUXURY SUVS</h3>
              <p>Land Cruiser, Urus, GLK Series</p>
              <span className="category-cta">BROWSE SUVS <ArrowRight size={13} /></span>
            </div>
          </div>
          <div className="category-card" onClick={() => onNavigate('inventory')}>
            <img src="https://images.pexels.com/photos/14217531/pexels-photo-14217531.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Executive Sedans" />
            <div className="category-overlay">
              <h3>EXECUTIVE SEDANS</h3>
              <p>Mercedes S-Class, C-Class, Lexus IS</p>
              <span className="category-cta">BROWSE SEDANS <ArrowRight size={13} /></span>
            </div>
          </div>
          <div className="category-card" onClick={() => onNavigate('inventory')}>
            <img src="https://images.pexels.com/photos/9803057/pexels-photo-9803057.png?auto=compress&cs=tinysrgb&h=650&w=940" alt="Performance Sports" />
            <div className="category-overlay">
              <h3>PERFORMANCE & SPORT</h3>
              <p>AMG, Performante, Twin-Turbo V8</p>
              <span className="category-cta">BROWSE PERFORMANCE <ArrowRight size={13} /></span>
            </div>
          </div>
          <div className="category-card" onClick={() => onNavigate('inventory')}>
            <img src="https://images.pexels.com/photos/18108314/pexels-photo-18108314.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Electric & Hybrid" />
            <div className="category-overlay">
              <h3>ELECTRIC & HYBRID</h3>
              <p>EQS 4MATIC & Eco-Luxury</p>
              <span className="category-cta">BROWSE ELECTRICS <ArrowRight size={13} /></span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="home-why-section">
        <div className="home-why-inner">
          <div className="home-section-header">
            <p className="home-section-eyebrow">WHY CHOOSE MOUAWAD</p>
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
          <p className="home-section-eyebrow">MOUAWAD CLUB +</p>
          <h2 className="home-section-title">Latest Journal Stories</h2>
        </div>
        <div className="journal-preview-grid">
          {inveltaClubPosts.map((post) => (
            <article key={post.title} className="home-journal-card" onClick={() => onNavigate('journal')}>
              <div className="hj-image-wrap">
                <img src={post.image} alt={post.title} />
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
            <button className="outline-button-white" onClick={() => onNavigate('about')}>
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
  const whatsappMessage = encodeURIComponent(`Hello Mouawad Automotive, I am interested in the ${car.year} ${car.name}.`);

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
              <img src={activeImage} alt={car.name} />
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
                    <img src={imgUrl} alt={`${car.name} view ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information, Specs & Actions */}
          <div className="car-info-column">
            <div className="car-title-block">
              <span className="car-eyebrow">MOUAWAD AUTOMOTIVE • {car.make.toUpperCase()}</span>
              <h1>{car.year} {car.name}</h1>
              <div className="car-badges">
                {car.tag && <span className="badge tag-badge">{car.tag}</span>}
                <span className="badge make-badge">{car.make}</span>
                <span className="badge year-badge">{car.year}</span>
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
                  <span className="spec-val">2 Months Included</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="car-action-buttons">
              <a
                href={`https://wa.me/96103820582?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-concierge-btn"
              >
                <MessageSquare size={16} /> WHATSAPP CONCIERGE (03 82 05 82)
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
        <div className="about-image"><img src="https://images.pexels.com/photos/15513826/pexels-photo-15513826.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Showroom" /></div>
        <div className="about-copy">
          <h2>CHOSEN WITH CARE. KEPT WITHOUT COMPROMISE.</h2>
          <p>Invelta Webapp began with a simple idea: buying a remarkable pre-owned car should feel as remarkable as owning one.</p>
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
        <p className="eyebrow">MOUAWAD CLUB +</p>
        <h1>NOTES ON THE ROAD LESS TRAVELLED.</h1>
        <p>Stories, ideas, and considered advice for a life in motion.</p>
      </section>
      <section className="club-grid">
        {inveltaClubPosts.map((post) => (
          <article className="club-card" key={post.title}>
            <div className="club-image"><img src={post.image} alt={post.title} /></div>
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
        <p className="eyebrow">EXPO ROLAND MOUAWAD</p>
        <h1>MOUAWAD AUTOMOTIVE</h1>
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
              <a href="tel:+9613820582" className="contact-link-bold">03 / 82 05 82 (+961 3 820 582)</a>
              <a href="tel:+9613669915" className="contact-link-sub">03 / 66 99 15 (Showroom Line 2)</a>
            </div>
            <a href="tel:+9613820582" className="contact-card-action">CALL US NOW <ArrowRight size={14} /></a>
          </div>

          {/* WhatsApp */}
          <div className="contact-card highlight-card">
            <div className="contact-card-icon whatsapp-icon">
              <MessageSquare size={24} />
            </div>
            <h3>WHATSAPP CHAT</h3>
            <p className="contact-card-desc">Instant 1-on-1 concierge assistance for quick inquiries and vehicle photos.</p>
            <div className="contact-card-details">
              <span className="contact-link-bold">03 / 82 05 82</span>
              <span className="contact-status-badge">• Online & Ready</span>
            </div>
            <a
              href="https://wa.me/96103820582?text=Hello%20Mouawad%20Automotive,%20I%20would%20like%20to%20inquire%20about%20a%20vehicle."
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
            <h3>INSTAGRAM & FACEBOOK</h3>
            <p className="contact-card-desc">Follow our official Instagram & Facebook pages for new inventory arrivals, vehicle photos, and videos.</p>
            <div className="social-links-grid">
              <a href="https://www.instagram.com/r.mouawad.expo/?hl=en" target="_blank" rel="noreferrer" className="social-chip">
                <Instagram size={14} /> @r.mouawad.expo
              </a>
              <a href="https://www.facebook.com/exporolandmouawad/" target="_blank" rel="noreferrer" className="social-chip">
                <Facebook size={14} /> Expo Roland Mouawad
              </a>
            </div>
            <a href="https://www.instagram.com/r.mouawad.expo/?hl=en" target="_blank" rel="noreferrer" className="contact-card-action">
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
                      placeholder="+961 3 000 000"
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
                  <span className="info-val">Sin El Fil, Chalouhi Highway<br />Beirut, Lebanon</span>
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
                title="Expo Roland Mouawad Showroom Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13251.107936173024!2d35.5342!3d33.8768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f173b22b10a2f%3A0x6b7774e1d528b3a0!2sSin%20El%20Fil%2C%20Lebanon!5e0!3m2!1sen!2slb!4v1700000000000!5m2!1sen!2slb"
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
          <button onClick={() => navigate('journal')}>MOUAWAD CLUB +</button>
          <button onClick={() => navigate('contact')}>CONTACT US</button>
          <a href="https://www.instagram.com/r.mouawad.expo/?hl=en" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600 }}>
            <Instagram size={14} /> @r.mouawad.expo
          </a>
        </div>
        <span>© 2024 Mouawad Automotive</span>
      </footer>
    </div>
  );
}

export default App;
