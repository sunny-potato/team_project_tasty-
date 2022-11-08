//import './mocks/dataServiceMock';
//import './mocks/localStorageMock';

import * as React from 'react';
import { shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { DisplayOne } from '../src/pages/DisplayOne';

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

describe('DisplayOne page tests', () => {
  test('DisplayOne page draws correctly (snapshot) including data from test recipe 1', async () => {
    await act(async () => {
      await render(
        <MemoryRouter>
          <DisplayOne />
        </MemoryRouter>,
        container
      );
    });
    expect(container).toMatchSnapshot();
  });

  test('Changing portions', async () => {
    await act(async () => {
      await render(
        <MemoryRouter>
          <DisplayOne />
        </MemoryRouter>,
        container
      );
    });

    // get hold of the current amount on ingredient 1
    let amount1 = container.querySelector('div table td')?.innerHTML.substring(0, 3);
    expect(amount1).toBe('1.5');

    // get hold of selector
    const selector = container.querySelector('div select');

    // change selector to 6 portions (firing event using react test library)
    fireEvent.change(selector, { target: { value: 6 } });

    // update and check new amount on ingredient 1
    amount1 = container.querySelector('div table td')?.innerHTML.substring(0, 3);
    expect(amount1).toBe('2.3');
  });

  test('Like recipe', async () => {
    await act(async () => {
      await render(
        <MemoryRouter>
          <DisplayOne />
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
    expect(popular.innerHTML).toBe('');
  });
});
