// src/components/Login.js
import React, { useState } from 'react';
import './Login.css';
import desert from '../assets/loginPage/desert.svg';
import dunes from '../assets/loginPage/dunes.svg';
import camel from '../assets/loginPage/camel.svg';


const Login = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState(null);

  const handleLogin = () => {
    if (name && gender) {
      onLogin(name, gender);  // Proceed only if both name and gender are selected
    } else {
      alert("Please enter your name and select a character.");
    }
  };

  return (


    <div className="login-container">
      <div className="login-card">
        <h1>منصة لبيب التعليمية</h1>
        <input
          type="text"
          placeholder=" ادخل اسمك هنا"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="gender-selection">
          <h3>اختر شخصيتك</h3>
          
          <div className="gender-options">
            <div
              className={`gender-option ${gender === 'boy' ? 'selected' : ''}`}
              onClick={() => setGender('boy')}
            >
              <img src="/Images/boy-char-login.png" alt="Boy" />

              <p>فتى</p>
            </div>
            <div
              className={`gender-option ${gender === 'girl' ? 'selected' : ''}`}
              onClick={() => setGender('girl')}
            >
              <img src="/Images/girl-char-login.png" alt="Girl" />
              <p>فتاة</p>
            </div>
          </div>
        </div>
        <button onClick={handleLogin}>ابدأ</button>
      </div>
    </div>
  );
};

export default Login;
