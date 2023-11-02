import React, { useEffect } from "react";
import { AnimatePresence } from 'framer-motion';
import Board from "./Components/Board/Board";
import AuthSignin from "./Pages/AuthSignin";
import "./App.css";
import Editable from "./Components/Editabled/Editable";
import Home from "./Pages/Home";
import AuthSignup from "./Pages/AuthSignup";
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';

function App() {
  const location = useLocation();

  return (
    <div className="app">
      <AnimatePresence mode='wait' initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/signin" element={<AuthSignin />} />
          <Route path="/signup" element={<AuthSignup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Navigate to="/signin" />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
