import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Fuel,
  Gauge,
  Heart,
  Menu,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';

type Page = 'home' | 'about' | 'journal';
type Car = {
  id: number;
  name: string;
  year: number;
  price: string;
  mileage: string;
  fuel: string;
  transmission: string;
  image: string;
  tag?: string;
};

const cars: Car[] = [
  { id: 1, name: 'Toyota Land Cruiser', year: 2021, price: '₦61,500,000', mileage: '18,400 km', fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.pexels.com/photos/27497571/pexels-photo-27497571.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', tag: 'Featured' },
  { id: 2, name: 'Mercedes-Benz C-Class', year: 2020, price: '₦67,000,000', mileage: '20,270 km', fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.pexels.com/photos/14217531/pexels-photo-14217531.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 3, name: 'Lexus IS250', year: 2015, price: '₦37,000,000', mileage: '21,300 km', fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.pexels.com/photos/9803057/pexels-photo-9803057.png?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 4, name: 'Mercedes-Benz S550', year: 2019, price: '₦112,800,000', mileage: '17,260 km', fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.pexels.com/photos/15513826/pexels-photo-15513826.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', tag: 'Premium' },
  { id: 5, name: 'Mercedes-Benz ML400', year: 2015, price: '₦37,000,000', mileage: '18,220 km', fuel: 'Diesel', transmission: 'Automatic', image: 'https://images.pexels.com/photos/4909544/pexels-photo-4909544.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 6, name: 'Toyota Camry XSE', year: 2019, price: '₦48,000,000', mileage: '28,390 km', fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.pexels.com/photos/5213990/pexels-photo-5213990.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 7, name: 'Mercedes-Benz GLK350', year: 2013, price: '₦29,500,000', mileage: '19,250 km', fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.pexels.com/photos/12532746/pexels-photo-12532746.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 8, name: 'Mercedes-Benz E300', year: 2017, price: '₦45,500,000', mileage: '22,300 km', fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.pexels.com/photos/17370575/pexels-photo-17370575.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 9, name: 'Honda Accord', year: 2024, price: '₦57,000,000', mileage: '30,380 km', fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.pexels.com/photos/18108314/pexels-photo-18108314.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', tag: 'New arrival' },
  { id: 10, name: 'Mercedes-Benz CLA250', year: 2014, price: '₦15,400,000', mileage: '26,380 km', fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.pexels.com/photos/29566879/pexels-photo-29566879.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 11, name: 'Toyota Camry SE', year: 2022, price: '₦45,500,000', mileage: '28,390 km', fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.pexels.com/photos/27497572/pexels-photo-27497572.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { id: 12, name: 'Toyota Highlander XLE', year: 2022, price: '₦67,000,000', mileage: '21,290 km', fuel: 'Petrol', transmission: 'Automatic', image: 'https://images.pexels.com/photos/33980827/pexels-photo-33980827.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
];

const journalPosts = [
  { category: 'Buying guide', title: 'The considered way to buy your next car', date: 'May 18, 2024', image: 'https://images.pexels.com/photos/14217531/pexels-photo-14217531.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { category: 'Ownership', title: 'Five small details that make a car feel new', date: 'April 02, 2024', image: 'https://images.pexels.com/photos/18108314/pexels-photo-18108314.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { category: 'Our world', title: 'Inside the Anara standard of care', date: 'March 11, 2024', image: 'https://images.pexels.com/photos/29566879/pexels-photo-29566879.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
];

function Logo() {
  return <div className="logo" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))}><span className="logo-mark">A</span><span>ANARA<br /><small>MOTORS</small></span></div>;
}

function Header({ page, onNavigate }: { page: Page; onNavigate: (page: Page) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = (nextPage: Page) => { onNavigate(nextPage); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  return <header className="site-header">
    <div className="header-inner">
      <button className="mobile-menu" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      <Logo />
      <nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'}>
        <button className={page === 'home' ? 'nav-active' : ''} onClick={() => navigate('home')}>Inventory</button>
        <button className={page === 'about' ? 'nav-active' : ''} onClick={() => navigate('about')}>About us</button>
        <button className={page === 'journal' ? 'nav-active' : ''} onClick={() => navigate('journal')}>Journal</button>
      </nav>
      <div className="header-actions"><button className="circle-button" aria-label="Your account"><CircleUserRound size={19} /></button><button className="header-contact" onClick={() => window.location.href = 'tel:+2348000000000'}>Speak with us <ArrowRight size={16} /></button></div>
    </div>
  </header>;
}

function SearchPanel({ query, setQuery, make, setMake, body, setBody, onReset }: { query: string; setQuery: (value: string) => void; make: string; setMake: (value: string) => void; body: string; setBody: (value: string) => void; onReset: () => void }) {
  return <div className="search-panel">
    <div className="search-input"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search make, model or keyword" /></div>
    <div className="select-wrap"><label>Make</label><select value={make} onChange={(event) => setMake(event.target.value)}><option value="All makes">All makes</option><option>Mercedes-Benz</option><option>Toyota</option><option>Lexus</option><option>Honda</option></select><ChevronDown size={15} /></div>
    <div className="select-wrap"><label>Body type</label><select value={body} onChange={(event) => setBody(event.target.value)}><option value="All body types">All body types</option><option value="SUV">SUV</option><option value="Sedan">Sedan</option></select><ChevronDown size={15} /></div>
    <button className="filter-button" onClick={onReset}><SlidersHorizontal size={17} /> <span>Clear filters</span></button>
  </div>;
}

function CarCard({ car }: { car: Car }) {
  const [saved, setSaved] = useState(false);
  return <article className="car-card">
    <div className="car-image-wrap"><img src={car.image} alt={`${car.year} ${car.name}`} /><button className={saved ? 'save-button saved' : 'save-button'} onClick={() => setSaved(!saved)} aria-label="Save vehicle"><Heart size={17} fill={saved ? 'currentColor' : 'none'} /></button>{car.tag && <span className="car-tag">{car.tag}</span>}</div>
    <div className="car-info"><div className="car-heading"><div><p className="eyebrow">{car.year}</p><h3>{car.name}</h3></div><strong>{car.price}</strong></div><div className="car-specs"><span><Gauge size={14} /> {car.mileage}</span><span><Fuel size={14} /> {car.fuel}</span><span>{car.transmission}</span></div></div>
  </article>;
}

function Home({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [query, setQuery] = useState('');
  const [make, setMake] = useState('All makes');
  const [body, setBody] = useState('All body types');
  const [sort, setSort] = useState('Featured');
  const filteredCars = useMemo(() => cars.filter((car) => `${car.name} ${car.year}`.toLowerCase().includes(query.toLowerCase()) && (make === 'All makes' || car.name.startsWith(make)) && (body === 'All body types' || (body === 'SUV' ? car.name.includes('Land') || car.name.includes('ML') || car.name.includes('GLK') || car.name.includes('Highlander') : !car.name.includes('Land') && !car.name.includes('ML') && !car.name.includes('GLK') && !car.name.includes('Highlander')))), [query, make, body]);
  const reset = () => { setQuery(''); setMake('All makes'); setBody('All body types'); };
  return <>
    <section className="hero"><div className="hero-text"><p className="eyebrow light">The art of the automobile</p><h1>Drive something<br /><em>worth remembering.</em></h1><p className="hero-copy">A considered collection of exceptional cars, selected for the way they make you feel.</p><button className="primary-button" onClick={() => document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' })}>Explore inventory <ArrowRight size={17} /></button></div><div className="hero-visual"><img src="https://images.pexels.com/photos/14217531/pexels-photo-14217531.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Black luxury car outside Anara Motors" /><div className="hero-stamp"><span>Est.</span><strong>2012</strong><span>Lagos · Nigeria</span></div></div><div className="hero-bottom"><span>Scroll to discover</span><span className="line"></span><span>01 / 03</span></div></section>
    <main id="inventory" className="inventory-section"><div className="section-intro"><div><p className="eyebrow">Our collection</p><h2>Find your next <em>chapter.</em></h2></div><p className="intro-note">Every car in our collection is handpicked, thoroughly inspected, and ready for the road ahead.</p></div><SearchPanel query={query} setQuery={setQuery} make={make} setMake={setMake} body={body} setBody={setBody} onReset={reset} /><div className="inventory-toolbar"><p><strong>{filteredCars.length}</strong> vehicles available</p><div className="sort"><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option>Featured</option><option>Price: low to high</option><option>Newest first</option></select><ChevronDown size={14} /></div></div>{filteredCars.length ? <div className="car-grid">{filteredCars.map((car) => <CarCard key={car.id} car={car} />)}</div> : <div className="empty-state"><Search size={28} /><h3>No vehicles found</h3><p>Try adjusting your search or filters.</p><button className="outline-button" onClick={reset}>Clear all filters</button></div>}<div className="inventory-footer"><span>Showing {filteredCars.length} of 48 vehicles</span><div className="pagination"><button aria-label="Previous page"><ChevronLeft size={17} /></button><button className="current-page">1</button><button>2</button><button>3</button><span>...</span><button>12</button><button aria-label="Next page"><ChevronRight size={17} /></button></div></div></main><section className="promise"><div className="promise-content"><p className="eyebrow light">The Anara promise</p><h2>More than a car.<br /><em>A better way forward.</em></h2><p>From the first conversation to the moment you drive away, our world is built around making the extraordinary feel simple.</p><button className="text-button" onClick={() => onNavigate('about')}>Discover our story <ArrowRight size={16} /></button></div><div className="promise-image"><img src="https://images.pexels.com/photos/29566879/pexels-photo-29566879.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Luxury cars in a showroom" /></div></section>
  </>;
}

function About({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return <main className="page-main about-page"><section className="page-hero"><p className="eyebrow">Who we are</p><h1>A quieter kind<br />of <em>confidence.</em></h1><p>We believe the right car does more than take you somewhere. It changes the way you arrive.</p></section><section className="about-story"><div className="about-image"><img src="https://images.pexels.com/photos/15513826/pexels-photo-15513826.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Car inside a bright showroom" /></div><div className="about-copy"><p className="eyebrow">Our approach</p><h2>Chosen with care.<br /><em>Kept without compromise.</em></h2><p>Anara Motors began with a simple idea: buying a remarkable pre-owned car should feel as remarkable as owning one. Today, we bring together a rotating collection of beautifully maintained vehicles for people who care about the details.</p><p>Our team looks beyond the badge. We look at provenance, condition, character, and the small things that tell you a car has been truly loved.</p><button className="outline-button" onClick={() => onNavigate('home')}>View the collection <ArrowRight size={16} /></button></div></section><section className="values"><div><ShieldCheck size={25} /><p className="eyebrow">01</p><h3>Thoroughly considered</h3><p>Every car is inspected, verified, and prepared by people who know what to look for.</p></div><div><Sparkles size={25} /><p className="eyebrow">02</p><h3>Remarkably personal</h3><p>No pressure, no performance. Just thoughtful guidance tailored to your next chapter.</p></div><div><CalendarDays size={25} /><p className="eyebrow">03</p><h3>Made to last</h3><p>Our standard of care continues long after you leave our showroom.</p></div></section></main>;
}

function Journal() {
  return <main className="page-main journal-page"><section className="page-hero journal-hero"><p className="eyebrow">The Anara journal</p><h1>Notes on the road<br /><em>less travelled.</em></h1><p>Stories, ideas, and considered advice for a life in motion.</p></section><section className="journal-grid">{journalPosts.map((post) => <article className="journal-card" key={post.title}><div className="journal-image"><img src={post.image} alt={post.title} /></div><div className="journal-copy"><p className="eyebrow">{post.category}</p><h2>{post.title}</h2><div><span>{post.date}</span><ArrowRight size={17} /></div></div></article>)}</section><section className="newsletter"><p className="eyebrow">Stay in the know</p><h2>Good things, delivered<br /><em>occasionally.</em></h2><div className="email-form"><input placeholder="Your email address" type="email" /><button className="primary-button">Subscribe <ArrowRight size={16} /></button></div></section></main>;
}

function App() {
  const [page, setPage] = useState<Page>('home');
  const navigate = (nextPage: Page) => setPage(nextPage);
  return <div className="app-shell"><Header page={page} onNavigate={navigate} />{page === 'home' && <Home onNavigate={navigate} />}{page === 'about' && <About onNavigate={navigate} />}{page === 'journal' && <Journal />}<footer className="site-footer"><Logo /><p>Exceptional cars for the road ahead.</p><div><button onClick={() => navigate('home')}>Inventory</button><button onClick={() => navigate('about')}>About</button><button onClick={() => navigate('journal')}>Journal</button></div><span>© 2024 Anara Motors</span></footer></div>;
}

export default App;
