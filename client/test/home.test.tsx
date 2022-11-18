//import './mocks/dataServiceMock';
//import './mocks/localStorageMock';

import * as React from 'react';
import { shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Home } from '../src/pages/Home';

import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import { fireEvent } from '@testing-library/react';
import dataService from '../src/DataService';

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

  test('Test search function', async () => {
    await act(async () => {
      await render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>,
        container
      );
    });

    // check initial state where two recipies exists in list of recipe navigation buttons
    let buttonList = container.querySelectorAll('button.Button-recipe-navigation');
    expect(buttonList.length).toEqual(2);
    expect(buttonList[0].innerHTML).toEqual('One-Pot Mac and Cheese');
    expect(buttonList[1].innerHTML).toEqual('Easy Marinated Grilled Flank Steak');

    // search by name
    let searchText = container.querySelector('input.Input-search');
    fireEvent.change(searchText, { target: { value: 'Grilled' } });
    buttonList = container.querySelectorAll('button.Button-recipe-navigation');
    expect(buttonList.length).toEqual(1);
    expect(buttonList[0].innerHTML).toEqual('Easy Marinated Grilled Flank Steak');

    // search by description
    fireEvent.change(searchText, { target: { value: 'creamy mac recipe!' } });
    buttonList = container.querySelectorAll('button.Button-recipe-navigation');
    expect(buttonList.length).toEqual(1);
    expect(buttonList[0].innerHTML).toEqual('One-Pot Mac and Cheese');

    // search by ingredient
    fireEvent.change(searchText, { target: { value: 'barbecue sauce' } });
    buttonList = container.querySelectorAll('button.Button-recipe-navigation');
    expect(buttonList.length).toEqual(1);
    expect(buttonList[0].innerHTML).toEqual('Easy Marinated Grilled Flank Steak');

    // search for something that does not exist (expect no navigation buttons)
    fireEvent.change(searchText, { target: { value: 'does not exist' } });
    buttonList = container.querySelectorAll('button.Button-recipe-navigation');
    expect(buttonList.length).toEqual(0);
  });

  test('Test filtering function', async () => {
    await act(async () => {
      await render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>,
        container
      );
    });

    // check initial state where two recipies exists in list of recipe navigation buttons
    let buttonList = container.querySelectorAll('button.Button-recipe-navigation');
    expect(buttonList.length).toEqual(2);
    expect(buttonList[0].innerHTML).toEqual('One-Pot Mac and Cheese');
    expect(buttonList[1].innerHTML).toEqual('Easy Marinated Grilled Flank Steak');

    // find all filter buttons:
    let filterButtons = container.querySelectorAll('button.Button-filter');
    expect(filterButtons.length).toEqual(7);

    // filter by lunch (expect none)
    fireEvent.click(filterButtons[1]);
    buttonList = container.querySelectorAll('button.Button-recipe-navigation');
    expect(buttonList.length).toEqual(0);

    // check that other filters are unavailable, and cancel lunch filter button is:
    filterButtons = container.querySelectorAll('button.Button-filter');
    expect(filterButtons.length).toEqual(0);
    let cancelButton = container.querySelector('button.Button-filter-active');
    expect(cancelButton.innerHTML.includes('lunch')).toEqual(true);

    // cancel lunch filter
    fireEvent.click(cancelButton);
    filterButtons = container.querySelectorAll('button.Button-filter');
    expect(filterButtons.length).toEqual(7);
    buttonList = container.querySelectorAll('button.Button-recipe-navigation');
    expect(buttonList.length).toEqual(2);
    expect(buttonList[0].innerHTML).toEqual('One-Pot Mac and Cheese');
    expect(buttonList[1].innerHTML).toEqual('Easy Marinated Grilled Flank Steak');

    // filter by dinner (both test recipies are dinners)
    fireEvent.click(filterButtons[0]);
    buttonList = container.querySelectorAll('button.Button-recipe-navigation');
    expect(buttonList.length).toEqual(2);
    expect(buttonList[0].innerHTML).toEqual('One-Pot Mac and Cheese');
    expect(buttonList[1].innerHTML).toEqual('Easy Marinated Grilled Flank Steak');
    cancelButton = container.querySelector('button.Button-filter-active');
    expect(cancelButton.innerHTML.includes('dinner')).toEqual(true);
    fireEvent.click(cancelButton);

    // filter by breakfast (expect none)
    filterButtons = container.querySelectorAll('button.Button-filter');
    fireEvent.click(filterButtons[2]);
    buttonList = container.querySelectorAll('button.Button-recipe-navigation');
    expect(buttonList.length).toEqual(0);
    cancelButton = container.querySelector('button.Button-filter-active');
    expect(cancelButton.innerHTML.includes('breakfast')).toEqual(true);
    fireEvent.click(cancelButton);

    // filter by snack (expect none)
    filterButtons = container.querySelectorAll('button.Button-filter');
    fireEvent.click(filterButtons[3]);
    buttonList = container.querySelectorAll('button.Button-recipe-navigation');
    expect(buttonList.length).toEqual(0);
    cancelButton = container.querySelector('button.Button-filter-active');
    expect(cancelButton.innerHTML.includes('snack')).toEqual(true);
    fireEvent.click(cancelButton);

    // filter by dessert (expect none)
    filterButtons = container.querySelectorAll('button.Button-filter');
    fireEvent.click(filterButtons[4]);
    buttonList = container.querySelectorAll('button.Button-recipe-navigation');
    expect(buttonList.length).toEqual(0);
    cancelButton = container.querySelector('button.Button-filter-active');
    expect(cancelButton.innerHTML.includes('dessert')).toEqual(true);
    fireEvent.click(cancelButton);

    // filter by popular (test recipe nr 2 are popular)
    filterButtons = container.querySelectorAll('button.Button-filter');
    fireEvent.click(filterButtons[5]);
    buttonList = container.querySelectorAll('button.Button-recipe-navigation');
    expect(buttonList.length).toEqual(1);
    expect(buttonList[0].innerHTML).toEqual('Easy Marinated Grilled Flank Steak');
    cancelButton = container.querySelector('button.Button-filter-active');
    expect(cancelButton.innerHTML.includes('popular')).toEqual(true);
    fireEvent.click(cancelButton);

    // filter by new (test recipe nr 1 are new)
    filterButtons = container.querySelectorAll('button.Button-filter');
    fireEvent.click(filterButtons[6]);
    buttonList = container.querySelectorAll('button.Button-recipe-navigation');
    expect(buttonList.length).toEqual(1);
    expect(buttonList[0].innerHTML).toEqual('One-Pot Mac and Cheese');
    cancelButton = container.querySelector('button.Button-filter-active');
    expect(cancelButton.innerHTML.includes('new')).toEqual(true);
    fireEvent.click(cancelButton);
  });
});
