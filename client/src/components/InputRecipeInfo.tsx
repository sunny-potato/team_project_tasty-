import React from 'react';

type Props = {
  nameValue: string;
  descriptionValue: string;
  onChangeValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
  activeTag: string;
  toggleTag: (param: string) => void;
};

const InputRecipeInfo = (props: Props) => {
  // temporarily use tagList -> later get tagsList from the database
  let tagsList: string[] = ['Dinner', 'Lunch', 'Breakfast', 'Snack', 'Dessert'];

  // const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   let { name, value } = event.target;
  //   const id = matchedId;
  //   if (name == 'name' || name == 'description') {
  //     SetDataInRecipe(name, value);
  //   }
  // };

  return (
    <div>
      <label className="recipe-name">
        {' '}
        Name :{' '}
        <input
          type="text"
          name="name"
          value={props.nameValue}
          onChange={props.onChangeValue}
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
                  backgroundColor: props.activeTag === tag ? 'lightblue' : 'white',
                }}
                onClick={() => props.toggleTag(tag)}
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
          value={props.descriptionValue}
          onChange={props.onChangeValue}
        ></input>
      </label>
    </div>
  );
};

export default InputRecipeInfo;
