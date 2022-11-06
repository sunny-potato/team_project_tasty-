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

  return (
    <div>
      <form className="recipe-name">
        <label>
          {' '}
          Name :{' '}
          <input
            type="text"
            name="name"
            value={props.nameValue || ''}
            onChange={props.onChangeValue}
            required
          ></input>
        </label>
      </form>
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
      <form>
        <label>
          Description :{' '}
          <input
            type="text"
            name="description"
            value={props.descriptionValue || ''}
            onChange={props.onChangeValue}
          ></input>
        </label>
      </form>
    </div>
  );
};

export default InputRecipeInfo;
