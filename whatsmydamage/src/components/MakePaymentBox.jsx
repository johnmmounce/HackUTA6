// MakePaymentBox.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const MakePaymentBox = ({ debts, onMakePayment }) => {
    const [selectedDebtIndex, setSelectedDebtIndex] = useState(0);
    const [paymentAmount, setPaymentAmount] = useState(0);

    const handlePayment = () => {
        if (paymentAmount > 0) {
            onMakePayment(selectedDebtIndex, paymentAmount);
            setPaymentAmount(0); // Reset payment amount after payment
        }
    };

    return (
        <div>
            <h3>Make a Payment</h3>
            <select
                value={selectedDebtIndex}
                onChange={(e) => setSelectedDebtIndex(Number(e.target.value))}
            >
                {debts.map((debt, index) => (
                    <option key={index} value={index}>
                        {debt.name}
                    </option>
                ))}
            </select>
            <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                placeholder="Enter payment amount"
            />
            <button onClick={handlePayment}>Make Payment</button>
        </div>
    );
};

MakePaymentBox.propTypes = {
    debts: PropTypes.array.isRequired,
    onMakePayment: PropTypes.func.isRequired,
};

export default MakePaymentBox;
