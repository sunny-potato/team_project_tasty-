import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dataService, { Recipe, Ingredient, RecipeInfo } from '../DataService';
import './PageStyling.css';
import { NavLink } from "react-router-dom";

export function Home() {
  //Get all recipes and update variable allRecipes with data
  const [allRecipes, setallRecipes] = useState<[]>();
  const [items, setItems] = useState<Recipe[]>([]);

  useEffect(() => {
    dataService.getAll().then((data) => {
      setallRecipes(data);
    });
    getItems();
  }, []);

  const getItems = () => {
    const check = localStorage.getItem('Items')
    
    if (check) {
      dataService.apiExploreData(JSON.parse(check)).then((data) => {
      setItems(data)
      });
    } else {

      dataService.apiExploreKey().then(async (key: string) => {
      const api:Response = await fetch(`https://api.spoonacular.com/recipes/random?apiKey=${key}&number=9`
      );
      const data = await api.json();
      localStorage.setItem('Items', JSON.stringify(data.recipes))
      
      dataService.apiExploreData(data.recipes).then((data) => {
        setItems(data)
      });

      });
    }  
  }

  return (
    <div className="Content-main">
      <h1>Welcome to the Tasty</h1>
      <p>
        Here you can explore your own recipes by adding new content, editing existing ones and
        deleting the ones you don't care about anymore.
      </p>
      <p>
        This is also the place to discover more and get inspiration from, we have selected a few to
        show you from [External API] below.
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
        </ul>
        <div className="Content-second">
          <h5>
          {items?.map((recipe) => { 
          let recipeinfo:RecipeInfo = recipe.recipeInfo
          let ingrediens:Ingredient[] = recipe.ingredients
          
          return(
          <div key={recipeinfo.id}>
            <NavLink to={'/recipe/' + recipeinfo.id}>{recipeinfo.name}</NavLink>
            {ingrediens?.map((ingrediens) => { 
            })}
          </div>
          );

        })}
          </h5>
        </div>

        <div className="Content-second"></div>
      </div>
    </div>
  );
}
