import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';
import SigninForm from './components/SignIn';
import SignupForm from './components/SignUp';
import HomePage from './components/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import AboutUs from './components/AboutUs';
import Contacts from './components/Contacts';
import UserPage from './components/UserPage';
import ProductPage from './components/ProductPage';
import AddProduct from './components/AddProduct';
import PageNotFound from './components/PageNotFound';
import ProductSearch from './components/ProductSearch';
import AdminPage from './components/AdminPage';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) {
          setIsAdmin(false);
          return;
        }
        const response = await axios.get(`http://localhost:8000/api/user/${userId}/`);
        setIsAdmin(response.data.status === 'admin');
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsAdmin(false);
      }
    };
  
    if (userId) {
      fetchUserData();
    } else {
      setIsAdmin(false);
    }

  }, [userId]);

  return (
    <Router>
    <div>
      <Header />
      {/* <ProductSearch/> */}
      <Routes>
        <Route exact path="/signin" element={<SigninForm />} />
        <Route exact path="/signup" element={<SignupForm />} />
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/aboutus" element={<AboutUs />} />
        <Route exact path="/contacts" element={<Contacts />} />
        <Route exact path="/product/:productId" element={<ProductPage />} />
        {isAdmin && <Route exact path="/addProduct" element={<AddProduct />} />}
        {isAdmin && <Route exact path="/adminPage" element={<AdminPage />} />}
        <Route exact path='/about_us' element={<AboutUs/>} />
        <Route exact path='/user' element={<UserPage/>} />

        <Route path='*' element={<PageNotFound/>}/>
      </Routes>
    </div> 
  </Router>
  );
}

export default App;