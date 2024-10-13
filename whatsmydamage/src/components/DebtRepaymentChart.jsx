import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DebtRepaymentChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        {/* Display total remaining balance */}
        <Line type="monotone" dataKey="remainingBalance" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DebtRepaymentChart;