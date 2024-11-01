// src/components/Login.js
import React, { useState } from 'react';
import { db } from '../firebase/firebaseConfig'; // Firebase imports
import { doc, setDoc } from 'firebase/firestore';
import './Login.css';

const Login = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState(null);

  // Generate a unique ID for each user
  const generateUserId = () => `${name}-${Date.now()}`;

  const handleLogin = async () => {
    if (name && gender) {
      const userId = generateUserId(); // Generate unique ID

      // Store user data in Firestore under their unique ID
      try {
        await setDoc(doc(db, 'users', userId), {
          name,
          gender,
          userId,
          points: 0, // Initial points
        });

        // Pass user data back to App
        onLogin(name, gender, userId); // Pass generated userId
      } catch (error) {
        console.error('Error saving user to Firestore:', error);
      }
    } else {
      alert('Please enter your name and select a character.');
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
