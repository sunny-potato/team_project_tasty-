import React, { useState, useEffect } from 'react';
import { RecipeInfo } from 'src/DataService';

type Props = {
  recipeInfo: RecipeInfo;
  sendUpdatedRecipeInfo: (param: RecipeInfo) => void;
  // nameValue: string;
  // descriptionValue: string;
  // onChangeValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // activeTag: string;
  // toggleTag: (param: string) => void;
};

const InputRecipeInfo = (props: Props) => {
  // temporarily use tagList -> later get tagsList from the database
  let tagsList: string[] = ['Dinner', 'Lunch', 'Breakfast', 'Snack', 'Dessert'];

  const [recipeInfo, setRecipeInfo] = useState<RecipeInfo>(props.recipeInfo);
  const [activeTag, setActiveTag] = useState(props.recipeInfo.meal_type);
  const [isNameValid, setIsNameValid] = useState<boolean>(true);
  const [isDescriptionValid, setIsDescriptionValid] = useState<boolean>(true);
  const [isTagValid, setIsTagValid] = useState<boolean>(true);
  const [AllValidRecipeInfo, setAllValidRecipeInfo] = useState<any>('');
  // console.log(test);
  useEffect(() => {
    props.sendUpdatedRecipeInfo(recipeInfo);
    setAllValidRecipeInfo({
      ['name']: isNameValid,
      ['meal_typel']: isTagValid,
      ['description']: isDescriptionValid,
    });
  }, [recipeInfo]);

  const updateRecipeInfo = (key: string, value: any) => {
    setRecipeInfo({
      ...recipeInfo,
      [key]: value,
    });
  };
  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = event.target;
    updateRecipeInfo(name, value);
    if (value === '') {
      setIsNameValid(false); // message -> please enter title of recipe
    } else {
      setIsNameValid(true);
    }
  };
  const onChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = event.target;
    updateRecipeInfo(name, value);
    if (value === '') {
      setIsDescriptionValid(false); // message -> please enter description of recipe
    } else {
      setIsDescriptionValid(true);
    }
  };

  const toggleTag = (tag: string) => {
    // if (activeTag === tag) {
    //   setActiveTag('');
    //   updateRecipeInfo('meal_type', '');
    //   setIsTagValid(false);
    // } else {
    setActiveTag(tag);
    updateRecipeInfo('meal_type', tag);
    // setIsTagValid(true);
    // }
  };

  return (
    <div>
      <label className="recipe-name">
        {' '}
        Name :{' '}
        <input
          type="text"
          name="name"
          value={recipeInfo.name}
          // value={props.nameValue}
          onChange={onChangeName}
          required
        ></input>
      </label>
      <div className="recipe-tag">
        <div>
          Tag :
          {tagsList.map((tag, index) => {
            return (
              <button
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
          value={recipeInfo.description}
          onChange={onChangeDescription}
        ></input>
      </label>
    </div>
  );
};

export default InputRecipeInfo;
