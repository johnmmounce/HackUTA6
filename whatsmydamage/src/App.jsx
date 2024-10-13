// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


import React, { useState } from 'react';
import DebtList from './components/DebtList';
import DebtChart from './components/DebtChart';
import ProfileBox from './components/ProfileBox';
import AddDebtBox from './components/AddDebtBox';
import ConsolidationBox from './components/ConsolidationBox';
import MakePaymentBox from './components/MakePaymentBox';
import './App.css';


const App = () => {
    const [user, setUser] = useState({
        name: 'John Doe',
        email: 'john@example.com',
        debts: [],
    });
    const [totalDebt, setTotalDebt] = useState(0);

    const handleAddDebt = (newDebt) => {
      // Validate the new debt data
      if (!newDebt.name || isNaN(newDebt.amount) || isNaN(newDebt.interestRate)) {
          console.error('Invalid debt data:', newDebt);
          return;
      }
  
      // Calculate the interest amount
      const interestAmount = newDebt.amount * (newDebt.interestRate / 100);
      const updatedTotalDebt = totalDebt + newDebt.amount + interestAmount;
  
      // Update the debts array and total debt state
      const updatedDebts = [
          ...user.debts,
          { ...newDebt, interestAmount },
      ];
      setUser({ ...user, debts: updatedDebts });
      setTotalDebt(updatedTotalDebt);
  };
  
  

  const handleMakePayment = (debtIndex, paymentAmount) => {
    setUser((prevUser) => {
        // Check if user and debts are valid
        if (!prevUser || !prevUser.debts || debtIndex < 0 || debtIndex >= prevUser.debts.length) {
            console.error('Invalid debt selected');
            return prevUser;
        }

        // Map through debts to update the selected debt
        const updatedDebts = prevUser.debts.map((debt, index) => {
            if (index === debtIndex) {
                const interestAmount = debt.amount * (debt.interestRate / 100);
                const totalDebt = debt.amount + interestAmount; // Calculate total debt based on principal and interest
                const newTotalDebt = Math.max(0, totalDebt - paymentAmount); // Reduce total debt by payment
                return { ...debt, total: newTotalDebt }; // Store new total (without changing principal)
            }
            return debt;
        });

        // Debug statement to check the updated debts
        console.log('Updated Debts:', updatedDebts);

        // Return updated user state
        return { ...prevUser, debts: updatedDebts };
    });
};




    return (
        <div className="app-container">
            <div className="debt-list">
                <DebtList debts={user.debts} />
            </div>
            <div className="debt-chart">
                <DebtChart data={{ labels: user.debts.map(d => d.name), values: user.debts.map(d => d.amount) }} />
            </div>
            <div className="profile-box">
                <ProfileBox user={user} />
            </div>
            <div className="add-debt-box">
                <AddDebtBox onAddDebt={handleAddDebt} />
            </div>
            <div className="consolidation-box">
                <ConsolidationBox totalDebt={totalDebt} />
            </div>
            <div className="add-payment-box">
                <MakePaymentBox debts={user.debts || []} onMakePayment={handleMakePayment} />

            </div>
        </div>
    );
};

export default App;
