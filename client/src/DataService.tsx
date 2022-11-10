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
  amount: number | null;
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

export type ApiRecipeInfo = {
  id: number;
  name: string;
  meal_type: string;
  new: boolean;
  popular: boolean;
  description: string;
  servings: number;
  image: string;
};

export type ApiIngredient = {
  ingredients_id: number;
  ingredient: string;
  amount: number;
  unit_id: number;
  unit: string;
};

export type ApiRecipe = {
  recipeInfo: ApiRecipeInfo;
  ingredients: ApiIngredient[];
};

class DataService {
  /* Get a specific recipe with known id */

  get(id: number | string) {
    return axios.get<Recipe>('/recipe/' + id).then((response) => response.data);
  }
  // Get an array of all recipes

  getAll() {
    return axios.get<[]>('/recipe/').then((response) => response.data);
  }
  /* Post new recepie */
  create(data: Recipe) {
    return axios.post<{ id: number }>('/recipe', { data }).then((response) => response.data.id);
  }
  /* Edit an existing recipe by known id */

  edit(data: Recipe) {
    return axios.put<Recipe>('/recipe', { data }).then((response) => {
      console.log('axios', response);
      return response.statusText;
    });

    /* Delete a recipe known id */
  }
  delete(id: number) {
    return axios.delete('/recipe/' + id).then((response) => response.data);
  }

  /* Get all ingredients */
  getAllIngredients(): Promise<EachIngredient[]> {
    return axios.get('/ingredient').then((response) => response.data);
  }
  /* Create new ingredient */
  createIngredient(ingredient: EachIngredient) {
    return axios.post<{ id: number }>('/ingredient', { ingredient }).then((response) => {
      return response.data.id;
    });
  }

  /* Get all units */
  getAllUnits(): Promise<EachUnit[]> {
    return axios.get<[]>('/unit').then((response) => response.data);

  }
  //External API ---------->

  //get key to Explore
  apiExploreKey() {
    return axios.get('/explore').then((response) => response.data);
  }
  //get key to Home
  apiHomeKey() {
    return axios.get('/').then((response) => response.data);
  }
  //get data to Explore
  apiExploreData(data: any) {
    return axios.post('/explore', data).then((response) => response.data);
  }
  //get data to Home
  apiHomeData(data: any) {
    return axios.post('/', data).then((response) => response.data);

  }
}

const dataService = new DataService();
export default dataService;
