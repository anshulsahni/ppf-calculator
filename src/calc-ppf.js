
const _ = require('./utils');
const months = require('./constants');

const APR = months.APR;
const TOTAL_MONTHS = months.TOTAL_MONTHS;


// not considering the transactions before april 5
// for april month fyDate(fYear, month - 1, 5) gives result as april 5, 2019 for fYear 2018
const getEffectiveTransactions = function(
  transactions,
  month,
  fYear,
) {
  return _.filter(transactions, function(transaction) {
    const date = transaction.date;

    // transaction should have happened after the 5 of prev month and before 5 of this month
    // in case of april it should be between 1 and 5 of april
    const isMonthApril = month === APR;
    const fromDate = _.fyDate(fYear, isMonthApril ? month : month - 1, isMonthApril ? 1 : 5);
    const toDate = _.fyDate(fYear, month, 5);
    return fromDate <= date && date < toDate;
  });
};

// gets the rate of interest of the given month from roi table
const getEffectiveRoi = function(roiTable) {
  return function(forDate) {
    for(idx in roiTable) {
      const roiItem = roiTable[idx];
      if (
        (roiItem.from <= forDate) && (forDate <= roiItem.to)
      ) return roiItem.roi;
    }
    return 0;
  }
}

const generatePPfTable = function(transactions, fYear, effectiveRoiOn, prevBal) {
  var effectiveBal = prevBal || 0;
  const addAmount = _.addValue('amount');

  return _.map(_.getFYMonthArr(), function(month) {

    // calculation of last date of month
    const lastDayOfMonth = _.getLastDayOfMonth(month);
    const lastDateOfMonth = _.fyDate(fYear, month, lastDayOfMonth);

    // getting roi for the given month
    const effectiveRoiOfMonth = effectiveRoiOn(lastDateOfMonth);
    const monthlyInterestOn = _.calcInterest(effectiveRoiOfMonth / TOTAL_MONTHS);


    // calculation of effective bal of given month
    // interest is calculated only on effect balance of the month
    effectiveBal = _.reduce(
      getEffectiveTransactions(transactions, month, fYear),
      addAmount,
      effectiveBal,
    );

    const effectiveInterest = monthlyInterestOn(effectiveBal);
    return {
      month: month,
      effectiveBal: effectiveBal,
      effectiveInterest: effectiveInterest,
    };
  });
}

// sums up all the interest amount in a ppf table
const calculateTotalInterestOf = function(ppfTable) {
  const addInterest = _.addValue('effectiveInterest');

  return parseFloat(
    _.reduce(ppfTable, addInterest, 0).toFixed(2)
  );
};


const groupTransactionsByFYear = function(transactions) {
  return _.groupBy(transactions, function(transaction) {
    return _.getFYear(transaction.date);
  });
}

const processTransactions = function(groupedTransactions, roiTable) {
  var startBalance = 0;
  return _.mapValues(groupedTransactions, function(transactions, fYear){
    //
    const effectiveRoiOn = getEffectiveRoi(roiTable);

    //
    const ppfTable = generatePPfTable(transactions, Number(fYear), effectiveRoiOn, startBalance);

    //
    const interestEarned = calculateTotalInterestOf(ppfTable);

    //
    const sumInvested = _.last(ppfTable).effectiveBal;

    //
    startBalance = sumInvested + interestEarned;

    return {
      ppfTable: ppfTable,
      interestEarned: interestEarned,
      sumInvested: sumInvested,
    };
  });
}

/**
 *
 * roi table structure
 * [
 *  {
 *    from: <Start Date (unixTimeStamp)>,
 *    to: <End Date (unixTimeStamp)>,
 *    roi: <Rate Of Interest (Number)>,
 *  }
 * ]
 *
 *     Roi table should include interest rates
 *  for all the months in which given transaction falls
 */
module.exports = function(transactions, roiTable) {
  // grounding transactions according to financial year of their transaction
  const groupedTransactions = groupTransactionsByFYear(transactions);
  return processTransactions(groupedTransactions, roiTable);
};
