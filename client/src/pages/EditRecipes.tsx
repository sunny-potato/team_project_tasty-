import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import dataService, { Recipe, RecipeInfo, Ingredient, EachIngredient } from '../DataService';
import InputRecipeInfo from '../components/InputRecipeInfo';
import InputIngredients from '../components/InputIngredients';
import { useNavigate } from 'react-router-dom';

export function EditRecipes() {
  const navigate = useNavigate();
  const id = Number(useParams().id);
  // const [recipe, setRecipe] = useState<Recipe>();
  const [recipeInfo, setRecipeInfo] = useState<RecipeInfo>();
  const [ingredients, setIngredients] = useState<Ingredient[]>();
  const [updatedIngredients, setUpdatedIngredients] = useState<{ name: string; id: number }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [isIdUndefined, setIsIdUndefined] = useState<boolean>(false);

  const getData = () => {
    dataService
      .get(id)
      .then((response) => {
        // setRecipe(response);
        setRecipeInfo(response.recipeInfo);
        setIngredients(response.ingredients);
        // const changedRecipeInfo = changeRecipeInfo(response.recipeInfo); -> change poritons
        // setRecipeInfo(changedRecipeInfo);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getData();
  }, []);

  // console.log('parent - ingredients ', ingredients);
  // console.log('parent - recipeInfo', recipeInfo);

  if (recipeInfo === undefined || ingredients === undefined) {
    return <div>Loading...</div>;
  }

  const validateData = () => {
    const validateIngredients = () => {
      // validate data which are added but onchanged (=default value)
      ingredients.map((ingredient) => {
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
    // if meal_type or  description is required, validateRecipeInfo will be added!!!!!!
    // else let's just say that isValid is true!
    return true;
  };
  console.log(ingredients);
  const saveEditedData = () => {
    // step 1
    // find ingredients with undefined id
    const undefinedIdList = ingredients.filter((ingredient) => {
      if (ingredient.ingredients_id === undefined) return ingredient;
    });
    if (undefinedIdList.length > 0) {
      // step 1-1
      // update and get the ingredients with id
      Promise.all(
        undefinedIdList.map(async (each) => {
          const response = await dataService.createIngredient(each.ingredient);
          return { name: each.ingredient, id: response };
        })
      )
        .then((result) => {
          putCreatedId(result);
        })
        .catch((error) => console.log(error));

      const putCreatedId = (createdId: any) => {
        createdId.map((newId: any) => {
          ingredients.map((each) => {
            if (newId.name == each.ingredient) {
              each.ingredients_id = newId.id;
            }
          });
        });
        setIngredients(ingredients);
      };
    }

    // step 2
    // recipe = recipeinfo + ingrediente
    const editedRecipe: Recipe = { ['recipeInfo']: recipeInfo, ['ingredients']: ingredients };
    console.log(editedRecipe);
    // step 3
    dataService
      .edit(editedRecipe)
      .then((response) => {
        console.log('reseponse', response);
      })
      .catch((error) => console.log(error));
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // not submit data
    // changeDataBackTo4Portions(); -> change poritons
    // setUpdatedIngredients((pre: any) => [...pre, { test: 'test', id: id }]);
    // console.log(updatedIngredients);
    // if (!isLoading) {
    //   setIsLoading(true);
    const isValid = validateData(); // current condition is always true
    if (isValid) {
      // console.log('onSubmit');
      saveEditedData();
      // step 4
      // dispaly upated data in new page
    }

    // console.log(isLoading);
    // else {
    //   alert('something wrong');
    // }
    // setIsLoading(false);
    // }
  };

  const deleteData = () => {
    dataService
      .delete(id)
      .then((response) => {
        console.log('delete response', response);
        alert('The recipe has been deleted!');
        navigate('/');
      })
      .catch((error) => console.log(error));
  };
  return (
    <div>
      <h1 className="Page-title">Edit recipe</h1>
      <div className="Content-main">
        <form onSubmit={onSubmit}>
          <InputRecipeInfo recipeInfo={recipeInfo} setRecipeInfo={setRecipeInfo} />
          <InputIngredients ingredients={ingredients} setIngredients={setIngredients} />
          <div className="btn-group">
            <button type="submit" style={{ opacity: isLoading ? 0.3 : 1 }}>
              {isLoading ? 'Saving' : 'Save'}
            </button>
            <button type="button" className="cancelButton" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button onClick={deleteData}>Delete</button>
          </div>
        </form>
      </div>
    </div>
  );
}
