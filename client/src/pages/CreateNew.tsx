import React, { useEffect, useState } from 'react';
import dataService, { Recipe, Ingredient, RecipeInfo } from '../DataService';

export function CreateNew() {
  const [newRecipe, setnewRecipe] = useState<Recipe>();

  return (
    <div>
      <div className="Content-main">
        <h1 className="Content-title">Create new recipe</h1>
        <p>
          Instructions Lorem ipsum dolor sit amet consectetur, adipisicing elit. Pariatur placeat
          quasi dolor illum? Assumenda magni architecto velit aspernatur consequuntur cupiditate
          fugit vero tenetur rem perspiciatis exercitationem harum, ratione quas corrupti.
        </p>
        <div className="User-input">
          <input type="text" value="" placeholder="Enter recipe title"></input>
        </div>
        <div className="User-input">
          <textarea
            value=""
            rows={12}
            cols={50}
            placeholder="Enter description of recipe"
          ></textarea>
        </div>
      </div>
    </div>
  );
}
