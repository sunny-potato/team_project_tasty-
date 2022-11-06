import "./PageStyling.css";
import React, { useEffect, useState} from "react";
import dataService, { Recipe, Ingredient, RecipeInfo } from "../DataService";
import { NavLink } from "react-router-dom";

export function Explore() {

  const [items, setItems] = useState<Recipe[]>([]);


    // Get inital value in load, uses recipe id as source
  useEffect(() => {
    getItems();
  },[])

  //geting the API request, unless you already have one inside localStorage
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

  //what the page sees
  return (
    <div className="Content-main">
      <h1>A place to discover new recipes, API or other</h1>
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
    </div>
  );
}
// <img src={recipe.image} alt={recipeinfo.name}></img>
