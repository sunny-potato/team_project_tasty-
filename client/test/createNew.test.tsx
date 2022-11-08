import * as React from 'react';
import { shallow } from 'enzyme';
import { CreateNew } from '../src/pages/CreateNew';

describe('CreateNew page tests', () => {
  test('CreateNew page draws correctly', (done) => {
    const wrapper = shallow(<CreateNew />);
    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
});
