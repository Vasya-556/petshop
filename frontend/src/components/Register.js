// Register.js
import React, { useState } from 'react';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: ''
  });

  const { username, email, password1, password2 } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div>
      
      <form onSubmit={handleSubmit} className="register-form">
        <div>
        <h2>Реєстрація</h2>
          <label htmlFor="username">Ім'я користувача:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Електронна пошта:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password1">Пароль:</label>
          <input
            type="password"
            id="password1"
            name="password1"
            value={password1}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password2">Підтвердження пароля:</label>
          <input
            type="password"
            id="password2"
            name="password2"
            value={password2}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Зареєструватись</button>
      </form>
    </div>
  );
}

export default Register;
