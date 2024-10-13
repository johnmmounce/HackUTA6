import React from 'react';

const DebtList = ({ debts }) => {
  return (
    <div>
      {debts.map((debt, index) => (
        <div key={index}>
          <h4>Debt {index + 1}: {debt.name}</h4>
          <p>Amount: ${debt.amount}</p>
          <p>Interest Rate: {debt.interestRate}%</p>
        </div>
      ))}
    </div>
  );
};

export default DebtList;
