import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AddDebtBox = ({ onAddDebt }) => {
    const [debtName, setDebtName] = useState('');
    const [debtAmount, setDebtAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!debtName || !debtAmount || !interestRate) return; // Ensure all fields are filled
        onAddDebt({ name: debtName, amount: parseFloat(debtAmount), interestRate: parseFloat(interestRate) });
        setDebtName('');
        setDebtAmount('');
        setInterestRate('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Add Debt</h3>
            <input
                type="text"
                placeholder="Debt Name"
                value={debtName}
                onChange={(e) => setDebtName(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Amount"
                value={debtAmount}
                onChange={(e) => setDebtAmount(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Interest Rate (%)"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                required
            />
            <button type="submit">Add</button>
        </form>
    );
};

AddDebtBox.propTypes = {
    onAddDebt: PropTypes.func.isRequired,
};

export default AddDebtBox;
