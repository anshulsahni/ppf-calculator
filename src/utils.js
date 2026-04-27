const months = require('./constants');

/* Object/Map/Collection related utils */

// work similar to lodash/range
// gives an array of numbers from mentioned start to end with step count 1
const range = function(start, end) {
  var result = [];
  while(start <= end) result = result.concat(start++)
  return result;
};

// functional implementation of Array.filter
// export const filter = (array = [], iterator) => array.filter(iterator);
const filter = function(array, iterator) {
  return Array.isArray(array) ? array.filter(iterator) : [];
};

// functional implementation of Array.map
// export const map = (array = [], iterator) => array.map(iterator);
const map = function(array, iterator) {
  return Array.isArray(array) ? array.map(iterator) : [];
};

// iterates over array and reduces them to single value
const reduce = function(array, aggregator, initalValue) {
  return Array.isArray(array) ? array.reduce(aggregator, initalValue) : initalValue;
};

// maps over the values of the object
const mapValues = function(object, iterator) {
  return reduce(Object.keys(object), function(accumulator, key) {
    return Object.assign(
      accumulator,
      {[key]: iterator(object[key], key)},
    );
  }, {});
};

// returns the last value of array
// for empty array or something other not array like returns undefined
const last = function(array) {
  return Array.isArray(array) ? array[array.length - 1] : undefined;
}

// for a given collection(array);
// it returns the object with items grouped under same key;
// which iterator returned
const groupBy = function(collection, iterator) {
  return reduce(collection, function(accumulator, item) {
    const key = iterator(item);
    return Object.assign({}, accumulator, {
      [key]: (accumulator[key] || []).concat(item),
    });
  }, {});
}

// extracts the value defined `prop` from object and add to sum
// used as accumulator method in `reduce` util
const addValue = function(prop) {
  return function(sum, obj) {
    return sum + obj[prop];
  };
};

/* Date related utils */

// returns month from it's index according to js date api
const IdxToMon = function(mIndex) {
  return mIndex + 1;
}

const MonToIdx = function(month){
  return month - 1;
}

// gives the last date value corresponding to the provided the month
const getLastDayOfMonth = function(month) {
  switch (month) {
    case 2:
      return 28;
    case 1: case 3: case 5: case 7: case 8: case 10: case 12:
      return 31;
    case 4: case 6: case 9: case 11:
      return 30;
    default:
      return undefined;
  }
};

// produces array of month numbers from APR to MAR such as [4,5...12,1...3];
const getFYMonthArr = function() {
  return [].concat(
    range(months.APR, months.DEC),
    range(months.JAN, months.MAR),
  );
};

const isBtwnAprDec = function(month) {
  return (
    (months.APR <= month) && (month <= months.DEC)
  );
}

// gives a calendar year of a combination of month and the financial year(fyear)
const getCalYear = function(fYear, month) {
  // if month is between(incl.) Apr and Dec then cal year is present one
  // else cal year is the subsequent year of the given one
  return (
    isBtwnAprDec(month) ? fYear : (fYear + 1)
  );
}

// gives the financial year (fYear)
const getFYear = function(unixTimeStamp) {
  const date = new Date(unixTimeStamp);
  const month = IdxToMon(date.getMonth());
  const year = date.getFullYear();

  // if month is between apr and dec,
  // then same financial year is same as cal year
  // else financial year is one preceding the cal year
  return (
    isBtwnAprDec(month) ? year : (year - 1)
  );
}

const fyDate = function(fYear, month, day) {
  const calYear = getCalYear(fYear, month);
  return new Date(calYear, MonToIdx(month), day).getTime();
};

/* Financial Utils */

// calculate percentage of value for a given percent
const calcPercent = function(value, percent) {
  return value * percent / 100;
}

// calculates interest for given roi over the amount
const calcInterest = function(roi) {
  return function(amount) {
    return parseFloat(
      calcPercent(amount, roi).toFixed(2)
    );
  }
}

module.exports.range = range;
module.exports.filter = filter;
module.exports.map = map;
module.exports.mapValues = mapValues;
module.exports.reduce = reduce;
module.exports.last = last;
module.exports.groupBy = groupBy;
module.exports.addValue = addValue;
module.exports.IdxToMon = IdxToMon;
module.exports.getLastDayOfMonth = getLastDayOfMonth;
module.exports.getFYMonthArr = getFYMonthArr;
module.exports.getCalYear = getCalYear;
module.exports.getFYear = getFYear;
module.exports.calcInterest = calcInterest;
module.exports.fyDate = fyDate;
module.exports.MonToIdx = MonToIdx;
module.exports.isBtwnAprDec = isBtwnAprDec;
module.exports.calcPercent = calcPercent;
