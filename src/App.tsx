import { useEffect, useMemo, useRef, useState } from 'react';
import { Asterisk, ArrowDown, ArrowRight, ArrowUpRight, Bookmark, Check, ChevronDown, ChevronRight, Clock3, Coffee, Cookie, Dumbbell, Heart, IceCreamCone, Leaf, Search, SlidersHorizontal, Sparkles, Star, X, Zap } from 'lucide-react';
import { recipes, type Recipe } from './data/recipes';
import { emptyFilters, filterRecipes, type Filters } from './lib/search';
import RecipeDetail from './components/RecipeDetail';

type Page = 'discover' | 'browse' | 'categories' | 'saved';
const categories = [
  { name: 'All recipes', icon: IceCreamCone, color: 'lavender', text: 'A flavour for every feeling' },
  { name: 'High Protein', icon: Dumbbell, color: 'pink', text: 'A little extra goodness' },
  { name: 'Low Calorie', icon: Leaf, color: 'green', text: 'Light, lovely, and full of flavour' },
  { name: 'Chocolate', icon: Cookie, color: 'brown', text: 'For the chocolate lovers' },
  { name: 'Fruit', icon: Sparkles, color: 'peach', text: 'Fresh, bright, and naturally sweet' },
  { name: 'Dairy Free', icon: Leaf, color: 'yellow', text: 'All the creaminess, plant based' },
  { name: 'Vanilla', icon: IceCreamCone, color: 'yellow', text: 'The classics never get old' },
  { name: 'Caramel', icon: Sparkles, color: 'peach', text: 'Golden, buttery goodness' },
  { name: 'Coffee', icon: Coffee, color: 'brown', text: 'Your favourite pick-me-up' },
  { name: 'Nut flavours', icon: Cookie, color: 'green', text: 'A deliciously nutty little moment' },
  { name: 'Classic', icon: IceCreamCone, color: 'pink', text: 'Properly indulgent scoops' },
  { name: 'Simple', icon: Zap, color: 'lavender', text: 'Less prep. More happiness.' },
];

function readSaved(): string[] {
  try { const value = JSON.parse(localStorage.getItem('creami-saved') || '[]'); return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []; } catch { return []; }
}

function RecipeCard({ recipe, saved, onSave, onOpen }: { recipe: Recipe; saved: boolean; onSave: (id: string) => void; onOpen: (r: Recipe) => void }) {
  const protein = recipe.category.toLowerCase() === 'high protein' || recipe.tags.some(tag => tag.toLowerCase() === 'high protein');
  return <article className="recipe-card">
    <div className="card-photo">
      <button className="photo-open" onClick={() => onOpen(recipe)} aria-label={`View ${recipe.name}`}><img src={recipe.image} alt={recipe.name} loading="lazy" /></button>
      <span className={`photo-tag ${protein ? 'protein-tag' : ''}`}>{protein ? <Dumbbell size={12} /> : <IceCreamCone size={12} />}{protein ? 'HIGH PROTEIN' : recipe.category.toLowerCase() === 'low calorie' ? 'LIGHT & LOVELY' : recipe.category.toUpperCase()}</span>
      <button className={`save-button ${saved ? 'is-saved' : ''}`} onClick={() => onSave(recipe.id)} aria-label={`${saved ? 'Unsave' : 'Save'} ${recipe.name}`} aria-pressed={saved}><Heart size={18} fill={saved ? 'currentColor' : 'none'} /></button>
      <span className="card-rating"><Star size={11} fill="currentColor" />{recipe.rating.toFixed(1)}</span>
    </div>
    <div className="card-content">
      <div className="card-topline"><span>{recipe.difficulty} · {recipe.prepTime} min prep</span><span className="per-pint">Per pint</span></div>
      <button className="card-title" onClick={() => onOpen(recipe)}>{recipe.name}</button>
      <p>{recipe.description}</p>
      <div className="card-macros"><span><strong>{Math.round(recipe.calories)}</strong> kcal</span><span className="macro-protein"><strong>{recipe.protein}g</strong> protein</span><span><strong>{recipe.carbs}g</strong> carbs</span><span><strong>{recipe.fat}g</strong> fat</span></div>
      <div className="card-bottom"><span className="card-category">{recipe.tags.find(t => !['high protein', 'low calorie'].includes(t.toLowerCase())) || recipe.category}</span><button onClick={() => onOpen(recipe)} aria-label={`Open ${recipe.name}`}><ArrowUpRight size={18} /></button></div>
    </div>
  </article>;
}

