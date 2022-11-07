import React, { useState, useEffect } from 'react';
import dataService, { EachIngredient } from '../DataService';

export type SelectedOneInfo = {
  id: number;
  ingredient: string;
  index: number;
};

type Props = {
  searchKeyword: string;
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  activeRow: number;
  sendSelectedData: (param: SelectedOneInfo) => void;
};

const SearchIngredient = (props: Props) => {
  const [allIngredients, setAllIngredients] = useState<EachIngredient[]>([]);

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
      if (props.searchKeyword == '') {
        // props.setIsVisible(true);
        return each;
      } else {
        if (each.ingredient.includes(props.searchKeyword.toLowerCase())) {
          return each;
        }
      }
    })
    .map((each) => {
      return (
        <div key={each.id}>
          <button
            onClick={() => {
              const selectedOneInfo: SelectedOneInfo = { ...each, ...{ index: props.activeRow } };
              props.sendSelectedData(selectedOneInfo);
              props.setIsVisible(false);
            }}
          >
            {each.ingredient}
          </button>
        </div>
      );
    });

  return <div style={{ display: props.isVisible ? 'block' : 'none' }}>{disPlayAllingredients}</div>;
};

export default SearchIngredient;
