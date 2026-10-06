import { describe, expect, it } from 'vitest';
import { recipes } from '../data/recipes';
import { emptyFilters, filterRecipes } from './search';

describe('recipe search', () => {
  it('preserves the entire catalogue for an empty search', () => {
    expect(filterRecipes(recipes, '', emptyFilters)).toEqual(recipes);
  });

  it('finds ingredient names and handles yogurt spelling', () => {
    const banana = filterRecipes(recipes, 'banana', emptyFilters);
    expect(banana.length).toBeGreaterThan(1);
    expect(banana.every(recipe => recipe.ingredients.some(item => /banana/i.test(item.name)))).toBe(true);
    const yoghurt = filterRecipes(recipes, 'Greek yoghurt', emptyFilters);
    expect(yoghurt.length).toBeGreaterThan(10);
    expect(filterRecipes(recipes, 'Greek yogurt', emptyFilters)).toEqual(yoghurt);
  });

  it('interprets numeric protein and calorie phrases', () => {
    const protein = filterRecipes(recipes, '40g protein', emptyFilters);
    expect(protein.length).toBeGreaterThan(5);
    expect(protein.every(recipe => recipe.protein >= 40)).toBe(true);
    const calories = filterRecipes(recipes, 'under 300 calories', emptyFilters);
    expect(calories.length).toBeGreaterThan(5);
    expect(calories.every(recipe => recipe.calories < 300)).toBe(true);
    const combined = filterRecipes(recipes, 'banana under 450 calories and 40g protein', emptyFilters);
    expect(combined.map(recipe => recipe.name)).toEqual(['Banana peanut butter']);
  });

  it('applies all dropdown filters together', () => {
    const result = filterRecipes(recipes, '', {
      maxCalories: '350', minProtein: '40', type: 'high-protein', mode: 'Lite Ice Cream', difficulty: 'Easy',
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every(recipe => recipe.calories < 350 && recipe.protein >= 40 && recipe.category === 'High protein' && recipe.creamiMode === 'Lite Ice Cream' && recipe.difficulty === 'Easy')).toBe(true);
  });

  it('includes dairy-free recipes with another primary category', () => {
    const result = filterRecipes(recipes, '', { ...emptyFilters, type: 'Dairy free' });
    expect(result.some(recipe => recipe.name === 'Coconut vanilla protein')).toBe(true);
    expect(result.some(recipe => recipe.name === 'Watermelon lime')).toBe(true);
    expect(result.every(recipe => recipe.tags.includes('Dairy free'))).toBe(true);
  });

  it('populates every displayed collection from recipe attributes', () => {
    const protein = filterRecipes(recipes, '', { ...emptyFilters, type: 'High Protein' });
    expect(protein.length).toBeGreaterThan(0);
    expect(protein.every(recipe => recipe.category === 'High protein')).toBe(true);

    const lowCalorie = filterRecipes(recipes, '', { ...emptyFilters, type: 'Low Calorie' });
    expect(lowCalorie.length).toBeGreaterThan(0);
    expect(lowCalorie.every(recipe => recipe.category === 'Low calorie' && recipe.calories < 300)).toBe(true);

    const dairyFree = filterRecipes(recipes, '', { ...emptyFilters, type: 'Dairy Free' });
    expect(dairyFree.length).toBeGreaterThan(0);
    expect(dairyFree.every(recipe => recipe.tags.includes('Dairy free'))).toBe(true);

    const nuts = filterRecipes(recipes, '', { ...emptyFilters, type: 'Nut flavours' });
    expect(nuts.length).toBeGreaterThan(0);
    expect(nuts.some(recipe => recipe.name === 'Pistachio dream')).toBe(true);
    expect(nuts.every(recipe => recipe.tags.includes('Nutty'))).toBe(true);

    const simple = filterRecipes(recipes, '', { ...emptyFilters, type: 'Simple' });
    expect(simple.length).toBeGreaterThan(0);
    expect(simple.some(recipe => recipe.name === 'Vanilla bean')).toBe(true);
    expect(simple.every(recipe => recipe.difficulty === 'Easy' && recipe.prepTime <= 5)).toBe(true);
  });

  it('distinguishes strict under thresholds from inclusive at-most queries', () => {
    const boundary = { ...recipes[0], calories: 300, protein: 40 };
    expect(filterRecipes([boundary], '', { ...emptyFilters, maxCalories: '300' })).toEqual([]);
    expect(filterRecipes([boundary], 'under 300 calories', emptyFilters)).toEqual([]);
    expect(filterRecipes([boundary], 'at most 300 calories', emptyFilters)).toEqual([boundary]);
    expect(filterRecipes([boundary], '40g protein', emptyFilters)).toEqual([boundary]);
    expect(filterRecipes([boundary], 'over 40g protein', emptyFilters)).toEqual([]);
  });

  it('supports explicit alternatives and returns zero for incompatible constraints', () => {
    const result = filterRecipes(recipes, 'banana or pistachio', emptyFilters);
    expect(result.some(recipe => recipe.name === 'Pistachio dream')).toBe(true);
    expect(result.some(recipe => recipe.name === 'Banana bread')).toBe(true);
    expect(filterRecipes(recipes, '', { ...emptyFilters, maxCalories: '100', minProtein: '50' })).toEqual([]);
  });
});
