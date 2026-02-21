import React from 'react';
import BookingPage from './pages/BookingPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Little Lemon</h1>
      </header>
      <BookingPage />
      <footer>
        <p>&copy; 2024 Little Lemon</p>
      </footer>
    </div>
  );
}

export default App;