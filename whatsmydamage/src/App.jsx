// src/App.jsx
import React, { useState } from 'react';
import DebtInputForm from './components/DebtInputForm';
import DebtResults from './components/DebtResults';
import DebtRepaymentChart from './components/DebtRepaymentChart'; // Import the chart component
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import './App.css';
import { useAuth } from './hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

function App() {
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [showSignUp, setShowSignUp] = useState(false);
  const { user } = useAuth();

  const calculateDebt = ({ principal, interestRate, monthlyPayment }) => {
    const p = parseFloat(principal);
    const r = parseFloat(interestRate) / 100 / 12;
    let remainingBalance = p;
    const repaymentData = [];
    let month = 0;

    while (remainingBalance > 0 && month < 600) {  // Avoid infinite loops
      const interestForMonth = remainingBalance * r;
      const paymentTowardsPrincipal = monthlyPayment - interestForMonth;
      remainingBalance -= paymentTowardsPrincipal;

      // Ensure balance doesn’t go negative
      if (remainingBalance < 0) remainingBalance = 0;

      repaymentData.push({
        month: month + 1,
        remainingBalance: remainingBalance.toFixed(2),
        monthlyPayment: monthlyPayment,
      });
      
      month++;
    }

    setResults({
      monthlyPayment,
      totalInterest: (monthlyPayment * month - p).toFixed(2),
      repaymentMonths: month,
    });

    setChartData(repaymentData);  // Set the chart data
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
      {!user ? (
        <>
          {showSignUp ? (
            <SignUpForm />
          ) : (
            <LoginForm />
          )}
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
            {/* Render the chart if there's data */}
            {chartData.length > 0 && (
              <DebtRepaymentChart data={chartData} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
