import './PageStyling.css';
import React, { useEffect, useState, useRef, Component } from 'react';
import dataService, { Recipe, Ingredient, RecipeInfo } from '../DataService';
import { Link, useParams, useLocation } from 'react-router-dom';
import { BsHandThumbsUp, BsHandThumbsUpFill, BsPrinter } from 'react-icons/bs';
import { RiShoppingCart2Line } from 'react-icons/ri';

export function DisplayOne() {
  const [recipe, setRecipe] = useState<Recipe>();
  const [ingredients, setIngredients] = useState<Ingredient[]>();
  const [liked, setliked] = useState<Element | any>();
  const [list, setList] = useState<Ingredient[]>([]);

  //To get navigation by page and id
  const params = useParams();
  const id: string = params.id;
  const idRef: number = parseInt(params.id);

  // Get inital value in load, uses recipe id as source
  // Also loads values recipe and ingredients by setState
  useEffect(() => {
    let idCheck: number[] = [];

    dataService
      .getAll()
      .then((data) => {
        data.map((e: any) => idCheck.push(e.id));
      })
      .then(() => {
        if (idCheck.includes(idRef)) {
          dataService.get(id).then((data) => {
            setRecipe(data);
            setIngredients(data.ingredients);
          });
        } else {
          const check: any = localStorage.getItem('Items');
          dataService.apiExploreData(JSON.parse(check)).then((data) => {
            data?.map((recipe: Recipe) => {
              if (recipe.recipeInfo.id == idRef) {
                const rmHTML = /(<([^>]+)>)/gi;
                const text = recipe.recipeInfo.description;
                recipe.recipeInfo.description = text.replace(rmHTML, '');

                setRecipe(recipe);
                setIngredients(recipe.ingredients);
                console.log(data);
              }
            });
          });
        }
      });
  }, []);

  // Updates ingredients according to value chosen by user
  function changePortions(portions: number) {
    let newAmounts: Ingredient[];
    let defaultAmounts: Ingredient[] = recipe!.ingredients;

    newAmounts = defaultAmounts?.map((i) => ({
      ...i,
      amount: parseFloat(((i.amount / 4) * portions).toFixed(1)),
    }));
    setIngredients(newAmounts);
  }
  // useEffect to load contents of cart on load
  useEffect(() => {
    const cartMemory = JSON.parse(localStorage.getItem('cart')!);

    if (cartMemory) {
      setList(cartMemory);
    } else {
      localStorage.setItem('cart', JSON.stringify([]));
    }
  }, []);

  //Add to shopping list and no duplicates adds content if choosing recipes with same ingredients
  function addCart() {
    const cart: Ingredient[] = JSON.parse(localStorage.getItem('cart') || '[]');

    const addToCart = Object.values(
      [...cart, ...ingredients!].reduce<Ingredient[]>(
        (upd, { ingredients_id, ingredient, amount, unit_id, unit }) => {
          upd[ingredients_id] = {
            ingredients_id,
            ingredient,
            amount: parseFloat(
              (upd[ingredients_id] ? upd[ingredients_id].amount : 0 + amount).toFixed(1)
            ),
            unit_id,
            unit,
          };
          return upd;
        },
        []
      )
    );
    //ingredients?.map((e) => cart.push(e));

    localStorage.setItem('cart', JSON.stringify(addToCart));
    document.dispatchEvent(new Event('storage'));
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
        {recipe?.recipeInfo.popular ? 'This item is popular' : null}
      </h6>
      <BsPrinter
        className="Icon-print"
        title="Print the shopping list"
        onClick={() => window.print()}
      />
      <p className="Recipe-description>">{recipe?.recipeInfo.description}</p>
      <div>
        <div>
          <label>Number of portions:&nbsp;</label>
          <select
            title="Number of portions"
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
        <button
          title="Like the recipe"
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
        <Link to={'/edit/' + params.id}>
          <button title="Edit recipe" className="Button-navigation">
            Edit recipe
          </button>
        </Link>
        <Link to={'/cart'}>
          <button
            title="Add recipe to shopping list"
            className="Button-navigation"
            onClick={() => {
              addCart();
            }}
          >
            <RiShoppingCart2Line />{' '}
          </button>
        </Link>
      </div>
      <div>
        <Link to="/">
          <button title="Back" className="Button-navigation">
            Back
          </button>
        </Link>
      </div>
    </div>
  );
}
