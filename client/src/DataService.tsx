import axios from 'axios';
import React, { useEffect, useState } from 'react';
axios.defaults.baseURL = 'http://localhost:3000/api/v2';

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
export type Unit = {
  id: number;
  unit: string;
};
export type UnitsList = {
  units: Unit[];
};

export type EachIngredient = {
  id: number;
  ingredient: string;
};

export type IngredientsList = {
  ingredients: EachIngredient[];
};

class DataService {
  /* Get a specific recipe with known id */

  get(id: number | string) {
    // Use this for testing locally only
    // return new Promise<Recipe>((resolve, reject) => {
    //   resolve({
    //     recipeInfo: {
    //       id: 1,
    //       name: 'The best pasta in the world',
    //       meal_type: 'Vegan',
    //       new: true,
    //       popular: true,
    //       description:
    //         'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, corporis. Distinctio deserunt aperiam hic voluptatum, ut a molestias cumque tenetur consequatur, ad dolores voluptatem provident eveniet, porro magnam est veritatis.',
    //     },
    //     ingredients: [
    //       { name: 'Olive oil', amount: 3, unit: 'tbsp' },
    //       { name: 'Onion', amount: 1, unit: 'pcs' },
    //       { name: 'Garlic', amount: 3, unit: 'cloves' },
    //       { name: 'Chopped Tomato', amount: 400, unit: 'g' },
    //       { name: 'Dried spaghetti', amount: 300, unit: 'g' },
    //     ],
    //   });
    // });

    return axios
      .get<Recipe>('/recipe/' + id)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }
  // Get an array of all recipes

  getAll() {
    return axios
      .get<[]>('/recipe/')
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }
  /* Post new recepie */
  create(data: Recipe) {
    return axios
      .post<{ id: number }>('/recipe', { data })
      .then((response) => response.data.id)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }
  /* Edit an existing recipe by known id */

  edit(id: number) {
    return alert('function not implementet yet');

    /* Delete a recipe known id */
  }
  delete(id: number) {
    return axios
      .delete('/recipe/' + id)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }
  /* Get all ingredients */
  getAllIngredients() {
    return axios
      .get('/ingredient')
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }

  /* Get all units */
  getAllUnits() {
    return axios
      .get<[]>('/unit')
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }
}

const dataService = new DataService();
export default dataService;
