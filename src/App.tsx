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

const ALL_MAKES = ['Toyota', 'Mercedes-Benz', 'Honda', 'Lexus'];

const MAKE_MODELS_MAP: Record<string, string[]> = {
  'Toyota': ['Land Cruiser', 'Camry', 'Highlander'],
  'Mercedes-Benz': ['C-Class', 'S550', 'ML400', 'GLK350', 'E300', 'CLA250'],
  'Lexus': ['IS250'],
  'Honda': ['Accord'],
};

const ALL_MODELS = ['Land Cruiser', 'C-Class', 'IS250', 'S550', 'ML400', 'Camry', 'GLK350', 'E300', 'Accord', 'CLA250', 'Highlander'];

const ALL_YEARS = [2024, 2022, 2021, 2020, 2019, 2017, 2015, 2014, 2013];
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
  tag?: string;
  description: string;
};

const cars: Car[] = [
  { id: 1, name: 'Toyota Land Cruiser', make: 'Toyota', model: 'Land Cruiser', year: 2021, price: '$204,550 CAD', mileage: '18,400 km', fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.pexels.com/photos/27497571/pexels-photo-27497571.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: 'Our electric 2023 Mercedes-Benz AMG EQS MATIC Sedan in Obsidian Black Metallic...' },
  { id: 2, name: 'Mercedes-Benz C-Class', make: 'Mercedes-Benz', model: 'C-Class', year: 2020, price: '$217,994 CAD', mileage: '20,270 km', fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.pexels.com/photos/14217531/pexels-photo-14217531.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: 'The 2021 Mercedes-Benz AMG G63 comes with a twin-turbocharged 4.0-liter V8 engine...' },
  { id: 3, name: 'Lexus IS250', make: 'Lexus', model: 'IS250', year: 2015, price: '$288,231 CAD', mileage: '21,300 km', fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.pexels.com/photos/9803057/pexels-photo-9803057.png?auto=compress&cs=tinysrgb&h=650&w=940', description: 'NO LUX TAX, CARBON TRIM, RACE START FUNCTION' },
  { id: 4, name: 'Mercedes-Benz S550', make: 'Mercedes-Benz', model: 'S550', year: 2019, price: '$599,995 CAD', mileage: '17,260 km', fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.pexels.com/photos/15513826/pexels-photo-15513826.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: 'NO LUX FEDERAL LUXURY TAX...' },
  { id: 5, name: 'Mercedes-Benz ML400', make: 'Mercedes-Benz', model: 'ML400', year: 2015, price: '$289,887 CAD', mileage: '18,220 km', fuel: 'Diesel', transmission: 'Automatic', image: 'https://images.pexels.com/photos/4909544/pexels-photo-4909544.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: '2020 LAMBORGHINI URUS 641HP LAMBIGHINI...' },
  { id: 6, name: 'Toyota Camry XSE', make: 'Toyota', model: 'Camry', year: 2019, price: '$429,311 CAD', mileage: '28,390 km', fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.pexels.com/photos/5213990/pexels-photo-5213990.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: 'LP640-4 PERFORMANTE, SPYDER, CARBON PKG...' },
  { id: 7, name: 'Mercedes-Benz GLK350', make: 'Mercedes-Benz', model: 'GLK350', year: 2013, price: '$169,800 CAD', mileage: '19,250 km', fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.pexels.com/photos/12532746/pexels-photo-12532746.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: 'V8 SPORT SEATS, ALCANTARA INTERIOR...' },
  { id: 8, name: 'Mercedes-Benz E300', make: 'Mercedes-Benz', model: 'E300', year: 2017, price: '$548,800 CAD', mileage: '22,300 km', fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.pexels.com/photos/17370575/pexels-photo-17370575.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: 'SUPERCHARGED V8, COLLECTORS CAR, 54 MILES...' },
  { id: 9, name: 'Honda Accord', make: 'Honda', model: 'Accord', year: 2024, price: '$329,800 CAD', mileage: '30,380 km', fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.pexels.com/photos/18108314/pexels-photo-18108314.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: '671HP, TECH PACK, BLACK PACK...' },
  { id: 10, name: 'Mercedes-Benz CLA250', make: 'Mercedes-Benz', model: 'CLA250', year: 2014, price: '$449,800 CAD', mileage: '26,380 km', fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.pexels.com/photos/29566879/pexels-photo-29566879.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: '617HP, SUPER RARE, CARBON FIBER...' },
  { id: 11, name: 'Toyota Camry SE', make: 'Toyota', model: 'Camry', year: 2022, price: '$489,900 CAD', mileage: '28,390 km', fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.pexels.com/photos/27497572/pexels-photo-27497572.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: 'Our 2021 Rolls-Royce Ghost Bespoke Interior...' },
  { id: 12, name: 'Toyota Highlander XLE', make: 'Toyota', model: 'Highlander', year: 2022, price: '$509,900 CAD', mileage: '21,290 km', fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.pexels.com/photos/33980827/pexels-photo-33980827.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', description: "Our LaFerrari-F8 Tributo 2021." },
];

const inveltaClubPosts = [
  { category: 'News', title: 'The arrival of the 2024 collection', date: 'August 18, 2024', image: 'https://images.pexels.com/photos/14217531/pexels-photo-14217531.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { category: 'Editorial', title: 'Why the V8 engine still matters', date: 'July 02, 2024', image: 'https://images.pexels.com/photos/18108314/pexels-photo-18108314.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { category: 'Culture', title: 'Inside the Invelta Standard of Care', date: 'June 11, 2024', image: 'https://images.pexels.com/photos/29566879/pexels-photo-29566879.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
];

function Logo({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="logo" onClick={() => onNavigate('home')}>
      <span>INVELTA<br /><small>WEBAPP</small></span>
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
          <button className={page === 'journal' ? 'nav-active' : ''} onClick={() => navigate('journal')}>INVELTA CLUB +</button>
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
              INVELTA CLUB +
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
          <span className="car-price">{car.price}</span>
          <button className="car-view-btn">
            VIEW <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─── Home Page ─────────────────────────────────────── */
function HomePage({ onNavigate, onSelectCar }: { onNavigate: (page: Page) => void; onSelectCar: (id: number) => void }) {
  const [q, setQ] = useState('');
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); onNavigate('inventory'); };

  // Select 4 featured cars for the 4-in-a-row grid
  const featuredCars = cars.slice(0, 4);

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">PREMIUM PRE-OWNED VEHICLES</p>
          <h1 className="hero-headline">
            Drive Something<br />
            <em>Remarkable.</em>
          </h1>
          <p className="hero-sub">
            Curated luxury and performance cars, inspected to the highest standard. Your next vehicle is waiting.
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
            <button className="hero-cta-ghost" onClick={() => onNavigate('inventory')}>VIEW ALL CARS <ArrowRight size={15} /></button>
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
            THE INVELTA STANDARD
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
            <p className="home-section-eyebrow">WHY CHOOSE INVELTA</p>
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
          <p className="home-section-eyebrow">INVELTA CLUB +</p>
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

function InventoryPage({ onSelectCar }: { onSelectCar: (id: number) => void }) {
  const [sort, setSort] = useState('Newest first');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
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

    // Search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(car =>
        car.name.toLowerCase().includes(q) ||
        car.make.toLowerCase().includes(q) ||
        car.model.toLowerCase().includes(q) ||
        car.description.toLowerCase().includes(q) ||
        car.year.toString().includes(q)
      );
    }

    // Make / Brand
    if (filters.makes.length > 0) {
      result = result.filter(car => filters.makes.includes(car.make) || filters.makes.some(m => car.name.startsWith(m)));
    }

    // Model
    if (filters.models.length > 0) {
      result = result.filter(car => filters.models.includes(car.model) || filters.models.some(mod => car.name.includes(mod)));
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

    // Price — strip non-digits then compare
    result = result.filter(car => {
      const p = parseInt(car.price.replace(/\D/g, ''));
      return p >= filters.minPrice && p <= filters.maxPrice;
    });

    // Sort
    if (sort === 'Price: low to high') result = [...result].sort((a, b) => parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, '')));
    else if (sort === 'Price: high to low') result = [...result].sort((a, b) => parseInt(b.price.replace(/\D/g, '')) - parseInt(a.price.replace(/\D/g, '')));
    else result = [...result].sort((a, b) => b.year - a.year);

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
              <div className="no-results">No vehicles match your filters.</div>
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
  if (!car) return <div style={{ padding: '100px 40px', textAlign: 'center' }}>Car not found.</div>;
  return (
    <main className="car-details-page">
      <div className="car-details-header">
        <button className="back-btn" onClick={() => onNavigate('inventory')}>
          <ChevronLeft size={16} /> <span>BACK TO INVENTORY</span>
        </button>
      </div>
      <div className="car-details-hero"><img src={car.image} alt={car.name} /></div>
      <div className="car-details-content">
        <div className="car-details-main">
          <h1>{car.year} {car.name}</h1>
          <div className="car-badges"><span className="badge">Pre-Owned</span><span className="badge">Certified</span></div>
          <div className="car-description-section">
            <h2>Vehicle Overview</h2>
            <p>{car.description}</p>
            <p>Experience the perfect blend of performance, luxury, and advanced technology. This exceptionally maintained vehicle has passed our rigorous inspection process and is ready for its next owner.</p>
          </div>
        </div>
        <div className="car-details-sidebar">
          <div className="pricing-card">
            <div className="price">{car.price}</div>
            <div className="specs-grid">
              <div className="spec-item"><Gauge size={20} strokeWidth={1.5} /><div><span className="spec-label">Mileage</span><span className="spec-value">{car.mileage}</span></div></div>
              <div className="spec-item"><Fuel size={20} strokeWidth={1.5} /><div><span className="spec-label">Fuel</span><span className="spec-value">{car.fuel}</span></div></div>
              <div className="spec-item"><SlidersHorizontal size={20} strokeWidth={1.5} /><div><span className="spec-label">Transmission</span><span className="spec-value">{car.transmission}</span></div></div>
            </div>
            <div className="action-buttons">
              <button className="primary-button full-width">INQUIRE NOW</button>
              <button className="outline-button full-width">BOOK TEST DRIVE</button>
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
        <p className="eyebrow">INVELTA CLUB +</p>
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
    subject: 'General Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    }, 6000);
  };

  return (
    <main className="page-main contact-page">
      {/* Hero Header */}
      <section className="standard-hero contact-hero">
        <p className="eyebrow">GET IN TOUCH</p>
        <h1>WE'RE HERE TO HELP.</h1>
        <p>Whether you're looking for your next vehicle, scheduling a test drive, or exploring VIP concierge care, our dedicated team is at your service.</p>
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
            <p className="contact-card-desc">Call our sales specialists or VIP concierge team directly.</p>
            <div className="contact-card-details">
              <a href="tel:18005550199" className="contact-link-bold">+1 (800) 555-0199</a>
              <a href="tel:14165558471" className="contact-link-sub">+1 (416) 555-VIP1 (Local)</a>
            </div>
            <a href="tel:18005550199" className="contact-card-action">CALL US NOW <ArrowRight size={14} /></a>
          </div>

          {/* WhatsApp */}
          <div className="contact-card highlight-card">
            <div className="contact-card-icon whatsapp-icon">
              <MessageSquare size={24} />
            </div>
            <h3>WHATSAPP CHAT</h3>
            <p className="contact-card-desc">Instant 1-on-1 concierge assistance for quick inquiries and vehicle photos.</p>
            <div className="contact-card-details">
              <span className="contact-link-bold">+1 (416) 555-0199</span>
              <span className="contact-status-badge">• Online & Ready</span>
            </div>
            <a
              href="https://wa.me/14165550199?text=Hello%20Invelta%20Concierge,%20I%20would%20like%20to%20inquire%20about%20a%20vehicle."
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card-action whatsapp-action"
            >
              CHAT ON WHATSAPP <ArrowRight size={14} />
            </a>
          </div>

          {/* Email */}
          <div className="contact-card">
            <div className="contact-card-icon">
              <Mail size={24} />
            </div>
            <h3>EMAIL US</h3>
            <p className="contact-card-desc">Send us your specifications or inquiries anytime. We respond within 2 hours.</p>
            <div className="contact-card-details">
              <a href="mailto:concierge@inveltawebapp.com" className="contact-link-bold">concierge@inveltawebapp.com</a>
              <a href="mailto:sales@inveltawebapp.com" className="contact-link-sub">sales@inveltawebapp.com</a>
            </div>
            <a href="mailto:concierge@inveltawebapp.com" className="contact-card-action">SEND AN EMAIL <ArrowRight size={14} /></a>
          </div>

          {/* Social Media */}
          <div className="contact-card">
            <div className="contact-card-icon">
              <Instagram size={24} />
            </div>
            <h3>SOCIAL MEDIA</h3>
            <p className="contact-card-desc">Follow our latest arrivals, private collections, and automobile stories.</p>
            <div className="social-links-grid">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-chip">
                <Instagram size={14} /> @inveltawebapp
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-chip">
                <Facebook size={14} /> /invelta.official
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-chip">
                <Twitter size={14} /> @invelta_official
              </a>
            </div>
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
                <p>Your inquiry has been received. One of our senior concierges will reach out to you within 2 business hours.</p>
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
                      placeholder="e.g. Alexander Vance"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="c-email">EMAIL ADDRESS *</label>
                    <input
                      id="c-email"
                      type="email"
                      required
                      placeholder="alexander@example.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="c-phone">PHONE NUMBER</label>
                    <input
                      id="c-phone"
                      type="tel"
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
                      <option value="VIP Concierge">VIP Concierge Care</option>
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
                  <span className="info-val">100 Yorkville Avenue, Suite 400<br />Toronto, ON M5R 1B9, Canada</span>
                </div>
              </div>
              <div className="info-item">
                <Clock size={20} className="info-icon" />
                <div>
                  <span className="info-label">OPERATING HOURS</span>
                  <span className="info-val">Mon – Fri: 9:00 AM – 7:00 PM<br />Saturday: 10:00 AM – 6:00 PM<br />Sunday: By Appointment</span>
                </div>
              </div>
            </div>

            {/* Google Map iFrame */}
            <div className="google-map-wrapper">
              <iframe
                title="Invelta Webapp Showroom Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2885.836881729237!2d-79.3956371!3d43.6702651!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34a87e5b2923%3A0x7d025114a82087d!2sYorkville%20Ave%2C%20Toronto%2C%20ON!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca"
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
  const navigate = (nextPage: Page) => { setPage(nextPage); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleSelectCar = (id: number) => { setActiveCarId(id); navigate('car'); };

  return (
    <div className="app-shell">
      <Header page={page} onNavigate={navigate} />
      {page === 'home'      && <HomePage onNavigate={navigate} onSelectCar={handleSelectCar} />}
      {page === 'inventory' && <InventoryPage onSelectCar={handleSelectCar} />}
      {page === 'about'     && <About onNavigate={navigate} />}
      {page === 'journal'   && <InveltaClub />}
      {page === 'contact'   && <ContactPage />}
      {page === 'car' && activeCarId && <CarDetailsPage carId={activeCarId} onNavigate={navigate} />}
      <footer className="site-footer">
        <Logo onNavigate={navigate} />
        <div>
          <button onClick={() => navigate('inventory')}>INVENTORY</button>
          <button onClick={() => navigate('about')}>ABOUT</button>
          <button onClick={() => navigate('journal')}>INVELTA CLUB +</button>
          <button onClick={() => navigate('contact')}>CONTACT US</button>
        </div>
        <span>© 2024 Invelta Webapp</span>
      </footer>
    </div>
  );
}

export default App;
