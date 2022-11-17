import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dataService, { RecipeInfo, Ingredient, Recipe } from '../DataService';
import InputRecipeInfo from '../components/InputRecipeInfo';
import InputIngredients from '../components/InputIngredients';
import { calculateAmounts } from '../components/ChangePortions';

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
  const [portionsInfo, setPortionsInfo] = useState<number>(4);

  const saveEditedData = (defaultIngredients: Ingredient[]) => {
    const sendPutRequest = (newRecipe: Recipe) => {
      dataService
        .create(newRecipe)
        .then((response) => {
          navigate(`/recipe/${response}`);
        })
        .catch((error) => console.log(error));
    };

    const isMissingIngredientId = defaultIngredients.filter((ingredient: Ingredient) => {
      if (ingredient.ingredients_id === undefined) return ingredient;
    });

    if (isMissingIngredientId.length > 0) {
      const updateNewId = (newIdList: any) => {
        newIdList.map((newId: any) => {
          defaultIngredients.map((each) => {
            if (newId.name == each.ingredient) {
              each.ingredients_id = newId.id;
            }
          });
        });
        return defaultIngredients;
      };

      Promise.all(
        isMissingIngredientId.map(async (each: Ingredient) => {
          //@ts-ignore
          const response = await dataService.createIngredient(each.ingredient);
          return { name: each.ingredient, id: response };
        })
      )
        .then((result) => {
          const validIngredients = updateNewId(result);
          const editedRecipe: Recipe = {
            ['recipeInfo']: recipeInfo,
            ['ingredients']: validIngredients,
          };
          sendPutRequest(editedRecipe);
        })
        .catch((error) => console.log(error));
    } else {
      const editedRecipe: Recipe = {
        ['recipeInfo']: recipeInfo,
        ['ingredients']: defaultIngredients,
      };
      sendPutRequest(editedRecipe);
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isLoading) {
      setIsLoading(true);

      // make ingredients with defaultAmounts(=4 portions)
      const defaultIngredients: Ingredient[] | any = calculateAmounts(ingredients, portionsInfo);

      // manipulate data of ingredients to be valid in the database
      defaultIngredients.map((ingredient: Ingredient | any) => {
        if (ingredient.amount === 0) {
          ingredient.amount = null;
        }
        if (ingredient.unit_id === 0 || ingredient.unit === 'initalUnit') {
          ingredient.unit_id = 1;
          ingredient.unit = '';
        }
      });
      saveEditedData(defaultIngredients);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h1 className="Page-title">Create new recipe</h1>
      <div className="Content-main">
        <div className="Input-new"></div>
        <form onSubmit={onSubmit}>
          <InputRecipeInfo recipeInfo={recipeInfo} setRecipeInfo={setRecipeInfo} />
          <InputIngredients
            ingredients={ingredients}
            setIngredients={setIngredients}
            portionsInfo={(currentPortions: number) => setPortionsInfo(currentPortions)}
          />
          <div className="Content-second">
            <button
              className="Button-navigation"
              type="submit"
              style={{ opacity: isLoading ? 0.3 : 1 }}
            >
              {isLoading ? 'Saving' : 'Save'}
            </button>
            <button type="button" className="Button-navigation" onClick={() => navigate('/')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
