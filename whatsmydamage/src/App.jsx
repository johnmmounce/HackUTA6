import React, { useState } from 'react';
import DebtInputForm from './components/DebtInputForm';
import DebtResults from './components/DebtResults';
import DebtRepaymentChart from './components/DebtRepaymentChart'; 
import ProgressBar from './components/ProgressBar';  
import Chatbot from './components/Chatbot'; // Import the Chatbot component
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import Navbar from './components/NavBar';
import './App.css';
import { useAuth } from './hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

import DebtList from './components/DebtList';
import ProfileBox from './components/ProfileBox';
import AddDebtBox from './components/AddDebtBox';
import ConsolidationBox from './components/ConsolidationBox';
import MakePaymentBox from './components/MakePaymentBox';

function App() {
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [showSignUp, setShowSignUp] = useState(false);
  const { user } = useAuth();
  const [user1, setUser1] = useState({ debts: [] });
  const [totalDebt, setTotalDebt] = useState(0); // Initialize total debt
  const [totalPaidOff, setTotalPaidOff] = useState(0);
  const [loading, setLoading] = useState(false);

  const calculateDebt = ({ goalMonths }) => {
    setLoading(true);
  
    let totalPrincipal = 0;
    let combinedMonthlyPayment = 0;
    let combinedRepaymentData = [];
    let remainingBalanceSum = 0;
    let totalInterest = 0;
  
    user1.debts.forEach((debt) => {
      const p = parseFloat(debt.amount);
      const r = parseFloat(debt.interestRate) / 100 / 12; 
      const n = parseInt(goalMonths);
  
      const monthlyPayment = (p * r) / (1 - Math.pow(1 + r, -n));
      combinedMonthlyPayment += monthlyPayment;
      
      let remainingBalance = p;
      const repaymentData = [];
      let month = 0;
      let interestAccrued = 0;
  
      while (remainingBalance > 0 && month < n) {
        const interestForMonth = remainingBalance * r;
        const paymentTowardsPrincipal = monthlyPayment - interestForMonth;
        remainingBalance -= paymentTowardsPrincipal;
  
        if (remainingBalance < 0) remainingBalance = 0;

        //Accumulate interest paid
        interestAccrued += interestForMonth;
  
        repaymentData.push({
          month: month + 1,
          remainingBalance: remainingBalance.toFixed(2),
          monthlyPayment: monthlyPayment.toFixed(2),
        });
  
        month++;
      }
      
      totalInterest += interestAccrued;
      // Combine all repayment data into one
      combinedRepaymentData = combinedRepaymentData.concat(repaymentData);
  
      totalPrincipal += p;
      remainingBalanceSum += remainingBalance;
    });
  
    setTimeout(() => {
      setResults({
        monthlyPayment: combinedMonthlyPayment.toFixed(2),
        repaymentMonths: goalMonths,
        totalInterest: totalInterest.toFixed(2),
      });
  
      setChartData(combinedRepaymentData);
  
      const totalPaidOff = totalPrincipal - remainingBalanceSum;
      const paidOffPercentage = ((totalPaidOff / totalPrincipal) * 100).toFixed(2);
      setProgress(paidOffPercentage);
  
      setLoading(false);
    }, 1000); 
  };
  
  
  
  const handleLogout = () => {
    signOut(auth).then(() => {
      console.log('User logged out');
    }).catch((error) => {
      console.error('Error logging out:', error);
    });
  };

  const handleAddDebt = (newDebt) => {
    if (!newDebt.name || isNaN(newDebt.amount) || isNaN(newDebt.interestRate)) {
      console.error('Invalid debt data:', newDebt);
      return;
    }

    const interestAmount = newDebt.amount * (newDebt.interestRate / 100);
    const updatedDebts = [
      ...user1.debts,
      { ...newDebt, interestAmount },
    ];

    setUser1({ ...user1, debts: updatedDebts });

    const total = updatedDebts.reduce((total, debt) => total + debt.amount + debt.interestAmount, 0);
    setTotalDebt(total); 
  };

  const handleMakePayment = (debtIndex, paymentAmount) => {
  setUser1((prevUser) => {
    if (!prevUser || !prevUser.debts || debtIndex < 0 || debtIndex >= prevUser.debts.length) {
      console.error('Invalid debt selected');
      return prevUser;
    }

    const updatedDebts = prevUser.debts.map((debt, index) => {
      if (index === debtIndex) {
        const interestAmount = debt.amount * (debt.interestRate / 100);
        const totalDebt = debt.amount + interestAmount;
        const newTotalDebt = Math.max(0, totalDebt - paymentAmount);

        // Track how much of the debt has been paid off
        const amountPaid = totalDebt - newTotalDebt;
        setTotalPaidOff((prevPaidOff) => prevPaidOff + amountPaid);  // Update total paid off
        
        return { ...debt, total: newTotalDebt };
      }
      return debt;
    });

    const newTotalDebt = updatedDebts.reduce((total, debt) => total + debt.total, 0);
    setTotalDebt(newTotalDebt);  // Update the total debt left

    // Recalculate progress
    /*if (totalDebt > 0) {
      const newProgress = ((totalPaidOff / totalDebt) * 100).toFixed(2); 
      setProgress(newProgress);  // Update progress percentage
    }*/

    return { ...prevUser, debts: updatedDebts };
  });
};


return (
  <div>
    {!user ? (
      <>
        {showSignUp ? <SignUpForm /> : <LoginForm />}
        <button onClick={() => setShowSignUp(!showSignUp)}>
          {showSignUp ? "Have an account? Log In" : "Don't have an account? Sign Up"}
        </button>
      </>
    ) : (
      <>
        <Navbar username={user.email} onClick={handleLogout} />
        <div className="app-container">
          
          {/* Loading State */}
          {loading && (
            <div className="popup">
              <div className="popup-content">
                <p>Calculating your damage...</p>
              </div>
            </div>
          )}

          {/* Debt List and Form */}
          <div className="debt-list">
            <DebtList debts={user1.debts} />
          </div>

          {/* Progress Bar showing paid-off percentage */}
          {progress > 0 && (
            <div className="progress-bar-container">
              <ProgressBar progress={progress} />
            </div>
          )}

          {/* Debt Repayment Chart */}
          <div className="debt-chart">
            {chartData.length > 0 && (
              <div className="chart-container">
                <DebtRepaymentChart data={chartData} />
              </div>
            )}
          </div>

          {/* Debt Input and Results */}
          <div className="profile-box">
            <div>
              <h3>Total Debt: ${totalDebt.toFixed(2)}</h3>
            </div>
            <DebtInputForm onCalculate={calculateDebt} />
          </div>
          
          {/* Additional Sections */}
          <div className="add-debt-box">
            <AddDebtBox onAddDebt={handleAddDebt} />
          </div>
          <div className="consolidation-box">
            <DebtResults results={results} />
          </div>
          <div className="add-payment-box">
            <ProfileBox user={user} />
          </div>
        </div>
      </>
    )}
  </div>
);
}

export default App;
