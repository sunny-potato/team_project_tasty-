import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateNew } from './pages/CreateNew';
import { DisplayOne } from './pages/DisplayOne';
import { EditRecipes } from './pages/EditRecipes';
import { Home } from './pages/Home';
import { Navbar } from './Navbar';
import './index.css';
import Explore from './pages/Explore';

function App() {
  return (
    /*Don't like the use of Hashrouter but i necessary to get the page to keep state and refresh
    Without changing the server side*/
    <div>
      <Navbar />
      <Routes basename="/">
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<DisplayOne />} />
        <Route path="/edit" element={<EditRecipes />} />
        <Route path="/new" element={<CreateNew />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </div>
  );
}

export default App;
