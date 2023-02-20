import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/index.css';
import { RiShoppingCart2Line } from 'react-icons/ri';

export function Navbar() {
  const [state, setState] = useState<boolean>();
  const [amount, setamount] = useState<number>();

  //Listen for changes in cart/localstorage and update notification on Navbar
  document.addEventListener('storage', () => {
    setState(!state);
  });

  // Update amount of shopping list on change and initial load
  useEffect(() => {
    const data = localStorage.getItem('cart');
    //-------error occured because the case of nothing in localstorage  was not considered-----//
    if (!data) {
      setState(false);
      return;
    }

    const cartMemory: [] = JSON.parse(data);

    if (cartMemory.length >= 1) {
      setState(true);
      setamount(cartMemory.length);
    } else {
      setState(false);
    }
  }, [state]);

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
                <div className="Cart-notification">{amount! > 0 ? amount : ''}</div>
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
