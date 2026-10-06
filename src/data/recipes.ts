export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  /** Estimated nutrition for the full amount listed, not per 100 g. */
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  alternatives?: string[];
}

export interface Recipe {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  creamiMode: string;
  prepTime: number;
  freezeTime: number;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  rating: number;
  addedAt: string;
  featured?: boolean;
}

type Food = {
  name: string;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  alternatives?: string[];
};

// Generic food-composition estimates per gram or millilitre. Brands vary;
// the app derives each full-pint estimate from the actual ingredient amounts.
const food = {
  skim: { name: 'Skim milk', unit: 'ml', calories: 0.35, protein: 0.034, carbs: 0.05, fat: 0.001, alternatives: ['Lactose-free skim milk', 'Unsweetened soy milk'] },
  whole: { name: 'Whole milk', unit: 'ml', calories: 0.61, protein: 0.032, carbs: 0.047, fat: 0.033, alternatives: ['Lactose-free whole milk'] },
  almond: { name: 'Unsweetened almond milk', unit: 'ml', calories: 0.13, protein: 0.004, carbs: 0.001, fat: 0.011, alternatives: ['Unsweetened soy milk', 'Unsweetened oat milk'] },
  soy: { name: 'Unsweetened soy milk', unit: 'ml', calories: 0.33, protein: 0.033, carbs: 0.007, fat: 0.018, alternatives: ['Pea milk'] },
  oat: { name: 'Oat milk', unit: 'ml', calories: 0.45, protein: 0.01, carbs: 0.067, fat: 0.016, alternatives: ['Unsweetened soy milk'] },
  coconut: { name: 'Unsweetened coconut milk beverage', unit: 'ml', calories: 0.2, protein: 0.002, carbs: 0.004, fat: 0.019, alternatives: ['Unsweetened almond milk'] },
  coconutCan: { name: 'Light canned coconut milk', unit: 'ml', calories: 0.75, protein: 0.007, carbs: 0.015, fat: 0.07 },
  cream: { name: 'Heavy cream', unit: 'ml', calories: 3.4, protein: 0.028, carbs: 0.03, fat: 0.36, alternatives: ['Whipping cream'] },
  vanillaIceCream: { name: 'Scoopable vanilla ice cream', unit: 'g', calories: 2.07, protein: 0.035, carbs: 0.236, fat: 0.11 },
  greek: { name: 'Plain nonfat Greek yoghurt', unit: 'g', calories: 0.59, protein: 0.103, carbs: 0.036, fat: 0.004, alternatives: ['Plain nonfat skyr', 'Lactose-free Greek yoghurt'] },
  coconutYoghurt: { name: 'Unsweetened coconut yoghurt', unit: 'g', calories: 0.96, protein: 0.008, carbs: 0.049, fat: 0.082, alternatives: ['Plain soy yoghurt'] },
  cottage: { name: 'Low-fat cottage cheese', unit: 'g', calories: 0.82, protein: 0.11, carbs: 0.04, fat: 0.027, alternatives: ['Plain Greek yoghurt'] },
  creamCheese: { name: 'Reduced-fat cream cheese', unit: 'g', calories: 2.25, protein: 0.06, carbs: 0.05, fat: 0.2 },
  whey: { name: 'Vanilla whey protein powder', unit: 'g', calories: 3.9, protein: 0.8, carbs: 0.07, fat: 0.04, alternatives: ['Unflavoured whey protein powder'] },
  plant: { name: 'Vanilla plant protein powder', unit: 'g', calories: 3.8, protein: 0.75, carbs: 0.09, fat: 0.06, alternatives: ['Unflavoured pea protein powder'] },
  sugar: { name: 'Caster sugar', unit: 'g', calories: 4, protein: 0, carbs: 1, fat: 0 },
  erythritol: { name: 'Erythritol sweetener', unit: 'g', calories: 0, protein: 0, carbs: 1, fat: 0, alternatives: ['An equivalent sweetness of stevia'] },
  maple: { name: 'Pure maple syrup', unit: 'g', calories: 2.6, protein: 0, carbs: 0.67, fat: 0 },
  honey: { name: 'Honey', unit: 'g', calories: 3.04, protein: 0.003, carbs: 0.824, fat: 0 },
  vanilla: { name: 'Vanilla extract', unit: 'ml', calories: 2.88, protein: 0, carbs: 0.126, fat: 0 },
  xanthan: { name: 'Xanthan gum', unit: 'g', calories: 2, protein: 0, carbs: 0.75, fat: 0 },
  pudding: { name: 'Sugar-free vanilla instant pudding powder', unit: 'g', calories: 3.3, protein: 0, carbs: 0.8, fat: 0 },
  banana: { name: 'Ripe banana', unit: 'g', calories: 0.89, protein: 0.011, carbs: 0.228, fat: 0.003 },
  strawberry: { name: 'Strawberries', unit: 'g', calories: 0.32, protein: 0.007, carbs: 0.077, fat: 0.003 },
  blueberry: { name: 'Blueberries', unit: 'g', calories: 0.57, protein: 0.007, carbs: 0.145, fat: 0.003 },
  raspberry: { name: 'Raspberries', unit: 'g', calories: 0.52, protein: 0.012, carbs: 0.119, fat: 0.006 },
  mango: { name: 'Ripe mango', unit: 'g', calories: 0.6, protein: 0.008, carbs: 0.15, fat: 0.004 },
  pineapple: { name: 'Pineapple in juice, drained', unit: 'g', calories: 0.6, protein: 0.004, carbs: 0.155, fat: 0.001 },
  peach: { name: 'Ripe peaches', unit: 'g', calories: 0.39, protein: 0.009, carbs: 0.095, fat: 0.003 },
  cherry: { name: 'Pitted cherries', unit: 'g', calories: 0.63, protein: 0.01, carbs: 0.16, fat: 0.002 },
  applesauce: { name: 'Unsweetened apple purée', unit: 'g', calories: 0.42, protein: 0.001, carbs: 0.114, fat: 0.001 },
  watermelon: { name: 'Seedless watermelon', unit: 'g', calories: 0.3, protein: 0.006, carbs: 0.076, fat: 0.002 },
  orange: { name: 'Fresh orange juice', unit: 'ml', calories: 0.45, protein: 0.007, carbs: 0.104, fat: 0.002 },
  lemon: { name: 'Lemon juice', unit: 'ml', calories: 0.22, protein: 0.003, carbs: 0.069, fat: 0.002 },
  lime: { name: 'Lime juice', unit: 'ml', calories: 0.25, protein: 0.004, carbs: 0.084, fat: 0.001 },
  cocoa: { name: 'Unsweetened cocoa powder', unit: 'g', calories: 2.28, protein: 0.2, carbs: 0.58, fat: 0.14 },
  darkChocolate: { name: 'Dark chocolate chips', unit: 'g', calories: 5.35, protein: 0.07, carbs: 0.59, fat: 0.3 },
  veganChocolate: { name: 'Dairy-free dark chocolate chips', unit: 'g', calories: 5.35, protein: 0.07, carbs: 0.59, fat: 0.3 },
  whiteChocolate: { name: 'White chocolate chips', unit: 'g', calories: 5.4, protein: 0.06, carbs: 0.59, fat: 0.32 },
  cookies: { name: 'Chocolate sandwich cookies', unit: 'g', calories: 4.8, protein: 0.05, carbs: 0.68, fat: 0.21 },
  graham: { name: 'Graham cracker crumbs', unit: 'g', calories: 4.3, protein: 0.07, carbs: 0.7, fat: 0.14 },
  biscoff: { name: 'Biscoff biscuits', unit: 'g', calories: 4.84, protein: 0.05, carbs: 0.72, fat: 0.19 },
  cereal: { name: 'Cinnamon breakfast cereal', unit: 'g', calories: 4.1, protein: 0.06, carbs: 0.84, fat: 0.06 },
  peanutButter: { name: 'Smooth peanut butter', unit: 'g', calories: 5.88, protein: 0.25, carbs: 0.2, fat: 0.5, alternatives: ['Smooth almond butter'] },
  almondButter: { name: 'Almond butter', unit: 'g', calories: 6.14, protein: 0.21, carbs: 0.19, fat: 0.55 },
  pistachio: { name: 'Unsalted shelled pistachios', unit: 'g', calories: 5.62, protein: 0.2, carbs: 0.28, fat: 0.45 },
  almondNuts: { name: 'Toasted almonds', unit: 'g', calories: 5.79, protein: 0.21, carbs: 0.22, fat: 0.5 },
  hazelnut: { name: 'Roasted hazelnuts', unit: 'g', calories: 6.28, protein: 0.15, carbs: 0.17, fat: 0.61 },
  pecan: { name: 'Toasted pecans', unit: 'g', calories: 6.91, protein: 0.09, carbs: 0.14, fat: 0.72 },
  walnut: { name: 'Chopped walnuts', unit: 'g', calories: 6.54, protein: 0.15, carbs: 0.14, fat: 0.65 },
  coconutFlakes: { name: 'Unsweetened coconut flakes', unit: 'g', calories: 6.6, protein: 0.07, carbs: 0.24, fat: 0.65 },
  caramel: { name: 'Caramel sauce', unit: 'g', calories: 2.9, protein: 0.01, carbs: 0.7, fat: 0.01 },
  dulce: { name: 'Dulce de leche', unit: 'g', calories: 3.15, protein: 0.06, carbs: 0.55, fat: 0.07 },
  jam: { name: 'Strawberry jam', unit: 'g', calories: 2.5, protein: 0.003, carbs: 0.65, fat: 0 },
  lemonCurd: { name: 'Lemon curd', unit: 'g', calories: 3.3, protein: 0.03, carbs: 0.48, fat: 0.15 },
  coffee: { name: 'Strong brewed espresso, cooled', unit: 'ml', calories: 0.02, protein: 0.001, carbs: 0, fat: 0 },
  matcha: { name: 'Matcha powder', unit: 'g', calories: 3.2, protein: 0.3, carbs: 0.38, fat: 0.05 },
  cinnamon: { name: 'Ground cinnamon', unit: 'g', calories: 2.47, protein: 0.04, carbs: 0.81, fat: 0.012 },
  cardamom: { name: 'Ground cardamom', unit: 'g', calories: 3.11, protein: 0.11, carbs: 0.68, fat: 0.067 },
  mint: { name: 'Peppermint extract', unit: 'ml', calories: 2, protein: 0, carbs: 0, fat: 0 },
  lavender: { name: 'Culinary dried lavender', unit: 'g', calories: 2, protein: 0, carbs: 0.4, fat: 0 },
  salt: { name: 'Fine sea salt', unit: 'g', calories: 0, protein: 0, carbs: 0, fat: 0 },
  water: { name: 'Water', unit: 'ml', calories: 0, protein: 0, carbs: 0, fat: 0 },
} satisfies Record<string, Food>;

