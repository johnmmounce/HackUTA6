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
    let monthlyTotals = Array.from({ length: goalMonths }, () => 0); // Array to store total remaining balances per month
    let remainingBalanceSum = 0;
  
    user1.debts.forEach((debt) => {
      const p = parseFloat(debt.amount);
      const r = parseFloat(debt.interestRate) / 100 / 12; // Monthly interest rate
      const n = parseInt(goalMonths);
  
      if (isNaN(p) || isNaN(r) || isNaN(n)) {
        console.error("Invalid debt data:", debt);
        return;
      }
  
      const monthlyPayment = (p * r) / (1 - Math.pow(1 + r, -n));
      combinedMonthlyPayment += monthlyPayment;
  
      let remainingBalance = p;
      let month = 0;
  
      while (remainingBalance > 0 && month < n) {
        const interestForMonth = remainingBalance * r;
        const paymentTowardsPrincipal = monthlyPayment - interestForMonth;
        remainingBalance -= paymentTowardsPrincipal;
  
        if (remainingBalance < 0) remainingBalance = 0;
  
        // Add the current remaining balance to the corresponding month in the total array
        monthlyTotals[month] += parseFloat(remainingBalance.toFixed(2));
  
        month++;
      }
  
      totalPrincipal += p;
      remainingBalanceSum += remainingBalance;
    });
  
    // Convert monthlyTotals into a format that the chart can use
    const combinedRepaymentData = monthlyTotals.map((total, index) => ({
      month: index + 1,
      remainingBalance: total,
    }));
  
    setTimeout(() => {
      setResults({
        monthlyPayment: combinedMonthlyPayment.toFixed(2),
        repaymentMonths: goalMonths,
      });
  
      setChartData(combinedRepaymentData); // Set the aggregated chart data
  
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

          const amountPaid = totalDebt - newTotalDebt;
          setTotalPaidOff((prevPaidOff) => prevPaidOff + amountPaid);
          
          return { ...debt, total: newTotalDebt };
        }
        return debt;
      });

      const newTotalDebt = updatedDebts.reduce((total, debt) => total + debt.total, 0);
      setTotalDebt(newTotalDebt);
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
            {loading && (
              <div className="popup">
                <div className="popup-content">
                  <p>Calculating your damage...</p>
                </div>
              </div>
            )}

            <div className="debt-list">
              <DebtList debts={user1.debts} />
            </div>

            {progress > 0 && (
              <div className="progress-bar-container">
                <ProgressBar progress={progress} />
              </div>
            )}
            

            <div className="debt-chart">
              {progress > 0 && <ProgressBar progress={progress} />}

              <div className="chart-container">
  {chartData && chartData.length > 0 && (
    <DebtRepaymentChart data={chartData} />
  )}
</div>

            </div>

            <div className="profile-box">
              <div>
                <h3>Total Debt: ${totalDebt.toFixed(2)}</h3>
              </div>
              <DebtInputForm onCalculate={calculateDebt} />
            </div>

            <div className="add-debt-box">
              <AddDebtBox onAddDebt={handleAddDebt} />
            </div>

            <div className="consolidation-box">
              <DebtResults results={results} />
            </div>

            <div className="add-payment-box">
              <ProfileBox user={user} />
            </div>

            {/* Add the Chatbot to the specified location */}
            <div className="chatbot-container">
              <Chatbot />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
