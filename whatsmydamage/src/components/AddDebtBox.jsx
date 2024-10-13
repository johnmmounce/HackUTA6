import React, { useState } from 'react';

const AddDebtBox = ({ onAddDebt }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [amountCleared, setAmountCleared] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();

    // Call the parent handler with new debt data
    onAddDebt({
      name,
      amount: parseFloat(amount),
      interestRate: parseFloat(interestRate),
      amountCleared: parseFloat(amountCleared) || 0, // Handle empty input
    });

    // Clear the form fields
    setName('');
    setAmount('');
    setInterestRate('');
    setAmountCleared('');
  };

  return (
    <div>
      <h3>Add New Damage</h3>
      <form className="form" onSubmit={handleAdd}>
        <span className="input-span">
          <label className="label">Damage Name: </label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </span>
        <span className="input-span">
          <label className="label">Damage Amount: </label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </span>
        <span className="input-span">
          <label className="label">Damage Rate (%): </label>
          <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
        </span>
        <span className="input-span">
          <label className="label">Damage Cleared: </label>
          <input type="number" value={amountCleared} onChange={(e) => setAmountCleared(e.target.value)} />
        </span>
        <button type="submit">Add damage</button>
      </form>
    </div>
  );
};

export default AddDebtBox;