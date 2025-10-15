import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';

export default function UserForm() {
  const [inputName, setInputName] = useState('');
  const { setName } = useContext(UserContext);

  function handleSubmit(e) {
    e.preventDefault();
    setName(inputName);
    window.history.pushState({}, '', '/quiz');
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="userName">Enter your name:</label>
      <input
        id="userName"
        type="text"
        value={inputName}
        onChange={e => setInputName(e.target.value)}
        placeholder="Your name"
        required
      />
      <button type="submit">Start Quiz</button>
    </form>
  );
}