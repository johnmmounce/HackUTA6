// src/components/DebtInputForm.jsx
import React, { useState } from 'react';

const DebtInputForm = ({ onCalculate }) => {
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [goalMonths, setGoalMonths] = useState('');
  // New input state for amount paid off
  const [amountPaidOff, setAmountPaidOff] = useState(''); 

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate({ principal, interestRate, goalMonths, amountPaidOff });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Total Damage (Debt): </label>
        <input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Damage Rate (%): </label>
        <input
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Damage Cleared: </label>
        <input
          type="number"
          value={amountPaidOff}
          onChange={(e) => setAmountPaidOff(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Damage Free in (Months): </label>
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
