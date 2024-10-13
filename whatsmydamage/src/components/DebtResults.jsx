// DebtResults.jsx
import React from 'react';

const DebtResults = ({ results }) => {
  if (!results) return null;

  return (
    <div>
      <h3>Monthly Payment: ${results.monthlyPayment}</h3>
      <h3>Total Interest: ${results.totalInterest}</h3>
      <h3>Repayment Months: {results.repaymentMonths}</h3>
    </div>
  );
};

export default DebtResults;