import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import dataService, {
  Recipe,
  RecipeInfo,
  Ingredient,
  UnitsList,
  IngredientsList,
} from '../DataService';

{
  /* <EditRecipeInfo recipeId={id} /> */
}

type Props = {
  recipeInfo: RecipeInfo;
  changeName(): void;
};

// const initialValues = {
//   recipeInfo: {
//     id: 0,
//     name: '',
//     meal_type: '',
//     new: false,
//     popular: false,
//     description: '',
//   },
//   ingredients: [],
// };

const EditRecipeInfo = (props: Props) => {
  // const [recipe, setRecipe] = useState<Recipe>(initialValues);
  // console.log(recipe);
  // const getRecipe = (id: number) => {
  //   dataService
  //     .get(id)
  //     .then((response) => {
  //       setRecipe(response);
  // setIngredients(response.ingredients);
  // setNumberOfRows(response.ingredients.length);
  // setActiveTag(response.recipeInfo.meal_type);
  //     })
  //     .catch((error) => console.log(error));
  // };
  // useEffect(() => {
  //   if (props.recipeId) getRecipe(props.recipeId);
  // }, [props.recipeId]); // refresh when id changed

  // if (recipe === undefined) {
  //   return <div>Loading</div>;
  // }
  const updateName = {
    // setRecipe({
    //   ...recipe,
    //   recipeInfo: {
    //     ...recipe.recipeInfo,
    //     name: event.currentTarget.value,
    //   },
    // });
  };
  return (
    <div>
      <form>
        <label>
          Name :{' '}
          <input type="text" name="name" value={props.recipeInfo.name} onChange={changeName} />
        </label>
      </form>
      {/* <div className="content-tag">
        <div>
          Tag :
          {tagList.map((tag, index) => {
            return (
              <button
                style={{
                  backgroundColor: activeTag === tag ? 'lightblue' : 'white',
                }}
                key={index}
                onClick={() => {
                  toggleTag(tag);
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
      <form>
        <label>
          Description :{' '}
          <input
            type="text"
            name="description"
            value={recipe.recipeInfo.description}
            onChange={(event) =>
              setRecipe({
                ...recipe,
                recipeInfo: { ...recipe.recipeInfo, description: event.target.value },
              })
            }
          />
        </label>
      </form> */}
    </div>
  );
};

export default EditRecipeInfo;
