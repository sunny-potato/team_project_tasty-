import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import recipeService, { Recipe, RecipeInfo, Ingredient } from '../src/recipe-service';
import { response } from 'express';

const testIngredients: { id: number; ingredient: string }[] = [
  { id: 1, ingredient: 'whole milk' },
  { id: 2, ingredient: 'water' },
];

const testUnits: { id: number; unit: string }[] = [
  { id: 1, unit: '' },
  { id: 2, unit: 'cup' },
  { id: 3, unit: 'package' },
];

const testRecipeInfo: RecipeInfo = {
  id: 1,
  name: 'One-Pot Mac and Cheese',
  meal_type: 'Dinner',
  new: true,
  popular: false,
  description: 'Who likes cleaning up after making mac and cheese?',
};

const testRecipeIngredients: Ingredient[] = [
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
];

const testRecipe: Recipe = {
  recipeInfo: testRecipeInfo,
  ingredients: testRecipeIngredients,
};

axios.defaults.baseURL = 'http://localhost:3001/api/v2';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3001, () => done());
});

beforeEach((done) => {
  // Delete all contents in db tables, and reset id auto-increment start values
  pool.query('TRUNCATE TABLE relations', (error) => {
    if (error) return done(error);

    pool.query('TRUNCATE TABLE recipes', (error) => {
      if (error) return done(error);

      pool.query('TRUNCATE TABLE ingredients', (error) => {
        if (error) return done(error);

        pool.query('TRUNCATE TABLE units', (error) => {
          if (error) return done(error);

          // Add test variables to tables
          recipeService
            .createIngredient(testIngredients[0].ingredient)
            .then(() => recipeService.createIngredient(testIngredients[1].ingredient))
            .then(() => recipeService.createUnit(testUnits[0].unit))
            .then(() => recipeService.createUnit(testUnits[1].unit))
            .then(() => recipeService.createUnit(testUnits[2].unit))
            .then(() => recipeService.create(testRecipe))
            .then(() => done()); // call done() after testRecipe has been created
        });
      });
    });
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

describe('Fetching Recipies (GET)', () => {
  test('Fetch one with given id (200 OK)', (done) => {
    axios.get('/recipe/1').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testRecipe);
      done();
    });
  });

  test('Fetch one with given id that does not exist (404 Not found)', (done) => {
    axios.get('/recipe/2').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 404');
      done();
    });
  });

  test('Fetch all (200 OK)', (done) => {
    axios.get('/recipe').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual([testRecipeInfo]);
      done();
    });
  });
});

describe('Create new recipe (POST)', () => {
  let newRecipe = testRecipe;
  newRecipe.recipeInfo.name = 'New Recipe';
  test('Create one new recipe (200 OK)', (done) => {
    axios.post('/recipe', newRecipe).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual({ id: 2 });
      done();
    });
  });

  test('Create new with missing info (400)', (done) => {
    axios.post('/recipe', newRecipe.ingredients).catch((error) => {
      expect(error.message).toEqual('Request failed with status code 400');
      done();
    });
  });

  test('Create new with missing name (400)', (done) => {
    let missingNameRecipe = newRecipe;
    missingNameRecipe.recipeInfo.name = '';
    axios.post('/recipe', missingNameRecipe).catch((error) => {
      expect(error.message).toEqual('Request failed with status code 400');
      done();
    });
  });
});

describe('Update recipe (PUT)', () => {
  test('Update recipe (200 OK)', (done) => {
    testRecipe.recipeInfo.name = 'Updated recipe name';
    axios.put('/recipe', testRecipe).then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });
  test('Update recipe with missing info (400)', (done) => {
    axios.put('/recipe', testRecipe.ingredients).catch((error) => {
      expect(error.message).toEqual('Request failed with status code 400');
      done();
    });
  });
});

describe('Delete recipe (DELETE)', () => {
  test('Delete recipe (200) OK', (done) => {
    axios.delete('/recipe/1').then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });
});

describe('Fetching Ingredients (GET)', () => {
  test('Fetch all ingredients (200 OK)', (done) => {
    axios.get('/ingredient').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testIngredients);
      done();
    });
  });
});

describe('Add new ingredient (POST)', () => {
  test('Add new ingredient (200 OK)', (done) => {
    axios.post('/ingredient', { ingredient: 'new ingredient' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual({ id: 3 });
      done();
    });
  });
  test('Add new ingredient with missing info (400)', (done) => {
    axios.post('/ingredient', { ingredient: '' }).catch((error) => {
      expect(error.message).toEqual('Request failed with status code 400');
      done();
    });
  });
});

describe('Update ingredient (PUT)', () => {
  test('Update ingredient (200 OK)', (done) => {
    axios.put('/ingredient', { id: 1, ingredient: 'updated ingredient' }).then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });
  test('Update ingredient with wrong info (400)', (done) => {
    axios
      .put('/ingredient', {
        id: 'not a number',
        ingredient: 'updated ingredient',
      })
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 400');
        done();
      });
  });
});

describe('Delete ingredient', () => {
  test('Delete ingredient (200)', (done) => {
    axios.delete('/ingredient/1').then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });
});

describe('Fetching Units (GET)', () => {
  test('Fetch all units (200 OK)', (done) => {
    axios.get('/unit').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testUnits);
      done();
    });
  });
});

describe('Add new unit (POST)', () => {
  test('Add new unit (200 OK)', (done) => {
    axios.post('/unit', { unit: 'new unit' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual({ id: 4 });
      done();
    });
  });
  test('Add new unit with missing info (400)', (done) => {
    axios.post('/unit', { unit: '' }).catch((error) => {
      expect(error.message).toEqual('Request failed with status code 400');
      done();
    });
  });
});

describe('Update unit (PUT)', () => {
  test('Update unit (200 OK)', (done) => {
    axios.put('/unit', { id: 1, unit: 'updated unit' }).then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });
  test('Update unit with wrong info (400)', (done) => {
    axios
      .put('/unit', {
        id: 'not a number',
        ingredient: 'updated unit',
      })
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 400');
        done();
      });
  });
});

describe('Delete unit', () => {
  test('Delete unit (200)', (done) => {
    axios.delete('/unit/1').then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });
});
