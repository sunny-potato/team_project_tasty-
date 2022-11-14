//import './mocks/dataServiceMock';
//import './mocks/localStorageMock';

import * as React from 'react';
import { shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Home } from '../src/pages/Home';

import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

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

describe('Home page tests', () => {
  test('Home page includes correct static elements', (done) => {
    const wrapper = shallow(<Home />);
    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <h1>Welcome to the Tasty</h1>,
          <p>
            Here you can explore your own recipes by adding new content, editing existing ones and
            deleting the ones you don't care about anymore.
          </p>,
          <div className="Content-second">
            <p>
              This is also the place to discover more and get inspiration from, we have selected a
              few to show you from below.
            </p>
          </div>,
        ])
      ).toEqual(true);
      done();
    });
  });
  test('Home page draws correctly (snapshot) including list of buttons', async () => {
    await act(async () => {
      await render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>,
        container
      );
    });
    expect(container).toMatchSnapshot();
  });
});
