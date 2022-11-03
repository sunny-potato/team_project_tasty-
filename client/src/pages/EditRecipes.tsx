import { react } from '@babel/types';
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import dataService, {
  Recipe,
  RecipeInfo,
  Ingredient,
  UnitsList,
  IngredientsList,
} from '../DataService';

/* what to do 
3. check if change of input are shown
4. send the changed data when "save"*/

export function EditRecipes() {
  // const { id } = useParams();
  const id = Number(useParams().id);

  // temporarily use manual list of unit & tag
  let tagList: string[] = ['Dinner', 'Lunch', 'Breakfast', 'Snack', 'Dessert'];

  const initialInfo = {
    id: id,
    name: '',
    meal_type: '',
    new: false,
    popular: false,
    description: '',
  };
  const initialValues = {
    recipeInfo: initialInfo,
    ingredients: [],
    ingredients_length: 0,
  };

  const intialIngredient = {
    ingredients_id: undefined,
    ingredient: undefined,
    amount: undefined,
    unit_id: undefined,
    unit: undefined,
  };

  const [recipe, setRecipe] = useState<Recipe>(initialValues);
  // const [recipeInfo, setRecipeInfo] = useState<RecipeInfo>(initialValues.recipeInfo ?? '');
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialValues.ingredients ?? '');
  // const [isTagActive, setIsTagActive] = useState<boolean>(false);
  // const [numberOfRows, setNumberOfRows] = useState<number>(initialValues.ingredients_length);
  // const [tableRows, setTableRows] = useState<any[]>([]);
  const [activeTag, setActiveTag] = useState(initialValues.recipeInfo.meal_type);
  const [units, setUnits] = useState<UnitsList[]>([]);
  const [AllIngredients, setAllIngredients] = useState<IngredientsList[]>([]);
  // console.log(AllIngredients);
  const getRecipe = (id: number) => {
    dataService
      .get(id)
      .then((response) => {
        setRecipe(response);
        setIngredients(response.ingredients);
        // setNumberOfRows(response.ingredients.length);
        setActiveTag(response.recipeInfo.meal_type);
      })
      .catch((error) => console.log(error));

    dataService
      .getAllUnits()
      .then((response) => {
        setUnits(response);
      })
      .catch((error) => console.log(error));

    dataService
      .getAllIngredients()
      .then((response) => {
        setAllIngredients(response);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    if (id) getRecipe(id);
  }, [id]); // refresh when id changed

  const toggleTag = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag('');
    } else {
      setActiveTag(tag);
    }
  };

  const addnewIngredientRow = () => {
    const updatedIngredients = [...ingredients, intialIngredient];
    setIngredients(updatedIngredients);
  };

  console.log(ingredients);

  const updatedIngredients = (event: any, index: number) => {
    let keyValue: string | number;
    let key: string = event.target.name;

    if (key == 'amount') {
      keyValue = event.target.valueAsNumber;
    } else {
      keyValue = event.target.value;
    }
    const newIngredient = {
      ...ingredients[index],
      [key]: keyValue,
    };
    const newIngredients = [
      ...ingredients.slice(0, index),
      newIngredient,
      ...ingredients.slice(index + 1),
    ];

    setIngredients(newIngredients);
  };
  if (recipe === undefined) {
    return <div>Loading</div>;
  }
  return (
    <div>
      <h1 className="page-title">Edit recipe!</h1>
      <div className="content-main">
        <form>
          <label>
            Name :{' '}
            <input
              type="text"
              name="name"
              value={recipe.recipeInfo.name}
              onChange={(event) => {
                setRecipe({
                  ...recipe,
                  recipeInfo: {
                    ...recipe.recipeInfo,
                    name: event.currentTarget.value,
                  },
                });
              }}
            />
          </label>
        </form>
        <div className="content-tag">
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
        </form>
        <form className="content-portions">
          <label>Number of portions </label>
          <select name="portions" defaultValue={4}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
          </select>
        </form>
        <div className="content-ingredients">
          <table>
            <tbody>
              <tr>
                <th>Ingredients</th>
                <th>
                  {' '}
                  <button onClick={addnewIngredientRow}>+Add</button>
                </th>
              </tr>
              {ingredients.map((each, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="number"
                      name="amount"
                      value={each.amount || ''}
                      onChange={(event) => {
                        updatedIngredients(event, index);
                      }}
                    />
                    <select
                      name="unit"
                      value={each.unit}
                      onChange={(event) => {
                        const updatedUnit = units.find((each) => {
                          if (each.unit === event.target.value) {
                            return each;
                          }
                        });
                        console.log(updatedUnit.id, updatedUnit.unit);
                        // id & value
                        updatedIngredients(event, index);
                      }}
                    >
                      {units.map((each) => (
                        <option key={each.id} value={each.unit}>
                          {each.unit}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      name="ingredient"
                      value={each.ingredient}
                      onChange={(event) => {
                        // const updatedIngredients = units.find((each) => {
                        //   if (each.unit === event.target.value) {
                        //     return each;
                        //   }
                        // });
                        updatedIngredients(event, index);
                      }}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        const newIngredients = [
                          ...ingredients.slice(0, index),
                          ...ingredients.slice(index + 1),
                        ];
                        setIngredients(newIngredients);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="btn-group">
          <button>Save</button>
          <button>Cancel</button>
        </div>
      </div>
    </div>
  );
}