type FoodKey = keyof typeof food;
const round = (number: number) => Math.round(number * 10) / 10;

function ingredient(key: FoodKey, amount: number, name?: string): Ingredient {
  const source: Food = food[key];
  return {
    id: key,
    name: name ?? source.name,
    amount,
    unit: source.unit,
    calories: round(source.calories * amount),
    protein: round(source.protein * amount),
    carbs: round(source.carbs * amount),
    fat: round(source.fat * amount),
    ...(source.alternatives ? { alternatives: [...source.alternatives] } : {}),
  };
}

const i = ingredient;
const proteinBase = (milk = 260, yoghurt = 100) => [i('skim', milk), i('greek', yoghurt), i('whey', 30), i('erythritol', 12), i('vanilla', 3), i('xanthan', 0.5)];
const classicBase = (milk = 280, cream = 45) => [i('whole', milk), i('cream', cream), i('sugar', 24), i('vanilla', 3)];
const lightBase = (milk = 290, yoghurt = 110) => [i('skim', milk), i('greek', yoghurt), i('erythritol', 15), i('vanilla', 3), i('xanthan', 0.5)];
const veganBase = (milk: FoodKey = 'oat', amount = 300) => [i(milk, amount), i('coconutYoghurt', 90), i('maple', 18), i('vanilla', 3), i('xanthan', 0.5)];

