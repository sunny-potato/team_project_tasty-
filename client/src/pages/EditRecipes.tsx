import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import dataService, { Recipe, RecipeInfo, Ingredient } from '../DataService';
import RecipeInput from '../components/RecipeInput';
import IngredientInput from '../components/IngredientInput';
/* what to do 
1. get data of recipe 
2. display the data in input
3. check if change of input are shown
4. send the changed data when "save"*/

export function EditRecipes() {
  const id = useParams().id as string;
  let tagList: string[] = ['Dinner', 'Lunch', 'Breakfast', 'Snack', 'Dessert'];
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [ingredients, setIngredients] = useState<Ingredient[] | undefined>();
  const [meal_type, setMeal_type] = useState<string>();

  useEffect(() => {
    dataService.get(id).then((response) => {
      setName(response.recipeInfo.name);
      setDescription(response.recipeInfo.description);
      setMeal_type(response.recipeInfo.meal_type);
      setIngredients(response.ingredients);
    });
  }, []);

  return (
    <div>
      <h1 className="page-title">Edit recipe!</h1>
      <div className="content-main">
        {/* <form>
          <label>
            Name :{' '}
            <input
              type="text"
              name="recipe_name"
              defaultValue={name}
              onChange={(event) => setName(event.currentTarget.value)}
            />
          </label>
        </form>
        <div className="content-tag">
          <div>
            Tag :{' '}
            {tagList.map((tag, index) => {
              if (meal_type == tag) {
                return (
                  <button style={{ backgroundColor: 'lightblue' }} key={index}>
                    {tag}
                  </button>
                );
              } else {
                return <button key={index}>{tag}</button>;
              }
            })}
          </div>
        </div>
        <form>
          <label>
            Description :{' '}
            <input
              type="text"
              name="recipe_description"
              defaultValue={description}
              onChange={(event) => setDescription(event.currentTarget.value)}
            />
          </label>
        </form> */}
        <RecipeInput name={name} meal_type={meal_type} description={description} />
        <IngredientInput ingredients={ingredients} />
        <div className="btn-group">
          <button>Save</button>
          <button>Cancel</button>
        </div>
      </div>
    </div>
  );
}
