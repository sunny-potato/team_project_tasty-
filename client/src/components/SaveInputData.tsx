import React, { useState, useEffect } from 'react';
import dataService, { RecipeInfo, Ingredient, Recipe } from '../DataService';
import { useNavigate } from 'react-router-dom';

type ValidateProps = {
  ingredients: Ingredient[];
};

export const ValidateData = (props: ValidateProps) => {
  const validateIngredients = () => {
    // validate data which are added but onchanged (=default value)
    props.ingredients.map((ingredient: Ingredient) => {
      if (ingredient.amount === 0) {
        ingredient.amount = null;
      }
      if (ingredient.unit_id === 0 || ingredient.unit === 'initalUnit') {
        ingredient.unit_id = 1;
        ingredient.unit = '';
      }
    });
  };
  validateIngredients();

  //*********************//
  // if meal_type or description is required, validateRecipeInfo will be added!!!!!!
  // otherwise let's just say that isValid is true!
  //*********************//
  return true;
};

type SaveProps = {
  ingredients: Ingredient[];
  recipeInfo: RecipeInfo;
  id?: number;
};

export const SaveEditedData = (props: SaveProps) => {
  const navigate = useNavigate();

  const sendPutRequest = (newRecipe: any) => {
    dataService
      .edit(newRecipe)
      .then((response) => {
        console.log('request for recipe', response);
        alert('The recipe updated');
        navigate(`/recipe/${props.id}`);
      })
      .catch((error) => console.log(error));
  };

  const isMissingIngredientId = props.ingredients.filter((ingredient: Ingredient) => {
    if (ingredient.ingredients_id === undefined) return ingredient;
  });

  if (isMissingIngredientId.length > 0) {
    const updateNewId = (newIdList: any) => {
      newIdList.map((newId: any) => {
        props.ingredients.map((each) => {
          if (newId.name == each.ingredient) {
            each.ingredients_id = newId.id;
          }
        });
      });
      return props.ingredients;
    };

    Promise.all(
      isMissingIngredientId.map(async (each: Ingredient) => {
        const response = await dataService.createIngredient(each.ingredient);
        return { name: each.ingredient, id: response };
      })
    )
      .then((result) => {
        console.log('request for id');
        const newIngredients = updateNewId(result);
        const editedRecipe: Recipe = {
          ['recipeInfo']: props.recipeInfo,
          ['ingredients']: newIngredients,
        };
        sendPutRequest(editedRecipe);
      })
      .catch((error) => console.log(error));
  } else {
    const editedRecipe: Recipe = {
      ['recipeInfo']: props.recipeInfo,
      ['ingredients']: props.ingredients,
    };
    sendPutRequest(editedRecipe);
  }
};
