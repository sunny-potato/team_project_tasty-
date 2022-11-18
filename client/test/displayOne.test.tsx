import * as React from 'react';
import { shallow } from 'enzyme';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { DisplayOne } from '../src/pages/DisplayOne';

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

describe('DisplayOne page tests', () => {
  test('DisplayOne page draws correctly (snapshot) including data from test recipe 1', async () => {
    await act(async () => {
      await render(
        <MemoryRouter initialEntries={['/recipe/1']}>
          <Routes>
            <Route path="/recipe/:id" element={<DisplayOne />} />
          </Routes>
        </MemoryRouter>,
        container
      );
    });
    expect(container).toMatchSnapshot();
  });

  test('Changing portions', async () => {
    await act(async () => {
      await render(
        <MemoryRouter initialEntries={['/recipe/1']}>
          <Routes>
            <Route path="/recipe/:id" element={<DisplayOne />} />
          </Routes>
        </MemoryRouter>,
        container
      );
    });

    // get hold of the current amount on ingredient 1
    let amount1 = container.querySelector('div table td')?.innerHTML;
    let indexOfAND = amount1.indexOf('&');
    amount1 = amount1.substring(0, indexOfAND);
    expect(amount1).toBe('1.5');

    // get hold of selector
    const selector = container.querySelector('div select');

    // change selector to 6 portions (firing event using react test library)
    fireEvent.change(selector, { target: { value: 6 } });

    // update and check new amount on ingredient 1
    amount1 = container.querySelector('div table td')?.innerHTML;
    indexOfAND = amount1.indexOf('&');
    amount1 = amount1.substring(0, indexOfAND);
    expect(amount1).toBe('2.3');
  });

  test('Like recipe', async () => {
    await act(async () => {
      await render(
        <MemoryRouter initialEntries={['/recipe/1']}>
          <Routes>
            <Route path="/recipe/:id" element={<DisplayOne />} />
          </Routes>
        </MemoryRouter>,
        container
      );
    });

    // confirm that this is a popular recipe
    let popular = container.querySelector('div h6.Recipe-popular');
    expect(popular.innerHTML).toBe('This item is popular');

    // click on popular icon (firing event using react test library)
    fireEvent.click(container.querySelector("div button[title='Like the recipe']"));

    // confirm that recipe is no longer popular
    popular = container.querySelector('div h6.Recipe-popular');
    expect(popular.innerHTML).toBe(' ');
  });

  test('Add to cart', async () => {
    await act(async () => {
      await render(
        <MemoryRouter initialEntries={['/recipe/1']}>
          <Routes>
            <Route path="/recipe/:id" element={<DisplayOne />} />
          </Routes>
        </MemoryRouter>,
        container
      );
    });

    // clear local storage (mocked) and check number of ingredients
    localStorage.clear();
    let cart: Ingredient[] = JSON.parse(localStorage.getItem('cart') as string);
    expect(cart.length).toEqual(0);

    // add ingredients to cart
    fireEvent.click(container.querySelector("button[title='Add recipe to shopping list']"));

    // check number of ingrediets again to verify addToCart function
    cart = JSON.parse(localStorage.getItem('cart') as string);
    expect(cart.length).toEqual(7);
  });
});
