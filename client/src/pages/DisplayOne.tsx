import '../css/PageStyling.css';
import React, { useEffect, useState } from 'react';
import dataService, { Recipe, Ingredient, ApiRecipe } from '../DataService';
import { Link, useParams } from 'react-router-dom';
import { BsHandThumbsUp, BsHandThumbsUpFill, BsPrinter } from 'react-icons/bs';
import { RiShoppingCart2Line } from 'react-icons/ri';
import { calculateAmounts } from '../components/ChangePortions';

export function DisplayOne() {
  const [recipe, setRecipe] = useState<Recipe>();
  const [api, setApi] = useState<ApiRecipe | any>();
  const [ingredients, setIngredients] = useState<Ingredient[]>();
  const [liked, setliked] = useState<Element | any>();
  const [list, setList] = useState<Ingredient[]>([]);
  const [currentPortions, setCurrentPortions] = useState<number>(4);
  const [idCheck, setIdCheck] = useState<number[]>([]);

  //To get navigation by page and id
  const params = useParams();
  // @ts-ignore, because setting id to "string | undefined", will make problems at line 35 where it will try to use it as "string | number".
  const id: string = params.id;
  // @ts-ignore, because using a function that needs a "string" and using an input as a "string | undefined" is not valid in Typescripts eyes
  const idRef: number = parseInt(params.id);

  // Get inital value in load, uses recipe id as source
  // Also loads values recipe and ingredients by state
  useEffect(() => {
    dataService.getAll().then((data) => {
      let idAvail: number[] = data.map((e: Recipe) => e.recipeInfo.id);
      setIdCheck(idAvail);
    });
  }, []);

  useEffect(() => {
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
            setApi(recipe);
          }
        });
      });
    }
  }, [idCheck]);

  // Updates ingredients according to value chosen by user
  const changePortions = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPortions = Number(event.target.value);
    const changedAmounts: Ingredient[] | any = calculateAmounts(
      ingredients!,
      currentPortions,
      newPortions
    );
    setCurrentPortions(newPortions);
    setIngredients(changedAmounts);
  };

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
              (upd[ingredients_id] ? upd[ingredients_id].amount : 0 + amount!)!.toFixed(1)
            ),
            unit_id,
            unit,
          };
          return upd;
        },
        []
      )
    );

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
      {recipe?.recipeInfo.meal_type.length ? (
        <h5 className="Recipe-tags">Tags: {recipe?.recipeInfo.meal_type}</h5>
      ) : (
        ''
      )}

      {idCheck.includes(idRef) ? (
        <>
          <h6 className="Recipe-new">{recipe?.recipeInfo.new ? 'This is a new recipe!' : ' '}</h6>
          <h6 className="Recipe-popular">
            {recipe?.recipeInfo.popular ? 'This item is popular' : ' '}
          </h6>
        </>
      ) : (
        <img id="Image-focus" src={api?.recipeInfo.image}></img>
      )}

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
            value={currentPortions}
            onChange={changePortions}
          >
            <option key={1} value={1}>
              1
            </option>
            <option key={2} value={2}>
              2
            </option>
            <option key={3} value={3}>
              3
            </option>
            <option key={4} value={4}>
              4
            </option>
            <option key={5} value={5}>
              5
            </option>
            <option key={6} value={6}>
              6
            </option>
            <option key={7} value={7}>
              7
            </option>
            <option key={8} value={8}>
              8
            </option>
            <option key={9} value={9}>
              9
            </option>
            <option key={10} value={10}>
              10
            </option>
          </select>
        </div>
        <table className="Ingredients-main">
          <tbody>
            <tr>
              <th className="Ingredients-header">Ingredients:</th>
              <th></th>
            </tr>
            {ingredients?.map((content, index) => (
              <tr className="Ingredients-row" key={index}>
                <td className="Ingredients-cell">
                  {content.amount}&nbsp;{content.unit}
                </td>

                <td className="Ingredients-name">{content.ingredient}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {idCheck.includes(idRef) ? (
          <>
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
          </>
        ) : (
          ''
        )}
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

        {idCheck.includes(idRef) ? (
          <div>
            <Link to="/">
              <button title="Back" className="Button-navigation">
                Back
              </button>
            </Link>
          </div>
        ) : (
          <div>
            <Link to="/explore">
              <button title="Back" className="Button-navigation">
                Back
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
