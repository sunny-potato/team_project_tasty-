import React, { useState, useEffect } from 'react';
import { RecipeInfo } from 'src/DataService';

type Props = {
  recipeInfo: RecipeInfo;
  setRecipeInfo: (param: RecipeInfo) => void;
};

const InputRecipeInfo = (props: Props) => {
  // temporarily use tagList -> later get tagsList from the database
  let tagsList: string[] = ['Dinner', 'Lunch', 'Breakfast', 'Snack', 'Dessert'];
  const [activeTag, setActiveTag] = useState('');

  useEffect(() => {
    setActiveTag(props.recipeInfo.meal_type);
  }, []);

  const updateRecipeInfo = (key: string, value: any) => {
    props.setRecipeInfo({
      ...props.recipeInfo,
      [key]: value,
    });
  };
  const onChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = event.target;
    updateRecipeInfo(name, value);
  };

  const toggleTag = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag('');
      updateRecipeInfo('meal_type', '');
    } else {
      setActiveTag(tag);
      updateRecipeInfo('meal_type', tag);
    }
  };

  return (
    <div>
      <label className="recipe-name">
        {' '}
        Name :{' '}
        <input
          type="text"
          name="name"
          value={props.recipeInfo.name}
          onChange={onChangeValue}
          required
        ></input>
      </label>
      <div className="recipe-tag">
        <div>
          Tag :
          {tagsList.map((tag, index) => {
            return (
              <button
                type="button"
                key={index}
                style={{
                  backgroundColor: activeTag === tag ? 'lightblue' : 'white',
                }}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
      <label className="recipe-description">
        Description :{' '}
        <input
          type="text"
          name="description"
          value={props.recipeInfo.description}
          onChange={onChangeValue}
        ></input>
      </label>
    </div>
  );
};

export default InputRecipeInfo;
