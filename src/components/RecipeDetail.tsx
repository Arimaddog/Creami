import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Check, CheckCheck, Clock3, Heart, Minus, Plus, Snowflake, Sparkles, Star, X } from 'lucide-react';
import type { Recipe } from '../data/recipes';
import './recipe-detail.css';

interface RecipeDetailProps {
  recipe: Recipe;
  onClose: () => void;
  saved: boolean;
  onToggleSave: (id: string) => void;
}

function readRatings(): Record<string, number> {
  try {
    const value = JSON.parse(localStorage.getItem('creami-ratings') || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch { return {}; }
}

function readMade(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem('creami-made') || '[]');
    if (Array.isArray(value)) return value.filter((id) => typeof id === 'string');
    return value && typeof value === 'object' ? Object.keys(value).filter((id) => value[id]) : [];
  } catch { return []; }
}

function measurement(amount: number, unit: string) {
  const fractionalUnits = ['tsp', 'tbsp', 'scoop', 'scoops', 'banana', 'bananas', 'cup', 'cups', 'pinch', 'pinches'];
  const fractions: Record<number, string> = { 0.25: '¼', 0.5: '½', 0.75: '¾' };
  if (fractionalUnits.includes(unit.toLowerCase())) {
    const whole = Math.floor(amount);
    const fraction = Math.round((amount - whole) * 100) / 100;
    if (fractions[fraction]) return `${whole ? whole : ''}${fractions[fraction]} ${unit}`.trim();
  }
  const rounded = Math.round(amount * 100) / 100;
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')} ${unit}`.trim();
}

