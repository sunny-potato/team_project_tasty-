import React, { useState, useEffect } from 'react';
import { RecipeInfo } from 'src/DataService';

type Props = {
  recipeInfo: RecipeInfo;
  setRecipeInfo: (param: RecipeInfo) => void;
};

const InputRecipeInfo = (props: Props) => {
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
    <div className="Content-input-container">
      <div className="row">
        <input
          type="text"
          name="name"
          placeholder="Name of the recipe"
          autoFocus
          value={props.recipeInfo.name}
          onChange={onChangeValue}
          autoComplete="off"
          required
        ></input>
      </div>
      <div className="row">
        <p className="Tag">Choose a tag</p>
        <p className="Tag">
          {tagsList.map((tag, index) => {
            return (
              <button
                type="button"
                className="Button-select-option"
                key={index}
                style={{
                  backgroundColor: activeTag === tag ? 'rgb(41, 211, 118)' : 'white',
                  color: activeTag === tag ? 'white' : 'black',
                  border: activeTag === tag ? ' 1px solid black' : '1px solid lightgrey',
                }}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            );
          })}
        </p>
      </div>
      <div className="row">
        <textarea
          placeholder="Describe your recipe and how to make it delicious"
          rows={4}
          cols={50}
          name="description"
          value={props.recipeInfo.description}
          onChange={onChangeValue}
          autoComplete="off"
        ></textarea>
      </div>
    </div>
  );
};

export default InputRecipeInfo;
