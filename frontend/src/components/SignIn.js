import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const SigninForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:8000/api/signin/', formData);
      console.log(res.data);
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      navigate('/'); // Redirect to home page on success
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Invalid username or password');
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className='login-container'>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Вхід</h2>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <div>
          <label htmlFor="username">Ім'я користувача:</label>
          <input
            type='text'
            id='username'
            name='username'
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Пароль:</label>
          <input
            type='password'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Увійти</button>
      </form>
    </div>
  );
};

export default SigninForm;
