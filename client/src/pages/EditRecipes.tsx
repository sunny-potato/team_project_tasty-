import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import dataService, { Recipe, RecipeInfo, Ingredient, EachIngredient } from '../DataService';
import InputRecipeInfo from '../components/InputRecipeInfo';
import InputIngredients from '../components/InputIngredients';

const initialIngredient: undefined = {
  ingredients_id: undefined,
  ingredient: undefined,
  amount: undefined,
  unit_id: undefined,
  unit: undefined,
};
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

  // console.log(recipeInfo);
  // console.log(ingredients);

  if (recipeInfo === undefined) {
    return <div>Roading...</div>;
  }

  const SetDataInRecipe = (key: string, value: any) => {
    setRecipeInfo({
      ...recipeInfo,
      [key]: value,
    });
  };

  const SetDataIngredients = (key: string, value: any, index: number, id?: number) => {
    let newIngredient;

    if (key == 'amount') {
      value = Number(value);

      newIngredient = {
        ...ingredients[index],
        [key]: value,
      };
    } else {
      let keyId: string = '';
      if (key == 'ingredient') {
        keyId = key + 's_id';
      }
      if (key == 'unit') {
        keyId = key + '_id';
      }
      newIngredient = {
        ...ingredients[index],
        [key]: value,
        [keyId]: id,
      };
    }
    const newIngredients = [
      ...ingredients.slice(0, index),
      newIngredient,
      ...ingredients.slice(index + 1),
    ];
    setIngredients(newIngredients);
  };

  const SetOnChangeValue = (event: any, index?: number, matchedId?: number) => {
    let { name, value } = event.target;
    const id = matchedId;
    if (name == 'name' || name == 'description') {
      SetDataInRecipe(name, value);
    } else {
      SetDataIngredients(name, value, index as number, id);
    }
  };

  const deleteIngredient = (index: number) => {
    const newIngredients = [...ingredients.slice(0, index), ...ingredients.slice(index + 1)];
    setIngredients(newIngredients);
  };

  const addnewIngredient = () => {
    const updatedIngredients: Ingredient[] = [...ingredients, initialIngredient!];
    setIngredients(updatedIngredients);
  };

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
          <InputIngredients
            ingredients={ingredients}
            setIngredients={setIngredients}
            // sendUpdatedIngredients={(updatedIngredients: any) => setIngredients(updatedIngredients)}
            // addnewIngredient={addnewIngredient}
            // onChangeValue={SetOnChangeValue}
            // selectedOneInfo={(selected: any) => {
            //   SetDataIngredients('ingredient', selected.ingredient, selected.index, selected.id);
            // }}
            // deleteIngredient={deleteIngredient}
          />
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
