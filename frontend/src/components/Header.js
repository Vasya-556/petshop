import React, {useState, useEffect} from 'react';
import './header.css'
import axios from 'axios';

const Header = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        axios.post('http://localhost:8000/api/token/verify/', { token: accessToken })
          .then(() => {
            setAuthenticated(true);
          })
          .catch(() => {
            setAuthenticated(false);
          });
      } else {
        setAuthenticated(false);
      }

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
    }, []);
  
    const logout = () => {
      localStorage.removeItem('user_id');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/'; 
      window.location.reload();
    };

    return (
        <header>
            <div className="container">
                <div className="logo">
                    <a href="/"><img src="/img/lapa.png" alt="Зоо-магазин" /></a>
                </div>
                <nav>
                    <ul>
                    {isAdmin && <li><a href="/adminPage">AdminPage</a></li>}
                    {isAdmin && <li><a href="/addProduct">AddProduct</a></li>}
                    <li><a href="/about_us">About us</a></li>
                    {authenticated ? (<>                
                        <li><a href="/user">UserPage</a></li>
                        <li><a onClick={logout}>Вийти</a></li>
                    </>) : (<>
                        <li><a href="/signin">Вхід</a></li>
                        <li><a href="/signup">Реєстрація</a></li>
                    </>)}
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
