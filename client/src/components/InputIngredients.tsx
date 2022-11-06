import React, { useState, useEffect } from 'react';
import dataService, { EachUnit, Ingredient } from '../DataService';
import SearchIngredient, { SelectedOneInfo } from './SearchIngredient';

const createOptions = () => {
  let option = [];
  for (let i = 1; i < 11; i++) {
    option.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }
  return option;
};

type Props = {
  tableName: string;
  ingredients: Ingredient[];
  onChangeValue: (
    event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
    index: number,
    matchedId?: number
  ) => void;
  selectedOneInfo: (param: SelectedOneInfo) => void;
  deleteIngredient: (param: number) => void;
  addnewIngredient: () => void;
};

const InputIngredients = (props: Props) => {
  const [unitsList, setUnitsList] = useState<EachUnit[]>([]);
  const [activeRow, setActiveRow] = useState<number>();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  //   const [selectedSearchData, setSelectedSearchData] = useState<{
  //     id: number;
  //     ingredient: string;
  //     index: number;
  //   }>();

  const getUnitsList = () => {
    dataService
      .getAllUnits()
      .then((response) => {
        setUnitsList(response);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => getUnitsList(), []);

  const findMachedId = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const matchedUnit: EachUnit = unitsList.find((unit) => unit.unit === event.target.value);
    const matchedId: number = matchedUnit.id as number;
    return matchedId;
  };

  const setAmount = (ingredient: any, index: number) => {
    return (
      <div>
        <input
          type="number"
          name="amount"
          value={ingredient.amount || ''}
          onChange={(event) => {
            props.onChangeValue(event, index);
          }}
        />
      </div>
    );
  };

  const setUnit = (ingredient: any, index: number) => {
    return (
      <div>
        <select
          name="unit"
          value={ingredient.unit || ''}
          onChange={(event) => {
            const matchedId = findMachedId(event);
            props.onChangeValue(event, index, matchedId);
          }}
        >
          {unitsList.map((unit) => {
            return (
              <option key={unit.id} value={unit.unit}>
                {unit.unit}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  const setIngredient = (ingredient: any, index: number) => {
    return (
      <div>
        <input
          type="text"
          name="ingredient"
          value={ingredient.ingredient || ''}
          onChange={(event) => {
            // console.log('index', index);
            setActiveRow(index);
            setIsVisible(true);
            setSearchKeyword(event.target.value);
            props.onChangeValue(event, index);
          }}
        />
      </div>
    );
  };

  return (
    <div>
      {' '}
      <form className="content-portions">
        <label>
          Number of portions :{' '}
          <select name="portions" defaultValue={4}>
            {createOptions()}
          </select>
        </label>
      </form>
      <div className="content-ingredients">
        <table style={{ backgroundColor: 'lightblue' }}>
          <tbody>
            <tr>
              <th></th>
              <th></th>
              <th>{props.tableName}</th>
              <th>
                <button onClick={props.addnewIngredient}>+ Add</button>
              </th>
            </tr>
            <tr>
              <th>Amount</th>
              <th>Unit</th>
              <th>Name</th>
              <th></th>
            </tr>
            {props.ingredients.map((ingredient, index) => {
              return (
                <tr key={index}>
                  <td>{setAmount(ingredient, index)}</td>
                  <td>{setUnit(ingredient, index)}</td>
                  <td>
                    {setIngredient(ingredient, index)}
                    {index == activeRow && (
                      <SearchIngredient
                        searchKeyword={searchKeyword}
                        isVisible={isVisible}
                        setIsVisible={setIsVisible}
                        activeRow={activeRow}
                        sendSelectedData={props.selectedOneInfo}
                      />
                    )}
                  </td>
                  <td>
                    <button onClick={() => props.deleteIngredient(index)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InputIngredients;
