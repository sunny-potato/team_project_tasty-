import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import dataService, { RecipeInfo, Ingredient, Recipe } from '../DataService';
import InputRecipeInfo from '../components/InputRecipeInfo';
import InputIngredients from '../components/InputIngredients';

export function EditRecipes() {
  const navigate = useNavigate();
  const id = Number(useParams().id);
  const [recipeInfo, setRecipeInfo] = useState<RecipeInfo>();
  const [ingredients, setIngredients] = useState<Ingredient[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getData = () => {
    dataService
      .get(id)
      .then((response) => {
        setRecipeInfo(response.recipeInfo);
        setIngredients(response.ingredients);
        //*********************//
        // const changedRecipeInfo = changeRecipeInfo(response.recipeInfo); -> Here will be "change of poritons"
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getData();
  }, []);

  if (recipeInfo === undefined || ingredients === undefined) {
    return <div>Loading...</div>;
  }

  const validateData = () => {
    const validateIngredients = () => {
      // validate data which are added but onchanged (=default value)
      ingredients.map((ingredient: Ingredient) => {
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
    // if meal_type or description is required, validateRecipeInfo will be added!!!!!!
    // otherwise let's just say that isValid is true!
    //*********************//
    return true;
  };

  const saveEditedData = () => {
    const sendPutRequest = (newRecipe: Recipe) => {
      dataService
        .edit(newRecipe)
        .then(() => {
          alert('The recipe updated');
          navigate(`/recipe/${id}`);
        })
        .catch((error) => console.log(error));
    };

    const isMissingIngredientId = ingredients.filter((ingredient: Ingredient) => {
      if (ingredient.ingredients_id === undefined) return ingredient;
    });

    if (isMissingIngredientId.length > 0) {
      const updateNewId = (newIdList: any) => {
        newIdList.map((newId: any) => {
          ingredients.map((each) => {
            if (newId.name == each.ingredient) {
              each.ingredients_id = newId.id;
            }
          });
        });
        return ingredients;
      };

      Promise.all(
        isMissingIngredientId.map(async (each: Ingredient) => {
          //@ts-ignore
          const response = await dataService.createIngredient(each.ingredient);
          return { name: each.ingredient, id: response };
        })
      )
        .then((result) => {
          const newIngredients = updateNewId(result);
          const editedRecipe: Recipe = {
            ['recipeInfo']: recipeInfo,
            ['ingredients']: newIngredients,
          };
          sendPutRequest(editedRecipe);
        })
        .catch((error) => console.log(error));
    } else {
      const editedRecipe: Recipe = {
        ['recipeInfo']: recipeInfo,
        ['ingredients']: ingredients,
      };
      sendPutRequest(editedRecipe);
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    //*********************//
    // changeDataBackTo4Portions(); -> Here will be "change of poritons"

    if (!isLoading) {
      setIsLoading(true);
      const isValid = validateData(); // current condition is always true
      if (isValid) {
        saveEditedData();
      }
    } else {
      alert('something wrong');
      //*********************//
      //here will be added f meal_type or description is required
    }
    setIsLoading(false);
  };

  const deleteData = () => {
    dataService
      .delete(id)
      .then(() => {
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
