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
        <MemoryRouter>
          <EditRecipes />
        </MemoryRouter>,
        container
      );
    });
    expect(container).toMatchSnapshot();
  });
});
