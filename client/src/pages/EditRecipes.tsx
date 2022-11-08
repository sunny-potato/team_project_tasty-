import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import dataService, { Recipe, RecipeInfo, Ingredient, EachIngredient } from '../DataService';
import InputRecipeInfo from '../components/InputRecipeInfo';
import InputIngredients from '../components/InputIngredients';
import { useHistory } from 'react-router-dom';

export function EditRecipes() {
  const id = Number(useParams().id);
  // const [recipe, setRecipe] = useState<Recipe>();
  const [recipeInfo, setRecipeInfo] = useState<RecipeInfo>();
  const [ingredients, setIngredients] = useState<Ingredient[]>();

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

  console.log('parent - ingredients ', ingredients);
  // console.log('parent - recipeInfo', recipeInfo);

  if (recipeInfo === undefined || ingredients === undefined) {
    return <div>Loading...</div>;
  }
  const validateIngredients = () => {
    // Ingredient
    // when added ingredients are not changed, they have default value.
    // they should be fixed as right form for the database
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

  const validateData = () => {
    validateIngredients();
    // if meal_type or  description is required, validateRecipeInfo will be added!!!!!!
    // else let's just say that isValid is true!
    return true;
  };

  const saveEditedData = () => {
    // console.log('get data', recipe);
    const editedRecipe: Recipe = { ['recipeInfo']: recipeInfo, ['ingredients']: ingredients };
    console.log(editedRecipe);
    // step 1-  update new ingredients with id = undefined
    // step 2 - if it is done, update the recipe
    //          if it is not,  error message -> then what to do??????
    dataService
      .edit(editedRecipe)
      .then((response) => {
        console.log('reseponse', response);
      })
      .catch((error) => console.log(error));
  };

  const deleteData = () => {
    dataService
      .delete(id)
      .then((response) => {
        alert('success!');
        // const history = useHistory(); -> from here!!!!!!!!!!
        // history.push('/#/');
      })
      .catch((error) => console.log(error));
  };
  return (
    <div>
      <h1 className="page-title">Edit recipe</h1>
      <div className="content-main">
        <form
          onSubmit={(e) => {
            e.preventDefault(); // not submit data
            // changeDataBackTo4Portions(); -> change poritons
            const isValid = validateData();
            if (isValid) {
              saveEditedData();
            } else {
              alert('something wrong');
            }
          }}
        >
          <InputRecipeInfo recipeInfo={recipeInfo} setRecipeInfo={setRecipeInfo} />
          <InputIngredients ingredients={ingredients} setIngredients={setIngredients} />
          <div className="btn-group">
            <button type="submit">Save</button>
            <Link to={`/recipe/${id}`}>
              <button type="button" className="cancelButton">
                Cancel
              </button>
            </Link>
            <button onClick={deleteData}>Delete</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// saveData
// 1. check if all the required information exist
//-> what are required? name/ingredient name
// 2. if missing, show message

// input controll
