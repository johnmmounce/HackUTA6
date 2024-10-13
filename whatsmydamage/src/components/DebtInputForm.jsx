// src/components/DebtInputForm.jsx
import React, { useState } from 'react';

const DebtInputForm = ({ onCalculate }) => {
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [amountPaidOff, setAmountPaidOff] = useState('');
  const [goalMonths, setGoalMonths] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate({ principal, interestRate, amountPaidOff, goalMonths});
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Total Damage ($) </label>
        <input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Damage rate (%)</label>
        <input
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          required
        />
      </div>
      {/* Add the new input for amount paid off */}
      <div>
        <label>Cleared Damage </label>
        <input
          type="number"
          value={amountPaidOff}
          onChange={(e) => setAmountPaidOff(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Damage Free in (months): </label>
        <input
          type="number"
          value={goalMonths}
          onChange={(e) => setGoalMonths(e.target.value)}
          required
        />
      </div>
      
      <button type="submit">What's my damage?</button>
    </form>
  );
};

export default DebtInputForm;
