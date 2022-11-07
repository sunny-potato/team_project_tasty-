import React, { useState, useEffect } from 'react';
import dataService, { EachUnit, Ingredient } from '../DataService';
import SearchIngredient, { SelectedOneInfo } from './SearchIngredient';

const initialIngredient: undefined = {
  ingredients_id: undefined,
  ingredient: undefined,
  amount: undefined,
  unit_id: undefined,
  unit: undefined,
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
  // const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [unitsList, setUnitsList] = useState<EachUnit[]>([]);
  const [activeRow, setActiveRow] = useState<number>();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [isAmountValid, setIsAmountValid] = useState<boolean>(true);
  // const [isUnitValid, setIsUnitValid] = useState<boolean>(true);
  const [isIngredientValid, setIsIngredientValid] = useState<boolean>(true);
  const [AllValidRecipeInfo, setAllValidRecipeInfo] = useState<any>('');

  // console.log('child component', props.ingredients);
  console.log('local', props.ingredients);

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

  // useEffect(() => {
  // setAllValidRecipeInfo({
  //   ['amount']: isAmountValid,
  // ['meal_typel']: isTagValid,
  // ['description']: isDescriptionValid,
  // });
  // console.log(AllValidRecipeInfo);
  // }, [props.ingredients]);

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
    const matchedUnit: EachUnit = unitsList.find((unit) => unit.unit === event.target.value);
    const matchedId: number = matchedUnit.id as number;
    return matchedId;
  };

  const displayAmount = (ingredient: Ingredient, index: number) => {
    return (
      <div>
        <input
          type="number"
          name="amount"
          // min={0} thing to fix : show decimal number 0
          value={ingredient.amount || ''}
          onChange={(event) => {
            onChangeAmount(event, index);
          }}
        />
      </div>
    );
  };
  // const createConditionalUnitOptions = (unitId: number) => {
  //   if (unitId == undefined) {
  //   } else {
  //     return (
  //       <option key={unit.id} value={unit.unit}>
  //         {unit.unit}
  //       </option>
  //     );
  // {unitsList.map((unit) => {
  //   return (
  //     <option key={unit.id} value={unit.unit}>
  //       {unit.unit}
  //     </option>
  //   );
  // })}
  //   }
  // };
  const displayUnit = (ingredient: any, index: number) => {
    console.log('unit', ingredient); // ->>>>>>>>>>>>> from here!!
    if (ingredient.unit === undefined) {
      console.log('undefined');
      return (
        <div>
          <select
            name="unit"
            value={ingredient.unit}
            onChange={(event) => {
              const matchedId = findMachedId(event);
              onChangeUnit(event, index, matchedId);
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
          onChange={(event) => {
            // console.log('index', index);
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
    if (value <= 0) {
      setIsAmountValid(false);
      alert('the amount should be bigger than 0'); // thing to fix : display message in html
      return;
    }
    setIsAmountValid(true);
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
    if (value == '' || value == undefined || value == null) {
      setIsIngredientValid(false);
      alert('Please enter ingredient'); // thing to fix : display message in html
      return;
    }
    setIsIngredientValid(true);
    updateIngredients(name, value, index as number, id);
  };

  const addIngredient = () => {
    const updatedIngredients: Ingredient[] = [...props.ingredients, initialIngredient!];
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
      <label className="content-portions">
        Number of portions :{' '}
        <select name="portions" defaultValue={4}>
          {createOptions()}
        </select>
      </label>
      <div className="content-ingredients">
        <table className="table-ingredients" style={{ backgroundColor: 'lightblue' }}>
          <tbody>
            <tr className="table-headerRow">
              <th></th>
              <th></th>
              <th>Ingredients</th>
              <th>
                <button onClick={addIngredient}>+ Add</button>
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
                  <td>{displayAmount(ingredient, index)}</td>
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
                    <button onClick={() => deleteIngredient(index)}>Delete</button>
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
