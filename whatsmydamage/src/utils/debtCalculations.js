export const calculateDebt = ({ debts, goalMonths }) => {
  let totalPrincipal = 0;
  let combinedMonthlyPayment = 0;
  let combinedRepaymentData = [];
  let remainingBalanceSum = 0;

  debts.forEach((debt) => {
    const p = parseFloat(debt.amount);
    const r = parseFloat(debt.interestRate) / 100 / 12; // Monthly interest rate
    const n = parseInt(goalMonths);

    const monthlyPayment = (p * r) / (1 - Math.pow(1 + r, -n));
    combinedMonthlyPayment += monthlyPayment;

    let remainingBalance = p;
    const repaymentData = [];
    let month = 0;

    while (remainingBalance > 0 && month < n) {
      const interestForMonth = remainingBalance * r;
      const paymentTowardsPrincipal = monthlyPayment - interestForMonth;
      remainingBalance -= paymentTowardsPrincipal;

      if (remainingBalance < 0) remainingBalance = 0;

      repaymentData.push({
        month: month + 1,
        remainingBalance: remainingBalance.toFixed(2),
        monthlyPayment: monthlyPayment.toFixed(2),
      });

      month++;
    }

    combinedRepaymentData = [...combinedRepaymentData, ...repaymentData];
    totalPrincipal += p;
    remainingBalanceSum += remainingBalance;
  });

  const totalPaidOff = totalPrincipal - remainingBalanceSum;
  const progress = ((totalPaidOff / totalPrincipal) * 100).toFixed(2);

  return {
    results: {
      monthlyPayment: combinedMonthlyPayment.toFixed(2),
      repaymentMonths: goalMonths,
    },
    repaymentData: combinedRepaymentData,
    progress,
  };
};
