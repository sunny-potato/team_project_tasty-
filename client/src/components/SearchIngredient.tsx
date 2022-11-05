import React, { useState, useEffect } from 'react';
import dataService, {
  Recipe,
  RecipeInfo,
  Ingredient,
  UnitsList,
  IngredientLight,
} from '../DataService';

// export type EachIngredient = {
//   id: number;
//   ingredient: string;
// };

type SearchProps = {
  searchKeyword: string;
  isVisible: boolean;
  sendSelectedData: (value: IngredientLight) => void;
};

const SearchIngredient = ({ searchKeyword, isVisible, sendSelectedData }: SearchProps) => {
  const [allIngredients, setAllIngredients] = useState<IngredientLight[]>([]);
  //   const [searchKeyword, setSearchKeyword] = useState<string>('');

  // console.log(searchKeyword);
  // console.log('index', ingredientIndex);
  const getAllIngredients = () => {
    dataService
      .getAllIngredients()
      .then((response) => {
        setAllIngredients(response);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    getAllIngredients();
  }, []);

  const disPlayAllingredients = allIngredients
    .filter((each) => {
      if (searchKeyword == '') {
        // setIsVisible(true);
        return each;
      } else {
        if (each.ingredient.includes(searchKeyword.toLowerCase())) {
          return each;
        }
      }
    })
    .map((each) => {
      return (
        <div key={each.id}>
          <button
            onClick={() => {
              console.log(each.ingredient);
              sendSelectedData(each);
            }}
          >
            {each.ingredient}
          </button>
        </div>
      );
    });

  return <div style={{ display: isVisible ? 'block' : 'none' }}>{disPlayAllingredients}</div>;
};

export default SearchIngredient;
