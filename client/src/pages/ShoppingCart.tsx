import React, { useEffect, useState } from 'react';
import { Ingredient } from 'src/DataService';
import { Link } from 'react-router-dom';
import './PageStyling.css';
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from 'react-icons/io';
import { CiSquareRemove } from 'react-icons/ci';
import { BsPrinter } from 'react-icons/bs';

export function ShoppingCart() {
  const [cart, setCart] = useState<Ingredient[]>();
  const [data, setData] = useState(false);

  // useEffect to load contents of cart on load and mount of component
  useEffect(() => {
    getUpdate();
  }, [data]);

  function getUpdate() {
    const cartMemory = JSON.parse(localStorage.getItem('cart')!);
    if (cartMemory) {
      setCart(cartMemory);
    } else {
      setCart([]);
    }
  }

  //Update amuount of a ingredient
  //Increase amount
  function increaseAmount(id: number) {
    let index: number = cart!.findIndex((e) => e.ingredients_id === id);

    cart![index].amount = parseFloat((cart![index].amount + 0.1).toFixed(1));
    setCart(cart);
    setData(!data);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  //Decrease amount

  function decreaseAmount(id: number) {
    let index: number = cart!.findIndex((e) => e.ingredients_id === id);

    cart![index].amount = parseFloat((cart![index].amount - 0.1).toFixed(1));
    setCart(cart);
    setData(!data);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  //Function to delete contents of cart and local memory
  function clearList() {
    localStorage.setItem('cart', JSON.stringify([]));
    document.dispatchEvent(new Event('storage'));
    setCart([]);
  }

  //Remove an Item from the cart
  function removeItem(id: number) {
    const removedCart = cart?.filter((d) => d.ingredients_id != id);
    setCart(removedCart);
    localStorage.setItem('cart', JSON.stringify(removedCart));
    document.dispatchEvent(new Event('storage'));
  }
  function updateCart() {}
  return (
    <div className="Content-main">
      <h1>Shopping list</h1>
      <BsPrinter
        className="Icon-print"
        title="Print the shopping list"
        onClick={() => window.print()}
      />
      <table className="Ingredients-main">
        {cart?.length ? (
          <tbody>
            {cart?.map((e) => (
              <tr key={e.ingredients_id}>
                <td>
                  <IoMdAddCircleOutline
                    className="Icon-increase"
                    title="Increase amount"
                    onClick={() => increaseAmount(e.ingredients_id)}
                  />
                </td>
                <td className="Ingredients-cell">{e.amount}</td>
                <td>
                  <IoMdRemoveCircleOutline
                    className="Icon-decrease"
                    title="Decrease amount"
                    onClick={() => decreaseAmount(e.ingredients_id)}
                  />
                </td>

                <td className="Shopping-unit">{e.unit}</td>

                <td className="Ingredients-name">{e.ingredient}</td>
                <td>
                  <CiSquareRemove
                    className="Icon-remove"
                    onClick={() => removeItem(e.ingredients_id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          'You have not added anything to the shopping list yet...'
        )}
      </table>
      <div className="Extra-information">
        {cart?.length ? 'Total number of items: ' + cart?.length : ''}
      </div>
      <div>
        <Link to={'/'}>
          <button className="Button-navigation">Back</button>
        </Link>
        <button className="Button-navigation" title="Clear shopping list" onClick={clearList}>
          Clear list
        </button>
      </div>
    </div>
  );
}
