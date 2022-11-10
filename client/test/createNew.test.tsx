import * as React from 'react';
import { shallow } from 'enzyme';
import { CreateNew } from '../src/pages/CreateNew';
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
    fireEvent.change(name, {target: {value: 'New recipe'}});
    expect(name.value).toEqual('New recipe');

    // select meal type 'dinner' (first button) and check if active tag gets updated and background color changes
    let dinnerButton = container.querySelector("button");
    expect(dinnerButton.style.backgroundColor).toEqual('white');
    fireEvent.click(dinnerButton);
    expect(dinnerButton.style.backgroundColor).toEqual('lightblue');

    // write desctiption, and check that value gets updated
    let desctiption = container.querySelector("textarea[name='description']");
    expect(desctiption.value).toEqual('');
    fireEvent.change(desctiption, {target: {value: 'New description'}});
    expect(desctiption.value).toEqual('New description');

  });

  test('Input ingredients', async () => {
    
  })
});
