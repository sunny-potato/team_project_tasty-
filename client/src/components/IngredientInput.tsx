import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import dataService, { Recipe, RecipeInfo, Ingredient } from '../DataService';
import { ChangePortions } from './ChangePortions';

interface Props {
  ingredients: Ingredient[] | undefined;
}
// temporarily use manual list of unit
const unitList: string[] = ['', 'cup', 'package', 'ounce', 'teaspoon', 'pound', 'jar'];

const IngredientInput = ({ ingredients }: Props) => {
  const test = (event: any) => {
    let portions = parseInt(event.currentTarget.value);
    let result = ChangePortions(portions, ingredients);

    //????????????????????
  };
  return (
    <div>
      <form className="content-portions">
        <label>Number of portions </label>
        <select name="portions" defaultValue={4} onChange={test}>
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
      <div className="content-ingredients">
        <table>
          <tbody>
            <tr>
              <th>Ingredients</th>
            </tr>
            {ingredients?.map((each) => (
              <tr key={each.ingredients_id}>
                <td>
                  <input type="number" defaultValue={each.amount} />
                  <select defaultValue={each.unit}>
                    {unitList.map((unit, index) => (
                      <option key={index} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input type="text" defaultValue={each.ingredient} />
                </td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IngredientInput;
