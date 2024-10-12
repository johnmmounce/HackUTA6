// src/components/DebtInputForm.jsx
import React, { useState } from 'react';

const DebtInputForm = ({ onCalculate }) => {
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate({ principal, interestRate, monthlyPayment });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Principal</label>
        <input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Interest Rate (%)</label>
        <input
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Monthly Payment</label>
        <input
          type="number"
          value={monthlyPayment}
          onChange={(e) => setMonthlyPayment(e.target.value)}
          required
        />
      </div>
      <button type="submit">What's my damage?</button>
    </form>
  );
};

export default DebtInputForm;
