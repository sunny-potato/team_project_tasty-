import * as React from 'react';
import { shallow } from 'enzyme';
import { EditRecipes } from '../src/pages/EditRecipes';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';

import { Ingredient } from '../src/DataService';

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

describe('EditRecipes page tests', () => {
  test('Edit Recipe, page draws correctly (snapshot)', async () => {
    await act(async () => {
      await render(
        <MemoryRouter initialEntries={['/edit/1']}>
          <Routes>
            <Route path="/edit/:id" element={<EditRecipes />} />
          </Routes>
        </MemoryRouter>,
        container
      );
    });
    expect(container).toMatchSnapshot();
  });

  test('Update recipe info', async () => {
    await act(async () => {
      await render(
        <MemoryRouter initialEntries={['/edit/1']}>
          <Routes>
            <Route path="/edit/:id" element={<EditRecipes />} />
          </Routes>
        </MemoryRouter>,
        container
      );
    });

    // set input name, and check if value gets updated
    let name = container.querySelector("input[name='name']");
    expect(name.value).toEqual('One-Pot Mac and Cheese');
    fireEvent.change(name, { target: { value: 'Mac and Cheese' } });
    expect(name.value).toEqual('Mac and Cheese');

    // select meal type 'lunch' (second button) and check type changed
    let tagButtons = container.querySelectorAll('div.row button');
    expect(tagButtons[0].style.backgroundColor).toEqual('rgb(41, 211, 118)');
    expect(tagButtons[1].style.backgroundColor).toEqual('white');
    fireEvent.click(tagButtons[1]);
    expect(tagButtons[0].style.backgroundColor).toEqual('white');
    expect(tagButtons[1].style.backgroundColor).toEqual('rgb(41, 211, 118)');

    // update desctiption, and check that value gets updated
    let desctiption = container.querySelector("textarea[name='description']");
    expect(desctiption.value).toEqual(
      `Who likes cleaning up after making mac and cheese? 
              Not this girl. This one-pot mac and cheese is a family favorite, 
              and my 3-year-old is thrilled to see it coming to the dinner table. 
              We love to add sliced smoked sausage to this creamy mac recipe!`
    );
    fireEvent.change(desctiption, { target: { value: 'updated description' } });
    expect(desctiption.value).toEqual('updated description');
  });

  test('Update ingredients', async () => {
    await act(async () => {
      await render(
        <MemoryRouter initialEntries={['/edit/1']}>
          <Routes>
            <Route path="/edit/:id" element={<EditRecipes />} />
          </Routes>
        </MemoryRouter>,
        container
      );
    });

    // change amount for ingredient 1 and check if value gets updated
    let amount1 = container.querySelector("input[name='amount']");
    expect(amount1.value).toEqual('1.5');
    fireEvent.change(amount1, { target: { value: 4 } });
    expect(amount1.value).toEqual('4');

    // change unit for ingredient 1 and check if it gets updated
    let unit1 = container.querySelector("select[name='unit']");
    expect(unit1.value).toEqual('cup');
    fireEvent.change(unit1, { target: { value: 'ounce' } });
    expect(unit1.value).toEqual('ounce');

    // change name of ingredient and check that value gets updated
    let name1 = container.querySelector("input[name='ingredient']");
    expect(name1.value).toEqual('whole milk');
    fireEvent.change(name1, { target: { value: 'milk' } });
    expect(name1.value).toEqual('milk');

    // save recipe
    fireEvent.click(container.querySelector("button[type='submit']"));

    // expect??
  });
});
