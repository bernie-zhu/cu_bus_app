import React from 'react'
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import Login from './views/Login'
import Favorites from './views/Favorites'
import ChangePwd from './views/ChangePwd'
import AdvanceQuery from './views/AdvanceQuery'
import Map from './views/Map'

function App(props) {
  return (
    // ? ???
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/Login" />} />
        <Route path="/Login" exact element={<Login props={props} />} />
        <Route path="/favorites" exact element={<Favorites />} />
        <Route path="/change_pwd" exact element={<ChangePwd />} />
        <Route path="/advance_query" exact element={<AdvanceQuery />} />
        <Route path="/map" exact element={<Map />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