type RecipeInput = Pick<Recipe, 'name' | 'description' | 'category' | 'tags' | 'ingredients'> & {
  photo: string;
  mode?: string;
  mixins?: string;
  firstStep?: string;
  instructions?: string[];
  freezeTime?: number;
  difficulty?: Recipe['difficulty'];
  prep?: number;
  featured?: boolean;
};

function makeRecipe(input: RecipeInput, index: number): Recipe {
  const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const mode = input.mode ?? (input.category === 'High protein' || input.category === 'Low calorie' ? 'Lite Ice Cream' : 'Ice Cream');
  const instructions = [
    input.firstStep ?? `Blend ${input.mixins ? 'all base ingredients, reserving the mix-ins' : 'all ingredients'} until completely smooth and the sweetener has dissolved.`,
    'Pour into a compatible Creami pint. Keep the base below the MAX FILL line; reserve any excess separately. Cover and freeze on a level surface for 24 hours.',
    `Check the frozen surface is level and follow your machine’s instructions for loading the pint. Process on ${mode}.${mode === 'Frozen Yoghurt' ? ' If your model has no Frozen Yoghurt program, use Lite Ice Cream.' : ''}`,
    'If the texture is powdery or crumbly, add 1–2 tablespoons of the recipe’s milk or water and use Re-Spin. Repeat once if needed for a creamy texture.',
    ...(input.mixins ? [`Make a well in the centre, add ${input.mixins}, and use Mix-In. Serve immediately.`] : ['Scoop and serve immediately. Flatten any leftovers before covering and refreezing; process again following your machine’s instructions.']),
  ];
  return {
    id: slug,
    slug,
    name: input.name,
    description: input.description,
    image: `/images/${input.photo}.jpg`,
    category: input.category,
    tags: input.tags,
    ingredients: input.ingredients,
    calories: round(input.ingredients.reduce((total, item) => total + item.calories, 0)),
    protein: round(input.ingredients.reduce((total, item) => total + item.protein, 0)),
    carbs: round(input.ingredients.reduce((total, item) => total + item.carbs, 0)),
    fat: round(input.ingredients.reduce((total, item) => total + item.fat, 0)),
    servings: 1,
    instructions: input.instructions ?? instructions,
    creamiMode: mode,
    prepTime: input.prep ?? (input.mixins ? 8 : 5),
    freezeTime: input.freezeTime ?? 24,
    difficulty: input.difficulty ?? 'Easy',
    rating: [4.9, 4.8, 4.7, 4.9, 4.6][index % 5],
    addedAt: `2026-09-${String(30 - (index % 28)).padStart(2, '0')}`,
    ...(input.featured ? { featured: true } : {}),
  };
}

