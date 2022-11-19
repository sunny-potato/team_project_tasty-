import * as React from 'react';
import { CreateNew } from '../src/pages/CreateNew';
import { DisplayOne } from '../src/pages/DisplayOne';
import { MemoryRouter } from 'react-router-dom';

import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';

import * as router from 'react-router';

import SearchIngredient from '../src/components/SearchIngredient';

let container: any = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('CreateNew page tests', () => {
  test('Create new, page draws correctly (snapshot)', async () => {
    await act(async () => {
      await render(
        <MemoryRouter>
          <CreateNew />
        </MemoryRouter>,
        container
      );
    });
    expect(container).toMatchSnapshot();
  });

  test('Input recipe info', async () => {
    await act(async () => {
      await render(
        <MemoryRouter>
          <CreateNew />
        </MemoryRouter>,
        container
      );
    });

    // set input name, and check if value gets updated
    let name = container.querySelector("input[name='name']");
    expect(name.value).toEqual('');
    fireEvent.change(name, { target: { value: 'New recipe' } });
    expect(name.value).toEqual('New recipe');

    // select meal type 'dinner' (first button) and check if active tag gets updated and background color changes
    let dinnerButton = container.querySelector('button');
    expect(dinnerButton.style.backgroundColor).toEqual('white');
    fireEvent.click(dinnerButton);
    expect(dinnerButton.style.backgroundColor).toEqual('rgb(41, 211, 118)');

    // write desctiption, and check that value gets updated
    let desctiption = container.querySelector("textarea[name='description']");
    expect(desctiption.value).toEqual('');
    fireEvent.change(desctiption, { target: { value: 'New description' } });
    expect(desctiption.value).toEqual('New description');
  });

  test('Input ingredients', async () => {
    await act(async () => {
      await render(
        <MemoryRouter>
          <CreateNew />
        </MemoryRouter>,
        container
      );
    });

    // set amount and check if value gets updated
    let amount1 = container.querySelector("input[name='amount']");
    expect(amount1.value).toEqual('0');
    fireEvent.change(amount1, { target: { value: 4 } });
    expect(amount1.value).toEqual('4');

    // select unit and check if it gets updated
    let unit1 = container.querySelector("select[name='unit']");
    expect(unit1.value).toEqual('');
    fireEvent.change(unit1, { target: { value: 'cup' } });
    expect(unit1.value).toEqual('cup');

    // set name of ingredient and check that value gets updated
    let name1 = container.querySelector("input[name='ingredient']");
    expect(name1.value).toEqual('');
    fireEvent.change(name1, { target: { value: 'new ingredient' } });
    expect(name1.value).toEqual('new ingredient');

    // add new ingredient button
    let addButton = container.querySelector('button.Button-choice-add');
    fireEvent.click(addButton);
    let names = container.querySelectorAll("input[name='ingredient']");
    expect(names.length).toEqual(2);
    expect(names[0].value).toEqual('new ingredient');
    expect(names[1].value).toEqual('');
  });

  test('Ingredient dropdown list (no keyword)', async () => {
    await act(async () => {
      await render(
        <MemoryRouter>
          <SearchIngredient
            searchKeyword=""
            isVisible={true}
            setIsVisible={() => false}
            activeRow={0}
            sendSelectedData={() => false}
          />
        </MemoryRouter>,
        container
      );
    });
    // check if all (mocked) ingredients present when keyword is ''
    let ingredientButtons = container.querySelectorAll('button.Button-search');
    expect(ingredientButtons.length).toEqual(2);
  });

  test('Ingredient dropdown list (with keyword)', async () => {
    await act(async () => {
      await render(
        <MemoryRouter>
          <SearchIngredient
            searchKeyword="milk"
            isVisible={true}
            setIsVisible={() => false}
            activeRow={0}
            sendSelectedData={() => false}
          />
        </MemoryRouter>,
        container
      );
    });
    // check if only ingredients with keyword 'milk' is present
    let ingredientButtons = container.querySelectorAll('button.Button-search');
    expect(ingredientButtons.length).toEqual(1);
    expect(ingredientButtons[0].innerHTML).toEqual('whole milk');
  });

  test('Save recipe', async () => {
    // mock navigate
    let navigateMock = jest.spyOn(router, 'useNavigate').mockImplementation();

    await act(async () => {
      await render(
        <MemoryRouter>
          <CreateNew />
          <DisplayOne />
        </MemoryRouter>,
        container
      );
    });

    // insert required values for new recipe
    // set name
    fireEvent.change(container.querySelector("input[name='name']"), {
      target: { value: 'New recipe' },
    });
    // set name of ingredient
    fireEvent.change(container.querySelector("input[name='ingredient']"), {
      target: { value: 'whole milk' },
    });
    // save recipe
    fireEvent.click(container.querySelector("button[type='submit']"));

    // expect navigation to displayOne after recipe saved
    expect(navigateMock).toHaveBeenCalled();
  });
});
