/* istanbul ignore file */
// ^ignore file in test report

import { Ingredient } from '../../src/DataService';

// mock localStorage
const localStorageMock = (() => {
  let cart: Ingredient[] = [
    { ingredients_id: 1, ingredient: 'whole milk', amount: 1.5, unit_id: 2, unit: 'cup' },
    { ingredients_id: 2, ingredient: 'water', amount: 3, unit_id: 2, unit: 'cup' },
  ];

  return {
    getItem(key: string) {
      console.log(JSON.stringify(cart));
      return JSON.stringify(cart);
    },

    setItem(key: string, value: string) {
      cart = JSON.parse(value);
    },

    clear() {
      cart = [];
    },

    removeItem(key: string) {},

    getAll() {
      return cart;
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
