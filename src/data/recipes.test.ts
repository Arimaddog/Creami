import { describe, expect, it } from 'vitest';
import { recipes } from './recipes';

describe('recipe catalogue', () => {
  it('contains 50 distinct complete recipes', () => {
    expect(recipes).toHaveLength(50);
    expect(new Set(recipes.map(recipe => recipe.id)).size).toBe(50);
    expect(new Set(recipes.map(recipe => recipe.name)).size).toBe(50);
    expect(new Set(recipes.map(recipe => recipe.ingredients.map(item => `${item.id}:${item.amount}`).join('|'))).size).toBe(50);
    for (const recipe of recipes) {
      expect(recipe.ingredients.length).toBeGreaterThanOrEqual(4);
      expect(recipe.instructions.length).toBeGreaterThanOrEqual(4);
      expect(recipe.instructions.join(' ')).toContain('MAX FILL');
      expect(recipe.freezeTime).toBe(recipe.creamiMode === 'Milkshake' ? 0 : 24);
      expect(recipe.servings).toBe(1);
      expect(recipe.prepTime).toBeGreaterThanOrEqual(5);
      expect(recipe.prepTime).toBeLessThanOrEqual(10);
    }
  });

  it('derives nutrition from listed ingredient quantities', () => {
    for (const recipe of recipes) {
      for (const nutrient of ['calories', 'protein', 'carbs', 'fat'] as const) {
        const expected = Math.round(recipe.ingredients.reduce((total, item) => total + item[nutrient], 0) * 10) / 10;
        expect(recipe[nutrient], `${recipe.name}: ${nutrient}`).toBe(expected);
        expect(recipe[nutrient]).toBeGreaterThanOrEqual(0);
      }
      for (const item of recipe.ingredients) {
        expect(item.amount).toBeGreaterThan(0);
        expect(item.name).not.toBe('');
      }
    }
  });

  it('keeps the high-protein collection within useful full-pint ranges', () => {
    const proteinRecipes = recipes.filter(recipe => recipe.category === 'High protein');
    expect(proteinRecipes.length).toBeGreaterThanOrEqual(10);
    for (const recipe of proteinRecipes) {
      expect(recipe.calories, recipe.name).toBeGreaterThanOrEqual(250);
      expect(recipe.calories, recipe.name).toBeLessThanOrEqual(450);
      expect(recipe.protein, recipe.name).toBeGreaterThanOrEqual(30);
      expect(recipe.protein, recipe.name).toBeLessThanOrEqual(50);
    }
  });

  it('uses distinct, appropriate workflows for milkshake and frozen-yoghurt programs', () => {
    const milkshake = recipes.find(recipe => recipe.creamiMode === 'Milkshake');
    expect(milkshake).toBeDefined();
    expect(milkshake?.freezeTime).toBe(0);
    expect(milkshake?.ingredients.some(item => item.id === 'vanillaIceCream')).toBe(true);
    expect(milkshake?.instructions.join(' ')).toContain('Do not freeze this assembled base or add hard ice cubes');
    const yoghurt = recipes.filter(recipe => recipe.creamiMode === 'Frozen Yoghurt');
    expect(yoghurt.length).toBeGreaterThanOrEqual(2);
    expect(yoghurt.every(recipe => recipe.freezeTime === 24 && recipe.instructions.join(' ').includes('use Lite Ice Cream'))).toBe(true);
  });
});
