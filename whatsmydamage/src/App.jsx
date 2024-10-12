// src/App.jsx
import React, { useState } from 'react';
import DebtInputForm from './components/DebtInputForm';
import DebtResults from './components/DebtResults';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm'; // Import SignUpForm
import './App.css';
import { useAuth } from './hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from './firebase'; // Import Firebase auth for logout

function App() {
  const [results, setResults] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false); // Toggle between login and sign-up forms
  const { user } = useAuth();

  const calculateDebt = ({ principal, interestRate, monthlyPayment }) => {
    const p = parseFloat(principal);
    const r = parseFloat(interestRate) / 100 / 12;
    const n = Math.log(monthlyPayment / (monthlyPayment - p * r)) / Math.log(1 + r);

    const totalInterest = monthlyPayment * n - p;

    setResults({
      monthlyPayment,
      totalInterest: totalInterest.toFixed(2),
      repaymentMonths: Math.ceil(n),
    });
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      console.log('User logged out');
    }).catch((error) => {
      console.error('Error logging out:', error);
    });
  };

  return (
    <div>
      {/* Show login or sign-up form if the user is not logged in */}
      {!user ? (
        <>
          {showSignUp ? (
            <SignUpForm />
          ) : (
            <LoginForm />
          )}
          {/* Toggle between login and sign-up */}
          <button onClick={() => setShowSignUp(!showSignUp)}>
            {showSignUp ? 'Have an account? Log In' : "Don't have an account? Sign Up"}
          </button>
        </>
      ) : (
        <>
          <h1>Welcome, {user.email}</h1>
          <button onClick={handleLogout}>Log Out</button>
          <div className="app-container">
            <h1>Debt Repayment Calculator</h1>
            <DebtInputForm onCalculate={calculateDebt} />
            <DebtResults results={results} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
