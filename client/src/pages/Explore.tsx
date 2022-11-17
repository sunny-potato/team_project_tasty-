import '../css/PageStyling.css';
import React, { useEffect, useState } from 'react';
import dataService, { ApiRecipe, ApiIngredient, ApiRecipeInfo } from '../DataService';
import { Link, NavLink } from 'react-router-dom';

export function Explore() {
  const [items, setItems] = useState<ApiRecipe[]>([]);

  // Get inital value in load, uses recipe id as source
  useEffect(() => {
    getItems();
  }, []);

  //geting the API request, unless you already have one inside localStorage
  const getItems = () => {
    const check = localStorage.getItem('Items');

    if (check) {
      dataService.apiExploreData(JSON.parse(check)).then((data) => {
        setItems(data);
      });
    } else {
      dataService.apiExploreKey().then(async (key: string) => {
        const api: Response = await fetch(
          `https://api.spoonacular.com/recipes/random?apiKey=${key}&number=9`
        );
        const data = await api.json();
        localStorage.setItem('Items', JSON.stringify(data.recipes));

        dataService.apiExploreData(data.recipes).then((data) => {
          setItems(data);
        });
      });
    }
  };

  return (
    <div className="Content-main">
      <h1>Explore new recipes</h1>
      <p>This is the place to gather new inspiration for your next adventure in the kitchen!</p>
      <div className="Content-second">
        {' '}
        {items ? (
          items.map((recipe: ApiRecipe) => (
            <div className="Picture-link" key={recipe.recipeInfo.id}>
              <div>
                <Link to={'/recipe/' + recipe.recipeInfo.id}>
                  <img title={recipe.recipeInfo.name} src={recipe.recipeInfo.image}></img>
                </Link>
              </div>
              <div className="Picture-link-text">{recipe.recipeInfo.name}</div>
            </div>
          ))
        ) : (
          <b>Oops...We have trouble getting recipes from outside</b>
        )}
      </div>
    </div>
  );
}
