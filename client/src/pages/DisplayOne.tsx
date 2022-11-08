import './PageStyling.css';
import React, { useEffect, useState, useRef, Component } from 'react';
import dataService, { Recipe, Ingredient, RecipeInfo } from '../DataService';
import { Link, useParams, useHistory } from 'react-router-dom';
import { BsHandThumbsUp, BsHandThumbsUpFill } from 'react-icons/bs';

export function DisplayOne() {
  const [recipe, setRecipe] = useState<Recipe>();
  const [ingredients, setIngredients] = useState<Ingredient[]>();
  const [liked, setliked] = useState<Element | any>();
  //To get navigation by page and id
  const params = useParams();
  const id: string = params.id;

  // Get inital value in load, uses recipe id as source
  // Also loads values recipe and ingredients by setState

  useEffect(() => {
    let id: string = params.id;

    dataService.get(id).then((data) => {
      setRecipe(data);
      setIngredients(data.ingredients);
    });
  }, []);

  // Updates ingredients according to value chosen by user

  function changePortions(portions: number) {
    let newAmounts: Ingredient[];
    let defaultAmounts: Ingredient[] = recipe!.ingredients;
    console.log(defaultAmounts);
    newAmounts = defaultAmounts?.map((i) => ({
      ...i,
      amount: parseFloat(((i.amount / 4) * portions).toPrecision(1)),
    }));
    setIngredients(newAmounts);
  }

  //Like the recipe and updates the database
  function likeRecipe() {
    let thisRecipe: Recipe = recipe!;

    thisRecipe.recipeInfo.popular = !thisRecipe.recipeInfo.popular;
    dataService.edit(thisRecipe);
  }
  return (
    <div className="Content-main">
      <h1 className="Recipe-title">{recipe?.recipeInfo.name}</h1>
      <h5 className="Recipe-tags">Tags: {recipe?.recipeInfo.meal_type}</h5>
      <h6 className="Recipe-new">{recipe?.recipeInfo.new ? 'This is a new recipe!' : null}</h6>
      <h6 className="Recipe-popular">
        {recipe?.recipeInfo.popular ? 'This item is popular right now!' : null}
      </h6>
      <p className="Recipe-description>">{recipe?.recipeInfo.description}</p>
      <div>
        <div>
          <label>Number of portions:&nbsp;</label>
          <select
            name="portions"
            defaultValue={4}
            onChange={(e) => changePortions(parseInt(e.currentTarget.value))}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
          </select>
        </div>
        <table className="Ingredients-main">
          <tbody>
            <tr>
              <th className="Ingredients-header">Ingredients:</th>
              <th></th>
            </tr>
            {ingredients?.map((content) => (
              <tr className="Ingredients-row" key={content.ingredients_id}>
                <td className="Ingredients-cell">
                  {content.amount}&nbsp;{content.unit}
                </td>

                <td className="Ingredients-name">{content.ingredient}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to={'/edit/' + params.id}>
          <button className="Button-navigation">Edit recipe</button>
        </Link>
        <button className="Button-navigation" onClick={() => alert('Add the shopping list here')}>
          Add to shopping list
        </button>
        <button
          className="Button-navigation"
          onClick={() => {
            likeRecipe();
            if (!recipe?.recipeInfo.popular) {
              setliked(<BsHandThumbsUpFill />);
            } else {
              setliked(<BsHandThumbsUp />);
            }
          }}
        >
          {recipe?.recipeInfo.popular ? <BsHandThumbsUpFill /> : <BsHandThumbsUp />}
        </button>
      </div>
      <div>
        <Link to="/">
          <button className="Button-navigation">Back</button>
        </Link>
      </div>
    </div>
  );
}
