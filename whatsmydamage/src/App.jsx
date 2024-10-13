<<<<<<< HEAD
// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


import React, { useState } from 'react';
import DebtList from './components/DebtList';
import DebtChart from './components/DebtChart';
import ProfileBox from './components/ProfileBox';
import AddDebtBox from './components/AddDebtBox';
import ConsolidationBox from './components/ConsolidationBox';
import MakePaymentBox from './components/MakePaymentBox';
import './App.css';


const App = () => {
    const [user, setUser] = useState({
        name: 'John Doe',
        email: 'john@example.com',
        debts: [],
    });
    const [totalDebt, setTotalDebt] = useState(0);

    const handleAddDebt = (newDebt) => {
      // Validate the new debt data
      if (!newDebt.name || isNaN(newDebt.amount) || isNaN(newDebt.interestRate)) {
          console.error('Invalid debt data:', newDebt);
          return;
      }
  
      // Calculate the interest amount
      const interestAmount = newDebt.amount * (newDebt.interestRate / 100);
      const updatedTotalDebt = totalDebt + newDebt.amount + interestAmount;
  
      // Update the debts array and total debt state
      const updatedDebts = [
          ...user.debts,
          { ...newDebt, interestAmount },
      ];
      setUser({ ...user, debts: updatedDebts });
      setTotalDebt(updatedTotalDebt);
  };
  
  

  const handleMakePayment = (debtIndex, paymentAmount) => {
    setUser((prevUser) => {
        // Check if user and debts are valid
        if (!prevUser || !prevUser.debts || debtIndex < 0 || debtIndex >= prevUser.debts.length) {
            console.error('Invalid debt selected');
            return prevUser;
        }

        // Map through debts to update the selected debt
        const updatedDebts = prevUser.debts.map((debt, index) => {
            if (index === debtIndex) {
                const interestAmount = debt.amount * (debt.interestRate / 100);
                const totalDebt = debt.amount + interestAmount; // Calculate total debt based on principal and interest
                const newTotalDebt = Math.max(0, totalDebt - paymentAmount); // Reduce total debt by payment
                return { ...debt, total: newTotalDebt }; // Store new total (without changing principal)
            }
            return debt;
        });

        // Debug statement to check the updated debts
        console.log('Updated Debts:', updatedDebts);

        // Return updated user state
        return { ...prevUser, debts: updatedDebts };
    });
};




    return (
        <div className="app-container">
            <div className="debt-list">
                <DebtList debts={user.debts} />
            </div>
            <div className="debt-chart">
                <DebtChart data={{ labels: user.debts.map(d => d.name), values: user.debts.map(d => d.amount) }} />
            </div>
            <div className="profile-box">
                <ProfileBox user={user} />
            </div>
            <div className="add-debt-box">
                <AddDebtBox onAddDebt={handleAddDebt} />
            </div>
            <div className="consolidation-box">
                <ConsolidationBox totalDebt={totalDebt} />
            </div>
            <div className="add-payment-box">
                <MakePaymentBox debts={user.debts || []} onMakePayment={handleMakePayment} />

            </div>
        </div>
    );
};

export default App;
=======
// src/App.jsx
import React, { useState } from 'react';
import DebtInputForm from './components/DebtInputForm';
import DebtResults from './components/DebtResults';
import DebtRepaymentChart from './components/DebtRepaymentChart'; // Import the chart component
import ProgressBar from './components/ProgressBar';  
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
  const [progress, setProgress] = useState();  // Set a default value for testing
  const [showSignUp, setShowSignUp] = useState(false);
  const { user } = useAuth();
  const name = "Bob"
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

    // Calculate the remaining balance after subtracting the paid-off amount
    const remainingPrincipal = p - amountPaid;

    // Calculate the monthly payment using the amortization formula
    const monthlyPayment = (remainingPrincipal * r) / (1 - Math.pow(1 + r, -n));

    let remainingBalance = remainingPrincipal;
    const repaymentData = [];
    let month = 0;

    setTimeout(() => {
      // Avoid infinite loops
      while (remainingBalance > 0 && month < n) {  
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
        monthlyPayment: monthlyPayment.toFixed(2),
        totalInterest: (monthlyPayment * month - remainingPrincipal).toFixed(2),
        repaymentMonths: month,
      });
      
      setChartData(repaymentData);  // Set the chart data

      // Calculate the percentage of debt paid off
      const paidOffPercentage = ((amountPaid / p) * 100).toFixed(2);
      setProgress(paidOffPercentage);  // Update the progress percentage

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
>>>>>>> b2196c052991d6ac50962c1d7cca413ee08b25c0
