import * as React from 'react';
import { shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { ShoppingCart } from '../src/pages/ShoppingCart';

import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';

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

describe('ShoppingCart page tests', () => {
  test('ShoppingCart page draws correctly', async () => {
    await act(async () => {
      await render(
        <MemoryRouter>
          <ShoppingCart />
        </MemoryRouter>,
        container
      );
    });
    expect(container).toMatchSnapshot();
  });
  test('Increase and decrease amount', async () => {
    await act(async () => {
      await render(
        <MemoryRouter>
          <ShoppingCart />
        </MemoryRouter>,
        container
      );
    });
    //get and check current amount on first ingredient
    let amount1 = container.querySelector('td.Ingredients-cell')?.innerHTML;
    expect(amount1).toBe('1.5');

    // increase amount and then check value again
    fireEvent.click(container.querySelector('.Icon-increase'));
    amount1 = container.querySelector('td.Ingredients-cell')?.innerHTML;
    expect(amount1).toBe('1.6');

    // decrease amount by 0.2 and check value again
    fireEvent.click(container.querySelector('.Icon-decrease'));
    fireEvent.click(container.querySelector('.Icon-decrease'));
    amount1 = container.querySelector('td.Ingredients-cell')?.innerHTML;
    expect(amount1).toBe('1.4');
  });
  test('Delete ingredient', async () => {
    await act(async () => {
      await render(
        <MemoryRouter>
          <ShoppingCart />
        </MemoryRouter>,
        container
      );
    });
    // get and check name of first ingredient
    let ingredient1 = container.querySelector('.Ingredients-name')?.innerHTML;
    expect(ingredient1).toBe('whole milk');

    // delete the first ingredient and check that ingredient no longer is 'whole milk'
    fireEvent.click(container.querySelector('.Icon-remove'));
    ingredient1 = container.querySelector('.Ingredients-name')?.innerHTML;
    expect(ingredient1).toBe('water');
  });
});
