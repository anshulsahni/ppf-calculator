const expect = require('chai').expect;

const utils = require('../src/utils');

describe('#Utils', function () {
  describe('#range', function () {
    const range = utils.range;
    it('should return an array containing numbers from 1 to 5', function () {
      const result = range(1,5);
      expect(result).to.be.an('array');
      expect(result).to.deep.equal([1,2,3,4,5]);
    });

    describe('Should return an empty array when:', function () {
      it('no arguments passed', function () {
        const result = range();

      expect(result).to.be.an('array').that.is.empty;

      });

      it('only one argument is passed', function () {
        const result = range(1);

      expect(result).to.be.an('array').that.is.empty;

      });

      it('end > start, i.e first argument is greater than second argument', function () {
        const result = range(10, 1);

        expect(result).to.be.an('array').that.is.empty;

      });
    });
  });

  describe('#filter', function () {
    const filter = utils.filter;

    it('should return an empty array if iterator is passes false for all items', function () {
      const sample = [1,2,3,4,5];
      const result = filter(sample, () => false);

      expect(result).to.be.an('array').that.is.empty;
    });

    it('should return the same array passed as argument', function () {
      const sample = [1,2,3,4,5];
      const result = filter(sample, () => true);

      expect(result).to.be.an('array');
      expect(result).to.deep.equal(sample);
    });

    it('should return array only with those items where iterator returned true', function () {
      const sample = [1,2,3,4,5];
      const result = filter(sample, item => item > 3);

      expect(result).to.be.an('array');
      expect(result).to.deep.equal([4,5]);
    });

    it('should return an empty array when no arguments passed', function () {
      const result = filter();

      expect(result).to.be.an('array').that.is.empty;
    });
  });

  describe('#map', function () {
    const map = utils.map;

    it('should return array with items returned by iterator for resp. items', function () {
      const sample = [1,2,3,4,5];
      const result = map(sample, item => item + 2);

      expect(result).to.be.an('array');
      expect(result).to.deep.equal([3,4,5,6,7]);
    });

    it('should return an array with undefined values for iterator returning nothing', function () {
      const sample = [1,2,3,4,5];
      const result = map(sample, () => {});

      expect(result).to.be.an('array');
      expect(result).to.deep.equal([undefined, undefined, undefined, undefined, undefined]);
    });

    it('should raise an exception for no iterator password', function () {
      const sample = [1,2,3,4,5];
      const result = () => map(sample);
      expect(result).to.throw(TypeError);

    })

    describe('Should return an empty array when:', function () {
      it('an empty array is passed as an argument', function () {
        const result = map([], () => {});

        expect(result).to.be.an('array');
      });

      it('no arguments are passed', function () {
        const result = map();

        expect(result).to.be.an('array').that.is.empty;
      });
    });
  });

  describe('#reduce', function () {
    const reduce = utils.reduce;
    it('should return sum of all numbers given in array', function () {
      const sample = [1,2,3,4,5];

      const result = reduce(sample, (sum, num) => sum + num, 0);
      expect(result).to.be.a('number').that.is.equal(15);
    });

    it('should return initial value if first argument passed is not array', function () {
      const result = reduce({}, () => {}, 0);
      expect(result).to.be.a('number').that.is.equal(0);
    });

    it('should reurn object with all items in array as key/value pair', function () {
      const sample = ['one', 'two', 'three', 'four', 'five'];

      const result = reduce(sample, (newObject, item) => ({
        ...newObject,
        [item]: item,
      }), {});

      expect(result).to.be.an('object').that.is.deep.equal({
        one: 'one',
        two: 'two',
        three: 'three',
        four: 'four',
        five: 'five',
      });
    });

    it('should return undefined if iterator function does not return anything', function () {
      const sample = [1,2,3,4,5];

      const result = reduce(sample, () => {}, 0);
      expect(result).to.be.undefined;
    });
  });

  describe('#mapValues', function () {
    const mapValues = utils.mapValues;

    it('should return object with same keys', function () {
      const sample = { a: 1, b: 2 };
      const result = mapValues(sample, item => item);

      expect(result).to.have.all.keys(sample);
    });

    it('should return object with values mapped to the new values as returned by iterator', function () {
      const sample = {a: 1, b: 2, c: 3, d: 4, e: 5};
      const result = mapValues(sample, item => item * 2);

      expect(result).to.have.all.keys(sample);
      expect(result).to.deep.equal({a: 2, b: 4, c: 6, d: 8, e: 10});
    });

    it('should return an empty object when an empty object is passed as argument', function () {
      const result = mapValues({});

      expect(result).to.be.an('object').that.is.empty;
    });
  });

  describe('#last', function () {
    const last = utils.last;

    it('should return the last elememt in the array of numbers', function () {
      const sample = [1,2,3,4,5];
      const result = last(sample);

      expect(result).to.be.a('number').that.is.equal(5);
    });

    it('should return last element in array of strings', function () {
      const sample = ['one', 'two', 'three', 'four', 'five'];
      const result = last(sample);

      expect(result).to.be.a('string').to.be.equal('five');
    });

    it('should return undefined when an empty array is passed as argument', function () {
      const result = last([]);

      expect(result).to.be.undefined;
    });

    it('should return undefined when no argument is passed', function () {
      const result = last();

      expect(result).to.be.undefined;
    });
  });

  describe('#groupBy', function () {
    const groupBy = utils.groupBy;

    it('should return the objects grouped according to value returned by iterator', function () {
      const sample = [1,2,3,4,5];
      const result = groupBy(sample, num => (num % 2 === 0 ? 'even' : 'odd'));

      expect(result).to.be.an('object').to.be.deep.equal({ even: [2,4], odd: [1,3,5] });
    });


    it('should return the object with single key if iterator returns the same value', function () {
      const sample = [1,2,3,4,5];
      const result = groupBy(sample, () => 'random');

      expect(result).to.be.an('object').to.deep.equal({ random: [1,2,3,4,5] });
    });

    it('should return an object with key as "undefined" if iterator returns nothing', function () {
      const sample = [1,2,3,4,5];
      const result = groupBy(sample, () => {});

      expect(result).to.be.an('object').that.is.deep.equal({ undefined: [1,2,3,4,5] });
    });

    it('should return an empty object if and empty array passed as argument', function () {
      const result = groupBy([]);

      expect(result).to.be.an('object').that.is.empty;
    });
  });

  describe('#addValue', function () {
    const addValue = utils.addValue;
    it('should return sum of specified property and number passed', function () {
      const result = addValue('amount')(400, { amount: 300 });

      expect(result).to.be.a('number').that.is.equal(700);
    });

    it('should return NaN if specified property does not exist in the object', function () {
      const result = addValue('amount')(400, { key: 'value' });

      expect(result).to.be.NaN;
    });

    it('should return NaN if property is not specified', function () {
      const result = addValue()(0, { ke: 'value' });

      expect(result).to.be.NaN;
    });

    it('should throw TypeError if none of the arguments passed', function () {
      const resultingFn = addValue();

      expect(resultingFn).to.throw(TypeError);
    });

    it('should throw TypeError if not object is passed as argument', function () {
      const result = () => addValue('amount')(400);

      expect(result).to.throw(TypeError);
    });
  });

  describe('#IdxToMon', function () {
    const IdxToMon = utils.IdxToMon;

    it('should return value one more than has been passed to it as argument', function () {
      const sample = 3;
      const result = IdxToMon(3);

      expect(result).to.be.a('number').to.be.equal(sample + 1);
    });

    it('should return NaN when no argument is passed to it', function () {
      const result = IdxToMon();

      expect(result).to.be.NaN;
    });
  });

  describe('#MonToIdx', function () {
    const MonToIdx = utils.MonToIdx;

    it('should return value one less that has been passed to it as an argument', function () {
      const sample = 2;
      const result = MonToIdx(sample);

      expect(result).to.be.a('number').that.is.equal(sample - 1);
    });

    it('should return Nan when no argument is passed to it', function () {
      const result = MonToIdx();

      expect(result).to.be.NaN;
    });
  });

  describe('#getLasDayOfMonth', function () {
    const lastDay = utils.getLastDayOfMonth;
    it('should return the last date of the months passed', function () {
      expect(lastDay(1)).to.equal(31);
      expect(lastDay(2)).to.equal(28);
      expect(lastDay(3)).to.equal(31);
      expect(lastDay(4)).to.equal(30);
      expect(lastDay(5)).to.equal(31);
      expect(lastDay(6)).to.equal(30);
      expect(lastDay(7)).to.equal(31);
      expect(lastDay(8)).to.equal(31);
      expect(lastDay(9)).to.equal(30);
      expect(lastDay(10)).to.equal(31);
      expect(lastDay(11)).to.equal(30);
      expect(lastDay(12)).to.equal(31);
    });

    it('should return undfined if no argument is passed', function () {
      const result = lastDay();

      expect(result).to.be.undefined;
    });
  });

  describe('#getFyMonthArr', function () {
    const getFYMonthArr = utils.getFYMonthArr;

    it('shoud return array containing the months numbers respective financial year', function () {
      const result = getFYMonthArr();

      expect(result).to.be.an('array').that.is.deep.equal([4,5,6,7,8,9,10,11,12,1,2,3]);
    });
  });

  describe('#isBtwnAprDec', function () {
    const isBtwnAprDec = utils.isBtwnAprDec;

    it('should return true if month is between 4 (inc.) and 12 (inc.)', function () {
      expect(isBtwnAprDec(7)).to.be.true;
      expect(isBtwnAprDec(4)).to.be.true;
      expect(isBtwnAprDec(12)).to.be.true;
    });

    it('should return false if month is not between 4 and 12', function () {
      expect(isBtwnAprDec(1)).to.be.false;
      expect(isBtwnAprDec(2)).to.be.false;
      expect(isBtwnAprDec(3)).to.be.false;
    });

    it('should return false when no argument is passed', function () {
      expect(isBtwnAprDec()).to.be.false;
    });
  });

  describe('#getCalYear', function () {
    const getCalYear = utils.getCalYear;

    it('should return the same year as passed if month is between 4 and 12 (both incl.)', function () {
      expect(getCalYear(2018, 4)).to.be.a('number').that.is.equal(2018);
      expect(getCalYear(2018, 7)).to.be.a('number').that.is.equal(2018);
      expect(getCalYear(2018, 9)).to.be.a('number').that.is.equal(2018);
      expect(getCalYear(2018, 12)).to.be.a('number').that.is.equal(2018);
    });

    it('should return the subsequent year as passed if month is between 1 and 3 (both incl.)', function () {
      expect(getCalYear(2018, 1)).to.be.a('number').that.is.equal(2019);
      expect(getCalYear(2018, 2)).to.be.a('number').that.is.equal(2019);
      expect(getCalYear(2018, 3)).to.be.a('number').that.is.equal(2019);
    });

    it('should return NaN in no arguments are passed to the function', function () {
      expect(getCalYear()).to.be.NaN;
    });

    it('should return subsequent year as passed if only one argument(no month) is passed', function () {
      expect(getCalYear(2018)).to.be.a('number').that.is.equal(2019);
    });
  });

  describe('#getFYear', function () {
    const getFYear = utils.getFYear;
    // financial year in this project is considered the same if date falls in between 1 Apr and 31 Dec (both inc.)
    // it is considered the previous year if date passed is between 1 Jan and 31 Mar (both inc.)

    it('should return the same year for date between 1 Apr and 31 Dec', function () {
      const sample = new Date(2018, 7 - 1, 20).getTime(); // date is Jul 20, 2018
      const result = getFYear(sample);

      expect(result).to.be.a('number').that.is.equal(2018);
    });

    it('should return the same year for date falling on 1 Apr', function () {
      const sample = new Date(2020, 4 - 1, 1).getTime(); // date is 1 Apr, 2020
      const result = getFYear(sample);

      expect(result).to.be.a('number').that.is.equal(2020);
    });

    it('should return the same year for the date falling 31 Dec', function () {
      const sample = new Date(2006, 12 - 1, 31); // date is 31 Dec, 2006
      const result = getFYear(sample);

      expect(result).to.be.a('number').that.is.equal(2006);
    });

    it('should return the previous year for the date between 1 Jan and 31 Mar', function () {
      const sample = new Date(2029, 2 - 1, 20); //sample date is 20 Feb, 2029
      const result = getFYear(sample);

      expect(result).to.be.a('number').that.is.equal(2028);
    });

    it('should return the previous year for the date falling on 1 Jan', function () {
      const sample = new Date(2021, 1 - 1, 1); // date is 1 Jan, 2021
      const result = getFYear(sample);

      expect(result).to.be.a('number').that.is.equal(2020);
    });

    it('should return the previous year for the date falling on 31 Mar', function () {
      const sample = new Date(2002, 3 - 1, 31).getTime(); //date is 31 Mar, 2002
      const result = getFYear(sample);

      expect(result).to.be.a('number').that.is.equal(2001);
    });

    it('sholud return NaN if no argument is passed', function () {
      expect(getFYear()).to.be.NaN;
    });
  });

  describe('#fyDate', function () {
    const fyDate = utils.fyDate;

    it('should return date with year same as passed in arguments if month is between 4 and 12 (inc.)', function () {
      const sample = { fYear: 2021, month: 9, day: 26 };
      const result = fyDate(sample.fYear, sample.month, sample.day);
      const expected = new Date(2021, 8, 26).getTime();

      expect(result).to.be.a('number').that.is.equal(expected);
    });

    it('should return date with year same as passed in arguments if date is 1 Apr', function () {
      const sample = { fYear: 2010, month: 4, day: 1 };
      const result = fyDate(sample.fYear, sample.month, sample.day);
      const expected = new Date(2010, 3, 1).getTime();

      expect(result).to.be.a('number').that.is.equal(expected);
    });

    it('should return date with year same as passed in arguments if date is 31 Dec', function () {
      const sample = { fYear: 1992, month: 12, day: 31 };
      const result = fyDate(sample.fYear, sample.month, sample.day);
      const expected = new Date(1992, 11, 31).getTime();

      expect(result).to.be.a('number').that.is.equal(expected);
    });

    it('should return date with year subsequent to the one passed as argument if month is betwen 1 and 3 (incl.)', function () {
      const sample = { fYear: 2016, month: 3, day: 12 };
      const result = fyDate(sample.fYear, sample.month, sample.day);
      const expected = new Date(2017, 2, 12).getTime();

      expect(result).to.be.a('number').that.is.equal(expected);
    });

    it('should return date with year subsequent to the one passed as argument if date is 1 Jan', function () {
      const sample = { fYear: 2013, month: 1, day: 1 };
      const result = fyDate(sample.fYear, sample.month, sample.day);
      const expected = new Date(2014, 0, 1).getTime();

      expect(result).to.be.a('number').that.is.equal(expected);
    });

    it('should return date with year subsequent to the one passed as argument if date is 31 Mar', function () {
      const sample = { fYear: 2004, month: 3, day: 31 };
      const result = fyDate(sample.fYear, sample.month, sample.day);
      const expected = new Date(2005, 2, 31).getTime();

      expect(result).to.be.a('number').that.is.equal(expected);
    });
  });

  describe('#calcPercent', function () {
    const calcPercent = utils.calcPercent;

    it('should return the given percentage value of the given value', function () {
      expect(calcPercent(100,10)).to.be.a('number').that.is.equal(10);
      expect(calcPercent(50,50)).to.be.a('number').that.is.equal(25);
      expect(calcPercent(1000,33)).to.be.a('number').that.is.equal(330);
      expect(calcPercent(600, 33)).to.be.a('number').that.is.equal(198);
    });
  });

  describe('#calcInterest', function () {
    const calcInterest = utils.calcInterest;

    it('should return correct percent value of given amount correct upto 2 decmial places', function () {
      expect(calcInterest(33)(10)).to.be.a('number').that.is.equal(3.3);
      expect(calcInterest(7.6)(4712)).to.be.a('number').that.is.equal(358.11);
    });
  });
});