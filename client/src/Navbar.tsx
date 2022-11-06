import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

export function Navbar() {
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
            Shopping list
          </Link>
        </li>
      </ul>
    </nav>
  );
}
