import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import dataService, {
  Recipe,
  RecipeInfo,
  Ingredient,
  UnitsList,
  IngredientLight,
} from '../DataService';
import SearchIngredient from '../components/SearchIngredient';

export function EditRecipes() {
  const id = Number(useParams().id);

  // temporarily use manual list of unit & tag
  let tagList: string[] = ['Dinner', 'Lunch', 'Breakfast', 'Snack', 'Dessert'];

  const initialValues = {
    recipeInfo: { id: id, name: '', meal_type: '', new: false, popular: false, description: '' },
    ingredients: [],
    // ingredients_length: 0,
  };

  const intialIngredient = {
    ingredients_id: undefined,
    ingredient: undefined,
    amount: undefined,
    unit_id: undefined,
    unit: undefined,
  };

  const [recipe, setRecipe] = useState<Recipe>(initialValues); // recipeinfo
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialValues.ingredients ?? ''); // ingredients
  const [activeTag, setActiveTag] = useState(initialValues.recipeInfo.meal_type); //tag

  const [allUnits, setAllUnits] = useState<UnitsList>([]); // display units
  const [allIngredients, setAllIngredients] = useState<IngredientLight[]>([]); // display ingredients
  const [searchKeyword, setSearchKeyword] = useState<string>(''); // searchkeyword
  const [isVisible, setIsVisible] = useState<boolean>(false); // searchfunction visible
  const [ingredientIndex, setingredientIndex] = useState<number>(); // serachfunction

  const getRecipe = (id: number) => {
    dataService
      .get(id)
      .then((response) => {
        setRecipe(response);
        setIngredients(response.ingredients);
        setActiveTag(response.recipeInfo.meal_type);
      })
      .catch((error) => console.log(error));

    dataService
      .getAllUnits()
      .then((response) => {
        setAllUnits(response);
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
  }, [id]);

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

  const updatedIngredients = (event: any, index: number, id?: number) => {
    let keyValue: string | number;
    let key: string = event.target.name;
    let newIngredient;

    if (key == 'amount') {
      keyValue = event.target.valueAsNumber;
      newIngredient = {
        ...ingredients[index],
        [key]: keyValue,
      };
    } else {
      keyValue = event.target.value;
      if (key == 'unit') {
        newIngredient = {
          ...ingredients[index],
          [key]: keyValue,
          ['unit_id']: id,
        };
      }
      if (key == 'ingredient') {
        setSearchKeyword(keyValue as string);
        newIngredient = {
          ...ingredients[index],
          [key]: keyValue,
          ['ingredients_id']: id,
        };
      }
    }

    const newIngredients = [
      ...ingredients.slice(0, index),
      newIngredient,
      ...ingredients.slice(index + 1),
    ];

    setIngredients(newIngredients);
  };

  const createOptions = () => {
    let option = [];
    for (let i = 1; i < 11; i++) {
      option.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return option;
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
            {createOptions()}
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
                        const matchId = allUnits.find((each) => each.unit == event.target.value);

                        if (matchId === undefined) {
                          return console.log('no found matched Id');
                        }
                        const updatedId = matchId.id;
                        updatedIngredients(event, index, updatedId);
                      }}
                    >
                      {allUnits.map((each) => (
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
                        setIsVisible(true);
                        setingredientIndex(index);
                        updatedIngredients(event, index);
                      }}
                    />
                    {index == ingredientIndex && (
                      <SearchIngredient
                        searchKeyword={searchKeyword}
                        isVisible={isVisible}
                        sendSelectedData={(ingredient) => {
                          const newIngredient: Ingredient = {
                            ...each,
                            ingredients_id: ingredient.id,
                            ingredient: ingredient.ingredient,
                          };

                          const newIngredients = [
                            ...ingredients.slice(0, index),
                            newIngredient,
                            ...ingredients.slice(index + 1),
                          ];

                          setIngredients(newIngredients);
                          setIsVisible(false);
                        }}
                      />
                    )}
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
