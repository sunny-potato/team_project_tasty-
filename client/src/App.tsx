import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateNew } from './pages/CreateNew';
import { DisplayOne } from './pages/DisplayOne';
import { EditRecipes } from './pages/EditRecipes';
import { Home } from './pages/Home';
import { Navbar } from './components/Navbar';
import './css/index.css';
import { Explore } from './pages/Explore';
import { ShoppingCart } from './pages/ShoppingCart';

function App() {
  return (
    <div>
      <Navbar />
      {/* @ts-ignore*/}
      <Routes basename="/">
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<DisplayOne />} />
        <Route path="/edit/:id" element={<EditRecipes />} />
        <Route path="/new" element={<CreateNew />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/cart" element={<ShoppingCart />} />
      </Routes>
    </div>
  );
}

export default App;
