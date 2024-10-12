// src/components/DebtResults.jsx
import React from 'react';

const DebtResults = ({ results }) => {
  if (!results) return null;

  return (
    <div>
      <h3>Debt Repayment Results</h3>
      <p>Monthly Payment: {results.monthlyPayment}</p>
      <p>Total Interest: {results.totalInterest}</p>
      <p>Repayment Duration: {results.repaymentMonths} months</p>
    </div>
  );
};

export default DebtResults;
