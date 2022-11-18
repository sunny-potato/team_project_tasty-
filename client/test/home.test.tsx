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
          <h1>Welcome to Tasty!</h1>,
          <h4>The home of recipes...</h4>,
          <p>
            Here you can explore your own recipes by adding new content, editing existing ones and
            deleting the ones you don't care about anymore.
          </p>,
          <p>Use the search and filtering function to narrow down your search.</p>,
          <h5 className="Extra-information">Filters:</h5>,
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
