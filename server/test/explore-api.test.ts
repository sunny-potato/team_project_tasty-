import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import recipeService, { Recipe, RecipeInfo, Ingredient } from '../src/recipe-service';
import externalService from '../src/external-service';

axios.defaults.baseURL = 'http://localhost:3002';

let testItem = {
  diets: ['lacto ovo vegetarian'],
  extendedIngredients: [
    {
      id: 18371,
      amount: 1.5,
      measures: { us: { amount: 1.5, unitShort: 'tsps' } },
      name: 'baking powder',
    },
    {
      id: 20027,
      amount: 2,
      measures: { us: { amount: 2, unitShort: 'tsps' } },
      name: 'cornstarch',
    },
  ],
  id: 715378,
  image: 'https://spoonacular.com/recipeImages/715378-556x370.jpg',
  servings: 3,
  summary:
    'The recipe Strawberry and Nutella Cobbler could satisfy your Southern craving in roughly <b>45 minutes</b>. This recipe makes 3 servings with <b>664 calories</b>, <b>7g of protein</b>, and <b>26g of fat</b> each. For <b>$1.79 per serving</b>, this recipe <b>covers 17%</b> of your daily requirements of vitamins and minerals. It can be enjoyed any time, but it is especially good for <b>Mother\'s Day</b>. 435 people were impressed by this recipe. Head to the store and pick up baking powder, cornstarch, salt, and a few other things to make it today. Several people really liked this dessert. It is a good option if you\'re following a <b>vegetarian</b> diet. All things considered, we decided this recipe <b>deserves a spoonacular score of 67%</b>. This score is pretty good. Try <a href="https://spoonacular.com/recipes/strawberry-nutella-cheesecake-610461">Strawberry Nutella Cheesecake</a>, <a href="https://spoonacular.com/recipes/strawberry-nutella-poptarts-583757">Strawberry Nutella Poptarts</a>, and <a href="https://spoonacular.com/recipes/strawberry-nutella-muffins-547678">Strawberry Nutella Muffins</a> for similar recipes.',
  title: 'Strawberry and Nutella Cobbler',
  veryPopular: true,
};

//jest.mock('../src/external-service');

let webServer: any;
beforeAll(() => (webServer = app.listen(3002)));
beforeEach(() => jest.clearAllMocks());
afterAll(() => webServer.close());

describe('testing explore service functions', () => {
  test('Get api key', async () => {
    externalService.apiKey = jest.fn(() => Promise.resolve('test key'));

    const response = await axios.get('/api/v2/explore');
    expect(response.status).toEqual(200);
    expect(response.data).toEqual('test key');
  });

  test('Get api data', async () => {
    const response = await axios.post('api/v2/explore', [testItem]);
    expect(response.status).toEqual(200);
    expect(response.data[0].recipeInfo.name).toEqual('Strawberry and Nutella Cobbler');
    expect(response.data[0].ingredients[0].ingredient).toEqual('baking powder')
  });
});
