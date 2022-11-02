import React, { useEffect, useState } from 'react';
import { Ingredient } from 'src/DataService';

export function ShoppingCart() {
  const [cart, setCart] = useState<Ingredient[]>();

  useEffect(() => {
    const cartMemory = JSON.parse(localStorage.getItem('cart')!);

    if (cartMemory) {
      setCart(cartMemory);
    }
  }, []);

  function updateCart() {}
  return (
    <div>
      <ul>
        {cart?.map((e) => (
          <li key={e.ingredients_id}>
            {e.ingredient}
            <button className="Button-remove">X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
