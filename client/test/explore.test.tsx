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

global.fetch = jest.fn();

describe('Explore page tests', () => {
  test('Explore page draws correctly', async () => {
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
});
