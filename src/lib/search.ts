import type { Recipe } from '../data/recipes';

export interface Filters {
  maxCalories: string;
  minProtein: string;
  type: string;
  mode: string;
  difficulty: string;
}

export const emptyFilters: Filters = {
  maxCalories: '',
  minProtein: '',
  type: '',
  mode: '',
  difficulty: '',
};

function normalize(value: string): string {
  return value.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9.]+/g, ' ')
    .replace(/\byoghurt\b/g, 'yogurt')
    .replace(/\bstrawberries\b/g, 'strawberry')
    .replace(/\bblueberries\b/g, 'blueberry')
    .replace(/\braspberries\b/g, 'raspberry')
    .replace(/\bcherries\b/g, 'cherry')
    .replace(/\bchoc\b/g, 'chocolate')
    .replace(/\bpb\b/g, 'peanut butter')
    .replace(/\blow cal\b/g, 'low calorie')
    .trim().replace(/\s+/g, ' ');
}

function isUnfiltered(value: string): boolean {
  return ['', 'all', 'any', 'all types', 'all modes', 'any calories', 'any protein', 'any difficulty'].includes(normalize(value));
}

function threshold(value: string): number | undefined {
  if (isUnfiltered(value)) return undefined;
  const match = value.match(/\d+(?:\.\d+)?/);
  if (!match) return undefined;
  const number = Number(match[0]);
  return Number.isFinite(number) ? number : undefined;
}

function normalizeType(value: string): string {
  const normalized = normalize(value);
  const aliases: Record<string, string> = {
    protein: 'high protein', highprotein: 'high protein',
    lowcal: 'low calorie', lowcalorie: 'low calorie', 'low calories': 'low calorie',
    dairyfree: 'dairy free', 'dairy free': 'dairy free',
    nuts: 'nutty', nut: 'nutty', 'nut flavours': 'nutty', 'nut flavors': 'nutty',
  };
  return aliases[normalized] ?? normalized;
}

const stopWords = new Set(['a', 'an', 'and', 'of', 'the', 'with', 'for', 'recipe', 'recipes', 'pint', 'pints', 'please', 'me', 'show', 'find', 'some', 'ice', 'cream']);

type BoundKey = 'maxCalories' | 'minCalories' | 'minProtein' | 'maxProtein';
type Bound = { value: number; exclusive: boolean };
type QueryConstraints = { text: string; bounds: Partial<Record<BoundKey, Bound>> };

function parseQuery(query: string): QueryConstraints {
  const constraints: QueryConstraints = { text: query, bounds: {} };
  const isMaximum = (word: string) => /under|below|less than|at most|up to|maximum|max/i.test(word);
  const isMinimum = (word: string) => /at least|over|above|more than|minimum|min/i.test(word);
  const setBound = (nutrient: 'Calories' | 'Protein', amount: string, qualifier: string) => {
    const number = Number(amount);
    const key = `${isMaximum(qualifier) || (nutrient === 'Calories' && !isMinimum(qualifier)) ? 'max' : 'min'}${nutrient}` as BoundKey;
    const exclusive = /under|below|less than|over|above|more than/i.test(qualifier);
    const current = constraints.bounds[key];
    const stronger = current === undefined || (key.startsWith('max') ? number < current.value : number > current.value);
    if (stronger) constraints.bounds[key] = { value: number, exclusive };
    else if (number === current.value && exclusive) current.exclusive = true;
    return ' ';
  };
  const qualifier = '(at least|over|above|more than|minimum|min|at most|up to|under|below|less than|maximum|max)';
  constraints.text = constraints.text
    .replace(new RegExp(`\\b(?:${qualifier}\\s+)?(\\d+(?:\\.\\d+)?)\\s*(?:g|grams?)\\s*(?:of\\s+)?protein\\b`, 'gi'), (_match, bound: string | undefined, amount: string) => setBound('Protein', amount, bound ?? ''))
    .replace(new RegExp(`\\bprotein\\s+(?:${qualifier}\\s+)?(\\d+(?:\\.\\d+)?)\\s*(?:g|grams?)?\\b`, 'gi'), (_match, bound: string | undefined, amount: string) => setBound('Protein', amount, bound ?? ''))
    .replace(new RegExp(`\\b(?:${qualifier}\\s+)?(\\d+(?:\\.\\d+)?)\\s*(?:kcal|calories|calorie|cals|cal)\\b`, 'gi'), (_match, bound: string | undefined, amount: string) => setBound('Calories', amount, bound ?? ''))
    .replace(new RegExp(`\\b(?:kcal|calories|calorie|cals|cal)\\s+(?:${qualifier}\\s+)?(\\d+(?:\\.\\d+)?)\\b`, 'gi'), (_match, bound: string | undefined, amount: string) => setBound('Calories', amount, bound ?? ''));
  return constraints;
}

function satisfiesBound(value: number, bound: Bound | undefined, direction: 'min' | 'max'): boolean {
  if (!bound) return true;
  if (value === bound.value) return !bound.exclusive;
  return direction === 'max' ? value < bound.value : value > bound.value;
}

function matchesType(recipe: Recipe, type: string): boolean {
  if (type === 'simple') {
    return (recipe.difficulty === 'Easy' && recipe.prepTime <= 5) || recipe.tags.some(tag => normalizeType(tag) === 'simple');
  }
  return [recipe.category, ...recipe.tags].some(value => normalizeType(value) === type);
}

/**
 * Search names, ingredients and recipe attributes. Words are ANDed by default;
 * an explicit "or" allows alternatives. Numeric search phrases constrain the
 * actual calculated nutrition, e.g. "banana under 400 calories 40g protein".
 */
export function filterRecipes(all: Recipe[], query: string, filters: Filters): Recipe[] {
  const maxCalories = threshold(filters.maxCalories);
  const minProtein = threshold(filters.minProtein);
  const parsed = parseQuery(query);
  const wordsByAlternative = normalize(parsed.text).split(/\bor\b/).map(part => part.split(' ').filter(word => word && !stopWords.has(word))).filter(words => words.length > 0);
  const alternatives = wordsByAlternative.length > 0 ? wordsByAlternative : [[]];
  const type = normalizeType(filters.type);
  const mode = normalize(filters.mode);
  const difficulty = normalize(filters.difficulty);

  return all.filter(recipe => {
    // The calorie dropdown offers "Under" thresholds, so its bound is strict.
    if (maxCalories !== undefined && recipe.calories >= maxCalories) return false;
    if (minProtein !== undefined && recipe.protein < minProtein) return false;
    if (!satisfiesBound(recipe.calories, parsed.bounds.maxCalories, 'max')) return false;
    if (!satisfiesBound(recipe.calories, parsed.bounds.minCalories, 'min')) return false;
    if (!satisfiesBound(recipe.protein, parsed.bounds.minProtein, 'min')) return false;
    if (!satisfiesBound(recipe.protein, parsed.bounds.maxProtein, 'max')) return false;
    if (!isUnfiltered(filters.type) && !matchesType(recipe, type)) return false;
    if (!isUnfiltered(filters.mode) && normalize(recipe.creamiMode) !== mode) return false;
    if (!isUnfiltered(filters.difficulty) && normalize(recipe.difficulty) !== difficulty) return false;

    const searchable = normalize([
      recipe.name, recipe.description, recipe.category, recipe.creamiMode, recipe.difficulty,
      ...recipe.tags, ...recipe.ingredients.map(item => item.name),
    ].join(' '));
    return alternatives.some(words => words.every(word => searchable.includes(word)));
  });
}
