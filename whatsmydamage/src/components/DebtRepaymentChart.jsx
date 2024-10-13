import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DebtRepaymentChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{
          top: 10, right: 30, left: 0, bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="remainingBalance" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="monthlyPayment" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DebtRepaymentChart;
