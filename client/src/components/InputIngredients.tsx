import React, { useState, useEffect } from 'react';
import dataService, { EachUnit, Ingredient } from '../DataService';
import SearchIngredient, { SelectedOneInfo } from './SearchIngredient';

const initialIngredient: Ingredient = {
  ingredients_id: undefined!,
  ingredient: '',
  amount: null,
  unit_id: 0,
  unit: 'initalUnit',
};

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
  ingredients: Ingredient[];
  setIngredients: (param: Ingredient[]) => void;
};

const InputIngredients = (props: Props) => {
  const [unitsList, setUnitsList] = useState<EachUnit[]>([]);
  const [activeRow, setActiveRow] = useState<number>();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const getUnitsList = () => {
    dataService
      .getAllUnits()
      .then((response) => {
        setUnitsList(response);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getUnitsList();
  }, []);

  const updateIngredients = (key: string, value: any, index: number, id?: number) => {
    let newIngredient;

    if (key == 'amount') {
      value = Number(value);

      newIngredient = {
        ...props.ingredients[index],
        [key]: value,
      };
    } else {
      let keyId: string = '';
      if (key == 'ingredient') {
        value = value.toLowerCase();
        keyId = key + 's_id';
      }
      if (key == 'unit') {
        keyId = key + '_id';
      }
      newIngredient = {
        ...props.ingredients[index],
        [key]: value,
        [keyId]: id,
      };
    }
    const newIngredients = [
      ...props.ingredients.slice(0, index),
      newIngredient,
      ...props.ingredients.slice(index + 1),
    ];
    props.setIngredients(newIngredients);
  };

  const findMachedId = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const matchedUnit: EachUnit = unitsList.find((unit) => unit.unit === event.target.value)!;
    const matchedId: number = matchedUnit.id as number;
    return matchedId;
  };

  const displayAmount = (ingredient: Ingredient, index: number) => {
    return (
      <div>
        <input
          type="number"
          name="amount"
          min={0}
          step="any"
          value={ingredient.amount || 0}
          onChange={(event) => {
            onChangeAmount(event, index);
          }}
          autoComplete="off"
        />
      </div>
    );
  };

  const displayUnit = (ingredient: any, index: number) => {
    if (ingredient.unit === 'initalUnit') {
      return (
        <div>
          <select
            name="unit"
            value={ingredient.unit}
            onChange={(event) => {
              const matchedId = findMachedId(event);
              onChangeUnit(event, index, matchedId);
            }}
            autoComplete="off"
          >
            {<option value={''}>--option--</option>}
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
    } else {
      return (
        <div>
          <select
            name="unit"
            value={ingredient.unit}
            onChange={(event) => {
              const matchedId = findMachedId(event);
              onChangeUnit(event, index, matchedId);
            }}
            autoComplete="off"
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
    }
  };

  const displayIngredient = (ingredient: any, index: number) => {
    return (
      <div>
        <input
          type="text"
          name="ingredient"
          value={ingredient.ingredient || ''}
          autoComplete="off"
          required
          onChange={(event) => {
            setActiveRow(index);
            setIsVisible(true);
            setSearchKeyword(event.target.value);
            onChangeIngredient(event, index);
          }}
        />
      </div>
    );
  };

  const onChangeAmount = (event: any, index: number) => {
    let { name, value } = event.target;
    updateIngredients(name, value, index);
  };

  const onChangeUnit = (event: any, index: number, matchedId: number) => {
    let { name, value } = event.target;
    const id = matchedId;
    updateIngredients(name, value, index as number, id);
  };

  const onChangeIngredient = (event: any, index: number, matchedId?: number) => {
    let { name, value } = event.target;
    const id = matchedId;
    updateIngredients(name, value, index as number, id);
  };

  const addIngredient = () => {
    const updatedIngredients: Ingredient[] = [...props.ingredients, initialIngredient];
    props.setIngredients(updatedIngredients);
  };

  const deleteIngredient = (index: number) => {
    const newIngredients = [
      ...props.ingredients.slice(0, index),
      ...props.ingredients.slice(index + 1),
    ];
    props.setIngredients(newIngredients);
  };

  return (
    <div>
      <div className="row">
        <label className="content-portions">
          Number of portions :{' '}
          <select name="portions" defaultValue={4}>
            {createOptions()}
          </select>
        </label>
      </div>

      <div className="row">
        <table className="table-ingredients">
          <tbody>
            <tr className="table-headerRow">
              <th colSpan={3}>Ingredients</th>
              <th>
                <button className="Button-choice-add" type="button" onClick={addIngredient}>
                  + Add
                </button>
              </th>
            </tr>
            <tr className="table-headerRow">
              <th>Amount</th>
              <th>Unit</th>
              <th>Name</th>
              <th></th>
            </tr>
            {props.ingredients.map((ingredient, index) => {
              return (
                <tr className="table-contentRow" key={index}>
                  <td className="Table-amount">{displayAmount(ingredient, index)}</td>
                  <td>{displayUnit(ingredient, index)}</td>
                  <td>
                    {displayIngredient(ingredient, index)}
                    {index == activeRow && (
                      <SearchIngredient
                        searchKeyword={searchKeyword}
                        isVisible={isVisible}
                        setIsVisible={setIsVisible}
                        activeRow={activeRow}
                        sendSelectedData={(selected: SelectedOneInfo) => {
                          updateIngredients(
                            'ingredient',
                            selected.ingredient,
                            selected.index,
                            selected.id
                          );
                        }}
                      />
                    )}
                  </td>
                  <td>
                    <button
                      className="Button-choice-delete"
                      type="button"
                      onClick={() => deleteIngredient(index)}
                    >
                      Delete
                    </button>
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
