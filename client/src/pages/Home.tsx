import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dataService from '../DataService';
import './PageStyling.css';
import { RecipeInfo } from '../DataService';

export function Home() {
  const [allRecipes, setallRecipes] = useState<[]>();
  useEffect(() => {
    dataService.getAll().then((data) => {
      setallRecipes(data);
    });
  }, []);

  return (
    <div className="Content-main">
      <h1>Welcome to the homepage</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit laboriosam officia ad.
        Magnam, itaque. Cum, libero natus? Ipsum, quod. Aut, fugit vel minus temporibus adipisci
        architecto itaque eaque accusamus quibusdam?
      </p>
      <div>
        <ul>
          {allRecipes?.map((recipe: RecipeInfo) => (
            <Link key={recipe.id} to={'/recipe/' + recipe.id}>
              <button className="Button-recipe-navigation">{recipe.name}</button>
            </Link>
          ))}
        </ul>
        <div>
          <h5>Place for external API recipes here</h5>
        </div>
      </div>
    </div>
  );
}
