import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import dataService, { RecipeInfo, Ingredient, Recipe } from '../DataService';
import InputRecipeInfo from '../components/InputRecipeInfo';
import InputIngredients from '../components/InputIngredients';

const initialRecipeInfo: RecipeInfo = {
  id: undefined!,
  name: '',
  meal_type: '',
  new: true,
  popular: false,
  description: '',
};

const initialIngredient: Ingredient = {
  ingredients_id: undefined!,
  ingredient: '',
  amount: null,
  unit_id: 0,
  unit: 'initalUnit',
};

export function CreateNew() {
  const navigate = useNavigate();
  const [recipeInfo, setRecipeInfo] = useState<RecipeInfo>(initialRecipeInfo);
  const [ingredients, setIngredients] = useState<Ingredient[]>([initialIngredient]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateData = () => {
    const validateIngredients = () => {
      // validate data which are added but onchanged (=default value)
      ingredients.map((ingredient: Ingredient) => {
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

  const saveEditedData = () => {
    const sendPutRequest = (newRecipe: Recipe) => {
      dataService
        .create(newRecipe)
        .then((response) => {
          alert('The recipe updated');
          navigate(`/recipe/${response}`);
        })
        .catch((error) => console.log(error));
    };

    const isMissingIngredientId = ingredients.filter((ingredient: Ingredient) => {
      if (ingredient.ingredients_id === undefined) return ingredient;
    });

    if (isMissingIngredientId.length > 0) {
      const updateNewId = (newIdList: any) => {
        newIdList.map((newId: any) => {
          ingredients.map((each) => {
            if (newId.name == each.ingredient) {
              each.ingredients_id = newId.id;
            }
          });
        });
        return ingredients;
      };

      Promise.all(
        isMissingIngredientId.map(async (each: Ingredient) => {
          const response = await dataService.createIngredient(each.ingredient);
          return { name: each.ingredient, id: response };
        })
      )
        .then((result) => {
          const newIngredients = updateNewId(result);
          const editedRecipe: Recipe = {
            ['recipeInfo']: recipeInfo,
            ['ingredients']: newIngredients,
          };
          sendPutRequest(editedRecipe);
        })
        .catch((error) => console.log(error));
    } else {
      const editedRecipe: Recipe = {
        ['recipeInfo']: recipeInfo,
        ['ingredients']: ingredients,
      };
      sendPutRequest(editedRecipe);
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    //*********************//
    // changeDataBackTo4Portions(); -> Here will be "change of poritons"
    if (!isLoading) {
      setIsLoading(true);
      const isValid = validateData(); // current condition is always true
      if (isValid) {
        saveEditedData();
      }
    } else {
      alert('something wrong');
      //*********************//
      //here will be added if meal_type or description is required
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h1 className="Page-title">Create new recipe</h1>
      <div className="Content-main">
        <form onSubmit={onSubmit}>
          <InputRecipeInfo recipeInfo={recipeInfo} setRecipeInfo={setRecipeInfo} />
          <InputIngredients ingredients={ingredients} setIngredients={setIngredients} />
          <div className="btn-group">
            <button type="submit" style={{ opacity: isLoading ? 0.3 : 1 }}>
              {isLoading ? 'Saving' : 'Save'}
            </button>
            <button type="button" className="cancelButton" onClick={() => navigate('/')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
