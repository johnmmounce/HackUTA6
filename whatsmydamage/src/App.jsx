// src/App.jsx
import React, { useState } from 'react';
import DebtInputForm from './components/DebtInputForm';
import DebtResults from './components/DebtResults';
import DebtRepaymentChart from './components/DebtRepaymentChart'; // Import the chart component
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import Navbar from './components/NavBar';
import './App.css';
import { useAuth } from './hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

function App() {
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [showSignUp, setShowSignUp] = useState(false);
  const { user } = useAuth();
  const name = "Bob"
  //Loading state
  const [loading, setLoading] = useState(false);

  const calculateDebt = ({ principal, interestRate, monthlyPayment }) => {
    //Set Loading to true when calculation starts
    setLoading(true);


    const p = parseFloat(principal);
    const r = parseFloat(interestRate) / 100 / 12;
    let remainingBalance = p;
    const repaymentData = [];
    let month = 0;

    setTimeout(() => {
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

      setLoading(false);
    }, 1000); //Simulating a one second delay for the pop-up
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
        <Navbar username={user.email} onClick={handleLogout}/>
          {/* <button onClick={handleLogout}>Log Out</button> */}
          <div className="app-container">
            <DebtInputForm onCalculate={calculateDebt} />

            {/*Show loading message when calculating*/}
            {loading && (
              <div className="popup">
              <div className="popup-content">
                <p>Calculating your damage...</p>
              </div>
            </div>
          )}
          
          <DebtResults results={results} />
          {/* Render the chart if there's data */}
          {chartData.length > 0 && (
            <div className = "chart-container">
              <DebtRepaymentChart data={chartData} />
              </div>
            )}
            
          </div>
        </>
      )}
    </div>
  );
}

export default App;