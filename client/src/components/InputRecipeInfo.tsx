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
  const onChangeValue = (
    event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
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
    <div className="Content-recipeinfo">
      <label className="recipe-name"> Name : </label>
      <input
        type="text"
        name="name"
        autoFocus
        value={props.recipeInfo.name}
        onChange={onChangeValue}
        autoComplete="off"
        required
      ></input>

      <div className="recipe-tag">
        <div>
          <span>Tag :</span>
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
        <textarea
          rows={4}
          cols={50}
          name="description"
          value={props.recipeInfo.description}
          onChange={onChangeValue}
          autoComplete="off"
        ></textarea>
      </label>
    </div>
  );
};

export default InputRecipeInfo;
