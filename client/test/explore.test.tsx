import * as React from 'react';
import { shallow } from 'enzyme';
import { Explore } from '../src/pages/Explore';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';

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

//Mock fetch function:
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        recipes: {
          recipeInfo: { id: 0 },
          ingredients: [{ ingredients_id: 0 }],
        },
      }),
  })
) as jest.Mock;

describe('Explore page tests', () => {
  test('Explore page draws correctly (snapshot), getting items from local storage mock', async () => {
    await act(async () => {
      await render(
        <MemoryRouter>
          <Explore />
        </MemoryRouter>,
        container
      );
    });
    expect(container).toMatchSnapshot();
  });

  test('Explore runs fetch function', async () => {
    // Create new mock of local storage getItem that returns null
    let newGetItem = jest.spyOn(localStorage, 'getItem') as jest.Mock;
    newGetItem.mockImplementation(() => {
      return null;
    });

    await act(async () => {
      await render(
        <MemoryRouter>
          <Explore />
        </MemoryRouter>,
        container
      );
    });

    // expect fetch (mocked) to have been called
    expect(fetch).toHaveBeenCalled();
  });
});
