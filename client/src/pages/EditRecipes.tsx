import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import dataService, { RecipeInfo, Ingredient } from '../DataService';
import InputRecipeInfo from '../components/InputRecipeInfo';
import InputIngredients from '../components/InputIngredients';
import { ValidateData, SaveEditedData } from '../components/SaveInputData';

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

  // console.log('parent - ingredients ', ingredients);
  // console.log('parent - recipeInfo', recipeInfo);

  if (recipeInfo === undefined || ingredients === undefined) {
    return <div>Loading...</div>;
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    //*********************//
    // changeDataBackTo4Portions(); -> Here will be "change of poritons"

    if (!isLoading) {
      setIsLoading(true);
      const isValid = ValidateData({ ingredients }); // current condition is always true
      if (isValid) {
        SaveEditedData({ ingredients, recipeInfo, id });
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
      .then((response) => {
        console.log('delete response', response);
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
            <button type="submit" style={{ opacity: isLoading ? 0.3 : 1 }}>
              {isLoading ? 'Saving' : 'Save'}
            </button>
            <button type="button" className="cancelButton" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button onClick={deleteData}>Delete</button>
          </div>
        </form>
      </div>
    </div>
  );
}
