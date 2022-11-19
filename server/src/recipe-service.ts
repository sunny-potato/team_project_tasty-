import pool from './mysql-pool';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export type RecipeInfo = {
  id: number;
  name: string;
  meal_type: string;
  new: boolean;
  popular: boolean;
  description: string;
};

export type Ingredient = {
  ingredients_id: number;
  ingredient: string;
  amount: number;
  unit_id: number;
  unit: string;
};

export type Recipe = {
  recipeInfo: RecipeInfo;
  ingredients: Ingredient[];
};

class RecipeService {
  // get recipe with given id
  getRecipe(id: number) {
    return new Promise<Recipe | undefined>((resolve, reject) => {
      pool.query('SELECT * FROM recipes WHERE id = ?', [id], (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        // return empty if no recipe found
        if (!results[0]) resolve(results[0]);

        let recipeInfo = results[0] as RecipeInfo;

        pool.query(
          `SELECT ingredients_id, ingredient, amount, unit_id, unit 
                FROM ((relations INNER JOIN ingredients ON 
                    relations.ingredients_id = ingredients.id) 
                    INNER JOIN units ON
                    relations.unit_id = units.id)
                    WHERE relations.recipes_id = ?`,
          [id],
          (error, results: RowDataPacket[]) => {
            if (error) return reject(error);

            let ingredients = results as Ingredient[];

            let recipe: Recipe = { recipeInfo, ingredients };

            resolve(recipe);
          }
        );
      });
    });
  }
  getAllRecipes() {
    return new Promise<Recipe[]>((resolve, reject) => {
      let recipies: Recipe[] = [];

      pool.query('SELECT * FROM recipes', (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        (results as RecipeInfo[]).forEach((recipeInfo, index, array) => {
          pool.query(
            `SELECT ingredients_id, ingredient, amount, unit_id, unit 
                FROM ((relations INNER JOIN ingredients ON 
                    relations.ingredients_id = ingredients.id) 
                    INNER JOIN units ON
                    relations.unit_id = units.id)
                    WHERE relations.recipes_id = ?`,
            [recipeInfo.id],
            (error, results: RowDataPacket[]) => {
              if (error) return reject(error);

              let ingredients = results as Ingredient[];
              let recipe: Recipe = { recipeInfo, ingredients };
              recipies.push(recipe);

              if (index === array.length - 1) resolve(recipies);
            }
          );
        });
      });
    });
  }

  // Create new recipe with given name
  create(recipe: Recipe) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'INSERT INTO recipes SET name=?, meal_type=?, new=?, popular=?, description=?',
        [
          recipe.recipeInfo.name,
          recipe.recipeInfo.meal_type,
          recipe.recipeInfo.new,
          recipe.recipeInfo.popular,
          recipe.recipeInfo.description,
        ],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          recipe.ingredients.forEach((ingredient, index, array) => {
            pool.query(
              'INSERT INTO relations SET recipes_id=?, ingredients_id=?, amount=?, unit_id=?',
              [results.insertId, ingredient.ingredients_id, ingredient.amount, ingredient.unit_id],
              (error, results2: ResultSetHeader) => {
                if (error) return reject(error);
                if (index === array.length - 1) resolve(results.insertId);
              }
            );
          });
        }
      );
    });
  }

  // Update given recipe
  update(recipe: Recipe) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'UPDATE recipes SET name=?, meal_type=?, new=?, popular=?, description=? WHERE id=?',
        [
          recipe.recipeInfo.name,
          recipe.recipeInfo.meal_type,
          recipe.recipeInfo.new,
          recipe.recipeInfo.popular,
          recipe.recipeInfo.description,
          recipe.recipeInfo.id,
        ],
        (error, results: ResultSetHeader) => {
          if (error) {
            return reject(error);
          }

          pool.query(
            'DELETE FROM relations WHERE recipes_id=?',
            [recipe.recipeInfo.id],
            (error, results2: ResultSetHeader) => {
              if (error) {
                return reject(error);
              }

              recipe.ingredients.forEach((ingredient, index, array) => {
                pool.query(
                  'INSERT INTO relations SET recipes_id=?, ingredients_id=?, amount=?, unit_id=?',
                  [
                    recipe.recipeInfo.id,
                    ingredient.ingredients_id,
                    ingredient.amount,
                    ingredient.unit_id,
                  ],
                  (error, results3: ResultSetHeader) => {
                    if (error) return reject(error);
                    if (error) {
                      return reject(error);
                    }
                    if (index === array.length - 1) resolve();
                  }
                );
              });
            }
          );
        }
      );
    });
  }

  // Delete recipe with given id
  delete(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'DELETE FROM relations WHERE recipes_id=?',
        [id],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          pool.query('DELETE FROM recipes WHERE id=?', [id], (error, results: ResultSetHeader) => {
            if (error) return reject(error);
            if (results.affectedRows == 0) return reject(new Error('No recipies deleted'));

            resolve();
          });
        }
      );
    });
  }

  //---------ingredients api

  // Get all ingredients
  getAllIngredents() {
    return new Promise<{ id: number; ingredient: string }[]>((resolve, reject) => {
      pool.query('SELECT * FROM ingredients', (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as { id: number; ingredient: string }[]);
      });
    });
  }

  // Add new ingredient with given name
  createIngredient(ingredient: string) {
    return new Promise<number>((resolve, reject) => {
      pool.query(
        'INSERT INTO ingredients SET ingredient=?',
        [ingredient],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);

          resolve(results.insertId);
        }
      );
    });
  }

  // Updated ingredient
  updateIngredient(id: number, ingredient: string) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'UPDATE ingredients SET ingredient=? WHERE id=?',
        [ingredient, id],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows == 0) return reject(new Error('No ingredients updated'));

          resolve();
        }
      );
    });
  }

  // Delete ingredient with given id
  deleteIngredient(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM ingredients WHERE id=?', [id], (error, results: ResultSetHeader) => {
        if (error) return reject(error);
        if (results.affectedRows == 0) return reject(new Error('No ingredients deletet'));

        resolve();
      });
    });
  }

  //---------units api

  // Get all units
  getAllUnits() {
    return new Promise<{ id: number; unit: string }[]>((resolve, reject) => {
      pool.query('SELECT * FROM units', (error, results: RowDataPacket[]) => {
        if (error) return reject(error);

        resolve(results as { id: number; unit: string }[]);
      });
    });
  }

  // Add new unit with given name
  createUnit(unit: string) {
    return new Promise<number>((resolve, reject) => {
      pool.query('INSERT INTO units SET unit=?', [unit], (error, results: ResultSetHeader) => {
        if (error) return reject(error);

        resolve(results.insertId);
      });
    });
  }

  // Updated unit
  updateUnit(id: number, unit: string) {
    return new Promise<void>((resolve, reject) => {
      pool.query(
        'UPDATE units SET unit=? WHERE id=?',
        [unit, id],
        (error, results: ResultSetHeader) => {
          if (error) return reject(error);
          if (results.affectedRows == 0) return reject(new Error('No units updated'));

          resolve();
        }
      );
    });
  }

  // Delete unit with given id
  deleteUnit(id: number) {
    return new Promise<void>((resolve, reject) => {
      pool.query('DELETE FROM units WHERE id=?', [id], (error, results: ResultSetHeader) => {
        if (error) return reject(error);
        if (results.affectedRows == 0) return reject(new Error('No units deletet'));

        resolve();
      });
    });
  }
}

const recipeService = new RecipeService();
export default recipeService;
