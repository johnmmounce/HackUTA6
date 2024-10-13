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
    <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    }}
  >
    <form class="form" onSubmit={handleSubmit}>
      <span class="input-span">
        <label for="principal" class="label">
          {" "}
          Principal
        </label>
        <input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          required
        />
      </span>
      <span class="input-span">
      <label for="interestRate" class="label">
          {" "}
          Intrest Rate (%)
        </label>
        <input
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          required
        />
      </span>
      <span class="input-span">
      <label for="monthlyPayment" class="label">
          {" "}
          Monthly Payment
        </label>
        <input
          type="number"
          value={goalMonths}
          onChange={(e) => setGoalMonths(e.target.value)}
          required
        />
      </span>
      <button type="submit">What's my damage?</button>
    </form>
    </div>
  );
};

export default DebtInputForm;