export default function RecipeDetail({ recipe, onClose, saved, onToggleSave }: RecipeDetailProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [servings, setServings] = useState(recipe.servings);
  const [pintSize, setPintSize] = useState<470 | 710>(470);
  const [perServing, setPerServing] = useState(false);
  const [substitutions, setSubstitutions] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [personalRating, setPersonalRating] = useState<number>(() => readRatings()[recipe.id] || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [madeThis, setMadeThis] = useState(() => readMade().includes(recipe.id));
  const [storageMessage, setStorageMessage] = useState('');
  const scale = (servings / recipe.servings) * (pintSize === 710 ? 1.5 : 1);
  const nutritionScale = perServing ? scale / servings : scale;
  const hasSubstitutions = Object.keys(substitutions).length > 0;
  const checkedCount = Object.values(checked).filter(Boolean).length;

  useEffect(() => {
    setServings(recipe.servings);
    setPintSize(470);
    setPerServing(false);
    setSubstitutions({});
    setChecked({});
    setPersonalRating(readRatings()[recipe.id] || 0);
    setMadeThis(readMade().includes(recipe.id));
    setStorageMessage('');
  }, [recipe.id, recipe.servings]);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => closeRef.current?.focus());
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const elements = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
      )).filter((element) => element.getClientRects().length > 0);
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first) { event.preventDefault(); dialogRef.current.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || !dialogRef.current.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);

  function rateRecipe(rating: number) {
    setPersonalRating(rating);
    setStorageMessage('');
    try { localStorage.setItem('creami-ratings', JSON.stringify({ ...readRatings(), [recipe.id]: rating })); }
    catch { setStorageMessage('Your rating is saved for this visit. Browser storage is unavailable.'); }
  }

  function toggleMade() {
    const next = !madeThis;
    setMadeThis(next);
    setStorageMessage('');
    try {
      const current = readMade().filter((id) => id !== recipe.id);
      localStorage.setItem('creami-made', JSON.stringify(next ? [...current, recipe.id] : current));
    } catch { setStorageMessage('Your choice is saved for this visit. Browser storage is unavailable.'); }
  }

  return createPortal(
    <div className="recipe-detail-backdrop" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="recipe-detail" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} tabIndex={-1} ref={dialogRef}>
        <button className="recipe-detail-close" aria-label="Close recipe" onClick={onClose} ref={closeRef}><X size={21} /></button>
        <div className="recipe-detail-hero">
          <div className="recipe-detail-photo-wrap">
            <img className="recipe-detail-photo" src={recipe.image} alt={recipe.name} />
            <span className="recipe-detail-photo-label"><Sparkles size={14} /> Your next scoop of happiness</span>
          </div>
          <div className="recipe-detail-intro">
            <div className="recipe-detail-eyebrow">THE RECIPE COLLECTION</div>
            <div className="recipe-detail-tags">{recipe.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
            <h2 id={titleId}>{recipe.name}</h2>
            <p id={descriptionId} className="recipe-detail-description">{recipe.description}</p>
            <div className="recipe-detail-rating-line"><Star size={16} fill="currentColor" /><strong>{recipe.rating.toFixed(1)}</strong><span>Recipe rating</span><span className="recipe-detail-dot">·</span><span>{recipe.difficulty}</span></div>
            <div className="recipe-detail-times">
              <div><Clock3 size={19} /><span><strong>{recipe.prepTime} min</strong>Preparation</span></div>
              <div><Snowflake size={19} /><span><strong>{recipe.freezeTime === 0 ? 'No freezing' : `${recipe.freezeTime} hours`}</strong>Freeze time</span></div>
            </div>
            <div className="recipe-detail-hero-actions">
              <button className={`recipe-detail-save ${saved ? 'is-saved' : ''}`} onClick={() => onToggleSave(recipe.id)} aria-pressed={saved}><Heart size={17} fill={saved ? 'currentColor' : 'none'} />{saved ? 'Saved to favourites' : 'Save recipe'}</button>
              <button className={`recipe-detail-made ${madeThis ? 'is-made' : ''}`} onClick={toggleMade} aria-pressed={madeThis}>{madeThis ? <CheckCheck size={17} /> : <Check size={17} />}{madeThis ? 'Made this!' : 'I made this'}</button>
            </div>
          </div>
        </div>

        <div className="recipe-detail-content">
          <section className="recipe-detail-nutrition" aria-label="Estimated nutrition">
            <div className="recipe-detail-section-heading"><h3>A little scoop of the numbers</h3><div className="recipe-detail-nutrition-tabs" aria-label="Nutrition amount"><button className={!perServing ? 'is-active' : ''} onClick={() => setPerServing(false)} aria-pressed={!perServing}>Full batch</button><button className={perServing ? 'is-active' : ''} onClick={() => setPerServing(true)} aria-pressed={perServing}>Per serving</button></div></div>
            <div className="recipe-detail-macros">
              <div><span className="recipe-detail-macro-value">{Math.round(recipe.calories * nutritionScale)}</span><span>CALORIES</span><small>kcal</small></div>
              <div className="recipe-detail-protein"><span className="recipe-detail-macro-value">{Math.round(recipe.protein * nutritionScale * 10) / 10}<small>g</small></span><span>PROTEIN</span><small>The good stuff</small></div>
              <div><span className="recipe-detail-macro-value">{Math.round(recipe.carbs * nutritionScale * 10) / 10}<small>g</small></span><span>CARBS</span><small>Carbohydrates</small></div>
              <div><span className="recipe-detail-macro-value">{Math.round(recipe.fat * nutritionScale * 10) / 10}<small>g</small></span><span>FAT</span><small>Total fat</small></div>
            </div>
            <p className="recipe-detail-nutrition-note">{hasSubstitutions ? 'Nutrition reflects the original ingredients and has not been recalculated for your substitutions.' : 'Estimated from the ingredients. Your brands and any added re-spin milk may change the totals.'}</p>
          </section>

          <div className="recipe-detail-recipe-columns">
            <section className="recipe-detail-ingredients" aria-labelledby={`${titleId}-ingredients`}>
              <div className="recipe-detail-section-heading"><h3 id={`${titleId}-ingredients`}>What goes in</h3><span>{recipe.ingredients.length} ingredients</span></div>
              <div className="recipe-detail-size-controls">
                <label><span>PINT SIZE</span><select value={pintSize} onChange={(event) => setPintSize(Number(event.target.value) as 470 | 710)}><option value={470}>Standard · 470 ml</option><option value={710}>Deluxe · 710 ml</option></select></label>
                <div className="recipe-detail-serving-control"><span>SERVINGS</span><div><button disabled={servings <= 0.5} aria-label="Decrease servings by half" onClick={() => setServings((value) => Math.max(0.5, value - 0.5))}><Minus size={14} /></button><output aria-live="polite">{servings}</output><button disabled={servings >= 12} aria-label="Increase servings by half" onClick={() => setServings((value) => Math.min(12, value + 0.5))}><Plus size={14} /></button></div></div>
              </div>
              <p className="recipe-detail-scale-note">Base recipe: {recipe.servings} servings in a standard pint. Deluxe uses 1.5× ingredients. Split larger batches between pints and stay below MAX FILL.</p>
              <ul className="recipe-detail-ingredient-list">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient.id} className={checked[ingredient.id] ? 'is-checked' : ''}>
                    <div className="recipe-detail-ingredient-main"><button className="recipe-detail-ingredient-check" onClick={() => setChecked((value) => ({ ...value, [ingredient.id]: !value[ingredient.id] }))} aria-label={`${checked[ingredient.id] ? 'Uncheck' : 'Check'} ${substitutions[ingredient.id] || ingredient.name}`} aria-pressed={!!checked[ingredient.id]}>{checked[ingredient.id] && <Check size={12} />}</button><span className="recipe-detail-ingredient-name">{substitutions[ingredient.id] || ingredient.name}</span><strong>{substitutions[ingredient.id]?.toLowerCase().includes('equivalent sweetness') ? 'To taste' : measurement(ingredient.amount * scale, ingredient.unit)}</strong></div>
                    {ingredient.alternatives?.length ? <label className="recipe-detail-substitution"><span>Swap it</span><select aria-label={`Substitute ${ingredient.name}`} value={substitutions[ingredient.id] || ''} onChange={(event) => setSubstitutions((value) => { const next = { ...value }; if (event.target.value) next[ingredient.id] = event.target.value; else delete next[ingredient.id]; return next; })}><option value="">Original ingredient</option>{ingredient.alternatives.map((alternative) => <option key={alternative} value={alternative}>{alternative}</option>)}</select></label> : null}
                  </li>
                ))}
              </ul>
              {checkedCount > 0 && <button className="recipe-detail-reset" onClick={() => setChecked({})}>Clear ingredient checks ({checkedCount})</button>}
              {hasSubstitutions && <p className="recipe-detail-swap-note">Swaps can change sweetness, texture, and nutrition. Follow the product’s conversion guidance for concentrated sweeteners.</p>}
            </section>

            <section className="recipe-detail-instructions" aria-labelledby={`${titleId}-instructions`}>
              <div className="recipe-detail-section-heading"><h3 id={`${titleId}-instructions`}>Let’s make it</h3><span className="recipe-detail-mode"><Snowflake size={12} />{recipe.creamiMode}</span></div>
              <ol>{recipe.instructions.map((instruction, index) => <li key={`${recipe.id}-step-${index}`}><span className="recipe-detail-step-number">{String(index + 1).padStart(2, '0')}</span><p>{instruction}</p></li>)}</ol>
              <div className="recipe-detail-tip"><Sparkles size={19} /><div><strong>A little Creami magic</strong><p>{recipe.creamiMode.toLowerCase() === 'milkshake' ? 'For a thicker shake, start with less liquid. Add a little more milk after processing if you prefer a lighter sip.' : recipe.creamiMode.toLowerCase() === 'sorbet' ? 'Crumbly after the first spin? Add 1–2 tablespoons of water or juice and select Re-Spin for a smoother scoop.' : 'Crumbly after the first spin? Add 1–2 tablespoons of milk (or a dairy-free alternative) and select Re-Spin for that perfectly creamy texture.'}</p></div></div>
            </section>
          </div>

          <section className="recipe-detail-rate" aria-label="Rate this recipe">
            <div><h3>Was it love at first scoop?</h3><p>{personalRating ? `You rated this recipe ${personalRating} out of 5. Tap a star to change it.` : 'Made it? Leave your personal rating, saved on this device.'}</p></div>
            <div className="recipe-detail-stars" onMouseLeave={() => setHoverRating(0)}>{[1, 2, 3, 4, 5].map((rating) => <button key={rating} aria-label={`Rate ${rating} out of 5 stars`} aria-pressed={personalRating === rating} onMouseEnter={() => setHoverRating(rating)} onFocus={() => setHoverRating(rating)} onBlur={() => setHoverRating(0)} onClick={() => rateRecipe(rating)}><Star size={26} fill={rating <= (hoverRating || personalRating) ? 'currentColor' : 'none'} /></button>)}</div>
          </section>
          {storageMessage && <p className="recipe-detail-storage-message" role="status">{storageMessage}</p>}
          <footer className="recipe-detail-footer"><span>Good things come to those who freeze.</span><button onClick={onClose}>Back to discovering <ArrowRight size={16} /></button></footer>
        </div>
      </div>
    </div>,
    document.body,
  );
}
