import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dataService from '../DataService';
import './PageStyling.css';
import { RecipeInfo } from '../DataService';

export function Home() {
  //Get all recipes and update variable allRecipes with data
  const [allRecipes, setallRecipes] = useState<[]>();
  useEffect(() => {
    dataService.getAll().then((data) => {
      console.log(data);
      setallRecipes(data);
    });
  }, []);

  return (
    <div className="Content-main">
      <h1>Welcome to the Tasty</h1>
      <p>
        Here you can explore your own recipes by adding new content, editing existing ones and
        deleting the ones you don't care about anymore.
      </p>
      <div className="Content-second">
        <div>
          {' '}
          {allRecipes ? (
            allRecipes.map((recipe: RecipeInfo) => (
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
