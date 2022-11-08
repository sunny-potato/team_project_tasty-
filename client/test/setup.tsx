import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

// include mock files in all tests
import './mocks/dataServiceMock';
import './mocks/localStorageMock';

configure({ adapter: new Adapter() });