// Each recipe makes one full pint; nutrition is an estimate for that pint.
// Extra liquid added during Re-Spin and optional substitutions are not included.
export const recipes: Recipe[] = ([
  {
    name: 'Pistachio dream', description: 'Silky pistachio ice cream with a little crunch and a beautifully nutty finish.', category: 'Classic', tags: ['Nutty', 'Pistachio', 'Vegetarian'], photo: 'pistachio', featured: true,
    ingredients: [...classicBase(290, 35), i('pistachio', 28), i('salt', 0.5)], mixins: '8 g of the pistachios, finely chopped',
    firstStep: 'Reserve 8 g pistachios for the mix-in. Blend the remaining pistachios with the milk, cream, sugar, vanilla and salt until very smooth.',
  },
  {
    name: 'Vanilla bean', description: 'A simple, creamy scoop that lets real vanilla shine.', category: 'Classic', tags: ['Vanilla', 'Vegetarian'], photo: 'vanilla', featured: true,
    ingredients: [...classicBase(320, 55), i('salt', 0.3)],
  },
  {
    name: 'Salted caramel', description: 'Golden caramel, rich cream and just enough sea salt.', category: 'Classic', tags: ['Caramel', 'Vegetarian'], photo: 'caramel', featured: true,
    ingredients: [i('whole', 300), i('cream', 45), i('caramel', 45), i('vanilla', 3), i('salt', 1)],
  },
  {
    name: 'Strawberry cheesecake', description: 'Sweet strawberries meet tangy cheesecake and a biscuit crumble.', category: 'Classic', tags: ['Fruit', 'Strawberry', 'Cheesecake', 'Vegetarian'], photo: 'strawberry', featured: true,
    ingredients: [i('whole', 230), i('greek', 70), i('strawberry', 80), i('creamCheese', 30), i('sugar', 22), i('vanilla', 2), i('graham', 12)], mixins: 'the graham cracker crumbs',
  },
  {
    name: 'Chocolate fudge', description: 'Deep cocoa flavour with little pockets of dark chocolate.', category: 'Classic', tags: ['Chocolate', 'Vegetarian'], photo: 'chocolate',
    ingredients: [...classicBase(300, 40), i('cocoa', 16), i('darkChocolate', 15), i('salt', 0.5)], mixins: 'the dark chocolate chips',
  },
  {
    name: 'Cookies & cream', description: 'Vanilla cream packed with chunks of chocolate sandwich cookie.', category: 'Classic', tags: ['Cookies', 'Vanilla', 'Chocolate', 'Vegetarian'], photo: 'cookies',
    ingredients: [...classicBase(310, 40), i('cookies', 28)], mixins: 'the roughly crushed sandwich cookies',
  },
  {
    name: 'Banana bread', description: 'Ripe banana, warming cinnamon and toasted walnut pieces.', category: 'Classic', tags: ['Fruit', 'Banana', 'Nutty', 'Vegetarian'], photo: 'banana',
    ingredients: [i('whole', 250), i('banana', 100), i('cream', 30), i('maple', 18), i('cinnamon', 1.5), i('walnut', 12), i('vanilla', 2)], mixins: 'the chopped walnuts',
  },
  {
    name: 'Espresso gelato', description: 'A smooth coffee scoop with the flavour of a fresh café espresso.', category: 'Classic', tags: ['Coffee', 'Vegetarian'], photo: 'coffee', mode: 'Gelato',
    ingredients: [i('whole', 290), i('coffee', 50), i('cream', 45), i('sugar', 28), i('vanilla', 2)],
  },
  {
    name: 'Honey almond', description: 'Floral honey folded into a creamy base with toasted almonds.', category: 'Classic', tags: ['Nutty', 'Vanilla', 'Vegetarian'], photo: 'vanilla',
    ingredients: [i('whole', 300), i('cream', 40), i('honey', 28), i('almondNuts', 18), i('vanilla', 3)], mixins: 'the chopped toasted almonds',
  },
  {
    name: 'Lemon curd swirl', description: 'Bright lemon curd brings a sunny finish to a rich vanilla base.', category: 'Classic', tags: ['Fruit', 'Citrus', 'Vegetarian'], photo: 'vanilla',
    ingredients: [i('whole', 290), i('cream', 40), i('sugar', 15), i('vanilla', 3), i('lemonCurd', 40)], mixins: 'the lemon curd in small spoonfuls',
  },
  {
    name: 'Double chocolate protein', description: 'Big chocolate flavour, a velvety texture and over 40 grams of protein.', category: 'High protein', tags: ['High protein', 'Chocolate', 'Vegetarian'], photo: 'chocolate', featured: true,
    ingredients: [...proteinBase(), i('cocoa', 12), i('darkChocolate', 8)], mixins: 'the dark chocolate chips',
  },
  {
    name: 'Vanilla protein milkshake', description: 'A thick vanilla milkshake with over 30 grams of protein, ready without an overnight freeze.', category: 'High protein', tags: ['High protein', 'Vanilla', 'Milkshake', 'Vegetarian'], photo: 'vanilla', featured: true, mode: 'Milkshake', freezeTime: 0,
    ingredients: [i('vanillaIceCream', 100), i('skim', 220), i('whey', 28), i('vanilla', 2)],
    instructions: [
      'Whisk the whey protein powder and vanilla into the skim milk until completely smooth. Keep the mixture cold.',
      'Place the scoopable vanilla ice cream in a compatible Creami pint, then pour in the cold milk mixture. Keep everything below the MAX FILL line; reserve any excess separately.',
      'Follow your machine’s manual for loading the pint and process on Milkshake. Do not freeze this assembled base or add hard ice cubes.',
      'Serve immediately. If you prefer a thinner shake, stir in a small splash of cold milk after processing; this extra milk is not included in the nutrition estimate.',
    ],
  },
  {
    name: 'Peanut butter cup', description: 'Chocolate and creamy peanut butter with a crisp chocolate finish.', category: 'High protein', tags: ['High protein', 'Chocolate', 'Nutty', 'Vegetarian'], photo: 'chocolate',
    ingredients: [...proteinBase(250, 100), i('peanutButter', 15), i('cocoa', 8), i('darkChocolate', 5)], mixins: 'the dark chocolate chips',
  },
  {
    name: 'Strawberry shortcake', description: 'A fresh strawberry protein base with a buttery biscuit crunch.', category: 'High protein', tags: ['High protein', 'Fruit', 'Strawberry', 'Vegetarian'], photo: 'strawberry',
    ingredients: [...proteinBase(220, 90), i('strawberry', 85), i('graham', 10)], mixins: 'the graham cracker crumbs',
  },
  {
    name: 'Blueberry cheesecake', description: 'Juicy blueberries and cream cheese make this protein pint taste like dessert.', category: 'High protein', tags: ['High protein', 'Fruit', 'Berry', 'Cheesecake', 'Vegetarian'], photo: 'berry',
    ingredients: [...proteinBase(220, 85), i('blueberry', 75), i('creamCheese', 20), i('graham', 8)], mixins: 'the graham cracker crumbs',
  },
  {
    name: 'Mocha protein', description: 'Cold espresso and cocoa blended into a rich, energising scoop.', category: 'High protein', tags: ['High protein', 'Coffee', 'Chocolate', 'Vegetarian'], photo: 'coffee',
    ingredients: [...proteinBase(230, 100), i('coffee', 40), i('cocoa', 10)],
  },
  {
    name: 'Banana peanut butter', description: 'Sweet banana and peanut butter in a smooth, filling protein pint.', category: 'High protein', tags: ['High protein', 'Fruit', 'Banana', 'Nutty', 'Vegetarian'], photo: 'banana',
    ingredients: [...proteinBase(210, 90), i('banana', 80), i('peanutButter', 14)],
  },
  {
    name: 'Salted caramel protein', description: 'Caramel comfort with a lighter Greek yoghurt and whey base.', category: 'High protein', tags: ['High protein', 'Caramel', 'Vegetarian'], photo: 'caramel',
    ingredients: [...proteinBase(260, 100), i('caramel', 24), i('salt', 0.8)],
  },
  {
    name: 'Cinnamon cereal', description: 'Sweet cinnamon milk with a crunchy cereal mix-in.', category: 'High protein', tags: ['High protein', 'Vanilla', 'Cinnamon', 'Vegetarian'], photo: 'vanilla',
    ingredients: [...proteinBase(270, 100), i('cinnamon', 1.5), i('cereal', 15)], mixins: 'the cinnamon breakfast cereal',
  },
  {
    name: 'Raspberry white chocolate', description: 'Tart raspberries balance little morsels of white chocolate.', category: 'High protein', tags: ['High protein', 'Fruit', 'Berry', 'Chocolate', 'Vegetarian'], photo: 'berry',
    ingredients: [...proteinBase(225, 100), i('raspberry', 75), i('whiteChocolate', 10)], mixins: 'the white chocolate chips',
  },
  {
    name: 'Mint chocolate protein', description: 'Cool peppermint and dark chocolate in a creamy protein base.', category: 'High protein', tags: ['High protein', 'Chocolate', 'Mint', 'Vegetarian'], photo: 'chocolate',
    ingredients: [...proteinBase(270, 100), i('mint', 1), i('darkChocolate', 12)], mixins: 'the dark chocolate chips',
  },
  {
    name: 'Cherry chocolate protein', description: 'A chocolate-cherry treat with plenty of protein in every pint.', category: 'High protein', tags: ['High protein', 'Fruit', 'Chocolate', 'Vegetarian'], photo: 'chocolate',
    ingredients: [...proteinBase(220, 100), i('cherry', 75), i('cocoa', 8), i('darkChocolate', 5)], mixins: 'the dark chocolate chips',
  },
  {
    name: 'Coconut vanilla protein', description: 'A plant-powered vanilla scoop with a soft coconut finish.', category: 'High protein', tags: ['High protein', 'Dairy free', 'Vegan', 'Vanilla', 'Coconut'], photo: 'vanilla',
    ingredients: [i('soy', 310), i('plant', 40), i('coconutCan', 60), i('erythritol', 12), i('vanilla', 3), i('coconutFlakes', 8), i('xanthan', 0.5)], mixins: 'the coconut flakes',
  },
  {
    name: 'Mango lassi protein', description: 'Mango and tangy Greek yoghurt with a gentle hint of cardamom.', category: 'High protein', tags: ['High protein', 'Fruit', 'Mango', 'Vegetarian'], photo: 'mango',
    ingredients: [...proteinBase(210, 110), i('mango', 85), i('cardamom', 0.5)],
  },
  {
    name: 'Tiramisu protein', description: 'Coffee, cocoa and a creamy cottage cheese base inspired by tiramisu.', category: 'High protein', tags: ['High protein', 'Coffee', 'Chocolate', 'Vegetarian'], photo: 'coffee',
    ingredients: [i('skim', 200), i('cottage', 130), i('whey', 28), i('coffee', 35), i('erythritol', 12), i('vanilla', 3), i('cocoa', 6), i('graham', 10), i('xanthan', 0.5)], mixins: 'the graham cracker crumbs',
  },
  {
    name: 'Light vanilla', description: 'An everyday vanilla pint with a light, creamy Greek yoghurt base.', category: 'Low calorie', tags: ['Low calorie', 'Vanilla', 'Vegetarian'], photo: 'vanilla',
    ingredients: [...lightBase(), i('pudding', 5)],
  },
  {
    name: 'Light chocolate', description: 'A cocoa-rich scoop that keeps the ingredient list light and simple.', category: 'Low calorie', tags: ['Low calorie', 'Chocolate', 'Vegetarian'], photo: 'chocolate',
    ingredients: [...lightBase(290, 100), i('cocoa', 14), i('salt', 0.3)],
  },
  {
    name: 'Strawberry froyo', description: 'Fresh strawberries and tangy yoghurt make a refreshing pink pint.', category: 'Low calorie', tags: ['Low calorie', 'Fruit', 'Strawberry', 'Vegetarian'], photo: 'strawberry', mode: 'Frozen Yoghurt',
    ingredients: [...lightBase(200, 120), i('strawberry', 110)],
  },
  {
    name: 'Lemon blueberry', description: 'A light blueberry scoop lifted with a squeeze of fresh lemon.', category: 'Low calorie', tags: ['Low calorie', 'Fruit', 'Berry', 'Citrus', 'Vegetarian'], photo: 'berry',
    ingredients: [...lightBase(220, 100), i('blueberry', 90), i('lemon', 12)],
  },
  {
    name: 'Peach yoghurt', description: 'Ripe peaches bring a sunny sweetness to a light frozen yoghurt.', category: 'Low calorie', tags: ['Low calorie', 'Fruit', 'Peach', 'Vegetarian'], photo: 'mango', mode: 'Frozen Yoghurt',
    ingredients: [...lightBase(200, 120), i('peach', 110), i('honey', 6)],
  },
  {
    name: 'Raspberry ripple', description: 'Tart raspberries swirled through a softly sweet vanilla yoghurt base.', category: 'Low calorie', tags: ['Low calorie', 'Fruit', 'Berry', 'Vegetarian'], photo: 'berry',
    ingredients: [...lightBase(230, 120), i('raspberry', 70)],
  },
  {
    name: 'Iced latte', description: 'Your iced latte turned into a smooth, lightly sweet coffee pint.', category: 'Low calorie', tags: ['Low calorie', 'Coffee', 'Vegetarian'], photo: 'coffee',
    ingredients: [...lightBase(250, 100), i('coffee', 55), i('pudding', 5)],
  },
  {
    name: 'Cinnamon apple', description: 'Comforting apple and cinnamon with a gently tangy yoghurt finish.', category: 'Low calorie', tags: ['Low calorie', 'Fruit', 'Apple', 'Cinnamon', 'Vegetarian'], photo: 'caramel',
    ingredients: [...lightBase(210, 120), i('applesauce', 95), i('cinnamon', 1.5)],
  },
  {
    name: 'Watermelon lime', description: 'Fresh watermelon and lime in a bright, refreshing summer sorbet.', category: 'Low calorie', tags: ['Low calorie', 'Dairy free', 'Vegan', 'Fruit', 'Citrus'], photo: 'strawberry', mode: 'Sorbet',
    ingredients: [i('watermelon', 350), i('lime', 18), i('water', 40), i('sugar', 24)],
  },
  {
    name: 'Mango lime sorbet', description: 'A golden mango sorbet with a zing of lime and nothing complicated.', category: 'Dairy free', tags: ['Dairy free', 'Vegan', 'Fruit', 'Mango', 'Citrus'], photo: 'mango', mode: 'Sorbet', featured: true,
    ingredients: [i('mango', 300), i('lime', 18), i('water', 100), i('sugar', 26)],
  },
  {
    name: 'Pineapple coconut', description: 'Pineapple and creamy coconut make a little tropical escape.', category: 'Dairy free', tags: ['Dairy free', 'Vegan', 'Fruit', 'Coconut'], photo: 'mango',
    ingredients: [i('pineapple', 190), i('coconutCan', 150), i('coconut', 60), i('maple', 16), i('coconutFlakes', 8)], mixins: 'the coconut flakes',
  },
  {
    name: 'Chocolate coconut', description: 'Velvety dairy-free chocolate with a rich coconut milk base.', category: 'Dairy free', tags: ['Dairy free', 'Vegan', 'Chocolate', 'Coconut'], photo: 'chocolate',
    ingredients: [i('coconutCan', 200), i('oat', 180), i('cocoa', 18), i('maple', 28), i('vanilla', 3), i('xanthan', 0.5)],
  },
  {
    name: 'Oat milk cookie', description: 'Smooth oat milk ice cream with chunks of chocolate sandwich cookie.', category: 'Dairy free', tags: ['Dairy free', 'Vegan', 'Cookies', 'Vanilla'], photo: 'cookies',
    ingredients: [...veganBase('oat', 300), i('cookies', 22, 'Dairy-free chocolate sandwich cookies')], mixins: 'the crushed dairy-free chocolate sandwich cookies (check the label)',
  },
  {
    name: 'Almond butter vanilla', description: 'Nutty almond butter brings richness to this plant-based vanilla scoop.', category: 'Dairy free', tags: ['Dairy free', 'Vegan', 'Nutty', 'Vanilla'], photo: 'vanilla',
    ingredients: [...veganBase('almond', 300), i('almondButter', 28), i('salt', 0.4)],
  },
  {
    name: 'Strawberry banana', description: 'A naturally fruity pink scoop with the familiar strawberry-banana pairing.', category: 'Dairy free', tags: ['Dairy free', 'Vegan', 'Fruit', 'Strawberry', 'Banana'], photo: 'strawberry',
    ingredients: [i('soy', 220), i('strawberry', 100), i('banana', 85), i('maple', 12), i('vanilla', 2), i('xanthan', 0.5)],
  },
  {
    name: 'Maple pecan', description: 'Toasted pecans and real maple syrup in a creamy oat milk base.', category: 'Dairy free', tags: ['Dairy free', 'Vegan', 'Nutty', 'Caramel'], photo: 'caramel',
    ingredients: [i('oat', 310), i('coconutCan', 70), i('maple', 30), i('pecan', 20), i('vanilla', 3), i('salt', 0.5), i('xanthan', 0.5)], mixins: 'the roughly chopped toasted pecans',
  },
  {
    name: 'Matcha coconut', description: 'Earthy green tea with a mellow, creamy coconut finish.', category: 'Dairy free', tags: ['Dairy free', 'Vegan', 'Matcha', 'Coconut'], photo: 'pistachio',
    ingredients: [i('soy', 260), i('coconutCan', 120), i('matcha', 4), i('maple', 24), i('vanilla', 2), i('xanthan', 0.5)],
  },
  {
    name: 'Raspberry dark chocolate', description: 'A dairy-free berry base with scattered dark chocolate pieces.', category: 'Dairy free', tags: ['Dairy free', 'Vegan', 'Fruit', 'Berry', 'Chocolate'], photo: 'berry',
    ingredients: [...veganBase('soy', 220), i('raspberry', 100), i('veganChocolate', 16)], mixins: 'the dairy-free dark chocolate chips',
  },
  {
    name: 'Blueberry lavender', description: 'Sweet blueberries with a delicate, subtle lavender note.', category: 'Dairy free', tags: ['Dairy free', 'Vegan', 'Fruit', 'Berry'], photo: 'berry', difficulty: 'Medium', prep: 10,
    ingredients: [i('oat', 240), i('coconutYoghurt', 75), i('blueberry', 100), i('maple', 20), i('lavender', 0.2), i('vanilla', 2), i('xanthan', 0.5)],
    firstStep: 'Warm the oat milk gently with the culinary lavender. Take off the heat, steep for 5 minutes, then strain and cool completely. Blend with the remaining ingredients until smooth.',
  },
  {
    name: 'Orange creamsicle', description: 'Bright orange and creamy vanilla in a nostalgic dairy-free scoop.', category: 'Dairy free', tags: ['Dairy free', 'Vegan', 'Fruit', 'Citrus', 'Vanilla'], photo: 'mango',
    ingredients: [i('orange', 180), i('coconutCan', 150), i('oat', 80), i('maple', 20), i('vanilla', 4), i('xanthan', 0.5)],
  },
  {
    name: 'Chocolate hazelnut', description: 'Roasted hazelnuts and cocoa make an indulgent, beautifully smooth pint.', category: 'Classic', tags: ['Chocolate', 'Nutty', 'Vegetarian'], photo: 'chocolate', difficulty: 'Medium', prep: 10,
    ingredients: [...classicBase(285, 35), i('hazelnut', 25), i('cocoa', 12), i('salt', 0.4)],
    firstStep: 'Blend the roasted hazelnuts with the milk until very smooth. Add the cream, sugar, vanilla, cocoa and salt, then blend again until combined.',
  },
  {
    name: 'Dulce de leche', description: 'Creamy caramelised milk with a soft vanilla finish.', category: 'Classic', tags: ['Caramel', 'Vanilla', 'Vegetarian'], photo: 'caramel',
    ingredients: [i('whole', 300), i('cream', 45), i('dulce', 65), i('vanilla', 3), i('salt', 0.5)],
  },
  {
    name: 'Biscoff cheesecake', description: 'Tangy cheesecake with warmly spiced biscuit crumbs throughout.', category: 'Classic', tags: ['Cookies', 'Caramel', 'Cheesecake', 'Vegetarian'], photo: 'cookies',
    ingredients: [i('whole', 260), i('greek', 90), i('creamCheese', 35), i('sugar', 22), i('vanilla', 3), i('biscoff', 25)], mixins: 'the crushed Biscoff biscuits',
  },
  {
    name: 'Black forest', description: 'A rich chocolate base with sweet cherries and dark chocolate chips.', category: 'Classic', tags: ['Fruit', 'Chocolate', 'Cherry', 'Vegetarian'], photo: 'chocolate',
    ingredients: [...classicBase(240, 35), i('cherry', 95), i('cocoa', 12), i('darkChocolate', 10)], mixins: 'the dark chocolate chips',
  },
  {
    name: 'Peanut butter & jam', description: 'A creamy peanut butter scoop with little swirls of strawberry jam.', category: 'Classic', tags: ['Nutty', 'Fruit', 'Strawberry', 'Vegetarian'], photo: 'caramel',
    ingredients: [i('whole', 300), i('cream', 35), i('peanutButter', 25), i('sugar', 15), i('vanilla', 3), i('jam', 25)], mixins: 'the strawberry jam in small spoonfuls',
  },
] satisfies RecipeInput[]).map(makeRecipe);
