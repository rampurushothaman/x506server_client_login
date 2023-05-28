import React, { useState } from 'react';
import axios from 'axios';

function LoginForm() {
  const [certificate, setCertificate] = useState('');
  const [loginState, setLoginState] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/login', { certificate });

      if (response.status === 200) {
        const { token } = response.data;
        setLoginState(true)
        localStorage.setItem("token", token)
      } else {
        console.log('Login failed');
        setLoginState(false)
      }
    } catch (error) {
      console.log('Error occurred during login:', error.message);
    }
  };

  return (
    <div>
      <h2>Login Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Certificate:
          <input
            type="file"
            value={certificate}
            onChange={(e) => setCertificate(e.target.value)}
          />
        </label>
        <button type="submit">Login</button>
      </form>
      {loginState && <p>Successfully logged in with Token</p>}
    </div>
  );
}

export default LoginForm;
