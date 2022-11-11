/* istanbul ignore file */
// ^ignore file in test report

// mock axios api to server
jest.mock('../../src/DataService', () => {
  class DataService {
    /* Get a specific recipe with known id */
    get(id: string) {
      // if testing new recipe
      if (id === '3') {
        return Promise.resolve({
          recipeInfo: {
            id: 3,
            name: 'New recipe',
            meal_type: '',
            new: true,
            popular: false,
            description: '',
          },
          ingredients: [
            {
              ingredients_id: 1,
              ingredient: 'whole milk',
              amount: 0.0,
              unit_id: 1,
              unit: '',
            },
          ],
        });
      } else { // else return test recipe 1
        return Promise.resolve({
          recipeInfo: {
            id: 1,
            name: 'One-Pot Mac and Cheese',
            meal_type: 'Dinner',
            new: true,
            popular: true,
            description: `Who likes cleaning up after making mac and cheese? 
              Not this girl. This one-pot mac and cheese is a family favorite, 
              and my 3-year-old is thrilled to see it coming to the dinner table. 
              We love to add sliced smoked sausage to this creamy mac recipe!`,
          },
          ingredients: [
            {
              ingredients_id: 1,
              ingredient: 'whole milk',
              amount: 1.5,
              unit_id: 2,
              unit: 'cup',
            },
            {
              ingredients_id: 2,
              ingredient: 'water',
              amount: 3,
              unit_id: 2,
              unit: 'cup',
            },
            {
              ingredients_id: 3,
              ingredient: 'elbow macaroni (16 ounces)',
              amount: 1,
              unit_id: 3,
              unit: 'package',
            },
            {
              ingredients_id: 4,
              ingredient: 'velveeta, cubed',
              amount: 4,
              unit_id: 4,
              unit: 'ounce',
            },
            {
              ingredients_id: 5,
              ingredient: 'shredded sharp cheddar cheese',
              amount: 2,
              unit_id: 2,
              unit: 'cup',
            },
            {
              ingredients_id: 6,
              ingredient: 'salt',
              amount: 0.5,
              unit_id: 5,
              unit: 'teaspoon',
            },
            {
              ingredients_id: 7,
              ingredient: 'coarsely ground pepper',
              amount: 0.5,
              unit_id: 5,
              unit: 'teaspoon',
            },
          ],
        });
      }
    }

    // Get an array of all recipes
    getAll() {
      return Promise.resolve([
        {
          id: 1,
          name: 'One-Pot Mac and Cheese',
          meal_type: 'Dinner',
          new: true,
          popular: true,
          description: `Who likes cleaning up after making mac and cheese? 
          Not this girl. This one-pot mac and cheese is a family favorite, 
          and my 3-year-old is thrilled to see it coming to the dinner table. 
          We love to add sliced smoked sausage to this creamy mac recipe!`,
        },
        {
          id: 2,
          name: 'Easy Marinated Grilled Flank Steak',
          meal_type: 'Dinner',
          new: false,
          popular: false,
          description: `Friends shared this three-ingredient marinade years ago, 
          and it’s been a favorite since. Serve the steak with salad and 
          grilled potatoes for a quick meal.`,
        },
      ]);
    }

    /* Post new recepie */
    create() {
      return Promise.resolve(3); // Same as: return new Promise((resolve) => resolve(3));
    }

    // Edit recipe
    edit() {
      return Promise.resolve();
    }

    // Delete recipe with given id
    delete(id: number) {
      return Promise.resolve();
    }

    // Get all ingredients
    getAllIngredients() {
      return Promise.resolve([
        { id: 1, ingredient: 'whole milk' },
        { id: 2, ingredient: 'water' },
      ]);
    }

    // Create new ingredient
    createIngredient(ingredient: string) {
      return Promise.resolve(8);
    }

    // Get all units
    getAllUnits() {
      return Promise.resolve([
        { id: 1, unit: '' },
        { id: 2, unit: 'cup' },
        { id: 3, unit: 'package' },
        { id: 3, unit: 'ounce' },
      ]);
    }

    //External API ------------>

    //get key to Explore
    apiExploreKey() {
      return Promise.resolve('key');
    }
    
    //get key to Home
    apiHomeKey() {
      return Promise.resolve('key');
    }
    
    //get data to Explore
    apiExploreData(data: any) {
      return Promise.resolve();
    }
    
    //get data to Home
    apiHomeData(data: any) {
      return Promise.resolve();
    }
    
  }
  return new DataService();
});
