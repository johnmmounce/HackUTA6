// DebtList.jsx
import React from 'react';
import './DebtList.css'; // Import the CSS file for styles

const DebtList = ({ debts }) => (
    <div>
        <h3>Your Debts</h3>
        <div className="debt-list-container"> {/* Wrapper for scrolling */}
            <ul>
                {debts.map((debt, index) => {
                    const interestAmount = debt.amount * (debt.interestRate / 100);
                    const totalAmount = debt.total || (debt.amount + interestAmount); // Use total if available or calculate
                    return (
                        <li key={index} style={{ marginBottom: '10px' }}>
                            <strong>{debt.name}</strong>
                            <br />
                            <span style={{ marginLeft: '20px' }}>Principal: ${debt.amount.toFixed(2)}</span>
                            <br />
                            <span style={{ marginLeft: '20px' }}>Interest: {debt.interestRate.toFixed(2)}%</span>
                            <br />
                            <span style={{ marginLeft: '20px' }}>Total: ${totalAmount.toFixed(2)}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    </div>
);

export default DebtList;
