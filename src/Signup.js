import React from 'react';
import axios from 'axios';

const BASE_URL = 'http://94.74.86.174:8080/api';

function SignUpForm() {
  const [state, setState] = React.useState({
    username: '',
    email: '',
    password: '',
  });
  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleOnSubmit = (evt) => {
    evt.preventDefault();

    const { username, email, password } = state;

    axios
      .post(`${BASE_URL}/register`, { username, email, password })
      .then(() => {
        alert('Registration successful');
      })
      .catch((error) => {
        console.error('Error registering', error);
        alert('Registration failed');
      });

    for (const key in state) {
      setState({
        ...state,
        [key]: '',
      });
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Create Account</h1>
        <span style={{ marginBottom: '10px' }}>or use your email for registration</span>
        <input type="text" name="username" value={state.username} onChange={handleChange} placeholder="Username" />
        <input type="email" name="email" value={state.email} onChange={handleChange} placeholder="Email" />
        <input type="password" name="password" value={state.password} onChange={handleChange} placeholder="Password" autoComplete="current-password" />
        <button style={{ marginTop: '10px' }}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;
