import React, {useState, useEffect} from 'react';
import './header.css'
import axios from 'axios';
// import { Link } from 'react-router-dom';

const Header = () => {
    const [authenticated, setAuthenticated] = useState(false);

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
    }, []);
  
    const logout = () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Redirect the user to the sign-in page or any other desired page
      window.location.href = '/'; // Redirect to the sign-in page
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
                        {/* <li><a href="/aboutus">Про нас</a></li>
                        <li><a href="/contacts">Контакти</a></li> */}
                    {authenticated ? (<>                
                        <li><a onClick={logout}>Вийти</a></li>
                    </>) : (<>
                        <li><a href="/signin">Вхід</a></li>
                        <li><a href="/signup">Реєстрація</a></li>
                    </>)}
                    </ul>
                </nav>
                {/* <div className="search-bar">
                    <input type="text" placeholder="Пошук..." />
                    <button type="submit">Пошук</button>
                </div> */}
            </div>
        </header>
    );
}

export default Header;
