

import React, { useState } from 'react';
import './LoginPopUp.css';
import { assets } from '../../assets/assets';
import axios from 'axios';

export default function LoginPopUp({ setShowLogin }) {
  const [currState, setCurrState] = useState('Sign Up');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [agreed, setAgreed] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(''), 3000);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password, name } = formData;

    if (!email || !password || (currState === 'Sign Up' && !name)) {
      showPopup('⚠️ Please fill in all required fields.');
      return;
    }

    if (!agreed) {
      showPopup('⚠️ Please agree to the terms before continuing.');
      return;
    }

    try {
      if (currState === 'Login') {
        const response = await axios.post('http://localhost:8000/api/token/', {
          username: email,
          password: password,
        });

        const { access } = response.data;

        if (access) {
          localStorage.setItem('token', access);
          showPopup('✅ Login successful!');
          setTimeout(() => {
            setShowLogin(false);
            window.location.reload();
          }, 1500);
        } else {
          showPopup('❌ Invalid email or password.');
        }

      } else {
        const response = await axios.post('http://localhost:8000/api/register/', {
          username: email,
          email: email,
          password: password,
          first_name: name,
        });

        if (response.status === 201 || response.status === 200) {
          showPopup('✅ Account created! Please login.');
          setCurrState('Login');
          setFormData({ name: '', email: '', password: '' });
        } else {
          showPopup('❌ Signup failed.');
        }
      }
    } catch (error) {
      console.error('❌ Error:', error);

      if (error.response && error.response.data) {
        const errorMsg = error.response.data.error || error.response.data.detail || '❌ Something went wrong.';
        showPopup(errorMsg);
      } else {
        showPopup('❌ Network error. Please try again.');
      }
    }
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
        </div>

        <div className="login-popup-inputs">
          {currState === 'Sign Up' && (
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="login-popup-condition">
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
            id="terms-checkbox"
            required
          />
          <label htmlFor="terms-checkbox">
            By continuing, I agree to the terms of use & privacy policy.
          </label>
        </div>

        <button type="submit">
          {currState === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>

        <p>
          {currState === 'Login' ? (
            <>Don't have an account?{' '}
              <span
                onClick={() => setCurrState('Sign Up')}
                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
              >
                Create one
              </span>
            </>
          ) : (
            <>Already have an account?{' '}
              <span
                onClick={() => setCurrState('Login')}
                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
              >
                Login here
              </span>
            </>
          )}
        </p>
      </form>

      {popupMessage && (
        <div className="popup-message">
          {popupMessage}
        </div>
      )}
    </div>
  );
}
