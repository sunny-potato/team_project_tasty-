import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/index.css';
import { RiShoppingCart2Line } from 'react-icons/ri';

export function Navbar() {
  const [cartEmpty, setcartEmpty] = useState<boolean>();
  const [state, setState] = useState<boolean>();
  const [amount, setamount] = useState<number>();

  //Listen for changes in cart/localstorage and update notification on Navbar
  document.addEventListener(
    'storage',
    () => {
      const cartMemory: [] = JSON.parse(localStorage.getItem('cart')!);

      if (cartMemory.length >= 1) {
        setcartEmpty(false);
        setamount(cartMemory.length);
      } else {
        setcartEmpty(true);
      }
    },
    false
  );
  //Update navbar and amount in the cart
  useEffect(() => {
    const cartMemory: [] = JSON.parse(localStorage.getItem('cart')!);

    if (cartMemory && cartMemory.length > 1) {
      setcartEmpty(false);
    } else {
      setcartEmpty(true);
    }
  }, []);
  useEffect(() => {
    setState(!cartEmpty);
  }, [cartEmpty]);

  return (
    <nav className="NavMain">
      <Link to="/" className="Logo_title">
        Tasty
      </Link>
      <ul className="NavList">
        <li>
          <Link to="/" className="Link">
            Home
          </Link>
        </li>
        <li>
          <Link to="explore" className="Link">
            Explore
          </Link>
        </li>
        <li>
          <Link to="new" className="Link">
            Create new
          </Link>
        </li>
        <li>
          <Link to="cart" className="Link">
            {state ? (
              <div className="Cart-shopping-list">
                <RiShoppingCart2Line className="Shopping-cart" title="Shopping list" />
                <div className="Cart-notification">{amount}</div>
              </div>
            ) : (
              <RiShoppingCart2Line className="Shopping-cart" title="Your shopping list is empty" />
            )}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
