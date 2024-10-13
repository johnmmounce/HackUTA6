// src/App.jsx
import React, { useState } from 'react';
import DebtInputForm from './components/DebtInputForm';
import DebtResults from './components/DebtResults';
// Import the chart component
import DebtRepaymentChart from './components/DebtRepaymentChart'; 
// Import ProgressBar component
import ProgressBar from './components/ProgressBar';  
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import './App.css';
import { useAuth } from './hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

function App() {
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);
  // Progress state
  const [progress, setProgress] = useState(0);
  const [showSignUp, setShowSignUp] = useState(false);
  const { user } = useAuth();
  //Loading state
  const [loading, setLoading] = useState(false);

  const calculateDebt = ({ principal, interestRate, goalMonths, amountPaidOff }) => {
    //Set Loading to true when calculation starts
    setLoading(true);


    const p = parseFloat(principal);
    const r = parseFloat(interestRate) / 100 / 12;
    // Number of months to pay off debt
    const n = parseInt(goalMonths); 
    // Amount already paid off
    const amountPaid = parseFloat(amountPaidOff); 

<<<<<<< HEAD
    // Calculate the remaining balance after subtracting the paid-off amount
    const remainingPrincipal = p - amountPaid;

    // Calculate the monthly payment using the amortization formula
=======
    //Calculate the remaining balance after subtracting the paid-off amount
    const remainingPrincipal = p - amountPaid;

    //Calculate the monthly payment
>>>>>>> maysa
    const monthlyPayment = (remainingPrincipal * r) / (1 - Math.pow(1 + r, -n));

    let remainingBalance = remainingPrincipal;
    const repaymentData = [];
    let month = 0;

    setTimeout(() => {
<<<<<<< HEAD
      // Avoid infinite loops
      while (remainingBalance > 0 && month < n) {  
=======
      while (remainingBalance > 0 && month < n) {  // Avoid infinite loops
>>>>>>> maysa
        const interestForMonth = remainingBalance * r;
        const paymentTowardsPrincipal = monthlyPayment - interestForMonth;
        remainingBalance -= paymentTowardsPrincipal;
        
        // Ensure balance doesn’t go negative
        if (remainingBalance < 0) remainingBalance = 0;
        
        repaymentData.push({
          month: month + 1,
          remainingBalance: remainingBalance.toFixed(2),
          monthlyPayment: monthlyPayment.toFixed(2),
        });
        month++;
      }
      
      setResults({
<<<<<<< HEAD
        monthlyPayment,
=======
        monthlyPayment: monthlyPayment.toFixed(2),
>>>>>>> maysa
        totalInterest: (monthlyPayment * month - remainingPrincipal).toFixed(2),
        repaymentMonths: month,
      });
      
      // Set the chart data
      setChartData(repaymentData);  

      //Calculate the percentage of debt paid off and update progress
      //const paidOffPercentage = ((amountPaidOff / p) * 100).toFixed(2);
      //setProgress(paidOffPercentage);  // Update the progress percentage

      // Calculate the percentage of debt paid off
      //const paidOffPercentage = ((amountPaid / p) * 100).toFixed(2);
      //setProgress(paidOffPercentage);  // Update the progress percentage

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
          <button onClick={handleLogout}>Log Out</button>
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

          {/* Render ProgressBar if the progress value is set */}
          {progress > 0 && (
            <ProgressBar progress={progress} />
            )}

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