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
  //   const [recipe, setRecipe] = useState<Recipe>();
  const [recipeInfo, setRecipeInfo] = useState<RecipeInfo>();
  const [activeTag, setActiveTag] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const getData = () => {
    dataService
      .get(id)
      .then((response) => {
        // setRecipe(response);
        setRecipeInfo(response.recipeInfo);
        setActiveTag(response.recipeInfo.meal_type);
        setIngredients(response.ingredients);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    SetDataInRecipe('meal_type', activeTag);
  }, [activeTag]);

  const ToggleTag = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag('');
    } else {
      setActiveTag(tag);
    }
  };
  // console.log(recipeInfo);
  console.log(ingredients);

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
    const gatherData = { ['recipeInfo']: recipeInfo, ['ingredient']: ingredients };
    console.log(gatherData);
    // console.log(recipeInfo, ingredients);
    // dataService
    //   .edit(id)
    //   .then((response) => {
    //     console.log('reseponse', response);
    //   })
    //   .catch((error) => console.log(error));
  };

  if (recipeInfo === undefined) {
    return <div>Roading...</div>;
  }

  return (
    <div>
      <h1 className="page-title">Edit recipe</h1>
      <div className="content-main">
        <InputRecipeInfo
          nameValue={recipeInfo.name}
          descriptionValue={recipeInfo.description}
          onChangeValue={SetOnChangeValue}
          activeTag={activeTag}
          toggleTag={ToggleTag}
        />
        <InputIngredients
          tableName={'Ingredients'}
          addnewIngredient={addnewIngredient}
          ingredients={ingredients}
          onChangeValue={SetOnChangeValue}
          selectedOneInfo={(selected: any) => {
            SetDataIngredients('ingredient', selected.ingredient, selected.index, selected.id);
          }}
          deleteIngredient={deleteIngredient}
        />
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
