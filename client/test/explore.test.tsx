import * as React from 'react';
import { shallow } from 'enzyme';
import { Explore } from '../src/pages/Explore';

describe('Explore page tests', () => {
  test('Explore page draws correctly', (done) => {
    const wrapper = shallow(<Explore />);
    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
});
