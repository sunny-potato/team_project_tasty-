import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import dataService, { Recipe, RecipeInfo, Ingredient, EachIngredient } from '../DataService';
import InputRecipeInfo from '../components/InputRecipeInfo';
import InputIngredients from '../components/InputIngredients';

export function EditRecipes() {
  const id = Number(useParams().id);
  // const [recipe, setRecipe] = useState<Recipe>();
  const [recipeInfo, setRecipeInfo] = useState<RecipeInfo>();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const getData = () => {
    dataService
      .get(id)
      .then((response) => {
        // setRecipe(response);
        setRecipeInfo(response.recipeInfo);
        setIngredients(response.ingredients);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    getData();
  }, []);

  console.log('parent ', ingredients);
  // console.log('parent', recipeInfo);

  if (recipeInfo === undefined) {
    return <div>Roading...</div>;
  }

  const saveEditedData = () => {
    // console.log('get data', recipe);
    const editedRecipe: Recipe = { ['recipeInfo']: recipeInfo, ['ingredients']: ingredients };
    console.log(editedRecipe);
    // dataService
    //   .edit(editedRecipe)
    //   .then((response) => {
    //     console.log('reseponse', response);
    //   })
    //   .catch((error) => console.log(error));
  };

  return (
    <div>
      <h1 className="page-title">Edit recipe</h1>
      <div className="content-main">
        <form>
          <InputRecipeInfo
            recipeInfo={recipeInfo}
            sendUpdatedRecipeInfo={(updatedRecipeInfo) => setRecipeInfo(updatedRecipeInfo)}
          />
          <InputIngredients ingredients={ingredients} setIngredients={setIngredients} />
        </form>
      </div>
      <div className="btn-group">
        <button onClick={saveEditedData}>Save</button>
        <Link to={`/recipe/${id}`}>
          <button className="cancelButton">Cancel</button>
        </Link>
      </div>
    </div>
  );
}

// saveData
// 1. check if all the required information exist
//-> what are required? name/ingredient name
// 2. if missing, show message

// input controll
