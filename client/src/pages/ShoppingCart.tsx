import React, { useEffect, useState } from 'react';
import { Ingredient } from 'src/DataService';
import { Link } from 'react-router-dom';
import './PageStyling.css';

export function ShoppingCart() {
  const [cart, setCart] = useState<Ingredient[]>();

  // useEffect to load contents of cart on load
  useEffect(() => {
    const cartMemory = JSON.parse(localStorage.getItem('cart')!);

    if (cartMemory) {
      setCart(cartMemory);
    }
  }, []);

  //Function to delete contents of cart and local memory
  function clearList() {
    localStorage.clear();
    setCart([]);
  }

  //Remove an Item from the cart
  function removeItem(id: number) {
    const removedCart = cart?.filter((d) => d.ingredients_id != id);
    setCart(removedCart);
    localStorage.setItem('cart', JSON.stringify(removedCart));
  }
  function updateCart() {}
  return (
    <div className="Content-main">
      <h4>Shopping list</h4>
      <table className="Ingredients-main">
        {cart ? (
          <tbody>
            {cart?.map((e) => (
              <tr key={e.ingredients_id}>
                <td className="Ingredients-cell">{e.amount}</td>
                <td className="Shopping-unit">{e.unit}</td>
                <td className="Ingredients-name">{e.ingredient}</td>
                <td>
                  <button
                    className="Button-remove"
                    title="Remove item from list"
                    onClick={() => removeItem(e.ingredients_id)}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          'You have not added anything to the shopping list yet...'
        )}
      </table>
      <div>
        <Link to={'/'}>
          <button className="Button-navigation">Back</button>
        </Link>
        <button className="Button-action" title="Clear shopping list" onClick={clearList}>
          Clear list
        </button>
      </div>
    </div>
  );
}
