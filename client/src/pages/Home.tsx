import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dataService, { Recipe } from '../DataService';
import '../css/PageStyling.css';
import { RecipeInfo } from '../DataService';

export function Home() {
  //Get all recipes and update variable allRecipes with data
  const [allRecipes, setallRecipes] = useState<[]>();

  function searchContent() {}
  return (
    <div className="Content-main">
      <h1>Welcome to Tasty!</h1>
      <h4>The home of recipes...</h4>
      <p>
        Here you can explore your own recipes by adding new content, editing existing ones and
        deleting the ones you don't care about anymore.
      </p>
      <p>Use the search and filtering function to narrow your search.</p>
      <input type="text" className="Search-input" placeholder="Search" onChange={() => {}}></input>
      <div className="Content-second">
        <div>
          {' '}
          {allRecipes ? (
            allRecipes.slice(0, 10).map((recipe: RecipeInfo) => (
              <Link key={recipe.id} to={'/recipe/' + recipe.id}>
                <button className="Button-recipe-navigation">{recipe.name}</button>
              </Link>
            ))
          ) : (
            <b>Oops...You have no recipes to show here</b>
          )}
        </div>

        <div className="Content-second">
          <p>
            This is also the place to discover more and get inspiration from, we have selected a few
            to show you from below.
          </p>
        </div>
      </div>
    </div>
  );
}
