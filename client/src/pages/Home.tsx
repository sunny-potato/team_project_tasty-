import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dataService from '../DataService';
import '../css/PageStyling.css';
import { RecipeInfo, Recipe } from '../DataService';
import InputIngredients from 'src/components/InputIngredients';

export function Home() {
  //Get all recipes and update variable allRecipes with data
  const [allRecipes, setallRecipes] = useState<Recipe[]>();
  const [filterList, setFilterList] = useState<Recipe[]>();
  const [query, setQuery] = useState('');
  const keys = ['name', 'meal_type', 'description', 'ingredient'];
  useEffect(() => {
    dataService.getAll().then((data) => {
      setallRecipes(data);
      setFilterList(data);
    });
  }, []);

  useEffect(() => {
    if (query === '' || null || undefined) {
      setFilterList(allRecipes);
    } else {
      let search: Recipe[] | undefined = filterList?.filter(
        (m) =>
          m.recipeInfo.name.toLowerCase().includes(query) ||
          m.recipeInfo.description.toLowerCase().includes(query) ||
          m.ingredients.some((i) => i.ingredient.includes(query))
      );

      setFilterList(search);
    }
  }, [query]);

  return (
    <div className="Content-main">
      <div>
        <h1>Welcome to Tasty!</h1>
        <h4>The home of recipes...</h4>
        <p>
          Here you can explore your own recipes by adding new content, editing existing ones and
          deleting the ones you don't care about anymore.
        </p>
        <p>Use the search and filtering function to narrow your search.</p>
      </div>

      <input
        className="Input-search"
        type="text"
        placeholder="Search recipes for name, ingredients and description...."
        value={query}
        onChange={(e) => {
          if (e.currentTarget.value.length < query.length) {
            setFilterList(allRecipes);
            setQuery(e.currentTarget.value.toLowerCase());
          } else {
            setQuery(e.currentTarget.value.toLowerCase());
          }
        }}
      ></input>
      <div className="Content-second">
        {' '}
        {filterList ? (
          filterList.slice(0, 10).map((recipe: Recipe) => (
            <Link key={recipe.recipeInfo.id} to={'/recipe/' + recipe.recipeInfo.id}>
              <button className="Button-recipe-navigation">{recipe.recipeInfo.name}</button>
            </Link>
          ))
        ) : (
          <b>Oops...You have no recipes to show here</b>
        )}
      </div>
    </div>
  );
}
