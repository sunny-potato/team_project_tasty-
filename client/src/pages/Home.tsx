import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dataService from '../DataService';
import '../css/PageStyling.css';
import { RecipeInfo, Recipe } from '../DataService';
import { ImCross } from 'react-icons/im';
import InputIngredients from 'src/components/InputIngredients';

export function Home() {
  //Get all recipes and update variable allRecipes with data
  const [allRecipes, setAllRecipes] = useState<Recipe[]>();
  const [queryList, setQueryList] = useState<Recipe[]>();
  const [filterList, setFilterList] = useState<Recipe[]>();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const tagKeys = ['Dinner', 'Lunch', 'Breakfast', 'Snack', 'Dessert', 'Popular', 'New'];
  useEffect(() => {
    dataService.getAll().then((data) => {
      setAllRecipes(data);
      setFilterList(data);
      setQueryList(data);
    });
  }, []);

  useEffect(() => {
    if (query.length === 0 || null || undefined) {
      // setQueryList(allRecipes);
    } else {
      // if (query.includes('popular')) {
      //   let search: Recipe[] | any = filterList?.filter((m) => m.recipeInfo.popular === true);
      //   setFilterList(search);
      // } else if (query.includes('new')) {
      //   let search: Recipe[] | any = filterList?.filter((m) => m.recipeInfo.new === true);
      //   setFilterList(search);
      // } else {
      let search: Recipe[] | any = filterList?.filter(
        (m) =>
          m.recipeInfo.name.toLowerCase().includes(query) ||
          m.recipeInfo.description.toLowerCase().includes(query) ||
          m.ingredients.some((i) => i.ingredient.includes(query))
      );

      setQueryList(search);
    }
    // }
  }, [query]);

  useEffect(() => {
    if (filter === '' || filter === undefined || filter === null) {
      setFilterList(allRecipes);
      setQueryList(allRecipes);
    } else if (filter.includes('popular')) {
      let filtered: Recipe[] | any = allRecipes?.filter((m) => m.recipeInfo.popular === true);
      setFilterList(filtered);
      setQueryList(filtered);
    } else if (filter.includes('new')) {
      let filtered: Recipe[] | any = allRecipes?.filter((m) => m.recipeInfo.new === true);
      setFilterList(filtered);
      setQueryList(filtered);
    } else {
      let filtered: Recipe[] | any = allRecipes?.filter((t) =>
        t.recipeInfo.meal_type.toLowerCase().includes(filter)
      );
      setFilterList(filtered);
      setQueryList(filtered);
    }
  }, [isClicked]);

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
          setQuery(e.currentTarget.value.toLowerCase());
        }}
      ></input>
      <h5 className="Extra-information">Filters:</h5>
      <div>
        {isClicked ? (
          <button
            className="Button-filter-active"
            key={filter}
            value={''}
            onClick={(e) => {
              setFilter('');
              setIsClicked(!isClicked);
            }}
          >
            <ImCross />
            &nbsp;{filter}
          </button>
        ) : (
          tagKeys.map((e) => (
            <button
              className="Button-filter"
              key={e}
              value={e}
              onClick={(e) => {
                setQuery('');
                setFilter(e.currentTarget.value.toLowerCase());
                setIsClicked(!isClicked);
              }}
            >
              {e}
            </button>
          ))
        )}
      </div>
      <div className="Content-second">
        {' '}
        {queryList ? (
          queryList.slice(0, 8).map((recipe: Recipe) => (
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
