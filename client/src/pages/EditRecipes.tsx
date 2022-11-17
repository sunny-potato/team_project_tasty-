import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import dataService, { RecipeInfo, Ingredient, Recipe } from '../DataService';
import InputRecipeInfo from '../components/InputRecipeInfo';
import InputIngredients from '../components/InputIngredients';
import { calculateAmounts } from '../components/ChangePortions';

export function EditRecipes() {
  const navigate = useNavigate();
  const id = Number(useParams().id);
  const [recipeInfo, setRecipeInfo] = useState<RecipeInfo>();
  const [ingredients, setIngredients] = useState<Ingredient[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [portionsInfo, setPortionsInfo] = useState<number>(4);

  console.log(ingredients);

  const getData = () => {
    dataService
      .get(id)
      .then((response) => {
        setRecipeInfo(response.recipeInfo);
        setIngredients(response.ingredients);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getData();
  }, []);

  if (recipeInfo === undefined || ingredients === undefined) {
    return <div>Loading...</div>;
  }

  const saveEditedData = (defaultIngredients: Ingredient[]) => {
    const sendPutRequest = (newRecipe: Recipe) => {
      dataService
        .edit(newRecipe)
        .then(() => {
          alert('The recipe updated');
          navigate(`/recipe/${id}`);
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

  const deleteData = () => {
    dataService
      .delete(id)
      .then(() => {
        navigate(-2);
      })
      .catch((error) => console.log(error));
  };
  return (
    <div>
      <h1 className="Page-title">Edit recipe</h1>
      <div className="Content-main">
        <form onSubmit={onSubmit}>
          <InputRecipeInfo recipeInfo={recipeInfo} setRecipeInfo={setRecipeInfo} />
          <InputIngredients
            ingredients={ingredients}
            setIngredients={setIngredients}
            portionsInfo={(currentPortions: number) => setPortionsInfo(currentPortions)}
          />
          <div className="btn-group">
            <button
              className="Button-navigation"
              type="submit"
              style={{ opacity: isLoading ? 0.3 : 1 }}
            >
              {isLoading ? 'Saving' : 'Save'}
            </button>
            <button type="button" className="Button-navigation" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button className="Button-navigation" onClick={deleteData}>
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
