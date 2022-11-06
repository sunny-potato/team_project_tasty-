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

export type EachIngredient = {
  id: number;
  ingredient: string;
};

export type EachUnit = { id: number; unit: string };

class DataService {
  /* Get a specific recipe with known id */

  get(id: number | string) {
    //since it is defined as number, typescript makes error when it is used as string.
    //to use it as string, it should be "number | string" -> this comment will be deleted later
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

  edit(data: Recipe) {
    return axios.put<void>('/recipe', data).then((response) => response.statusText);

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
  getAllIngredients(): Promise<EachIngredient[]> {
    return axios
      .get('/ingredient')
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }

  /* Get all units */
  getAllUnits(): Promise<EachUnit[]> {
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
