import React, { useState } from 'react';
import DebtInputForm from './components/DebtInputForm';
import DebtResults from './components/DebtResults';
import DebtRepaymentChart from './components/DebtRepaymentChart'; 
import ProgressBar from './components/ProgressBar';  
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
  const [loading, setLoading] = useState(false);

  const calculateDebt = ({ goalMonths }) => {
    setLoading(true);
  
    let totalPrincipal = 0;
    let combinedMonthlyPayment = 0;
    let combinedRepaymentData = [];
    let remainingBalanceSum = 0;
  
    // Iterate through each debt and calculate its monthly payment and repayment plan
    user1.debts.forEach((debt) => {
      const p = parseFloat(debt.amount);
      const r = parseFloat(debt.interestRate) / 100 / 12; // Monthly interest rate
      const n = parseInt(goalMonths);
  
      const monthlyPayment = (p * r) / (1 - Math.pow(1 + r, -n));
      combinedMonthlyPayment += monthlyPayment;
      
      let remainingBalance = p;
      const repaymentData = [];
      let month = 0;
  
      while (remainingBalance > 0 && month < n) {
        const interestForMonth = remainingBalance * r;
        const paymentTowardsPrincipal = monthlyPayment - interestForMonth;
        remainingBalance -= paymentTowardsPrincipal;
  
        if (remainingBalance < 0) remainingBalance = 0;
  
        repaymentData.push({
          month: month + 1,
          remainingBalance: remainingBalance.toFixed(2),
          monthlyPayment: monthlyPayment.toFixed(2),
        });
  
        month++;
      }
  
      // Combine all repayment data into one
      combinedRepaymentData = combinedRepaymentData.concat(repaymentData);
  
      totalPrincipal += p;
      remainingBalanceSum += remainingBalance;
    });
  
    // Update the overall results
    setTimeout(() => {
      setResults({
        monthlyPayment: combinedMonthlyPayment.toFixed(2),
        repaymentMonths: goalMonths,
      });
  
      // Set the combined chart data
      setChartData(combinedRepaymentData);
  
      // Calculate progress as a percentage of the total paid off debt
      const totalPaidOff = totalPrincipal - remainingBalanceSum;
      const paidOffPercentage = ((totalPaidOff / totalPrincipal) * 100).toFixed(2);
      setProgress(paidOffPercentage);
  
      setLoading(false);
    }, 1000); // Simulate a one-second delay
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
          return { ...debt, total: newTotalDebt };
        }
        return debt;
      });

      const newTotalDebt = updatedDebts.reduce((total, debt) => total + debt.total, 0);

      return { ...prevUser, debts: updatedDebts };
    });

    const total = user1.debts.reduce((total, debt) => total + debt.total, 0);
    setTotalDebt(total);
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
            <div className="debt-chart">
              {progress > 0 && <ProgressBar progress={progress} />}
              <div className="chart-container">
                <DebtRepaymentChart data={chartData} />
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
          </div>
          {/* {progress > 0 && <ProgressBar progress={progress} />}
          {chartData.length > 0 && (
            <div className="chart-container">
              <DebtRepaymentChart data={chartData} />
            </div>
          )} */}
        </>
      )}
    </div>
  );
}

export default App;