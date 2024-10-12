// src/App.jsx
import React, { useState } from 'react';
import DebtInputForm from './components/DebtInputForm';
import DebtResults from './components/DebtResults';
import './App.css';  // Keeping your existing CSS import

function App() {
  const [results, setResults] = useState(null);

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

  return (
    <div className="app-container">
      <h1>Debt Repayment Calculator</h1>
      <DebtInputForm onCalculate={calculateDebt} />
      <DebtResults results={results} />
    </div>
  );
}

export default App;
