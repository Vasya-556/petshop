import React from 'react';
import './App.css';
import SigninForm from './components/SignIn';
import SignupForm from './components/SignUp';
import HomePage from './components/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import AboutUs from './components/AboutUs';
import Contacts from './components/Contacts';

function App() {
  return (
    <Router>
    <div>
      <Header />
      <Routes>
        <Route exact path="/signin" element={<SigninForm />} />
        <Route exact path="/signup" element={<SignupForm />} />
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/aboutus" element={<AboutUs />} />
        <Route exact path="/contacts" element={<Contacts />} />
      </Routes>
    </div>
  </Router>
  );
}

export default App;