export default function App() {
  const [page, setPage] = useState<Page>('discover');
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All recipes');
  const [filters, setFilters] = useState<Filters>({ ...emptyFilters });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState('popular');
  const [saved, setSaved] = useState<string[]>(readSaved);
  const [opened, setOpened] = useState<Recipe | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [toast, setToast] = useState('');
  const [guideOpen, setGuideOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const collectionRef = useRef<HTMLElement>(null);
  const guideCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { try { localStorage.setItem('creami-saved', JSON.stringify(saved)); } catch { /* Saving remains usable for this session. */ } }, [saved]);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 2400); return () => window.clearTimeout(timer); }, [toast]);
  useEffect(() => {
    if (!guideOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    guideCloseRef.current?.focus();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setGuideOpen(false); if (e.key === 'Tab') { e.preventDefault(); guideCloseRef.current?.focus(); } };
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = oldOverflow; document.removeEventListener('keydown', key); previous?.focus(); };
  }, [guideOpen]);

  const toggleSave = (id: string) => { const exists = saved.includes(id); setSaved(prev => exists ? prev.filter(v => v !== id) : [...prev, id]); setToast(exists ? 'Removed from your recipe box' : 'A little happiness, saved to your recipe box'); };
  const navigate = (target: Page, category = 'All recipes') => {
    setPage(target); setActiveCategory(category); setQuery(''); setFilters({ ...emptyFilters }); setShowAll(false); setFiltersOpen(false); setSort('popular'); window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const selectCategory = (category: string) => { setActiveCategory(category); setShowAll(false); if (page === 'categories') { setPage('browse'); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const effectiveFilters = { ...filters, type: filters.type || (activeCategory === 'All recipes' ? '' : activeCategory) };
  const matching = useMemo(() => {
    let list = filterRecipes(page === 'saved' ? recipes.filter(r => saved.includes(r.id)) : recipes, query, effectiveFilters);
    if (sort === 'calories') list = [...list].sort((a, b) => a.calories - b.calories);
    else if (sort === 'protein') list = [...list].sort((a, b) => b.protein - a.protein);
    else if (sort === 'newest') list = [...list].sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    else list = [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || b.rating - a.rating);
    return list;
  }, [page, saved, query, effectiveFilters.maxCalories, effectiveFilters.minProtein, effectiveFilters.type, effectiveFilters.mode, effectiveFilters.difficulty, sort]);
  const hasFilters = Object.values(filters).some(Boolean);
  const defaultDiscover = page === 'discover' && !query && activeCategory === 'All recipes' && !hasFilters;
  const displayed = showAll || page === 'browse' || page === 'saved' ? matching : matching.slice(0, 8);
  const heroRecipe = recipes.find(r => r.slug === 'strawberry-cheesecake') || recipes[0];

  const renderGrid = (list: Recipe[]) => <div className="recipe-grid">{list.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} saved={saved.includes(recipe.id)} onSave={toggleSave} onOpen={setOpened} />)}</div>;
  const updateFilter = (key: keyof Filters, value: string) => { setFilters(prev => ({ ...prev, [key]: value })); setShowAll(false); };

  return <>
    <header className="site-header"><div className="header-inner">
      <button className="brand" onClick={() => navigate('discover')} aria-label="Creami Club home"><span className="brand-icon"><IceCreamCone size={30} strokeWidth={1.5} /></span><span>Creami <em>Club</em><Asterisk className="brand-star" size={17} /></span></button>
      <nav className="desktop-nav" aria-label="Main navigation">
        <button className={page === 'discover' && activeCategory === 'All recipes' ? 'active' : ''} onClick={() => navigate('discover')}>Discover</button>
        <button className={activeCategory === 'High Protein' ? 'active' : ''} onClick={() => navigate('browse', 'High Protein')}>High Protein</button>
        <button className={activeCategory === 'Low Calorie' ? 'active' : ''} onClick={() => navigate('browse', 'Low Calorie')}>Low Calorie</button>
        <button className={page === 'categories' ? 'active' : ''} onClick={() => navigate('categories')}>Categories<ChevronDown size={13} /></button>
      </nav>
      <div className="header-actions"><button className="header-search" aria-label="Search recipes" onClick={() => { if (page === 'categories') setPage('browse'); window.scrollTo({ top: 0, behavior: 'smooth' }); window.setTimeout(() => searchRef.current?.focus(), 100); }}><Search size={20} /></button><button className={`saved-nav ${page === 'saved' ? 'active' : ''}`} onClick={() => navigate('saved')}><Heart size={16} /><span>Saved recipes</span>{saved.length > 0 && <span className="saved-count">{saved.length}</span>}</button></div>
    </div></header>

    <main>
      {page === 'discover' && <section className="hero container">
        <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" />HAPPINESS, BY THE PINT</div><h1>Find your<br />next <em>Creami.</em><span className="heading-spark"><Asterisk size={59} strokeWidth={1.5} /></span></h1><p>Your next favourite flavour is just a spin away.<br className="desktop-break" /> Feel-good recipes for every kind of craving.</p>
          <form className="search-box" onSubmit={e => { e.preventDefault(); collectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}><Search size={20} /><input ref={searchRef} value={query} onChange={e => { setQuery(e.target.value); setShowAll(false); }} aria-label="Search flavours, ingredients or recipes" placeholder="Search flavours, ingredients or recipes…" />{query ? <button type="button" className="clear-search" aria-label="Clear search" onClick={() => setQuery('')}><X size={16} /></button> : <button className="search-submit" aria-label="See recipes" type="submit"><ArrowRight size={20} /></button>}</form>
          <div className="try-search"><span>A little inspiration:</span>{['Strawberry', 'High protein', 'Under 300 calories'].map(term => <button key={term} onClick={() => { setQuery(term); collectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>{term}</button>)}</div>
          <div className="hero-proof"><div className="mini-scoops"><img src="/images/strawberry.jpg" alt="" /><img src="/images/chocolate.jpg" alt="" /><img src="/images/pistachio.jpg" alt="" /></div><span><strong>50 recipes. Endless possibilities.</strong><br />Made for your Creami. Loved by your taste buds.</span></div>
        </div>
        <div className="hero-visual"><div className="hero-doodle doodle-one"><Asterisk size={40} strokeWidth={1.5} /></div><div className="hero-image-wrap"><img className="hero-image" src="/images/hero.jpg" alt="Creamy ice cream scoops with pistachios, ready to enjoy" /><div className="hero-image-shade" /><span className="hero-photo-label"><Sparkles size={14} /> A scoop of something good</span></div><span className="handwritten">your daily dose<br />of delicious <span>↙</span></span><button className="hero-feature" onClick={() => setOpened(heroRecipe)}><span className="hero-feature-icon"><IceCreamCone size={25} /></span><span><span className="feature-overline">MEET YOUR NEW FAVOURITE</span><strong>{heroRecipe.name}</strong><span className="feature-meta"><Star size={11} fill="currentColor" />{heroRecipe.rating.toFixed(1)}<span>·</span>{Math.round(heroRecipe.calories)} kcal<span>·</span>{heroRecipe.protein}g protein</span></span><span className="feature-arrow"><ArrowUpRight size={20} /></span></button><div className="hero-doodle doodle-two">✧</div></div>
      </section>}

      {page !== 'discover' && <section className="page-intro container"><div className="eyebrow"><span className="eyebrow-line" />{page === 'saved' ? 'YOUR PERSONAL LITTLE COLLECTION' : page === 'categories' ? 'FOLLOW YOUR CRAVING' : 'GOODNESS IN EVERY SCOOP'}</div><h1>{page === 'saved' ? <>Your recipe <em>box.</em></> : page === 'categories' ? <>So many ways to <em>scoop.</em></> : activeCategory === 'All recipes' ? <>Find your <em>favourite.</em></> : <>{activeCategory}<em> favourites.</em></>}</h1><p>{page === 'saved' ? 'All the recipes you love, right where you left them.' : page === 'categories' ? 'A classic comfort or a brand-new craving. There’s a Creami for that.' : categories.find(c => c.name === activeCategory)?.text || 'Explore our full collection of delicious Ninja Creami recipes.'}</p>{page !== 'categories' && <div className="browse-search"><Search size={19} /><input ref={searchRef} value={query} onChange={e => setQuery(e.target.value)} aria-label="Search recipes" placeholder="Search flavours, ingredients or recipes…" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={17} /></button>}</div>}</section>}

      {page === 'categories' ? <section className="category-grid container">{categories.slice(1).map(({ name, icon: Icon, color, text }) => <button key={name} className={`category-tile ${color}`} onClick={() => selectCategory(name)}><span className="tile-icon"><Icon size={30} strokeWidth={1.5} /></span><h2>{name}</h2><p>{text}</p><span>{filterRecipes(recipes, '', { ...emptyFilters, type: name }).length} recipes<ArrowUpRight size={20} /></span></button>)}</section> : <>
        <section className="flavour-strip container" aria-label="Recipe categories"><div className="flavour-label">WHAT ARE YOU<br />CRAVING?</div><div className="category-chips">{categories.slice(0, 6).map(({ name, icon: Icon, color }) => <button key={name} onClick={() => selectCategory(name)} className={`category-chip ${activeCategory === name ? 'selected' : ''}`} aria-pressed={activeCategory === name}><span className={`chip-icon ${color}`}><Icon size={18} strokeWidth={1.7} /></span>{name}</button>)}</div><button className="all-categories" onClick={() => navigate('categories')} aria-label="See all categories"><ArrowRight size={21} /></button></section>
        <section className="collection container" ref={collectionRef}>
          <div className="section-heading"><div><div className="section-eyebrow">{page === 'saved' ? 'KEEP THE GOOD ONES CLOSE' : query ? 'A LITTLE SOMETHING FOR YOUR CRAVING' : defaultDiscover ? 'THE ONES YOU’LL COME BACK TO' : 'YOUR NEXT FAVOURITE IS IN HERE'}</div><h2>{page === 'saved' ? 'Saved with love' : query ? 'Your search results' : defaultDiscover ? 'A few crowd favourites' : activeCategory === 'All recipes' ? 'Explore the recipe collection' : `${activeCategory} favourites`}<span className="recipe-count">{matching.length} recipes</span></h2></div><div className="collection-actions"><button className={`filter-toggle ${filtersOpen || hasFilters ? 'active' : ''}`} onClick={() => setFiltersOpen(v => !v)} aria-expanded={filtersOpen} aria-controls="recipe-filters"><SlidersHorizontal size={15} />Filters{hasFilters && <span className="filter-dot" />}</button><div className="sort-control"><label htmlFor="sort-order">Sort:</label><select id="sort-order" value={sort} onChange={e => setSort(e.target.value)}><option value="popular">Most loved</option><option value="newest">Newest first</option><option value="calories">Lowest calories</option><option value="protein">Highest protein</option></select><ChevronDown size={12} /></div></div></div>
          {filtersOpen && <div className="filter-panel" id="recipe-filters">
            {[{ key: 'maxCalories' as const, label: 'Calories per pint', options: [['', 'Any calories'], ['250', 'Under 250 kcal'], ['300', 'Under 300 kcal'], ['350', 'Under 350 kcal'], ['400', 'Under 400 kcal'], ['500', 'Under 500 kcal']] }, { key: 'minProtein' as const, label: 'Protein per pint', options: [['', 'Any protein'], ['20', '20g+'], ['30', '30g+'], ['40', '40g+'], ['50', '50g+']] }, { key: 'type' as const, label: 'Recipe type', options: [['', 'Current category'], ...categories.slice(1).map(c => [c.name, c.name])] }, { key: 'mode' as const, label: 'Creami mode', options: [['', 'Any mode'], ...['Ice Cream', 'Lite Ice Cream', 'Sorbet', 'Frozen Yoghurt', 'Milkshake', 'Gelato'].map(v => [v, v])] }, { key: 'difficulty' as const, label: 'Difficulty', options: [['', 'Any difficulty'], ...['Easy', 'Medium', 'Advanced'].map(v => [v, v])] }].map(({ key, label, options }) => <label key={key}>{label}<select value={filters[key]} onChange={e => updateFilter(key, e.target.value)}>{options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>)}<button className="reset-filters" onClick={() => { setFilters({ ...emptyFilters }); setActiveCategory('All recipes'); setQuery(''); }}><X size={14} />Reset</button>
          </div>}
          {matching.length ? renderGrid(displayed) : <div className="empty-state"><IceCreamCone size={42} strokeWidth={1.3} /><h3>{page === 'saved' && !saved.length ? 'Your next favourite belongs here.' : 'No scoops found. Yet.'}</h3><p>{page === 'saved' && !saved.length ? 'Tap the heart on a recipe to keep it in your personal recipe box.' : 'Try another flavour or loosen a filter to find something delicious.'}</p><button onClick={() => { setFilters({ ...emptyFilters }); setQuery(''); setActiveCategory('All recipes'); if (page === 'saved' && !saved.length) navigate('discover'); }}>{page === 'saved' && !saved.length ? 'Discover recipes' : 'Clear search & filters'}<ArrowRight size={16} /></button></div>}
          {!showAll && matching.length > displayed.length && <div className="view-all"><button onClick={() => setShowAll(true)}>Explore all {matching.length} recipes<ArrowRight size={17} /></button><span>There’s always room for another flavour.</span></div>}
        </section>
        {defaultDiscover && <>
          <section className="protein-banner container"><div className="banner-doodle"><Asterisk size={70} strokeWidth={1.5} /></div><div><div className="eyebrow"><Dumbbell size={15} />GOOD FOR YOUR GOALS. GREAT FOR YOUR SOUL.</div><h2>Big on flavour.<br /><em>Bigger on protein.</em></h2><p>Your post-workout treat just got a delicious upgrade.</p><button onClick={() => navigate('browse', 'High Protein')}>Find your protein fix<ArrowUpRight size={17} /></button></div><div className="protein-banner-photo"><img src="/images/chocolate.jpg" alt="Rich chocolate ice cream" loading="lazy" /><span><Dumbbell size={16} /><strong>30g+</strong> protein per pint</span></div></section>
          <section className="mini-collection container"><div className="section-heading"><div><div className="section-eyebrow">LIGHT ON CALORIES. HEAVY ON JOY.</div><h2>Little calories, lovely scoops</h2></div><button className="text-link" onClick={() => navigate('browse', 'Low Calorie')}>View collection<ArrowRight size={16} /></button></div>{renderGrid(filterRecipes(recipes, '', { ...emptyFilters, type: 'Low Calorie' }).slice(0, 4))}</section>
          <section className="mini-collection container"><div className="section-heading"><div><div className="section-eyebrow">FRESH OUT OF THE FREEZER</div><h2>New to the club</h2></div><button className="text-link" onClick={() => { navigate('browse'); setSort('newest'); }}>See what’s new<ArrowRight size={16} /></button></div>{renderGrid([...recipes].sort((a, b) => b.addedAt.localeCompare(a.addedAt)).slice(0, 4))}</section>
          <section className="guide-banner container"><span className="guide-icon"><IceCreamCone size={35} strokeWidth={1.2} /></span><div><span className="section-eyebrow">NEW TO THE CREAMI CLUB?</span><h2>Your first pint starts here.</h2><p>A few simple tips for your smoothest scoop yet.</p></div><button onClick={() => setGuideOpen(true)}>The Creami basics<ArrowUpRight size={18} /></button></section>
        </>}
      </>}
    </main>

    <footer className="site-footer container"><div><button className="brand footer-brand" onClick={() => navigate('discover')}><IceCreamCone size={26} strokeWidth={1.5} /><span>Creami <em>Club</em></span></button><p>A little scoop of happiness.</p></div><div className="footer-note">Made for your cravings, and your Creami.<br />Independent recipe inspiration. Not affiliated with Ninja.<br />Nutrition is estimated per pint; brands and substitutions vary.</div><button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to the top<ArrowDown size={14} style={{ transform: 'rotate(180deg)' }} /></button></footer>
    <nav className="mobile-nav" aria-label="Mobile navigation"><button className={page === 'discover' ? 'active' : ''} onClick={() => navigate('discover')}><IceCreamCone size={21} />Discover</button><button onClick={() => { navigate('browse'); window.setTimeout(() => searchRef.current?.focus(), 100); }}><Search size={21} />Search</button><button className={page === 'saved' ? 'active' : ''} onClick={() => navigate('saved')}><Heart size={21} />Saved{saved.length > 0 && <span>{saved.length}</span>}</button><button className={page === 'categories' ? 'active' : ''} onClick={() => navigate('categories')}><Bookmark size={21} />Categories</button></nav>
    {opened && <RecipeDetail recipe={opened} onClose={() => setOpened(null)} saved={saved.includes(opened.id)} onToggleSave={toggleSave} />}
    {toast && <div className="toast" role="status"><Check size={17} />{toast}</div>}
    {guideOpen && <div className="guide-overlay" onClick={e => { if (e.target === e.currentTarget) setGuideOpen(false); }}><section className="guide-modal" role="dialog" aria-modal="true" aria-labelledby="guide-title"><button className="guide-close" ref={guideCloseRef} onClick={() => setGuideOpen(false)} aria-label="Close guide"><X size={21} /></button><IceCreamCone size={38} color="#7763bd" /><div className="eyebrow">A FEW SIMPLE THINGS</div><h2 id="guide-title">A happier first pint.</h2><ol><li><strong>Make a smooth base.</strong> Blend the recipe ingredients until smooth. Check that your recipe fits your pint size.</li><li><strong>Leave a little room.</strong> Keep the mixture below your container’s MAX FILL line.</li><li><strong>Freeze flat for 24 hours.</strong> Place the pint on a level surface. Process a flat, evenly frozen base according to your machine’s manual.</li><li><strong>Pick the recipe’s mode.</strong> Use the mode shown on each recipe. Never process loose solid ice cubes.</li><li><strong>A little re-spin magic.</strong> If a lite or protein base looks crumbly, add 1–2 tablespoons of milk and select Re-Spin.</li><li><strong>Make it your own.</strong> Add mix-ins after the first spin using the Mix-In program. Enjoy right away.</li></ol><p>Always follow the instructions for your particular Ninja Creami model.</p></section></div>}
  </>;
}
