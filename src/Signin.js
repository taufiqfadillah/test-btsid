import React from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const BASE_URL = 'http://94.74.86.174:8080/api';

function SignInForm({ onLogin }) {
  const { setAuthToken } = useContext(AuthContext);
  const [state, setState] = React.useState({
    username: '',
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

    const { username, password } = state;

    axios
      .post(`${BASE_URL}/login`, { username: username, password })
      .then((response) => {
        setAuthToken(response.data.data.token);
        onLogin();
        alert('Login Successfully');
      })
      .catch((error) => {
        console.error('Error logging in', error);
        alert('Login failed');
      });

    for (const key in state) {
      setState({
        ...state,
        [key]: '',
      });
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Sign in</h1>
        <span>or use your account</span>
        <input type="text" placeholder="Uername" name="username" value={state.username} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={state.password} onChange={handleChange} />
        <button>Sign In</button>
      </form>
    </div>
  );
}

export default SignInForm;
