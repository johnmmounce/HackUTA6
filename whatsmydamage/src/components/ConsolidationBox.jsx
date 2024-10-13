import React from 'react';
import PropTypes from 'prop-types';

const ConsolidationBox = ({ totalDebt }) => {
    return (
        <div>
            <h3>Total Debt</h3>
            <p>${totalDebt.toFixed(2)}</p>
        </div>
    );
};

ConsolidationBox.propTypes = {
    totalDebt: PropTypes.number.isRequired,
};

export default ConsolidationBox;
