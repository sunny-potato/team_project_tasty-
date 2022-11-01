import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import dataService, { Recipe, RecipeInfo, Ingredient } from '../DataService';

interface Props {
  recipeInfo: RecipeInfo | undefined;
  name: string;
  meal_type: string;
  description: string;
}

let tagList: string[] = ['Dinner', 'Lunch', 'Breakfast', 'Snack', 'Dessert'];

const RecipeInput = ({ recipeInfo, name, meal_type, description }: Props) => {
  const [Tname, setName] = useState<string>();

  useEffect(() => {
    console.log(Tname);
    setName(Tname);
  }, []);
  return (
    <div>
      <form>
        <label>
          Name :{' '}
          <input
            type="text"
            name="recipe_name"
            defaultValue={name}
            onChange={(event) => setName(event.currentTarget.value)}
          />
        </label>
      </form>
      <div className="content-tag">
        <div>
          Tag :{' '}
          {tagList.map((tag, index) => {
            if (meal_type == tag) {
              return (
                <button style={{ backgroundColor: 'lightblue' }} key={index}>
                  {tag}
                </button>
              );
            } else {
              return <button key={index}>{tag}</button>;
            }
          })}
        </div>
      </div>
      <form>
        <label>
          Description :{' '}
          <input
            type="text"
            name="recipe_description"
            defaultValue={description}
            // onChange={(event) => setDescription(event.currentTarget.value)}
          />
        </label>
      </form>
      {/* <form>
        <label>
          Name :{' '}
          <input
            value={name}
            onChange={(event) => {
              //   event.currentTarget.value = test;
              setName(event.currentTarget.value);
              console.log(event.currentTarget.value);
            }}
          />
        </label>
      </form>
      <div>Tag - display all tags & marked tag</div>
      <form>
        <label>
          Description : <input></input>
        </label>
      </form>
      <form>
        <label>Number of portions </label>
        <select>
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
      </form>
      <div>Ingredients - search?</div>
      <div className="btn-group">
        <button>Save</button>
        <button>Cancel</button>
      </div> */}
    </div>
  );
};

export default RecipeInput;
