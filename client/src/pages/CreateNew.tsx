import React, { useState } from 'react';
import { RecipeInfo, Ingredient } from '../DataService';
import InputRecipeInfo from '../components/InputRecipeInfo';
import InputIngredients from '../components/InputIngredients';
import { useNavigate } from 'react-router-dom';
import { ValidateData, SaveEditedData } from '../components/SaveInputData';

const initialRecipeInfo: RecipeInfo = {
  id: undefined!,
  name: '',
  meal_type: '',
  new: false,
  popular: false,
  description: '',
};

const initialIngredient: Ingredient = {
  ingredients_id: undefined!,
  ingredient: '',
  amount: null,
  unit_id: 0,
  unit: 'initalUnit',
};

export function CreateNew() {
  const navigate = useNavigate();
  const [recipeInfo, setRecipeInfo] = useState<RecipeInfo>(initialRecipeInfo);
  const [ingredients, setIngredients] = useState<Ingredient[]>([initialIngredient]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // console.log(recipeInfo);
  // console.log(ingredients);
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!isLoading) {
      setIsLoading(true);
      const isValid = ValidateData({ ingredients }); // current condition is always true
      if (isValid) {
        SaveEditedData({ ingredients, recipeInfo });
      }
    } else {
      alert('something wrong');
      //*********************//
      //here will be added f meal_type or description is required
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h1 className="Page-title">Create new recipe</h1>
      <div className="Content-main">
        <form onSubmit={onSubmit}>
          <InputRecipeInfo recipeInfo={recipeInfo} setRecipeInfo={setRecipeInfo} />
          <InputIngredients ingredients={ingredients} setIngredients={setIngredients} />
          <div className="btn-group">
            <button type="submit" style={{ opacity: isLoading ? 0.3 : 1 }}>
              {isLoading ? 'Saving' : 'Save'}
            </button>
            <button type="button" className="cancelButton" onClick={() => navigate('/')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
