import * as React from 'react';
import { shallow } from 'enzyme';
import { EditRecipes } from '../src/pages/EditRecipes';

describe('EditRecipes page tests', () => {
  test('EditRecipes page draws correctly', (done) => {
    const wrapper = shallow(<EditRecipes />);
    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
});
