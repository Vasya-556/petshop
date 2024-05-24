import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password1 !== formData.password2) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/api/signup/', {
        username: formData.username,
        email: formData.email,
        password: formData.password1
      });
      console.log(res.data);
      navigate('/');
      window.location.reload();
      // Handle success (redirect, show success message, etc.)
    } catch (error) {
      console.error(error);
      // Handle error (show error message, clear form fields, etc.)
    }
  };

  return (
    <div>
        <form onSubmit={handleSubmit} className="register-form">
            <h2>Реєстрація</h2>   
            <div>
                <label htmlFor="username">Ім'я користувача:</label>
                <input
                type='text'
                name='username'
                id='username'
                value={formData.username} 
                onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="email">Електронна пошта:</label>
                <input
                type='email'
                id='email'
                name='email'
                value={formData.email} 
                onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="password1">Пароль:</label>
                <input
                type='password'
                id='password1'
                name='password1'
                value={formData.password1} 
                onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="password2">Підтвердження пароля:</label>
                <input
                type='password'
                id='password2'
                name='password2'
                value={formData.password2} 
                onChange={handleChange}
                />
            </div>
            {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}
            <button type="submit">Зареєструватись</button>
        </form>
    </div>
  );
};

export default SignupForm;
